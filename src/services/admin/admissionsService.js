import apiClient from "../apiClient";

// Fetch pending admissions
export const fetchPendingAdmissions = async () => {
  const response = await apiClient.get("/admin/admissions");
  return response.data;
};

// Approve admission
export const approveAdmission = async (requestId, rollNumber, section, admissionFee) => {
  const response = await apiClient.put("/admin/admissions", {
    requestId,
    rollNumber,
    section,
    admissionFee,
    action: "approve"
  });
  return response.data;
};

// Reject admission
export const rejectAdmission = async (requestId) => {
  const response = await apiClient.put("/admin/admissions", {
    requestId,
    action: "reject"
  });
  return response.data;
};

export default {
  fetchPendingAdmissions,
  approveAdmission,
  rejectAdmission
};