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
        if "Easy Exam" in risk_info['flags']:
            recommendations.append("Increase exam difficulty.")
        if "Low Variance" in risk_info['flags'] or "Performance Spike" in risk_info['flags']:
            recommendations.append("Review grading rubric and introduce question randomization.")
        if "Submission Clustering" in risk_info['flags']:
            recommendations.append("Implement staggered submission deadlines.")
            
    if not recommendations:
        recommendations.append("Maintain current assessment strategies.")
    
    return jsonify({
        "course_id": course['id'],
        "course_name": course['course_name'],
        "analytics": {
            "avg_score": analytics['avg_score'] if analytics else 0,
            "std_dev": analytics['std_dev'] if analytics else 0,
            "score_histogram": bins
        },
        "risk": risk_info,
        "recommendations": recommendations,
        "timeline_data": [{"timestamp": r['timestamp']} for r in submissions]
    })
