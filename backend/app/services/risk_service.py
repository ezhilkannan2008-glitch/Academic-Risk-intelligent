from app.services.analytics_service import get_course_analytics
from app.models.db import query_db

def get_all_risk_analysis():
    courses = query_db("SELECT id, course_name FROM courses")
    risk_data = []
    
    for course in courses:
        analytics = get_course_analytics(course['id'])
        if not analytics:
            continue
            
        risk_score = 0
        explanation_parts = []
        
        flags = analytics['flags']
        
        if "Easy Exam" in flags:
            risk_score += 30
            explanation_parts.append("High average score indicates potentially compromised or overly easy assessment.")
        if "Low Variance" in flags:
            risk_score += 30
            explanation_parts.append("Low score variance suggests lack of distinct performance evaluation.")
        if "Submission Clustering" in flags:
            risk_score += 20
            explanation_parts.append(f"Suspicious submission clustering ({analytics['max_submissions_in_minute']} submissions in one minute).")
        if "Performance Spike" in flags:
            risk_score += 20
            explanation_parts.append("Sudden jump in score distribution detected.")
            
        if risk_score <= 30:
            risk_level = "Low"
        elif risk_score <= 70:
            risk_level = "Medium"
        else:
            risk_level = "High"
            
        explanation = " ".join(explanation_parts) if explanation_parts else "Score distribution and submission patterns are normal."
        
        risk_data.append({
            "course_id": course['id'],
            "course_name": course['course_name'],
            "risk_score": risk_score,
            "risk_level": risk_level,
            "flags": flags,
            "explanation": explanation
        })
        
    return risk_data
