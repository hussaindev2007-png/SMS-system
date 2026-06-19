// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { School, CheckCircle, Loader2, AlertCircle } from "lucide-react";
// import apiClient from "@/services/apiClient";

// export default function TeacherQRLoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const teacherCode = searchParams.get("code");
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [attendanceStatus, setAttendanceStatus] = useState(null);
//   const [teacherName, setTeacherName] = useState("");

//   useEffect(() => {
//     if (teacherCode) {
//       processQRLogin();
//     } else {
//       setError("Invalid QR code");
//       setLoading(false);
//     }
//   }, [teacherCode]);

//   const processQRLogin = async () => {
//     try {
//       // Step 1: Get teacher info from QR code
//       const infoResponse = await apiClient.post("/auth/teacher-qr-login", {
//         action: "qr-info",
//         teacherCode
//       });
      
//       if (!infoResponse.data.success) {
//         setError(infoResponse.data.message);
//         setLoading(false);
//         return;
//       }
      
//       const { teacherId, name, email } = infoResponse.data;
//       setTeacherName(name);
      
//       // Step 2: Mark attendance and get login token
//       const attendanceResponse = await apiClient.post("/teacher/attendance", {
//         teacherId,
//         source: "QR"
//       });
      
//       if (attendanceResponse.data.success) {
//         // ✅ Save login token to localStorage
//         if (attendanceResponse.data.token) {
//           localStorage.setItem("token", attendanceResponse.data.token);
//           localStorage.setItem("userRole", "teacher");
//           localStorage.setItem("userId", teacherId);
//           localStorage.setItem("userName", name);
//           localStorage.setItem("userEmail", email || "");
//         }
        
//         setAttendanceStatus({
//           marked: true,
//           checkInTime: attendanceResponse.data.checkInTime,
//           alreadyMarked: attendanceResponse.data.alreadyMarked || false,
//           teacherName: name
//         });
        
//         // Redirect to dashboard after 2 seconds
//         setTimeout(() => {
//           router.push("/dashboard/teacher");
//         }, 2000);
        
//       } else if (attendanceResponse.data.alreadyMarked) {
//         // Already marked today - still login
//         if (attendanceResponse.data.token) {
//           localStorage.setItem("token", attendanceResponse.data.token);
//           localStorage.setItem("userRole", "teacher");
//           localStorage.setItem("userId", teacherId);
//           localStorage.setItem("userName", name);
//           localStorage.setItem("userEmail", email || "");
//         }
        
//         setAttendanceStatus({
//           marked: false,
//           alreadyMarked: true,
//           checkInTime: attendanceResponse.data.checkInTime,
//           teacherName: name
//         });
        
//         setTimeout(() => {
//           router.push("/dashboard/teacher");
//         }, 2000);
        
//       } else {
//         setError(attendanceResponse.data.message || "Failed to mark attendance");
//         setLoading(false);
//       }
      
//     } catch (error) {
//       console.error("QR Login error:", error);
//       setError(error.response?.data?.message || "Failed to process QR code");
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-400">Processing QR code...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
//         <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-white mb-2">Error</h2>
//           <p className="text-gray-400 mb-6">{error}</p>
//           <button
//             onClick={() => router.push("/login")}
//             className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (attendanceStatus) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
//         <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
//             <CheckCircle className="w-8 h-8 text-green-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">
//             {attendanceStatus.alreadyMarked ? "Welcome Back!" : "Attendance Marked!"}
//           </h2>
//           <p className="text-gray-300 text-lg mb-2">
//             Welcome, {attendanceStatus.teacherName}
//           </p>
//           <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
//             <p className="text-gray-300">
//               {attendanceStatus.alreadyMarked 
//                 ? `✓ You were already marked today at ${attendanceStatus.checkInTime}`
//                 : `✓ Checked in successfully at ${attendanceStatus.checkInTime}`}
//             </p>
//           </div>
//           <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
//           <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mt-4" />
//         </div>
//       </div>
//     );
//   }

//   return null;
// }































// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { School, CheckCircle, Loader2, AlertCircle, QrCode, Mail } from "lucide-react";
// import apiClient from "@/services/apiClient";

