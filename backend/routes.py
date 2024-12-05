from flask import Blueprint, request, jsonify
from .models import Task
from backend import db
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy.exc import IntegrityError

task_bp = Blueprint('task_bp', __name__)


# Создание задачи
@task_bp.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        new_task = Task(username=data['username'], email=data['email'], content=data['content'])
        db.session.add(new_task)
        db.session.commit()
        return {'message': 'Task created successfully.'}, 201
    except IntegrityError:
        db.session.rollback()  # Откатываем изменения
    return jsonify({'message': 'Task created successfully'})

# Получение задач с пагинацией и сортировкой
@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    page = request.args.get('page', 1, type=int)
    sort_by = request.args.get('sort_by', 'username')
    try:
        tasks = Task.query.order_by(Task.username).paginate(page=page, per_page=3, error_out=False)
    except AttributeError:
        return jsonify({'error': f'Invalid sort_by parameter: {sort_by}'}), 400
    return jsonify({
        'tasks': [task.to_dict() for task in tasks.items],
        'total_pages': tasks.pages,
        'current_page': tasks.page,
    }), 200

# Редактирование задачи администратором
@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user = get_jwt_identity()
    if current_user != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    task = Task.query.get_or_404(task_id)
    data = request.json
    if 'content' in data:
        task.content = data['content']
    if 'is_completed' in data:
        task.is_completed = data['is_completed']
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})


@task_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if data['username'] == 'admin' and data['password'] == '123':
        token = create_access_token(identity='admin')
        return jsonify(token=token)
    return jsonify(message='Invalid credentials'), 401

