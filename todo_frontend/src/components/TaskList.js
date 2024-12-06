import React from "react";

const TaskList = ({ tasks, isAdmin, handleEditClick }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <h3>{task.username}</h3>
          <p>{task.email}</p>
          <p>{task.content}</p>
          <p>Status: {task.is_completed ? "Completed" : "Pending"}</p>

          {/* Добавляем кнопку редактирования, если пользователь администратор */}
          {isAdmin && (
            <button onClick={() => handleEditClick(task)}>
              Редактировать
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
