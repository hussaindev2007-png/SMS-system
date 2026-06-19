// "use client";

// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   Users,
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   RefreshCw,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   TrendingUp,
//   Award,
//   X,
//   GraduationCap,
//   UserCheck,
//   BarChart3,
//   CalendarDays,
//   Mail as MailIcon,
//   Phone as PhoneIcon,
//   MapPin,
//   Bookmark,
//   Hash,
//   Image as ImageIcon,
//   Camera
// } from "lucide-react";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import Image from "next/image";


// export default function AdminStudentsPage() {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [isMounted, setIsMounted] = useState(false);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     name: "",
//     rollNo: "",
//     password: "",
//     className: "",
//     section: "A",
//     email: "",
//     phone: ""
//   });
//   const [formError, setFormError] = useState("");

//   const itemsPerPage = 10;

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // Fetch students
//   const fetchStudents = async () => {
//     const response = await apiClient.get(`/admin/students`, {
//       params: {
//         search: searchTerm,
//         page: currentPage,
//         limit: itemsPerPage
//       }
//     });
//     return response.data;
//   };

//   const { 
//     data: studentsData, 
//     isLoading, 
//     isError, 
//     error, 
//     refetch, 
//     isFetching 
//   } = useQuery({
//     queryKey: ["admin", "students", searchTerm, currentPage],
//     queryFn: fetchStudents,
//     enabled: isMounted,
//   });

//   // Update student mutation
//   const updateStudentMutation = useMutation({
//     mutationFn: async ({ id, data }) => {
//       const response = await apiClient.put(`/admin/students/${id}`, data);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
//       setShowEditModal(false);
//       setSelectedStudent(null);
//       toast.success("Student updated successfully!");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to update student");
//     },
//   });

//   // Delete student mutation
//   const deleteStudentMutation = useMutation({
//     mutationFn: async (id) => {
//       const response = await apiClient.delete(`/admin/students/${id}`);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
//       toast.success("Student deleted successfully!");
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || "Failed to delete student");
//     },
//   });

//   const students = studentsData?.students || [];
//   const aiGlobalInsights = studentsData?.aiGlobalInsights || {
//     globalEngagementIndex: "0%",
//     activePortalUsers: 0,
//     liveAnomaliesCount: 0,
//     structuralTriggers: [],
//     predictedDropouts: 0,
//     averageAttendance: "0%"
//   };
//   const pagination = studentsData?.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 };

//   const handleUpdateStudent = (e) => {
//     e.preventDefault();
//     if (!selectedStudent) return;
    
//     const updateData = {
//       name: selectedStudent.name,
//       rollNo: selectedStudent.rollNo,
//       className: selectedStudent.className,
//       section: selectedStudent.section,
//     };
//     if (selectedStudent.email) updateData.email = selectedStudent.email;
//     if (selectedStudent.phone) updateData.phone = selectedStudent.phone;
//     if (selectedStudent.password && selectedStudent.password.trim()) {
//       updateData.password = selectedStudent.password;
//     }
    
//     updateStudentMutation.mutate({ id: selectedStudent._id, data: updateData });
//   };

//   // Handle delete student
//   const handleDeleteStudent = (id, name) => {
//     if (!confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) return;
//     deleteStudentMutation.mutate(id);
//   };

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get AI status badge
//   const getAITierBadge = (tier) => {
//     switch(tier) {
//       case "ELITE PRODIGY":
//         return { icon: Award, text: "Elite Prodigy", bg: "bg-purple-100", textColor: "text-purple-700", border: "border-purple-200" };
//       case "CRITICAL RISK":
//         return { icon: AlertCircle, text: "Critical Risk", bg: "bg-red-100", textColor: "text-red-700", border: "border-red-200" };
//       case "NEEDS ATTENTION":
//         return { icon: AlertCircle, text: "Needs Attention", bg: "bg-orange-100", textColor: "text-orange-700", border: "border-orange-200" };
//       default:
//         return { icon: CheckCircle, text: "Stable", bg: "bg-green-100", textColor: "text-green-700", border: "border-green-200" };
//     }
//   };

