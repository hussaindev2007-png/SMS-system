import apiClient from "../apiClient";

// Fetch teachers list for sidebar
export const fetchTeachersList = async (userId) => {
  const response = await apiClient.get(`/admin/messages?userId=${userId}`);
  return response.data;
};

// Fetch chat history with specific teacher
export const fetchChatHistory = async (userId, contactId) => {
  const response = await apiClient.get(`/admin/messages?userId=${userId}&contactId=${contactId}`);
  return response.data;
};

// Send message
export const sendMessage = async (sender, receiver, text) => {
  const response = await apiClient.post("/admin/messages", {
    sender,
    receiver,
    text
  });
  return response.data;
};

// Toggle chat lock
export const toggleChatLock = async (lockStatus) => {
  const response = await apiClient.patch("/admin/messages", { lockStatus });
  return response.data;
};

// Get message stats for a user
export const getMessageStats = async (userId) => {
  const response = await apiClient.head(`/admin/messages?userId=${userId}`);
  return response.data;
};

export default {
  fetchTeachersList,
  fetchChatHistory,
  sendMessage,
  toggleChatLock,
  getMessageStats
};