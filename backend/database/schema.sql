DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS notifications;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL
);

CREATE TABLE scores (
    student_id INTEGER,
    course_id INTEGER,
    mcq_mark REAL,
    assignment_mark REAL,
    sliptest_mark REAL,
    score REAL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    PRIMARY KEY (student_id, course_id)
);
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    course_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE student_analytics (
    student_id INTEGER PRIMARY KEY,
    year INTEGER,
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
    scholarship_received REAL,
    teacher_rating REAL,
    library_usage REAL,
    disciplinary_action INTEGER,
    attendance_pct REAL,
    submission_rate REAL,
    participation REAL,
    late_submissions INTEGER,
    lms_login_count INTEGER,
    video_watched INTEGER,
    forum_participation INTEGER,
    study_hours REAL,
    stress_level INTEGER,
    mental_health_score REAL,
    clubs_joined INTEGER,
    events_participation INTEGER,
    total_marks REAL,
    actual_risk INTEGER,
    predicted_risk INTEGER,
    suggestion TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('warning', 'alert', 'reminder', 'info')),
    role TEXT NOT NULL CHECK(role IN ('student', 'faculty', 'admin')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    course_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);
