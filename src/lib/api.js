// src/lib/api.js

export const API_BASE = '/api';

/**
 * Generates the URL for fetching student dashboard stats
 * @param {string} studentId - Student's MongoDB ID
 * @param {string} className - Class name (e.g., "10", "12A")
 * @returns {string} Full API URL with query params
 */
export const getStudentStatsUrl = (studentId, className) => {
  if (!studentId || !className) {
    throw new Error('getStudentStatsUrl: studentId and className are required');
  }

  // Encode parameters to handle special characters safely
  const encodedStudentId = encodeURIComponent(studentId);
  const encodedClassName = encodeURIComponent(className);

  return `${API_BASE}/student/stats?studentId=${encodedStudentId}&className=${encodedClassName}`;
};

/**
 * Optional: Add more API helpers here as your app grows
 * Example:
 * export const getAssignmentDetailUrl = (id) => `${API_BASE}/assignments/${id}`;
 */