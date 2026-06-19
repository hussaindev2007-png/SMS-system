// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import {
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Loader2,
//   RefreshCw,
//   Calendar,
//   User,
//   BookOpen,
//   ChevronDown,
//   ChevronUp,
//   CheckSquare,
//   Flag,
//   ListChecks
// } from "lucide-react";

// export default function TeacherTasksPage() {
//   const router = useRouter();
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [expandedTask, setExpandedTask] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [teacherId, setTeacherId] = useState(null);
//   const [updatingSubTask, setUpdatingSubTask] = useState(null);
  
//   // Stats
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     completed: 0
//   });

//   // Check authentication
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     const userId = localStorage.getItem("userId");
    
//     if (!token || userRole !== "teacher") {
//       router.push("/login");
//       return;
//     }
    
//     setTeacherId(userId);
//   }, [router]);

//   // Fetch tasks
//   const fetchTasks = useCallback(async () => {
//     if (!teacherId) return;
    
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/teacher/tasks?id=${teacherId}`);
//       const data = await res.json();
      
//       if (data.success) {
//         setTasks(data.data || []);
//         setFilteredTasks(data.data || []);
        
//         const total = data.data.length;
//         const pending = data.data.filter(t => t.status === "pending").length;
//         const inProgress = data.data.filter(t => t.status === "in-progress").length;
//         const completed = data.data.filter(t => t.status === "completed").length;
        
//         setStats({ total, pending, inProgress, completed });
//       }
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [teacherId]);

//   useEffect(() => {
//     if (teacherId) {
//       fetchTasks();
//     }
//   }, [teacherId, fetchTasks]);

//   // Filter tasks
//   useEffect(() => {
//     let filtered = tasks;
    
//     if (searchTerm) {
//       filtered = filtered.filter(t =>
//         t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         t.assignedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (selectedStatus) {
//       filtered = filtered.filter(t => t.status === selectedStatus);
//     }
    
//     setFilteredTasks(filtered);
//   }, [searchTerm, selectedStatus, tasks]);

//   // Update task status
//   const updateTaskStatus = async (taskId, newStatus) => {
//     setUpdating(true);
    
//     try {
//       const res = await fetch("/api/teacher/tasks", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ taskId, status: newStatus })
//       });
      
//       const data = await res.json();
//       if (data.success) {
//         await fetchTasks();
//       }
//     } catch (error) {
//       console.error("Error updating task:", error);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ✅ Update sub-task - ONLY CAN MARK AS COMPLETED, CANNOT UNCHECK
//   const markSubTaskComplete = async (taskId, subTaskId) => {
//     // Prevent if already updating
//     if (updatingSubTask === `${taskId}-${subTaskId}`) return;
    
//     const task = tasks.find(t => t._id === taskId);
//     if (!task) return;
    
//     // Find the sub-task
//     const subTask = task.subTasks.find(sub => sub._id === subTaskId);
    
//     // ✅ If already completed, do nothing (cannot uncheck)
//     if (subTask && (subTask.isCompleted === true || subTask.completed === true)) {
//       return;
//     }
    
//     setUpdatingSubTask(`${taskId}-${subTaskId}`);
    
//     try {
//       // Mark as completed
//       const updatedSubTasks = task.subTasks.map(sub => {
//         if (sub._id === subTaskId) {
//           return { ...sub, isCompleted: true, completed: true };
//         }
//         return sub;
//       });
      
//       // Check if all sub-tasks are completed
//       const allCompleted = updatedSubTasks.every(sub => sub.isCompleted === true || sub.completed === true);
//       const newTaskStatus = allCompleted ? "completed" : task.status;
      
//       const res = await fetch("/api/teacher/tasks", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           taskId, 
//           subTasks: updatedSubTasks,
//           status: newTaskStatus
//         })
//       });
      
//       const data = await res.json();
//       if (data.success) {
//         await fetchTasks();
//       }
//     } catch (error) {
//       console.error("Error updating sub-task:", error);
//     } finally {
//       setUpdatingSubTask(null);
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "completed":
//         return { icon: CheckCircle, text: "Completed", bg: "bg-green-100", textColor: "text-green-700" };
//       case "in-progress":
//         return { icon: Clock, text: "In Progress", bg: "bg-yellow-100", textColor: "text-yellow-700" };
//       default:
//         return { icon: AlertCircle, text: "Pending", bg: "bg-red-100", textColor: "text-red-700" };
//     }
//   };

//   // Get priority badge
//   const getPriorityBadge = (priority) => {
//     switch(priority) {
//       case "high":
//         return { icon: Flag, text: "High", bg: "bg-red-100", textColor: "text-red-700" };
//       case "medium":
//         return { icon: AlertCircle, text: "Medium", bg: "bg-yellow-100", textColor: "text-yellow-700" };
//       default:
//         return { icon: Clock, text: "Low", bg: "bg-blue-100", textColor: "text-blue-700" };
//     }
//   };

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "No deadline";
//     const d = new Date(date);
//     const today = new Date();
//     const isOverdue = d < today && d.toDateString() !== today.toDateString();
//     const formatted = d.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//     return { formatted, isOverdue };
//   };

//   // Calculate progress percentage
//   const getProgress = (task) => {
//     if (!task.subTasks || task.subTasks.length === 0) {
//       return task.status === "completed" ? 100 : 0;
//     }
//     const completed = task.subTasks.filter(sub => sub.isCompleted === true || sub.completed === true).length;
//     return Math.round((completed / task.subTasks.length) * 100);
//   };

//   // Check if sub-task is completed
//   const isSubTaskCompleted = (subTask) => {
//     return subTask.isCompleted === true || subTask.completed === true;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-500">Loading tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                 <CheckSquare className="text-blue-600" size={28} />
//                 My Tasks
//               </h1>
//               <p className="text-gray-500 text-sm mt-1">Tasks assigned by admin</p>
//             </div>
//             <button
//               onClick={fetchTasks}
//               className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 transition-colors"
//             >
//               <RefreshCw size={18} />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="px-6 mt-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Tasks</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//               </div>
//               <CheckSquare className="w-8 h-8 text-blue-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
//               </div>
//               <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">In Progress</p>
//                 <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
//               </div>
//               <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Completed</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
//               </div>
//               <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="px-6 mt-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 placeholder="Search by title, description or admin name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               />
//             </div>
//             <div className="w-full md:w-48">
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               >
//                 <option value="">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tasks List */}
//       <div className="px-6 mt-6 pb-6">
//         {filteredTasks.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
//             <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No tasks found</p>
//             <p className="text-gray-400 text-sm mt-1">
//               {searchTerm || selectedStatus ? "Try changing your filters" : "No tasks assigned yet"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredTasks.map((task) => {
//               const status = getStatusBadge(task.status);
//               const priority = getPriorityBadge(task.priority);
//               const StatusIcon = status.icon;
//               const PriorityIcon = priority.icon;
//               const dueDate = formatDate(task.deadline);
//               const progress = getProgress(task);
//               const isExpanded = expandedTask === task._id;
              
//               return (
//                 <div
//                   key={task._id}
//                   className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
//                 >
//                   {/* Task Header */}
//                   <div className="p-5 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task._id)}>
//                     <div className="flex flex-wrap items-start justify-between gap-3">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 flex-wrap">
//                           <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
//                           <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
//                             <StatusIcon size={12} />
//                             {status.text}
//                           </span>
//                           <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.textColor}`}>
//                             <PriorityIcon size={12} />
//                             {priority.text}
//                           </span>
//                         </div>
                        
