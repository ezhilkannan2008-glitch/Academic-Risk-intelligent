import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-academic-integrity'
    DATABASE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'app.db')
