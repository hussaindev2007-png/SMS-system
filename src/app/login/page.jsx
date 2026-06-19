// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { 
//   GraduationCap, 
//   Mail, 
//   Lock, 
//   Hash, 
//   Eye, 
//   EyeOff,
//   School,
//   UserCog,
//   UserCircle,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   FileText,
//   UserPlus
// } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [role, setRole] = useState("student");
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [admissionStatus, setAdmissionStatus] = useState(null);
//   const [checkingStatus, setCheckingStatus] = useState(false);

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     if (token && userRole) {
//       router.push(`/dashboard/${userRole}`);
//     }
//   }, [router]);

//   // Check student admission status
//   const checkAdmissionStatus = async (rollNo) => {
//     setCheckingStatus(true);
//     setAdmissionStatus(null);
    
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           identifier: rollNo, 
//           action: "check_status",
//           role: "student"
//         })
//       });
      
//       const data = await res.json();
//       if (res.ok) {
//         setAdmissionStatus({
//           exists: true,
//           status: data.status,
//           name: data.name
//         });
//       } else {
//         setAdmissionStatus({
//           exists: false,
//           message: data.message
//         });
//       }
//     } catch (error) {
//       setAdmissionStatus({
//         exists: false,
//         message: "Error checking status"
//       });
//     } finally {
//       setCheckingStatus(false);
//     }
//   };

//   // Handle identifier blur for student roll number check
//   const handleIdentifierBlur = () => {
//     if (role === "student" && identifier.trim() && !password) {
//       checkAdmissionStatus(identifier.trim());
//     }
//   };

//   // Handle login submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!identifier.trim() || !password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identifier: identifier.trim(),
//           password,
//           role
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
        
//         const userRole = data.user.role;
        
//         if (userRole === "admin") {
//           router.push("/dashboard/admin");
//         } else if (userRole === "teacher") {
//           router.push("/dashboard/teacher");
//         } else if (userRole === "student") {
//           router.push("/dashboard/student");
//         } else {
//           router.push(`/dashboard/${userRole}`);
//         }
//       } else {
//         setError(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Network error. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Role options
//   const roles = [
//     { 
//       id: "student", 
//       label: "Student", 
//       icon: GraduationCap, 
//       color: "blue", 
//       placeholder: "Roll Number", 
//       inputType: "text",
//       registerLink: "/admission",
//       registerText: "New Admission?",
//       registerIcon: FileText
//     },
//     { 
//       id: "teacher", 
//       label: "Teacher", 
//       icon: UserCircle, 
//       color: "green", 
//       placeholder: "Email Address", 
//       inputType: "email",
//       registerLink: "/register",
//       registerText: "New Registration?",
//       registerIcon: UserPlus
//     },
//     { 
//       id: "admin", 
//       label: "Admin", 
//       icon: UserCog, 
//       color: "purple", 
//       placeholder: "Email Address", 
//       inputType: "email",
//       registerLink: null,
//       registerText: null,
//       registerIcon: null
//     }
//   ];

//   const currentRole = roles.find(r => r.id === role);
//   const RegisterIcon = currentRole?.registerIcon;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
//       </div>

//       {/* Login Card */}
//       <div className="relative w-full max-w-md">
//         {/* Logo/Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//             <School className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white">School Portal</h1>
//           <p className="text-gray-400 mt-2">Login to access your dashboard</p>
//         </div>

//         {/* Role Selection Tabs */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 mb-6 flex gap-1">
//           {roles.map((r) => {
//             const Icon = r.icon;
//             const colorClasses = {
//               blue: "bg-blue-600 text-white",
//               green: "bg-green-600 text-white",
//               purple: "bg-purple-600 text-white"
//             };
//             return (
//               <button
//                 key={r.id}
//                 onClick={() => {
//                   setRole(r.id);
//                   setIdentifier("");
//                   setPassword("");
//                   setError("");
//                   setAdmissionStatus(null);
//                 }}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
//                   role === r.id
//                     ? colorClasses[r.color]
//                     : "text-gray-400 hover:text-white hover:bg-gray-700"
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span className="font-medium">{r.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Login Form */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Identifier Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 {currentRole.placeholder}
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   {role === "student" ? (
//                     <Hash size={18} className="text-gray-500" />
//                   ) : (
//                     <Mail size={18} className="text-gray-500" />
//                   )}
//                 </div>
//                 <input
//                   type={currentRole.inputType}
//                   value={identifier}
//                   onChange={(e) => {
//                     setIdentifier(e.target.value);
//                     if (role === "student") setAdmissionStatus(null);
//                   }}
//                   onBlur={handleIdentifierBlur}
//                   placeholder={`Enter ${currentRole.placeholder.toLowerCase()}`}
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                   required
//                 />
//               </div>
              
//               {/* Checking Status Indicator */}
//               {checkingStatus && (
//                 <div className="mt-2 text-sm text-blue-400 flex items-center gap-2">
//                   <Loader2 size={14} className="animate-spin" />
//                   <span>Checking admission status...</span>
//                 </div>
//               )}
              
//               {/* Admission Status Message for Students */}
//               {role === "student" && admissionStatus && !checkingStatus && (
//                 <div className={`mt-2 text-sm flex items-center gap-2 ${
//                   admissionStatus.status === "active" 
//                     ? "text-green-400" 
//                     : admissionStatus.exists 
//                     ? "text-yellow-400"
//                     : "text-red-400"
//                 }`}>
//                   {admissionStatus.status === "active" ? (
//                     <CheckCircle size={14} />
//                   ) : (
//                     <AlertCircle size={14} />
//                   )}
//                   <span>
//                     {admissionStatus.exists 
//                       ? admissionStatus.status === "active"
//                         ? `✓ Admission approved for ${admissionStatus.name}. You can login.`
//                         : `⚠ Admission pending approval. Please wait for admin confirmation.`
//                       : admissionStatus.message || "Roll number not found"}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Password Field */}
//             {!(role === "student" && admissionStatus?.status !== "active") && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-gray-500" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     className="w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff size={18} className="text-gray-500 hover:text-gray-300" />
//                     ) : (
//                       <Eye size={18} className="text-gray-500 hover:text-gray-300" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
//                 <p className="text-red-400 text-sm flex items-center gap-2">
//                   <AlertCircle size={16} />
//                   {error}
//                 </p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading || (role === "student" && admissionStatus?.status !== "active")}
//               className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Logging in...</span>
//                 </div>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>

//           {/* 🔥 NEW: Role-based Registration/Admission Link */}
//           {currentRole.registerLink && currentRole.registerText && (
//             <div className="mt-4 pt-3 border-t border-gray-700">
//               <Link
//                 href={currentRole.registerLink}
//                 className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors group"
//               >
//                 {RegisterIcon && <RegisterIcon size={16} className="group-hover:text-blue-400" />}
//                 <span>{currentRole.registerText}</span>
//               </Link>
//             </div>
//           )}

//           {/* Help Links */}
//           <div className="mt-4 pt-3 border-t border-gray-700 text-center">
//             <div className="flex justify-center gap-4 text-sm">
//               <button className="text-gray-400 hover:text-blue-400 transition-colors">
//                 Forgot Password?
//               </button>
//               <button className="text-gray-400 hover:text-blue-400 transition-colors">
//                 Need Help?
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer Note */}
//         <p className="text-center text-gray-500 text-xs mt-6">
//           © 2024 School Management System. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }































// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { 
//   GraduationCap, 
//   Mail, 
//   Lock, 
//   Hash, 
//   Eye, 
//   EyeOff,
//   School,
//   UserCog,
//   UserCircle,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   FileText,
//   UserPlus
// } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [role, setRole] = useState("student");
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [admissionStatus, setAdmissionStatus] = useState(null);
//   const [checkingStatus, setCheckingStatus] = useState(false);

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     if (token && userRole) {
//       router.push(`/dashboard/${userRole}`);
//     }
//   }, [router]);

//   // Check student admission status
//   const checkAdmissionStatus = async (rollNo) => {
//     setCheckingStatus(true);
//     setAdmissionStatus(null);
    
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           identifier: rollNo, 
//           action: "check_status",
//           role: "student"
//         })
//       });
      
//       const data = await res.json();
//       if (res.ok) {
//         setAdmissionStatus({
//           exists: true,
//           status: data.status,
//           name: data.name
//         });
//       } else {
//         setAdmissionStatus({
//           exists: false,
//           message: data.message
//         });
//       }
//     } catch (error) {
//       setAdmissionStatus({
//         exists: false,
//         message: "Error checking status"
//       });
//     } finally {
//       setCheckingStatus(false);
//     }
//   };

//   // Handle identifier blur for student roll number check
//   const handleIdentifierBlur = () => {
//     if (role === "student" && identifier.trim() && !password) {
//       checkAdmissionStatus(identifier.trim());
//     }
//   };

//   // Handle login submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!identifier.trim() || !password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identifier: identifier.trim(),
//           password,
//           role
//         })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // ✅ Save token
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
        
//         // ✅ SAVE CLASS NAME, SECTION, ROLL NO - FIXED!
//         if (data.user.className) {
//           localStorage.setItem("className", data.user.className);
//         }
//         if (data.user.section) {
//           localStorage.setItem("section", data.user.section);
//         }
//         if (data.user.rollNo) {
//           localStorage.setItem("rollNo", data.user.rollNo);
//         }
        
//         // ✅ Debug log
//        
        
//         const userRole = data.user.role;
        
//         if (userRole === "admin") {
//           router.push("/dashboard/admin");
//         } else if (userRole === "teacher") {
//           router.push("/dashboard/teacher");
//         } else if (userRole === "student") {
//           router.push("/dashboard/student");
//         } else {
//           router.push(`/dashboard/${userRole}`);
//         }
//       } else {
//         setError(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Network error. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Role options
//   const roles = [
//     { 
//       id: "student", 
//       label: "Student", 
//       icon: GraduationCap, 
//       color: "blue", 
//       placeholder: "Roll Number", 
//       inputType: "text",
//       registerLink: "/admission",
//       registerText: "New Admission?",
//       registerIcon: FileText
//     },
//     { 
//       id: "teacher", 
//       label: "Teacher", 
//       icon: UserCircle, 
//       color: "green", 
//       placeholder: "Email Address", 
//       inputType: "email",
//       registerLink: "/register",
//       registerText: "New Registration?",
//       registerIcon: UserPlus
//     },
//     { 
//       id: "admin", 
//       label: "Admin", 
//       icon: UserCog, 
//       color: "purple", 
//       placeholder: "Email Address", 
//       inputType: "email",
//       registerLink: null,
//       registerText: null,
//       registerIcon: null
//     }
//   ];

//   const currentRole = roles.find(r => r.id === role);
//   const RegisterIcon = currentRole?.registerIcon;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
//       </div>

//       {/* Login Card */}
//       <div className="relative w-full max-w-md">
//         {/* Logo/Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//             <School className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white">School Portal</h1>
//           <p className="text-gray-400 mt-2">Login to access your dashboard</p>
//         </div>

//         {/* Role Selection Tabs */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 mb-6 flex gap-1">
//           {roles.map((r) => {
//             const Icon = r.icon;
//             const colorClasses = {
//               blue: "bg-blue-600 text-white",
//               green: "bg-green-600 text-white",
//               purple: "bg-purple-600 text-white"
//             };
//             return (
//               <button
//                 key={r.id}
//                 onClick={() => {
//                   setRole(r.id);
//                   setIdentifier("");
//                   setPassword("");
//                   setError("");
//                   setAdmissionStatus(null);
//                 }}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
//                   role === r.id
//                     ? colorClasses[r.color]
//                     : "text-gray-400 hover:text-white hover:bg-gray-700"
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span className="font-medium">{r.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Login Form */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Identifier Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 {currentRole.placeholder}
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   {role === "student" ? (
//                     <Hash size={18} className="text-gray-500" />
//                   ) : (
//                     <Mail size={18} className="text-gray-500" />
//                   )}
//                 </div>
//                 <input
//                   type={currentRole.inputType}
//                   value={identifier}
//                   onChange={(e) => {
//                     setIdentifier(e.target.value);
//                     if (role === "student") setAdmissionStatus(null);
//                   }}
//                   onBlur={handleIdentifierBlur}
//                   placeholder={`Enter ${currentRole.placeholder.toLowerCase()}`}
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                   required
//                 />
//               </div>
              
//               {/* Checking Status Indicator */}
//               {checkingStatus && (
//                 <div className="mt-2 text-sm text-blue-400 flex items-center gap-2">
//                   <Loader2 size={14} className="animate-spin" />
//                   <span>Checking admission status...</span>
//                 </div>
//               )}
              
//               {/* Admission Status Message for Students */}
//               {role === "student" && admissionStatus && !checkingStatus && (
//                 <div className={`mt-2 text-sm flex items-center gap-2 ${
//                   admissionStatus.status === "active" 
//                     ? "text-green-400" 
//                     : admissionStatus.exists 
//                     ? "text-yellow-400"
//                     : "text-red-400"
//                 }`}>
//                   {admissionStatus.status === "active" ? (
//                     <CheckCircle size={14} />
//                   ) : (
//                     <AlertCircle size={14} />
//                   )}
//                   <span>
//                     {admissionStatus.exists 
//                       ? admissionStatus.status === "active"
//                         ? `✓ Admission approved for ${admissionStatus.name}. You can login.`
//                         : `⚠ Admission pending approval. Please wait for admin confirmation.`
//                       : admissionStatus.message || "Roll number not found"}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Password Field */}
//             {!(role === "student" && admissionStatus?.status !== "active") && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-gray-500" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     className="w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff size={18} className="text-gray-500 hover:text-gray-300" />
//                     ) : (
//                       <Eye size={18} className="text-gray-500 hover:text-gray-300" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
//                 <p className="text-red-400 text-sm flex items-center gap-2">
//                   <AlertCircle size={16} />
//                   {error}
//                 </p>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading || (role === "student" && admissionStatus?.status !== "active")}
//               className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Logging in...</span>
//                 </div>
//               ) : (
//                 "Login"
//               )}
//             </button>
//           </form>

//           {/* Role-based Registration/Admission Link */}
//           {currentRole.registerLink && currentRole.registerText && (
//             <div className="mt-4 pt-3 border-t border-gray-700">
//               <Link
//                 href={currentRole.registerLink}
//                 className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors group"
//               >
//                 {RegisterIcon && <RegisterIcon size={16} className="group-hover:text-blue-400" />}
//                 <span>{currentRole.registerText}</span>
//               </Link>
//             </div>
//           )}

//           {/* Help Links */}
//           <div className="mt-4 pt-3 border-t border-gray-700 text-center">
//             <div className="flex justify-center gap-4 text-sm">
//               <button className="text-gray-400 hover:text-blue-400 transition-colors">
//                 Forgot Password?
//               </button>
//               <button className="text-gray-400 hover:text-blue-400 transition-colors">
//                 Need Help?
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer Note */}
//         <p className="text-center text-gray-500 text-xs mt-6">
//           © 2024 School Management System. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }

























































































































































// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   School,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   Mail,
//   Smartphone,
//   ArrowLeft
// } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [emailOtp, setEmailOtp] = useState("");
//   const [smsOtp, setSmsOtp] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [loginLoading, setLoginLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [studentName, setStudentName] = useState("");
//   const [studentId, setStudentId] = useState("");
//   const [requires2FA, setRequires2FA] = useState(false);

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     if (token && userRole) {
//       router.push(`/dashboard/${userRole}`);
//     }
//   }, [router]);

//   // Send OTP to email using main login API
//   const sendOTP = async () => {
//     if (!email) {
//       setError("Please enter your email");
//       return;
//     }

//     setOtpLoading(true);
//     setError("");
//     setRequires2FA(false);
    
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           action: "email-otp", 
//           email: email 
//         })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         setOtpSent(true);
//         setStudentName(data.name);
//         setStudentId(data.studentId);
//         setRequires2FA(data.requires2FA || false);
        
//         if (data.requires2FA) {
//           // Clear single OTP field since we're using 2FA
//           setOtp("");
//         }
//       } else {
//         setError(data.message || "Email not registered");
//       }
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };
  
//   // Verify OTP and login using main login API
//   const verifyOTPAndLogin = async () => {
//     // Validate based on 2FA mode
//     if (requires2FA) {
//       if (!emailOtp || emailOtp.length !== 6) {
//         setError("Please enter 6-digit email OTP");
//         return;
//       }
//       if (!smsOtp || smsOtp.length !== 6) {
//         setError("Please enter 6-digit SMS OTP");
//         return;
//       }
//     } else {
//       if (!otp || otp.length !== 6) {
//         setError("Please enter 6-digit OTP");
//         return;
//       }
//     }
    
//     setLoginLoading(true);
//     setError("");
    
//     try {
//       const requestBody = requires2FA 
//         ? { 
//             action: "verify-otp", 
//             studentId: studentId, 
//             emailOtp: emailOtp,
//             smsOtp: smsOtp
//           }
//         : { 
//             action: "verify-otp", 
//             studentId: studentId, 
//             otp: otp 
//           };
      
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody)
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         localStorage.setItem("rollNo", data.user.rollNo);
//         localStorage.setItem("className", data.user.className);
//         localStorage.setItem("section", data.user.section);
        
//         router.push("/dashboard/student");
//       } else {
//         setError(data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoginLoading(false);
//     }
//   };
  
//   const resetLogin = () => {
//     setOtpSent(false);
//     setOtp("");
//     setEmailOtp("");
//     setSmsOtp("");
//     setError("");
//     setEmail("");
//     setStudentName("");
//     setStudentId("");
//     setRequires2FA(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       <div className="relative w-full max-w-md">
//         {/* Logo/Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//             <School className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white">School Portal</h1>
//           <p className="text-gray-400 mt-2">
//             {requires2FA ? "Enter OTPs from Email & SMS" : "Login with Email OTP"}
//           </p>
//         </div>

//         {/* Email Input */}
//         {!otpSent && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 placeholder="student@school.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//               />
//             </div>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}
            
//             <button
//               onClick={sendOTP}
//               disabled={otpLoading}
//               className="w-full py-3 bg-blue-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-blue-700 transition"
//             >
//               {otpLoading ? <Loader2 className="animate-spin mx-auto" /> : "Send OTP"}
//             </button>
//           </div>
//         )}

//         {/* Enter OTP - Single OTP Mode */}
//         {otpSent && !requires2FA && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//             <button
//               onClick={resetLogin}
//               className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm"
//             >
//               <ArrowLeft size={16} /> Back
//             </button>
            
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
//                 <CheckCircle className="w-8 h-8 text-green-400" />
//               </div>
//               <h3 className="text-white font-medium text-lg">{studentName}</h3>
//               <p className="text-gray-400 text-sm">OTP sent to {email}</p>
//             </div>
            
//             <input
//               type="text"
//               maxLength={6}
//               placeholder="000000"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//               className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:border-blue-500"
//               autoFocus
//             />
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}
            
//             <button
//               onClick={verifyOTPAndLogin}
//               disabled={loginLoading || otp.length !== 6}
//               className="w-full py-3 bg-green-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-green-700 transition"
//             >
//               {loginLoading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Login"}
//             </button>
            
//             <button
//               onClick={sendOTP}
//               className="w-full mt-3 text-gray-400 text-sm hover:text-white transition"
//             >
//               Resend OTP
//             </button>
//           </div>
//         )}

//         {/* Enter OTP - 2FA Mode (Email + SMS) */}
//         {otpSent && requires2FA && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//             <button
//               onClick={resetLogin}
//               className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm"
//             >
//               <ArrowLeft size={16} /> Back
//             </button>
            
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
//                 <CheckCircle className="w-8 h-8 text-green-400" />
//               </div>
//               <h3 className="text-white font-medium text-lg">{studentName}</h3>
//               <p className="text-gray-400 text-sm">OTPs sent to your email and parent's phone</p>
//             </div>
            
//             {/* Email OTP Field */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
//                 <Mail size={16} /> Email OTP
//               </label>
//               <input
//                 type="text"
//                 maxLength={6}
//                 placeholder="000000"
//                 value={emailOtp}
//                 onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
//                 className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
//               />
//             </div>
            
//             {/* SMS OTP Field */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
//                 <Smartphone size={16} /> SMS OTP (Parent's Phone)
//               </label>
//               <input
//                 type="text"
//                 maxLength={6}
//                 placeholder="000000"
//                 value={smsOtp}
//                 onChange={(e) => setSmsOtp(e.target.value.replace(/\D/g, ""))}
//                 className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
//               />
//             </div>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}
            
//             <button
//               onClick={verifyOTPAndLogin}
//               disabled={loginLoading || emailOtp.length !== 6 || smsOtp.length !== 6}
//               className="w-full py-3 bg-green-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-green-700 transition"
//             >
//               {loginLoading ? <Loader2 className="animate-spin mx-auto" /> : "Verify Both OTPs & Login"}
//             </button>
            
//             <button
//               onClick={sendOTP}
//               className="w-full mt-3 text-gray-400 text-sm hover:text-white transition"
//             >
//               Resend OTPs
//             </button>
//           </div>
//         )}

//         {/* Footer Note */}
//         <p className="text-center text-gray-500 text-xs mt-6">
//           © 2024 School Management System. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }.


























































// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   School,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   UserCog,
//   UserCircle,
//   GraduationCap,
//   ArrowLeft,
//   Hash
// } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [role, setRole] = useState("student");
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   // Student OTP Login States
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [studentName, setStudentName] = useState("");
//   const [studentId, setStudentId] = useState("");

//   // Teacher/Admin 2FA States
//   const [requires2FA, setRequires2FA] = useState(false);
//   const [tempToken, setTempToken] = useState("");
//   const [twofaOtp, setTwofaOtp] = useState("");
//   const [twofaLoading, setTwofaLoading] = useState(false);
//   const [loginRole, setLoginRole] = useState("");

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     if (token && userRole) {
//       router.push(`/dashboard/${userRole}`);
//     }
//   }, [router]);

//   // ==================== STUDENT LOGIN FLOW ====================
  
//   // Send OTP for Student Login
//   const sendOTP = async () => {
//     if (!identifier) {
//       setError("Please enter your email");
//       return;
//     }

//     setOtpLoading(true);
//     setError("");
    
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           action: "email-otp", 
//           email: identifier 
//         })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         setOtpSent(true);
//         setStudentName(data.name);
//         setStudentId(data.studentId);
//         setError("");
//       } else {
//         setError(data.message || "Email not registered");
//       }
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };
  
//   // Verify OTP and login for Student
//   const verifyOTPAndLogin = async () => {
//     if (!otp || otp.length !== 6) {
//       setError("Please enter 6-digit OTP");
//       return;
//     }
    
//     setLoading(true);
//     setError("");
    
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           action: "verify-otp", 
//           studentId: studentId, 
//           otp: otp 
//         })
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         localStorage.setItem("rollNo", data.user.rollNo);
//         localStorage.setItem("className", data.user.className);
//         localStorage.setItem("section", data.user.section);
        
//         router.push("/dashboard/student");
//       } else {
//         setError(data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== TEACHER/ADMIN LOGIN FLOW ====================
  
//   const handleRegularLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!identifier.trim() || !password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "login",
//           identifier: identifier.trim(),
//           password,
//           role
//         })
//       });

//       const data = await res.json();

//       if (res.ok && !data.requires2FA) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
        
//         if (data.user.className) localStorage.setItem("className", data.user.className);
//         if (data.user.section) localStorage.setItem("section", data.user.section);
//         if (data.user.rollNo) localStorage.setItem("rollNo", data.user.rollNo);
        
//         const userRole = data.user.role;
        
//         if (userRole === "admin") router.push("/dashboard/admin");
//         else if (userRole === "teacher") router.push("/dashboard/teacher");
//         else router.push(`/dashboard/${userRole}`);
//       } else if (data.requires2FA) {
//         setTempToken(data.tempToken);
//         setRequires2FA(true);
//         setLoginRole(role);
//         setError("");
//       } else {
//         setError(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Network error. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify 2FA OTP for Teacher/Admin
//   const verify2FA = async () => {
//     if (!twofaOtp || twofaOtp.length !== 6) {
//       setError("Please enter 6-digit OTP");
//       return;
//     }

//     setTwofaLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           action: "verify-2fa",
//           tempToken,
//           otp: twofaOtp
//         })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
        
//         if (data.user.className) localStorage.setItem("className", data.user.className);
//         if (data.user.section) localStorage.setItem("section", data.user.section);
//         if (data.user.rollNo) localStorage.setItem("rollNo", data.user.rollNo);
        
//         if (data.user.role === "admin") router.push("/dashboard/admin");
//         else if (data.user.role === "teacher") router.push("/dashboard/teacher");
//         else router.push(`/dashboard/${data.user.role}`);
//       } else {
//         setError(data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//     } finally {
//       setTwofaLoading(false);
//     }
//   };

//   const resetStudentLogin = () => {
//     setOtpSent(false);
//     setOtp("");
//     setError("");
//     setIdentifier("");
//     setStudentName("");
//     setStudentId("");
//   };

//   const reset2FALogin = () => {
//     setRequires2FA(false);
//     setTempToken("");
//     setTwofaOtp("");
//     setIdentifier("");
//     setPassword("");
//     setError("");
//   };

//   // Role options
//   const roles = [
//     { id: "student", label: "Student", icon: GraduationCap, color: "blue", placeholder: "Email Address / Roll Number", inputType: "text" },
//     { id: "teacher", label: "Teacher", icon: UserCircle, color: "green", placeholder: "Email Address", inputType: "email" },
//     { id: "admin", label: "Admin", icon: UserCog, color: "purple", placeholder: "Email Address", inputType: "email" }
//   ];

//   const currentRole = roles.find(r => r.id === role);
//   const isStudent = role === "student";

//   // 2FA Screen for Teacher/Admin
//   if (requires2FA) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-700">
//           <button
//             onClick={reset2FALogin}
//             className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm"
//           >
//             <ArrowLeft size={16} /> Back
//           </button>
          
//           <div className="text-center mb-6">
//             <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
//               <Mail className="w-8 h-8 text-blue-400" />
//             </div>
//             <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
//             <p className="text-gray-400 text-sm mt-2">
//               Enter the OTP sent to your email address
//             </p>
//           </div>

//           <input
//             type="text"
//             maxLength={6}
//             placeholder="Enter 6-digit OTP"
//             value={twofaOtp}
//             onChange={(e) => setTwofaOtp(e.target.value.replace(/\D/g, ""))}
//             className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:border-blue-500"
//             autoFocus
//           />

//           {error && (
//             <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
//               <p className="text-red-400 text-sm text-center">{error}</p>
//             </div>
//           )}

//           <button
//             onClick={verify2FA}
//             disabled={twofaLoading || twofaOtp.length !== 6}
//             className="w-full py-3 bg-green-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-green-700 transition"
//           >
//             {twofaLoading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Login"}
//           </button>
          
//           <p className="text-center text-gray-500 text-xs mt-4">
//             OTP valid for 5 minutes
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         {/* Logo/Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//             <School className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white">School Portal</h1>
//           <p className="text-gray-400 mt-2">
//             {isStudent && !otpSent ? "Login with Email OTP" : isStudent && otpSent ? "Enter OTP" : `Login as ${currentRole?.label}`}
//           </p>
//         </div>

//         {/* Role Selection Tabs */}
//         {!otpSent && !requires2FA && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 mb-6 flex gap-1">
//             {roles.map((r) => {
//               const Icon = r.icon;
//               const colorClasses = {
//                 blue: "bg-blue-600 text-white",
//                 green: "bg-green-600 text-white",
//                 purple: "bg-purple-600 text-white"
//               };
//               return (
//                 <button
//                   key={r.id}
//                   onClick={() => {
//                     setRole(r.id);
//                     setIdentifier("");
//                     setPassword("");
//                     setError("");
//                     setOtpSent(false);
//                     setOtp("");
//                     setRequires2FA(false);
//                   }}
//                   className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
//                     role === r.id
//                       ? colorClasses[r.color]
//                       : "text-gray-400 hover:text-white hover:bg-gray-700"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   <span className="font-medium">{r.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         )}

//         {/* Student OTP Login Flow */}
//         {isStudent && !otpSent && !requires2FA && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 {currentRole.placeholder}
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail size={18} className="text-gray-500" />
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="student@school.com"
//                   value={identifier}
//                   onChange={(e) => setIdentifier(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">Enter your registered email to receive OTP</p>
//             </div>
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}
            
//             <button
//               onClick={sendOTP}
//               disabled={otpLoading}
//               className="w-full py-3 bg-blue-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-blue-700 transition"
//             >
//               {otpLoading ? <Loader2 className="animate-spin mx-auto" /> : "Send OTP"}
//             </button>
            
//             <div className="mt-4 text-center">
//               <button
//                 className="text-gray-500 text-xs hover:text-gray-300"
//               >
//                 Need help? Contact support
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Student OTP Verification */}
//         {isStudent && otpSent && !requires2FA && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//             <button
//               onClick={resetStudentLogin}
//               className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm"
//             >
//               ← Back
//             </button>
            
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
//                 <CheckCircle className="w-8 h-8 text-green-400" />
//               </div>
//               <h3 className="text-white font-medium text-lg">{studentName}</h3>
//               <p className="text-gray-400 text-sm">OTP sent to {identifier}</p>
//             </div>
            
//             <input
//               type="text"
//               maxLength={6}
//               placeholder="000000"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//               className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:border-blue-500"
//               autoFocus
//             />
            
//             {error && (
//               <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
//                 <p className="text-red-400 text-sm">{error}</p>
//               </div>
//             )}
            
//             <button
//               onClick={verifyOTPAndLogin}
//               disabled={loading || otp.length !== 6}
//               className="w-full py-3 bg-green-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-green-700 transition"
//             >
//               {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Login"}
//             </button>
            
//             <button
//               onClick={sendOTP}
//               className="w-full mt-3 text-gray-400 text-sm hover:text-white transition"
//             >
//               Resend OTP
//             </button>
//           </div>
//         )}

//         {/* Teacher/Admin Regular Login Form with 2FA */}
//         {!isStudent && !otpSent && !requires2FA && (
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//             <form onSubmit={handleRegularLogin} className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   {currentRole.placeholder}
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail size={18} className="text-gray-500" />
//                   </div>
//                   <input
//                     type="email"
//                     value={identifier}
//                     onChange={(e) => setIdentifier(e.target.value)}
//                     placeholder="Enter your email"
//                     className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-gray-500" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Enter your password"
//                     className="w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? <EyeOff size={18} className="text-gray-500" /> : <Eye size={18} className="text-gray-500" />}
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">OTP will be sent to your email after password verification</p>
//               </div>

//               {error && (
//                 <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
//                   <p className="text-red-400 text-sm flex items-center gap-2">
//                     <AlertCircle size={16} />
//                     {error}
//                   </p>
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all disabled:opacity-50"
//               >
//                 {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Login"}
//               </button>
//             </form>

//             <div className="mt-4 text-center">
//               <button className="text-gray-500 text-xs hover:text-gray-300">
//                 Forgot Password?
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Footer Note */}
//         <p className="text-center text-gray-500 text-xs mt-6">
//           © 2024 School Management System. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }






















// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   School,
//   AlertCircle,
//   CheckCircle,
//   Loader2,
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   UserCog,
//   UserCircle,
//   GraduationCap,
//   ArrowLeft,
//   Hash,
//   ChevronLeft
// } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [role, setRole] = useState("student");
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
  
//   // Student OTP Login States
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [studentName, setStudentName] = useState("");
//   const [studentId, setStudentId] = useState("");

//   // Teacher/Admin 2FA States
//   const [requires2FA, setRequires2FA] = useState(false);
//   const [tempToken, setTempToken] = useState("");
//   const [twofaOtp, setTwofaOtp] = useState("");
//   const [twofaLoading, setTwofaLoading] = useState(false);
//   const [loginRole, setLoginRole] = useState("");

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userRole = localStorage.getItem("userRole");
//     if (token && userRole) {
//       router.push(`/dashboard/${userRole}`);
//     }
//   }, [router]);

//   // ==================== STUDENT LOGIN FLOW ====================
  
//   const sendOTP = async () => {
//     if (!identifier) {
//       setError("Please enter your email");
//       return;
//     }
//     setOtpLoading(true);
//     setError("");
    
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "email-otp", email: identifier })
//       });
//       const data = await response.json();
      
