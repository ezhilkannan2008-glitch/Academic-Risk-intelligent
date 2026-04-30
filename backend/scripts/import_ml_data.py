import sqlite3
import csv
import os

def import_ml_data():
    db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'app.db')
    
    # Paths to CSV files
    base_dir = r'c:\Users\ezhil\OneDrive\Desktop'
    synthetic_path = os.path.join(base_dir, 'data', 'synthetic_student_data.csv')
    predictions_path = os.path.join(base_dir, 'notebook', 'at_risk_predictions.csv')
    suggestions_path = os.path.join(base_dir, 'notebook', 'at_risk_suggestions.csv')
    
    if not os.path.exists(synthetic_path) or not os.path.exists(predictions_path):
        print("Error: Required CSV files missing.")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Reset table for clean import
    cur.execute('DROP TABLE IF EXISTS student_analytics')
    
    # Ensure table exists
    cur.execute('''
    CREATE TABLE student_analytics (
        student_id INTEGER PRIMARY KEY,
        name TEXT,
        year TEXT,
        semester INTEGER,
        gender TEXT,
        age INTEGER,
        caste TEXT,
        family_income REAL,
        internal_marks REAL,
        theory_marks REAL,
        practical_marks REAL,
        backlogs INTEGER,
        fees_paid REAL,
        scholarship_received TEXT,
        teacher_rating REAL,
        library_usage REAL,
        disciplinary_action TEXT,
        attendance_pct REAL,
        submission_rate REAL,
        participation REAL,
        late_submissions INTEGER,
        lms_login_count INTEGER,
        video_watched INTEGER,
        forum_participation INTEGER,
        study_hours REAL,
        stress_level TEXT,
        mental_health_score REAL,
        clubs_joined INTEGER,
        events_participation INTEGER,
        total_marks REAL,
        actual_risk INTEGER,
        predicted_risk INTEGER,
        suggestion TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id)
    )
    ''')

    cur.execute('DELETE FROM student_analytics')
    
    # 1. Load Raw Metrics from synthetic_student_data.csv
    with open(synthetic_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            student_id = i + 1
            cur.execute('INSERT OR IGNORE INTO students (id, name) VALUES (?, ?)', (student_id, row['Name']))
            
            total_marks = float(row['Internal Marks']) + float(row['Theory Marks']) + float(row['Practical Marks'])
            
            cur.execute('''
                INSERT INTO student_analytics (
                    student_id, name, year, semester, gender, age, caste, family_income,
                    internal_marks, theory_marks, practical_marks, backlogs,
                    fees_paid, scholarship_received, teacher_rating, library_usage,
                    disciplinary_action, attendance_pct, submission_rate, participation,
                    late_submissions, lms_login_count, video_watched, forum_participation,
                    study_hours, stress_level, mental_health_score, clubs_joined,
                    events_participation, total_marks
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                student_id, row['Name'], row['Year'], int(row['Semester']), row['Gender'], int(row['Age']),
                row['Caste'], float(row['Family Income']), float(row['Internal Marks']),
                float(row['Theory Marks']), float(row['Practical Marks']), int(row['Backlogs']),
                float(row['Fees Paid']), row['Scholarship Received'], float(row['Teacher Rating']),
                float(row['Library Usage']), row['Disciplinary Action'], float(row['Attendance %']),
                float(row['Assignment Submission Rate']), float(row['Class Participation']),
                int(row['Late Submissions']), int(row['LMS Login Count']), int(row['Video Lectures Watched']),
                int(row['Forum Participation']), float(row['Study Hours/Week']), row['Stress Level'],
                float(row['Mental Health Score']), int(row['Clubs Joined']), int(row['Events Participation']),
                total_marks
            ))

    # 2. Load ML Predictions (Mapping by row index)
    with open(predictions_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            student_id = i + 1
            cur.execute('''
                UPDATE student_analytics SET 
                actual_risk = ?, predicted_risk = ? 
                WHERE student_id = ?
            ''', (int(float(row['Actual'])), int(float(row['Predicted'])), student_id))

    # 3. Load Suggestions
    if os.path.exists(suggestions_path):
        with open(suggestions_path, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            for i, row in enumerate(reader):
                student_id = i + 1
                if len(row) > 0:
                    cur.execute('UPDATE student_analytics SET suggestion = ? WHERE student_id = ?', (row[-1], student_id))

    conn.commit()
    conn.close()
    print("Data imported successfully (Raw metrics + ML flags).")

if __name__ == '__main__':
    import_ml_data()
