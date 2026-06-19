import apiClient from "../apiClient";
// Fetch all fees with pagination
export const fetchFees = async (page = 1, limit = 10) => {
  const response = await apiClient.get(`/admin/fees?page=${page}&limit=${limit}`);
  return response.data;
};

// Add single fee
export const addFee = async (rollNo, month, amount, status, feeType) => {
  const response = await apiClient.post("/admin/fees", {
    rollNo,
    month,
    amount,
    status,
    feeType
  });
  return response.data;
};

// Bulk generate fees
export const bulkGenerateFees = async (month, amount, className, feeType) => {
  const response = await apiClient.post("/admin/fees/bulk", {
    month,
    amount,
    className,
    feeType
  });
  return response.data;
};

// Update fee
export const updateFee = async (id, data) => {
  const response = await apiClient.put(`/admin/fees/${id}`, data);
  return response.data;
};

// Delete fee
export const deleteFee = async (id) => {
  const response = await apiClient.delete(`/admin/fees/${id}`);
  return response.data;
};

export default {
  fetchFees,
  addFee,
  bulkGenerateFees,
  updateFee,
  deleteFee
};