//       if (response.ok) {
//         setOtpSent(true);
//         setStudentName(data.name);
//         setStudentId(data.studentId);
//         setError("");
//       } else {
//         setError(data.message || "Email not registered");
//       }
//     } catch (error) {
//       console.error("Send OTP error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setOtpLoading(false);
//     }
//   };
  
//   const verifyOTPAndLogin = async () => {
//     if (!otp || otp.length !== 6) {
//       setError("Please enter 6-digit OTP");
//       return;
//     }
//     setLoading(true);
//     setError("");
    
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "verify-otp", studentId: studentId, otp: otp })
//       });
//       const data = await response.json();
      
//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         localStorage.setItem("rollNo", data.user.rollNo);
//         localStorage.setItem("className", data.user.className);
//         localStorage.setItem("section", data.user.section);
//         router.push("/dashboard/student");
//       } else {
//         setError(data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       console.error("Verify OTP error:", error);
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== TEACHER/ADMIN LOGIN FLOW ====================
  
//   const handleRegularLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!identifier.trim() || !password) {
//       setError("Please fill in all fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "login", identifier: identifier.trim(), password, role })
//       });
//       const data = await res.json();

//       if (res.ok && !data.requires2FA) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         if (data.user.className) localStorage.setItem("className", data.user.className);
//         if (data.user.section) localStorage.setItem("section", data.user.section);
//         if (data.user.rollNo) localStorage.setItem("rollNo", data.user.rollNo);
        
