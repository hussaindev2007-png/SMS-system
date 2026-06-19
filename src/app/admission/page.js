// // "use client";
// // import { useState } from "react";
// // import { toast } from "react-toastify";
// // import { useRouter } from "next/navigation";
// // import axios from "axios";
// // import { useMutation } from "@tanstack/react-query"; // TanStack Query import

// // export default function AdmissionPage() {
// //   const router = useRouter();
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     phone: "",
// //     className: "",
// //     section: "",
// //   });


// //   const mutation = useMutation({
// //     mutationFn: (newStudent) => {
// //       return axios.post("/api/admission", newStudent);
// //     },
// //     onSuccess: (res) => {
// //       toast.success(res.data.message || "Admission submitted!");
// //       setTimeout(() => router.push("/login"), 3000);
// //     },
// //     onError: (error) => {
// //       const msg = error.response?.data?.message || "Something went wrong";
// //       toast.error(msg);
// //     },
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Mutation trigger karein
// //     mutation.mutate(formData);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
// //       <div className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
// //         {/* Left Side */}
// //         <div className="md:w-1/3 bg-blue-900 p-8 text-white flex flex-col justify-center">
// //           <h2 className="text-3xl font-black italic mb-4">SMS PANEL</h2>
// //           <p className="text-blue-200 text-sm">Join our institute today!</p>
// //         </div>

// //         {/* Right Side: Form */}
// //         <div className="md:w-2/3 p-8">
// //           <h3 className="text-2xl font-bold text-gray-800 mb-6">Student Admission</h3>
          
// //           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {/* Full Name */}
// // <div className="col-span-2 md:col-span-1">
// //   <label className="text-xs font-bold uppercase text-gray-700">Full Name</label>
// //   <input 
// //     required 
// //     name="name" 
// //     type="text" 
// //     onChange={handleChange} 
// //     className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium" 
// //     placeholder="John Doe" 
// //   />
// // </div>

// // {/* Email Address */}
// // <div className="col-span-2 md:col-span-1">
// //   <label className="text-xs font-bold uppercase text-gray-700">Email Address</label>
// //   <input 
// //     required 
// //     name="email" 
// //     type="email" 
// //     onChange={handleChange} 
// //     className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium" 
// //     placeholder="john@example.com" 
// //   />
// // </div>

// // {/* Phone Number */}
// // <div className="col-span-2 md:col-span-1">
// //   <label className="text-xs font-bold uppercase text-gray-700">Phone Number</label>
// //   <input 
// //     required 
// //     name="phone" 
// //     type="text" 
// //     onChange={handleChange} 
// //     className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium" 
// //     placeholder="03XXXXXXXXX" 
// //   />
// // </div>

// // {/* Class */}
// // <div className="col-span-2 md:col-span-1">
// //   <label className="text-xs font-bold uppercase text-gray-700">Class</label>
// //   <input 
// //     required 
// //     name="className" 
// //     type="text" 
// //     onChange={handleChange} 
// //     className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium" 
// //     placeholder="e.g. 10th" 
// //   />
// // </div>

// // {/* Password */}
// // <div className="col-span-2">
// //   <label className="text-xs font-bold uppercase text-gray-700">Choose Password</label>
// //   <input 
// //     required 
// //     name="password" 
// //     type="password" 
// //     onChange={handleChange} 
// //     className="w-full p-3 mt-1 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium" 
// //     placeholder="••••••••" 
// //   />
// // </div>
// // <div className="col-span-2 md:col-span-1">
// //         <label className="text-xs font-bold uppercase text-gray-700">Admission Type</label>
// //         <input 
// //           readOnly 
// //           name="role" 
// //           type="text" 
// //           value="Student" 
// //           className="w-full p-3 mt-1 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-500 cursor-not-allowed" 
// //         />
// //       </div>

// //             <button 
// //               disabled={mutation.isPending}
// //               type="submit" 
// //               className="col-span-2 mt-4 p-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
// //             >
// //               {mutation.isPending ? "Submitting..." : "Apply for Admission"}
// //             </button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }








// "use client";

// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";
// import "react-toastify/dist/ReactToastify.css";

// // --- Icons Components ---
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const MailIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );

// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );

// const AcademicCapIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path d="M12 14l9-5-9-5-9 5 9 5z" />
//     <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );

// const BadgeIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.896 1.667-2 2.333C7.896 7.667 7 6.884 7 6m10 0v1c0 .884-.896 1.667-2 2.333C16.104 7.667 17 6.884 17 6m-2 5v6m0 0l-3-3m3 3l3-3m-3 3V11" />
//   </svg>
// );

// export default function AdmissionPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     className: "",
//     section: "",
//     rollNo: "", // Added rollNo to state if needed separately, or use className as ID
//   });

//   const mutation = useMutation({
//     mutationFn: (newStudent) => {
//       return axios.post("/api/admission", newStudent);
//     },
//     onSuccess: (res) => {
//       toast.success(res.data.message || "Admission submitted successfully!");
//       setTimeout(() => router.push("/login"), 3000);
//     },
//     onError: (error) => {
//       const msg = error.response?.data?.message || "Something went wrong. Please try again.";
//       toast.error(msg);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // --- LIMITS LOGIC START ---
    
//     // 1. PASSWORD LIMIT: Max 8 characters
//     if (name === "password") {
//       if (value.length > 8) return; // Agar 8 se zyada hua toh update mat karo
//     }

//     // 2. ROLL NO / CLASS NAME LIMIT: Max 5 characters
//     // Note: Agar aap 'className' field ko Roll No ki tarah use kar rahe hain
//     if (name === "className" || name === "rollNo") {
//       if (value.length > 5) return; // Agar 5 se zyada hua toh update mat karo
//     }

//     // --- LIMITS LOGIC END ---

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Optional: Validation before submit
//     if (formData.password.length < 4) {
//         toast.warning("Password kam az kam 4 characters ka hona chahiye.");
//         return;
//     }
//     if (formData.className.length < 1) {
//         toast.warning("Class/Roll Number zaroori hai.");
//         return;
//     }

//     mutation.mutate(formData);
//   };

 
//   const inputWrapperClass = "relative group";
//   const inputClass = "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 font-semibold text-slate-700 placeholder:text-slate-400 transition-all text-sm cursor-text";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block flex justify-between";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans">
//       <ToastContainer position="top-center" theme="colored" />
      
//       <div className="max-w-4xl w-full bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-slate-100 relative">
        
//         {/* Left Side: Branding */}
//         <div className="md:w-2/5 bg-blue-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-6">
//                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
//                  <AcademicCapIcon /> 
//                </div>
//                <span className="font-black italic tracking-tighter text-xl">SMS PANEL</span>
//             </div>
//             <h2 className="text-3xl font-extrabold leading-tight">Start Your <br/>Academic Journey</h2>
//             <p className="text-blue-200/70 text-sm mt-4 font-medium">
//               Fill out the admission form to join our institute. Secure your future today.
//             </p>
//           </div>

