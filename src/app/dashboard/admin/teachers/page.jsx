// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { 
//   Users, Search, Loader2, Plus, Pencil, Trash2, 
//   CheckCircle, XCircle, Mail, Phone, BookOpen, 
//   UserCheck, UserX, AlertCircle, Sparkles, Eye, 
//   ChevronLeft, ChevronRight, Filter, X
// } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";

// export default function AdminTeachersPage() {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("approved");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTeacher, setEditingTeacher] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subjects: [],
//     status: "pending",
//     password: ""
//   });
//   const [subjectsList, setSubjectsList] = useState([]);

//   const limit = 10;

//   // Fetch subjects for dropdown
//   useQuery({
//     queryKey: ["subjects-list"],
//     queryFn: async () => {
//       const res = await fetch("/api/subjects");
//       const data = await res.json();
//       setSubjectsList(Array.isArray(data) ? data : []);
//       return data;
//     },
//   });

//   // Fetch teachers
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["teachers", searchTerm, page, statusFilter],
//     queryFn: async () => {
//       const res = await fetch(
//         `/api/admin/teachers?search=${searchTerm}&page=${page}&limit=${limit}&status=${statusFilter}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch");
//       return res.json();
//     },
//   });

//   const teachers = data?.teachers || [];
//   const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };
//   const aiAnalytics = data?.aiAnalytics || {};

//   // Approve/Update teacher mutation
//   const updateMutation = useMutation({
//     mutationFn: async ({ id, data }) => {
//       const res = await fetch(`/api/admin/teachers/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Teacher updated successfully!");
//       queryClient.invalidateQueries(["teachers"]);
//       setIsModalOpen(false);
//       setEditingTeacher(null);
//     },
//     onError: (err) => toast.error(err.message || "Update failed"),
//   });

//   // Delete teacher mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Teacher deleted successfully!");
//       queryClient.invalidateQueries(["teachers"]);
//     },
//     onError: (err) => toast.error(err.message || "Delete failed"),
//   });

//   const handleApprove = (teacher) => {
//     updateMutation.mutate({
//       id: teacher._id,
//       data: { status: "approved", subjects: teacher.subjects?.map(s => s._id || s) || [] }
//     });
//   };

//   const handleReject = (teacher) => {
//     updateMutation.mutate({
//       id: teacher._id,
//       data: { status: "rejected" }
//     });
//   };

//   const handleEdit = (teacher) => {
//     setEditingTeacher(teacher);
//     setFormData({
//       name: teacher.name || "",
//       email: teacher.email || "",
//       phone: teacher.phone || "",
//       subjects: teacher.subjects?.map(s => s._id || s) || [],
//       status: teacher.status || "pending",
//       password: ""
//     });
//     setIsModalOpen(true);
//   };

//   const handleUpdateSubmit = (e) => {
//     e.preventDefault();
//     updateMutation.mutate({
//       id: editingTeacher._id,
//       data: {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         subjects: formData.subjects,
//         status: formData.status,
//         ...(formData.password && { password: formData.password })
//       }
//     });
//   };

//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "approved": return <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle size={12} /> Approved</span>;
//       case "pending": return <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full"><AlertCircle size={12} /> Pending</span>;
//       case "rejected": return <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full"><XCircle size={12} /> Rejected</span>;
//       default: return <span className="text-xs text-gray-500">{status}</span>;
//     }
//   };

//   const getMoraleColor = (status) => {
//     switch(status) {
//       case "EXCELLENT": return "text-green-600 bg-green-50";
//       case "WARNING": return "text-yellow-600 bg-yellow-50";
//       case "CRITICAL": return "text-red-600 bg-red-50";
//       default: return "text-blue-600 bg-blue-50";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
//               <Users size={28} className="text-indigo-600" />
//               Teacher Management
//             </h1>
//             <p className="text-slate-500 text-sm mt-1">Manage, approve and monitor faculty members</p>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search teachers..."
//                 className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                 value={searchTerm}
//                 onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
//               />
//             </div>
//             <select
//               className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//               value={statusFilter}
//               onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
//             >
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         {/* AI Analytics Banner */}
//         {aiAnalytics.systemStatus && (
//           <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
//             <div className="flex items-center gap-2 mb-2">
//               <Sparkles size={18} className="text-indigo-600" />
//               <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Workforce Analytics</span>
//             </div>
//             <p className="text-sm text-slate-700">{aiAnalytics.globalRatioSummary}</p>
//             {aiAnalytics.instantOperationsTriggers?.length > 0 && (
//               <div className="mt-3 pt-2 border-t border-indigo-100">
//                 <p className="text-xs font-semibold text-indigo-600 mb-1">System Alerts:</p>
//                 {aiAnalytics.instantOperationsTriggers.slice(0, 2).map((alert, i) => (
//                   <p key={i} className="text-xs text-slate-600 flex items-start gap-1">
//                     <AlertCircle size={10} className="mt-0.5 text-yellow-500" /> {alert}
//                   </p>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Teachers Grid */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="animate-spin text-indigo-600" size={40} />
//           </div>
//         ) : teachers.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
//             <Users size={48} className="mx-auto text-slate-300 mb-4" />
//             <p className="text-slate-500">No teachers found</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {teachers.map((teacher) => (
//               <motion.div
//                 key={teacher._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
//               >
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 border-b border-slate-100">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-bold text-lg text-slate-800">{teacher.name}</h3>
//                       <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
//                         <Mail size={12} /> {teacher.email}
//                       </p>
//                       {teacher.phone && (
//                         <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
//                           <Phone size={12} /> {teacher.phone}
//                         </p>
//                       )}
//                     </div>
//                     {getStatusBadge(teacher.status)}
//                   </div>
//                 </div>

