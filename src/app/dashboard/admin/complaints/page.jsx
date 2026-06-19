// "use client";

// import { useState, useEffect } from "react";
// import {
//   AlertCircle,
//   Search,
//   Filter,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   MessageSquare,
//   User,
//   Calendar,
//   Tag,
//   Send,
//   Sparkles,
//   Eye,
//   Check,
//   RefreshCw,
//   Flag,
//   Star,
//   TrendingUp,
//   Users
// } from "lucide-react";

// export default function AdminComplaintsPage() {
//   const [complaints, setComplaints] = useState([]);
//   const [filteredComplaints, setFilteredComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showReplyModal, setShowReplyModal] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [aiSuggestion, setAiSuggestion] = useState("");
//   const [generatingAI, setGeneratingAI] = useState(false);
//   const [updating, setUpdating] = useState(false);
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     pages: 1
//   });

//   const itemsPerPage = 10;

//   // Fetch complaints
//   const fetchComplaints = async (page = 1) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/admin/complaints?page=${page}&limit=${itemsPerPage}`);
//       const data = await res.json();
//       if (data.success) {
//         setComplaints(data.data);
//         setFilteredComplaints(data.data);
//         setPagination(data.pagination);
//       }
//     } catch (error) {
//       console.error("Error fetching complaints:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints(currentPage);
//   }, [currentPage]);

//   // Filter complaints
//   useEffect(() => {
//     let filtered = complaints;
    
//     if (searchTerm) {
//       filtered = filtered.filter(complaint => 
//         complaint.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         complaint.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         complaint.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         complaint.studentId?.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (selectedStatus) {
//       filtered = filtered.filter(complaint => complaint.status === selectedStatus);
//     }
    
//     setFilteredComplaints(filtered);
//   }, [searchTerm, selectedStatus, complaints]);

//   // Generate AI Reply
//   const generateAIReply = async (subject, message) => {
//     setGeneratingAI(true);
//     setAiSuggestion("");
    
//     try {
//       const res = await fetch("/api/admin/complaints", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ subject, message })
//       });
      
//       const data = await res.json();
//       if (data.success) {
//         setAiSuggestion(data.suggestion);
//         setReplyText(data.suggestion);
//       } else {
//         setAiSuggestion("Unable to generate AI suggestion. Please write a manual reply.");
//       }
//     } catch (error) {
//       console.error("AI generation error:", error);
//       setAiSuggestion("Network error. Please try again.");
//     } finally {
//       setGeneratingAI(false);
//     }
//   };

//   // Update complaint status
//   const updateComplaintStatus = async (complaintId, status, adminRemark) => {
//     setUpdating(true);
    
//     try {
//       const res = await fetch(`/api/admin/complaints/${complaintId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status, adminRemark })
//       });
      
//       const data = await res.json();
//       if (data.success) {
//         fetchComplaints(currentPage);
//         if (showDetailModal) {
//           setSelectedComplaint(data.data);
//         }
//         if (showReplyModal) {
//           setShowReplyModal(false);
//           setReplyText("");
//           setAiSuggestion("");
//         }
//         alert(`✅ Complaint marked as ${status}`);
//       } else {
//         alert(data.message || "Failed to update status");
//       }
//     } catch (error) {
//       alert("Network error. Please try again.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "resolved":
//         return { icon: CheckCircle, text: "Resolved", color: "green", bg: "bg-green-500/20", textColor: "text-green-400" };
//       case "in-progress":
//         return { icon: Clock, text: "In Progress", color: "yellow", bg: "bg-yellow-500/20", textColor: "text-yellow-400" };
//       default:
//         return { icon: AlertCircle, text: "Pending", color: "red", bg: "bg-red-500/20", textColor: "text-red-400" };
//     }
//   };

//   // Get priority badge
//   const getPriorityBadge = (priority) => {
//     switch(priority) {
//       case "high":
//         return { icon: Flag, text: "High", color: "red" };
//       case "medium":
//         return { icon: AlertCircle, text: "Medium", color: "yellow" };
//       default:
//         return { icon: Star, text: "Low", color: "blue" };
//     }
//   };

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     const d = new Date(date);
//     const now = new Date();
//     const diff = now - d;
    
