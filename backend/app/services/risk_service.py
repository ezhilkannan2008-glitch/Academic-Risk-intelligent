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
        
        if "Easy course" in flags:
            risk_score += 30
            explanation_parts.append("High average marks (> 85) indicating an easy course.")
        if "Difficult course" in flags:
            risk_score += 20
            explanation_parts.append("Low average marks (< 50) indicating a difficult course.")
        if "Inconsistent grading" in flags:
            risk_score += 40
            explanation_parts.append("High standard deviation (> 20) indicating inconsistent grading.")
        if "Lenient evaluation" in flags:
            risk_score += 30
            explanation_parts.append("High number of toppers (> 5 students > 90) indicating lenient evaluation.")
            
        if risk_score >= 60:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"
            
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