//                 {/* Body */}
//                 <div className="p-5 space-y-3">
//                   <div>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
//                       <BookOpen size={10} /> Subjects
//                     </p>
//                     <div className="flex flex-wrap gap-1.5 mt-1">
//                       {teacher.subjects?.length > 0 ? (
//                         teacher.subjects.map((sub, i) => (
//                           <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
//                             {typeof sub === 'object' ? sub.name : sub}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-xs text-slate-400">No subjects assigned</span>
//                       )}
//                     </div>
//                   </div>

//                   {/* AI Evaluation (if available) */}
//                   {teacher.aiEvaluation && (
//                     <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Sparkles size={12} className="text-indigo-500" />
//                         <span className="text-[9px] font-bold text-indigo-600 uppercase">AI Performance</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getMoraleColor(teacher.aiEvaluation.moraleStatus)}`}>
//                           {teacher.aiEvaluation.moraleStatus}
//                         </div>
//                         <span className="text-xs text-slate-600">Score: {teacher.aiEvaluation.performanceScore}</span>
//                       </div>
//                       <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{teacher.aiEvaluation.diagnosticSummary}</p>
//                     </div>
//                   )}

//                   {/* Online Status */}
//                   <div className="flex items-center justify-between pt-2">
//                     <div className="flex items-center gap-1">
//                       <div className={`w-2 h-2 rounded-full ${teacher.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//                       <span className="text-xs text-slate-500">{teacher.isOnline ? 'Online' : 'Offline'}</span>
//                     </div>
//                     <div className="flex gap-2">
//                       {teacher.status === "pending" && (
//                         <>
//                           <button
//                             onClick={() => handleApprove(teacher)}
//                             className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
//                             title="Approve"
//                           >
//                             <CheckCircle size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleReject(teacher)}
//                             className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
//                             title="Reject"
//                           >
//                             <XCircle size={16} />
//                           </button>
//                         </>
//                       )}
//                       <button
//                         onClick={() => handleEdit(teacher)}
//                         className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition"
//                         title="Edit"
//                       >
//                         <Pencil size={16} />
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (confirm("Delete this teacher?")) deleteMutation.mutate(teacher._id);
//                         }}
//                         className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
//                         title="Delete"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="flex justify-center items-center gap-3 mt-8">
//             <button
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
//             >
//               <ChevronLeft size={18} />
//             </button>
//             <span className="text-sm text-slate-600">
//               Page {pagination.page} of {pagination.totalPages}
//             </span>
//             <button
//               onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
//               disabled={page === pagination.totalPages}
//               className="p-2 rounded-lg border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       <AnimatePresence>
//         {isModalOpen && editingTeacher && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
//             >
//               <div className="flex justify-between items-center mb-5">
//                 <h3 className="text-xl font-bold text-slate-800">Edit Teacher</h3>
//                 <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
//                   <X size={20} />
//                 </button>
//               </div>
//               <form onSubmit={handleUpdateSubmit} className="space-y-4">
//                 <div>
//                   <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email</label>
//                   <input
//                     type="email"
//                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Phone</label>
//                   <input
//                     type="tel"
//                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subjects</label>
//                   <select
//                     multiple
//                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                     value={formData.subjects}
//                     onChange={(e) => setFormData({
//                       ...formData,
//                       subjects: Array.from(e.target.selectedOptions, option => option.value)
//                     })}
//                   >
//                     {subjectsList.map((sub) => (
//                       <option key={sub._id} value={sub._id}>{sub.name}</option>
//                     ))}
//                   </select>
//                   <p className="text-[10px] text-slate-400 mt-1">Hold Ctrl to select multiple</p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Status</label>
//                   <select
//                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                     value={formData.status}
//                     onChange={(e) => setFormData({...formData, status: e.target.value})}
//                   >
//                     <option value="approved">Approved</option>
//                     <option value="pending">Pending</option>
//                     <option value="rejected">Rejected</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">New Password (Optional)</label>
//                   <input
//                     type="password"
//                     className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
//                     placeholder="Leave blank to keep current"
//                     value={formData.password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50">Cancel</button>
//                   <button type="submit" disabled={updateMutation.isPending} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50">
//                     {updateMutation.isPending ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Update Teacher"}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



















// // deepsec
// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { 
//   Users, Search, Loader2, Pencil, Trash2, 
//   CheckCircle, XCircle, Mail, Phone, BookOpen, 
//   AlertCircle, Sparkles, Eye, 
//   ChevronLeft, ChevronRight, X, IdCard,
//   GraduationCap, Building, Award, RefreshCw,
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";

// // Custom Components
// const StatCard = ({ icon: Icon, label, value, color }) => (
//   <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
//     <div className="flex items-center gap-3">
//       <div className={`p-2 rounded-lg ${color}`}>
//         <Icon size={20} className="text-white" />
//       </div>
//       <div>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//         <p className="text-xs text-gray-500">{label}</p>
//       </div>
//     </div>
//   </div>
// );

// const EmptyState = ({ icon: Icon, title, description }) => (
//   <div className="text-center py-16">
//     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//       <Icon size={32} className="text-gray-400" />
//     </div>
//     <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
//     <p className="text-sm text-gray-500">{description}</p>
//   </div>
// );

// const Badge = ({ children, variant = "default" }) => {
//   const variants = {
//     success: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     warning: "bg-amber-50 text-amber-700 border-amber-200",
//     danger: "bg-red-50 text-red-700 border-red-200",
//     default: "bg-gray-50 text-gray-700 border-gray-200",
//     info: "bg-blue-50 text-blue-700 border-blue-200",
//   };
  
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
//       {children}
//     </span>
//   );
// };

// export default function AdminTeachersPage() {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("pending");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState("edit");
//   const [editingTeacher, setEditingTeacher] = useState(null);
//   const [viewingCard, setViewingCard] = useState(null);
//   const [isCardModalOpen, setIsCardModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subjects: [],
//     status: "pending",
//     password: "",
   