//         const userRole = data.user.role;
//         if (userRole === "admin") router.push("/dashboard/admin");
//         else if (userRole === "teacher") router.push("/dashboard/teacher");
//         else router.push(`/dashboard/${userRole}`);
//       } else if (data.requires2FA) {
//         setTempToken(data.tempToken);
//         setRequires2FA(true);
//         setLoginRole(role);
//         setError("");
//       } else {
//         setError(data.message || "Login failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Network error. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verify2FA = async () => {
//     if (!twofaOtp || twofaOtp.length !== 6) {
//       setError("Please enter 6-digit OTP");
//       return;
//     }
//     setTwofaLoading(true);
//     setError("");
//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "verify-2fa", tempToken, otp: twofaOtp })
//       });
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         if (data.user.className) localStorage.setItem("className", data.user.className);
//         if (data.user.section) localStorage.setItem("section", data.user.section);
//         if (data.user.rollNo) localStorage.setItem("rollNo", data.user.rollNo);
//         if (data.user.role === "admin") router.push("/dashboard/admin");
//         else if (data.user.role === "teacher") router.push("/dashboard/teacher");
//         else router.push(`/dashboard/${data.user.role}`);
//       } else {
//         setError(data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       setError("Network error. Please try again.");
//     } finally {
//       setTwofaLoading(false);
//     }
//   };