//           <div className="relative z-10 mt-10 md:mt-0">
//              <div className="flex items-center gap-3 text-xs text-blue-300 font-mono bg-white/5 p-3 rounded-lg border border-white/10">
//                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//                 Admissions Open 2026
//              </div>
//           </div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="md:w-3/5 p-8 md:p-10 bg-white">
//           <div className="mb-8">
//             <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Registration</h3>
//             <p className="text-slate-500 text-sm mt-1">Please provide accurate details.</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Row 1: Name & Email */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelClass}>Full Name</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><UserIcon /></div>
//                   <input 
//                     required 
//                     name="name" 
//                     type="text" 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="John Doe" 
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><MailIcon /></div>
//                   <input 
//                     required 
//                     name="email" 
//                     type="email" 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="john@example.com" 
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Row 2: Phone & Class/RollNo */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelClass}>Phone Number</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><PhoneIcon /></div>
//                   <input 
//                     required 
//                     name="phone" 
//                     type="text" 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="03XXXXXXXXX" 
//                   />
//                 </div>
//               </div>

//               <div>
//                 {/* Label with Limit Info */}
//                 <label className={labelClass}>
//                    <span>Class / Roll No</span>
//                    <span className="text-[9px] text-blue-500 normal-case tracking-normal">Max 5 chars</span>
//                 </label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><AcademicCapIcon /></div>
//                   <input 
//                     required 
//                     name="className" 
//                     type="text" 
//                     value={formData.className}
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="e.g. 10-A" 
//                     maxLength={5} // HTML attribute for extra safety
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Row 3: Password & Role */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 {/* Label with Limit Info */}
//                 <label className={labelClass}>
//                    <span>Create Password</span>
//                    <span className="text-[9px] text-blue-500 normal-case tracking-normal">Max 8 chars</span>
//                 </label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><LockIcon /></div>
//                   <input 
//                     required 
//                     name="password" 
//                     type="password" 
//                     value={formData.password}
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="••••••••" 
//                     maxLength={8} // HTML attribute for extra safety
//                   />
//                 </div>
//                 {/* Visual Strength Indicator */}
//                 <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
//                    <div 
//                       className={`h-full transition-all duration-300 ${
//                         formData.password.length === 0 ? 'bg-transparent' :
//                         formData.password.length <= 4 ? 'bg-red-400' : 
//                         formData.password.length <= 6 ? 'bg-yellow-400' : 'bg-green-500'
//                       }`} 
//                       style={{ width: `${(formData.password.length / 8) * 100}%` }}
//                    ></div>
//                 </div>
//               </div>

//               <div>
//                 <label className={labelClass}>Role Type</label>
//                 <div className="relative">
//                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//                       <BadgeIcon />
//                    </div>
//                    <input 
//                     readOnly 
//                     name="role" 
//                     type="text" 
//                     value="Student" 
//                     className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-semibold text-sm cursor-not-allowed select-none" 
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full mt-4 py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
//             >
//               {mutation.isPending ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";
// import "react-toastify/dist/ReactToastify.css";

// // --- Icons Components ---
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const MailIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );

// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );

// const AcademicCapIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path d="M12 14l9-5-9-5-9 5 9 5z" />
//     <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
//   </svg>
// );

// const LockIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );

// const BadgeIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.896 1.667-2 2.333C7.896 7.667 7 6.884 7 6m10 0v1c0 .884-.896 1.667-2 2.333C16.104 7.667 17 6.884 17 6m-2 5v6m0 0l-3-3m3 3l3-3m-3 3V11" />
//   </svg>
// );

// // New Icons for Show/Hide Password
// const EyeIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );

// const EyeOffIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );

// export default function AdmissionPage() {
//   const router = useRouter();
  
//   // State for Password Visibility
//   const [showPassword, setShowPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     className: "",
//     section: "",
//   });

//   const mutation = useMutation({
//     mutationFn: (newStudent) => {
//       return axios.post("/api/admission", newStudent);
//     },
//     onSuccess: (res) => {
//       toast.success(res.data.message || "Admission submitted successfully!");
//       setTimeout(() => router.push("/login"), 3000);
//     },
//     onError: (error) => {
//       const msg = error.response?.data?.message || "Something went wrong. Please try again.";
//       toast.error(msg);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // --- LIMITS LOGIC START ---
    
//     // 1. PASSWORD LIMIT: Max 8 characters
//     if (name === "password") {
//       if (value.length > 8) return; 
//     }

//     // 2. ROLL NO / CLASS NAME LIMIT: Max 5 characters
//     if (name === "className") {
//       if (value.length > 5) return; 
//     }

//     // --- LIMITS LOGIC END ---

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (formData.password.length < 4) {
//         toast.warning("Password kam az kam 4 characters ka hona chahiye.");
//         return;
//     }
//     if (formData.className.length < 1) {
//         toast.warning("Class/Roll Number zaroori hai.");
//         return;
//     }

//     mutation.mutate(formData);
//   };

 
//   const inputWrapperClass = "relative group";
//   const inputClass = "w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 font-semibold text-slate-700 placeholder:text-slate-400 transition-all text-sm cursor-text"; // pr-12 added for space
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block flex justify-between";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans">
//       <ToastContainer  />
      
//       <div className="max-w-4xl w-full bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-slate-100 relative">
        
//         {/* Left Side: Branding */}
//         <div className="md:w-2/5 bg-blue-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
//           <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-6">
//                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
//                  <AcademicCapIcon /> 
//                </div>
//                <span className="font-black italic tracking-tighter text-xl">SMS PANEL</span>
//             </div>
//             <h2 className="text-3xl font-extrabold leading-tight">Start Your <br/>Academic Journey</h2>
//             <p className="text-blue-200/70 text-sm mt-4 font-medium">
//               Fill out the admission form to join our institute. Secure your future today.
//             </p>
//           </div>

//           <div className="relative z-10 mt-10 md:mt-0">
//              <div className="flex items-center gap-3 text-xs text-blue-300 font-mono bg-white/5 p-3 rounded-lg border border-white/10">
//                 <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//                 Admissions Open 2026
//              </div>
//           </div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="md:w-3/5 p-8 md:p-10 bg-white">
//           <div className="mb-8">
//             <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Registration</h3>
//             <p className="text-slate-500 text-sm mt-1">Please provide accurate details.</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Row 1: Name & Email */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelClass}>Full Name</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><UserIcon /></div>
//                   <input 
//                     required 
//                     name="name" 
//                     type="text" 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="John Doe" 
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><MailIcon /></div>
//                   <input 
//                     required 
//                     name="email" 
//                     type="email" 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="john@example.com" 
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Row 2: Phone & Class/RollNo */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelClass}>Phone Number</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><PhoneIcon /></div>
//                   <input 
//                     required 
//                     name="phone" 
//                     type="text" 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="03XXXXXXXXX" 
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className={labelClass}>
//                    <span>Class / Roll No</span>
//                    <span className="text-[9px] text-blue-500 normal-case tracking-normal">Max 5 chars</span>
//                 </label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><AcademicCapIcon /></div>
//                   <input 
//                     required 
//                     name="className" 
//                     type="text" 
//                     value={formData.className}
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="e.g. 10-A" 
//                     maxLength={5}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Row 3: Password & Role */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className={labelClass}>
//                    <span>Create Password</span>
//                    <span className="text-[9px] text-blue-500 normal-case tracking-normal">Max 8 chars</span>
//                 </label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><LockIcon /></div>
                  