//     qualification: ""
//   });
//   const [subjectsList, setSubjectsList] = useState([]);
//   const limit = 10;

//   // Fetch subjects
//   useQuery({
//     queryKey: ["subjects-list"],
//     queryFn: async () => {
//       const res = await fetch("/api/subjects");
//       const data = await res.json();
//       setSubjectsList(Array.isArray(data) ? data : []);
//       return data;
//     },
//   });

//   // Fetch teachers
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["teachers", searchTerm, page, statusFilter],
//     queryFn: async () => {
//       const res = await fetch(
//         `/api/admin/teachers?search=${searchTerm}&page=${page}&limit=${limit}&status=${statusFilter}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch");
//       return res.json();
//     },
//   });

//   const teachers = data?.teachers || [];
//   const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };
//   const stats = data?.stats || { total: 0, approved: 0, pending: 0, rejected: 0 };

//   // Get all assigned subject IDs from approved teachers
//   const getAssignedSubjectIds = (excludeTeacherId) => {
//     const assignedIds = new Set();
//     teachers.forEach(teacher => {
//       if (teacher.status === "approved" && teacher._id !== excludeTeacherId) {
//         teacher.subjects?.forEach(sub => {
//           const subId = typeof sub === 'object' ? sub._id : sub;
//           assignedIds.add(subId);
//         });
//       }
//     });
//     return assignedIds;
//   };