// export default function TeacherQRLoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const teacherCode = searchParams.get("code");
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [teacherData, setTeacherData] = useState(null);
//   const [attendanceStatus, setAttendanceStatus] = useState(null);

//   useEffect(() => {
//     if (teacherCode) {
//       verifyTeacher();
//     } else {
//       setError("Invalid QR code");
//       setLoading(false);
//     }
//   }, [teacherCode]);

//   const verifyTeacher = async () => {
//     try {
//       // ✅ Call verification API instead of login API
//       const response = await apiClient.get(`/verify/teacher/${teacherCode}`);
      
//       if (response.data.success) {
//         setTeacherData(response.data.teacher);
//         setAttendanceStatus(response.data.attendance);
//       } else {
//         setError(response.data.error || "Verification failed");
//       }
//     } catch (error) {
//       console.error("Verification error:", error);
//       setError(error.response?.data?.error || "Failed to verify teacher");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
//           <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600 font-medium text-lg">Verifying Teacher Identity...</p>
//           <p className="text-sm text-gray-400 mt-2">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
//           <p className="text-gray-500 mb-4">{error}</p>
//           <div className="bg-gray-50 rounded-lg p-3 mb-6">
//             <p className="text-xs text-gray-400">Scanned Code: {teacherCode}</p>
//           </div>
//           <button
//             onClick={() => router.push("/login")}
//             className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!teacherData) return null;

//   const isExpired = teacherData.isExpired;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         {/* Success Badge */}
//         <div className="text-center mb-6">
//           <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
//             isExpired ? 'bg-red-100' : 'bg-green-100'
//           }`}>
//             {isExpired ? (
//               <>
//                 <AlertCircle className="w-5 h-5 text-red-600" />
//                 <span className="text-red-700 font-semibold">⚠️ Card Expired</span>
//               </>
//             ) : (
//               <>
//                 <Shield className="w-5 h-5 text-green-600" />
//                 <span className="text-green-700 font-semibold">✓ Verified Teacher</span>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Attendance Status Card */}
//         {attendanceStatus && (
//           <div className={`mb-6 p-4 rounded-xl text-center ${
//             attendanceStatus.isLate ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
//           }`}>
//             <p className="text-sm font-semibold">
//               {attendanceStatus.alreadyMarked ? '✓ Attendance Already Marked' : '✓ Attendance Marked Successfully'}
//             </p>
//             <p className="text-xs mt-1">
//               {attendanceStatus.status.toUpperCase()} at {attendanceStatus.checkInTime} on {attendanceStatus.date}
//             </p>
//             {attendanceStatus.isLate && (
//               <p className="text-xs text-yellow-600 mt-1">⚠️ Late arrival recorded</p>
//             )}
//           </div>
//         )}

//         {/* Main ID Card */}
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-6">
//             <School className="w-12 h-12 mx-auto mb-2 opacity-90" />
//             <h2 className="text-xl font-bold tracking-wide">SCHOOL MANAGEMENT SYSTEM</h2>
//             <p className="text-sm opacity-90 mt-1">Official Teacher Verification Document</p>
//           </div>

//           {/* Content */}
//           <div className="p-6">
//             {/* Profile Section */}
//             <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
//               <div className="relative">
//                 {teacherData.photoUrl ? (
//                   <img
//                     src={teacherData.photoUrl}
//                     alt={teacherData.name}
//                     className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
//                     {teacherData.name?.charAt(0).toUpperCase() || "T"}
//                   </div>
//                 )}
//                 <div className="absolute -bottom-1 -right-1">
//                   {!isExpired && (
//                     <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
//                   )}
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-800">{teacherData.name}</h3>
//                 <p className="text-sm text-gray-500">Teacher ID: {teacherData.teacherCode || teacherData._id?.slice(-8)}</p>
//                 <p className="text-xs text-gray-400 mt-1">{teacherData.department || "Faculty"}</p>
//               </div>
//             </div>

//             {/* Teacher Details */}
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Mail size={16} />
//                   <span className="text-sm">Email</span>
//                 </div>
//                 <span className="font-medium text-gray-800 text-sm">{teacherData.email}</span>
//               </div>
              