//                   {/* Password Input */}
//                   <input 
//                     required 
//                     name="password" 
//                     type={showPassword ? "text" : "password"} // Toggle Type
//                     value={formData.password}
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="••••••••" 
//                     maxLength={8}
//                   />

//                   {/* Toggle Button */}
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer focus:outline-none"
//                     title={showPassword ? "Hide Password" : "Show Password"}
//                   >
//                     {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                   </button>
//                 </div>
                
//                 {/* Visual Strength Indicator */}
//                 <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
//                    <div 
//                       className={`h-full transition-all duration-300 ${
//                         formData.password.length === 0 ? 'bg-transparent' :
//                         formData.password.length <= 4 ? 'bg-red-400' : 
//                         formData.password.length <= 6 ? 'bg-yellow-400' : 'bg-green-500'
//                       }`} 
//                       style={{ width: `${(formData.password.length / 8) * 100}%` }}
//                    ></div>
//                 </div>
//               </div>

//               <div>
//                 <label className={labelClass}>Role Type</label>
//                 <div className="relative">
//                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
//                       <BadgeIcon />
//                    </div>
//                    <input 
//                     readOnly 
//                     name="role" 
//                     type="text" 
//                     value="Student" 
//                     className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-semibold text-sm cursor-not-allowed select-none" 
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full mt-4 py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 active:scale-[0.98] transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
//             >
//               {mutation.isPending ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";
// import "react-toastify/dist/ReactToastify.css";

// // --- Minimalist Icons ---
// const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const MailIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
// const PhoneIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
// const AcademicCapIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
// const LockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
// const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
// const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

// export default function AdmissionPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "", email: "", password: "", phone: "", className: "",
//   });

