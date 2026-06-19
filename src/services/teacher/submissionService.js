import apiClient from "../apiClient";
export const fetchSubmissions = async (teacherId, archived = false) => {
  const response = await apiClient.get(`/teacher/submissions?teacherId=${teacherId}&archived=${archived}`);
  return response.data;
};

export const reviewSubmission = async (submissionId, feedback, status) => {
  const response = await apiClient.patch("/teacher/submissions", { submissionId, feedback, status });
  return response.data;
};