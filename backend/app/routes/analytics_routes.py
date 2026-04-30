from flask import Blueprint, jsonify
from app.models.db import query_db

bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@bp.route('/admin', methods=['GET'])
def get_admin_analytics():
    try:
        # Financials
        financials = query_db("SELECT SUM(fees_paid) as total_fees, SUM(scholarship_received) as total_scholarships FROM student_analytics", one=True)
        
        # Risk Distribution (Predicted)
        # 0 = Safe, 1 = At Risk
        risk_counts = query_db("SELECT predicted_risk, COUNT(*) as count FROM student_analytics GROUP BY predicted_risk")
        
        # Attendance Trend (Mocked from actual data spread)
        attendance_trend = [
            {"month": "Aug", "avgAttendance": 92},
            {"month": "Sep", "avgAttendance": 88},
            {"month": "Oct", "avgAttendance": 85},
            {"month": "Nov", "avgAttendance": 80},
            {"month": "Dec", "avgAttendance": 78}
        ]
        
        return jsonify({
            "total_students": query_db("SELECT COUNT(*) as count FROM students", one=True)['count'],
            "total_fees": financials['total_fees'] or 0,
            "total_scholarships": financials['total_scholarships'] or 0,
            "risk_distribution": [
                {"name": "Safe", "count": next((r['count'] for r in risk_counts if r['predicted_risk'] == 0), 0)},
                {"name": "At Risk", "count": next((r['count'] for r in risk_counts if r['predicted_risk'] == 1), 0)}
            ],
            "attendance_trend": attendance_trend
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/teacher', methods=['GET'])
def get_teacher_analytics():
    try:
        # Scatter Plot Data: Attendance vs Marks (Normalized to 100%)
        # Based on data inspection, max marks around 150
        scatter = query_db("SELECT attendance_pct as attendance, (total_marks/150.0)*100 as marks FROM student_analytics LIMIT 150")
        
        # Stress Levels
        stress = query_db("SELECT stress_level, COUNT(*) as count FROM student_analytics GROUP BY stress_level")
        
        return jsonify({
            "scatter_data": [{"attendance": r['attendance'], "marks": r['marks']} for r in scatter],
            "stress_distribution": [
                {"level": "Low", "students": next((r['count'] for r in stress if r['stress_level'] == 'Low'), 0)},
                {"level": "Medium", "students": next((r['count'] for r in stress if r['stress_level'] == 'Medium'), 0)},
                {"level": "High", "students": next((r['count'] for r in stress if r['stress_level'] == 'High'), 0)}
            ]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/student/<int:student_id>', methods=['GET'])
def get_student_profile(student_id):
    try:
        profile = query_db("SELECT * FROM student_analytics WHERE student_id = ?", (student_id,), one=True)
        if not profile:
            return jsonify({"error": "Student not found"}), 404
            
        return jsonify(dict(profile))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
