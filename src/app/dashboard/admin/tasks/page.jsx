"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ClipboardList, Plus, Trash2, Loader2, CheckCircle, 
  XCircle, Clock, Calendar, Users, BookOpen, AlertCircle,
  ChevronLeft, ChevronRight, Sparkles, Send, Filter,
  Eye, ChevronDown, ChevronUp, ListChecks, Target, RefreshCw
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks, useCreateTask, useDeleteTask } from "@/hooks/useAdminQueries";
import { useSubjects } from "@/hooks/useAdminQueries";

export default function AdminTasksPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [filterSubject, setFilterSubject] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    priority: "medium",
    deadline: "",
    teacherIds: []
  });

  const limit = 10;

  // React Query hooks
  const { data: tasksData, isLoading, refetch, isFetching } = useTasks(filterSubject, page, limit);
  const { data: subjectsList = [] } = useSubjects();
  
  // Fetch teachers for assignment
  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers-for-task"],
    queryFn: async () => {
      const res = await fetch("/api/admin/teachers?status=approved&limit=100");
      const data = await res.json();
      return data.teachers || [];
    },
  });

  const tasks = tasksData?.data || [];
  const pagination = tasksData?.pagination || { total: 0, page: 1, totalPages: 1 };

  // Create task mutation with AI
  const createTaskMutation = useCreateTask();

  // Delete task mutation
  const deleteTaskMutation = useDeleteTask();

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher");
      return;
    }
    if (!formData.title || !formData.subject) {
      toast.error("Title and Subject are required");
      return;
    }

    const adminId = localStorage.getItem("userId");
    
    if (!adminId) {
      toast.error("Admin not found. Please login again.");
      return;
    }
    
    createTaskMutation.mutate({
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      priority: formData.priority,
      deadline: formData.deadline || null,
      assignedBy: adminId,
      teacherIds: selectedTeachers
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setSelectedTeachers([]);
        setFormData({
          title: "",
          description: "",
          subject: "",
          priority: "medium",
          deadline: "",
          teacherIds: []
        });
      }
    });
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "high": return <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">High</span>;
      case "medium": return <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Medium</span>;
      case "low": return <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Low</span>;
      default: return <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{priority}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "completed": return <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} /> Completed</span>;
      case "in-progress": return <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><Clock size={12} /> In Progress</span>;
      default: return <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full"><Clock size={12} /> Pending</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList size={28} className="text-indigo-600" />
              Task Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1">Assign and monitor tasks for teachers</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={18} /> Assign New Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjectsList?.map((sub) => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No tasks assigned yet</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 text-indigo-600 hover:underline">Create your first task</button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="p-5">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg text-slate-800">{task.title}</h3>
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                      </div>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{task.description}</p>
                      
                      {/* AI Generated Subtasks */}
                      {task.subTasks && task.subTasks.length > 0 && (
                        <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="flex items-center gap-2 mb-2">
                            <ListChecks size={14} className="text-indigo-600" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">AI Generated Subtasks</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {task.subTasks.map((sub, idx) => (
                              <span key={idx} className="text-xs bg-white text-slate-700 px-2 py-1 rounded-full border border-indigo-200">
                                {sub.text || sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        {expandedTask === task._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this task?")) deleteTaskMutation.mutate(task._id);
                        }}
                        disabled={deleteTaskMutation.isPending}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      >
                        {deleteTaskMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedTask === task._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-100"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users size={16} className="text-slate-400" />
                            <span className="font-medium">Assigned to:</span>
                            <span>{task.assignedTo?.name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <BookOpen size={16} className="text-slate-400" />
                            <span className="font-medium">Subject:</span>
                            <span>{task.subject?.name || task.subject || "N/A"}</span>
                          </div>
                          {task.deadline && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar size={16} className="text-slate-400" />
                              <span className="font-medium">Deadline:</span>
                              <span>{new Date(task.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <ClipboardList size={16} className="text-slate-400" />
                            <span className="font-medium">Created:</span>
                            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-slate-600">Page {pagination.page} of {pagination.totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-5 sticky top-0 bg-white pb-3">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-600" />
                  Assign New Task (AI Enhanced)
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Task Title *</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    placeholder="e.g., Prepare Chapter 1 Quiz"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">AI will generate enhanced description and subtasks</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Description (Optional)</label>
                  <textarea
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                    rows={3}
                    placeholder="Additional instructions or context..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subject *</label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjectsList?.map((sub) => (
                        <option key={sub._id} value={sub._id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Priority</label>
                    <select
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-3">Select Teachers *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                    {teachersData?.length === 0 ? (
                      <p className="text-sm text-slate-400 p-3">No approved teachers found</p>
                    ) : (
                      teachersData?.map((teacher) => (
                        <label key={teacher._id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTeachers.includes(teacher._id)}
                            onChange={() => handleTeacherSelect(teacher._id)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-700">{teacher.name}</p>
                            <p className="text-xs text-slate-400">{teacher.email}</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{selectedTeachers.length} teacher(s) selected</p>
                </div>

                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTaskMutation.isPending || selectedTeachers.length === 0}
                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createTaskMutation.isPending ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={16} /> Assign with AI
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* AI Info Note */}
              <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-600" />
                  <span className="text-xs font-medium text-indigo-700">AI Enhancement Active</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-1">AI will automatically generate enhanced description and subtasks for this assignment</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}