import sqlite3
import os
from werkzeug.security import generate_password_hash

def reset_auth():
    db_path = os.path.join(os.path.dirname(__file__), 'backend', 'database', 'app.db')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # Clear existing users
    cur.execute("DELETE FROM users")
    
    # Add a default admin
    username = 'admin'
    password = 'admin123'
    hashed_password = generate_password_hash(password)
    
    cur.execute(
        "INSERT INTO users (username, password_hash) VALUES (?, ?)",
        (username, hashed_password)
    )
    
    conn.commit()
    conn.close()
    print(f"Auth reset successful. Default user: {username} / {password}")

if __name__ == '__main__':
    reset_auth()
