from run import app
from flask_migrate import Migrate
from flask_script import Manager

# Инициализация миграций
migrate = Migrate(app, app.db)

manager = Manager(app)

# Удаляем MigrateCommand и добавляем команду миграций через flask
manager.add_command('db', Migrate)

if __name__ == "__main__":
    manager.run()
