import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os

def generate_sample_data(file_name="sample_marks.csv"):
    """Generates a sample CSV file with academic data for testing."""
    if os.path.exists(file_name):
        print(f"Using existing data file: {file_name}")
        return

    print(f"Creating sample data file: {file_name}")
    np.random.seed(42)  # For reproducibility

    # Generate data for three different scenarios
    courses = []
    student_ids = []
    marks = []

    # 1. Math 101 - Easy & Lenient (High Avg, High Toppers)
    courses.extend(['Math 101'] * 30)
    student_ids.extend(range(1, 31))
    math_marks = np.random.normal(88, 5, 30)
    marks.extend(math_marks)

    # 2. Physics 201 - Difficult (Low Avg)
    courses.extend(['Physics 201'] * 30)
    student_ids.extend(range(31, 61))
    physics_marks = np.random.normal(45, 10, 30)
    marks.extend(physics_marks)

    # 3. Literature 301 - Inconsistent (High Std Dev)
    courses.extend(['Literature 301'] * 30)
    student_ids.extend(range(61, 91))
    lit_marks = np.random.normal(70, 25, 30)
    marks.extend(lit_marks)
    
    # 4. History 101 - Normal course (Low risk)
    courses.extend(['History 101'] * 30)
    student_ids.extend(range(91, 121))
    hist_marks = np.random.normal(70, 10, 30)
    marks.extend(hist_marks)

    # Clip marks to be strictly between 0 and 100
    marks = np.clip(marks, 0, 100)

    df = pd.DataFrame({
        'Course': courses,
        'Student_ID': student_ids,
        'Marks': marks
    })

    df.to_csv(file_name, index=False)
    print("Sample data generation complete.\n")


def analyze_academic_risk(csv_file_path):
    """Analyzes the academic data and identifies potential integrity risks."""
    print("--- Academic Integrity Risk Intelligence System ---")
    print(f"Loading data from {csv_file_path}...\n")
    
    try:
        df = pd.read_csv(csv_file_path)
    except FileNotFoundError:
        print(f"Error: The file '{csv_file_path}' was not found.")
        return
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return

    # Validate required columns
    required_cols = ['Course', 'Student_ID', 'Marks']
    if not all(col in df.columns for col in required_cols):
        print(f"Error: CSV must contain the following columns: {', '.join(required_cols)}")
        return

    # Define thresholds
    THRESHOLDS = {
        'high_avg': 85,
        'low_avg': 50,
        'high_std': 20,
        'toppers_count': 5,
        'topper_score': 90
    }

    # Define weights for each anomaly to calculate composite risk score
    WEIGHTS = {
        'easy_course': 30,       # High average marks
        'difficult_course': 20,  # Low average marks
        'inconsistent': 40,      # High standard deviation
        'lenient': 30            # High number of toppers (>90)
    }

    grouped = df.groupby('Course')
    results = []

    for course_name, group in grouped:
        marks = group['Marks']
        
        # 1. Compute statistical metrics
        avg_marks = marks.mean()
        std_marks = marks.std()
        if pd.isna(std_marks):
            std_marks = 0
            
        toppers_count = (marks > THRESHOLDS['topper_score']).sum()
        
        issues = []
        risk_score = 0
        
        # 2. Implement detection logic (anomalies)
        if avg_marks > THRESHOLDS['high_avg']:
            issues.append(f"Easy course (Avg > {THRESHOLDS['high_avg']})")
            risk_score += WEIGHTS['easy_course']
            
        if avg_marks < THRESHOLDS['low_avg']:
            issues.append(f"Difficult course (Avg < {THRESHOLDS['low_avg']})")
            risk_score += WEIGHTS['difficult_course']
            
        if std_marks > THRESHOLDS['high_std']:
            issues.append(f"Inconsistent grading (StdDev > {THRESHOLDS['high_std']})")
            risk_score += WEIGHTS['inconsistent']
            
        if toppers_count > THRESHOLDS['toppers_count']:
            issues.append(f"Lenient evaluation (>{THRESHOLDS['toppers_count']} Toppers)")
            risk_score += WEIGHTS['lenient']
            
        # 3. Classify risk level
        # Max theoretical score: 30(easy) + 40(inconsistent) + 30(lenient) = 100
        if risk_score >= 60:
            risk_level = 'High'
        elif risk_score >= 30:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
            
        results.append({
            'Course': course_name,
            'Average': avg_marks,
            'StdDev': std_marks,
            'Toppers': toppers_count,
            'Issues': issues,
            'RiskScore': risk_score,
            'RiskLevel': risk_level,
            'MarksData': marks # store for visualization
        })
        
    # 4. Display Results
    print("=" * 60)
    print("ANALYSIS RESULTS")
    print("=" * 60)
    
    for res in results:
        print(f"Course: {res['Course']}")
        print(f"  - Average Marks: {res['Average']:.2f}")
        print(f"  - Std Deviation: {res['StdDev']:.2f}")
        print(f"  - Toppers (>90): {res['Toppers']}")
        print(f"  - Composite Risk Score: {res['RiskScore']}")
        print(f"  - Risk Level: {res['RiskLevel']}")
        
        if res['Issues']:
            print("  - Detected Anomalies:")
            for issue in res['Issues']:
                print(f"      * {issue}")
        else:
            print("  - Detected Anomalies: None")
            
        print("-" * 40)
        
        # 5. Generate Visualizations
        generate_histogram(res['Course'], res['MarksData'], res['Average'], res['RiskLevel'])

    print("\nVisualizations have been saved as PNG files in the current directory.")

def generate_histogram(course_name, marks, avg_marks, risk_level):
    """Generates and saves a histogram of the marks distribution."""
    plt.figure(figsize=(8, 5))
    
    # Choose color based on risk level
    color_map = {'High': 'salmon', 'Medium': 'gold', 'Low': 'lightgreen'}
    hist_color = color_map.get(risk_level, 'skyblue')

    # Plot histogram
    plt.hist(marks, bins=10, range=(0, 100), color=hist_color, edgecolor='black', alpha=0.8)
    
    # Add vertical line for mean
    plt.axvline(avg_marks, color='red', linestyle='dashed', linewidth=2, label=f'Mean ({avg_marks:.1f})')
    
    plt.title(f'Marks Distribution: {course_name}\nRisk Level: {risk_level}')
    plt.xlabel('Marks (0 - 100)')
    plt.ylabel('Number of Students')
    plt.legend()
    plt.grid(axis='y', alpha=0.5)
    
    # Save the plot
    filename = f"{course_name.replace(' ', '_')}_histogram.png"
    plt.savefig(filename, bbox_inches='tight')
    plt.close() # Close the figure to free memory


if __name__ == "__main__":
    csv_file = "sample_marks.csv"
    generate_sample_data(csv_file)
    analyze_academic_risk(csv_file)
