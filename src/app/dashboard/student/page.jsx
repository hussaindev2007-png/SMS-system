// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Loader2,
//   User,
//   BookOpen,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Calendar,
//   TrendingUp,
//   FileText,
//   CreditCard,
//   AlertCircle,
//   RefreshCw,
//   BarChart3,
//   Activity,
//   Award,
//   DollarSign,
//   Wallet,
//   Zap,
//   Bell,
//   TrendingDown
// } from "lucide-react";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";

// export default function StudentDashboard() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     checkAuthAndFetchData();
//   }, []);

//   const checkAuthAndFetchData = async () => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     let userId = localStorage.getItem("userId");
//     let className = localStorage.getItem("className");

//     console.log("🔍 Auth Check:", { token: !!token, userRole, userId, className });

//     if (!token || userRole !== "student") {
//       router.push("/login");
//       return;
//     }

//     if (!userId) {
//       console.error("Missing userId");
//       setError("Missing student information. Please login again.");
//       setLoading(false);
//       return;
//     }

//     if (!className) {
//       console.log("📡 className not found in localStorage, fetching from API...");
//       try {
//         const profileResponse = await apiClient.get(`/student/profile/${userId}`);
//         if (profileResponse.data.success) {
//           className = profileResponse.data.className;
//           const section = profileResponse.data.section;
//           localStorage.setItem("className", className);
//           localStorage.setItem("section", section);
//           console.log("✅ className fetched and saved:", className);
//         } else {
//           console.error("Failed to fetch className:", profileResponse.data.message);
//           setError("Unable to fetch student information. Please contact admin.");
//           setLoading(false);
//           return;
//         }
//       } catch (err) {
//         console.error("Error fetching student profile:", err);
//         setError("Failed to load student information. Please try again.");
//         setLoading(false);
//         return;
//       }
//     }

//     await fetchDashboardData(userId, className);
//   };

//   const fetchDashboardData = async (studentId, className) => {
//     try {
//       setLoading(true);
//       console.log("📡 Calling API:", `/student/stats`, { studentId, className });
      
//       const response = await apiClient.get(`/student/stats`, {
//         params: { studentId, className }
//       });
      
//       console.log("✅ API Response:", response.data);
      
//       if (response.data.success) {
//         setDashboardData(response.data);
//       } else {
//         setError(response.data.message || "Failed to load dashboard");
//       }
//     } catch (err) {
//       console.error("❌ Dashboard error:", err);
      
//       if (err.response?.status === 400) {
//         setError(err.response?.data?.message || "Invalid parameters. Please check your information.");
//       } else if (err.response?.status === 404) {
//         setError("Dashboard API not found. Please contact admin.");
//       } else if (err.response?.status === 401) {
//         localStorage.clear();
//         router.push("/login");
//         setError("Session expired. Please login again.");
//       } else {
//         setError("Failed to load dashboard data. Please try again.");
//       }
//       toast.error("Failed to load dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-400">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-900 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <p className="text-red-400 text-lg font-semibold">{error}</p>
//           <button
//             onClick={() => {
//               localStorage.clear();
//               router.push("/login");
//             }}
//             className="mt-6 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!dashboardData) return null;

//   const { profile, stats, chartData, upcomingWork, fees, feeSummary, feeRecommendations, assignmentRecommendations, overallProgress } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gray-900">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//         <div className="px-6 py-8">
//           <h1 className="text-3xl font-bold">Student Dashboard</h1>
//           <p className="text-blue-100 mt-1">Welcome back, {profile?.name || "Student"}</p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Profile Overview */}
//         <div className="bg-gray-800 rounded-xl p-6 mb-6">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
//               <User className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">{profile?.name || "N/A"}</h2>
//               <p className="text-gray-400">Roll No: {profile?.rollNo || "N/A"}</p>
//               <p className="text-gray-400 text-sm">Course: {profile?.courseName || "N/A"}</p>
//               <p className="text-gray-500 text-xs mt-1">City: {profile?.city || "N/A"}</p>
//             </div>
//           </div>
//         </div>