//                         <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
//                           <div className="flex items-center gap-1">
//                             <User size={14} />
//                             <span>Assigned by: {task.assignedBy?.name || "Admin"}</span>
//                           </div>
//                           {task.subject && (
//                             <div className="flex items-center gap-1">
//                               <BookOpen size={14} />
//                               <span>Subject: {task.subject.name || task.subject}</span>
//                             </div>
//                           )}
//                           <div className={`flex items-center gap-1 ${dueDate.isOverdue ? "text-red-500" : ""}`}>
//                             <Calendar size={14} />
//                             <span>Due: {dueDate.formatted}</span>
//                             {dueDate.isOverdue && <span className="text-xs ml-1">(Overdue)</span>}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-3">
//                         <div className="w-32">
//                           <div className="flex justify-between text-xs text-gray-500 mb-1">
//                             <span>Progress</span>
//                             <span>{progress}%</span>
//                           </div>
//                           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-blue-500 rounded-full transition-all duration-300"
//                               style={{ width: `${progress}%` }}
//                             />
//                           </div>
//                         </div>
                        
//                         <button className="text-gray-400 hover:text-gray-600">
//                           {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Task Body (Expanded) */}
//                   {isExpanded && (
//                     <div className="px-5 pb-5 pt-2 border-t border-gray-100">
//                       {/* Description */}
//                       {task.description && (
//                         <div className="mb-4">
//                           <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
//                           <p className="text-gray-600 text-sm">{task.description}</p>
//                         </div>
//                       )}
                      
