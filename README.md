# Academic Risk Prediction & Role-Based Analytics System

This project is an end-to-end **Academic Risk Prediction System** that uses **Machine Learning (XGBoost)** and **Power BI dashboards** to identify academically at-risk students early and support data-driven academic interventions.

The system generates predictions in Python and surfaces insights through three role-based dashboards:

- 🎓 **Admin Dashboard**
- 👩‍🏫 **Teacher Dashboard**
- 🧑‍🎓 **Student Dashboard**

---

## 🎯 Problem Statement

Traditional academic monitoring systems often flag students only after they fail or show severe decline in performance.  
The goal of this project is to **predict at-risk students early** by combining multiple dimensions such as:

- Academic performance  
- Attendance & engagement  
- Financial background  
- Mental health & stress indicators  
- Co-curricular participation

---

## 🧠 Approach

1. **Synthetic Data Generation**
   - Created a realistic synthetic student dataset using **Python** with:
     - `Faker` for realistic demographic and textual fields
     - `NumPy` & `Pandas` for numeric and categorical features
   - Features included: grades, attendance, backlogs, fees, scholarships, stress level, activities, etc.

2. **Data Preprocessing & Feature Engineering**
   - Handled missing values and outliers
   - Encoded categorical variables
   - Engineered features such as:
     - Attendance percentage
     - Backlog count
     - Engagement score (activities, clubs, events)
     - Risk factors based on academics + behaviour

3. **Modeling – XGBoost**
   - Trained an **XGBoost classification model** to predict whether a student is **At Risk** or **Safe**.
   - Evaluated using accuracy, precision, recall, and confusion matrix.
   - Tuned hyperparameters to improve generalization.

4. **Power BI Dashboards**
   - Exported model outputs and enriched student data to **Power BI**.
   - Designed three role-based dashboards:
     - **Admin:** holistic view of total students, fees, scholarships, backlog %, attendance trends, at-risk distribution by course & year.
     - **Teacher:** student performance, marks vs attendance, stress levels, assignment submissions, disciplinary cases, and at-risk status.
     - **Student:** personal analytics such as attendance, marks, mental health score, activities, and feedback to encourage self-awareness.

---

## 📊 Key Features

- Early prediction of **at-risk students** using ML.
- Role-based dashboards for:
  - **Admin:** policy & resource planning
  - **Teacher:** class-level and student-level intervention
  - **Student:** self-monitoring and engagement
- Visual insights into:
  - Attendance & marks trends
  - Gender & category distribution
  - Income & scholarship distribution
  - Engagement and mental health indicators

---

## 🛠 Tech Stack

- **Programming & ML:** Python, Pandas, NumPy, XGBoost
- **Visualization:** Power BI
- **Data Generation:** Faker (synthetic data)
- **Other Tools:** Jupyter Notebook

---

## 📂 Repository Structure

```text
academic-risk-prediction-system/
├── data/                         # Synthetic dataset (or sample)
├── notebooks/                    # Model building & analysis
├── dashboards/                   # Admin, Teacher, Student PBIX files
├── screenshots/                  # Dashboard images
├── requirements.txt              # Python dependencies (optional)
└── README.md                     # Project documentation
```

---

## 🚀 Phase 2: Web-Based Academic Risk Intelligence Dashboard

To complement the ML and Power BI analytics, we have expanded the project into a **Full-Stack Web Application** designed for real-time, course-level risk analysis and interactive data management.

### ✨ New Web Features
- **Modern Left-Sidebar Dashboard**: Built with a sleek, ChatGPT-inspired collapsible vertical sidebar and a premium glassmorphism UI.
- **Real-Time Analytics Engine**: Dynamically calculates standard deviations, averages, and flags course-level anomalies (e.g., "Lenient Evaluation", "High Risk").
- **Unique Alert Badges**: Custom-designed circular alert badges that pop out exclusively for "High Risk" courses.
- **Secure Authentication**: Flask-backed role-based login system to protect administrative tools.
- **Bulk Data Management**: An Excel-like modal interface for teachers to quickly insert MCQ, Assignment, and Slip Test marks.
- **CSV Data Export**: One-click "Download Report ⬇️" functionality allowing admins to instantly export calculated course metrics to Excel/CSV.

### 💻 Web Tech Stack
- **Frontend**: React (Vite), Vanilla CSS, Recharts
- **Backend**: Flask (Python)
- **Database**: SQLite (`app.db`)

### 📂 Web Application Structure

```text
academic-integrity-risk/
├── frontend/                     # React + Vite application
│   ├── src/components/           # Sidebar, CourseCards, Modals, Charts
│   ├── src/pages/                # Dashboard, CourseDetail, Login, Signup
│   └── src/styles.css            # Premium UI styling
└── backend/                      # Flask API
    ├── app/routes/               # Auth, Course, Notification APIs
    ├── app/services/             # Real-time Analytics algorithms
    └── app.db                    # SQLite Database
```