//   const resetStudentLogin = () => {
//     setOtpSent(false);
//     setOtp("");
//     setError("");
//     setIdentifier("");
//     setStudentName("");
//     setStudentId("");
//   };

//   const reset2FALogin = () => {
//     setRequires2FA(false);
//     setTempToken("");
//     setTwofaOtp("");
//     setIdentifier("");
//     setPassword("");
//     setError("");
//   };

//   const roles = [
//     { id: "student", label: "Student", icon: GraduationCap, color: "blue", placeholder: "Edu Email ID", inputType: "text" },
//     { id: "teacher", label: "Teacher", icon: UserCircle, color: "green", placeholder: "Email Address", inputType: "email" },
//     { id: "admin", label: "Admin", icon: UserCog, color: "purple", placeholder: "Email Address", inputType: "email" }
//   ];

//   const currentRole = roles.find(r => r.id === role);
//   const isStudent = role === "student";

//   // ==================== RENDER: 2FA SCREEN (Dark Theme) ====================
//   if (requires2FA) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-700">
//           <button onClick={reset2FALogin} className="mb-4 text-gray-400 hover:text-white flex items-center gap-1 text-sm">
//             <ArrowLeft size={16} /> Back
//           </button>
//           <div className="text-center mb-6">
//             <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-500/20 flex items-center justify-center">
//               <Mail className="w-8 h-8 text-blue-400" />
//             </div>
//             <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
//             <p className="text-gray-400 text-sm mt-2">Enter the OTP sent to your email address</p>
//           </div>
//           <input type="text" maxLength={6} placeholder="Enter 6-digit OTP" value={twofaOtp} onChange={(e) => setTwofaOtp(e.target.value.replace(/\D/g, ""))} className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:border-blue-500" autoFocus />
//           {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg"><p className="text-red-400 text-sm text-center">{error}</p></div>}
//           <button onClick={verify2FA} disabled={twofaLoading || twofaOtp.length !== 6} className="w-full py-3 bg-green-600 rounded-xl text-white font-medium disabled:opacity-50 hover:bg-green-700 transition">
//             {twofaLoading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Login"}
//           </button>
//           <p className="text-center text-gray-500 text-xs mt-4">OTP valid for 5 minutes</p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== RENDER: STUDENT LOGIN (Light/Yellow Theme - Matches Image) ====================
//   if (isStudent && !requires2FA) {
//     return (
//       <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
//         {/* Soft background glow */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-200/30 rounded-full blur-3xl -z-10"></div>

