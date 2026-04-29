from flask import Blueprint, jsonify
from app.services.risk_service import get_all_risk_analysis

bp = Blueprint('risk', __name__)

@bp.route('/risk-analysis', methods=['GET'])
def risk_analysis():
    risk_data = get_all_risk_analysis()
    return jsonify(risk_data)