//   // Classes for dropdown
//   const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
//   const sections = ["A", "B", "C", "D"];

//   if (!isMounted) return null;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-500">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-500 text-lg">Error loading students</p>
//           <p className="text-gray-500 text-sm">{(error )?.message || "Please try again"}</p>
//           <button
//             onClick={() => refetch()}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             <RefreshCw size={16} className="inline mr-2" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//         <div className="px-6 py-8">
//           <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center gap-3">
//                 <Users className="w-8 h-8" />
//                 Student Management
//               </h1>
//               <p className="text-blue-100 mt-1">Manage all enrolled students and track their progress</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => refetch()}
//                 disabled={isFetching}
//                 className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
//               >
//                 <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* AI Insights Cards */}
//       <div className="px-6 -mt-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Global Engagement Index</p>
//                 <p className="text-2xl font-bold text-gray-800">{aiGlobalInsights.globalEngagementIndex || "0%"}</p>
//               </div>
//               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
//                 <TrendingUp className="w-5 h-5 text-blue-500" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Active Users</p>
//                 <p className="text-2xl font-bold text-gray-800">{aiGlobalInsights.activePortalUsers || 0}</p>
//               </div>
//               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
//                 <UserCheck className="w-5 h-5 text-green-500" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Anomalies Detected</p>
//                 <p className="text-2xl font-bold text-gray-800">{aiGlobalInsights.liveAnomaliesCount || 0}</p>
//               </div>
//               <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
//                 <AlertCircle className="w-5 h-5 text-red-500" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Students</p>
//                 <p className="text-2xl font-bold text-gray-800">{pagination.total || 0}</p>
//               </div>
//               <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
//                 <GraduationCap className="w-5 h-5 text-purple-500" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Stats Row */}
//       <div className="px-6 mt-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
//                 <BarChart3 className="w-4 h-4 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Average Attendance</p>
//                 <p className="text-lg font-semibold text-gray-800">{aiGlobalInsights.averageAttendance || "0%"}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
//                 <AlertCircle className="w-4 h-4 text-red-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Predicted Dropouts</p>
//                 <p className="text-lg font-semibold text-gray-800">{aiGlobalInsights.predictedDropouts || 0}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* AI Alerts */}
//       {aiGlobalInsights.structuralTriggers && aiGlobalInsights.structuralTriggers.length > 0 && (
//         <div className="px-6 mt-6">
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm font-medium text-yellow-800">AI System Insights</p>
//                 {aiGlobalInsights.structuralTriggers.map((alert, idx) => (
//                   <p key={idx} className="text-sm text-yellow-700 mt-1">{alert}</p>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search Bar */}
//       <div className="px-6 mt-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name, roll number, class or section..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Students Table */}
//       <div className="px-6 mt-6 pb-6">
//         {students.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
//             <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No students found</p>
//             <p className="text-gray-400 text-sm mt-1">
//               {searchTerm ? "Try a different search term" : "Add new students to get started"}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll No</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class/Section</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">AI Status</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {students.map((student) => {
//                       const aiStatus = getAITierBadge(student.aiMetrics?.academicTier);
//                       const StatusIcon = aiStatus.icon;
//                       const attendance = student.aiMetrics?.attendancePercentage || "0%";
//                       const isAtRisk = student.aiMetrics?.academicTier === "CRITICAL RISK";
//                       const photoUrl = student.photoUrl;
                      