//   const mutation = useMutation({
//     mutationFn: (data) => axios.post("/api/admission", data),
//     onSuccess: (res) => {
//       toast.success(res.data.message || "Application Submitted Successfully!");
//       setTimeout(() => router.push("/login"), 2000);
//     },
//     onError: (err) => {
//       // Backend error message handle ho raha hai
//       const errorMessage = err.response?.data?.message || "Server Error";
//       toast.error(errorMessage);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Input validation filters
//     if (name === "password" && value.length > 8) return;
//     if (name === "className" && value.length > 5) return;
//     if (name === "phone" && value.length > 11) return;
    
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const getStrengthColor = () => {
//     const len = formData.password.length;
//     if (len === 0) return "bg-slate-100";
//     if (len <= 4) return "bg-red-500";
//     if (len <= 6) return "bg-yellow-400";
//     return "bg-green-500"; 
//   };

//   const labelClass = "text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 block flex justify-between";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-900 focus:bg-white transition-all font-bold text-slate-900 text-sm";

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
//       <ToastContainer hideProgressBar  />
      
//       <div className="max-w-5xl w-full bg-white shadow-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
//         {/* Left Branding */}
//         <div className="md:w-[40%] bg-blue-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-10">
//                <div className="p-3 bg-white/10 rounded-2xl border border-white/10"><AcademicCapIcon /></div>
//                <span className="font-black italic tracking-tighter text-2xl uppercase">SMS Panel</span>
//             </div>
//             <h2 className="text-4xl font-black leading-[1.1] uppercase italic tracking-tighter">Elevate <br/>Your Future</h2>
//             <p className="text-blue-200/60 text-sm mt-6 font-bold uppercase tracking-wider leading-relaxed">Secure your admission by providing your details correctly.</p>
//           </div>
//           <div className="relative z-10 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
//             <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
//             <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Batch 2026 Admissions Open</span>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="md:w-[60%] p-10 md:p-14">
//           <div className="mb-10">
//             <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Admission <span className="text-blue-900">Form</span></h3>
//             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Check availability in real-time</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Full Name</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><UserIcon /></div>
//                   <input required name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Hassan Ali" />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><MailIcon /></div>
//                   <input required name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hassan@dev.com" />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Phone No <span className="text-blue-600 italic">Unique</span></label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><PhoneIcon /></div>
//                   <input 
//                     required 
//                     name="phone" 
//                     type="text" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="03XXXXXXXXX"
//                     maxLength={11} 
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Class / Roll No</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><AcademicCapIcon /></div>
//                   <input required name="className" value={formData.className} type="text" onChange={handleChange} className={inputClass} placeholder="10-A" maxLength={5} />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className={labelClass}>Create Password <span className="text-blue-600">Max 8 Chars</span></label>
//               <div className="relative group">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><LockIcon /></div>
//                 <input 
//                   required 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password}
//                   onChange={handleChange} 
//                   className={inputClass} 
//                   placeholder="••••••••" 
//                   maxLength={8}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-900 transition-colors"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               <div className="mt-3 px-1">
//                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full transition-all duration-500 ${getStrengthColor()}`}
//                     style={{ width: `${(formData.password.length / 8) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-black active:scale-95 transition-all disabled:bg-slate-200"
//             >
//               {mutation.isPending ? "Validating with Database..." : "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

















// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast"; // Importing React Hot Toast
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";

// // --- Minimalist Icons ---
// const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const MailIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
// const PhoneIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
// const AcademicCapIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
// const LockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
// const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
// const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

// export default function AdmissionPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "", email: "", password: "", phone: "", className: "",
//   });

//   const mutation = useMutation({
//     mutationFn: (data) => axios.post("/api/admission", data),
//     onSuccess: (res) => {
//       // USING REACT HOT TOAST
//       toast.success(res.data.message || "Application Submitted Successfully!", {
//         style: {
//           background: '#fff',
//           color: '#1f2937',
//           border: '1px solid #e5e7eb',
//         },
//       });
//       setTimeout(() => router.push("/login"), 2000);
//     },
//     onError: (err) => {
//       // Backend error message handle ho raha hai
//       const errorMessage = err.response?.data?.message || "Server Error";
//       // USING REACT HOT TOAST
//       toast.error(errorMessage, {
//         style: {
//           background: '#fff',
//           color: '#1f2937',
//           border: '1px solid #e5e7eb',
//         },
//       });
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Input validation filters
//     if (name === "password" && value.length > 8) return;
//     if (name === "className" && value.length > 5) return;
//     if (name === "phone" && value.length > 11) return;
    
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const getStrengthColor = () => {
//     const len = formData.password.length;
//     if (len === 0) return "bg-slate-100";
//     if (len <= 4) return "bg-red-500";
//     if (len <= 6) return "bg-yellow-400";
//     return "bg-green-500"; 
//   };

//   const labelClass = "text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 block flex justify-between";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-900 focus:bg-white transition-all font-bold text-slate-900 text-sm";

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
//       {/* REACT HOT TOAST CONTAINER */}
//       <Toaster position="top-center" />
      
//       <div className="max-w-5xl w-full bg-white shadow-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
//         {/* Left Branding */}
//         <div className="md:w-[40%] bg-blue-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-10">
//                <div className="p-3 bg-white/10 rounded-2xl border border-white/10"><AcademicCapIcon /></div>
//                <span className="font-black italic tracking-tighter text-2xl uppercase">SMS Panel</span>
//             </div>
//             <h2 className="text-4xl font-black leading-[1.1] uppercase italic tracking-tighter">Elevate <br/>Your Future</h2>
//             <p className="text-blue-200/60 text-sm mt-6 font-bold uppercase tracking-wider leading-relaxed">Secure your admission by providing your details correctly.</p>
//           </div>
//           <div className="relative z-10 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
//             <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
//             <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Batch 2026 Admissions Open</span>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="md:w-[60%] p-10 md:p-14">
//           <div className="mb-10">
//             <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Admission <span className="text-blue-900">Form</span></h3>
//             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Check availability in real-time</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Full Name</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><UserIcon /></div>
//                   <input required name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Hassan Ali" />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><MailIcon /></div>
//                   <input required name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hassan@dev.com" />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Phone No <span className="text-blue-600 italic">Unique</span></label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><PhoneIcon /></div>
//                   <input 
//                     required 
//                     name="phone" 
//                     type="text" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="03XXXXXXXXX"
//                     maxLength={11} 
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Class / Roll No</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><AcademicCapIcon /></div>
//                   <input required name="className" value={formData.className} type="text" onChange={handleChange} className={inputClass} placeholder="10-A" maxLength={5} />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className={labelClass}>Create Password <span className="text-blue-600">Max 8 Chars</span></label>
//               <div className="relative group">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><LockIcon /></div>
//                 <input 
//                   required 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password}
//                   onChange={handleChange} 
//                   className={inputClass} 
//                   placeholder="••••••••" 
//                   maxLength={8}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-900 transition-colors"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               <div className="mt-3 px-1">
//                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full transition-all duration-500 ${getStrengthColor()}`}
//                     style={{ width: `${(formData.password.length / 8) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-black active:scale-95 transition-all disabled:bg-slate-200"
//             >
//               {mutation.isPending ? "Validating with Database..." : "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { X, UploadCloud } from "lucide-react";

// // --- Icons ---
// const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const UserAddIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
// const MailIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
// const PhoneIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
// const AcademicCapIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
// const LockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
// const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
// const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

// export default function AdmissionPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     fatherName: "",
//     email: "",
//     password: "",
//     phone: "",
//     className: "",
//     section: "A"
//   });

//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       const formDataObj = new FormData();
//       formDataObj.append("name", data.name);
//       formDataObj.append("fatherName", data.fatherName);
//       formDataObj.append("email", data.email);
//       formDataObj.append("password", data.password);
//       formDataObj.append("phone", data.phone);
//       formDataObj.append("className", data.className);
//       formDataObj.append("section", data.section);
//       if (photoFile) {
//         formDataObj.append("photo", photoFile);
//       }
      
//       const res = await fetch("/api/admission", {
//         method: "POST",
//         body: formDataObj
//       });
//       return res.json();
//     },
//     onSuccess: (res) => {
//       if (res.message) {
//         toast.success(res.message, {
//           style: { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb' },
//         });
//         setTimeout(() => router.push("/login"), 2000);
//       } else if (res.error) {
//         toast.error(res.error);
//       }
//     },
//     onError: (err) => {
//       const errorMessage = err.message || "Server Error";
//       toast.error(errorMessage, {
//         style: { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb' },
//       });
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "password" && value.length > 8) return;
//     if (name === "className" && value.length > 5) return;
//     if (name === "phone" && value.length > 1) return;
    
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Photo size should be less than 2MB");
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload an image file");
//         return;
//       }
//       setPhotoFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPhotoPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removePhoto = () => {
//     setPhotoFile(null);
//     setPhotoPreview(null);
//   };

//   const getStrengthColor = () => {
//     const len = formData.password.length;
//     if (len === 0) return "bg-slate-100";
//     if (len <= 4) return "bg-red-500";
//     if (len <= 6) return "bg-yellow-400";
//     return "bg-green-500";
//   };

//   const labelClass = "text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 block flex justify-between";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-900 focus:bg-white transition-all font-bold text-slate-900 text-sm";

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
//       <Toaster position="top-center" />
      
//       <div className="max-w-5xl w-full bg-white shadow-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
//         {/* Left Branding */}
//         <div className="md:w-[40%] bg-blue-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-10">
//                <div className="p-3 bg-white/10 rounded-2xl border border-white/10"><AcademicCapIcon /></div>
//                <span className="font-black italic tracking-tighter text-2xl uppercase">SMS Panel</span>
//             </div>
//             <h2 className="text-4xl font-black leading-[1.1] uppercase italic tracking-tighter">Elevate <br/>Your Future</h2>
//             <p className="text-blue-200/60 text-sm mt-6 font-bold uppercase tracking-wider leading-relaxed">Secure your admission by providing your details correctly.</p>
//           </div>
//           <div className="relative z-10 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
//             <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
//             <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Batch 2026 Admissions Open</span>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="md:w-[60%] p-10 md:p-14">
//           <div className="mb-10">
//             <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Admission <span className="text-blue-900">Form</span></h3>
//             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Check availability in real-time</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name and Father Name */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Full Name</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><UserIcon /></div>
//                   <input required name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Hassan Ali" />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Father Name</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><UserAddIcon /></div>
//                   <input required name="fatherName" type="text" value={formData.fatherName} onChange={handleChange} className={inputClass} placeholder="Zulfiqar Ali" />
//                 </div>
//               </div>
//             </div>

//             {/* Email and Phone */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><MailIcon /></div>
//                   <input required name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hassan@dev.com" />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Phone No <span className="text-blue-600 italic">Unique</span></label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><PhoneIcon /></div>
//                   <input 
//                     required 
//                     name="phone" 
//                     type="text" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="03XXXXXXXXX"
//                     maxLength={11} 
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Class and Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Class</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><AcademicCapIcon /></div>
//                   <input required name="className" value={formData.className} type="text" onChange={handleChange} className={inputClass} placeholder="9, 10, 11, 12" maxLength={5} />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Section</label>
//                 <select 
//                   name="section"
//                   value={formData.section}
//                   onChange={handleChange}
//                   className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-900 focus:bg-white transition-all font-bold text-slate-900 text-sm"
//                 >
//                   <option value="A">Section A</option>
//                   <option value="B">Section B</option>
//                   <option value="C">Section C</option>
//                 </select>
//               </div>
//             </div>

//             {/* Photo Upload */}
//             <div>
//               <label className={labelClass}>Student Photo <span className="text-blue-600">(Optional but recommended)</span></label>
//               <div className="flex items-center gap-4">
//                 {photoPreview ? (
//                   <div className="relative">
//                     <img src={photoPreview} className="w-24 h-28 rounded-xl object-cover border-2 border-blue-500" />
//                     <button 
//                       type="button"
//                       onClick={removePhoto}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="cursor-pointer">
//                     <div className="w-24 h-28 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-blue-500 transition group">
//                       <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-500 transition" />
//                       <span className="text-[9px] text-slate-400 mt-1 group-hover:text-blue-500 transition">Click to Upload</span>
//                     </div>
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       className="hidden" 
//                       onChange={handlePhotoChange}
//                     />
//                   </label>
//                 )}
//                 <p className="text-[10px] text-slate-400 max-w-[200px]">
//                   Upload a clear passport-size photo for ID card (Max 2MB)
//                 </p>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className={labelClass}>Password <span className="text-blue-600">Max 8 Chars</span></label>
//               <div className="relative group">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><LockIcon /></div>
//                 <input 
//                   required 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password}
//                   onChange={handleChange} 
//                   className={inputClass} 
//                   placeholder="••••••••" 
//                   maxLength={8}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-900 transition-colors"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               <div className="mt-3 px-1">
//                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full transition-all duration-500 ${getStrengthColor()}`}
//                     style={{ width: `${(formData.password.length / 8) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-black active:scale-95 transition-all disabled:bg-slate-200"
//             >
//               {mutation.isPending ? "Submitting Application..." : "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }






















// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { X, UploadCloud } from "lucide-react";

// // --- Icons ---
// const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
// const UserAddIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
// const MailIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
// const PhoneIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
// const AcademicCapIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
// const LockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
// const EyeIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
// const EyeOffIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

// export default function AdmissionPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     fatherName: "",
//     email: "",
//     password: "",
//     phone: "",
//     className: "",
//     section: "A"
//   });

//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       const formDataObj = new FormData();
//       formDataObj.append("name", data.name);
//       formDataObj.append("fatherName", data.fatherName);
//       formDataObj.append("email", data.email);
//       formDataObj.append("password", data.password);
//       formDataObj.append("phone", data.phone);
//       formDataObj.append("className", data.className);
//       formDataObj.append("section", data.section);
//       if (photoFile) {
//         formDataObj.append("photo", photoFile);
//       }
      
//       const res = await fetch("/api/admission", {
//         method: "POST",
//         body: formDataObj
//       });
//       return res.json();
//     },
//     onSuccess: (res) => {
//       if (res.message) {
//         toast.success(res.message, {
//           style: { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb' },
//         });
//         setTimeout(() => router.push("/login"), 2000);
//       } else if (res.error) {
//         toast.error(res.error);
//       }
//     },
//     onError: (err) => {
//       const errorMessage = err.message || "Server Error";
//       toast.error(errorMessage, {
//         style: { background: '#fff', color: '#1f2937', border: '1px solid #e5e7eb' },
//       });
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "password" && value.length > 8) return;
//     if (name === "className" && value.length > 5) return;
//     // ✅ REMOVED phone number length limit
//     // if (name === "phone" && value.length > 15) return;
    
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Photo size should be less than 2MB");
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload an image file");
//         return;
//       }
//       setPhotoFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPhotoPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removePhoto = () => {
//     setPhotoFile(null);
//     setPhotoPreview(null);
//   };

