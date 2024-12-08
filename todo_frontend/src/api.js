import axios from "axios";

const API_BASE_URL = "http://localhost:5000" || "http://10.250.20.132:5000"; // Замените на ваш адрес API

export const fetchTasks = (page = 1, sortBy = "username") =>
  axios.get(`${API_BASE_URL}/tasks`, {
    params: { page, sort_by: sortBy },
  });

export const createTask = (task) =>
  axios.post(`${API_BASE_URL}/tasks`, task);

export const login = (username, password) =>
  axios.post(`${API_BASE_URL}/api/login`, { username, password });

export const updateTask = (id, data, token) =>
  axios.put(`${API_BASE_URL}/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
