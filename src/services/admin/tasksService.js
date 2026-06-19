import apiClient from "../apiClient";
// Fetch all tasks with filters
export const fetchTasks = async (subject = "", page = 1, limit = 10) => {
  const url = subject 
    ? `/admin/tasks?subject=${subject}&page=${page}&limit=${limit}`
    : `/admin/tasks?page=${page}&limit=${limit}`;
  const response = await apiClient.get(url);
  return response.data;
};

// Create single task
export const createTask = async (taskData) => {
  const response = await apiClient.post("/admin/tasks", taskData);
  return response.data;
};

// Bulk create tasks
export const bulkCreateTasks = async (taskData) => {
  const response = await apiClient.post("/admin/tasks/bulk", taskData);
  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/admin/tasks/${id}`);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/tasks/${id}`, { status });
  return response.data;
};

export default {
  fetchTasks,
  createTask,
  bulkCreateTasks,
  deleteTask,
  updateTaskStatus
};