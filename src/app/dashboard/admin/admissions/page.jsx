// "use client";

// import { useState, useEffect } from "react";
// import { 
//   CheckCircle, XCircle, Loader2, Users, Search,
//   Hash, BookOpen, Phone, Mail, User, Calendar, 
//   CreditCard, IdCard, AlertCircle, Eye, Download
// } from "lucide-react";

// export default function AdmissionsPage() {
//   const [requests, setRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState(null);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
  
//   const [approveData, setApproveData] = useState({
//     rollNumber: "",
//     section: "",
//     admissionFee: "5000"
//   });
//   const [approveError, setApproveError] = useState("");

//   // Fetch pending admission requests
//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/admin/admissions");
//       const data = await res.json();
//       setRequests(data);
//       setFilteredRequests(data);
//     } catch (error) {
//       console.error("Error fetching requests:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   // Filter requests
//   useEffect(() => {
//     let filtered = requests;
//     if (searchTerm) {
//       filtered = filtered.filter(req => 
//         req.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         req.phone?.includes(searchTerm) ||
//         req.fatherName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     setFilteredRequests(filtered);
//   }, [searchTerm, requests]);

//   // Handle Approve
//   const handleApprove = async () => {
//     if (!approveData.rollNumber.trim()) {
//       setApproveError("Roll Number is required");
//       return;
//     }
//     if (!approveData.section.trim()) {
//       setApproveError("Section is required");
//       return;
//     }

//     setProcessingId(selectedRequest._id);
//     setApproveError("");

//     try {
//       const res = await fetch("/api/admin/admissions", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           requestId: selectedRequest._id,
//           rollNumber: approveData.rollNumber,
//           section: approveData.section.toUpperCase(),
//           action: "approve",
//           admissionFee: approveData.admissionFee
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setShowApproveModal(false);
//         setSelectedRequest(null);
//         setApproveData({ rollNumber: "", section: "", admissionFee: "5000" });
//         fetchRequests();
//         alert(`✅ ${data.message}`);
//       } else {
//         setApproveError(data.message || "Approval failed");
//       }
//     } catch (error) {
//       setApproveError("Network error. Please try again.");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // Handle Reject
//   const handleReject = async (requestId) => {
//     if (!confirm("Are you sure you want to reject this admission request?")) return;

//     setProcessingId(requestId);

//     try {
//       const res = await fetch("/api/admin/admissions", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           requestId: requestId,
//           action: "reject"
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         fetchRequests();
//         alert("✅ Admission request rejected");
//       } else {
//         alert(data.message || "Rejection failed");
//       }
//     } catch (error) {
//       alert("Network error. Please try again.");
//     } finally {
//       setProcessingId(null);
//     }
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