//                       return (
//                         <tr key={student._id} className={`hover:bg-gray-50 transition-colors ${isAtRisk ? "bg-red-50/30" : ""}`}>
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-3">
//                               {/* Student Photo */}
//                               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium shadow-sm overflow-hidden flex-shrink-0">
//                                 {photoUrl ? (
//                                   <img 
//                                     src={photoUrl} 
//                                     alt={student.name}
//                                     className="w-full h-full object-cover"
//                                   />
//                                 ) : (
//                                   <span>{student.name?.charAt(0).toUpperCase() || "S"}</span>
//                                 )}
//                               </div>
//                               <div>
//                                 <p className="font-medium text-gray-800">{student.name}</p>
//                                 <p className="text-xs text-gray-400 font-mono">ID: {student._id?.slice(-8)}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="font-mono text-sm font-medium text-gray-700">{student.rollNo}</p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="text-gray-700 font-medium">Class {student.className}</p>
//                             <p className="text-xs text-gray-500">Section: {student.section}</p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${aiStatus.bg} ${aiStatus.textColor} border ${aiStatus.border}`}>
//                               <StatusIcon size={12} />
//                               {aiStatus.text}
//                             </span>
//                             {student.aiMetrics?.behavioralInsight && (
//                               <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">
//                                 {student.aiMetrics.behavioralInsight}
//                               </p>
//                             )}
//                           </td>
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-2">
//                               <span className="text-sm font-medium text-gray-700 w-12">{attendance}</span>
//                               <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                                 <div 
//                                   className={`h-full rounded-full transition-all ${isAtRisk ? "bg-red-500" : "bg-green-500"}`}
//                                   style={{ width: attendance }}
//                                 />
//                               </div>
//                             </div>
//                             <p className="text-xs text-gray-400 mt-1">Engagement: {student.aiMetrics?.engagementScore || "N/A"}</p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => {
//                                   setSelectedStudent(student);
//                                   setShowViewModal(true);
//                                 }}
//                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                 title="View Details"
//                               >
//                                 <Eye size={16} />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedStudent(student);
//                                   setShowEditModal(true);
//                                 }}
//                                 className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                                 title="Edit"
//                               >
//                                 <Edit size={16} />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteStudent(student._id, student.name)}
//                                 disabled={deleteStudentMutation.isPending}
//                                 className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                                 title="Delete"
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
//             </div>

//             {/* Pagination */}
//             {pagination.totalPages > 1 && (
//               <div className="flex justify-center items-center gap-2 mt-6">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (pagination.totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= pagination.totalPages - 2) {
//                       pageNum = pagination.totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`w-9 h-9 rounded-lg transition-colors ${
//                           currentPage === pageNum
//                             ? "bg-blue-600 text-white"
//                             : "border border-gray-300 hover:bg-gray-50 text-gray-600"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
//                   disabled={currentPage === pagination.totalPages}
//                   className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             )}
            
//             {/* Info Text */}
//             <div className="text-center mt-4 text-sm text-gray-500">
//               Showing {students.length} of {pagination.total} students
//             </div>
//           </>
//         )}
//       </div>

