import apiClient from "../apiClient";

// Fetch all teachers
export const fetchTeachers = async (status = "", limit = 100) => {
  const url = status 
    ? `/admin/teachers?status=${status}&limit=${limit}`
    : `/admin/teachers?limit=${limit}`;
  const response = await apiClient.get(url);
  return response.data;
};

// Get teacher by ID
export const getTeacherById = async (id) => {
  const response = await apiClient.get(`/admin/teachers/${id}`);
  return response.data;
};

// Update teacher status
export const updateTeacherStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/teachers/${id}`, { status });
  return response.data;
};

// Approve teacher registration
export const approveTeacher = async (id) => {
  const response = await apiClient.patch(`/admin/teachers/${id}`, { status: "approved" });
  return response.data;
};

export default {
  fetchTeachers,
  getTeacherById,
  updateTeacherStatus,
  approveTeacher
};