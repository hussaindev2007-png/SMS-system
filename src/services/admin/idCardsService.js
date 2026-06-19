import apiClient from "../apiClient";
// Fetch all ID cards
export const fetchIDCards = async (className = "") => {
  const response = await apiClient.get(`/admin/id-cards?class=${className}`);
  return response.data;
};

// Generate ID card for student
export const generateIDCard = async (studentId, cardData) => {
  const response = await apiClient.post("/admin/id-cards", { studentId, ...cardData });
  return response.data;
};

export default {
  fetchIDCards,
  generateIDCard
};