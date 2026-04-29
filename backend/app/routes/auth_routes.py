from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from ..models.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    db = get_db()
    
    # Check if user already exists
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    if user:
        return jsonify({"error": "Username already exists"}), 409

    # Hash the password and insert
    hashed_password = generate_password_hash(password)
    try:
        db.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, hashed_password)
        )
        db.commit()
        return jsonify({"message": "User created successfully", "username": username}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()

    if user and check_password_hash(user['password_hash'], password):
        # We simulate a token by just returning a success message for now. 
        # In a real production app, you would generate and return a JWT here.
        return jsonify({
            "message": "Login successful",
            "token": f"mock-token-{username}",
            "username": username
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401
