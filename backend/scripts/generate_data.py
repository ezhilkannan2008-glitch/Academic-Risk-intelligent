import sqlite3
import os
import random
from datetime import datetime, timedelta

def generate_data():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'app.db')
    schema_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'schema.sql')
    
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    with open(schema_path, 'r') as f:
        cur.executescript(f.read())
    
    # 1. Generate 1000 students
    students = [(f'Student {i}',) for i in range(1, 1001)]
    cur.executemany('INSERT INTO students (name) VALUES (?)', students)
    
    # 2. Generate 10 courses
    course_names = [
        'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems',
        'Computer Networks', 'Machine Learning', 'Artificial Intelligence',
        'Software Engineering', 'Web Development', 'Cybersecurity'
    ]
    courses = [(name,) for name in course_names]
    cur.executemany('INSERT INTO courses (course_name) VALUES (?)', courses)
    
    # Define anomalies
    # Course 1 (Data Structures): Normal
    # Course 2 (Algorithms): Easy Exam (High Avg)
    # Course 3 (Database Systems): Low Variance
    # Course 4 (Operating Systems): Submission Clustering
    # Course 5 (Computer Networks): Performance Spike
    
    scores = []
    submissions = []
    
    base_time = datetime(2023, 10, 1, 12, 0, 0)
    
    for student_id in range(1, 1001):
        for course_id in range(1, 11):
            score = 75
            std_dev = 10
            
            # Submissions
            sub_time = base_time + timedelta(minutes=random.randint(0, 60*24*7)) # Over a week
            
            if course_id == 2: # High Avg
                score = min(100, max(0, random.gauss(90, 5)))
            elif course_id == 3: # Low Variance
                score = min(100, max(0, random.gauss(75, 2)))
            elif course_id == 4: # Submission clustering
                # Many students submit exactly at the deadline
                if random.random() < 0.3:
                    sub_time = base_time + timedelta(days=7, minutes=59)
                else:
                    sub_time = base_time + timedelta(minutes=random.randint(0, 60*24*7))
                score = min(100, max(0, random.gauss(75, 10)))
            elif course_id == 5: # Performance spike
                # Bimodal distribution to simulate a jump
                if random.random() < 0.5:
                    score = min(100, max(0, random.gauss(60, 5)))
                else:
                    score = min(100, max(0, random.gauss(95, 2)))
            else:
                score = min(100, max(0, random.gauss(75, 10)))
                
            scores.append((student_id, course_id, round(score, 2)))
            submissions.append((student_id, course_id, sub_time.strftime('%Y-%m-%d %H:%M:%S')))
            
    cur.executemany('INSERT INTO scores (student_id, course_id, score) VALUES (?, ?, ?)', scores)
    cur.executemany('INSERT INTO submissions (student_id, course_id, timestamp) VALUES (?, ?, ?)', submissions)
    
    conn.commit()
    conn.close()
    print("Data generated successfully.")

if __name__ == '__main__':
    generate_data()
