import apiClient from "../apiClient";
// Fetch all complaints
export const fetchComplaints = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/admin/complaints?page=${page}&limit=${limit}`);
  return response.data;
};

// Update complaint status
export const updateComplaintStatus = async (complaintId, status, adminRemark) => {
  const response = await apiClient.patch("/admin/complaints", {
    complaintId,
    status,
    adminRemark
  });
  return response.data;
};

// Generate AI reply for complaint
export const generateAIComplaintReply = async (subject, message) => {
  const response = await apiClient.post("/admin/complaints", { subject, message });
  return response.data;
};

// Update complaint by ID
export const updateComplaintById = async (id, status, adminRemark) => {
  const response = await apiClient.put(`/admin/complaints/${id}`, {
    status,
    adminRemark
  });
  return response.data;
};

export default {
  fetchComplaints,
  updateComplaintStatus,
  generateAIComplaintReply,
  updateComplaintById
};