//                       {/* Sub-tasks - ✅ ONCE COMPLETED, CANNOT UNCHECK */}
//                       {task.subTasks && task.subTasks.length > 0 && (
//                         <div className="mb-4">
//                           <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <ListChecks size={14} />
//                             Sub-tasks
//                             <span className="text-xs text-gray-400">
//                               ({task.subTasks.filter(s => isSubTaskCompleted(s)).length}/{task.subTasks.length} completed)
//                             </span>
//                           </h4>
//                           <div className="space-y-2">
//                             {task.subTasks.map((subTask, idx) => {
//                               const isCompleted = isSubTaskCompleted(subTask);
//                               const isUpdating = updatingSubTask === `${task._id}-${subTask._id}`;
                              
//                               return (
//                                 <div key={subTask._id || idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
//                                   <button
//                                     onClick={() => {
//                                       // ✅ Only allow if NOT completed
//                                       if (!isCompleted) {
//                                         markSubTaskComplete(task._id, subTask._id);
//                                       }
//                                     }}
//                                     disabled={isUpdating || isCompleted}
//                                     className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
//                                   >
//                                     {isUpdating ? (
//                                       <Loader2 size={16} className="animate-spin text-blue-500" />
//                                     ) : isCompleted ? (
//                                       <CheckCircle size={18} className="text-green-500" />
//                                     ) : (
//                                       <div className="w-4 h-4 border-2 border-gray-300 rounded-full hover:border-blue-500 transition" />
//                                     )}
//                                   </button>
//                                   <span className={`text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}>
//                                     {subTask.text || subTask.title || "Untitled sub-task"}
//                                   </span>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* Action Buttons */}
//                       <div className="flex gap-3 pt-2">
//                         {task.status !== "completed" && (
//                           <>
//                             <button
//                               onClick={() => updateTaskStatus(task._id, "in-progress")}
//                               disabled={updating}
//                               className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
//                             >
//                               <Clock size={14} />
//                               Mark In Progress
//                             </button>
//                             <button
//                               onClick={() => updateTaskStatus(task._id, "completed")}
//                               disabled={updating}
//                               className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
//                             >
//                               <CheckCircle size={14} />
//                               Mark Completed
//                             </button>
//                           </>
//                         )}
//                         {task.status === "completed" && (
//                           <div className="text-sm text-green-600 flex items-center gap-1">
//                             <CheckCircle size={14} />
//                             Task completed
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


















































"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  User,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Flag,
  ListChecks
} from "lucide-react";
import { fetchTasks, updateTaskStatus, markSubTaskComplete } from "@/services/teacher/taskService";
import toast from "react-hot-toast";

