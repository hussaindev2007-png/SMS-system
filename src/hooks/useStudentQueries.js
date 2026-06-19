import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as studentAssignmentService from "@/services/student/assignmentService";
import * as studentIdCardService from "@/services/student/idCardService";
import * as studentStatsService from "@/services/student/statsService";
import * as studentSubmissionService from "@/services/student/submissionService";
import toast from "react-hot-toast";

// ==================== ASSIGNMENT HOOKS ====================
export const useStudentAssignments = (userId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["student", "assignments", userId, page],
    queryFn: () => studentAssignmentService.fetchAssignments(userId, page, limit),
    enabled: !!userId,
    staleTime: 30000,
  });
};

export const useAssignmentDetails = (assignmentId) => {
  return useQuery({
    queryKey: ["student", "assignment", assignmentId],
    queryFn: () => studentAssignmentService.fetchAssignmentById(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, formData }) =>
      studentAssignmentService.submitAssignment(assignmentId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student", "assignments"] });
      queryClient.invalidateQueries({ queryKey: ["student", "submissions"] });
      toast.success("Assignment submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit assignment");
    },
  });
};

export const useSubmissionStatus = (assignmentId) => {
  return useQuery({
    queryKey: ["student", "submission-status", assignmentId],
    queryFn: () => studentAssignmentService.getSubmissionStatus(assignmentId),
    enabled: !!assignmentId,
  });
};

// ==================== ID CARD HOOKS ====================
export const useStudentIDCard = (studentId) => {
  return useQuery({
    queryKey: ["student", "id-card", studentId],
    queryFn: () => studentIdCardService.fetchIDCard(studentId),
    enabled: !!studentId,
    staleTime: 60000, // 1 minute
  });
};

export const useDownloadIDCard = () => {
  return useMutation({
    mutationFn: (studentId) => studentIdCardService.downloadIDCard(studentId),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-id-card.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("ID Card downloaded successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to download ID card");
    },
  });
};

// ==================== STATS HOOKS ====================
export const useStudentStats = (studentId) => {
  return useQuery({
    queryKey: ["student", "stats", studentId],
    queryFn: () => studentStatsService.fetchStats(studentId),
    enabled: !!studentId,
    staleTime: 60000,
  });
};

export const useStudentRecentActivity = (studentId, limit = 5) => {
  return useQuery({
    queryKey: ["student", "activity", studentId, limit],
    queryFn: () => studentStatsService.fetchRecentActivity(studentId, limit),
    enabled: !!studentId,
  });
};

export const useStudentPerformance = (studentId) => {
  return useQuery({
    queryKey: ["student", "performance", studentId],
    queryFn: () => studentStatsService.fetchPerformance(studentId),
    enabled: !!studentId,
  });
};

// ==================== SUBMISSION HOOKS ====================
export const useStudentSubmissions = (studentId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["student", "submissions", studentId, page],
    queryFn: () => studentSubmissionService.fetchSubmissions(studentId, page, limit),
    enabled: !!studentId,
  });
};

export const useSubmissionByAssignment = (assignmentId) => {
  return useQuery({
    queryKey: ["student", "submission", assignmentId],
    queryFn: () => studentSubmissionService.fetchSubmissionByAssignment(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useSubmissionFeedback = (submissionId) => {
  return useQuery({
    queryKey: ["student", "feedback", submissionId],
    queryFn: () => studentSubmissionService.getFeedback(submissionId),
    enabled: !!submissionId,
  });
};