//   // Mutations
//   const approveMutation = useMutation({
//     mutationFn: async ({ id, data }) => {
//       const res = await fetch(`/api/admin/teachers/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) throw new Error("Approval failed");
//       return res.json();
//     },
//     onSuccess: (data) => {
//       toast.success(data.message || "Teacher approved successfully!");
//       queryClient.invalidateQueries(["teachers"]);
//       setIsModalOpen(false);
//       setEditingTeacher(null);
//     },
//     onError: (err) => {
//       toast.error(err.message || "Approval failed");
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: async ({ id, data }) => {
//       const res = await fetch(`/api/admin/teachers/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) throw new Error("Update failed");
//       return res.json();
//     },
//     onSuccess: (data) => {
//       toast.success(data.message || "Teacher updated successfully!");
//       queryClient.invalidateQueries(["teachers"]);
//       setIsModalOpen(false);
//       setEditingTeacher(null);
//     },
//     onError: (err) => {
//       toast.error(err.message || "Update failed");
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (id) => {
//       const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Delete failed");
//       return res.json();
//     },
//     onSuccess: (data) => {
//       toast.success(data.message || "Teacher deleted successfully!");
//       queryClient.invalidateQueries(["teachers"]);
//     },
//     onError: (err) => {
//       toast.error(err.message || "Delete failed");
//     },
//   });

//   // Handlers
//   const handleApproveClick = (teacher) => {
//     setEditingTeacher(teacher);
//     setModalMode("approve");
//     setFormData({
//       name: teacher.name || "",
//       email: teacher.email || "",
//       phone: teacher.phone || "",
//       subjects: teacher.subjects?.map(s => s._id || s) || [],
//       status: "approved",
//       password: "",
      
//       qualification: teacher.qualification || ""
//     });
//     setIsModalOpen(true);
//   };

//   const handleReject = (teacher) => {
//     toast((t) => (
//       <div className="flex items-center gap-3">
//         <div className="flex-1">
//           <p className="font-medium text-sm">Reject Teacher?</p>
//           <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               updateMutation.mutate({
//                 id: teacher._id,
//                 data: { status: "rejected" }
//               });
//             }}
//             className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
//           >
//             Yes, Reject
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), {
//       duration: 5000,
//       position: "top-center",
//     });
//   };

//   const handleEdit = (teacher) => {
//     setEditingTeacher(teacher);
//     setModalMode("edit");
//     setFormData({
//       name: teacher.name || "",
//       email: teacher.email || "",
//       phone: teacher.phone || "",
//       subjects: teacher.subjects?.map(s => s._id || s) || [],
//       status: teacher.status || "approved",
//       password: "",
     
//       qualification: teacher.qualification || ""
//     });
//     setIsModalOpen(true);
//   };

//   const toggleSubject = (subjectId) => {
//     setFormData(prev => {
//       const isSelected = prev.subjects.includes(subjectId);
//       return {
//         ...prev,
//         subjects: isSelected 
//           ? prev.subjects.filter(id => id !== subjectId)
//           : [...prev.subjects, subjectId]
//       };
//     });
//   };

//   const handleModalSubmit = (e) => {
//     e.preventDefault();
    
//     if (modalMode === "approve") {
//       const loadingToast = toast.loading("Approving teacher...");
      
//       approveMutation.mutate({
//         id: editingTeacher._id,
//         data: { 
//           status: "approved",
//           subjects: formData.subjects,
         
//           qualification: formData.qualification,
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           ...(formData.password && { password: formData.password })
//         }
//       }, {
//         onSettled: () => {
//           toast.dismiss(loadingToast);
//         }
//       });
//     } else {
//       const loadingToast = toast.loading("Updating teacher...");
      
//       updateMutation.mutate({
//         id: editingTeacher._id,
//         data: { 
//           ...formData, 
//           ...(formData.password && { password: formData.password }),
//           subjects: formData.subjects 
//         }
//       }, {
//         onSettled: () => {
//           toast.dismiss(loadingToast);
//         }
//       });
//     }
//   };

//   const handleDelete = (teacher) => {
//     toast((t) => (
//       <div className="flex items-center gap-3">
//         <div className="flex-1">
//           <p className="font-medium text-sm">Delete Teacher?</p>
//           <p className="text-xs text-gray-500 mt-0.5">This action is permanent and cannot be undone.</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               const loadingToast = toast.loading("Deleting teacher...");
//               deleteMutation.mutate(teacher._id, {
//                 onSettled: () => {
//                   toast.dismiss(loadingToast);
//                 }
//               });
//             }}
//             className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), {
//       duration: 5000,
//       position: "top-center",
//     });
//   };

//   const viewIDCard = async (teacher) => {
//     try {
//       const loadingToast = toast.loading("Loading ID Card...");
      
//       const res = await fetch(`/api/admin/teacher-id-card?teacherId=${teacher._id}`);
//       const data = await res.json();
      
//       toast.dismiss(loadingToast);
      
//       if (data.success) {
//         setViewingCard({ teacher, card: data.card });
//         setIsCardModalOpen(true);
//         toast.success("ID Card loaded!");
//       } else {
//         toast.error(data.message || "ID Card not found");
//       }
//     } catch (error) {
//       toast.error("Failed to fetch ID card");
//     }
//   };

//   const handleRefresh = () => {
//     refetch();
//     toast.success("Data refreshed!");
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       approved: { icon: CheckCircle, variant: "success", label: "Approved" },
//       pending: { icon: AlertCircle, variant: "warning", label: "Pending" },
//       rejected: { icon: XCircle, variant: "danger", label: "Rejected" },
//     };
//     return configs[status] || configs.pending;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Simple Toast Container - Professional Style */}
//       <Toaster position="top-right" />
      
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
//               <p className="text-sm text-gray-500 mt-1">Manage faculty members and approvals</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleRefresh}
//                 className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//                 title="Refresh Data"
//               >
//                 <RefreshCw size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <StatCard icon={Users} label="Total Teachers" value={stats.total || 0} color="bg-blue-500" />
//           <StatCard icon={CheckCircle} label="Approved" value={stats.approved || 0} color="bg-emerald-500" />
//           <StatCard icon={AlertCircle} label="Pending" value={stats.pending || 0} color="bg-amber-500" />
//           <StatCard icon={XCircle} label="Rejected" value={stats.rejected || 0} color="bg-red-500" />
//         </div>

//         {/* Filters & Search */}
//         <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email or subject..."
//                 className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text"
//                 value={searchTerm}
//                 onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
//               />
//             </div>
//             <div className="flex gap-2">
//               {["pending", "approved", "rejected"].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => { setStatusFilter(status); setPage(1); }}
//                   className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
//                     statusFilter === status
//                       ? "bg-gray-900 text-white shadow-md"
//                       : "bg-gray-50 text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Teachers Table */}
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="animate-spin text-blue-500" size={32} />
//             </div>
//           ) : teachers.length === 0 ? (
//             <EmptyState 
//               icon={Users} 
//               title="No teachers found" 
//               description="Try adjusting your search or filters"
//             />
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-gray-100 bg-gray-50/50">
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Online</th>
//                       <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {teachers.map((teacher) => {
//                       const statusConfig = getStatusConfig(teacher.status);
//                       const StatusIcon = statusConfig.icon;
                      
//                       return (
//                         <tr key={teacher._id} className="hover:bg-gray-50/50 transition-colors group">
//                           <td className="p-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
//                                 {teacher.name?.charAt(0).toUpperCase()}
//                               </div>
//                               <div>
//                                 <p className="font-medium text-gray-900 text-sm">{teacher.name}</p>
//                                 <p className="text-xs text-gray-500">{teacher.email}</p>
//                               </div>
//                             </div>
//                           </td>
                          
//                           <td className="p-4">
//                             <div className="flex flex-wrap gap-1">
//                               {teacher.subjects?.slice(0, 3).map((sub, i) => (
//                                 <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
//                                   {typeof sub === 'object' ? sub.name : sub}
//                                 </span>
//                               ))}
//                               {teacher.subjects?.length > 3 && (
//                                 <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
//                                   +{teacher.subjects.length - 3} more
//                                 </span>
//                               )}
//                               {(!teacher.subjects || teacher.subjects.length === 0) && (
//                                 <span className="text-xs text-gray-400 italic">No subjects</span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <Badge variant={statusConfig.variant}>
//                               <StatusIcon size={12} />
//                               {statusConfig.label}
//                             </Badge>
//                           </td>
//                           <td className="p-4">
//                             <div className="flex items-center gap-2">
//                               <div className={`w-2 h-2 rounded-full ${teacher.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
//                               <span className="text-xs text-gray-500">
//                                 {teacher.isOnline ? 'Online' : 'Offline'}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div className="flex items-center justify-end gap-1">
//                               {teacher.status === "pending" && (
//                                 <>
//                                   <button
//                                     onClick={() => handleApproveClick(teacher)}
//                                     className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
//                                     title="Approve Teacher (Assign Subjects)"
//                                   >
//                                     <CheckCircle size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleReject(teacher)}
//                                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
//                                     title="Reject Teacher"
//                                   >
//                                     <XCircle size={16} />
//                                   </button>
//                                 </>
//                               )}
                              
//                               {teacher.status === "approved" && (
//                                 <>
//                                   <button
//                                     onClick={() => viewIDCard(teacher)}
//                                     className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
//                                     title="View ID Card"
//                                   >
//                                     <IdCard size={16} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleEdit(teacher)}
//                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
//                                     title="Edit Teacher"
//                                   >
//                                     <Pencil size={16} />
//                                   </button>
//                                 </>
//                               )}
                              
//                               <button
//                                 onClick={() => handleDelete(teacher)}
//                                 className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
//                                 title="Delete Teacher"
//                               >
//                                 <Trash2 size={16} />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
//                   <p className="text-sm text-gray-500">
//                     Showing {((pagination.page - 1) * limit) + 1} to {Math.min(pagination.page * limit, pagination.total)} of {pagination.total} teachers
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setPage(p => Math.max(1, p - 1))}
//                       disabled={page === 1}
//                       className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors bg-white cursor-pointer"
//                     >
//                       <ChevronLeft size={16} />
//                     </button>
//                     <span className="text-sm text-gray-700 font-medium px-3">
//                       Page {pagination.page} of {pagination.totalPages}
//                     </span>
//                     <button
//                       onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
//                       disabled={page === pagination.totalPages}
//                       className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors bg-white cursor-pointer"
//                     >
//                       <ChevronRight size={16} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modal - Approve / Edit */}
//       <AnimatePresence>
//         {isModalOpen && editingTeacher && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     {modalMode === "approve" ? "Approve Teacher & Assign Subjects" : "Edit Teacher"}
//                   </h2>
//                   <p className="text-xs text-gray-500 mt-0.5">
//                     {modalMode === "approve" 
//                       ? "Assign subjects and approve this teacher" 
//                       : "Update teacher information and subject assignments"
//                     }
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => setIsModalOpen(false)} 
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
//                 >
//                   <X size={18} className="text-gray-400" />
//                 </button>
//               </div>
              
