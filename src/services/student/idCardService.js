import apiClient from "../apiClient";

// Fetch student's ID card
export const fetchIDCard = async (studentId) => {
  const response = await apiClient.get(`/student/id-card?studentId=${studentId}`);
  return response.data;
};

// Download ID card as PDF
export const downloadIDCard = async (studentId) => {
  const response = await apiClient.get(`/student/id-card/download?studentId=${studentId}`, {
    responseType: 'blob'
  });
  return response.data;
};

export default {
  fetchIDCard,
  downloadIDCard
};