//         {/* Overall Progress Message */}
//         {overallProgress && (
//           <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
//             <p className="text-green-400 text-center font-medium flex items-center justify-center gap-2">
//               <Zap size={18} />
//               {overallProgress.message}
//             </p>
//           </div>
//         )}

//         {/* AI Recommendations Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           {/* Fee Recommendations */}
//           {feeRecommendations && feeRecommendations.length > 0 && (
//             <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
//               <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
//                 <DollarSign size={16} /> Fee Recommendations
//               </h4>
//               <ul className="space-y-1">
//                 {feeRecommendations.slice(0, 3).map((rec, idx) => (
//                   <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
          
//           {/* Assignment Recommendations */}
//           {assignmentRecommendations && assignmentRecommendations.length > 0 && (
//             <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
//               <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
//                 <BookOpen size={16} /> Assignment Recommendations
//               </h4>
//               <ul className="space-y-1">
//                 {assignmentRecommendations.map((rec, idx) => (
//                   <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Fee Summary Cards - UPDATED */}
//         {feeSummary && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//               <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-blue-100 text-sm">Total Fee</p>
//                     <p className="text-2xl font-bold text-white">PKR {feeSummary.totalAmount?.toLocaleString() || 0}</p>
//                   </div>
//                   <DollarSign className="w-8 h-8 text-blue-300 opacity-70" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-green-100 text-sm">Paid Amount</p>
//                     <p className="text-2xl font-bold text-white">PKR {feeSummary.paidAmount?.toLocaleString() || 0}</p>
//                   </div>
//                   <CheckCircle className="w-8 h-8 text-green-300 opacity-70" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-yellow-100 text-sm">Remaining Amount</p>
//                     <p className="text-2xl font-bold text-white">PKR {feeSummary.remainingAmount?.toLocaleString() || 0}</p>
//                   </div>
//                   <Wallet className="w-8 h-8 text-yellow-300 opacity-70" />
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-purple-100 text-sm">Payment Progress</p>
//                     <p className="text-2xl font-bold text-white">{feeSummary.paymentProgress || 0}%</p>
//                   </div>
//                   <TrendingUp className="w-8 h-8 text-purple-300 opacity-70" />
//                 </div>
//               </div>
//             </div>

//             {/* Fee Status Summary */}
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
//                 <p className="text-green-400 text-sm">Fully Paid</p>
//                 <p className="text-2xl font-bold text-green-400">{feeSummary.paidMonths || 0}</p>
//                 <p className="text-green-500/70 text-xs">months</p>
//               </div>
//               <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
//                 <p className="text-yellow-400 text-sm">Partial Paid</p>
//                 <p className="text-2xl font-bold text-yellow-400">{feeSummary.partialMonths || 0}</p>
//                 <p className="text-yellow-500/70 text-xs">months</p>
//               </div>
//               <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
//                 <p className="text-red-400 text-sm">Unpaid</p>
//                 <p className="text-2xl font-bold text-red-400">{(feeSummary.unpaidMonths || 0) + (feeSummary.overdueMonths || 0)}</p>
//                 <p className="text-red-500/70 text-xs">months</p>
//               </div>
//             </div>