//               <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
//                 {modalMode === "approve" && (
//                   <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
//                         {editingTeacher.name?.charAt(0).toUpperCase()}
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{editingTeacher.name}</h3>
//                         <p className="text-xs text-gray-500">{editingTeacher.email}</p>
//                         {editingTeacher.phone && (
//                           <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                             <Phone size={10} /> {editingTeacher.phone}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     required
//                     placeholder="Enter full name"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-text"
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                     required
//                     placeholder="Enter email address"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
//                     <input
//                       type="tel"
//                       className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-text"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                       placeholder="Phone number"
//                     />
//                   </div>
                  
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualification</label>
//                     <input
//                       type="text"
//                       className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-text"
//                       value={formData.qualification}
//                       onChange={(e) => setFormData({...formData, qualification: e.target.value})}
//                       placeholder="e.g., MSc, BEd"
//                     />
//                   </div>
//                 </div>
                
//                 {/* Subjects Selection - Chips Style */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <BookOpen size={14} className="inline mr-1.5" />
//                     Subjects
//                     <span className="text-xs text-gray-400 ml-2">
//                       ({formData.subjects.length} selected)
//                     </span>
//                   </label>
                  
//                   {subjectsList.length === 0 ? (
//                     <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
//                       <BookOpen size={24} className="mx-auto text-gray-300 mb-2" />
//                       <p className="text-sm text-gray-400">No subjects available</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
//                       {subjectsList.map((subject) => {
//                         const isSelected = formData.subjects.includes(subject._id);
//                         const isAssignedToOther = getAssignedSubjectIds(editingTeacher._id).has(subject._id);
//                         const isDisabled = isAssignedToOther && !isSelected;
                        
//                         return (
//                           <button
//                             key={subject._id}
//                             type="button"
//                             onClick={() => {
//                               if (!isDisabled) {
//                                 toggleSubject(subject._id);
//                               }
//                             }}
//                             disabled={isDisabled}
//                             className={`
//                               px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
//                               ${isSelected 
//                                 ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 cursor-pointer' 
//                                 : isDisabled
//                                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through opacity-60'
//                                   : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600 cursor-pointer hover:shadow-sm'
//                               }
//                             `}
//                             title={isDisabled ? 'This subject is already assigned to another teacher' : `Click to ${isSelected ? 'remove' : 'assign'} ${subject.name}`}
//                           >
//                             {isSelected && (
//                               <CheckCircle size={10} className="inline mr-1" />
//                             )}
//                             {subject.name}
//                             {isDisabled && (
//                               <span className="ml-1 text-[10px]">(assigned)</span>
//                             )}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                   <p className="text-[11px] text-gray-400 mt-1.5">
//                     {modalMode === "approve" 
//                       ? "Select subjects to assign before approving. Strikethrough subjects are already taken."
//                       : "Click on subjects to select or deselect. Strikethrough subjects are already assigned to other teachers."
//                     }
//                   </p>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                     New Password 
//                     <span className="text-xs text-gray-400 ml-1">(optional - leave empty to keep current)</span>
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-text"
//                     placeholder="Enter new password only if you want to change"
//                     value={formData.password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   />
//                 </div>
                
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={approveMutation.isPending || updateMutation.isPending}
//                     className={`flex-1 py-2.5 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
//                       modalMode === "approve" 
//                         ? "bg-emerald-600 hover:bg-emerald-700" 
//                         : "bg-gray-900 hover:bg-gray-800"
//                     }`}
//                   >
//                     {(approveMutation.isPending || updateMutation.isPending) ? (
//                       <>
//                         <Loader2 className="animate-spin" size={16} />
//                         {modalMode === "approve" ? "Approving..." : "Saving..."}
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle size={16} />
//                         {modalMode === "approve" ? "Approve Teacher" : "Save Changes"}
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* ID Card Modal */}
//       <AnimatePresence>
//         {isCardModalOpen && viewingCard && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsCardModalOpen(false)}>
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex items-center justify-between p-6 border-b border-gray-100">
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900">Teacher ID Card</h2>
//                   <p className="text-xs text-gray-500 mt-0.5">Digital identification card</p>
//                 </div>
//                 <button 
//                   onClick={() => setIsCardModalOpen(false)} 
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
//                 >
//                   <X size={18} className="text-gray-400" />
//                 </button>
//               </div>
              