//   return (
//     <div className="min-h-screen bg-gray-900 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold text-white">Student Admissions</h1>
//             <p className="text-gray-400 mt-1">Manage pending admission requests</p>
//           </div>
//           <div className="bg-blue-500/20 px-4 py-2 rounded-lg">
//             <span className="text-blue-400 font-semibold">{filteredRequests.length}</span>
//             <span className="text-gray-400 ml-2">Pending Requests</span>
//           </div>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-gray-800 rounded-xl p-4 mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//           <input
//             type="text"
//             placeholder="Search by name, father name, email or phone..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//           />
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//           <span className="ml-3 text-gray-400">Loading requests...</span>
//         </div>
//       ) : filteredRequests.length === 0 ? (
//         <div className="bg-gray-800 rounded-xl p-12 text-center">
//           <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-400">No pending admission requests</p>
//           <p className="text-gray-500 text-sm mt-2">New student applications will appear here</p>
//         </div>
//       ) : (
//         <div className="grid gap-4">
//           {filteredRequests.map((request) => (
//             <div
//               key={request._id}
//               className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all"
//             >
//               <div className="flex flex-col md:flex-row gap-5">
//                 {/* Student Photo */}
//                 <div className="flex-shrink-0">
//                   {request.photoUrl ? (
//                     <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-700">
//                       <img
//                         src={request.photoUrl}
//                         alt={request.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//                       <User className="w-10 h-10 text-white" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Student Info */}
//                 <div className="flex-1">
//                   <div className="flex flex-wrap justify-between items-start gap-2">
//                     <div>
//                       <h3 className="text-lg font-semibold text-white">{request.name}</h3>
//                       <p className="text-gray-400 text-sm">{request.fatherName && `Father: ${request.fatherName}`}</p>
//                     </div>
//                     <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
//                       Pending
//                     </span>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
//                     <div className="flex items-center gap-2 text-gray-400 text-sm">
//                       <Mail size={14} />
//                       <span className="truncate">{request.email || "No email"}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-gray-400 text-sm">
//                       <Phone size={14} />
//                       <span>{request.phone || "No phone"}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-gray-400 text-sm">
//                       <BookOpen size={14} />
//                       <span>Class: {request.className || "Not specified"}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-gray-400 text-sm">
//                       <Calendar size={14} />
//                       <span>Applied: {formatDate(request.createdAt)}</span>
//                     </div>
//                     {request.course && (
//                       <div className="flex items-center gap-2 text-gray-400 text-sm">
//                         <GraduationCap size={14} />
//                         <span>Course: {request.course}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-row md:flex-col gap-2">
//                   <button
//                     onClick={() => {
//                       setSelectedRequest(request);
//                       setShowApproveModal(true);
//                     }}
//                     disabled={processingId === request._id}
//                     className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 justify-center"
//                   >
//                     {processingId === request._id ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle size={16} />
//                     )}
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleReject(request._id)}
//                     disabled={processingId === request._id}
//                     className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 justify-center"
//                   >
//                     <XCircle size={16} />
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Approve Modal */}
//       {showApproveModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b border-gray-700">
//               <h2 className="text-xl font-bold text-white">Approve Admission</h2>
//               <p className="text-gray-400 text-sm mt-1">
//                 Approving: <span className="text-white font-medium">{selectedRequest.name}</span>
//               </p>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Student Preview */}
//               <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
//                 <p className="text-gray-400 text-xs mb-2">Student Details</p>
//                 <div className="flex items-center gap-3">
//                   {selectedRequest.photoUrl ? (
//                     <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600">
//                       <img src={selectedRequest.photoUrl} alt="" className="w-full h-full object-cover" />
//                     </div>
//                   ) : (
//                     <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
//                       <User size={24} className="text-blue-400" />
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-white font-medium">{selectedRequest.name}</p>
//                     <p className="text-gray-400 text-sm">{selectedRequest.fatherName}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Roll Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">
//                   Roll Number <span className="text-red-400">*</span>
//                 </label>
//                 <div className="relative">
//                   <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
//                   <input
//                     type="text"
//                     value={approveData.rollNumber}
//                     onChange={(e) => setApproveData({...approveData, rollNumber: e.target.value})}
//                     placeholder="e.g., 2024-001"
//                     className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Section */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">
//                   Section <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={approveData.section}
//                   onChange={(e) => setApproveData({...approveData, section: e.target.value})}
//                   className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
//                 >
//                   <option value="">Select Section</option>
//                   <option value="A">Section A</option>
//                   <option value="B">Section B</option>
//                   <option value="C">Section C</option>
//                 </select>
//               </div>

//               {/* Admission Fee */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">
//                   Admission Fee (PKR)
//                 </label>
//                 <div className="relative">
//                   <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
//                   <input
//                     type="number"
//                     value={approveData.admissionFee}
//                     onChange={(e) => setApproveData({...approveData, admissionFee: e.target.value})}
//                     className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
//                   />
//                 </div>
//                 <p className="text-gray-500 text-xs mt-1">Fee will be recorded as unpaid with 7-day due date</p>
//               </div>

//               {/* Error Message */}
//               {approveError && (
//                 <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
//                   <p className="text-red-400 text-sm flex items-center gap-2">
//                     <AlertCircle size={14} />
//                     {approveError}
//                   </p>
//                 </div>
//               )}