//     if (diff < 60000) return "Just now";
//     if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
//     if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   };

//   // Statistics
//   const stats = {
//     total: complaints.length,
//     pending: complaints.filter(c => c.status === "pending").length,
//     inProgress: complaints.filter(c => c.status === "in-progress").length,
//     resolved: complaints.filter(c => c.status === "resolved").length
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//         <div className="px-6 py-8">
//           <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <h1 className="text-3xl font-bold flex items-center gap-3">
//                 <MessageSquare className="w-8 h-8" />
//                 Complaint Management
//               </h1>
//               <p className="text-blue-100 mt-1">Manage and respond to student complaints</p>
//             </div>
//             <button
//               onClick={() => fetchComplaints(1)}
//               className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <RefreshCw size={18} />
//               Refresh
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="px-6 -mt-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Complaints</p>
//                 <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
//               </div>
//               <MessageSquare className="w-8 h-8 text-blue-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-red-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
//               </div>
//               <AlertCircle className="w-8 h-8 text-red-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-yellow-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">In Progress</p>
//                 <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
//               </div>
//               <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">Resolved</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
//               </div>
//               <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="px-6 mt-6">
//         <div className="bg-white rounded-xl shadow-lg p-4">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search by student name, roll number, subject or message..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>
//             <div className="w-full md:w-48 relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="resolved">Resolved</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//           <span className="ml-3 text-gray-500">Loading complaints...</span>
//         </div>
//       ) : filteredComplaints.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-lg p-12 text-center mx-6 mt-6">
//           <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">No complaints found</p>
//           <p className="text-gray-400 text-sm mt-1">
//             {searchTerm || selectedStatus ? "Try changing your filters" : "New complaints will appear here"}
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* Complaints Table */}
//           <div className="px-6 mt-6">
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
//                       <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredComplaints.map((complaint) => {
//                       const status = getStatusBadge(complaint.status);
//                       const StatusIcon = status.icon;
                      
//                       return (
//                         <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
//                                 {complaint.studentId?.name?.charAt(0) || "S"}
//                               </div>
//                               <div>
//                                 <p className="font-medium text-gray-800">{complaint.studentId?.name || "Unknown"}</p>
//                                 <p className="text-xs text-gray-500">Roll: {complaint.studentId?.rollNo || "N/A"}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="text-gray-800 font-medium max-w-xs truncate">{complaint.subject}</p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="text-gray-600 text-sm max-w-md truncate">{complaint.message}</p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
//                               <StatusIcon size={12} />
//                               {status.text}
//                             </span>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="text-gray-500 text-sm">{formatDate(complaint.createdAt)}</p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <div className="flex gap-2">
//                               <button
//                                 onClick={() => {
//                                   setSelectedComplaint(complaint);
//                                   setShowDetailModal(true);
//                                 }}
//                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                 title="View Details"
//                               >
//                                 <Eye size={18} />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedComplaint(complaint);
//                                   setReplyText("");
//                                   setAiSuggestion("");
//                                   setShowReplyModal(true);
//                                 }}
//                                 className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                                 title="Reply"
//                               >
//                                 <Send size={18} />
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
//           </div>

//           {/* Pagination */}
//           {pagination.pages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-6">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 <ChevronLeft size={18} />
//               </button>
//               <span className="text-gray-600">
//                 Page {currentPage} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
//                 disabled={currentPage === pagination.pages}
//                 className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Detail Modal */}
//       {showDetailModal && selectedComplaint && (
//         <Modal title="Complaint Details" onClose={() => setShowDetailModal(false)}>
//           <div className="space-y-5">
//             {/* Student Info */}
//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
//                 {selectedComplaint.studentId?.name?.charAt(0) || "S"}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-800">{selectedComplaint.studentId?.name || "Unknown Student"}</h3>
//                 <p className="text-sm text-gray-500">Roll Number: {selectedComplaint.studentId?.rollNo || "N/A"}</p>
//               </div>
//             </div>