//               <div className="p-6">
//                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//                   <div className="text-center mb-6">
//                     {viewingCard.teacher.photoUrl ? (
//                       <img 
//                         src={viewingCard.teacher.photoUrl} 
//                         alt={viewingCard.teacher.name}
//                         className="w-20 h-20 mx-auto rounded-full object-cover ring-4 ring-white shadow-lg"
//                       />
//                     ) : (
//                       <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                         {viewingCard.teacher.name?.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                     <h3 className="font-semibold text-gray-900 mt-3">{viewingCard.teacher.name}</h3>
//                     <p className="text-sm text-gray-500">{viewingCard.teacher.email}</p>
//                   </div>
                  
//                   <div className="space-y-3">
//                     {[
//                       { label: "Teacher ID", value: viewingCard.card?.teacherCode, icon: IdCard },
//                       { label: "Qualification", value: viewingCard.teacher.qualification, icon: Award },
//                       { label: "Card Number", value: viewingCard.card?.cardNumber, icon: IdCard },
//                     ].map((item, i) => (
//                       <div key={i} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
//                         <span className="text-sm text-gray-500 flex items-center gap-2">
//                           <item.icon size={14} />
//                           {item.label}
//                         </span>
//                         <span className="text-sm font-medium text-gray-900">{item.value || "N/A"}</span>
//                       </div>
//                     ))}
//                   </div>
                  
//                   {viewingCard.card?.qrCodeData && (
//                     <div className="mt-6 pt-4 border-t border-blue-200 text-center">
//                       <img src={viewingCard.card.qrCodeData} alt="QR Code" className="w-24 h-24 mx-auto" />
//                       <p className="text-xs text-gray-400 mt-2">Scan for verification</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }





























































"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, Search, Loader2, Pencil, Trash2, 
  CheckCircle, XCircle, Mail, Phone, BookOpen, 
  AlertCircle, Eye, 
  ChevronLeft, ChevronRight, X, IdCard,
  GraduationCap, Building, Award, RefreshCw,
  Download, Printer
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Custom Components
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
};

