import apiClient from "../apiClient";

// Fetch all submissions
export const fetchSubmissions = async (studentId, page = 1, limit = 10) => {
  const response = await apiClient.get(`/student/submissions?studentId=${studentId}&page=${page}&limit=${limit}`);
  return response.data;
};

// Fetch submission by assignment ID
export const fetchSubmissionByAssignment = async (assignmentId) => {
  const response = await apiClient.get(`/student/submissions/assignment/${assignmentId}`);
  return response.data;
};

// Get submission feedback
export const getFeedback = async (submissionId) => {
  const response = await apiClient.get(`/student/submissions/${submissionId}/feedback`);
  return response.data;
};

export default {
  fetchSubmissions,
  fetchSubmissionByAssignment,
  getFeedback
};