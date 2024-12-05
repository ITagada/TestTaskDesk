from flask import Flask, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__, static_folder='../todo_frontend/build', template_folder='../todo_frontend/build')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
    app.config['SECRET_KEY'] = 'your_secret_key'
    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    migrate.init_app(app, db)

    # Регистрация блюпринтов
    from .routes import task_bp
    app.register_blueprint(task_bp)

    # Главная страница, отдающая React-приложение
    @app.route('/')
    def index():
        return send_from_directory(app.static_folder, 'index.html')

    @app.route('/<path:path>')
    def static_path(path):
        return send_from_directory(app.static_folder, path)

    # Создание базы данных
    with app.app_context():
        db.create_all()

    return app