//               {/* Info Box */}
//               <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
//                 <p className="text-blue-400 text-sm flex items-center gap-2">
//                   <IdCard size={14} />
//                   <span>ID Card and Fee record will be automatically generated</span>
//                 </p>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-700 flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowApproveModal(false);
//                   setSelectedRequest(null);
//                   setApproveData({ rollNumber: "", section: "", admissionFee: "5000" });
//                   setApproveError("");
//                 }}
//                 className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApprove}
//                 disabled={processingId === selectedRequest._id}
//                 className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
//               >
//                 {processingId === selectedRequest._id ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <CheckCircle size={16} />
//                 )}
//                 Approve & Enroll
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Missing GraduationCap import - add this at top with other imports
// const GraduationCap = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
//     <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//   </svg>
// );




























































// "use client";

// import { useState } from "react";
// import { 
//   CheckCircle, XCircle, Loader2, Users, Search,
//   Hash, BookOpen, Phone, Mail, User, Calendar, 
//   CreditCard, IdCard, AlertCircle, RefreshCw
// } from "lucide-react";
// import { usePendingAdmissions, useApproveAdmission, useRejectAdmission } from "@/hooks/useAdminQueries";
// import toast, { Toaster } from "react-hot-toast";

// // GraduationCap Icon Component
// const GraduationCap = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
//     <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//   </svg>
// );

