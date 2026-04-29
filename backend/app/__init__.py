from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app)
    
    from .models.db import init_app
    init_app(app)
    
    # Register blueprints
    from .routes.course_routes import bp as course_bp
    from .routes.risk_routes import bp as risk_bp
    
    app.register_blueprint(course_bp)
    app.register_blueprint(risk_bp)
    
    return app
