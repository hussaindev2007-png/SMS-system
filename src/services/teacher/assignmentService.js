import apiClient from "../apiClient";

export const fetchAssignments = async (userId, page = 1, limit = 10) => {
  const response = await apiClient.get(`/teacher/assignments?userId=${userId}&page=${page}&limit=${limit}`);
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await apiClient.post("/teacher/assignments", data);
  return response.data;
};

export const updateAssignment = async (id, data) => {
  const response = await apiClient.put(`/teacher/assignments/${id}`, data);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await apiClient.delete(`/teacher/assignments/${id}`);
  return response.data;
};

export const generateAIRecommendations = async (subject, targetClass, chapter, topics) => {
  const topicsParam = encodeURIComponent(topics.join(","));
  const response = await apiClient.get(
    `/teacher/assignments?recommend=true&subject=${subject}&targetClass=${targetClass}&chapter=${chapter}&topics=${topicsParam}`
  );
  return response.data;
};