//       {/* Edit Student Modal */}
//       {showEditModal && selectedStudent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
//           <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                 <Edit size={20} className="text-green-600" />
//                 Edit Student
//               </h2>
//               <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="p-6">
//               <form onSubmit={handleUpdateStudent} className="space-y-4">
//                 {/* Student Photo Preview */}
//                 {selectedStudent.photoUrl && (
//                   <div className="flex justify-center mb-4">
//                     <div className="relative">
//                       <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
//                         <img 
//                           src={selectedStudent.photoUrl} 
//                           alt={selectedStudent.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
//                         <Camera size={14} className="text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                   <input
//                     type="text"
//                     value={selectedStudent.name || ""}
//                     onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
//                   <input
//                     type="text"
//                     value={selectedStudent.rollNo || ""}
//                     onChange={(e) => setSelectedStudent({...selectedStudent, rollNo: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
//                   <input
//                     type="password"
//                     value={selectedStudent.password || ""}
//                     onChange={(e) => setSelectedStudent({...selectedStudent, password: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter new password to change"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
//                     <select
//                       value={selectedStudent.className || ""}
//                       onChange={(e) => setSelectedStudent({...selectedStudent, className: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     >
//                       <option value="">Select Class</option>
//                       {classes.map(c => (
//                         <option key={c} value={c}>Class {c}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
//                     <select
//                       value={selectedStudent.section || "A"}
//                       onChange={(e) => setSelectedStudent({...selectedStudent, section: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       {sections.map(s => (
//                         <option key={s} value={s}>Section {s}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     value={selectedStudent.email || ""}
//                     onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <input
//                     type="tel"
//                     value={selectedStudent.phone || ""}
//                     onChange={(e) => setSelectedStudent({...selectedStudent, phone: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                     Cancel
//                   </button>
//                   <button type="submit" disabled={updateStudentMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors">
//                     {updateStudentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Student"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Student Modal */}
//       {showViewModal && selectedStudent && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
//               <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                 <Eye size={20} className="text-blue-600" />
//                 Student Details
//               </h2>
//               <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="p-6">
//               {/* Profile Header with Photo */}
//               <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6">
//                 <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
//                   {selectedStudent.photoUrl ? (
//                     <img 
//                       src={selectedStudent.photoUrl} 
//                       alt={selectedStudent.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     selectedStudent.name?.charAt(0).toUpperCase() || "S"
//                   )}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h3>
//                   <div className="flex flex-wrap gap-3 mt-1">
//                     <p className="text-gray-600 text-sm flex items-center gap-1">
//                       <Hash size={14} /> Roll: {selectedStudent.rollNo}
//                     </p>
//                     <p className="text-gray-600 text-sm flex items-center gap-1">
//                       <GraduationCap size={14} /> Class {selectedStudent.className} - {selectedStudent.section}
//                     </p>
//                   </div>
//                 </div>
//                 {selectedStudent.isOnline && (
//                   <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
//                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//                     Online
//                   </span>
//                 )}
//               </div>

//               {/* Basic Info */}
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <p className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays size={12} /> Student ID</p>
//                   <p className="text-sm font-mono text-gray-700 break-all">{selectedStudent._id}</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-3">
//                   <p className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays size={12} /> Joined On</p>
//                   <p className="text-sm font-medium text-gray-700">{formatDate(selectedStudent.admissionDate || selectedStudent.createdAt)}</p>
//                 </div>
//               </div>

//               {/* Contact Info */}
//               {(selectedStudent.email || selectedStudent.phone || selectedStudent.fatherName || selectedStudent.city) && (
//                 <div className="mb-6">
//                   <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <Bookmark size={14} />
//                     Contact Information
//                   </h4>
//                   <div className="grid grid-cols-2 gap-4">
//                     {selectedStudent.fatherName && (
//                       <div className="bg-gray-50 rounded-lg p-3">
//                         <p className="text-xs text-gray-500">Father Name</p>
//                         <p className="text-sm text-gray-700">{selectedStudent.fatherName}</p>
//                       </div>
//                     )}
//                     {selectedStudent.email && (
//                       <div className="bg-gray-50 rounded-lg p-3">
//                         <p className="text-xs text-gray-500 flex items-center gap-1"><MailIcon size={12} /> Email</p>
//                         <p className="text-sm text-gray-700 truncate">{selectedStudent.email}</p>
//                       </div>
//                     )}
//                     {selectedStudent.phone && (
//                       <div className="bg-gray-50 rounded-lg p-3">
//                         <p className="text-xs text-gray-500 flex items-center gap-1"><PhoneIcon size={12} /> Phone</p>
//                         <p className="text-sm text-gray-700">{selectedStudent.phone}</p>
//                       </div>
//                     )}
//                     {selectedStudent.city && (
//                       <div className="bg-gray-50 rounded-lg p-3">
//                         <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> City</p>
//                         <p className="text-sm text-gray-700">{selectedStudent.city}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* AI Performance Metrics */}
//               {selectedStudent.aiMetrics && (
//                 <div className="border-t pt-4">
//                   <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <TrendingUp size={14} />
//                     AI Performance Metrics
//                   </h4>
//                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                     <div className="bg-blue-50 rounded-lg p-3 text-center">
//                       <p className="text-xs text-blue-600">Attendance</p>
//                       <p className="text-xl font-bold text-blue-700">{selectedStudent.aiMetrics.attendancePercentage}</p>
//                     </div>
//                     <div className="bg-purple-50 rounded-lg p-3 text-center">
//                       <p className="text-xs text-purple-600">Engagement Score</p>
//                       <p className="text-xl font-bold text-purple-700">{selectedStudent.aiMetrics.engagementScore}</p>
//                     </div>
//                     <div className="bg-green-50 rounded-lg p-3 text-center">
//                       <p className="text-xs text-green-600">Academic Tier</p>
//                       <p className="text-sm font-bold text-green-700 truncate">{selectedStudent.aiMetrics.academicTier}</p>
//                     </div>
//                     <div className="bg-yellow-50 rounded-lg p-3 text-center">
//                       <p className="text-xs text-yellow-600">Last Updated</p>
//                       <p className="text-xs font-medium text-yellow-700">{formatDate(selectedStudent.aiMetrics.lastUpdated)}</p>
//                     </div>
//                   </div>
//                   {selectedStudent.aiMetrics.behavioralInsight && (
//                     <div className="mt-3 p-3 bg-gray-50 rounded-lg">
//                       <p className="text-xs text-gray-500 mb-1">Behavioral Insight</p>
//                       <p className="text-sm text-gray-700 italic">💡 {selectedStudent.aiMetrics.behavioralInsight}</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }































