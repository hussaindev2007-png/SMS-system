import apiClient from "../apiClient";
export const fetchMessages = async (teacherId) => {
  const response = await apiClient.get(`/teacher/messages?teacherId=${teacherId}`);
  return response.data;
};

export const sendMessage = async (sender, receiver, text) => {
  const response = await apiClient.post("/teacher/messages", { sender, receiver, text });
  return response.data;
};