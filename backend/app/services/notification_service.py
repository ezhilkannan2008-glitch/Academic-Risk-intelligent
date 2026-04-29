from app.models.db import query_db, get_db
from app.services.analytics_service import get_course_analytics

def _calculate_risk(flags):
    """Inline risk score calculation matching risk_service logic."""
    score = 0
    if "Easy course" in flags:      score += 30
    if "Difficult course" in flags: score += 20
    if "Inconsistent grading" in flags: score += 40
    if "Lenient evaluation" in flags:   score += 30
    if score >= 60:   level = "High"
    elif score >= 30: level = "Medium"
    else:             level = "Low"
    return {'score': score, 'level': level}

def generate_notifications():
    """Auto-generate notifications based on current course risk data."""
    db = get_db()
    courses = query_db("SELECT id, course_name FROM courses")
    
    # Clear old auto-generated notifications before regenerating
    db.execute("DELETE FROM notifications")
    db.commit()
    
    notifications = []
    
    for course in courses:
        course_id = course['id']
        course_name = course['course_name']
        analytics = get_course_analytics(course_id)
        
        if not analytics:
            continue
        
        risk = _calculate_risk(analytics['flags'])
        risk_score = risk['score']
        flags = analytics['flags']
        avg = analytics['avg_score']
        std = analytics['std_dev']

        # --- ADMIN ALERTS ---
        if risk_score > 70:
            notifications.append({
                'type': 'alert',
                'role': 'admin',
                'title': f'🔴 High Risk Course Detected: {course_name}',
                'message': f'Course "{course_name}" has a risk score of {risk_score}/100, exceeding the critical threshold of 70. Immediate review is recommended.',
                'course_id': course_id
            })

        if 'Inconsistent grading' in flags:
            notifications.append({
                'type': 'alert',
                'role': 'admin',
                'title': f'⚠️ Grading Inconsistency: {course_name}',
                'message': f'High standard deviation ({std:.1f}) detected in "{course_name}". This suggests inconsistent grading patterns that may affect academic integrity.',
                'course_id': course_id
            })

        if 'Lenient evaluation' in flags:
            notifications.append({
                'type': 'warning',
                'role': 'admin',
                'title': f'🟡 Lenient Evaluation Flagged: {course_name}',
                'message': f'An unusually high number of top scorers (>90) were detected in "{course_name}". This may indicate lenient grading or evaluation bias.',
                'course_id': course_id
            })

        # --- FACULTY ALERTS ---
        if 'Easy course' in flags:
            notifications.append({
                'type': 'warning',
                'role': 'faculty',
                'title': f'📈 High Average Score: {course_name}',
                'message': f'The average score in "{course_name}" is {avg:.1f}/100, which may indicate the assessment is too easy. Consider increasing difficulty.',
                'course_id': course_id
            })

        if 'Difficult course' in flags:
            notifications.append({
                'type': 'reminder',
                'role': 'faculty',
                'title': f'📉 Low Average Score: {course_name}',
                'message': f'The average score in "{course_name}" is only {avg:.1f}/100. Students may need additional support or the curriculum may need revision.',
                'course_id': course_id
            })

        if risk_score > 50:
            notifications.append({
                'type': 'alert',
                'role': 'faculty',
                'title': f'⚡ Risk Alert for Course: {course_name}',
                'message': f'"{course_name}" has been flagged with a risk level of {risk["level"]} (score: {risk_score}). Detected issues: {", ".join(flags) if flags else "None"}.',
                'course_id': course_id
            })



    # Bulk insert
    for n in notifications:
        db.execute(
            "INSERT INTO notifications (type, role, title, message, course_id) VALUES (?, ?, ?, ?, ?)",
            (n['type'], n['role'], n['title'], n['message'], n['course_id'])
        )
    db.commit()
    
    return len(notifications)


def get_notifications(role=None):
    """Fetch notifications, optionally filtered by role."""
    if role:
        rows = query_db(
            "SELECT * FROM notifications WHERE role = ? ORDER BY created_at DESC",
            (role,)
        )
    else:
        rows = query_db("SELECT * FROM notifications ORDER BY created_at DESC")
    return [dict(row) for row in rows]


def mark_as_read(notification_id):
    db = get_db()
    db.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", (notification_id,))
    db.commit()


def mark_all_read(role=None):
    db = get_db()
    if role:
        db.execute("UPDATE notifications SET is_read = 1 WHERE role = ?", (role,))
    else:
        db.execute("UPDATE notifications SET is_read = 1")
    db.commit()


def get_unread_count(role=None):
    if role:
        row = query_db(
            "SELECT COUNT(*) as cnt FROM notifications WHERE is_read = 0 AND role = ?",
            (role,), one=True
        )
    else:
        row = query_db(
            "SELECT COUNT(*) as cnt FROM notifications WHERE is_read = 0",
            one=True
        )
    return row['cnt'] if row else 0
