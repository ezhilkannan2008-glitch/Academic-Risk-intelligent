from flask import Blueprint, jsonify
from app.models.db import query_db
from app.services.analytics_service import get_course_analytics
from app.services.risk_service import get_all_risk_analysis

bp = Blueprint('courses', __name__)

@bp.route('/courses', methods=['GET'])
def get_courses():
    courses = query_db("SELECT id, course_name FROM courses")
    return jsonify([dict(row) for row in courses])

@bp.route('/course/<int:id>', methods=['GET'])
def get_course_detail(id):
    course = query_db("SELECT id, course_name FROM courses WHERE id = ?", (id,), one=True)
    if not course:
        return jsonify({"error": "Course not found"}), 404
        
    analytics = get_course_analytics(id)
    all_risks = get_all_risk_analysis()
    risk_info = next((r for r in all_risks if r['course_id'] == id), None)
    
    # Submissions timeline
    submissions = query_db("SELECT timestamp FROM submissions WHERE course_id = ?", (id,))
    
    # Bins for histogram
    bins = [0] * 10
    if analytics:
        for s in analytics['scores_distribution']:
            bin_idx = min(9, int(s // 10))
            bins[bin_idx] += 1
            
    recommendations = []
    if risk_info:
        if "Easy course" in risk_info['flags']:
            recommendations.append("Increase exam difficulty to prevent overly easy scoring.")
        if "Difficult course" in risk_info['flags']:
            recommendations.append("Review course material and assessments as they may be too difficult.")
        if "Inconsistent grading" in risk_info['flags']:
            recommendations.append("Standardize grading rubrics to reduce high variance and inconsistency.")
        if "Lenient evaluation" in risk_info['flags']:
            recommendations.append("Investigate potential lenient evaluation; ensure strict marking guidelines.")
            
    if not recommendations:
        recommendations.append("Maintain current assessment strategies.")
    
    return jsonify({
        "course_id": course['id'],
        "course_name": course['course_name'],
        "analytics": {
            "avg_score": analytics['avg_score'] if analytics else 0,
            "std_dev": analytics['std_dev'] if analytics else 0,
            "avg_score_change": analytics['avg_score_change'] if analytics else 0,
            "std_dev_change": analytics['std_dev_change'] if analytics else 0,
            "score_histogram": bins
        },
        "risk": risk_info,
        "recommendations": recommendations,
        "timeline_data": [{"timestamp": r['timestamp']} for r in submissions]
    })

from flask import request

@bp.route('/marks', methods=['POST'])
def add_marks():
    data = request.json
    student_name = data.get('student_name')
    course_id = data.get('course_id')
    mcq_mark = float(data.get('mcq_mark', 0))
    assignment_mark = float(data.get('assignment_mark', 0))
    sliptest_mark = float(data.get('sliptest_mark', 0))
    
    if not student_name or not course_id:
        return jsonify({"error": "student_name and course_id are required"}), 400
        
    db = __import__('app').models.db.get_db()
    
    # Check if student exists or create
    student = db.execute("SELECT id FROM students WHERE name = ?", (student_name,)).fetchone()
    if student:
        student_id = student['id']
    else:
        cursor = db.execute("INSERT INTO students (name) VALUES (?)", (student_name,))
        student_id = cursor.lastrowid
        
    score = (mcq_mark + assignment_mark + sliptest_mark) / 3.0
    
    try:
        db.execute("""
            INSERT OR REPLACE INTO scores (student_id, course_id, mcq_mark, assignment_mark, sliptest_mark, score)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (student_id, course_id, mcq_mark, assignment_mark, sliptest_mark, score))
        
        db.execute("""
            INSERT INTO submissions (student_id, course_id) VALUES (?, ?)
        """, (student_id, course_id))
        
        db.commit()
        return jsonify({"message": "Marks added successfully", "score": score}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

import csv
import io
from flask import Response

@bp.route('/course/<int:id>/export', methods=['GET'])
def export_course_data(id):
    # Verify course exists
    course = query_db("SELECT course_name FROM courses WHERE id = ?", (id,), one=True)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    # Query all students and their scores for this course
    query = """
        SELECT s.id, s.name, sc.mcq_mark, sc.assignment_mark, sc.sliptest_mark, sc.score
        FROM students s
        JOIN scores sc ON s.id = sc.student_id
        WHERE sc.course_id = ?
        ORDER BY s.id ASC
    """
    results = query_db(query, (id,))

    # Build CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header row
    writer.writerow(['Student ID', 'Student Name', 'MCQ Mark', 'Assignment Mark', 'Test Mark', 'Final Score'])
    
    # Data rows
    for row in results:
        writer.writerow([
            row['id'], 
            row['name'], 
            round(row['mcq_mark'], 2), 
            round(row['assignment_mark'], 2), 
            round(row['sliptest_mark'], 2), 
            round(row['score'], 2)
        ])

    csv_data = output.getvalue()
    
    # Create response
    course_name_safe = "".join([c if c.isalnum() else "_" for c in course['course_name']])
    filename = f"{course_name_safe}_report.csv"
    
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment;filename={filename}"}
    )