//   const getStrengthColor = () => {
//     const len = formData.password.length;
//     if (len === 0) return "bg-slate-100";
//     if (len <= 4) return "bg-red-500";
//     if (len <= 6) return "bg-yellow-400";
//     return "bg-green-500";
//   };

//   const labelClass = "text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2 block flex justify-between";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-900 focus:bg-white transition-all font-bold text-slate-900 text-sm";

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
//       <Toaster position="top-center" />
      
//       <div className="max-w-5xl w-full bg-white shadow-2xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
//         {/* Left Branding */}
//         <div className="md:w-[40%] bg-blue-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-10">
//                <div className="p-3 bg-white/10 rounded-2xl border border-white/10"><AcademicCapIcon /></div>
//                <span className="font-black italic tracking-tighter text-2xl uppercase">SMS Panel</span>
//             </div>
//             <h2 className="text-4xl font-black leading-[1.1] uppercase italic tracking-tighter">Elevate <br/>Your Future</h2>
//             <p className="text-blue-200/60 text-sm mt-6 font-bold uppercase tracking-wider leading-relaxed">Secure your admission by providing your details correctly.</p>
//           </div>
//           <div className="relative z-10 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
//             <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
//             <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Batch 2026 Admissions Open</span>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="md:w-[60%] p-10 md:p-14">
//           <div className="mb-10">
//             <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Admission <span className="text-blue-900">Form</span></h3>
//             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Check availability in real-time</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name and Father Name */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Full Name</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><UserIcon /></div>
//                   <input required name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Hassan Ali" />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Father Name</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><UserAddIcon /></div>
//                   <input required name="fatherName" type="text" value={formData.fatherName} onChange={handleChange} className={inputClass} placeholder="Zulfiqar Ali" />
//                 </div>
//               </div>
//             </div>

//             {/* Email and Phone */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Email Address</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><MailIcon /></div>
//                   <input required name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="hassan@dev.com" />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Phone No <span className="text-blue-600 italic">Unique</span></label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><PhoneIcon /></div>
//                   <input 
//                     required 
//                     name="phone" 
//                     type="tel" 
//                     value={formData.phone} 
//                     onChange={handleChange} 
//                     className={inputClass} 
//                     placeholder="03XXXXXXXXX"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Class and Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className={labelClass}>Class</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><AcademicCapIcon /></div>
//                   <input required name="className" value={formData.className} type="text" onChange={handleChange} className={inputClass} placeholder="9, 10, 11, 12" maxLength={5} />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClass}>Section</label>
//                 <select 
//                   name="section"
//                   value={formData.section}
//                   onChange={handleChange}
//                   className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-900 focus:bg-white transition-all font-bold text-slate-900 text-sm"
//                 >
//                   <option value="A">Section A</option>
//                   <option value="B">Section B</option>
//                   <option value="C">Section C</option>
//                 </select>
//               </div>
//             </div>

//             {/* Photo Upload */}
//             <div>
//               <label className={labelClass}>Student Photo <span className="text-blue-600">(Optional but recommended)</span></label>
//               <div className="flex items-center gap-4">
//                 {photoPreview ? (
//                   <div className="relative">
//                     <img src={photoPreview} className="w-24 h-28 rounded-xl object-cover border-2 border-blue-500" />
//                     <button 
//                       type="button"
//                       onClick={removePhoto}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="cursor-pointer">
//                     <div className="w-24 h-28 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-blue-500 transition group">
//                       <UploadCloud size={24} className="text-slate-400 group-hover:text-blue-500 transition" />
//                       <span className="text-[9px] text-slate-400 mt-1 group-hover:text-blue-500 transition">Click to Upload</span>
//                     </div>
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       className="hidden" 
//                       onChange={handlePhotoChange}
//                     />
//                   </label>
//                 )}
//                 <p className="text-[10px] text-slate-400 max-w-[200px]">
//                   Upload a clear passport-size photo for ID card (Max 2MB)
//                 </p>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className={labelClass}>Password <span className="text-blue-600">Max 8 Chars</span></label>
//               <div className="relative group">
//                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-900 transition-colors"><LockIcon /></div>
//                 <input 
//                   required 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password}
//                   onChange={handleChange} 
//                   className={inputClass} 
//                   placeholder="••••••••" 
//                   maxLength={8}
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-900 transition-colors"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               <div className="mt-3 px-1">
//                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full transition-all duration-500 ${getStrengthColor()}`}
//                     style={{ width: `${(formData.password.length / 8) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-black active:scale-95 transition-all disabled:bg-slate-200"
//             >
//               {mutation.isPending ? "Submitting Application..." : "Submit Application"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

























// "use client";

// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { X, UploadCloud, User, UserPlus, Mail, Phone, GraduationCap, AlertCircle } from "lucide-react";

// export default function AdmissionPage() {
//   const router = useRouter();
//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     name: "",
//     fatherName: "",
//     email: "",
//     phone: "",
//     className: ""
//   });

//   // Real-time validation function
//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
    
//     switch (name) {
//       case "name":
//         if (!value.trim()) {
//           newErrors.name = "Full name is required";
//         } else if (value.trim().length < 3) {
//           newErrors.name = "Name must be at least 3 characters";
//         } else {
//           delete newErrors.name;
//         }
//         break;
        