"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  TrendingUp,
  Award,
  X,
  GraduationCap,
  UserCheck,
  BarChart3,
  CalendarDays,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin,
  Bookmark,
  Hash,
  Image as ImageIcon,
  Camera,
  FileText,
  Clock
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function AdminStudentsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    password: "",
    className: "",
    section: "A",
    email: "",
    phone: ""
  });
  const [formError, setFormError] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch students
  const fetchStudents = async () => {
    const response = await apiClient.get(`/admin/students`, {
      params: {
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage
      }
    });
    return response.data;
  };

  const { 
    data: studentsData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ["admin", "students", searchTerm, currentPage],
    queryFn: fetchStudents,
    enabled: isMounted,
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/admin/students/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      setShowEditModal(false);
      setSelectedStudent(null);
      toast.success("Student updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update student");
    },
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/admin/students/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      toast.success("Student deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete student");
    },
  });

  const students = studentsData?.students || [];
  const aiGlobalInsights = studentsData?.aiGlobalInsights || {
    globalEngagementIndex: "0%",
    activePortalUsers: 0,
    liveAnomaliesCount: 0,
    structuralTriggers: [],
    predictedDropouts: 0,
    averageAttendance: "0%"
  };
  const pagination = studentsData?.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    const updateData = {
      name: selectedStudent.name,
      rollNo: selectedStudent.rollNo,
      className: selectedStudent.className,
      section: selectedStudent.section,
    };
    if (selectedStudent.email) updateData.email = selectedStudent.email;
    if (selectedStudent.phone) updateData.phone = selectedStudent.phone;
    if (selectedStudent.password && selectedStudent.password.trim()) {
      updateData.password = selectedStudent.password;
    }
    
    updateStudentMutation.mutate({ id: selectedStudent._id, data: updateData });
  };

  // Handle delete student
  const handleDeleteStudent = (id, name) => {
    if (!confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) return;
    deleteStudentMutation.mutate(id);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get AI status badge based on real academic tier
  const getAITierBadge = (tier) => {
    switch(tier) {
      case "ELITE PRODIGY":
        return { icon: Award, text: "Elite Prodigy", bg: "bg-purple-100", textColor: "text-purple-700", border: "border-purple-200" };
      case "CRITICAL RISK":
        return { icon: AlertCircle, text: "Critical Risk", bg: "bg-red-100", textColor: "text-red-700", border: "border-red-200" };
      case "NEEDS ATTENTION":
        return { icon: AlertCircle, text: "Needs Attention", bg: "bg-orange-100", textColor: "text-orange-700", border: "border-orange-200" };
      default:
        return { icon: CheckCircle, text: "Stable", bg: "bg-green-100", textColor: "text-green-700", border: "border-green-200" };
    }
  };

  // Classes for dropdown
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D"];

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading students...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error loading students</p>
          <p className="text-gray-500 text-sm">{(error )?.message || "Please try again"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8" />
                Student Management
              </h1>
              <p className="text-blue-100 mt-1">Manage all enrolled students and track their progress</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Global Engagement Index</p>
                <p className="text-2xl font-bold text-gray-800">{aiGlobalInsights.globalEngagementIndex || "0%"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-gray-800">{aiGlobalInsights.activePortalUsers || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Anomalies Detected</p>
                <p className="text-2xl font-bold text-gray-800">{aiGlobalInsights.liveAnomaliesCount || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{pagination.total || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="px-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Average Attendance</p>
                <p className="text-lg font-semibold text-gray-800">{aiGlobalInsights.averageAttendance || "0%"}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Predicted Dropouts</p>
                <p className="text-lg font-semibold text-gray-800">{aiGlobalInsights.predictedDropouts || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Submissions</p>
                <p className="text-lg font-semibold text-gray-800">{aiGlobalInsights.totalSubmissions || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Alerts */}
      {aiGlobalInsights.structuralTriggers && aiGlobalInsights.structuralTriggers.length > 0 && (
        <div className="px-6 mt-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">AI System Insights</p>
                {aiGlobalInsights.structuralTriggers.map((alert, idx) => (
                  <p key={idx} className="text-sm text-yellow-700 mt-1">{alert}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, roll number, class or section..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="px-6 mt-6 pb-6">
        {students.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? "Try a different search term" : "Add new students to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Roll No</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class/Section</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">AI Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => {
                      const aiStatus = getAITierBadge(student.aiMetrics?.academicTier);
                      const StatusIcon = aiStatus.icon;
                      const attendance = student.aiMetrics?.attendancePercentage || "0%";
                      const isAtRisk = student.aiMetrics?.academicTier === "CRITICAL RISK";
                      const photoUrl = student.photoUrl;
                      
                      return (
                        <tr key={student._id} className={`hover:bg-gray-50 transition-colors ${isAtRisk ? "bg-red-50/30" : ""}`}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {/* Student Photo */}
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium shadow-sm overflow-hidden flex-shrink-0">
                                {photoUrl ? (
                                  <img 
                                    src={photoUrl} 
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span>{student.name?.charAt(0).toUpperCase() || "S"}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{student.name}</p>
                                <p className="text-xs text-gray-400 font-mono">ID: {student._id?.slice(-8)}</p>
                                {student.aiMetrics?.submissionsSubmitted !== undefined && (
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    📝 {student.aiMetrics.submissionsSubmitted} submissions
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-mono text-sm font-medium text-gray-700">{student.rollNo}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-gray-700 font-medium">Class {student.className}</p>
                            <p className="text-xs text-gray-500">Section: {student.section}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${aiStatus.bg} ${aiStatus.textColor} border ${aiStatus.border}`}>
                              <StatusIcon size={12} />
                              {aiStatus.text}
                            </span>
                            {student.aiMetrics?.behavioralInsight && (
                              <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">
                                {student.aiMetrics.behavioralInsight.substring(0, 60)}...
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700 w-12">{attendance}</span>
                              <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${isAtRisk ? "bg-red-500" : "bg-green-500"}`}
                                  style={{ width: attendance }}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Engagement: {student.aiMetrics?.engagementScore || "N/A"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowViewModal(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student._id, student.name)}
                                disabled={deleteStudentMutation.isPending}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
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
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
            
            {/* Info Text */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {students.length} of {pagination.total} students
            </div>
          </>
        )}
      </div>

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit size={20} className="text-green-600" />
                Edit Student
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateStudent} className="space-y-4">
                {/* Student Photo Preview */}
                {selectedStudent.photoUrl && (
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                        <img 
                          src={selectedStudent.photoUrl} 
                          alt={selectedStudent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
                        <Camera size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={selectedStudent.name || ""}
                    onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={selectedStudent.rollNo || ""}
                    onChange={(e) => setSelectedStudent({...selectedStudent, rollNo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    value={selectedStudent.password || ""}
                    onChange={(e) => setSelectedStudent({...selectedStudent, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password to change"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                    <select
                      value={selectedStudent.className || ""}
                      onChange={(e) => setSelectedStudent({...selectedStudent, className: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(c => (
                        <option key={c} value={c}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                      value={selectedStudent.section || "A"}
                      onChange={(e) => setSelectedStudent({...selectedStudent, section: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {sections.map(s => (
                        <option key={s} value={s}>Section {s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedStudent.email || ""}
                    onChange={(e) => setSelectedStudent({...selectedStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={selectedStudent.phone || ""}
                    onChange={(e) => setSelectedStudent({...selectedStudent, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={updateStudentMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition-colors">
                    {updateStudentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Eye size={20} className="text-blue-600" />
                Student Details
              </h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {/* Profile Header with Photo */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
                  {selectedStudent.photoUrl ? (
                    <img 
                      src={selectedStudent.photoUrl} 
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedStudent.name?.charAt(0).toUpperCase() || "S"
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Hash size={14} /> Roll: {selectedStudent.rollNo}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <GraduationCap size={14} /> Class {selectedStudent.className} - {selectedStudent.section}
                    </p>
                  </div>
                </div>
                {selectedStudent.isOnline && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Online
                  </span>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays size={12} /> Student ID</p>
                  <p className="text-sm font-mono text-gray-700 break-all">{selectedStudent._id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays size={12} /> Joined On</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(selectedStudent.admissionDate || selectedStudent.createdAt)}</p>
                </div>
              </div>

              {/* Contact Info */}
              {(selectedStudent.email || selectedStudent.phone || selectedStudent.fatherName || selectedStudent.city) && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Bookmark size={14} />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStudent.fatherName && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Father Name</p>
                        <p className="text-sm text-gray-700">{selectedStudent.fatherName}</p>
                      </div>
                    )}
                    {selectedStudent.email && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 flex items-center gap-1"><MailIcon size={12} /> Email</p>
                        <p className="text-sm text-gray-700 truncate">{selectedStudent.email}</p>
                      </div>
                    )}
                    {selectedStudent.phone && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 flex items-center gap-1"><PhoneIcon size={12} /> Phone</p>
                        <p className="text-sm text-gray-700">{selectedStudent.phone}</p>
                      </div>
                    )}
                    {selectedStudent.city && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> City</p>
                        <p className="text-sm text-gray-700">{selectedStudent.city}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Performance Metrics - Enhanced */}
              {selectedStudent.aiMetrics && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp size={14} />
                    AI Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-blue-600">Attendance</p>
                      <p className="text-xl font-bold text-blue-700">{selectedStudent.aiMetrics.attendancePercentage}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-600">Engagement Score</p>
                      <p className="text-xl font-bold text-purple-700">{selectedStudent.aiMetrics.engagementScore}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-600">Academic Tier</p>
                      <p className="text-sm font-bold text-green-700 truncate">{selectedStudent.aiMetrics.academicTier}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-yellow-600">Last Updated</p>
                      <p className="text-xs font-medium text-yellow-700">{selectedStudent.aiMetrics.lastUpdated || "N/A"}</p>
                    </div>
                  </div>
                  
                  {/* Submission Details */}
                  {selectedStudent.aiMetrics.submissionsSubmitted !== undefined && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-emerald-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-emerald-600">Submitted</p>
                        <p className="text-lg font-bold text-emerald-700">{selectedStudent.aiMetrics.submissionsSubmitted}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-600">Approved</p>
                        <p className="text-lg font-bold text-blue-700">{selectedStudent.aiMetrics.submissionsApproved || 0}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-orange-600">Pending</p>
                        <p className="text-lg font-bold text-orange-700">{selectedStudent.aiMetrics.submissionsPending || 0}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedStudent.aiMetrics.behavioralInsight && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Clock size={12} /> Behavioral Insight
                      </p>
                      <p className="text-sm text-gray-700">{selectedStudent.aiMetrics.behavioralInsight}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}