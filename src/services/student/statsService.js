import apiClient from "../apiClient";

// Fetch student dashboard statistics
export const fetchStats = async (studentId) => {
  const response = await apiClient.get(`/student/stats?studentId=${studentId}`);
  return response.data;
};

// Fetch recent activity
export const fetchRecentActivity = async (studentId, limit = 5) => {
  const response = await apiClient.get(`/student/stats/activity?studentId=${studentId}&limit=${limit}`);
  return response.data;
};

// Fetch performance metrics
export const fetchPerformance = async (studentId) => {
  const response = await apiClient.get(`/student/stats/performance?studentId=${studentId}`);
  return response.data;
};

export default {
  fetchStats,
  fetchRecentActivity,
  fetchPerformance
};