//       case "fatherName":
//         if (!value.trim()) {
//           newErrors.fatherName = "Father name is required";
//         } else if (value.trim().length < 3) {
//           newErrors.fatherName = "Father name must be at least 3 characters";
//         } else {
//           delete newErrors.fatherName;
//         }
//         break;
        
//       case "email":
//         if (!value.trim()) {
//           newErrors.email = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//           newErrors.email = "Please enter a valid email address";
//         } else {
//           delete newErrors.email;
//         }
//         break;
        
//       case "phone":
//         if (value.trim() && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
//           newErrors.phone = "Please enter a valid phone number (10-11 digits)";
//         } else {
//           delete newErrors.phone;
//         }
//         break;
        
//       case "className":
//         if (!value.trim()) {
//           newErrors.className = "Class is required";
//         } else {
//           delete newErrors.className;
//         }
//         break;
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const mutation = useMutation({
//     mutationFn: async (data) => {
//       const formDataObj = new FormData();
//       formDataObj.append("name", data.name);
//       formDataObj.append("fatherName", data.fatherName);
//       formDataObj.append("email", data.email);
//       formDataObj.append("phone", data.phone);
//       formDataObj.append("className", data.className);
//       if (photoFile) {
//         formDataObj.append("photo", photoFile);
//       }
      
//       const res = await fetch("/api/admission", {
//         method: "POST",
//         body: formDataObj
//       });
      
//       const result = await res.json();
      
//       if (!res.ok) {
//         throw new Error(result.error || result.message || "Admission failed");
//       }
      
//       return result;
//     },
//     onSuccess: (res) => {
//       toast.success(res.message || "Application submitted successfully!");
//       setTimeout(() => router.push("/login"), 2000);
//     },
//     onError: (err) => {
//       const errorMessage = err.message || "Server Error";
//       toast.error(errorMessage);
      
//       // Handle duplicate phone/email errors
//       if (errorMessage.toLowerCase().includes("phone")) {
//         setErrors(prev => ({ ...prev, phone: errorMessage }));
//       }
//       if (errorMessage.toLowerCase().includes("email")) {
//         setErrors(prev => ({ ...prev, email: errorMessage }));
//       }
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === "className" && value.length > 5) return;
//     if (name === "phone") {
//       const cleaned = value.replace(/[^0-9\s]/g, '');
//       setFormData((prev) => ({ ...prev, [name]: cleaned }));
//       if (cleaned.trim()) {
//         validateField(name, cleaned);
//       }
//       return;
//     }
    
//     setFormData((prev) => ({ ...prev, [name]: value }));
    
//     // Real-time validation on change
//     if (errors[name]) {
//       validateField(name, value);
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     validateField(name, value);
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Photo size should be less than 2MB");
//         return;
//       }
//       if (!file.type.startsWith("image/")) {
//         toast.error("Please upload an image file");
//         return;
//       }
//       setPhotoFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPhotoPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const removePhoto = () => {
//     setPhotoFile(null);
//     setPhotoPreview(null);
//   };

//   // Validate all fields before submit
//   const validateAllFields = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = "Full name is required";
//     } else if (formData.name.trim().length < 3) {
//       newErrors.name = "Name must be at least 3 characters";
//     }
    
//     if (!formData.fatherName.trim()) {
//       newErrors.fatherName = "Father name is required";
//     } else if (formData.fatherName.trim().length < 3) {
//       newErrors.fatherName = "Father name must be at least 3 characters";
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }
    
//     if (formData.phone.trim() && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
//       newErrors.phone = "Please enter a valid phone number (10-11 digits)";
//     }
    
//     if (!formData.className.trim()) {
//       newErrors.className = "Class is required";
//     }
    
//     setErrors(newErrors);
    