//               {teacherData.phone && (
//                 <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                   <div className="flex items-center gap-2 text-gray-500">
//                     <Phone size={16} />
//                     <span className="text-sm">Phone</span>
//                   </div>
//                   <span className="font-medium text-gray-800 text-sm">{teacherData.phone}</span>
//                 </div>
//               )}
              
//               <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Building size={16} />
//                   <span className="text-sm">Department</span>
//                 </div>
//                 <span className="font-medium text-gray-800">{teacherData.department || "General"}</span>
//               </div>
              
//               <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Award size={16} />
//                   <span className="text-sm">Qualification</span>
//                 </div>
//                 <span className="font-medium text-gray-800 text-sm">{teacherData.qualification || "N/A"}</span>
//               </div>
//             </div>

//             {/* Card Details */}
//             <div className="bg-gray-50 rounded-lg p-3 mb-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-500">Card Number:</span>
//                 <span className="font-mono text-gray-700">{teacherData.cardNumber}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mt-2">
//                 <span className="text-gray-500">Issue Date:</span>
//                 <span className="text-gray-700">{formatDate(teacherData.issueDate)}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mt-2">
//                 <span className="text-gray-500">Expiry Date:</span>
//                 <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
//                   {formatDate(teacherData.expiryDate)}
//                 </span>
//               </div>
//             </div>

//             {/* Verification Stamp */}
//             <div className={`p-4 rounded-lg border-2 ${isExpired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 {isExpired ? (
//                   <>
//                     <AlertCircle className="w-5 h-5 text-red-600" />
//                     <span className="text-red-700 font-semibold">CARD EXPIRED</span>
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                     <span className="text-green-700 font-semibold">VERIFICATION SUCCESSFUL</span>
//                   </>
//                 )}
//               </div>
              
//               <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
//                 <Clock size={12} />
//                 <span>Verified on: {new Date().toLocaleString()}</span>
//               </div>
              
//               <div className="mt-2 text-center">
//                 <p className="text-[10px] text-gray-400">
//                   This is an electronically generated verification document
//                 </p>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-4 text-center">
//               <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
//                 <IdCard size={10} />
//                 Digitally Verified • School Management System
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Instructions */}
//         <div className="mt-6 text-center">
//           <p className="text-xs text-gray-500">
//             This verification is valid only for the current session.
//           </p>
//         </div>

//         {/* Back Button */}
//         <div className="mt-4 text-center">
//           <button
//             onClick={() => router.push("/login")}
//             className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
//           >
//             Go to Login →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Missing Icons
// const Shield = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//   </svg>
// );

// const Phone = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
//   </svg>
// );

// const Building = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
//     <line x1="9" y1="22" x2="9" y2="18"/>
//     <line x1="15" y1="22" x2="15" y2="18"/>
//     <line x1="9" y1="14" x2="9" y2="10"/>
//     <line x1="15" y1="14" x2="15" y2="10"/>
//   </svg>
// );

// const Award = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <circle cx="12" cy="8" r="7"/>
//     <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
//   </svg>
// );

// const Clock = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <circle cx="12" cy="12" r="10"/>
//     <polyline points="12 6 12 12 16 14"/>
//   </svg>
// );

// const IdCard = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <rect x="2" y="5" width="20" height="14" rx="2"/>
//     <line x1="2" y1="10" x2="22" y2="10"/>
//     <line x1="7" y1="15" x2="7" y2="15"/>
//     <line x1="12" y1="15" x2="17" y2="15"/>
//   </svg>
// );










"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { School, CheckCircle, Loader2, AlertCircle, QrCode, Mail } from "lucide-react";
import apiClient from "@/services/apiClient";

// ==================== MAIN COMPONENT WITH SUSPENSE ====================
export default function TeacherQRLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Loading QR Login...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    }>
      <TeacherQRLoginContent />
    </Suspense>
  );
}