// // Simple Badge Component
// const Badge = ({ children, variant = "default" }) => {
//   const variants = {
//     success: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     warning: "bg-amber-50 text-amber-700 border-amber-200",
//     danger: "bg-red-50 text-red-700 border-red-200",
//     info: "bg-blue-50 text-blue-700 border-blue-200",
//   };
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant] || variants.info}`}>
//       {children}
//     </span>
//   );
// };

// export default function AdmissionsPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showApproveModal, setShowApproveModal] = useState(false);
//   const [approveData, setApproveData] = useState({
//     rollNumber: "",
//     section: "",
//     admissionFee: "5000"
//   });
//   const [approveError, setApproveError] = useState("");

//   const { 
//     data: requests = [], 
//     isLoading, 
//     isError, 
//     error, 
//     refetch,
//     isFetching
//   } = usePendingAdmissions();
  
//   const approveMutation = useApproveAdmission();
//   const rejectMutation = useRejectAdmission();

//   // Filter requests
//   const filteredRequests = requests.filter(req => {
//     if (!searchTerm) return true;
//     const term = searchTerm.toLowerCase();
//     return (
//       req.name?.toLowerCase().includes(term) ||
//       req.email?.toLowerCase().includes(term) ||
//       req.phone?.includes(term) ||
//       req.fatherName?.toLowerCase().includes(term)
//     );
//   });

//   const handleApprove = () => {
//     if (!approveData.rollNumber.trim()) {
//       setApproveError("Roll Number is required");
//       return;
//     }
//     if (!approveData.section.trim()) {
//       setApproveError("Section is required");
//       return;
//     }

//     setApproveError("");

//     const loadingToast = toast.loading("Approving admission...");

//     approveMutation.mutate(
//       {
//         requestId: selectedRequest._id,
//         rollNumber: approveData.rollNumber,
//         section: approveData.section.toUpperCase(),
//         admissionFee: approveData.admissionFee
//       },
//       {
//         onSuccess: () => {
//           toast.dismiss(loadingToast);
//           toast.success("Student enrolled successfully!");
//           setShowApproveModal(false);
//           setSelectedRequest(null);
//           setApproveData({ rollNumber: "", section: "", admissionFee: "5000" });
//         },
//         onError: (err) => {
//           toast.dismiss(loadingToast);
//           setApproveError(err.message);
//           toast.error(err.message || "Approval failed");
//         }
//       }
//     );
//   };

//   const handleReject = (requestId, studentName) => {
//     toast((t) => (
//       <div className="flex items-center gap-3">
//         <div className="flex-1">
//           <p className="font-medium text-sm">Reject Application?</p>
//           <p className="text-xs text-gray-500 mt-0.5">Reject admission for {studentName}?</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               const loadingToast = toast.loading("Rejecting...");
//               rejectMutation.mutate({ requestId }, {
//                 onSuccess: () => {
//                   toast.dismiss(loadingToast);
//                   toast.success("Application rejected");
//                 },
//                 onError: (err) => {
//                   toast.dismiss(loadingToast);
//                   toast.error(err.message || "Rejection failed");
//                 }
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

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'short', day: 'numeric'
//     });
//   };

//   const handleRefresh = () => {
//     refetch();
//     toast.success("Data refreshed!");
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-500">Loading admission requests...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <p className="text-gray-900 font-semibold text-lg">Error loading requests</p>
//           <p className="text-gray-500 text-sm mt-2">{error?.message || "Please try again"}</p>
//           <button
//             onClick={() => refetch()}
//             className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors cursor-pointer text-sm font-medium"
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
//       {/* Simple Toast Container */}
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Student Admissions</h1>
//               <p className="text-sm text-gray-500 mt-1">Manage pending admission requests</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={isFetching}
//                 className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
//                 title="Refresh Data"
//               >
//                 <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
//               </button>
//               <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
//                 <span className="text-blue-700 font-semibold text-sm">{filteredRequests.length}</span>
//                 <span className="text-blue-500 text-sm ml-1">Pending</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {/* Search Bar */}
//         <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by name, father name, email or phone..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-text"
//             />
//           </div>
//         </div>

//         {/* No Results */}
//         {filteredRequests.length === 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
//             <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 font-medium">No pending admission requests</p>
//             <p className="text-gray-400 text-sm mt-2">
//               {searchTerm ? "Try a different search term" : "New student applications will appear here"}
//             </p>
//           </div>
//         )}

//         {/* Requests Table */}
//         {filteredRequests.length > 0 && (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
//                     <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
//                     <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class/Course</th>
//                     <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
//                     <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {filteredRequests.map((request) => {
//                     const isProcessing = (approveMutation.isPending && approveMutation.variables?.requestId === request._id) ||
//                                          (rejectMutation.isPending && rejectMutation.variables?.requestId === request._id);
                    
//                     return (
//                       <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
//                         <td className="p-4">
//                           <div className="flex items-center gap-3">
//                             {request.photoUrl ? (
//                               <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
//                                 <img src={request.photoUrl} alt={request.name} className="w-full h-full object-cover" />
//                               </div>
//                             ) : (
//                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
//                                 <User className="w-5 h-5 text-white" />
//                               </div>
//                             )}
//                             <div>
//                               <p className="font-medium text-gray-900 text-sm">{request.name}</p>
//                               <p className="text-xs text-gray-500">{request.fatherName && `Father: ${request.fatherName}`}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-1.5 text-sm text-gray-600">
//                               <Mail size={12} className="text-gray-400" />
//                               <span className="truncate max-w-[150px]">{request.email || "No email"}</span>
//                             </div>
//                             <div className="flex items-center gap-1.5 text-sm text-gray-600">
//                               <Phone size={12} className="text-gray-400" />
//                               <span>{request.phone || "No phone"}</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-1.5 text-sm text-gray-600">
//                               <BookOpen size={12} className="text-gray-400" />
//                               <span>Class: {request.className || "N/A"}</span>
//                             </div>
//                             {request.course && (
//                               <div className="flex items-center gap-1.5 text-sm text-gray-600">
//                                 <GraduationCap size={12} className="text-gray-400" />
//                                 <span>{request.course}</span>
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center gap-1.5 text-sm text-gray-600">
//                             <Calendar size={12} className="text-gray-400" />
//                             <span>{formatDate(request.createdAt)}</span>
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <Badge variant="warning">
//                             <AlertCircle size={10} />
//                             Pending
//                           </Badge>
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <button
//                               onClick={() => {
//                                 setSelectedRequest(request);
//                                 setShowApproveModal(true);
//                               }}
//                               disabled={isProcessing}
//                               className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                             >
//                               {isProcessing && approveMutation.isPending ? (
//                                 <Loader2 className="w-3.5 h-3.5 animate-spin" />
//                               ) : (
//                                 <CheckCircle size={14} />
//                               )}
//                               Approve
//                             </button>
//                             <button
//                               onClick={() => handleReject(request._id, request.name)}
//                               disabled={isProcessing}
//                               className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//                             >
//                               <XCircle size={14} />
//                               Reject
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Approve Modal */}
//       {showApproveModal && selectedRequest && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
//           setShowApproveModal(false);
//           setSelectedRequest(null);
//           setApproveData({ rollNumber: "", section: "", admissionFee: "5000" });
//           setApproveError("");
//         }}>
//           <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">Approve Admission</h2>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   Enrolling: <span className="text-gray-700 font-medium">{selectedRequest.name}</span>
//                 </p>
//               </div>
//               <button 
//                 onClick={() => {
//                   setShowApproveModal(false);
//                   setSelectedRequest(null);
//                   setApproveData({ rollNumber: "", section: "", admissionFee: "5000" });
//                   setApproveError("");
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
//               >
//                 <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Student Preview */}
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//                 <div className="flex items-center gap-3">
//                   {selectedRequest.photoUrl ? (
//                     <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
//                       <img src={selectedRequest.photoUrl} alt="" className="w-full h-full object-cover" />
//                     </div>
//                   ) : (
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
//                       <User size={20} className="text-white" />
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-gray-900 font-medium text-sm">{selectedRequest.name}</p>
//                     <p className="text-gray-500 text-xs">{selectedRequest.fatherName}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Roll Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Roll Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                   <input
//                     type="text"
//                     value={approveData.rollNumber}
//                     onChange={(e) => setApproveData({...approveData, rollNumber: e.target.value})}
//                     placeholder="e.g., 2024-001"
//                     className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text"
//                   />
//                 </div>
//               </div>

//               {/* Section */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Section <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={approveData.section}
//                   onChange={(e) => setApproveData({...approveData, section: e.target.value})}
//                   className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"
//                 >
//                   <option value="">Select Section</option>
//                   <option value="A">Section A</option>
//                   <option value="B">Section B</option>
//                   <option value="C">Section C</option>
//                 </select>
//               </div>

//               {/* Admission Fee */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission Fee (PKR)</label>
//                 <div className="relative">
//                   <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//                   <input
//                     type="number"
//                     value={approveData.admissionFee}
//                     onChange={(e) => setApproveData({...approveData, admissionFee: e.target.value})}
//                     className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">Fee recorded as unpaid with 7-day due date</p>
//               </div>

//               {/* Error */}
//               {approveError && (
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                   <p className="text-red-600 text-sm flex items-center gap-2">
//                     <AlertCircle size={14} />
//                     {approveError}
//                   </p>
//                 </div>
//               )}

//               {/* Info */}
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <p className="text-blue-700 text-sm flex items-center gap-2">
//                   <IdCard size={14} />
//                   ID Card & Fee record will be auto-generated
//                 </p>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100 flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowApproveModal(false);
//                   setSelectedRequest(null);
//                   setApproveData({ rollNumber: "", section: "", admissionFee: "5000" });
//                   setApproveError("");
//                 }}
//                 className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleApprove}
//                 disabled={approveMutation.isPending}
//                 className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {approveMutation.isPending ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <CheckCircle size={16} />
//                 )}
//                 Approve & Enroll
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





















"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle, XCircle, Loader2, Users, Search,
  Hash, BookOpen, Phone, Mail, User, Calendar, 
  CreditCard, IdCard, AlertCircle, RefreshCw,
  GraduationCap, Sparkles, Shield
} from "lucide-react";
import { usePendingAdmissions, useApproveAdmission, useRejectAdmission } from "@/hooks/useAdminQueries";
import toast, { Toaster } from "react-hot-toast";

// Simple Badge Component
const Badge = ({ children, variant = "default" }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant] || variants.info}`}>
      {children}
    </span>
  );
};