export default function TeacherTasksPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [updatingSubTask, setUpdatingSubTask] = useState(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");
    
    if (!token || userRole !== "teacher") {
      router.push("/login");
      return;
    }
    
    setTeacherId(userId);
  }, [router]);

  // React Query: Fetch tasks
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["teacherTasks", teacherId],
    queryFn: () => fetchTasks(teacherId),
    enabled: !!teacherId,
    staleTime: 30000, // 30 seconds
  });

  const tasks = tasksData?.data || [];
  
  // Calculate stats dynamically
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
  };

  // Filter tasks
  let filteredTasks = tasks;
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(t =>
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (selectedStatus) {
    filteredTasks = filteredTasks.filter(t => t.status === selectedStatus);
  }

  // Mutation: Update task status
  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherTasks", teacherId] });
      toast.success("Task status updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update status");
    },
  });

  // Mutation: Mark sub-task complete
  const subTaskMutation = useMutation({
    mutationFn: ({ taskId, subTaskId, subTasks, newStatus }) =>
      markSubTaskComplete(taskId, subTaskId, subTasks, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacherTasks", teacherId] });
      setUpdatingSubTask(null);
      toast.success("Sub-task completed!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update sub-task");
      setUpdatingSubTask(null);
    },
  });

  // Handle task status update
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    statusMutation.mutate({ taskId, status: newStatus });
  };

  // Handle sub-task completion
  const handleMarkSubTaskComplete = (taskId, subTaskId) => {
    if (updatingSubTask === `${taskId}-${subTaskId}`) return;
    
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    
    const subTask = task.subTasks.find(sub => sub._id === subTaskId);
    if (subTask && (subTask.isCompleted === true || subTask.completed === true)) return;
    
    setUpdatingSubTask(`${taskId}-${subTaskId}`);
    
    // Prepare updated sub-tasks
    const updatedSubTasks = task.subTasks.map(sub => {
      if (sub._id === subTaskId) {
        return { ...sub, isCompleted: true, completed: true };
      }
      return sub;
    });
    
    const allCompleted = updatedSubTasks.every(sub => sub.isCompleted === true || sub.completed === true);
    const newTaskStatus = allCompleted ? "completed" : task.status;
    
    subTaskMutation.mutate({
      taskId,
      subTaskId,
      subTasks: updatedSubTasks,
      newStatus: newTaskStatus,
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "completed":
        return { icon: CheckCircle, text: "Completed", bg: "bg-green-100", textColor: "text-green-700" };
      case "in-progress":
        return { icon: Clock, text: "In Progress", bg: "bg-yellow-100", textColor: "text-yellow-700" };
      default:
        return { icon: AlertCircle, text: "Pending", bg: "bg-red-100", textColor: "text-red-700" };
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "high":
        return { icon: Flag, text: "High", bg: "bg-red-100", textColor: "text-red-700" };
      case "medium":
        return { icon: AlertCircle, text: "Medium", bg: "bg-yellow-100", textColor: "text-yellow-700" };
      default:
        return { icon: Clock, text: "Low", bg: "bg-blue-100", textColor: "text-blue-700" };
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "No deadline";
    const d = new Date(date);
    const today = new Date();
    const isOverdue = d < today && d.toDateString() !== today.toDateString();
    const formatted = d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return { formatted, isOverdue };
  };

  // Calculate progress percentage
  const getProgress = (task) => {
    if (!task.subTasks || task.subTasks.length === 0) {
      return task.status === "completed" ? 100 : 0;
    }
    const completed = task.subTasks.filter(sub => sub.isCompleted === true || sub.completed === true).length;
    return Math.round((completed / task.subTasks.length) * 100);
  };

  // Check if sub-task is completed
  const isSubTaskCompleted = (subTask) => {
    return subTask.isCompleted === true || subTask.completed === true;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error loading tasks</p>
          <p className="text-gray-500 text-sm">{error?.message || "Please try again"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="text-blue-600" size={28} />
                My Tasks
              </h1>
              <p className="text-gray-500 text-sm mt-1">Tasks assigned by admin</p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={statusMutation.isPending || subTaskMutation.isPending}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={statusMutation.isPending ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Tasks" value={stats.total} icon={<CheckSquare className="w-8 h-8 text-blue-500 opacity-50" />} />
          <StatCard title="Pending" value={stats.pending} icon={<AlertCircle className="w-8 h-8 text-red-500 opacity-50" />} textColor="text-red-600" />
          <StatCard title="In Progress" value={stats.inProgress} icon={<Clock className="w-8 h-8 text-yellow-500 opacity-50" />} textColor="text-yellow-600" />
          <StatCard title="Completed" value={stats.completed} icon={<CheckCircle className="w-8 h-8 text-green-500 opacity-50" />} textColor="text-green-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by title, description or admin name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="px-6 mt-6 pb-6">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tasks found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || selectedStatus ? "Try changing your filters" : "No tasks assigned yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const status = getStatusBadge(task.status);
              const priority = getPriorityBadge(task.priority);
              const StatusIcon = status.icon;
              const PriorityIcon = priority.icon;
              const dueDate = formatDate(task.deadline);
              const progress = getProgress(task);
              const isExpanded = expandedTask === task._id;
              
              return (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Task Header */}
                  <div className="p-5 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task._id)}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
                            <StatusIcon size={12} />
                            {status.text}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.textColor}`}>
                            <PriorityIcon size={12} />
                            {priority.text}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>Assigned by: {task.assignedBy?.name || "Admin"}</span>
                          </div>
                          {task.subject && (
                            <div className="flex items-center gap-1">
                              <BookOpen size={14} />
                              <span>Subject: {task.subject.name || task.subject}</span>
                            </div>
                          )}
                          <div className={`flex items-center gap-1 ${dueDate.isOverdue ? "text-red-500" : ""}`}>
                            <Calendar size={14} />
                            <span>Due: {dueDate.formatted}</span>
                            {dueDate.isOverdue && <span className="text-xs ml-1">(Overdue)</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <button className="text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Task Body (Expanded) */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                      {/* Description */}
                      {task.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                          <p className="text-gray-600 text-sm">{task.description}</p>
                        </div>
                      )}
                      
                      {/* Sub-tasks */}
                      {task.subTasks && task.subTasks.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <ListChecks size={14} />
                            Sub-tasks
                            <span className="text-xs text-gray-400">
                              ({task.subTasks.filter(s => isSubTaskCompleted(s)).length}/{task.subTasks.length} completed)
                            </span>
                          </h4>
                          <div className="space-y-2">
                            {task.subTasks.map((subTask, idx) => {
                              const isCompleted = isSubTaskCompleted(subTask);
                              const isUpdating = updatingSubTask === `${task._id}-${subTask._id}`;
                              
                              return (
                                <div key={subTask._id || idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition">
                                  <button
                                    onClick={() => {
                                      if (!isCompleted && !isUpdating) {
                                        handleMarkSubTaskComplete(task._id, subTask._id);
                                      }
                                    }}
                                    disabled={isUpdating || isCompleted || subTaskMutation.isPending}
                                    className="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUpdating ? (
                                      <Loader2 size={16} className="animate-spin text-blue-500" />
                                    ) : isCompleted ? (
                                      <CheckCircle size={18} className="text-green-500" />
                                    ) : (
                                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full hover:border-blue-500 transition" />
                                    )}
                                  </button>
                                  <span className={`text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}>
                                    {subTask.text || subTask.title || "Untitled sub-task"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        {task.status !== "completed" && (
                          <>
                            <button
                              onClick={() => handleUpdateTaskStatus(task._id, "in-progress")}
                              disabled={statusMutation.isPending}
                              className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {statusMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
                              Mark In Progress
                            </button>
                            <button
                              onClick={() => handleUpdateTaskStatus(task._id, "completed")}
                              disabled={statusMutation.isPending}
                              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle size={14} />
                              Mark Completed
                            </button>
                          </>
                        )}
                        {task.status === "completed" && (
                          <div className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle size={14} />
                            Task completed
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, textColor = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}