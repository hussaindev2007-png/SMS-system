import apiClient from "../apiClient";
// Fetch all subjects
export const fetchSubjects = async () => {
  const response = await apiClient.get("/subjects");
  return response.data;
};

// Add new subject
export const addSubject = async (name) => {
  const response = await apiClient.post("/subjects", { name });
  return response.data;
};

// Update subject
export const updateSubject = async (id, name) => {
  const response = await apiClient.put(`/subjects/${id}`, { name });
  return response.data;
};

// Delete subject
export const deleteSubject = async (id) => {
  const response = await apiClient.delete(`/subjects/${id}`);
  return response.data;
};

export default {
  fetchSubjects,
  addSubject,
  updateSubject,
  deleteSubject
};