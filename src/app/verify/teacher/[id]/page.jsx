// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   User,
//   GraduationCap,
//   Hash,
//   Calendar,
//   IdCard,
//   Shield,
//   School,
//   Clock,
//   Mail,
//   Phone,
//   Building,
//   Award,
//   XCircle
// } from "lucide-react";
// import apiClient from "@/services/apiClient";

// export default function VerifyTeacherPage() {
//   const params = useParams();
//   const router = useRouter();
//   const teacherId = params?.id;
  
//   const [teacher, setTeacher] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [verificationTime, setVerificationTime] = useState(null);

//   useEffect(() => {
//     if (teacherId) {
//       verifyTeacher();
//       setVerificationTime(new Date().toLocaleString());
//     }
//   }, [teacherId]);

//   const verifyTeacher = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(`/verify/teacher/${teacherId}`);
      
//       if (response.data.success) {
//         setTeacher(response.data.data);
//       } else {
//         setError(response.data.error || "Verification failed");
//       }
//     } catch (err) {
//       console.error("Verification error:", err);
//       setError(err.response?.data?.error || "Teacher not found or invalid ID");
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

//   // Loading State
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

//   // Error State
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
//           <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <XCircle className="w-12 h-12 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
//           <p className="text-gray-500 mb-4">{error}</p>
//           <div className="bg-gray-50 rounded-lg p-3 mb-6">
//             <p className="text-xs text-gray-400">Scanned ID: {teacherId}</p>
//           </div>
//           <p className="text-sm text-gray-400 mb-6">
//             This ID card may be invalid or not registered in our system.
//             Please contact the school administration.
//           </p>
//           <button
//             onClick={() => window.close()}
//             className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Close Window
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!teacher) return null;

//   const isExpired = teacher.isExpired;

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

//         {/* Main ID Card */}
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
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
//                 {teacher.photoUrl ? (
//                   <img
//                     src={teacher.photoUrl}
//                     alt={teacher.name}
//                     className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
//                   />
//                 ) : (
//                   <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
//                     {teacher.name?.charAt(0).toUpperCase() || "T"}
//                   </div>
//                 )}
//                 <div className="absolute -bottom-1 -right-1">
//                   {!isExpired && (
//                     <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
//                   )}
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
//                 <p className="text-sm text-gray-500">Teacher ID: {teacher.teacherCode || teacher._id?.slice(-8)}</p>
//                 <p className="text-xs text-gray-400 mt-1">{teacher.department || "Faculty"}</p>
//               </div>
//             </div>

//             {/* Teacher Details */}
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Mail size={16} />
//                   <span className="text-sm">Email</span>
//                 </div>
//                 <span className="font-medium text-gray-800 text-sm">{teacher.email}</span>
//               </div>
              
//               {teacher.phone && (
//                 <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                   <div className="flex items-center gap-2 text-gray-500">
//                     <Phone size={16} />
//                     <span className="text-sm">Phone</span>
//                   </div>
//                   <span className="font-medium text-gray-800 text-sm">{teacher.phone}</span>
//                 </div>
//               )}
              
//               <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Building size={16} />
//                   <span className="text-sm">Department</span>
//                 </div>
//                 <span className="font-medium text-gray-800">{teacher.department || "General"}</span>
//               </div>
              
//               <div className="flex items-center justify-between py-2 border-b border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <Award size={16} />
//                   <span className="text-sm">Qualification</span>
//                 </div>
//                 <span className="font-medium text-gray-800 text-sm">{teacher.qualification || "N/A"}</span>
//               </div>
//             </div>

//             {/* Card Details */}
//             <div className="bg-gray-50 rounded-lg p-3 mb-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-500">Card Number:</span>
//                 <span className="font-mono text-gray-700">{teacher.cardNumber}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mt-2">
//                 <span className="text-gray-500">Teacher Code:</span>
//                 <span className="font-mono text-gray-700">{teacher.teacherCode}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mt-2">
//                 <span className="text-gray-500">Issue Date:</span>
//                 <span className="text-gray-700">{formatDate(teacher.issueDate)}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm mt-2">
//                 <span className="text-gray-500">Expiry Date:</span>
//                 <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
//                   {formatDate(teacher.expiryDate)}
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
//                 <span>Verified on: {verificationTime}</span>
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
//             onClick={() => window.close()}
//             className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             Close Window →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }















































"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Hash,
  Calendar,
  IdCard,
  Shield,
  School,
  Clock,
  Mail,
  Phone,
  Building,
  Award,
  XCircle,
  QrCode
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function VerifyTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params?.id;
  
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationTime, setVerificationTime] = useState(null);

  useEffect(() => {
    if (teacherId) {
      verifyTeacher();
      setVerificationTime(new Date().toLocaleString());
    }
  }, [teacherId]);

  const verifyTeacher = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/verify/teacheres/${teacherId}`);
      
      if (response.data.success) {
        setTeacher(response.data.teacher);
        setAttendance(response.data.attendance);
        
        // Show toast message for attendance
        if (response.data.attendance.marked) {
          toast.success(`Attendance marked: ${response.data.attendance.status.toUpperCase()} at ${response.data.attendance.checkInTime}`);
        } else if (response.data.attendance.alreadyMarked) {
          toast.info(`Already marked at ${response.data.attendance.checkInTime}`);
        }
      } else {
        setError(response.data.error || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || "Teacher not found or invalid ID");
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

  // Loading State
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

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-400">Scanned ID: {teacherId}</p>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            This ID card may be invalid or not registered in our system.
            Please contact the school administration.
          </p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  if (!teacher) return null;

  const isExpired = teacher.isExpired;

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
        {attendance && (
          <div className={`mb-6 p-4 rounded-xl text-center ${
            attendance.isLate ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
          }`}>
            <p className="text-sm font-semibold">
              {attendance.alreadyMarked ? '✓ Attendance Already Marked' : '✓ Attendance Marked Successfully'}
            </p>
            <p className="text-xs mt-1">
              {attendance.status.toUpperCase()} at {attendance.checkInTime} on {attendance.date}
            </p>
            {attendance.isLate && (
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
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {teacher.name?.charAt(0).toUpperCase() || "T"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1">
                  {!isExpired && (
                    <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
                <p className="text-sm text-gray-500">Teacher ID: {teacher.teacherCode || teacher._id?.slice(-8)}</p>
                <p className="text-xs text-gray-400 mt-1">{teacher.department || "Faculty"}</p>
              </div>
            </div>

            {/* Teacher Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={16} />
                  <span className="text-sm">Email</span>
                </div>
                <span className="font-medium text-gray-800 text-sm">{teacher.email}</span>
              </div>
              
              {teacher.phone && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={16} />
                    <span className="text-sm">Phone</span>
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{teacher.phone}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Building size={16} />
                  <span className="text-sm">Department</span>
                </div>
                <span className="font-medium text-gray-800">{teacher.department || "General"}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Award size={16} />
                  <span className="text-sm">Qualification</span>
                </div>
                <span className="font-medium text-gray-800 text-sm">{teacher.qualification || "N/A"}</span>
              </div>
            </div>

            {/* Card Details */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Card Number:</span>
                <span className="font-mono text-gray-700">{teacher.cardNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Issue Date:</span>
                <span className="text-gray-700">{formatDate(teacher.issueDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Expiry Date:</span>
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {formatDate(teacher.expiryDate)}
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
                <span>Verified on: {verificationTime}</span>
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

        {/* Buttons */}
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => window.close()}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close Window →
          </button>
        </div>
      </div>
    </div>
  );
}