//         <div className="relative w-full max-w-sm bg-white rounded-[30px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] p-8 pt-10 border border-yellow-100/50">
          
//           {/* Back Button for Role Switching */}
//           <button 
//             onClick={() => {
//                 setRole("teacher");
//                 resetStudentLogin();
//             }}
//             className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
//             title="Switch to Staff Login"
//           >
//             <ChevronLeft size={24} />
//           </button>

//           {/* Illustration Area */}
//           <div className="flex justify-center mb-6 relative">
//              {/* Using an SVG composition to mimic the Cap & Diploma */}
//              <svg width="180" height="140" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
//                 {/* Diploma Scroll */}
//                 <path d="M40 110 C40 110, 30 110, 30 100 L30 70 C30 60, 40 60, 40 60 L140 60 C140 60, 150 60, 150 70 L150 100 C150 110, 140 110, 140 110 Z" fill="#F3E5AB" stroke="#D4C59A" strokeWidth="2"/>
//                 <circle cx="35" cy="85" r="5" fill="#E0D0B0"/>
//                 <circle cx="145" cy="85" r="5" fill="#E0D0B0"/>
                
//                 {/* Red Ribbon Seal */}
//                 <path d="M85 95 L75 130 L95 115 L115 130 L105 95 Z" fill="#D32F2F"/>
//                 <circle cx="95" cy="95" r="14" fill="#FFCA28" stroke="#F57F17" strokeWidth="2"/>
//                 <path d="M90 95 L93 98 L100 90" stroke="#F57F17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

