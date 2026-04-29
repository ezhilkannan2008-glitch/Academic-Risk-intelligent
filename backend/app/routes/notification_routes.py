from flask import Blueprint, jsonify, request
from app.services.notification_service import (
    generate_notifications,
    get_notifications,
    mark_as_read,
    mark_all_read,
    get_unread_count
)

bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')


@bp.route('', methods=['GET'])
def list_notifications():
    """GET /api/notifications?role=admin|faculty|student"""
    role = request.args.get('role')
    valid_roles = ['admin', 'faculty', 'student']
    if role and role not in valid_roles:
        return jsonify({'error': 'Invalid role. Must be admin, faculty, or student.'}), 400
    
    notifications = get_notifications(role=role)
    unread = get_unread_count(role=role)
    return jsonify({
        'notifications': notifications,
        'unread_count': unread,
        'total': len(notifications)
    })


@bp.route('/generate', methods=['POST'])
def trigger_generate():
    """POST /api/notifications/generate — auto-generate notifications from risk analysis"""
    count = generate_notifications()
    return jsonify({
        'message': f'Successfully generated {count} notifications.',
        'count': count
    })


@bp.route('/unread-count', methods=['GET'])
def unread_count():
    """GET /api/notifications/unread-count?role=admin"""
    role = request.args.get('role')
    count = get_unread_count(role=role)
    return jsonify({'unread_count': count})


@bp.route('/<int:notification_id>/read', methods=['PATCH'])
def read_one(notification_id):
    """PATCH /api/notifications/<id>/read"""
    mark_as_read(notification_id)
    return jsonify({'message': 'Notification marked as read.'})


@bp.route('/read-all', methods=['PATCH'])
def read_all():
    """PATCH /api/notifications/read-all?role=admin"""
    role = request.args.get('role')
    mark_all_read(role=role)
    return jsonify({'message': 'All notifications marked as read.'})