//             {/* Complaint Content */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-gray-800 font-medium">{selectedComplaint.subject}</p>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.message}</p>
//               </div>
//             </div>

//             {/* Status Update */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
//               <div className="flex gap-2">
//                 {["pending", "in-progress", "resolved"].map((status) => {
//                   const statusInfo = getStatusBadge(status);
//                   const StatusIcon = statusInfo.icon;
//                   return (
//                     <button
//                       key={status}
//                       onClick={() => updateComplaintStatus(selectedComplaint._id, status, selectedComplaint.adminRemark)}
//                       disabled={updating}
//                       className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
//                         selectedComplaint.status === status
//                           ? `${statusInfo.bg} ${statusInfo.textColor} border-2 border-current`
//                           : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                       }`}
//                     >
//                       <StatusIcon size={16} />
//                       {statusInfo.text}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Admin Remark */}
//             {selectedComplaint.adminRemark && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response</label>
//                 <div className="p-3 bg-green-50 rounded-lg border border-green-200">
//                   <p className="text-green-800 whitespace-pre-wrap">{selectedComplaint.adminRemark}</p>
//                 </div>
//               </div>
//             )}

//             {/* Meta Info */}
//             <div className="text-xs text-gray-500 border-t pt-3">
//               <p>Complaint ID: {selectedComplaint._id}</p>
//               <p>Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* Reply Modal with AI Suggestion */}
//       {showReplyModal && selectedComplaint && (
//         <Modal title="Respond to Complaint" onClose={() => setShowReplyModal(false)} size="lg">
//           <div className="space-y-5">
//             {/* Complaint Summary */}
//             <div className="p-4 bg-gray-50 rounded-xl">
//               <p className="text-sm text-gray-500 mb-1">Student: <span className="font-medium text-gray-700">{selectedComplaint.studentId?.name}</span></p>
//               <p className="text-sm text-gray-500 mb-1">Subject: <span className="font-medium text-gray-700">{selectedComplaint.subject}</span></p>
//               <p className="text-sm text-gray-600 mt-2">{selectedComplaint.message}</p>
//             </div>

//             {/* AI Suggestion */}
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <label className="text-sm font-medium text-gray-700">AI Suggested Response</label>
//                 <button
//                   onClick={() => generateAIReply(selectedComplaint.subject, selectedComplaint.message)}
//                   disabled={generatingAI}
//                   className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
//                 >
//                   <Sparkles size={14} />
//                   {generatingAI ? "Generating..." : "Generate AI Reply"}
//                 </button>
//               </div>
//               <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 min-h-[100px]">
//                 {generatingAI ? (
//                   <div className="flex items-center justify-center h-full">
//                     <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
//                   </div>
//                 ) : aiSuggestion ? (
//                   <p className="text-gray-700 whitespace-pre-wrap">{aiSuggestion}</p>
//                 ) : (
//                   <p className="text-gray-400 text-sm">Click "Generate AI Reply" for an AI-powered response suggestion.</p>
//                 )}
//               </div>
//             </div>

