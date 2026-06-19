import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as services from "@/services";
import toast from "react-hot-toast";

// ==================== SUBJECTS HOOKS ====================
export const useSubjects = () => {
  return useQuery({
    queryKey: ["admin", "subjects"],
    queryFn: services.subjectsService.fetchSubjects,
  });
};

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.subjectsService.addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subjects"] });
      toast.success("Subject added successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to add subject"),
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }) => services.subjectsService.updateSubject(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subjects"] });
      toast.success("Subject updated successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update subject"),
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.subjectsService.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subjects"] });
      toast.success("Subject deleted successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete subject"),
  });
};

// ==================== ADMISSIONS HOOKS ====================
export const usePendingAdmissions = () => {
  return useQuery({
    queryKey: ["admin", "admissions", "pending"],
    queryFn: services.admissionsService.fetchPendingAdmissions,
  });
};

// ✅ ADD THIS - Approve Admission Hook
export const useApproveAdmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId, rollNumber, section, admissionFee }) =>
      services.admissionsService.approveAdmission(requestId, rollNumber, section, admissionFee),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admissions", "pending"] });
      toast.success(data.message || "Admission approved successfully!");
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Failed to approve admission";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    },
  });
};

// ✅ ADD THIS - Reject Admission Hook
export const useRejectAdmission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ requestId }) => services.admissionsService.rejectAdmission(requestId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "admissions", "pending"] });
      toast.success(data.message || "Admission rejected successfully!");
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "Failed to reject admission";
      toast.error(errorMsg);
    },
  });
};

// ==================== TASKS HOOKS ====================
export const useTasks = (subject = "", page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["admin", "tasks", subject, page],
    queryFn: () => services.tasksService.fetchTasks(subject, page, limit),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.tasksService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to create task"),
  });
};

export const useBulkCreateTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.tasksService.bulkCreateTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      toast.success("Tasks assigned successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to assign tasks"),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.tasksService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tasks"] });
      toast.success("Task deleted successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete task"),
  });
};

// // ==================== SYLLABUS HOOKS ====================
// export const useSyllabuses = () => {
//   return useQuery({
//     queryKey: ["admin", "syllabuses"],
//     queryFn: services.syllabusService.fetchSyllabuses,
//   });
// };

// export const useUploadSyllabus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: services.syllabusService.uploadSyllabus,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin", "syllabuses"] });
//       toast.success("Syllabus uploaded successfully!");
//     },
//     onError: (error) => toast.error(error.response?.data?.error || "Failed to upload syllabus"),
//   });
// };

// export const useDeleteSyllabus = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: services.syllabusService.deleteSyllabus,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin", "syllabuses"] });
//       toast.success("Syllabus deleted successfully!");
//     },
//     onError: (error) => toast.error(error.response?.data?.message || "Failed to delete syllabus"),
//   });
// };



// ==================== SYLLABUS HOOKS ====================
export const useSyllabuses = () => {
  return useQuery({
    queryKey: ["admin", "syllabuses"],
    queryFn: services.syllabusService.fetchSyllabuses,
  });
};

export const useUploadSyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.syllabusService.uploadSyllabus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "syllabuses"] });
      toast.success("Syllabus uploaded successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to upload syllabus"),
  });
};

// ✅ ADD THIS HOOK
export const useGenerateAISyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subjectId, targetClass, board, academicYear }) =>
      services.syllabusService.generateAISyllabus(subjectId, targetClass, board, academicYear),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "syllabuses"] });
      toast.success("AI syllabus generated successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to generate syllabus"),
  });
};

export const useUpdateSyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => services.syllabusService.updateSyllabus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "syllabuses"] });
      toast.success("Syllabus updated successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update syllabus"),
  });
};

export const useDeleteSyllabus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.syllabusService.deleteSyllabus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "syllabuses"] });
      toast.success("Syllabus deleted successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete syllabus"),
  });
};

// ==================== FEES HOOKS ====================
export const useFees = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["admin", "fees", page],
    queryFn: () => services.feesService.fetchFees(page, limit),
  });
};

export const useAddFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.feesService.addFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      toast.success("Fee record added successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to add fee"),
  });
};

export const useBulkGenerateFees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.feesService.bulkGenerateFees,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      toast.success("Fees generated successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.error || "Failed to generate fees"),
  });
};

export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => services.feesService.updateFee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      toast.success("Fee updated successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update fee"),
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.feesService.deleteFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      toast.success("Fee deleted successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to delete fee"),
  });
};
export const useMarkFeeAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => services.feesService.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "fees"] });
      toast.success("Fee marked as paid!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to mark as paid"),
  });
};
// ==================== COMPLAINTS HOOKS ====================
export const useComplaints = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["admin", "complaints", page],
    queryFn: () => services.complaintsService.fetchComplaints(page, limit),
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ complaintId, status, adminRemark }) =>
      services.complaintsService.updateComplaintStatus(complaintId, status, adminRemark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "complaints"] });
      toast.success("Complaint status updated!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to update status"),
  });
};

export const useGenerateAIComplaintReply = () => {
  return useMutation({
    mutationFn: ({ subject, message }) =>
      services.complaintsService.generateAIComplaintReply(subject, message),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to generate AI reply"),
  });
};

// ==================== ID CARDS HOOKS ====================
export const useIDCards = (className = "") => {
  return useQuery({
    queryKey: ["admin", "idCards", className],
    queryFn: () => services.idCardsService.fetchIDCards(className),
  });
};

// ==================== TEACHERS HOOKS ====================
export const useTeachers = (status = "", limit = 100) => {
  return useQuery({
    queryKey: ["admin", "teachers", status],
    queryFn: () => services.teachersService.fetchTeachers(status, limit),
  });
};

export const useApproveTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.teachersService.approveTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teachers"] });
      toast.success("Teacher approved successfully!");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to approve teacher"),
  });
};

// ==================== MESSAGES HOOKS ====================
export const useTeachersList = (userId) => {
  return useQuery({
    queryKey: ["admin", "messages", "teachers", userId],
    queryFn: () => services.messagesService.fetchTeachersList(userId),
    enabled: !!userId,
  });
};

export const useChatHistory = (userId, contactId) => {
  return useQuery({
    queryKey: ["admin", "messages", "history", userId, contactId],
    queryFn: () => services.messagesService.fetchChatHistory(userId, contactId),
    enabled: !!userId && !!contactId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sender, receiver, text }) =>
      services.messagesService.sendMessage(sender, receiver, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages", "history"] });
    },
  });
};

export const useToggleChatLock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: services.messagesService.toggleChatLock,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages", "teachers"] });
      toast.success(data.isLocked ? "Chat locked" : "Chat unlocked");
    },
  });
};