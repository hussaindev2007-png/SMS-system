import apiClient from "../apiClient";
import axios from "axios";

// Fetch all syllabuses
export const fetchSyllabuses = async () => {
  const response = await apiClient.get("/syllabus");
  return response.data;
};

// Fetch syllabus by ID
export const fetchSyllabusById = async (id) => {
  const response = await apiClient.get(`/syllabus/${id}`);
  return response.data;
};

// Upload PDF syllabus
export const uploadSyllabus = async (formData) => {
  const response = await axios.post("/api/syllabus/ingest", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

// Generate AI syllabus
export const generateAISyllabus = async (subjectId, targetClass, board) => {
  const response = await apiClient.post("/syllabus", {
    subjectId,
    targetClass,
    board
  });
  return response.data;
};

// Update syllabus
export const updateSyllabus = async (id, data) => {
  const response = await apiClient.patch(`/syllabus/${id}`, data);
  return response.data;
};

// Delete syllabus
export const deleteSyllabus = async (id) => {
  const response = await apiClient.delete(`/syllabus/${id}`);
  return response.data;
};

export default {
  fetchSyllabuses,
  fetchSyllabusById,
  uploadSyllabus,
  generateAISyllabus,
  updateSyllabus,
  deleteSyllabus
};