//             {/* Manual Reply */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
//               <textarea
//                 rows="6"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 placeholder="Type your response here..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             {/* Status Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Mark as</label>
//               <div className="flex gap-2">
//                 {["resolved", "in-progress", "pending"].map((status) => {
//                   const statusInfo = getStatusBadge(status);
//                   const StatusIcon = statusInfo.icon;
//                   return (
//                     <button
//                       key={status}
//                       onClick={() => {
//                         const remark = replyText.trim() || "Admin has responded to your complaint.";
//                         updateComplaintStatus(selectedComplaint._id, status, remark);
//                       }}
//                       disabled={updating}
//                       className="flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
//                     >
//                       <StatusIcon size={16} />
//                       {statusInfo.text}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Modal Component
// function Modal({ title, children, onClose, size = "md" }) {
//   const maxWidth = size === "lg" ? "max-w-2xl" : "max-w-md";
  
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className={`bg-white rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
//         <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <XCircle size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }


































"use client";

import { useState } from "react";
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Calendar,
  Send,
  Sparkles,
  Eye,
  RefreshCw,
  Flag,
  Star,
  Users
} from "lucide-react";
import { useComplaints, useUpdateComplaintStatus, useGenerateAIComplaintReply } from "@/hooks/useAdminQueries";
import toast from "react-hot-toast";

export default function AdminComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  // React Query hooks
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching 
  } = useComplaints(currentPage);
  
  const updateStatusMutation = useUpdateComplaintStatus();
  const generateAIReplyMutation = useGenerateAIComplaintReply();

  const complaints = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  // Filter complaints locally
  const filteredComplaints = complaints.filter(complaint => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        complaint.studentId?.name?.toLowerCase().includes(term) ||
        complaint.subject?.toLowerCase().includes(term) ||
        complaint.message?.toLowerCase().includes(term) ||
        complaint.studentId?.rollNo?.toLowerCase().includes(term);
      if (!matches) return false;
    }
    if (selectedStatus && complaint.status !== selectedStatus) return false;
    return true;
  });

  // Generate AI Reply
  const generateAIReply = (subject, message) => {
    generateAIReplyMutation.mutate(
      { subject, message },
      {
        onSuccess: (data) => {
          setAiSuggestion(data.suggestion);
          setReplyText(data.suggestion);
          toast.success("AI reply generated!");
        },
        onError: () => {
          setAiSuggestion("Unable to generate AI suggestion. Please write a manual reply.");
        },
      }
    );
  };

  // Update complaint status
  const updateComplaintStatus = (complaintId, status, adminRemark) => {
    updateStatusMutation.mutate(
      { complaintId, status, adminRemark },
      {
        onSuccess: () => {
          if (showDetailModal) {
            setSelectedComplaint(null);
            setShowDetailModal(false);
          }
          if (showReplyModal) {
            setShowReplyModal(false);
            setReplyText("");
            setAiSuggestion("");
          }
        },
      }
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "resolved":
        return { icon: CheckCircle, text: "Resolved", bg: "bg-green-100", textColor: "text-green-700", iconColor: "text-green-500" };
      case "in-progress":
        return { icon: Clock, text: "In Progress", bg: "bg-yellow-100", textColor: "text-yellow-700", iconColor: "text-yellow-500" };
      default:
        return { icon: AlertCircle, text: "Pending", bg: "bg-red-100", textColor: "text-red-700", iconColor: "text-red-500" };
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    inProgress: complaints.filter(c => c.status === "in-progress").length,
    resolved: complaints.filter(c => c.status === "resolved").length
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading complaints...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error loading complaints</p>
          <p className="text-gray-500 text-sm">{error?.message || "Please try again"}</p>
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
                <MessageSquare className="w-8 h-8" />
                Complaint Management
              </h1>
              <p className="text-blue-100 mt-1">Manage and respond to student complaints</p>
            </div>
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

      {/* Stats Cards */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Complaints" value={stats.total} icon={<MessageSquare className="w-8 h-8 text-blue-500 opacity-50" />} />
          <StatCard title="Pending" value={stats.pending} icon={<AlertCircle className="w-8 h-8 text-red-500 opacity-50" />} valueColor="text-red-600" />
          <StatCard title="In Progress" value={stats.inProgress} icon={<Clock className="w-8 h-8 text-yellow-500 opacity-50" />} valueColor="text-yellow-600" />
          <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle className="w-8 h-8 text-green-500 opacity-50" />} valueColor="text-green-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by student name, roll number, subject or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredComplaints.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center mx-6 mt-6">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No complaints found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm || selectedStatus ? "Try changing your filters" : "New complaints will appear here"}
          </p>
        </div>
      )}

      {/* Complaints Table */}
      {filteredComplaints.length > 0 && (
        <>
          <div className="px-6 mt-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredComplaints.map((complaint) => {
                      const status = getStatusBadge(complaint.status);
                      const StatusIcon = status.icon;
                      
                      return (
                        <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                                {complaint.studentId?.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{complaint.studentId?.name || "Unknown"}</p>
                                <p className="text-xs text-gray-500">Roll: {complaint.studentId?.rollNo || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-gray-800 font-medium max-w-xs truncate">{complaint.subject}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-gray-600 text-sm max-w-md truncate">{complaint.message}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
                              <StatusIcon size={12} className={status.iconColor} />
                              {status.text}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-gray-500 text-sm">{formatDate(complaint.createdAt)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedComplaint(complaint);
                                  setShowDetailModal(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedComplaint(complaint);
                                  setReplyText(complaint.adminRemark || "");
                                  setAiSuggestion("");
                                  setShowReplyModal(true);
                                }}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Reply"
                              >
                                <Send size={18} />
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
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedComplaint && (
        <Modal title="Complaint Details" onClose={() => setShowDetailModal(false)}>
          <div className="space-y-5">
            {/* Student Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                {selectedComplaint.studentId?.name?.charAt(0) || "S"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedComplaint.studentId?.name || "Unknown Student"}</h3>
                <p className="text-sm text-gray-500">Roll Number: {selectedComplaint.studentId?.rollNo || "N/A"}</p>
              </div>
            </div>

            {/* Complaint Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-800 font-medium">{selectedComplaint.subject}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.message}</p>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
              <div className="flex gap-2">
                {["pending", "in-progress", "resolved"].map((status) => {
                  const statusInfo = getStatusBadge(status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <button
                      key={status}
                      onClick={() => updateComplaintStatus(selectedComplaint._id, status, selectedComplaint.adminRemark)}
                      disabled={updateStatusMutation.isPending}
                      className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        selectedComplaint.status === status
                          ? `${statusInfo.bg} ${statusInfo.textColor} border-2 border-current`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } disabled:opacity-50`}
                    >
                      {updateStatusMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <StatusIcon size={16} className={statusInfo.iconColor} />
                      )}
                      {statusInfo.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Remark */}
            {selectedComplaint.adminRemark && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Response</label>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 whitespace-pre-wrap">{selectedComplaint.adminRemark}</p>
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="text-xs text-gray-500 border-t pt-3">
              <p>Complaint ID: {selectedComplaint._id}</p>
              <p>Submitted: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Reply Modal with AI Suggestion */}
      {showReplyModal && selectedComplaint && (
        <Modal title="Respond to Complaint" onClose={() => setShowReplyModal(false)} size="lg">
          <div className="space-y-5">
            {/* Complaint Summary */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Student: <span className="font-medium text-gray-700">{selectedComplaint.studentId?.name}</span></p>
              <p className="text-sm text-gray-500 mb-1">Subject: <span className="font-medium text-gray-700">{selectedComplaint.subject}</span></p>
              <p className="text-sm text-gray-600 mt-2">{selectedComplaint.message}</p>
            </div>

            {/* AI Suggestion */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">AI Suggested Response</label>
                <button
                  onClick={() => generateAIReply(selectedComplaint.subject, selectedComplaint.message)}
                  disabled={generateAIReplyMutation.isPending}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {generateAIReplyMutation.isPending ? "Generating..." : "Generate AI Reply"}
                </button>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 min-h-[100px]">
                {generateAIReplyMutation.isPending ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                  </div>
                ) : aiSuggestion ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{aiSuggestion}</p>
                ) : (
                  <p className="text-gray-400 text-sm">Click "Generate AI Reply" for an AI-powered response suggestion.</p>
                )}
              </div>
            </div>

            {/* Manual Reply */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
              <textarea
                rows="6"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mark as</label>
              <div className="flex gap-2">
                {["resolved", "in-progress", "pending"].map((status) => {
                  const statusInfo = getStatusBadge(status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <button
                      key={status}
                      onClick={() => {
                        const remark = replyText.trim() || "Admin has responded to your complaint.";
                        updateComplaintStatus(selectedComplaint._id, status, remark);
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {updateStatusMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <StatusIcon size={16} />
                      )}
                      {statusInfo.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, valueColor = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose, size = "md" }) {
  const maxWidth = size === "lg" ? "max-w-2xl" : "max-w-md";
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}