//             {/* Payment Progress Bar */}
//             {feeSummary.totalAmount > 0 && (
//               <div className="bg-gray-800 rounded-xl p-4 mb-6">
//                 <div className="flex justify-between text-sm text-gray-400 mb-2">
//                   <span>Payment Progress</span>
//                   <span>{feeSummary.paymentProgress || 0}%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-3">
//                   <div 
//                     className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full h-3 transition-all duration-500"
//                     style={{ width: `${feeSummary.paymentProgress || 0}%` }}
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   {feeSummary.remainingAmount === 0 
//                     ? '✅ All fees paid! Thank you.' 
//                     : `💰 PKR ${feeSummary.remainingAmount?.toLocaleString()} remaining to be paid`}
//                 </p>
//               </div>
//             )}
//           </>
//         )}

//         {/* Stats Cards - Assignments */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Total Assignments</p>
//                 <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
//               </div>
//               <FileText className="w-8 h-8 text-blue-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Submitted</p>
//                 <p className="text-2xl font-bold text-green-400">{stats?.submitted || 0}</p>
//               </div>
//               <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Approved</p>
//                 <p className="text-2xl font-bold text-blue-400">{stats?.approved || 0}</p>
//               </div>
//               <Award className="w-8 h-8 text-blue-500 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-400 text-sm">Pending Review</p>
//                 <p className="text-2xl font-bold text-yellow-400">{stats?.pendingReview || 0}</p>
//               </div>
//               <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
//             </div>
//           </div>
//         </div>

//         {/* Two Column Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Upcoming Assignments */}
//           <div className="bg-gray-800 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <Calendar size={20} />
//               Upcoming Assignments
//             </h3>
//             {!upcomingWork || upcomingWork.length === 0 ? (
//               <div className="text-center py-8">
//                 <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2 opacity-50" />
//                 <p className="text-gray-400">No pending assignments</p>
//                 <p className="text-gray-500 text-sm mt-1">All caught up! 🎉</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {upcomingWork.map((assignment) => (
//                   <div key={assignment._id} className={`bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition-colors ${assignment.daysLeft <= 2 ? 'border-l-4 border-red-500' : assignment.daysLeft <= 7 ? 'border-l-4 border-yellow-500' : ''}`}>
//                     <p className="text-white font-medium">{assignment.title}</p>
//                     <p className="text-gray-400 text-sm mt-1">
//                       Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })}
//                     </p>
//                     {assignment.warning && (
//                       <p className="text-yellow-400 text-xs mt-1">{assignment.warning}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Activity Chart */}
//           <div className="bg-gray-800 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <TrendingUp size={20} />
//               Submission Activity
//             </h3>
//             <div className="h-64 flex items-center justify-center">
//               {!chartData || chartData.length === 0 || (chartData.length === 1 && chartData[0].value === 0) ? (
//                 <div className="text-center">
//                   <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-2" />
//                   <p className="text-gray-400">No submission data yet</p>
//                   <p className="text-gray-500 text-sm mt-1">Submit assignments to see activity</p>
//                 </div>
//               ) : (
//                 <div className="w-full">
//                   <div className="flex items-end justify-around h-48">
//                     {chartData.map((item, idx) => {
//                       const maxValue = Math.max(...chartData.map(d => d.value), 1);
//                       return (
//                         <div key={idx} className="text-center flex-1">
//                           <div 
//                             className="w-full max-w-12 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400 cursor-pointer mx-auto"
//                             style={{ height: `${Math.max((item.value / maxValue) * 140, 20)}px`, width: '40px' }}
//                           />
//                           <p className="text-gray-400 text-xs mt-2">{item.name}</p>
//                           <p className="text-white text-xs font-bold">{item.value}</p>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Fees Section - UPDATED with Paid & Remaining */}
//         <div className="mt-6 bg-gray-800 rounded-xl p-6">
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <CreditCard size={20} />
//             Fee Records
//           </h3>
//           {!fees || fees.length === 0 ? (
//             <div className="text-center py-8">
//               <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-2" />
//               <p className="text-gray-400">No fee records found</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-700 rounded-lg">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Month</th>
//                     <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Total Amount</th>
//                     <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Paid Amount</th>
//                     <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Remaining</th>
//                     <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Status</th>
//                     <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Due Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {fees.map((fee, idx) => (
//                     <tr key={idx} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
//                       <td className="px-4 py-3 text-white">{fee.month}</td>
//                       <td className="px-4 py-3 text-white font-medium">PKR {fee.amount?.toLocaleString() || 0}</td>
//                       <td className="px-4 py-3 text-green-400 font-medium">PKR {(fee.amountPaid || 0).toLocaleString()}</td>
//                       <td className="px-4 py-3 text-yellow-400 font-medium">PKR {(fee.remainingAmount || 0).toLocaleString()}</td>
//                       <td className="px-4 py-3">
//                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                           fee.status === 'paid' 
//                             ? 'bg-green-500/20 text-green-400' 
//                             : fee.status === 'partially-paid' 
//                               ? 'bg-yellow-500/20 text-yellow-400'
//                               : fee.isOverdue 
//                                 ? 'bg-red-500/20 text-red-400'
//                                 : 'bg-red-500/20 text-red-400'
//                         }`}>
//                           {fee.status === 'paid' ? '✓ Paid' : fee.status === 'partially-paid' ? '⚠ Partially Paid' : fee.isOverdue ? '⚠ Overdue' : '✗ Unpaid'}
//                         </span>
//                        </td>
//                       <td className="px-4 py-3 text-gray-400">
//                         {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric'
//                         }) : 'N/A'}
//                        </td>
//                      </tr>
//                   ))}
//                 </tbody>
//                  {feeSummary && (
//                   <tfoot className="bg-gray-700/50">
//                     <tr>
//                        <td className="px-4 py-3 text-white font-semibold">Total</td> 
//                        <td className="px-4 py-3 text-white font-semibold">PKR {feeSummary.totalAmount?.toLocaleString()}</td> 
//                        <td className="px-4 py-3 text-green-400 font-semibold">PKR {feeSummary.paidAmount?.toLocaleString()}</td>
//                       <td className="px-4 py-3 text-yellow-400 font-semibold">PKR {feeSummary.remainingAmount?.toLocaleString()}</td>
//                       <td className="px-4 py-3" colSpan="2"></td> 
//                     </tr>
//                   </tfoot>
//                 )} 
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Loader2,
  User,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  FileText,
  CreditCard,
  AlertCircle,
  RefreshCw,
  BarChart3,
  Award,
  DollarSign,
  Wallet,
  Zap,
  Bell,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Users,
  Fingerprint,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function StudentDashboard() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [localProfile, setLocalProfile] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const storedClassName = typeof window !== "undefined" ? localStorage.getItem("className") : null;

  useEffect(() => {
    if (!token || userRole !== "student") {
      router.push("/login");
    }
    if (!userId) {
      setError("Missing student information. Please login again.");
    }
  }, [token, userRole, userId, router]);

  // Fetch profile if className missing
  const { data: profileData } = useQuery({
    queryKey: ["student-profile", userId],
    queryFn: async () => {
      const response = await axios.get(`/api/student/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!userId && !!token && !storedClassName,
    onSuccess: (data) => {
      if (data?.success) {
        const className = data.className;
        const section = data.section;
        if (className) {
          localStorage.setItem("className", className);
          localStorage.setItem("section", section || "");
        }
        setLocalProfile(data);
      } else {
        setError("Unable to fetch student information. Please contact admin.");
      }
    },
    onError: () => {
      setError("Failed to load student information. Please try again.");
    }
  });

  const className = storedClassName || profileData?.className || localProfile?.className;

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["student-dashboard", userId, className],
    queryFn: async () => {
      const response = await axios.get("/api/student/stats", {
        params: { studentId: userId, className },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!userId && !!className && !!token,
    onSuccess: (data) => {
      if (!data?.success) {
        setError(data?.message || "Failed to load dashboard");
      }
    },
    onError: (err) => {
      console.error("Dashboard error:", err);
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid parameters. Please check your information.");
      } else if (err.response?.status === 404) {
        setError("Dashboard API not found. Please contact admin.");
      } else if (err.response?.status === 401) {
        localStorage.clear();
        router.push("/login");
        toast.error("Session expired. Please login again.");
      } else {
        setError("Failed to load dashboard data. Please try again.");
      }
      toast.error("Failed to load dashboard");
    }
  });

  const handleRefresh = () => {
    refetch();
    toast.success("Dashboard refreshed!");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || (dashboardData && !dashboardData.success)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg font-semibold">{error || "Error loading dashboard"}</p>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
            className="mt-6 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { profile, stats, chartData, upcomingWork, fees, feeSummary, feeRecommendations, assignmentRecommendations, overallProgress } = dashboardData;
  const displayProfile = profile || localProfile || {};

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-blue-100 mt-1">Welcome back, {displayProfile?.name || "Student"}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            title="Refresh Dashboard"
          >
            <RefreshCw size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Overview with Complete Details */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden">
              {displayProfile?.photoUrl ? (
                <img 
                  src={displayProfile.photoUrl} 
                  alt={displayProfile.name || "Student"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{displayProfile?.name || "N/A"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                {/* Left Column */}
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <Fingerprint size={14} className="text-gray-500" />
                    <span className="text-gray-500">Roll No:</span>
                    <span className="text-white">{displayProfile?.rollNo || "N/A"}</span>
                  </p>
                  
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <Users size={14} className="text-gray-500" />
                    <span className="text-gray-500">Class/Section:</span>
                    <span className="text-white">{displayProfile?.className || "N/A"} - {displayProfile?.section || "N/A"}</span>
                  </p>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <User size={14} className="text-gray-500" />
                    <span className="text-gray-500">Father's Name:</span>
                    <span className="text-white">{displayProfile?.fatherName || "N/A"}</span>
                  </p>
                </div>
                
                {/* Right Column */}
                <div className="space-y-1">
                  
                  {displayProfile?.email && (
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Mail size={14} className="text-gray-500" />
                      <span className="text-gray-500">Email:</span>
                      <span className="text-white">{displayProfile.email}</span>
                    </p>
                  )}
                  {displayProfile?.phone && (
                    <p className="text-gray-400 text-sm flex items-center gap-2">
                      <Phone size={14} className="text-gray-500" />
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-white">{displayProfile.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Message */}
        {overallProgress && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
            <p className="text-green-400 text-center font-medium flex items-center justify-center gap-2">
              <Zap size={18} />
              {overallProgress.message}
            </p>
          </div>
        )}

        {/* AI Recommendations Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {feeRecommendations && feeRecommendations.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 hover:bg-blue-500/20 transition-colors">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <DollarSign size={16} /> Fee Recommendations
              </h4>
              <ul className="space-y-1">
                {feeRecommendations.slice(0, 3).map((rec, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {assignmentRecommendations && assignmentRecommendations.length > 0 && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 hover:bg-purple-500/20 transition-colors">
              <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                <BookOpen size={16} /> Assignment Recommendations
              </h4>
              <ul className="space-y-1">
                {assignmentRecommendations.map((rec, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fee Summary Cards */}
        {feeSummary && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Fee</p>
                    <p className="text-2xl font-bold text-white">PKR {feeSummary.totalAmount?.toLocaleString() || 0}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-300 opacity-70" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Paid Amount</p>
                    <p className="text-2xl font-bold text-white">PKR {feeSummary.paidAmount?.toLocaleString() || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-300 opacity-70" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">Remaining Amount</p>
                    <p className="text-2xl font-bold text-white">PKR {feeSummary.remainingAmount?.toLocaleString() || 0}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-yellow-300 opacity-70" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Payment Progress</p>
                    <p className="text-2xl font-bold text-white">{feeSummary.paymentProgress || 0}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-300 opacity-70" />
                </div>
              </div>
            </div>

            {/* Fee Status Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center hover:bg-green-500/20 transition-colors">
                <p className="text-green-400 text-sm">Fully Paid</p>
                <p className="text-2xl font-bold text-green-400">{feeSummary.paidMonths || 0}</p>
                <p className="text-green-500/70 text-xs">months</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center hover:bg-yellow-500/20 transition-colors">
                <p className="text-yellow-400 text-sm">Partial Paid</p>
                <p className="text-2xl font-bold text-yellow-400">{feeSummary.partialMonths || 0}</p>
                <p className="text-yellow-500/70 text-xs">months</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center hover:bg-red-500/20 transition-colors">
                <p className="text-red-400 text-sm">Unpaid</p>
                <p className="text-2xl font-bold text-red-400">{(feeSummary.unpaidMonths || 0) + (feeSummary.overdueMonths || 0)}</p>
                <p className="text-red-500/70 text-xs">months</p>
              </div>
            </div>

            {/* Payment Progress Bar */}
            {feeSummary.totalAmount > 0 && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Payment Progress</span>
                  <span>{feeSummary.paymentProgress || 0}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${feeSummary.paymentProgress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {feeSummary.remainingAmount === 0 
                    ? '✅ All fees paid! Thank you.' 
                    : `💰 PKR ${feeSummary.remainingAmount?.toLocaleString()} remaining to be paid`}
                </p>
              </div>
            )}
          </>
        )}

        {/* Stats Cards - Assignments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Assignments</p>
                <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Submitted</p>
                <p className="text-2xl font-bold text-green-400">{stats?.submitted || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-blue-400">{stats?.approved || 0}</p>
              </div>
              <Award className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats?.pendingReview || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Assignments */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Upcoming Assignments
            </h3>
            {!upcomingWork || upcomingWork.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2 opacity-50" />
                <p className="text-gray-400">No pending assignments</p>
                <p className="text-gray-500 text-sm mt-1">All caught up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingWork.map((assignment) => (
                  <div key={assignment._id} className={`bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition-colors ${assignment.daysLeft <= 2 ? 'border-l-4 border-red-500' : assignment.daysLeft <= 7 ? 'border-l-4 border-yellow-500' : ''}`}>
                    <p className="text-white font-medium">{assignment.title}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {assignment.warning && (
                      <p className="text-yellow-400 text-xs mt-1">{assignment.warning}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Chart */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Submission Activity
            </h3>
            <div className="h-64 flex items-center justify-center">
              {!chartData || chartData.length === 0 || (chartData.length === 1 && chartData[0].value === 0) ? (
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No submission data yet</p>
                  <p className="text-gray-500 text-sm mt-1">Submit assignments to see activity</p>
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex items-end justify-around h-48">
                    {chartData.map((item, idx) => {
                      const maxValue = Math.max(...chartData.map(d => d.value), 1);
                      return (
                        <div key={idx} className="text-center flex-1">
                          <div 
                            className="w-full max-w-12 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400 cursor-pointer mx-auto"
                            style={{ height: `${Math.max((item.value / maxValue) * 140, 20)}px`, width: '40px' }}
                          />
                          <p className="text-gray-400 text-xs mt-2">{item.name}</p>
                          <p className="text-white text-xs font-bold">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fees Section */}
        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            Fee Records
          </h3>
          {!fees || fees.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No fee records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Month</th>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Total Amount</th>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Paid Amount</th>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Remaining</th>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-gray-300 text-sm font-semibold">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee, idx) => (
                    <tr key={idx} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-white">{fee.month}</td>
                      <td className="px-4 py-3 text-white font-medium">PKR {fee.amount?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 text-green-400 font-medium">PKR {(fee.amountPaid || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-yellow-400 font-medium">PKR {(fee.remainingAmount || 0).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          fee.status === 'paid' 
                            ? 'bg-green-500/20 text-green-400' 
                            : fee.status === 'partially-paid' 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : fee.isOverdue 
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-red-500/20 text-red-400'
                        }`}>
                          {fee.status === 'paid' ? '✓ Paid' : fee.status === 'partially-paid' ? '⚠ Partially Paid' : fee.isOverdue ? '⚠ Overdue' : '✗ Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {feeSummary && (
                  <tfoot className="bg-gray-700/50">
                    <tr>
                      <td className="px-4 py-3 text-white font-semibold">Total</td>
                      <td className="px-4 py-3 text-white font-semibold">PKR {feeSummary.totalAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-400 font-semibold">PKR {feeSummary.paidAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-yellow-400 font-semibold">PKR {feeSummary.remainingAmount?.toLocaleString()}</td>
                      <td className="px-4 py-3" colSpan="2"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}