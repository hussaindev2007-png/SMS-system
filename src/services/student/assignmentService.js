import apiClient from "../apiClient";

// Fetch all assignments for student (based on class)
export const fetchAssignments = async (userId, page = 1, limit = 10) => {
  const response = await apiClient.get(`/student/assignments?userId=${userId}&page=${page}&limit=${limit}`);
  return response.data;
};

// Fetch assignment details
export const fetchAssignmentById = async (id) => {
  const response = await apiClient.get(`/student/assignments/${id}`);
  return response.data;
};

// Submit assignment
export const submitAssignment = async (assignmentId, formData) => {
  const response = await apiClient.post(`/student/assignments/${assignmentId}/submit`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// Get submission status
export const getSubmissionStatus = async (assignmentId) => {
  const response = await apiClient.get(`/student/assignments/${assignmentId}/submission`);
  return response.data;
};

export default {
  fetchAssignments,
  fetchAssignmentById,
  submitAssignment,
  getSubmissionStatus
};