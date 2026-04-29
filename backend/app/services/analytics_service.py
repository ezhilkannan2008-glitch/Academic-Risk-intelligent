from app.models.db import query_db

def get_course_analytics(course_id):
    scores = query_db("SELECT score FROM scores WHERE course_id = ?", (course_id,))
    submissions = query_db("SELECT timestamp FROM submissions WHERE course_id = ?", (course_id,))
    
    if not scores:
        return None
        
    scores_list = [row['score'] for row in scores]
    
    avg_score = sum(scores_list) / len(scores_list)
    variance = sum((x - avg_score) ** 2 for x in scores_list) / len(scores_list)
    std_dev = variance ** 0.5
    
    # Flags
    flags = []
    
    if avg_score > 85:
        flags.append("Easy Exam")
        
    if std_dev < 5:
        flags.append("Low Variance")
        
    # Submission clustering: count per minute
    from collections import Counter
    from datetime import datetime
    
    timestamps = [datetime.strptime(row['timestamp'], '%Y-%m-%d %H:%M:%S') for row in submissions]
    minute_counts = Counter([t.strftime('%Y-%m-%d %H:%M') for t in timestamps])
    
    max_submissions_in_minute = max(minute_counts.values()) if minute_counts else 0
    # Let's say > 200 submissions in a minute for 1000 students is a cluster
    if max_submissions_in_minute > 200:
        flags.append("Submission Clustering")
        
    # Performance spike: Bimodal distribution check or sudden jump
    # Simplistic bimodal check: high std dev could be it, or gap between two clusters
    # Or just check if there's a big gap in sorted scores
    sorted_scores = sorted(scores_list)
    spike_detected = False
    for i in range(len(sorted_scores) - 1):
        if sorted_scores[i+1] - sorted_scores[i] > 20: # 20 point jump
            spike_detected = True
            break
            
    if spike_detected:
        flags.append("Performance Spike")
        
    return {
        "avg_score": round(avg_score, 2),
        "std_dev": round(std_dev, 2),
        "flags": flags,
        "max_submissions_in_minute": max_submissions_in_minute,
        "scores_distribution": sorted_scores
    }