//                 {/* Graduation Cap Board */}
//                 <path d="M30 50 L100 20 L170 50 L100 80 Z" fill="#1A1A1A"/>
//                 {/* Cap Top */}
//                 <path d="M50 50 L50 30 C50 20, 150 20, 150 30 L150 50 Z" fill="#2D2D2D"/>
//                 {/* Tassel String */}
//                 <path d="M100 50 Q100 80 130 90" stroke="#FFCA28" strokeWidth="2" fill="none"/>
//                 {/* Tassel End */}
//                 <rect x="125" y="90" width="10" height="20" rx="2" fill="#FFCA28"/>
//              </svg>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-900 text-center mb-8 tracking-tight">Student Login</h1>

//           {!otpSent ? (
//             // Step 1: Enter Email
//             <div className="space-y-4">
//               <div className="relative group">
//                 <input
//                   type="email"
//                   placeholder="Edu Email ID"
//                   value={identifier}
//                   onChange={(e) => setIdentifier(e.target.value)}
//                   className="w-full px-5 py-4 bg-gray-100 border-transparent rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400/50 transition-all"
//                 />
//               </div>
              
//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
//                   <AlertCircle size={16} className="text-red-500" />
//                   <p className="text-red-600 text-sm">{error}</p>
//                 </div>
//               )}

//               <button
//                 onClick={sendOTP}
//                 disabled={otpLoading}
//                 className="w-full py-4 bg-[#FDF0D5] hover:bg-[#FCEABB] text-gray-900 font-bold rounded-xl transition-colors disabled:opacity-70 shadow-sm border border-yellow-200/50"
//               >
//                 {otpLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Log In"}
//               </button>

//               <div className="text-center mt-4">
//                 <button className="text-[#E6A817] text-sm font-medium hover:text-[#D49A15] transition-colors">
//                   Forgot Password?
//                 </button>
//               </div>
//             </div>
//           ) : (
//             // Step 2: Enter OTP
//             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
//               <button onClick={resetStudentLogin} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 mb-2">
//                 <ArrowLeft size={14} /> Back to Email
//               </button>
              
//               <div className="text-center mb-2">
//                  <p className="text-gray-500 text-sm">We sent a code to <span className="font-semibold text-gray-800">{identifier}</span></p>
//               </div>

//               <input
//                 type="text"
//                 maxLength={6}
//                 placeholder="0 0 0 0 0 0"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                 className="w-full text-center text-2xl tracking-[0.5em] py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
//                 autoFocus
//               />

//               {error && (
//                 <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
//                   <p className="text-red-600 text-sm text-center">{error}</p>
//                 </div>
//               )}

//               <button
//                 onClick={verifyOTPAndLogin}
//                 disabled={loading || otp.length !== 6}
//                 className="w-full py-4 bg-[#FDF0D5] hover:bg-[#FCEABB] text-gray-900 font-bold rounded-xl transition-colors disabled:opacity-70 shadow-sm border border-yellow-200/50"
//               >
//                 {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Verify & Login"}
//               </button>

//               <button onClick={sendOTP} className="w-full text-gray-400 text-sm hover:text-gray-600 transition">
//                 Resend Code
//               </button>
//             </div>
//           )}
          
//           <div className="mt-8 pt-6 border-t border-gray-100 text-center">
//              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Secure Student Portal</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ==================== RENDER: TEACHER/ADMIN LOGIN (Dark Theme) ====================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         {/* Logo/Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
//             <School className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white">School Portal</h1>
//           <p className="text-gray-400 mt-2">Login as {currentRole?.label}</p>
//         </div>