//     if (Object.keys(newErrors).length > 0) {
//       toast.error("Please fix the errors before submitting");
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!validateAllFields()) {
//       return;
//     }
    
//     mutation.mutate(formData);
//   };

//   const labelClass = "text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2 block";
//   const inputClass = "w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all text-gray-700 text-sm";
//   const inputErrorClass = "w-full pl-12 pr-4 py-3.5 bg-red-50 border border-red-300 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all text-gray-700 text-sm";
//   const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-sans">
//       <Toaster position="top-center" />
      
//       <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
//         {/* Left Side - Branding */}
//         <div className="md:w-[38%] bg-gradient-to-br from-blue-900 to-indigo-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
//           <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
//           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
          
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-8">
//               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
//                 <GraduationCap className="w-5 h-5 text-white" />
//               </div>
//               <span className="font-bold text-xl tracking-tight">SMS Portal</span>
//             </div>
//             <h2 className="text-3xl font-bold leading-tight">Start Your<br />Journey Today</h2>
//             <p className="text-blue-200/80 text-sm mt-4 leading-relaxed">
//               Join our community of learners. Fill out the form to begin your admission process.
//             </p>
//           </div>
          
//           <div className="relative z-10 mt-8">
//             <div className="flex items-center gap-2 text-blue-200/60 text-xs">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <span>Admissions Open for 2026</span>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Form */}
//         <div className="md:w-[62%] p-6 md:p-8 lg:p-10 bg-white">
//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-gray-800">Admission Form</h3>
//             <p className="text-gray-500 text-xs mt-1">Fill in the details to apply</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//             {/* Name and Father Name */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className={labelClass}>Full Name *</label>
//                 <div className="relative group">
//                   <User className={`${iconClass} w-4 h-4 ${errors.name ? 'text-red-400' : ''}`} />
//                   <input 
//                     required 
//                     name="name" 
//                     type="text" 
//                     value={formData.name} 
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className={errors.name ? inputErrorClass : inputClass} 
//                     placeholder="Enter full name" 
//                   />
//                 </div>
//                 {errors.name && (
//                   <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
//                     <AlertCircle size={10} />
//                     {errors.name}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Father Name *</label>
//                 <div className="relative group">
//                   <UserPlus className={`${iconClass} w-4 h-4 ${errors.fatherName ? 'text-red-400' : ''}`} />
//                   <input 
//                     required 
//                     name="fatherName" 
//                     type="text" 
//                     value={formData.fatherName} 
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className={errors.fatherName ? inputErrorClass : inputClass} 
//                     placeholder="Enter father name" 
//                   />
//                 </div>
//                 {errors.fatherName && (
//                   <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
//                     <AlertCircle size={10} />
//                     {errors.fatherName}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Email and Phone */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className={labelClass}>Email Address *</label>
//                 <div className="relative group">
//                   <Mail className={`${iconClass} w-4 h-4 ${errors.email ? 'text-red-400' : ''}`} />
//                   <input 
//                     required 
//                     name="email" 
//                     type="email" 
//                     value={formData.email} 
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className={errors.email ? inputErrorClass : inputClass} 
//                     placeholder="student@example.com" 
//                   />
//                 </div>
//                 {errors.email ? (
//                   <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
//                     <AlertCircle size={10} />
//                     {errors.email}
//                   </p>
//                 ) : (
//                   <p className="text-[10px] text-blue-500 mt-1">✓ Login OTP will be sent here</p>
//                 )}
//               </div>
//               <div>
//                 <label className={labelClass}>Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
//                 <div className="relative group">
//                   <Phone className={`${iconClass} w-4 h-4 ${errors.phone ? 'text-red-400' : ''}`} />
//                   <input 
//                     name="phone" 
//                     type="tel" 
//                     value={formData.phone} 
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className={errors.phone ? inputErrorClass : inputClass} 
//                     placeholder="03XXXXXXXXX" 
//                   />
//                 </div>
//                 {errors.phone && (
//                   <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
//                     <AlertCircle size={10} />
//                     {errors.phone}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Class Only */}
//             <div>
//               <label className={labelClass}>Class *</label>
//               <div className="relative group">
//                 <GraduationCap className={`${iconClass} w-4 h-4 ${errors.className ? 'text-red-400' : ''}`} />
//                 <input 
//                   required 
//                   name="className" 
//                   value={formData.className} 
//                   type="text" 
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={errors.className ? inputErrorClass : inputClass} 
//                   placeholder="e.g., 9, 10, 11, 12" 
//                   maxLength={5} 
//                 />
//               </div>
//               {errors.className && (
//                 <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
//                   <AlertCircle size={10} />
//                   {errors.className}
//                 </p>
//               )}
//             </div>

//             {/* Photo Upload */}
//             <div>
//               <label className={labelClass}>Student Photo <span className="text-gray-400 font-normal">(Optional)</span></label>
//               <div className="flex items-center gap-4 flex-wrap">
//                 {photoPreview ? (
//                   <div className="relative">
//                     <img src={photoPreview} className="w-20 h-24 rounded-lg object-cover border-2 border-blue-500 shadow-sm" />
//                     <button 
//                       type="button"
//                       onClick={removePhoto}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md cursor-pointer"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="cursor-pointer">
//                     <div className="w-20 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
//                       <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
//                       <span className="text-[9px] text-gray-400 mt-1 group-hover:text-blue-500 transition">Upload</span>
//                     </div>
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       className="hidden" 
//                       onChange={handlePhotoChange}
//                     />
//                   </label>
//                 )}
//                 <p className="text-[10px] text-gray-400 max-w-[180px]">
//                   Passport-size photo (Max 2MB)
//                 </p>
//               </div>
//             </div>

//             {/* Info Message */}
//             <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
//               <p className="text-[11px] text-blue-700 text-center">
//                 🎓 After admin approval, you'll receive login OTP on your registered email.
//                 Section will be assigned by admin.
//               </p>
//             </div>

//             {/* Submit Button */}
//             <button 
//               disabled={mutation.isPending}
//               type="submit" 
//               className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//             >
//               {mutation.isPending ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Submitting...</span>
//                 </div>
//               ) : (
//                 "Submit Application"
//               )}
//             </button>
//           </form>
          
//           {/* Footer */}
//           <p className="text-center text-gray-400 text-[10px] mt-6">
//             By submitting, you agree to our terms and conditions
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

















































"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { X, UploadCloud, User, UserPlus, Mail, Phone, GraduationCap, AlertCircle, MapPin, CreditCard, BookOpen } from "lucide-react";

export default function AdmissionPage() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    cnic: "",
    address: "",
    city: "",
    className: "",
    targetCourse: ""
  });

  // Real-time validation function
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Full name is required";
        } else if (value.trim().length < 3) {
          newErrors.name = "Name must be at least 3 characters";
        } else {
          delete newErrors.name;
        }
        break;
        
      case "fatherName":
        if (!value.trim()) {
          newErrors.fatherName = "Father name is required";
        } else if (value.trim().length < 3) {
          newErrors.fatherName = "Father name must be at least 3 characters";
        } else {
          delete newErrors.fatherName;
        }
        break;
        
      case "motherName":
        if (value.trim() && value.trim().length < 3) {
          newErrors.motherName = "Mother name must be at least 3 characters";
        } else {
          delete newErrors.motherName;
        }
        break;
        
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
        
      case "phone":
        if (value.trim() && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = "Please enter a valid phone number (10-11 digits)";
        } else {
          delete newErrors.phone;
        }
        break;
        
      case "cnic":
        if (value.trim() && !/^[0-9]{13}$/.test(value.replace(/-/g, ''))) {
          newErrors.cnic = "Please enter valid CNIC (13 digits)";
        } else {
          delete newErrors.cnic;
        }
        break;
        
      case "address":
        if (value.trim() && value.trim().length < 5) {
          newErrors.address = "Address must be at least 5 characters";
        } else {
          delete newErrors.address;
        }
        break;
        
      case "city":
        if (value.trim() && value.trim().length < 2) {
          newErrors.city = "Please enter a valid city name";
        } else {
          delete newErrors.city;
        }
        break;
        
      case "className":
        if (!value.trim()) {
          newErrors.className = "Class is required";
        } else {
          delete newErrors.className;
        }
        break;
        
      case "targetCourse":
        if (!value.trim()) {
          newErrors.targetCourse = "Course/Program is required";
        } else {
          delete newErrors.targetCourse;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      const formDataObj = new FormData();
      formDataObj.append("name", data.name);
      formDataObj.append("fatherName", data.fatherName);
      formDataObj.append("motherName", data.motherName);
      formDataObj.append("email", data.email);
      formDataObj.append("phone", data.phone);
      formDataObj.append("cnic", data.cnic);
      formDataObj.append("address", data.address);
      formDataObj.append("city", data.city);
      formDataObj.append("className", data.className);
      formDataObj.append("targetCourse", data.targetCourse);
      if (photoFile) {
        formDataObj.append("photo", photoFile);
      }
      
      const res = await fetch("/api/admission", {
        method: "POST",
        body: formDataObj
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || result.message || "Admission failed");
      }
      
      return result;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Application submitted successfully!");
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (err) => {
      const errorMessage = err.message || "Server Error";
      toast.error(errorMessage);
      
      // Handle duplicate phone/email errors
      if (errorMessage.toLowerCase().includes("phone")) {
        setErrors(prev => ({ ...prev, phone: errorMessage }));
      }
      if (errorMessage.toLowerCase().includes("email")) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
      }
      if (errorMessage.toLowerCase().includes("size")) {
        setErrors(prev => ({ ...prev, photo: errorMessage }));
        toast.error("Photo size should be less than 4MB");
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "className" && value.length > 5) return;
    
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      if (cleaned.trim()) {
        validateField(name, cleaned);
      }
      return;
    }
    
    if (name === "cnic") {
      let cleaned = value.replace(/[^0-9]/g, '');
      if (cleaned.length > 13) cleaned = cleaned.slice(0, 13);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      if (cleaned.trim()) {
        validateField(name, cleaned);
      }
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ✅ Updated to 4MB limit
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Photo size should be less than 4MB");
        setErrors(prev => ({ ...prev, photo: "Photo size should be less than 4MB" }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        setErrors(prev => ({ ...prev, photo: "Please upload an image file" }));
        return;
      }
      // Clear photo error if any
      if (errors.photo) {
        const newErrors = { ...errors };
        delete newErrors.photo;
        setErrors(newErrors);
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (errors.photo) {
      const newErrors = { ...errors };
      delete newErrors.photo;
      setErrors(newErrors);
    }
  };

  // Validate all fields before submit
  const validateAllFields = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    
    if (!formData.fatherName.trim()) {
      newErrors.fatherName = "Father name is required";
    } else if (formData.fatherName.trim().length < 3) {
      newErrors.fatherName = "Father name must be at least 3 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone.trim() && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number (10-11 digits)";
    }
    
    if (formData.cnic.trim() && !/^[0-9]{13}$/.test(formData.cnic.replace(/-/g, ''))) {
      newErrors.cnic = "Please enter valid CNIC (13 digits)";
    }
    
    if (!formData.className.trim()) {
      newErrors.className = "Class is required";
    }
    
    if (!formData.targetCourse.trim()) {
      newErrors.targetCourse = "Course/Program is required";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors before submitting");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }
    
    mutation.mutate(formData);
  };

  const labelClass = "text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2 block";
  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all text-gray-700 text-sm";
  const inputErrorClass = "w-full pl-12 pr-4 py-3.5 bg-red-50 border border-red-300 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all text-gray-700 text-sm";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />
      
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Branding */}
        <div className="md:w-[35%] bg-gradient-to-br from-blue-900 to-indigo-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">SMS Portal</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">Start Your<br />Journey Today</h2>
            <p className="text-blue-200/80 text-sm mt-4 leading-relaxed">
              Join our community of learners. Fill out the form to begin your admission process.
            </p>
          </div>
          
          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-2 text-blue-200/60 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Admissions Open for 2026</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-[65%] p-6 md:p-8 lg:p-10 bg-white overflow-y-auto max-h-screen">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Admission Form</h3>
            <p className="text-gray-500 text-xs mt-1">Fill in the details to apply</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name and Father Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative group">
                  <User className={`${iconClass} w-4 h-4 ${errors.name ? 'text-red-400' : ''}`} />
                  <input 
                    required 
                    name="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name ? inputErrorClass : inputClass} 
                    placeholder="Enter full name" 
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Father Name *</label>
                <div className="relative group">
                  <UserPlus className={`${iconClass} w-4 h-4 ${errors.fatherName ? 'text-red-400' : ''}`} />
                  <input 
                    required 
                    name="fatherName" 
                    type="text" 
                    value={formData.fatherName} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.fatherName ? inputErrorClass : inputClass} 
                    placeholder="Enter father name" 
                  />
                </div>
                {errors.fatherName && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.fatherName}
                  </p>
                )}
              </div>
            </div>

            {/* Mother Name */}
            <div>
              <label className={labelClass}>Mother Name <span className="text-gray-400 font-normal">(Optional)</span></label>
              <div className="relative group">
                <UserPlus className={`${iconClass} w-4 h-4 ${errors.motherName ? 'text-red-400' : ''}`} />
                <input 
                  name="motherName" 
                  type="text" 
                  value={formData.motherName} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.motherName ? inputErrorClass : inputClass} 
                  placeholder="Enter mother name" 
                />
              </div>
              {errors.motherName && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.motherName}
                </p>
              )}
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email Address * <span className="text-gray-400 font-normal">(Parents)</span></label>
                <div className="relative group">
                  <Mail className={`${iconClass} w-4 h-4 ${errors.email ? 'text-red-400' : ''}`} />
                  <input 
                    required 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email ? inputErrorClass : inputClass} 
                    placeholder="student@example.com" 
                  />
                </div>
                {errors.email ? (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.email}
                  </p>
                ) : (
                  <p className="text-[10px] text-blue-500 mt-1">✓ Login OTP will be sent here</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Phone Number </label>
                <div className="relative group">
                  <Phone className={`${iconClass} w-4 h-4 ${errors.phone ? 'text-red-400' : ''}`} />
                  <input 
                    name="phone" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.phone ? inputErrorClass : inputClass} 
                    placeholder="03XXXXXXXXX" 
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* CNIC */}
            <div>
              <label className={labelClass}>CNIC <span className="text-gray-400 font-normal">(Optional - 13 digits)</span></label>
              <div className="relative group">
                <CreditCard className={`${iconClass} w-4 h-4 ${errors.cnic ? 'text-red-400' : ''}`} />
                <input 
                  name="cnic" 
                  type="text" 
                  value={formData.cnic} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.cnic ? inputErrorClass : inputClass} 
                  placeholder="42401-XXX-XXX" 
                  maxLength={13}
                />
              </div>
              {errors.cnic && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.cnic}
                </p>
              )}
            </div>

            {/* Address and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Address </label>
                <div className="relative group">
                  <MapPin className={`${iconClass} w-4 h-4 ${errors.address ? 'text-red-400' : ''}`} />
                  <input 
                    name="address" 
                    type="text" 
                    value={formData.address} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.address ? inputErrorClass : inputClass} 
                    placeholder="House #, Street, Area" 
                  />
                </div>
                {errors.address && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.address}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>City </label>
                <div className="relative group">
                  <MapPin className={`${iconClass} w-4 h-4 ${errors.city ? 'text-red-400' : ''}`} />
                  <input 
                    name="city" 
                    type="text" 
                    value={formData.city} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.city ? inputErrorClass : inputClass} 
                    placeholder="Karachi, Lahore, etc." 
                  />
                </div>
                {errors.city && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* Class and Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Class *</label>
                <div className="relative group">
                  <GraduationCap className={`${iconClass} w-4 h-4 ${errors.className ? 'text-red-400' : ''}`} />
                  <input 
                    required 
                    name="className" 
                    value={formData.className} 
                    type="text" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.className ? inputErrorClass : inputClass} 
                    placeholder="e.g., 9, 10, 11, 12" 
                    maxLength={5} 
                  />
                </div>
                {errors.className && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.className}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Course / Program *</label>
                <div className="relative group">
                  <BookOpen className={`${iconClass} w-4 h-4 ${errors.targetCourse ? 'text-red-400' : ''}`} />
                  <input 
                    required 
                    name="targetCourse" 
                    value={formData.targetCourse} 
                    type="text" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.targetCourse ? inputErrorClass : inputClass} 
                    placeholder="e.g., Computer Science, Medical" 
                  />
                </div>
                {errors.targetCourse && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.targetCourse}
                  </p>
                )}
              </div>
            </div>

            {/* Photo Upload - Updated to 4MB */}
            <div>
              <label className={labelClass}>Student Photo <span className="text-gray-400 font-normal">(Optional, Max 4MB)</span></label>
              <div className="flex items-center gap-4 flex-wrap">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} className="w-20 h-24 rounded-lg object-cover border-2 border-blue-500 shadow-sm" />
                    <button 
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-20 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
                      <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
                      <span className="text-[9px] text-gray-400 mt-1 group-hover:text-blue-500 transition">Upload</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp,image/gif" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
                <p className="text-[10px] text-gray-400 max-w-[180px]">
                  Passport-size photo (Max 4MB)<br/>
                  Formats: JPEG, PNG, WEBP, GIF
                </p>
              </div>
              {errors.photo && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {errors.photo}
                </p>
              )}
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-[11px] text-blue-700 text-center">
                🎓 After admin approval, you'll receive login OTP on your registered email.
                Section will be assigned by admin.
              </p>
            </div>

            {/* Submit Button */}
            <button 
              disabled={mutation.isPending}
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
          
          {/* Footer */}
          <p className="text-center text-gray-400 text-[10px] mt-6">
            By submitting, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}