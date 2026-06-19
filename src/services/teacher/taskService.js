import axios from "axios";

const API_BASE = "/api/teacher/tasks";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-user-role"] = "teacher";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all tasks for teacher
export const fetchTasks = async (teacherId) => {
  const response = await apiClient.get(`?id=${teacherId}`);
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const response = await apiClient.patch("/", { taskId, status });
  return response.data;
};

// Mark sub-task as complete
export const markSubTaskComplete = async (taskId, subTaskId, subTasks, newStatus) => {
  const response = await apiClient.patch("/", {
    taskId,
    subTasks,
    status: newStatus,
  });
  return response.data;
};

export default apiClient;