//         {/* Role Selection Tabs */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 mb-6 flex gap-1">
//           {roles.map((r) => {
//             const Icon = r.icon;
//             const colorClasses = {
//               blue: "bg-blue-600 text-white",
//               green: "bg-green-600 text-white",
//               purple: "bg-purple-600 text-white"
//             };
//             return (
//               <button
//                 key={r.id}
//                 onClick={() => {
//                   setRole(r.id);
//                   setIdentifier("");
//                   setPassword("");
//                   setError("");
//                   setOtpSent(false);
//                   setOtp("");
//                   setRequires2FA(false);
//                 }}
//                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
//                   role === r.id ? colorClasses[r.color] : "text-gray-400 hover:text-white hover:bg-gray-700"
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span className="font-medium">{r.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Teacher/Admin Regular Login Form with 2FA */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700">
//           <form onSubmit={handleRegularLogin} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 {currentRole.placeholder}
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail size={18} className="text-gray-500" />
//                 </div>
//                 <input
//                   type="email"
//                   value={identifier}
//                   onChange={(e) => setIdentifier(e.target.value)}
//                   placeholder="Enter your email"
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock size={18} className="text-gray-500" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="w-full pl-10 pr-12 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   {showPassword ? <EyeOff size={18} className="text-gray-500" /> : <Eye size={18} className="text-gray-500" />}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">OTP will be sent to your email after password verification</p>
//             </div>

//             {error && (
//               <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
//                 <p className="text-red-400 text-sm flex items-center gap-2">
//                   <AlertCircle size={16} />
//                   {error}
//                 </p>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all disabled:opacity-50"
//             >
//               {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Login"}
//             </button>
//           </form>

//           <div className="mt-4 text-center">
//             <button className="text-gray-500 text-xs hover:text-gray-300">
//               Forgot Password?
//             </button>
//           </div>
//         </div>

//         {/* Footer Note */}
//         <p className="text-center text-gray-500 text-xs mt-6">
//           © 2024 School Management System. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }















"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  School,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCog,
  UserCircle,
  GraduationCap,
  ArrowLeft,
  Hash,
  ChevronLeft,
  LayoutDashboard,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // Default role set to 'student' so the yellow page shows first
  const [role, setRole] = useState("student"); 
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Student OTP Login States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");

  // Teacher/Admin 2FA States
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [twofaOtp, setTwofaOtp] = useState("");
  const [twofaLoading, setTwofaLoading] = useState(false);
  const [loginRole, setLoginRole] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (token && userRole) {
      router.push(`/dashboard/${userRole}`);
    }
  }, [router]);

  // ==================== STUDENT LOGIN FLOW ====================
  
  const sendOTP = async () => {
    if (!identifier) {
      setError("Please enter your email");
      return;
    }
    setOtpLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "email-otp", email: identifier })
      });
      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        setStudentName(data.name);
        setStudentId(data.studentId);
        setError("");
      } else {
        setError(data.message || "Email not registered");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setError("Network error. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };
  
  const verifyOTPAndLogin = async () => {
    // Updated to 6 digits
    if (!otp || otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", studentId: studentId, otp: otp })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("rollNo", data.user.rollNo);
        localStorage.setItem("className", data.user.className);
        localStorage.setItem("section", data.user.section);
        router.push("/dashboard/student");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== TEACHER/ADMIN LOGIN FLOW ====================
  
  const handleRegularLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", identifier: identifier.trim(), password, role })
      });
      const data = await res.json();

      if (res.ok && !data.requires2FA) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        if (data.user.className) localStorage.setItem("className", data.user.className);
        if (data.user.section) localStorage.setItem("section", data.user.section);
        if (data.user.rollNo) localStorage.setItem("rollNo", data.user.rollNo);
        
        const userRole = data.user.role;
        if (userRole === "admin") router.push("/dashboard/admin");
        else if (userRole === "teacher") router.push("/dashboard/teacher");
        else router.push(`/dashboard/${userRole}`);
      } else if (data.requires2FA) {
        setTempToken(data.tempToken);
        setRequires2FA(true);
        setLoginRole(role);
        setError("");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async () => {
    // Updated to 6 digits
    if (!twofaOtp || twofaOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setTwofaLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-2fa", tempToken, otp: twofaOtp })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        if (data.user.className) localStorage.setItem("className", data.user.className);
        if (data.user.section) localStorage.setItem("section", data.user.section);
        if (data.user.rollNo) localStorage.setItem("rollNo", data.user.rollNo);
        if (data.user.role === "admin") router.push("/dashboard/admin");
        else if (data.user.role === "teacher") router.push("/dashboard/teacher");
        else router.push(`/dashboard/${data.user.role}`);
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setTwofaLoading(false);
    }
  };

  const resetStudentLogin = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setIdentifier("");
    setStudentName("");
    setStudentId("");
  };

  const reset2FALogin = () => {
    setRequires2FA(false);
    setTempToken("");
    setTwofaOtp("");
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap, color: "blue", placeholder: "Edu Email ID", inputType: "text" },
    { id: "teacher", label: "Teacher", icon: UserCircle, color: "green", placeholder: "Email Address", inputType: "email" },
    { id: "admin", label: "Admin", icon: UserCog, color: "purple", placeholder: "Admin ID / Email", inputType: "email" }
  ];

  const currentRole = roles.find(r => r.id === role);
  const isStudent = role === "student";

  // Helper to switch roles from the "Dots"
  const switchRole = (newRole) => {
    setRole(newRole);
    setIdentifier("");
    setPassword("");
    setError("");
    setOtpSent(false);
    setRequires2FA(false);
  };

  // ==================== RENDER: 2FA SCREEN (NEW DESIGN - MATCHES IMAGE 2) ====================
  if (requires2FA) {
    return (
      <div className="min-h-screen bg-[#EBF0F8] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Soft background glow similar to image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>

        <div className="relative w-full max-w-md bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-blue-100/50">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">OTP Verification</h2>
            <p className="text-gray-500 text-sm">
              Enter OTP Code sent to <span className="font-semibold text-gray-800">{identifier}</span>
            </p>
          </div>

          {/* 6 Digit Input Boxes */}
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={twofaOtp[index] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val) {
                    const newOtp = twofaOtp.split('');
                    newOtp[index] = val;
                    setTwofaOtp(newOtp.join(''));
                    // Auto focus next box
                    if (index < 5) {
                      const nextInput = document.getElementById(`2fa-otp-${index + 1}`);
                      if (nextInput) nextInput.focus();
                    }
                  } else {
                    // Handle backspace
                    const newOtp = twofaOtp.split('');
                    newOtp[index] = "";
                    setTwofaOtp(newOtp.join(''));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !twofaOtp[index] && index > 0) {
                    const prevInput = document.getElementById(`2fa-otp-${index - 1}`);
                    if (prevInput) prevInput.focus();
                  }
                }}
                id={`2fa-otp-${index}`}
                className="w-12 h-14 text-center text-2xl font-bold bg-[#EBF0F8] border border-[#D0D9E8] rounded-lg text-gray-800 focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Resend Link */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-1">Didn't receive OTP code?</p>
            <button 
              onClick={() => {
                 // Logic to resend 2FA would go here
                 console.log("Resend 2FA");
              }}
              className="text-[#4A90E2] font-medium text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <RefreshCw size={14} /> Resend Code
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={verify2FA}
            disabled={twofaLoading}
            className="w-full py-3.5 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold rounded-lg shadow-md shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {twofaLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Proceed"}
          </button>

          {/* Back Button */}
          <button onClick={reset2FALogin} className="mt-6 text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center gap-1 w-full">
            <ArrowLeft size={12} /> Back to Login
          </button>

        </div>
      </div>
    );
  }

  // ==================== RENDER: STUDENT LOGIN (Light/Yellow Theme) ====================
  if (isStudent && !requires2FA) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-200/30 rounded-full blur-3xl -z-10"></div>

        <div className="relative w-full max-w-sm bg-white rounded-[30px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] p-8 pt-10 border border-yellow-100/50">
          
          {!otpSent ? (
            // STEP 1: EMAIL INPUT (Original Design)
            <>
              {/* Illustration Area */}
              <div className="flex justify-center mb-6 relative">
                 <svg width="180" height="140" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                    <path d="M40 110 C40 110, 30 110, 30 100 L30 70 C30 60, 40 60, 40 60 L140 60 C140 60, 150 60, 150 70 L150 100 C150 110, 140 110, 140 110 Z" fill="#F3E5AB" stroke="#D4C59A" strokeWidth="2"/>
                    <circle cx="35" cy="85" r="5" fill="#E0D0B0"/>
                    <circle cx="145" cy="85" r="5" fill="#E0D0B0"/>
                    <path d="M85 95 L75 130 L95 115 L115 130 L105 95 Z" fill="#D32F2F"/>
                    <circle cx="95" cy="95" r="14" fill="#FFCA28" stroke="#F57F17" strokeWidth="2"/>
                    <path d="M90 95 L93 98 L100 90" stroke="#F57F17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M30 50 L100 20 L170 50 L100 80 Z" fill="#1A1A1A"/>
                    <path d="M50 50 L50 30 C50 20, 150 20, 150 30 L150 50 Z" fill="#2D2D2D"/>
                    <path d="M100 50 Q100 80 130 90" stroke="#FFCA28" strokeWidth="2" fill="none"/>
                    <rect x="125" y="90" width="10" height="20" rx="2" fill="#FFCA28"/>
                 </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-8 tracking-tight">Student Login</h1>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Edu Email ID"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-100 border-transparent rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400/50 transition-all"
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={sendOTP}
                  disabled={otpLoading}
                  className="w-full py-4 bg-[#FDF0D5] hover:bg-[#FCEABB] text-gray-900 font-bold rounded-xl transition-colors disabled:opacity-70 shadow-sm border border-yellow-200/50"
                >
                  {otpLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Log In"}
                </button>

                <div className="text-center mt-4">
                  <button className="text-[#E6A817] text-sm font-medium hover:text-[#D49A15] transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>
            </>
          ) : (
            // STEP 2: OTP VERIFICATION (NEW DESIGN FROM IMAGE)
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col h-full">
              
              {/* Header Section */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">OTP Verification</h2>
                <p className="text-gray-500 text-sm">
                  Enter OTP Code sent to <span className="font-semibold text-gray-800">{identifier}</span>
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center gap-3 mb-8">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val) {
                        const newOtp = otp.split('');
                        newOtp[index] = val;
                        setOtp(newOtp.join(''));
                        // Auto focus next box
                        if (index < 5) {
                          const nextInput = document.getElementById(`otp-${index + 1}`);
                          if (nextInput) nextInput.focus();
                        }
                      } else {
                        // Handle backspace
                        const newOtp = otp.split('');
                        newOtp[index] = "";
                        setOtp(newOtp.join(''));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[index] && index > 0) {
                        const prevInput = document.getElementById(`otp-${index - 1}`);
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-14 text-center text-2xl font-bold bg-[#EBF0F8] border border-[#D0D9E8] rounded-lg text-gray-800 focus:outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Resend Link */}
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm mb-1">Didn't receive OTP code?</p>
                <button 
                  onClick={sendOTP}
                  className="text-[#4A90E2] font-medium text-sm hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw size={14} /> Resend Code
                </button>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOTPAndLogin}
                disabled={loading}
                className="w-full py-3.5 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold rounded-lg shadow-md shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Proceed"}
              </button>

              {/* Back Button (Optional, small at bottom) */}
              <button onClick={resetStudentLogin} className="mt-6 text-gray-400 hover:text-gray-600 text-xs flex items-center justify-center gap-1">
                <ArrowLeft size={12} /> Change Email
              </button>

            </div>
          )}
          
          {/* FOOTER DOTS FOR ROLE SWITCHING */}
          {!otpSent && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
               <p className="text-[10px] text-gray-400 uppercase tracking-wider">Secure Portal Access</p>
               <div className="flex gap-3">
                  <button onClick={() => switchRole('student')} className="w-3 h-3 rounded-full bg-[#E6A817] ring-2 ring-[#E6A817]/30 transition-all transform scale-110" title="Student Login" />
                  <button onClick={() => switchRole('teacher')} className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all" title="Teacher Login" />
                  <button onClick={() => switchRole('admin')} className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all" title="Admin Login" />
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== RENDER: TEACHER/ADMIN LOGIN (Dark Blue Theme) ====================
  
  const isAdmin = role === 'admin';
  const accentColor = isAdmin ? 'text-purple-400' : 'text-blue-400';
  const buttonBg = isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#1e293b] hover:bg-[#0f172a]';
  const welcomeText = isAdmin ? 'Administrator.' : 'Welcome.';
  const welcomeSub = isAdmin 
    ? 'Manage system settings, users, and global configurations securely.' 
    : 'Access your dashboard to manage classes, students, and tasks securely.';

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l ${isAdmin ? 'from-purple-500/20' : 'from-[#3b82f6]/20'} to-transparent opacity-50 blur-3xl transform skew-x-12 translate-x-20`}></div>
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[#2563eb]/30 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-[#1e293b] via-[#1e293b] to-[#0f172a]"></div>
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] z-10">
        
        <div className="w-full md:w-[40%] bg-white p-8 md:p-12 flex flex-col justify-center relative">
           <div className="absolute top-8 left-8 flex items-center gap-2 text-slate-800 font-bold">
              {isAdmin ? <ShieldCheck className="text-purple-600" size={24} /> : <LayoutDashboard className="text-blue-600" size={24} />}
              <span>{isAdmin ? 'AdminPortal' : 'SchoolPortal'}</span>
           </div>

           <div className="mt-16 mb-8 bg-slate-100 p-1 rounded-lg flex">
              {roles.filter(r => r.id !== 'student').map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => switchRole(r.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                      role === r.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon size={16} />
                    {r.label}
                  </button>
                );
              })}
           </div>

           <div className="flex justify-center mb-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md ${isAdmin ? 'bg-purple-100' : 'bg-slate-100'}`}>
                 {isAdmin ? <UserCog size={32} className="text-purple-500" /> : <UserCircle size={40} className="text-slate-400" />}
              </div>
           </div>

           <form onSubmit={handleRegularLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">
                  {isAdmin ? 'Admin ID / Email' : 'Username / Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {showPassword ? <EyeOff size={18} className="text-slate-400 hover:text-slate-600" /> : <Eye size={18} className="text-slate-400 hover:text-slate-600" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 ${buttonBg} ${isAdmin ? 'shadow-purple-900/20' : 'shadow-blue-900/20'}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "LOGIN"}
              </button>
           </form>

           <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <button className="hover:text-blue-600 transition-colors">Forgot Password?</button>
           </div>
           
           <div className="mt-8 text-center">
              <p className="text-[10px] text-slate-300">© 2024 School Management System</p>
           </div>
        </div>

        <div className="hidden md:flex w-[60%] bg-[#1e293b] relative items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] to-[#1e293b]"></div>
           <div className={`absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-bl ${isAdmin ? 'from-purple-500/40' : 'from-[#60a5fa]/40'} via-[#3b82f6]/20 to-transparent rounded-full blur-3xl transform rotate-12`}></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-[#2563eb]/30 to-transparent rounded-full blur-3xl"></div>
           
           <div className="relative z-10 text-left px-12 w-full">
              <h1 className={`text-6xl font-bold mb-4 tracking-tight ${isAdmin ? 'text-purple-100' : 'text-white'}`}>{welcomeText}</h1>
              <p className={`${isAdmin ? 'text-purple-200' : 'text-blue-200'} text-lg max-w-md leading-relaxed`}>
                 {welcomeSub}
              </p>
              
              <div className="mt-12 flex gap-3 items-center">
                 <button onClick={() => switchRole('student')} className="w-3 h-3 rounded-full bg-white/30 hover:bg-white transition-all" title="Switch to Student Login" />
                 <button onClick={() => switchRole('teacher')} className={`w-3 h-3 rounded-full transition-all ${!isAdmin ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white'}`} title="Switch to Teacher Login" />
                 <button onClick={() => switchRole('admin')} className={`w-3 h-3 rounded-full transition-all ${isAdmin ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white'}`} title="Switch to Admin Login" />
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}