// ==================== ACTUAL QR LOGIN CONTENT ====================
function TeacherQRLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherCode = searchParams.get("code");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    if (teacherCode) {
      verifyTeacher();
    } else {
      setError("Invalid QR code");
      setLoading(false);
    }
  }, [teacherCode]);

  const verifyTeacher = async () => {
    try {
      const response = await apiClient.get(`/verify/teacher/${teacherCode}`);
      
      if (response.data.success) {
        setTeacherData(response.data.teacher);
        setAttendanceStatus(response.data.attendance);
      } else {
        setError(response.data.error || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(error.response?.data?.error || "Failed to verify teacher");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">Verifying Teacher Identity...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-400">Scanned Code: {teacherCode}</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!teacherData) return null;

  const isExpired = teacherData.isExpired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Success Badge */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
            isExpired ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {isExpired ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 font-semibold">⚠️ Card Expired</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-semibold">✓ Verified Teacher</span>
              </>
            )}
          </div>
        </div>

        {/* Attendance Status Card */}
        {attendanceStatus && (
          <div className={`mb-6 p-4 rounded-xl text-center ${
            attendanceStatus.isLate ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
          }`}>
            <p className="text-sm font-semibold">
              {attendanceStatus.alreadyMarked ? '✓ Attendance Already Marked' : '✓ Attendance Marked Successfully'}
            </p>
            <p className="text-xs mt-1">
              {attendanceStatus.status.toUpperCase()} at {attendanceStatus.checkInTime} on {attendanceStatus.date}
            </p>
            {attendanceStatus.isLate && (
              <p className="text-xs text-yellow-600 mt-1">⚠️ Late arrival recorded</p>
            )}
          </div>
        )}

        {/* Main ID Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-6">
            <School className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <h2 className="text-xl font-bold tracking-wide">SCHOOL MANAGEMENT SYSTEM</h2>
            <p className="text-sm opacity-90 mt-1">Official Teacher Verification Document</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
              <div className="relative">
                {teacherData.photoUrl ? (
                  <img
                    src={teacherData.photoUrl}
                    alt={teacherData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {teacherData.name?.charAt(0).toUpperCase() || "T"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1">
                  {!isExpired && (
                    <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{teacherData.name}</h3>
                <p className="text-sm text-gray-500">Teacher ID: {teacherData.teacherCode || teacherData._id?.slice(-8)}</p>
                <p className="text-xs text-gray-400 mt-1">{teacherData.department || "Faculty"}</p>
              </div>
            </div>

            {/* Teacher Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={16} />
                  <span className="text-sm">Email</span>
                </div>
                <span className="font-medium text-gray-800 text-sm">{teacherData.email}</span>
              </div>
              
              {teacherData.phone && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={16} />
                    <span className="text-sm">Phone</span>
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{teacherData.phone}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Building size={16} />
                  <span className="text-sm">Department</span>
                </div>
                <span className="font-medium text-gray-800">{teacherData.department || "General"}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Award size={16} />
                  <span className="text-sm">Qualification</span>
                </div>
                <span className="font-medium text-gray-800 text-sm">{teacherData.qualification || "N/A"}</span>
              </div>
            </div>

            {/* Card Details */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Card Number:</span>
                <span className="font-mono text-gray-700">{teacherData.cardNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Issue Date:</span>
                <span className="text-gray-700">{formatDate(teacherData.issueDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Expiry Date:</span>
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {formatDate(teacherData.expiryDate)}
                </span>
              </div>
            </div>

            {/* Verification Stamp */}
            <div className={`p-4 rounded-lg border-2 ${isExpired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isExpired ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-semibold">CARD EXPIRED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">VERIFICATION SUCCESSFUL</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>Verified on: {new Date().toLocaleString()}</span>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-[10px] text-gray-400">
                  This is an electronically generated verification document
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <IdCard size={10} />
                Digitally Verified • School Management System
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This verification is valid only for the current session.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Go to Login →
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== ICON COMPONENTS ====================
const Shield = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const Phone = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const Building = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="9" y1="22" x2="9" y2="18"/>
    <line x1="15" y1="22" x2="15" y2="18"/>
    <line x1="9" y1="14" x2="9" y2="10"/>
    <line x1="15" y1="14" x2="15" y2="10"/>
  </svg>
);

const Award = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="7"/>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);

const Clock = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IdCard = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
    <line x1="7" y1="15" x2="7" y2="15"/>
    <line x1="12" y1="15" x2="17" y2="15"/>
  </svg>
);