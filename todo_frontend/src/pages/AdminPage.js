import React, { useState } from "react";
import { updateTask, login } from "../api";

const AdminPage = () => {
  const [token, setToken] = useState("");
  const [editTask, setEditTask] = useState({ id: "", content: "", is_completed: false });

  const handleLogin = async () => {
    try {
      const response = await login("admin", "123");
      setToken(response.data.token);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTask(editTask.id, editTask, token);
      setEditTask({ id: "", content: "", is_completed: false });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {!token && <button onClick={handleLogin}>Login as Admin</button>}
      {token && (
        <div>
          <h2>Edit Task</h2>
          <input
            type="text"
            placeholder="Task ID"
            value={editTask.id}
            onChange={(e) => setEditTask({ ...editTask, id: e.target.value })}
          />
          <textarea
            placeholder="Content"
            value={editTask.content}
            onChange={(e) => setEditTask({ ...editTask, content: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={editTask.is_completed}
              onChange={(e) =>
                setEditTask({ ...editTask, is_completed: e.target.checked })
              }
            />
            Completed
          </label>
          <button onClick={handleUpdate}>Update Task</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