export default function AdmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveData, setApproveData] = useState({
    rollNumber: "",
    section: "",
    admissionFee: "5000",
    autoAssign: true
  });
  const [approveError, setApproveError] = useState("");
  const [suggestedSection, setSuggestedSection] = useState("");
  const [suggestedRollNo, setSuggestedRollNo] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [availableSections, setAvailableSections] = useState(["A", "B", "C", "D"]);

  const { 
    data: requests = [], 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetching
  } = usePendingAdmissions();
  
  const approveMutation = useApproveAdmission();
  const rejectMutation = useRejectAdmission();

  // Fetch auto-suggestions when modal opens or class changes
  useEffect(() => {
    if (showApproveModal && selectedRequest) {
      fetchAutoSuggestions();
    }
  }, [showApproveModal, selectedRequest]);

  const fetchAutoSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/admin/admissions/suggest?className=${selectedRequest?.className}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestedSection(data.suggestedSection);
        setSuggestedRollNo(data.suggestedRollNo);
        setAvailableSections(data.availableSections || ["A", "B", "C", "D"]);
        
        if (approveData.autoAssign) {
          setApproveData(prev => ({
            ...prev,
            section: data.suggestedSection,
            rollNumber: data.suggestedRollNo
          }));
        }
      } else {
        console.error("Failed to fetch suggestions:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      req.name?.toLowerCase().includes(term) ||
      req.email?.toLowerCase().includes(term) ||
      req.phone?.includes(term) ||
      req.fatherName?.toLowerCase().includes(term)
    );
  });

  const handleApprove = () => {
    if (!approveData.autoAssign) {
      if (!approveData.rollNumber.trim()) {
        setApproveError("Roll Number is required");
        return;
      }
      if (!approveData.section.trim()) {
        setApproveError("Section is required");
        return;
      }
    }

    setApproveError("");

    const loadingToast = toast.loading("Approving admission...");

    approveMutation.mutate(
      {
        requestId: selectedRequest._id,
        rollNumber: approveData.rollNumber,
        section: approveData.section.toUpperCase(),
        admissionFee: approveData.admissionFee
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success("Student enrolled successfully!");
          setShowApproveModal(false);
          setSelectedRequest(null);
          setApproveData({ 
            rollNumber: "", 
            section: "", 
            admissionFee: "5000",
            autoAssign: true 
          });
          refetch();
        },
        onError: (err) => {
          toast.dismiss(loadingToast);
          setApproveError(err.message);
          toast.error(err.message || "Approval failed");
        }
      }
    );
  };

  const handleReject = (requestId, studentName) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium text-sm">Reject Application?</p>
          <p className="text-xs text-gray-500 mt-0.5">Reject admission for {studentName}?</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Rejecting...");
              rejectMutation.mutate({ requestId }, {
                onSuccess: () => {
                  toast.dismiss(loadingToast);
                  toast.success("Application rejected");
                  refetch();
                },
                onError: (err) => {
                  toast.dismiss(loadingToast);
                  toast.error(err.message || "Rejection failed");
                }
              });
            }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
          >
            Yes, Reject
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed!");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading admission requests...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Error loading requests</p>
          <p className="text-gray-500 text-sm mt-2">{error?.message || "Please try again"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors cursor-pointer text-sm font-medium"
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
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Admissions</h1>
              <p className="text-sm text-gray-500 mt-1">Manage pending admission requests</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isFetching}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
              </button>
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                <span className="text-blue-700 font-semibold text-sm">{filteredRequests.length}</span>
                <span className="text-blue-500 text-sm ml-1">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, father name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-text"
            />
          </div>
        </div>

        {/* No Results */}
        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No pending admission requests</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Try a different search term" : "New student applications will appear here"}
            </p>
          </div>
        )}

        {/* Requests Table */}
        {filteredRequests.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class/Course</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRequests.map((request) => {
                    const isProcessing = (approveMutation.isPending && approveMutation.variables?.requestId === request._id) ||
                                         (rejectMutation.isPending && rejectMutation.variables?.requestId === request._id);
                    
                    return (
                      <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {request.photoUrl ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={request.photoUrl} alt={request.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{request.name}</p>
                              <p className="text-xs text-gray-500">{request.fatherName && `Father: ${request.fatherName}`}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Mail size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]">{request.email || "No email"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Phone size={12} className="text-gray-400" />
                              <span>{request.phone || "No phone"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <BookOpen size={12} className="text-gray-400" />
                              <span>Class: {request.className || "N/A"}</span>
                            </div>
                            {request.course && (
                              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <GraduationCap size={12} className="text-gray-400" />
                                <span>{request.course}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar size={12} className="text-gray-400" />
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="warning">
                            <AlertCircle size={10} />
                            Pending
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApproveModal(true);
                              }}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {isProcessing && approveMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request._id, request.name)}
                              disabled={isProcessing}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <XCircle size={14} />
                              Reject
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
        )}
      </div>

      {/* Approve Modal with Auto-Assign */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowApproveModal(false);
          setSelectedRequest(null);
          setApproveData({ rollNumber: "", section: "", admissionFee: "5000", autoAssign: true });
          setApproveError("");
        }}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Approve Admission</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enrolling: <span className="text-gray-700 font-medium">{selectedRequest.name}</span>
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedRequest(null);
                  setApproveData({ rollNumber: "", section: "", admissionFee: "5000", autoAssign: true });
                  setApproveError("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Student Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  {selectedRequest.photoUrl ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                      <img src={selectedRequest.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-gray-900 font-medium text-sm">{selectedRequest.name}</p>
                    <p className="text-gray-500 text-xs">{selectedRequest.fatherName}</p>
                    <p className="text-gray-400 text-xs mt-1">Class: {selectedRequest.className}</p>
                  </div>
                </div>
              </div>

              {/* Auto-Assign Toggle */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Auto-Assign Mode</span>
                </div>
                <button
                  onClick={() => {
                    const newAutoAssign = !approveData.autoAssign;
                    setApproveData(prev => ({ ...prev, autoAssign: newAutoAssign }));
                    if (newAutoAssign) {
                      setApproveData(prev => ({
                        ...prev,
                        section: suggestedSection,
                        rollNumber: suggestedRollNo
                      }));
                    }
                  }}
                  className={`relative w-10 h-5 rounded-full transition-colors ${approveData.autoAssign ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${approveData.autoAssign ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Suggested Info */}
              {approveData.autoAssign && loadingSuggestions && (
                <div className="flex items-center justify-center gap-2 py-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-sm text-gray-500">Calculating best section & roll number...</span>
                </div>
              )}

              {approveData.autoAssign && !loadingSuggestions && suggestedSection && (
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <p className="text-emerald-700 text-sm font-medium flex items-center gap-2">
                    <Shield size={14} />
                    System will auto-assign:
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-xs text-emerald-600">Section</p>
                      <p className="text-lg font-bold text-emerald-700">{suggestedSection}</p>
                      <p className="text-xs text-emerald-500">(Least students)</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600">Roll Number</p>
                      <p className="text-lg font-bold text-emerald-700">{suggestedRollNo}</p>
                      <p className="text-xs text-emerald-500">(Auto-generated)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Inputs - Only when auto-assign is OFF */}
              {!approveData.autoAssign && (
                <>
                  {/* Roll Number - Manual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Roll Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={approveData.rollNumber}
                        onChange={(e) => setApproveData({...approveData, rollNumber: e.target.value})}
                        placeholder="e.g., 10A001"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Format: Class(2-digit) + Section(1-letter) + Number(3-digit)</p>
                  </div>

                  {/* Section - Manual with Dynamic Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={approveData.section}
                      onChange={(e) => setApproveData({...approveData, section: e.target.value})}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"
                    >
                      <option value="">Select Section</option>
                      {availableSections.map((section) => (
                        <option key={section} value={section}>Section {section}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Only configured sections are shown</p>
                  </div>
                </>
              )}

              {/* Admission Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admission Fee (PKR)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={approveData.admissionFee}
                    onChange={(e) => setApproveData({...approveData, admissionFee: e.target.value})}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-text"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Fee recorded as unpaid with 7-day due date</p>
              </div>

              {/* Error */}
              {approveError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={14} />
                    {approveError}
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-700 text-sm flex items-center gap-2">
                  <IdCard size={14} />
                  ID Card, Fee record & QR code will be auto-generated
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedRequest(null);
                  setApproveData({ rollNumber: "", section: "", admissionFee: "5000", autoAssign: true });
                  setApproveError("");
                }}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {approveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                {approveData.autoAssign ? "Auto-Approve & Enroll" : "Approve & Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}