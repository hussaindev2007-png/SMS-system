import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  teacherAssignmentsService,
  teacherTasksService,
  teacherSubmissionsService,
  teacherChatService
} from "@/services";
import toast from "react-hot-toast";

// ==================== ASSIGNMENTS HOOKS ====================
export const useTeacherAssignments = (userId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["teacher", "assignments", userId, page],
    queryFn: () => teacherAssignmentsService.fetchAssignments(userId, page, limit),
    enabled: !!userId,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherAssignmentsService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assignments"] });
      toast.success("Assignment created successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create assignment"),
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => teacherAssignmentsService.updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assignments"] });
      toast.success("Assignment updated successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update assignment"),
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: teacherAssignmentsService.deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "assignments"] });
      toast.success("Assignment deleted successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete assignment"),
  });
};

// ✅ ADD THIS - Teacher Subjects Hook
export const useTeacherSubjects = (userId) => {
  return useQuery({
    queryKey: ["teacher", "subjects", userId],
    queryFn: () => teacherAssignmentsService.fetchTeacherSubjects?.(userId) || Promise.resolve({ assignedSubjects: [] }),
    enabled: !!userId,
  });
};

// ✅ ADD THIS - Syllabus Hook
export const useSyllabusForTeacher = (subjectId, className) => {
  return useQuery({
    queryKey: ["teacher", "syllabus", subjectId, className],
    queryFn: () => teacherAssignmentsService.fetchSyllabus?.(subjectId, className) || Promise.resolve({ data: [] }),
    enabled: !!subjectId && !!className,
  });
};

// ✅ ADD THIS - Generate AI Recommendations Hook
export const useGenerateAIRecommendations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subject, targetClass, chapter, topics }) =>
      teacherAssignmentsService.generateAIRecommendations?.(subject, targetClass, chapter, topics) || 
      Promise.resolve({ data: [] }),
    onSuccess: (data) => {
      // No cache invalidation needed for recommendations
      console.log("AI recommendations generated:", data);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to generate AI recommendations");
    },
  });
};

// ==================== TASKS HOOKS ====================
export const useTeacherTasks = (teacherId) => {
  return useQuery({
    queryKey: ["teacher", "tasks", teacherId],
    queryFn: () => teacherTasksService.fetchTasks(teacherId),
    enabled: !!teacherId,
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }) => teacherTasksService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "tasks"] });
      toast.success("Task status updated!");
    },
  });
};

export const useUpdateSubTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, subTasks, newStatus }) =>
      teacherTasksService.updateSubTask(taskId, subTasks, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "tasks"] });
      toast.success("Sub-task completed!");
    },
  });
};

// ==================== SUBMISSIONS HOOKS ====================
export const useTeacherSubmissions = (teacherId, archived = false, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["teacher", "submissions", teacherId, archived, page],
    queryFn: () => teacherSubmissionsService.fetchSubmissions(teacherId, archived, page, limit),
    enabled: !!teacherId,
  });
};

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, feedback, status }) =>
      teacherSubmissionsService.reviewSubmission(submissionId, feedback, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "submissions"] });
      toast.success("Submission reviewed!");
    },
  });
};

// ==================== CHAT HOOKS ====================
export const useTeacherMessages = (teacherId) => {
  return useQuery({
    queryKey: ["teacher", "messages", teacherId],
    queryFn: () => teacherChatService.fetchMessages(teacherId),
    enabled: !!teacherId,
    refetchInterval: 5000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sender, receiver, text }) =>
      teacherChatService.sendMessage(sender, receiver, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "messages"] });
    },
  });
};