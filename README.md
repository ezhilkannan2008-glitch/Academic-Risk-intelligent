# Academic Integrity Risk Intelligence System

A full-stack application designed to detect course-level academic integrity risks through statistical analysis and pattern detection.

## Problem Statement
Traditional academic integrity tools focus on individual cheating (e.g., plagiarism, unauthorized collaboration). However, system-level issues often go unnoticed, such as a course having an abnormally easy exam (high average), suspiciously low variance in scores, or submission clustering indicating potential widespread issues. 

## Solution
This system provides educators with risk scores, flags, and explainable insights per course based on statistical analysis of student scores and submission timelines. It uses an analytics engine to flag "Easy Exam", "Low Variance", "Submission Clustering", and "Performance Spikes", summarizing these into a weighted risk score and actionable recommendations.

## Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS + Recharts (for analytics visualization). It features a premium, glassmorphism, dark-mode design.
- **Backend**: Flask API (Blueprints) + Python.
- **Database**: SQLite.
- **Analytics**: Custom statistical models to evaluate course metrics.

## Setup & Run Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### 1. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```
Install the requirements:
```bash
pip install -r requirements.txt
```
Generate the simulated dataset (1000 students, 10 courses with predefined anomalies):
```bash
python scripts/generate_data.py
```
Run the Flask server:
```bash
python run.py
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
The frontend will typically run on `http://localhost:5173`. Open this URL in your browser to view the application.

## Strict adherence
This project intentionally avoids individual cheating detection, focusing strictly on course-level risk analysis.