export default function AdminTeachersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingCard, setViewingCard] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subjects: [],
    status: "pending",
    password: "",
    qualification: "",
    teachingLevel: ""
  });
  const [subjectsList, setSubjectsList] = useState([]);
  const limit = 10;

  // Fetch subjects
  useQuery({
    queryKey: ["subjects-list"],
    queryFn: async () => {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjectsList(Array.isArray(data) ? data : []);
      return data;
    },
  });

  // Fetch teachers
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["teachers", searchTerm, page, statusFilter],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/teachers?search=${searchTerm}&page=${page}&limit=${limit}&status=${statusFilter}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const teachers = data?.teachers || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };
  const stats = data?.stats || { total: 0, approved: 0, pending: 0, rejected: 0 };

  const getAssignedSubjectIds = (excludeTeacherId) => {
    const assignedIds = new Set();
    teachers.forEach(teacher => {
      if (teacher.status === "approved" && teacher._id !== excludeTeacherId) {
        teacher.subjects?.forEach(sub => {
          const subId = typeof sub === 'object' ? sub._id : sub;
          assignedIds.add(subId);
        });
      }
    });
    return assignedIds;
  };

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Approval failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Teacher approved successfully!");
      queryClient.invalidateQueries(["teachers"]);
      setIsModalOpen(false);
      setEditingTeacher(null);
    },
    onError: (err) => toast.error(err.message || "Approval failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Teacher updated successfully!");
      queryClient.invalidateQueries(["teachers"]);
      setIsModalOpen(false);
      setEditingTeacher(null);
    },
    onError: (err) => toast.error(err.message || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "Teacher deleted successfully!");
      queryClient.invalidateQueries(["teachers"]);
    },
    onError: (err) => toast.error(err.message || "Delete failed"),
  });

  const handleApproveClick = (teacher) => {
    setEditingTeacher(teacher);
    setModalMode("approve");
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      subjects: teacher.subjects?.map(s => s._id || s) || [],
      status: "approved",
      password: "",
      qualification: teacher.qualification || "",
      teachingLevel: teacher.teachingLevel || ""
    });
    setIsModalOpen(true);
  };

  const handleReject = (teacher) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium text-sm">Reject Teacher?</p>
          <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { toast.dismiss(t.id); updateMutation.mutate({ id: teacher._id, data: { status: "rejected" } }); }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium">Yes, Reject</button>
          <button onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium">Cancel</button>
        </div>
      </div>
    ), { duration: 5000, position: "top-center" });
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setModalMode("edit");
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      subjects: teacher.subjects?.map(s => s._id || s) || [],
      status: teacher.status || "approved",
      password: "",
      qualification: teacher.qualification || "",
      teachingLevel: teacher.teachingLevel || ""
    });
    setIsModalOpen(true);
  };

  const toggleSubject = (subjectId) => {
    setFormData(prev => {
      const isSelected = prev.subjects.includes(subjectId);
      return { ...prev, subjects: isSelected ? prev.subjects.filter(id => id !== subjectId) : [...prev.subjects, subjectId] };
    });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === "approve") {
      const loadingToast = toast.loading("Approving teacher...");
      approveMutation.mutate({
        id: editingTeacher._id,
        data: { 
          status: "approved",
          subjects: formData.subjects,
          qualification: formData.qualification,
          teachingLevel: formData.teachingLevel,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          ...(formData.password && { password: formData.password })
        }
      }, { onSettled: () => toast.dismiss(loadingToast) });
    } else {
      const loadingToast = toast.loading("Updating teacher...");
      updateMutation.mutate({
        id: editingTeacher._id,
        data: { 
          ...formData, 
          ...(formData.password && { password: formData.password }),
          subjects: formData.subjects 
        }
      }, { onSettled: () => toast.dismiss(loadingToast) });
    }
  };

  const handleDelete = (teacher) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium text-sm">Delete Teacher?</p>
          <p className="text-xs text-gray-500 mt-0.5">This action is permanent and cannot be undone.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { toast.dismiss(t.id); const lt = toast.loading("Deleting..."); deleteMutation.mutate(teacher._id, { onSettled: () => toast.dismiss(lt) }); }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium">Delete</button>
          <button onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium">Cancel</button>
        </div>
      </div>
    ), { duration: 5000, position: "top-center" });
  };

  const viewIDCard = async (teacher) => {
    try {
      const loadingToast = toast.loading("Loading ID Card...");
      const res = await fetch(`/api/admin/teacher-id-cards?teacherId=${teacher._id}`);
      const data = await res.json();
      toast.dismiss(loadingToast);
      
      if (data.success) {
        setViewingCard({ teacher, card: data.card || data.data });
        setIsCardModalOpen(true);
      } else {
        toast.error(data.message || "ID Card not found");
      }
    } catch (error) {
      toast.error("Failed to fetch ID card");
    }
  };

  const generateIDCard = async (teacher) => {
    try {
      const loadingToast = toast.loading("Generating ID Card...");
      const res = await fetch(`/api/admin/teacher-id-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: teacher._id })
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      
      if (data.success) {
        setViewingCard({ teacher, card: data.card });
        setIsCardModalOpen(true);
        toast.success("ID Card generated!");
        refetch();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (error) {
      toast.error("Failed to generate ID card");
    }
  };

  const downloadIDCard = (card) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>ID Card - ${card.teacher?.name}</title>
      <style>
        body { margin:0; padding:20px; display:flex; justify-content:center; background:#f0f0f0; font-family:Arial; }
        .card { width:380px; background:linear-gradient(135deg,#4c1d95,#5b21b6); border-radius:16px; padding:24px; color:white; }
        .header { text-align:center; border-bottom:1px solid rgba(255,255,255,0.3); padding-bottom:12px; margin-bottom:16px; }
        .photo { width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid gold; margin:0 auto; display:block; }
        .info { margin:8px 0; font-size:13px; }
        .label { font-weight:bold; opacity:0.8; }
        .qr { text-align:center; margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.3); }
        .qr img { width:80px; height:80px; }
        @media print { body { background:white; } }
      </style></head><body>
      <div class="card">
        <div class="header"><div style="font-size:16px;font-weight:bold;">School Management</div><div style="font-size:10px;">Teacher ID Card</div></div>
        ${card.teacher?.photoUrl ? `<img src="${card.teacher.photoUrl}" class="photo" alt="">` : `<div style="width:100px;height:100px;border-radius:50%;background:#ccc;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:40px;">&#x1F4F7;</div>`}
        <div class="info"><span class="label">Name:</span> ${card.teacher?.name || 'N/A'}</div>
        <div class="info"><span class="label">Code:</span> ${card.card?.teacherCode || 'N/A'}</div>
        <div class="info"><span class="label">Qualification:</span> ${card.teacher?.qualification || 'N/A'}</div>
        <div class="info"><span class="label">Card No:</span> ${card.card?.cardNumber || 'N/A'}</div>
        <div class="info"><span class="label">Email:</span> ${card.teacher?.email || 'N/A'}</div>
        <div class="qr"><img src="${card.card?.qrCodeData}" alt="QR"><div style="font-size:8px;margin-top:4px;">Scan to Verify</div></div>
      </div>
      <script>window.print();setTimeout(()=>window.close(),1000);</script>
      </body></html>
    `);
    printWindow.document.close();
    toast.success("ID Card downloaded!");
  };

  const handleRefresh = () => { refetch(); toast.success("Data refreshed!"); };
  const handleClearFilters = () => { setSearchTerm(""); setStatusFilter("pending"); setPage(1); };

  const getStatusConfig = (status) => {
    const configs = {
      approved: { icon: CheckCircle, variant: "success", label: "Approved" },
      pending: { icon: AlertCircle, variant: "warning", label: "Pending" },
      rejected: { icon: XCircle, variant: "danger", label: "Rejected" },
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="text-blue-600" size={28} />
                Teacher Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage faculty members and approvals</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" title="Refresh Data">
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} label="Total Teachers" value={stats.total || 0} color="bg-blue-500" />
          <StatCard icon={CheckCircle} label="Approved" value={stats.approved || 0} color="bg-emerald-500" />
          <StatCard icon={AlertCircle} label="Pending" value={stats.pending || 0} color="bg-amber-500" />
          <StatCard icon={XCircle} label="Rejected" value={stats.rejected || 0} color="bg-red-500" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name, email or subject..." value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" />
            </div>
            <div className="flex gap-2">
              {["pending", "approved", "rejected"].map((status) => (
                <button key={status} onClick={() => { setStatusFilter(status); setPage(1); }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${statusFilter === status ? "bg-gray-900 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            {(searchTerm || statusFilter !== "pending") && (
              <button onClick={handleClearFilters}
                className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : teachers.length === 0 ? (
            <EmptyState icon={Users} title="No teachers found" description="Try adjusting your search or filters" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qualification</th>
                      <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {teachers.map((teacher) => {
                      const statusConfig = getStatusConfig(teacher.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <tr key={teacher._id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm overflow-hidden flex-shrink-0">
                                {teacher.photoUrl ? (
                                  <img src={teacher.photoUrl} alt={teacher.name} className="w-full h-full object-cover" />
                                ) : (
                                  teacher.name?.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{teacher.name}</p>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Mail size={10} /> {teacher.email}
                                </div>
                                {teacher.phone && (
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <Phone size={10} /> {teacher.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects?.slice(0, 3).map((sub, i) => (
                                <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                  {typeof sub === 'object' ? sub.name : sub}
                                </span>
                              ))}
                              {teacher.subjects?.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                  +{teacher.subjects.length - 3}
                                </span>
                              )}
                              {(!teacher.subjects || teacher.subjects.length === 0) && (
                                <span className="text-xs text-gray-400 italic">No subjects</span>
                              )}
                            </div>
                          </td>
                          
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Award size={12} className="text-gray-400" />
                              <span>{teacher.qualification || "N/A"}</span>
                            </div>
                          </td>
                          
                          <td className="p-4">
                            <Badge variant={statusConfig.variant}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </Badge>
                          </td>
                          
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                              {teacher.status === "pending" && (
                                <>
                                  <button onClick={() => handleApproveClick(teacher)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer" title="Approve">
                                    <CheckCircle size={16} />
                                  </button>
                                  <button onClick={() => handleReject(teacher)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Reject">
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                              
                              {teacher.status === "approved" && (
                                <>
                                  <button onClick={() => viewIDCard(teacher)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer" title="View ID Card">
                                    <IdCard size={16} />
                                  </button>
                                  <button onClick={() => handleEdit(teacher)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit">
                                    <Pencil size={16} />
                                  </button>
                                </>
                              )}
                              
                              <button onClick={() => handleDelete(teacher)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                  <p className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * limit) + 1} to {Math.min(pagination.page * limit, pagination.total)} of {pagination.total} teachers
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                      <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <span className="text-sm text-gray-700 font-medium px-3">Page {pagination.page} of {pagination.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Approve/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingTeacher && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {modalMode === "approve" ? "Approve Teacher & Assign Subjects" : "Edit Teacher"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {modalMode === "approve" ? "Assign subjects and approve this teacher" : "Update teacher information"}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              
              <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
                {modalMode === "approve" && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                        {editingTeacher.photoUrl ? <img src={editingTeacher.photoUrl} alt="" className="w-full h-full object-cover" /> : editingTeacher.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{editingTeacher.name}</h3>
                        <p className="text-xs text-gray-500">{editingTeacher.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Phone number"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualification</label>
                    <input type="text" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      placeholder="e.g., MSc, BEd"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" />
                  </div>
                </div>
                
                {/* Subjects */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen size={14} className="inline mr-1.5" /> Subjects
                    <span className="text-xs text-gray-400 ml-2">({formData.subjects.length} selected)</span>
                  </label>
                  
                  {subjectsList.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <BookOpen size={24} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">No subjects available</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                      {subjectsList.map((subject) => {
                        const isSelected = formData.subjects.includes(subject._id);
                        const isAssignedToOther = getAssignedSubjectIds(editingTeacher._id).has(subject._id);
                        const isDisabled = isAssignedToOther && !isSelected;
                        
                        return (
                          <button key={subject._id} type="button"
                            onClick={() => { if (!isDisabled) toggleSubject(subject._id); }} disabled={isDisabled}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                              ${isSelected ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600 cursor-pointer' 
                                : isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through opacity-60'
                                : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600 cursor-pointer hover:shadow-sm'}`}
                            title={isDisabled ? 'Already assigned to another teacher' : `Click to ${isSelected ? 'remove' : 'assign'} ${subject.name}`}>
                            {isSelected && <CheckCircle size={10} className="inline mr-1" />}{subject.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password <span className="text-xs text-gray-400 ml-1">(optional)</span>
                  </label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Leave empty to keep current"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text" />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" disabled={approveMutation.isPending || updateMutation.isPending}
                    className={`flex-1 py-2.5 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer
                      ${modalMode === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-900 hover:bg-gray-800"}`}>
                    {(approveMutation.isPending || updateMutation.isPending) ? (
                      <><Loader2 className="animate-spin" size={16} />{modalMode === "approve" ? "Approving..." : "Saving..."}</>
                    ) : (
                      <><CheckCircle size={16} />{modalMode === "approve" ? "Approve Teacher" : "Save Changes"}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ID Card Modal */}
      <AnimatePresence>
        {isCardModalOpen && viewingCard && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setIsCardModalOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Teacher ID Card</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{viewingCard.teacher.name}</p>
                </div>
                <button onClick={() => setIsCardModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                  <div className="text-center mb-6">
                    {viewingCard.teacher.photoUrl ? (
                      <img src={viewingCard.teacher.photoUrl} alt="" className="w-20 h-20 mx-auto rounded-full object-cover ring-4 ring-white shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {viewingCard.teacher.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 mt-3">{viewingCard.teacher.name}</h3>
                    <p className="text-sm text-gray-500">{viewingCard.teacher.email}</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Teacher Code", value: viewingCard.card?.teacherCode, icon: IdCard },
                      { label: "Qualification", value: viewingCard.teacher.qualification, icon: Award },
                      { label: "Phone", value: viewingCard.teacher.phone, icon: Phone },
                      { label: "Card Number", value: viewingCard.card?.cardNumber, icon: IdCard },
                      { label: "Valid Till", value: viewingCard.card?.expiryDate ? new Date(viewingCard.card.expiryDate).toLocaleDateString() : "N/A", icon: Calendar2 },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-purple-100 last:border-0">
                        <span className="text-gray-500 flex items-center gap-2"><item.icon size={14} />{item.label}</span>
                        <span className="font-medium text-gray-900">{item.value || "N/A"}</span>
                      </div>
                    ))}
                  </div>
                  
                  {viewingCard.card?.qrCodeData && (
                    <div className="mt-4 pt-4 border-t border-purple-200 text-center">
                      <img src={viewingCard.card.qrCodeData} alt="QR" className="w-24 h-24 mx-auto bg-white p-2 rounded-lg" />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-5">
                  <button onClick={() => downloadIDCard(viewingCard)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Download size={16} /> Download
                  </button>
                  <button onClick={() => generateIDCard(viewingCard.teacher)}
                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Printer size={16} /> Regenerate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Calendar2 icon component
const Calendar2 = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);