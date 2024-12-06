import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskList from "../components/TaskList";  // Импортируем TaskList
import Pagination from "../components/Pagination";

const HomePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAdmin(true);
    }
    loadTasks(currentPage);
  }, [currentPage]);

  const loadTasks = (page) => {
    axios
      .get(`http://localhost:5000/tasks?page=${page}`)
      .then((response) => {
        if (Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
          setTotalPages(response.data.total_pages);
        } else {
          console.error("Ошибка: данные не являются массивом", response.data);
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      });
  };

  const handleAdminLogin = () => {
    if (username && password) {
      axios
        .post("http://localhost:5000/api/login", { username, password })
        .then(response => {
          const token = response.data.token;
          localStorage.setItem('admin_token', token);  // Сохраняем токен в localStorage
          setIsAdmin(true);  // Устанавливаем флаг админа
          setShowLoginForm(false);
          alert("Вы вошли как администратор!");
        })
        .catch(() => {
          alert("Неверный логин или пароль.");
        });
    } else {
      alert("Пожалуйста, введите логин и пароль.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');  // Удаляем токен из localStorage
    setIsAdmin(false);  // Снимаем флаг админа
    alert("Вы вышли из аккаунта администратора.");
  };

  const handleAddTaskClick = () => {
    setShowAddTaskForm(!showAddTaskForm);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const content = e.target.content.value;

    axios
      .post("http://localhost:5000/tasks", { username, email, content })
      .then((response) => {
        alert("Задача успешно добавлена!");
        loadTasks();
        setShowAddTaskForm(false);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        alert("Ошибка при добавлении задачи.");
      });
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setEditedTask({ content: task.content, is_completed: task.is_completed });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('admin_token');  // Получаем токен из localStorage

    if (!token) {
      alert("Вы должны войти как администратор.");
      return;
    }

    axios
      .put(
        `http://localhost:5000/tasks/${editTaskId}`,
        editedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Добавляем токен в заголовки
          },
        }
      )
      .then(() => {
        alert("Задача успешно обновлена!");
        loadTasks(currentPage);  // Загружаем обновленные задачи
        setEditTaskId(null);  // Закрываем форму редактирования
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        if (error.response && error.response.status === 403) {
          alert("У вас нет прав для редактирования задач.");
        } else {
          alert("Ошибка при обновлении задачи.");
        }
      });
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return (
    <div>
      <h1>Task List</h1>

      {/* Кнопка авторизации администратора */}
      {!isAdmin ? (
        <>
          <button onClick={() => setShowLoginForm(!showLoginForm)}>
            Войти как администратор
          </button>

          {/* Форма для авторизации появляется только после нажатия на кнопку */}
          {showLoginForm && (
            <div>
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleAdminLogin}>Войти</button>
            </div>
          )}
        </>
      ) : (
        <button onClick={handleLogout}>Выйти</button>
      )}

      {/* Кнопка "Добавить запись" */}
      <button onClick={handleAddTaskClick}>
        {showAddTaskForm ? "Закрыть форму" : "Добавить запись"}
      </button>

      {/* Форма добавления записи */}
      {showAddTaskForm && (
        <form onSubmit={handleTaskSubmit}>
          <h2>Добавить запись</h2>
          <label>
            Имя пользователя:
            <input type="text" name="username" required />
          </label>
          <br />
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <br />
          <label>
            Контент:
            <textarea name="content" required></textarea>
          </label>
          <br />
          <button type="submit">Добавить</button>
        </form>
      )}

      {/* Используем компонент TaskList для отображения задач */}
      <TaskList
        tasks={tasks}
        isAdmin={isAdmin}
        handleEditClick={handleEditClick}
      />

      {/* Форма редактирования записи */}
      {editTaskId && (
        <form onSubmit={handleEditSubmit}>
          <h2>Редактировать задачу</h2>
          <label>
            Контент:
            <textarea
              value={editedTask.content}
              onChange={(e) => setEditedTask({ ...editedTask, content: e.target.value })}
              required
            />
          </label>
          <br />
          <label>
            Завершена:
            <input
              type="checkbox"
              checked={editedTask.is_completed}
              onChange={(e) => setEditedTask({ ...editedTask, is_completed: e.target.checked })}
            />
          </label>
          <br />
          <button type="submit">Сохранить</button>
          <button type="button" onClick={() => setEditTaskId(null)}>
            Отмена
          </button>
        </form>
      )}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    </div>
  );
};

export default HomePage;
