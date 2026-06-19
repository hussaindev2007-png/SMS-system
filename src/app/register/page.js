// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("student"); // Default tab
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//     secretKey: "",
//     className: "",
//     rollNo: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       alert("Registration Successful!");
//       router.push("/dashboard");
//     },
//     onError: (error) => alert(error.message),
//   });

//   const handleTabChange = (role) => {
//     setActiveTab(role);
//     setFormData({ ...formData, role: role, secretKey: "", className: "", rollNo: "" });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
//       <h1 className="text-2xl font-bold text-blue-900 mb-6 italic">School Management System </h1>
//       <label className="text-2xl font-bold text-blue-900 mb-6 italic">(SMS) Register</label>

//       <div className="bg-white shadow-xl rounded-2xl w-full max-w-md overflow-hidden border border-gray-200">
        
//         <div className="flex border-b">
//           <button
//             onClick={() => handleTabChange("student")}
//             className={`flex-1 py-4 text-sm font-semibold transition-all ${
//               activeTab === "student" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 bg-gray-50"
//             }`}
//           >
//             Student Register
//           </button>
//           <button
//             onClick={() => handleTabChange("teacher")}
//             className={`flex-1 py-4 text-sm font-semibold transition-all ${
//               activeTab === "teacher" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 bg-gray-50"
//             }`}
//           >
//             Teacher/Admin
//           </button>
//         </div>

//         <div className="p-8">
//           <div className="mb-6">
//             <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
//             <p className="text-gray-500 text-sm">Kindly provide your details to register.</p>
//           </div>

          
// <form onSubmit={handleSubmit} className="space-y-4">
 
//   <div>
//     <label className="text-xs font-bold text-gray-600 uppercase">Full Name *</label>
//     <input
//       name="name"
      
//       className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 placeholder:text-gray-400 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//       onChange={handleChange}
//       placeholder="Hussain Ali" 
//       required
//     />
//   </div>

//   <div>
//     <label className="text-xs font-bold text-gray-600 uppercase">Email / Official ID *</label>
//     <input
//       name="email"
//       type="email"
      
//       className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 placeholder:text-gray-400 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//       onChange={handleChange}
//       placeholder="hussain@example.com"
//       required
//     />
//   </div>

  
//   {activeTab === "student" && (
//     <div className="grid grid-cols-2 gap-4">
//       <div>
//         <label className="text-xs font-bold text-gray-600 uppercase">Class *</label>
//         <input
//           name="className"
//           // Added text-gray-900 and placeholder:text-gray-400
//           className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 placeholder:text-gray-400 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//           onChange={handleChange}
//           placeholder="e.g. 10th-A"
//           required
//         />
//       </div>
//       <div>
//         <label className="text-xs font-bold text-gray-600 uppercase">Roll No *</label>
//         <input
//           name="rollNo"
         
//           className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 placeholder:text-gray-400 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//           onChange={handleChange}
//           placeholder="e.g. 101"
//           required
//         />
//       </div>
//     </div>
//   )}

  
//   {activeTab === "teacher" && (
//     <>
//       <div>
//         <label className="text-xs font-bold text-gray-600 uppercase">Select Specific Role *</label>
//         <select 
//           name="role" 
         
//           className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//           onChange={handleChange}
//         >
//           <option value="teacher">Trainer / Teacher</option>
//           <option value="admin">System Administrator</option>
//         </select>
//       </div>
//       <div>
//         <label className="text-xs font-bold text-gray-600 uppercase">Access/Verification Code *</label>
//         <input
//           name="secretKey"
//           type="password"
          
//           className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 placeholder:text-gray-400 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//           onChange={handleChange}
//           placeholder="Enter official code"
//           required
//         />
//       </div>
//     </>
//   )}

//   <div>
//     <label className="text-xs font-bold text-gray-600 uppercase">Password *</label>
//     <input
//       name="password"
//       type="password"
     
//       className="w-full p-3 mt-1 bg-blue-50/50 border border-blue-100 text-gray-900 placeholder:text-gray-400 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all"
//       onChange={handleChange}
//       placeholder="••••••••"
//       required
//     />
//   </div>

//   <button
//     type="submit"
//     disabled={registerMutation.isPending}
//     className="w-full py-3 mt-4 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg transition-all shadow-lg uppercase tracking-wider text-sm"
//   >
//     {registerMutation.isPending ? "Processing..." : "Register"}
//   </button>
// </form>



//           <p className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{" "}
//             <span onClick={() => router.push("/login")} className="text-blue-600 font-bold cursor-pointer hover:underline">
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }























// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("student");
  
//   // Initial state logic
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//     secretKey: "",
//     className: "",
//     rollNo: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       alert("Registration Successful!");
//       router.push("/dashboard");
//     },
//     onError: (error) => alert(error.message),
//   });

//   const handleTabChange = (role) => {
//     setActiveTab(role);
//     // Reset form when switching tabs to avoid cross-role data issues
//     setFormData({ 
//       name: "", 
//       email: "", 
//       password: "", 
//       role: role, 
//       secretKey: "", 
//       className: "", 
//       rollNo: "" 
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
//       <h1 className="text-3xl font-black text-blue-900 mb-8 italic tracking-tighter">SMS Portal</h1>

//       <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md overflow-hidden border border-gray-100">
        
//         {/* Tabs for Student/Staff */}
//         <div className="flex p-2 bg-gray-50/50">
//           <button
//             type="button"
//             onClick={() => handleTabChange("student")}
//             className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
//               activeTab === "student" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
//             }`}
//           >
//             Student Register
//           </button>
//           <button
//             type="button"
//             onClick={() => handleTabChange("teacher")}
//             className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
//               activeTab === "teacher" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
//             }`}
//           >
//             Staff Register
//           </button>
//         </div>

//         <div className="p-10">
//           <div className="mb-6 text-center">
//             <h2 className="text-2xl font-extrabold text-gray-900">Create Account</h2>
//             <p className="text-gray-500 text-xs mt-2 italic">Registering as {activeTab === 'student' ? 'Student' : 'Staff Member'}</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
            
//             {/* Full Name - Sab ke liye */}
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm"
//                 onChange={handleChange}
//                 placeholder="e.g. Hussain Ali"
//                 required
//               />
//             </div>

//             {/* Email - SIRF Staff ke liye */}
//             {activeTab === "teacher" && (
//               <div>
//                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email *</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm"
//                   onChange={handleChange}
//                   placeholder="staff@sms.com"
//                   required
//                 />
//               </div>
//             )}

//             {/* Student Fields: Class & Roll No */}
//             {activeTab === "student" && (
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class *</label>
//                   <input
//                     name="className"
//                     value={formData.className}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm"
//                     onChange={handleChange}
//                     placeholder="e.g. 10th-A"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Roll No *</label>
//                   <input
//                     name="rollNo"
//                     value={formData.rollNo}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm"
//                     onChange={handleChange}
//                     placeholder="e.g. 101"
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Staff Only: Role & Verification Code */}
//             {activeTab === "teacher" && (
//               <>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role *</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none"
//                     onChange={handleChange}
//                   >
//                     <option value="teacher">Teacher</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secret Key *</label>
//                   <input
//                     name="secretKey"
//                     type="password"
//                     value={formData.secretKey}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm"
//                     onChange={handleChange}
//                     placeholder="Official Code"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             {/* Password - Sab ke liye */}
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password *</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 placeholder="••••••••"
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className={`w-full py-4 mt-4 rounded-2xl font-black text-white shadow-xl uppercase tracking-widest text-xs transition-all ${
//                 registerMutation.isPending ? "bg-gray-400" : "bg-blue-900 hover:bg-blue-800"
//               }`}
//             >
//               {registerMutation.isPending ? "Registering..." : "Create Account"}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-xs text-gray-500">
//             Already have an account?{" "}
//             <span onClick={() => router.push("/login")} className="text-blue-600 font-bold cursor-pointer hover:underline">
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
































































// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("student");
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//     secretKey: "",
//     className: "",
//     rollNo: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Registration Successful! Redirecting...", {
//         position: "top-center",
//         autoClose: 2000,
//       });
      
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
      
//       // Thora delay taake user toast dekh sakay
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 2000);
//     },
//     onError: (error) => {
//       toast.error(error.message, {
//         position: "top-center",
//       });
//     },
//   });

//   const handleTabChange = (role) => {
//     setActiveTab(role);
//     setFormData({ 
//       name: "", 
//       email: "", 
//       password: "", 
//       role: role, 
//       secretKey: "", 
//       className: "", 
//       rollNo: "" 
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
//       {/* ToastContainer ko yahan add kiya hai */}
//       <ToastContainer stacked />
      
//       <h1 className="text-3xl font-black text-blue-900 mb-8 italic tracking-tighter">SMS Portal</h1>

//       <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md overflow-hidden border border-gray-100">
        
//         <div className="flex p-2 bg-gray-50/50">
//           <button
//             type="button"
//             onClick={() => handleTabChange("student")}
//             className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
//               activeTab === "student" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
//             }`}
//           >
//             Student Register
//           </button>
//           <button
//             type="button"
//             onClick={() => handleTabChange("teacher")}
//             className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
//               activeTab === "teacher" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
//             }`}
//           >
//             Staff Register
//           </button>
//         </div>

//         <div className="p-10">
//           <div className="mb-6 text-center">
//             <h2 className="text-2xl font-extrabold text-gray-900">Create Account</h2>
//             <p className="text-gray-500 text-xs mt-2 italic">Registering as {activeTab === 'student' ? 'Student' : 'Staff Member'}</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                 onChange={handleChange}
//                 placeholder="e.g. Hussain Ali"
//                 required
//               />
//             </div>

//             {activeTab === "teacher" && (
//               <div>
//                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email *</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                   onChange={handleChange}
//                   placeholder="staff@sms.com"
//                   required
//                 />
//               </div>
//             )}

//             {activeTab === "student" && (
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class *</label>
//                   <input
//                     name="className"
//                     value={formData.className}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                     onChange={handleChange}
//                     placeholder="e.g. 10th-A"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Roll No *</label>
//                   <input
//                     name="rollNo"
//                     value={formData.rollNo}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                     onChange={handleChange}
//                     placeholder="e.g. 101"
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             {activeTab === "teacher" && (
//               <>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role *</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none"
//                     onChange={handleChange}
//                   >
//                     <option value="teacher">Teacher</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Code *</label>
//                   <input
//                     name="secretKey"
//                     type="password"
//                     value={formData.secretKey}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                     onChange={handleChange}
//                     placeholder="Official Code"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password *</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 placeholder="••••••••"
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className={`w-full py-4 mt-4 rounded-2xl font-black text-white shadow-xl uppercase tracking-widest text-xs transition-all active:scale-95 ${
//                 registerMutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
//               }`}
//             >
//               {registerMutation.isPending ? "Processing..." : "Create Account"}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-xs text-gray-500">
//             Already have an account?{" "}
//             <span onClick={() => router.push("/login")} className="text-blue-600 font-bold cursor-pointer hover:underline">
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }





































// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("student");
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//     secretKey: "",
//     className: "",
//     rollNo: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Registration Successful! Redirecting...", {
//         position: "top-center",
//         autoClose: 2000,
//       });
      
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
      
//       setTimeout(() => {
//         router.push("/dashboard");
//       }, 2000);
//     },
//     onError: (error) => {
//       toast.error(error.message, {
//         position: "top-center",
//       });
//     },
//   });

//   const handleTabChange = (role) => {
//     setActiveTab(role);
//     setFormData({ 
//       name: "", 
//       email: "", 
//       password: "", 
//       role: role, 
//       secretKey: "", 
//       className: "", 
//       rollNo: "" 
//     });
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
//       <ToastContainer stacked />
      
//       <h1 className="text-3xl font-black text-blue-900 mb-8 italic tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
//         SMS Portal
//       </h1>

//       <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md overflow-hidden border border-gray-100">
        
//         <div className="flex p-2 bg-gray-50/50">
//           <button
//             type="button"
//             onClick={() => handleTabChange("student")}
//             className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
//               activeTab === "student" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
//             }`}
//           >
//             Student Register
//           </button>
//           <button
//             type="button"
//             onClick={() => handleTabChange("teacher")}
//             className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${
//               activeTab === "teacher" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
//             }`}
//           >
//             Staff Register
//           </button>
//         </div>

//         <div className="p-8">
//           <div className="mb-6 text-center">
//             <h2 className="text-2xl font-extrabold text-gray-900">Create Account</h2>
//             <p className="text-gray-500 text-xs mt-2 italic">Registering as {activeTab === 'student' ? 'Student' : 'Staff Member'}</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Full Name - Common for both */}
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                 onChange={handleChange}
//                 placeholder="e.g. Hussain Ali"
//                 required
//               />
//             </div>

//             {/* Email - Now common for both to avoid DB Index errors */}
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
//                 {activeTab === "student" ? "Student Email *" : "Official Email *"}
//               </label>
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                 onChange={handleChange}
//                 placeholder={activeTab === "student" ? "student@sms.com" : "staff@sms.com"}
//                 required
//               />
//             </div>

//             {/* Student Specific Fields */}
//             {activeTab === "student" && (
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class *</label>
//                   <input
//                     name="className"
//                     value={formData.className}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                     onChange={handleChange}
//                     placeholder="e.g. 10th-A"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Roll No *</label>
//                   <input
//                     name="rollNo"
//                     value={formData.rollNo}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                     onChange={handleChange}
//                     placeholder="e.g. 101"
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Staff Specific Fields */}
//             {activeTab === "teacher" && (
//               <>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role *</label>
//                   <select
//                     name="role"
//                     value={formData.role}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none cursor-pointer"
//                     onChange={handleChange}
//                   >
//                     <option value="teacher">Teacher</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Code *</label>
//                   <input
//                     name="secretKey"
//                     type="password"
//                     value={formData.secretKey}
//                     className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                     onChange={handleChange}
//                     placeholder="Enter Staff Code"
//                     required
//                   />
//                 </div>
//               </>
//             )}

//             {/* Password - Common for both */}
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password *</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 placeholder="••••••••"
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 text-gray-900 rounded-2xl outline-none focus:border-blue-500 shadow-sm transition-all"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className={`w-full py-4 mt-4 rounded-2xl font-black text-white shadow-xl uppercase tracking-widest text-xs transition-all active:scale-95 ${
//                 registerMutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
//               }`}
//             >
//               {registerMutation.isPending ? "Processing..." : "Create Account"}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-xs text-gray-500">
//             Already have an account?{" "}
//             <span onClick={() => router.push("/login")} className="text-blue-600 font-bold cursor-pointer hover:underline">
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// phone and sub


// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RegisterPage() {
//   const router = useRouter();
  
//   // Ab sirf student hi register ho sakta hai
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student",
//     className: "",
//     rollNo: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Mubarak ho! Redirecting...", { position: "top-center", autoClose: 2000 });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => { router.push("/dashboard"); }, 2000);
//     },
//     onError: (error) => {
//       toast.error(error.message, { position: "top-center" });
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // --- Limits Check ---
//     if (name === "password" && value.length > 6) return; // Password Max 7
//     if (name === "rollNo" && value.length > 6) return; // Roll No Max 10 (Safely)
//     if (name === "className" && value.length > 3) return; // Roll No Max 10 (Safely)

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
//       <ToastContainer stacked />
      
//       <h1 className="text-3xl font-black text-blue-900 mb-8 italic tracking-tighter cursor-pointer uppercase" onClick={() => router.push("/")}>
//         SMS Portal
//       </h1>

//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-md overflow-hidden border border-gray-100">
        
//         {/* Tab Section simplified to show only Student info */}
//         <div className="flex p-2 bg-gray-50/50">
//           <div className="flex-1 py-3 text-[10px] uppercase tracking-widest font-black rounded-2xl bg-white text-blue-600 shadow-sm text-center">
//             Student Registration Only
//           </div>
//         </div>

//         <div className="p-8">
//           <div className="mb-6 text-center">
//             <h2 className="text-2xl font-black text-gray-900 uppercase italic">Join as Student</h2>
//             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
//               Teachers please contact Admin for access
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
//               <input
//                 name="name"
//                 value={formData.name}
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
//                 onChange={handleChange}
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email *</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
//                 onChange={handleChange}
//                 placeholder="student@school.com"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Class *</label>
//                 <input
//                   name="className"
//                   value={formData.className}
//                   className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 rounded-2xl font-bold"
//                   onChange={handleChange}
//                   placeholder="e.g. 10th"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Roll No *</label>
//                 <input
//                   name="rollNo"
//                   value={formData.rollNo}
//                   className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 rounded-2xl font-bold"
//                   onChange={handleChange}
//                   placeholder="e.g. 101" 
//                   required
//                 />
//               </div>
              
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password (Max 7) *</label>
//               <input
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 placeholder="•••••••"
//                 className="w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 rounded-2xl font-bold outline-none focus:border-blue-500"
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className={`w-full py-4 mt-4 rounded-2xl font-black cursor-pointer text-white shadow-xl uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
//                 registerMutation.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
//               }`}
//             >
//               {registerMutation.isPending ? "Creating Account..." : "Register Now"}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//             Already registered?{" "}
//             <span onClick={() => router.push("/login")} className="text-blue-600 cursor-pointer hover:underline">
//               Login here
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }





























































































// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = "hussain_fix_db_99"; 
//   const hasAccess = searchParams.get("admin_access") === ADMIN_ACCESS_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "admin",
//     secretKey: "",
//     phone: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch(`/api/auth/register?admin_access=${ADMIN_ACCESS_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Admin Registered! Redirecting...", { position: "top-center" });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => router.push("/dashboard"), 2000);
//     },
//     onError: (error) => toast.error(error.message, { position: "top-center" }),
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   if (!hasAccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//         <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 text-center max-w-md">
//           <h1 className="text-6xl font-black text-blue-900 italic mb-6 leading-none">SMS</h1>
//           <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Access Denied</h2>
//           <p className="text-gray-400 mt-4 text-sm font-medium">Public registration is disabled.</p>
//           <button onClick={() => router.push("/login")} className="mt-8 w-full py-5 bg-blue-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-800 transition-all">Back to Login</button>
//         </div>
//       </div>
//     );
//   }

//   // Common Input Class taake code saaf rahe
//   const inputClass = "w-full p-4 mt-1 bg-blue-50/30 border border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold text-gray-900 placeholder:text-gray-400 shadow-sm transition-all";

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
//       <ToastContainer stacked />
      
//       <h1 className="text-3xl font-black text-blue-900 mb-8 italic tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
//         Admin Portal
//       </h1>

//       <div className="bg-white shadow-2xl rounded-[3rem] w-full max-w-md overflow-hidden border border-gray-100">
//         <div className="p-10">
//           <div className="mb-8 text-center">
//             <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">Create Admin</h2>
//             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">Database Recovery Mode</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Name *</label>
//               <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="Hussain Ali" required />
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Admin Email *</label>
//               <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="admin@sms.com" required />
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Master Verification Code *</label>
//               <input name="secretKey" type="password" value={formData.secretKey} className={inputClass} onChange={handleChange} placeholder="••••••••" required />
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone (Optional)</label>
//               <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" />
//             </div>

//             <div>
//               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password *</label>
//               <input name="password" type="password" value={formData.password} className={inputClass} onChange={handleChange} placeholder="••••••••" required />
//             </div>

//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-800 active:scale-95 transition-all mt-4"
//             >
//               {registerMutation.isPending ? "Processing..." : "Register Admin"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Admin key (Keep this sync with .env)
//   const ADMIN_ACCESS_KEY = "456"; 
//   const hasAccess = searchParams.get("admin") === ADMIN_ACCESS_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "admin",
//     secretKey: "",
//     phone: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch(`/api/auth/register?admin=${ADMIN_ACCESS_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Admin Profile Created!", { position: "top-right" });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => router.push("/dashboard"), 1500);
//     },
//     onError: (error) => toast.error(error.message, { position: "top-right" }),
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   // --- ACCESS DENIED UI (Professionalized) ---
//   if (!hasAccess) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe] p-6 font-sans">
//         <div className="bg-white p-12 rounded-[2rem] shadow-lg border border-gray-100 text-center max-w-md w-full">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m3.432-6.038a6.5 6.5 0 01-9.362 9.362M19.07 19.07a6.5 6.5 0 01-9.362-9.362m1.13-1.13A1 1 0 0113 7.5c2.28 0 4.136 1.855 4.136 4.136a1 1 0 01-1.13 1.13z"></path>
//             </svg>
//           </div>
//           <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">System Restricted</h2>
//           <p className="text-gray-500 mt-4 text-base font-medium leading-relaxed">Public  registration is currently disabled. This gate is reserved for system administrators only.</p>
//           <button onClick={() => router.push("/login")} className="mt-10 w-full py-4.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all active:scale-95">Back to Security Login</button>
//         </div>
//       </div>
//     );
//   }

//   // Common Input Class (More Refined)
//   const inputClass = "w-full px-5 py-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 font-semibold text-gray-900 placeholder:text-gray-400 transition-all text-sm";
//   const labelClass = "text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block";

//   return (
//     <div className="min-h-screen bg-[#f4f7fe] flex items-center justify-center p-4 md:p-8 font-sans text-gray-900">
//       <ToastContainer stacked position="top-right" />
      
//       {/* Main Container - Split Layout */}
//       <div className="bg-white shadow-xl rounded-[2.5rem] w-full max-w-6xl min-h-[750px] flex overflow-hidden border border-gray-100">
        
//         {/* LEFT SIDE - Branding & Visual (Visible on MD+) */}
//         <div className="flex-1 bg-blue-900 p-16 flex flex-col justify-between relative overflow-hidden hidden md:flex">
//           {/* Subtle Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <svg width="100%" height="100%"><defs><pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#fff"></circle></pattern></defs><rect width="100%" height="100%" fill="url(#pattern)"></rect></svg>
//           </div>
          
//           <div className="relative z-10">
//             <h1 className="text-4xl font-black text-white italic tracking-tighter cursor-pointer uppercase" onClick={() => router.push("/")}>SMS Portal</h1>
//             <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.3em] mt-3">Edu-Management System</p>
//           </div>

//           <div className="relative z-10 max-w-sm">
//             <h2 className="text-5xl font-extrabold text-white leading-tight tracking-tighter">System <br/>Master Access.</h2>
//             <p className="text-blue-200 mt-6 text-base font-medium leading-relaxed">initialize the core administrative layer. Only verified personnel should proceed past this checkpoint.</p>
//           </div>

//           <div className="relative z-10 text-blue-300 text-xs font-medium">© 2024 SMS Core Tech. All rights reserved.</div>
//         </div>

//         {/* RIGHT SIDE - Register Form */}
//         <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
          
//           {/* Mobile Header (Visible on small screens) */}
//           <div className="mb-10 md:hidden text-center">
//              <h1 className="text-3xl font-black text-blue-900 italic tracking-tighter uppercase">SMS Portal</h1>
//              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Admin Enrollment</p>
//           </div>

//           <div className="mb-10">
//             <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">Create Master Account</h2>
//             <p className="text-gray-500 text-sm font-medium mt-2">Enter credentials to establish system-level privileges.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="e.g. Hussain Ali" required />
//             </div>

//             <div>
//               <label className={labelClass}>Work Email Address</label>
//               <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="name@company.com" required />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <input name="secretKey" type="password" value={formData.secretKey} className={inputClass} onChange={handleChange} placeholder="••••••••" required />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Phone (Optional)</label>
//                   <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" />
//                 </div>
//             </div>

//             <div>
//               <label className={labelClass}>Password</label>
//               <input name="password" type="password" value={formData.password} className={inputClass} onChange={handleChange} placeholder="Minimum 8 characters" required />
//             </div>

//             <div className="pt-3">
//                 <button
//                   type="submit"
//                   disabled={registerMutation.isPending}
//                   className="w-full py-4.5 bg-blue-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-blue-800 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
//                 >
//                   {registerMutation.isPending ? "Establishing Access..." : "Finalize & Create Admin"}
//                 </button>
//             </div>
//           </form>

//           <p className="mt-12 text-center text-sm font-medium text-gray-500">
//             Already have master access?{" "}
//             <span onClick={() => router.push("/login")} className="text-blue-700 font-semibold cursor-pointer hover:text-blue-600 hover:underline transition-all">
//               Login here
//             </span>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }


































































// not ui







// "use client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // 1. UPDATED DYNAMIC KEY: Ab ye exact aapke NEXT_PUBLIC_ADMIN variable ko use karega
//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const hasAccess = searchParams.get("admin") === ADMIN_ACCESS_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "admin",
//     secretKey: "",
//     phone: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       // API call mein bhi wahi key pass hogi jo .env mein hai
//       const response = await fetch(`/api/auth/register?admin=${ADMIN_ACCESS_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Admin Profile Created!", { position: "top-right" });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => router.push("/dashboard"), 1500);
//     },
//     onError: (error) => toast.error(error.message, { position: "top-right" }),
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // PASSWORD LIMIT: Max 7 characters
//     if (name === "password" && value.length > 7) return;

//     // PHONE LIMIT: Sirf numbers aur Max 11 digits
//     if (name === "phone") {
//       if (!/^\d*$/.test(value)) return; 
//       if (value.length > 11) return;
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password.length < 1) {
//         toast.warning("Password zaroori hai!");
//         return;
//     }
//     registerMutation.mutate(formData);
//   };

//   // --- ACCESS DENIED UI ---
//   // Agar key galat hai ya .env load nahi hui toh ye dikhayega
//   if (!hasAccess || !ADMIN_ACCESS_KEY) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#f4f7fe] p-6 font-sans">
//         <div className="bg-white p-12 rounded-[2rem] shadow-lg border border-gray-100 text-center max-w-md w-full">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m3.432-6.038a6.5 6.5 0 01-9.362 9.362M19.07 19.07a6.5 6.5 0 01-9.362-9.362m1.13-1.13A1 1 0 0113 7.5c2.28 0 4.136 1.855 4.136 4.136a1 1 0 01-1.13 1.13z"></path>
//             </svg>
//           </div>
//           <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Access Forbidden</h2>
//           <p className="text-gray-500 mt-4 text-base font-medium leading-relaxed">Security key mismatch. Check your URL or .env configuration.</p>
//           <button onClick={() => router.push("/login")} className="mt-10 w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">Back to Login</button>
//         </div>
//       </div>
//     );
//   }

//   const inputClass = "w-full px-5 py-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 font-semibold text-gray-900 placeholder:text-gray-400 transition-all text-sm";
//   const labelClass = "text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block";

//   return (
//     <div className="min-h-screen bg-[#f4f7fe] flex items-center justify-center p-4 font-sans text-gray-900">
//       <ToastContainer stacked />
//       <div className="bg-white shadow-xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-gray-100">
        
//         {/* LEFT SIDE (Branding) */}
//         <div className="flex-1 bg-blue-900 p-16 flex flex-col justify-between hidden md:flex">
//           <div>
//             <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">SMS Portal</h1>
//             <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.3em] mt-3">Core Infrastructure</p>
//           </div>
//           <div className="max-w-sm">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">Master Control.</h2>
//             <p className="text-blue-200 mt-6 text-base font-medium">Configure the root admin account with ID: {ADMIN_ACCESS_KEY?.slice(0,3)}***</p>
//           </div>
//           <div className="text-blue-300 text-xs font-medium">© 2026 Security Layer.</div>
//         </div>

//         {/* RIGHT SIDE (Form) */}
//         <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
//           <div className="mb-10">
//             <h2 className="text-3xl font-extrabold text-gray-950 tracking-tighter">Admin Enrollment</h2>
//             <p className="text-gray-500 text-sm mt-2">Initialize secure administrative privileges.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="Hussain Ali" required />
//             </div>

//             <div>
//               <label className={labelClass}>Work Email</label>
//               <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="admin@system.com" required />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <input name="secretKey" type="password" value={formData.secretKey} className={inputClass} onChange={handleChange} placeholder="Staff Code" required />
//                 </div>
//                 <div>
//                   <label className={labelClass}>Phone (Max 11)</label>
//                   <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03123456789" />
//                 </div>
//             </div>

//             <div>
//               <label className={labelClass}>Password (Max 7)</label>
//               <input name="password" type="password" value={formData.password} className={inputClass} onChange={handleChange} placeholder="Access Password" required />
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4.5 bg-blue-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 active:scale-95 transition-all disabled:bg-gray-400"
//               >
//                 {registerMutation.isPending ? "Configuring..." : "Create Master Admin"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }










// ui




// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // --- SVGs for Professional Icons ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );

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

// const ShieldIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Dynamic Key from .env
//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const hasAccess = searchParams.get("admin") === ADMIN_ACCESS_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "admin",
//     secretKey: "",
//     phone: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const response = await fetch(`/api/auth/register?admin=${ADMIN_ACCESS_KEY}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Registration Failed");
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Admin Profile Created!", { position: "top-right" });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => router.push("/dashboard"), 1500);
//     },
//     onError: (error) => toast.error(error.message, { position: "top-right" }),
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // PASSWORD LIMIT: Max 7 characters
//     if (name === "password" && value.length > 7) return;

//     // PHONE LIMIT: Sirf numbers aur Max 11 digits
//     if (name === "phone") {
//       if (!/^\d*$/.test(value)) return; 
//       if (value.length > 11) return;
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password.length < 1) {
//         toast.warning("Password zaroori hai!");
//         return;
//     }
//     registerMutation.mutate(formData);
//   };

//   // --- ACCESS DENIED UI ---
//   if (!hasAccess || !ADMIN_ACCESS_KEY) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m3.432-6.038a6.5 6.5 0 01-9.362 9.362M19.07 19.07a6.5 6.5 0 01-9.362-9.362m1.13-1.13A1 1 0 0113 7.5c2.28 0 4.136 1.855 4.136 4.136a1 1 0 01-1.13 1.13z"></path>
//             </svg>
//           </div>
//           <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Forbidden</h2>
//           <p className="text-slate-500 mt-3 text-sm font-medium leading-relaxed">
//             Security key mismatch. Please check your URL parameters or environment configuration.
//           </p>
//           <button 
//             onClick={() => router.push("/login")} 
//             className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Reusable Input Classes with Icon Support
//   const inputWrapperClass = "relative group";
//   const inputClass = "w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 font-semibold text-slate-700 placeholder:text-slate-400 transition-all text-sm cursor-text";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-900">
//       <ToastContainer stacked/>
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[750px] flex overflow-hidden border border-slate-100 relative">
        
//         {/* LEFT SIDE (Branding) - Hidden on Mobile */}
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           {/* Abstract Background Pattern */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-2">
//                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
//                     <ShieldIcon /> 
//                 </div>
//                 <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">SMS Portal</h1>
//             </div>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em]">Core Infrastructure v2.0</p>
//           </div>

//           <div className="relative z-10 max-w-sm">
//             <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
//               Master Control <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed">
//               Initialize the root administrative account. Ensure you have the physical security token before proceeding.
//             </p>
            
//             <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
//                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//                 <span className="text-xs text-blue-100 font-mono">System Status: Ready for Enrollment</span>
//             </div>
//           </div>

//           <div className="relative z-10 text-blue-400/40 text-[10px] font-medium">
//             © 2026 Secure Layer Inc. All rights reserved.
//           </div>
//         </div>

//         {/* RIGHT SIDE (Form) */}
//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
//           <div className="mb-10">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Enrollment</h2>
//             <p className="text-slate-500 text-sm mt-2">Create a new master administrator profile.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Name Field */}
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input 
//                   name="name" 
//                   value={formData.name} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="e.g. Hussain Ali" 
//                   required 
//                 />
//               </div>
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className={labelClass}>Work Email</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input 
//                   name="email" 
//                   type="email" 
//                   value={formData.email} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="admin@institute.edu" 
//                   required 
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* Secret Key */}
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input 
//                       name="secretKey" 
//                       type="password" 
//                       value={formData.secretKey} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="••••••" 
//                       required 
//                     />
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className={labelClass}>Phone Number</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input 
//                       name="phone" 
//                       value={formData.phone} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="03001234567" 
//                     />
//                   </div>
//                 </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className={labelClass}>Master Password <span className="text-slate-400 normal-case font-normal">(Max 7 chars)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type="password" 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="Set secure access key" 
//                   required 
//                 />
//               </div>
//               <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
//                  <div 
//                     className="bg-blue-600 h-full transition-all duration-300" 
//                     style={{ width: `${(formData.password.length / 7) * 100}%` }}
//                  ></div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:shadow-blue-900/30 active:scale-[0.98] transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
//               >
//                 {registerMutation.isPending ? (
//                     <span className="flex items-center justify-center gap-2">
//                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Configuring...
//                     </span>
//                 ) : "Create Master Admin"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import axios from "axios"; // ✅ Axios Added
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // --- SVGs for Professional Icons (Keeping Original) ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
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
// const ShieldIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const hasAccess = searchParams.get("admin") === ADMIN_ACCESS_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "admin",
//     secretKey: "",
//     phone: "",
//   });

//   // ✅ TanStack Mutation with Axios
//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const { data } = await axios.post(`/api/auth/register`, userData, {
//         params: { admin: ADMIN_ACCESS_KEY } // URL query params handled by Axios
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Admin Profile Created!", { position: "top-right" });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => router.push("/dashboard"), 1500);
//     },
//     onError: (err) => {
//       // Descriptive error handling with Axios
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message, { position: "top-right" });
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "password" && value.length > 7) return;
//     if (name === "phone") {
//       if (!/^\d*$/.test(value)) return; 
//       if (value.length > 11) return;
//     }
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password.length < 1) {
//       toast.warning("Password zaroori hai!");
//       return;
//     }
//     registerMutation.mutate(formData);
//   };

//   if (!hasAccess || !ADMIN_ACCESS_KEY) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m3.432-6.038a6.5 6.5 0 01-9.362 9.362M19.07 19.07a6.5 6.5 0 01-9.362-9.362m1.13-1.13A1 1 0 0113 7.5c2.28 0 4.136 1.855 4.136 4.136a1 1 0 01-1.13 1.13z"></path>
//             </svg>
//           </div>
//           <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Forbidden</h2>
//           <p className="text-slate-500 mt-3 text-sm font-medium leading-relaxed">
//             Security key mismatch. Please check your URL parameters or environment configuration.
//           </p>
//           <button 
//             onClick={() => router.push("/login")} 
//             className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const inputWrapperClass = "relative group";
//   const inputClass = "w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 font-semibold text-slate-700 placeholder:text-slate-400 transition-all text-sm cursor-text";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-900">
//       <ToastContainer stacked/>
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[750px] flex overflow-hidden border border-slate-100 relative">
        
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-2">
//                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
//                     <ShieldIcon /> 
//                 </div>
//                 <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">SMS Portal</h1>
//             </div>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em]">Core Infrastructure v2.0</p>
//           </div>

//           <div className="relative z-10 max-w-sm">
//             <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
//               Master Control <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed">
//               Initialize the root administrative account. Ensure you have the physical security token before proceeding.
//             </p>
            
//             <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
//                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//                 <span className="text-xs text-blue-100 font-mono">System Status: Ready for Enrollment</span>
//             </div>
//           </div>

//           <div className="relative z-10 text-blue-400/40 text-[10px] font-medium">
//             © 2026 Secure Layer Inc. All rights reserved.
//           </div>
//         </div>

//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
//           <div className="mb-10">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Enrollment</h2>
//             <p className="text-slate-500 text-sm mt-2">Create a new master administrator profile.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input 
//                   name="name" 
//                   value={formData.name} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="e.g. Hussain Ali" 
//                   required 
//                 />
//               </div>
//             </div>

//             <div>
//               <label className={labelClass}>Work Email</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input 
//                   name="email" 
//                   type="email" 
//                   value={formData.email} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="admin@institute.edu" 
//                   required 
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input 
//                       name="secretKey" 
//                       type="password" 
//                       value={formData.secretKey} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="••••••" 
//                       required 
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Phone Number</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input 
//                       name="phone" 
//                       value={formData.phone} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="03001234567" 
//                     />
//                   </div>
//                 </div>
//             </div>

//             <div>
//               <label className={labelClass}>Master Password <span className="text-slate-400 normal-case font-normal">(Max 7 chars)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type="password" 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="Set secure access key" 
//                   required 
//                 />
//               </div>
//               <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
//                  <div 
//                     className="bg-blue-600 h-full transition-all duration-300" 
//                     style={{ width: `${(formData.password.length / 7) * 100}%` }}
//                  ></div>
//               </div>
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:shadow-blue-900/30 active:scale-[0.98] transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
//               >
//                 {registerMutation.isPending ? (
//                     <span className="flex items-center justify-center gap-2">
//                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Configuring...
//                     </span>
//                 ) : "Create Master Admin"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
















// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import axios from "axios";
// // Boss: React Hot Toast ko add kar diya hai
// import { Toaster, toast } from "react-hot-toast";

// // --- SVGs for Professional Icons (Keeping Original) ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
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
// const ShieldIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const hasAccess = searchParams.get("admin") === ADMIN_ACCESS_KEY;

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "admin",
//     secretKey: "",
//     phone: "",
//   });

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const { data } = await axios.post(`/api/auth/register`, userData, {
//         params: { admin: ADMIN_ACCESS_KEY }
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       toast.success("Admin Profile Created Successfully!");
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setTimeout(() => router.push("/dashboard"), 1500);
//     },
//     onError: (err) => {
//       const message = err.response?.data?.message || "Registration Attempt Failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "password" && value.length > 7) return;
//     if (name === "phone") {
//       if (!/^\d*$/.test(value)) return; 
//       if (value.length > 11) return;
//     }
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password.length < 1) {
//       toast.error("Master Password is required for enrollment!");
//       return;
//     }
//     registerMutation.mutate(formData);
//   };

//   if (!hasAccess || !ADMIN_ACCESS_KEY) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
//         <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
//           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
//             <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m3.432-6.038a6.5 6.5 0 01-9.362 9.362M19.07 19.07a6.5 6.5 0 01-9.362-9.362m1.13-1.13A1 1 0 0113 7.5c2.28 0 4.136 1.855 4.136 4.136a1 1 0 01-1.13 1.13z"></path>
//             </svg>
//           </div>
//           <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Forbidden</h2>
//           <p className="text-slate-500 mt-3 text-sm font-medium leading-relaxed">
//             Security key mismatch. Please check your URL parameters or environment configuration.
//           </p>
//           <button 
//             onClick={() => router.push("/login")} 
//             className="mt-8 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const inputWrapperClass = "relative group";
//   const inputClass = "w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/5 font-semibold text-slate-700 placeholder:text-slate-400 transition-all text-sm cursor-text";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-900">
//       {/* Boss: Toaster component ko yahan place kiya hai */}
//       <Toaster position="top-right" reverseOrder={false} />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[750px] flex overflow-hidden border border-slate-100 relative">
        
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-2">
//                 <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
//                     <ShieldIcon /> 
//                 </div>
//                 <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">SMS Portal</h1>
//             </div>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em]">Core Infrastructure v2.0</p>
//           </div>

//           <div className="relative z-10 max-w-sm">
//             <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
//               Master Control <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed">
//               Initialize the root administrative account. Ensure you have the physical security token before proceeding.
//             </p>
            
//             <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
//                 <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//                 <span className="text-xs text-blue-100 font-mono">System Status: Ready for Enrollment</span>
//             </div>
//           </div>

//           <div className="relative z-10 text-blue-400/40 text-[10px] font-medium">
//             © 2026 Secure Layer Inc. All rights reserved.
//           </div>
//         </div>

//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
//           <div className="mb-10">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Enrollment</h2>
//             <p className="text-slate-500 text-sm mt-2">Create a new master administrator profile.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input 
//                   name="name" 
//                   value={formData.name} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="e.g. Hussain Ali" 
//                   required 
//                 />
//               </div>
//             </div>

//             <div>
//               <label className={labelClass}>Work Email</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input 
//                   name="email" 
//                   type="email" 
//                   value={formData.email} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="admin@institute.edu" 
//                   required 
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input 
//                       name="secretKey" 
//                       type="password" 
//                       value={formData.secretKey} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="••••••" 
//                       required 
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className={labelClass}>Phone Number</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input 
//                       name="phone" 
//                       value={formData.phone} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="03001234567" 
//                     />
//                   </div>
//                 </div>
//             </div>

//             <div>
//               <label className={labelClass}>Master Password <span className="text-slate-400 normal-case font-normal">(Max 7 chars)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type="password" 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="Set secure access key" 
//                   required 
//                 />
//               </div>
//               <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
//                  <div 
//                     className="bg-blue-600 h-full transition-all duration-300" 
//                     style={{ width: `${(formData.password.length / 7) * 100}%` }}
//                  ></div>
//               </div>
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-blue-800 hover:shadow-blue-900/30 active:scale-[0.98] transition-all cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
//               >
//                 {registerMutation.isPending ? (
//                     <span className="flex items-center justify-center gap-2">
//                         <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Configuring...
//                     </span>
//                 ) : "Create Master Admin"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LockIcon = () => (
//   <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
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

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const isAdminParamValid = searchParams.get("admin") === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "admin" : "teacher";

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole,
//     secretKey: "",
//     phone: "",
//   });

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, role: currentRole }));
//   }, [currentRole]);

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const { data } = await axios.post(`/api/auth/register`, userData, {
//         params: { admin: ADMIN_ACCESS_KEY } 
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (currentRole === "admin") {
//         toast.success("Admin Profile Created!", { position: "top-right" });
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setTimeout(() => router.push("/dashboard/admin/dashboard"), 1500);
//       } else {
//         toast.success("Teacher Application Submitted! Pending Approval.", { position: "top-right" });
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     },
//     borderColor: (err) => {
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message, { position: "top-right" });
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "password" && value.length > 8) return;
//     if (name === "phone" && !/^\d*$/.test(value)) return; 
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     registerMutation.mutate(formData);
//   };

//   const inputWrapperClass = "relative group";
//   const inputClass = "w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors";

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
//       <ToastContainer stacked />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
        
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="relative z-10">
//             <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management Enrollment</p>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">
//               {currentRole === 'admin' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//               {currentRole === 'teacher' 
//                 ? "Join our faculty. Fill in your details for administrative review and subject assignment." 
//                 : "Initialize the root administrator profile with master privileges."}
//             </p>
//           </div>
//           <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//         </div>

//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
//               {currentRole === "admin" ? "Admin Enrollment" : "Staff Enrollment"}
//             </h2>
//             <p className="text-slate-500 text-sm mt-1">
//               {currentRole === "admin" ? "Creating Root Admin User." : "Authorized faculty personnel only."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="Full Name" required />
//               </div>
//             </div>

//             <div>
//               <label className={labelClass}>Email Address</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="email@institute.edu" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input name="secretKey" type="password" value={formData.secretKey} className={inputClass} onChange={handleChange} placeholder="Key Code" required />
//                   </div>
//                 </div>
//                 <div>
//                   <label className={labelClass}>Phone Number</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" required />
//                   </div>
//                 </div>
//             </div>

//             <div>
//               <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Max 8 chars)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input name="password" type="password" value={formData.password} className={inputClass} onChange={handleChange} placeholder="••••••••" required />
//               </div>
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300"
//               >
//                 {registerMutation.isPending ? "Processing..." : `Register as ${currentRole}`}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }















// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// // --- Icons ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );
// const MailIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );
// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );
// const EyeIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );
// const EyeOffIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const isAdminParamValid = searchParams.get("admin") === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole,
//     secretKey: "",
//     phone: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, role: currentRole }));
//   }, [currentRole]);

//   // --- Password Strength Logic ---
//   const getPasswordStrength = (pass) => {
//     if (pass.length === 0) return 0;
//     if (pass.length < 4) return 1; // Weak (Red)
//     if (pass.length < 7) return 2; // Medium (Yellow)
//     return 3; // Strong (Green)
//   };

//   const strengthLevel = getPasswordStrength(formData.password);
  
//   const getStrengthColor = () => {
//     if (strengthLevel === 1) return "bg-red-500";
//     if (strengthLevel === 2) return "bg-yellow-500";
//     if (strengthLevel === 3) return "bg-green-500";
//     return "bg-slate-200";
//   };

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const { data } = await axios.post(`/api/auth/register`, userData, {
//         params: { admin: ADMIN_ACCESS_KEY } 
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (currentRole === "ADMIN") {
//         toast.success("Admin Profile Created!");
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setTimeout(() => router.push("/dashboard/admin/dashboard"), 1500);
//       } else {
//         toast.success("Application Submitted! Pending Approval.");
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     },
//     onError: (err) => {
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Limit Password to Max 8 Characters
//     if (name === "password" && value.length > 8) return;

//     // Limit Phone to Max 12 Digits
//     if (name === "phone") {
//       if (!/^\d*$/.test(value)) return; // Numbers only
//       if (value.length > 11) return;    // Max 12 chars
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Frontend Validations
//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters.");
//       return;
//     }
//     if (formData.phone.length < 10) {
//       toast.error("Please enter a valid phone number.");
//       return;
//     }

//     registerMutation.mutate(formData);
//   };

//   // --- UI Classes ---
//   const inputWrapperClass = "relative group cursor-pointer";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm placeholder:text-slate-400";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors";

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
//       <Toaster position="top-right" />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
        
//         {/* Left Side: Branding */}
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="relative z-10">
//             <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management Enrollment</p>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">
//               {currentRole === 'ADMIN' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//               {currentRole === 'TEACHER' 
//                 ? "Join our faculty. Fill in your details for administrative review." 
//                 : "Initialize the root administrator profile with master privileges."}
//             </p>
//           </div>
//           <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
//               {currentRole === "ADMIN" ? "Admin Enrollment" : "Staff Enrollment"}
//             </h2>
//             <p className="text-slate-500 text-sm mt-1">
//               {currentRole === "ADMIN" ? "Creating Root Admin User." : "Authorized faculty personnel only."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Name */}
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="FULL NAME" required />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className={labelClass}>Email Address</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="EMAIL@INSTITUTE.EDU" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* Secret Key */}
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input name="secretKey" type="password" value={formData.secretKey} className={inputClass} onChange={handleChange} placeholder="ACCESS KEY" required />
//                   </div>
//                 </div>
                
//                 {/* Phone */}
//                 <div>
//                   <label className={labelClass}>Phone Number <span className="text-slate-400 normal-case font-normal">(Max 12)</span></label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" required />
//                   </div>
//                 </div>
//             </div>

//             {/* Password with Strength Meter & Show/Hide */}
//             <div>
//               <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Max 8 chars)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                 />
//                 {/* Show/Hide Toggle */}
//                 <button 
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               {/* Password Strength Line */}
//               <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
//                   style={{ width: `${(strengthLevel / 3) * 100}%` }}
//                 ></div>
//               </div>
//               <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
//                 {strengthLevel === 0 && "Enter Password"}
//                 {strengthLevel === 1 && "Weak Password"}
//                 {strengthLevel === 2 && "Medium Password"}
//                 {strengthLevel === 3 && "Strong Password"}
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {registerMutation.isPending ? "Processing..." : `Register as ${currentRole}`}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }





















































// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// // --- Icons ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );
// const MailIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );
// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );
// const EyeIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );
// const EyeOffIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const adminQueryParam = searchParams.get("admin");
//   const isAdminParamValid = adminQueryParam === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

//   // Initial render trace logger
//   useEffect(() => {
//     console.log("⚙️ REGISTER PAGE MOUNTED");
//     console.log("🔗 URL SEARCH PARAM (?admin=):", adminQueryParam);
//     console.log("🔑 CONFIG MASTER KEY (NEXT_PUBLIC_ADMIN):", ADMIN_ACCESS_KEY);
//     console.log("🎯 COMPUTED SYSTEM ROLE DETERMINED:", currentRole);
//   }, [adminQueryParam, ADMIN_ACCESS_KEY, currentRole]);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole,
//     secretKey: "",
//     phone: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     console.log("🔄 SYNCING FORM STATE WITH DETECTED ROLE:", currentRole);
//     setFormData((prev) => ({ ...prev, role: currentRole }));
//   }, [currentRole]);

//   // --- Password Strength Logic ---
//   const getPasswordStrength = (pass) => {
//     if (pass.length === 0) return 0;
//     if (pass.length < 4) return 1;
//     if (pass.length < 7) return 2;
//     return 3; 
//   };

//   const strengthLevel = getPasswordStrength(formData.password);
  
//   const getStrengthColor = () => {
//     if (strengthLevel === 1) return "bg-red-500";
//     if (strengthLevel === 2) return "bg-yellow-500";
//     if (strengthLevel === 3) return "bg-green-500";
//     return "bg-slate-200";
//   };

//   // --- React Query Mutation Layer with deep diagnostic logs ---
//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       console.log("🚀 MUTATION DISPATCH TRIGGERED!");
//       console.log("📡 TARGET REST ENDPOINT: /api/auth/register");
//       console.log("📌 ROUTE PARAMS ATTACHED:", { admin: ADMIN_ACCESS_KEY });
//       console.log("📦 PAYLOAD RAW SENDING:", { ...userData, password: "●●●●●●●●" });

//       const { data } = await axios.post(`/api/auth/register`, userData, {
//         params: { admin: ADMIN_ACCESS_KEY } 
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       console.log("✅ MUTATION COMPLETION SUCCESSFUL! SERVER RESPONSE:", data);
//       if (currentRole === "ADMIN") {
//         toast.success("Admin Profile Created!");
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setTimeout(() => router.push("/dashboard/admin/dashboard"), 1500);
//       } else {
//         toast.success("Application Submitted! Pending Approval.");
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     },
//     onError: (err) => {
//       console.error("❌ MUTATION CAPTURED RUNTIME ERROR INTERCEPT:");
//       console.error("📄 STATUS CODE FROM SERVER:", err.response?.status);
//       console.error("💥 ERROR RESPONSE RESPONSE_DATA:", err.response?.data);
      
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "password" && value.length > 8) return;

//     if (name === "phone") {
//       if (!/^\d*$/.test(value)) return; 
//       if (value.length > 11) return;    
//     }

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("📥 SUBMIT BUTTON CLICKED. VALIDATING FRONTEND STATE CLAUSES...");

//     // Frontend Validations
//     if (formData.password.length < 6) {
//       console.warn("⚠️ FRONTEND INTERCEPT: Password is less than 6 characters.");
//       toast.error("Password must be at least 6 characters.");
//       return;
//     }
//     if (formData.phone.length < 10) {
//       console.warn("⚠️ FRONTEND INTERCEPT: Phone number is invalid length parameters.");
//       toast.error("Please enter a valid phone number.");
//       return;
//     }

//     // SANITIZATION FIX: Lowercase and trim role string before pushing to axios pipeline
//     const sanitizedPayload = {
//       ...formData,
//       role: formData.role.toLowerCase().trim()
//     };

//     console.log("🛡️ PAYLOAD SANITIZED & READY FOR TRANSMISSION:", { 
//       ...sanitizedPayload, 
//       password: "●●●●●●●●" 
//     });

//     registerMutation.mutate(sanitizedPayload);
//   };

//   // --- UI Classes ---
//   const inputWrapperClass = "relative group cursor-pointer";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm placeholder:text-slate-400";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors";

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
//       <Toaster position="top-right" />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
        
//         {/* Left Side: Branding */}
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
//           <div className="relative z-10">
//             <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management Enrollment</p>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">
//               {currentRole === 'ADMIN' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//               {currentRole === 'TEACHER' 
//                 ? "Join our faculty. Fill in your details for administrative review." 
//                 : "Initialize the root administrator profile with master privileges."}
//             </p>
//           </div>
//           <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
//               {currentRole === "ADMIN" ? "Admin Enrollment" : "Staff Enrollment"}
//             </h2>
//             <p className="text-slate-500 text-sm mt-1">
//               {currentRole === "ADMIN" ? "Creating Root Admin User." : "Authorized faculty personnel only."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Name */}
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="FULL NAME" required />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className={labelClass}>Email Address</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="EMAIL@INSTITUTE.EDU" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* Secret Key */}
//                 <div>
//                   <label className={labelClass}>Verification Code</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input name="secretKey" type="password" value={formData.secretKey} className={inputClass} onChange={handleChange} placeholder="ACCESS KEY" required />
//                   </div>
//                 </div>
                
//                 {/* Phone */}
//                 <div>
//                   <label className={labelClass}>Phone Number <span className="text-slate-400 normal-case font-normal">(Max 11)</span></label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" required />
//                   </div>
//                 </div>
//             </div>

//             {/* Password with Strength Meter & Show/Hide */}
//             <div>
//               <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Max 8 chars)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                 />
//                 {/* Show/Hide Toggle */}
//                 <button 
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               {/* Password Strength Line */}
//               <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
//                   style={{ width: `${(strengthLevel / 3) * 100}%` }}
//                 ></div>
//               </div>
//               <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
//                 {strengthLevel === 0 && "Enter Password"}
//                 {strengthLevel === 1 && "Weak Password"}
//                 {strengthLevel === 2 && "Medium Password"}
//                 {strengthLevel === 3 && "Strong Password"}
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {registerMutation.isPending ? "Processing..." : `Register as ${currentRole}`}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }






















// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";

// // --- Icons ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );
// const MailIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );
// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );
// const EyeIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );
// const EyeOffIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const adminQueryParam = searchParams.get("admin");
//   const isAdminParamValid = adminQueryParam === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

//   useEffect(() => {
//     console.log("⚙️ REGISTER PAGE MOUNTED");
//     console.log("🔗 URL SEARCH PARAM (?admin=):", adminQueryParam);
//     console.log("🎯 COMPUTED SYSTEM ROLE DETERMINED:", currentRole);
//   }, [adminQueryParam, currentRole]);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole.toLowerCase(),
//     secretKey: "",
//     phone: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, role: currentRole.toLowerCase() }));
//   }, [currentRole]);

//   // Password Strength Logic
//   const getPasswordStrength = (pass) => {
//     if (pass.length === 0) return 0;
//     if (pass.length < 4) return 1;
//     if (pass.length < 8) return 2;
//     return 3;
//   };

//   const strengthLevel = getPasswordStrength(formData.password);
  
//   const getStrengthColor = () => {
//     if (strengthLevel === 1) return "bg-red-500";
//     if (strengthLevel === 2) return "bg-yellow-500";
//     if (strengthLevel === 3) return "bg-green-500";
//     return "bg-slate-200";
//   };

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       console.log("📡 Sending registration request:", { ...userData, password: "●●●●●●●●" });
//       const { data } = await axios.post(`/api/auth/register`, userData, {
//         params: { admin: ADMIN_ACCESS_KEY } 
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       console.log("✅ Registration successful:", data);
//       if (currentRole === "ADMIN") {
//         toast.success("Admin Profile Created!");
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         setTimeout(() => router.push("/dashboard/admin"), 1500);
//       } else {
//         toast.success("Application Submitted! Pending Approval.");
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     },
//     onError: (err) => {
//       console.error("❌ Registration error:", err.response?.data);
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters.");
//       return;
//     }
    
//     if (formData.phone && formData.phone.length < 10) {
//       toast.error("Please enter a valid phone number (at least 10 digits).");
//       return;
//     }

//     registerMutation.mutate(formData);
//   };

//   const inputWrapperClass = "relative group cursor-pointer";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm placeholder:text-slate-400";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors";

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
//       <Toaster position="top-right" />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
        
//         {/* Left Side: Branding */}
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
//           <div className="relative z-10">
//             <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management Enrollment</p>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">
//               {currentRole === 'ADMIN' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//               {currentRole === 'TEACHER' 
//                 ? "Join our faculty. Fill in your details for administrative review." 
//                 : "Initialize the root administrator profile with master privileges."}
//             </p>
//           </div>
//           <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
//               {currentRole === "ADMIN" ? "Admin Enrollment" : "Staff Enrollment"}
//             </h2>
//             <p className="text-slate-500 text-sm mt-1">
//               {currentRole === "ADMIN" ? "Creating Root Admin User." : "Authorized faculty personnel only."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Name */}
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="FULL NAME" required />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className={labelClass}>Email Address</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="EMAIL@INSTITUTE.EDU" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* Secret Key / Verification Code */}
//                 <div>
//                   <label className={labelClass}>
//                     {currentRole === "ADMIN" ? "Staff Access Code" : "Teacher Verification Code"}
//                   </label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input 
//                       name="secretKey" 
//                       type="password" 
//                       value={formData.secretKey} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder={currentRole === "ADMIN" ? "STAFF ACCESS CODE" : "TEACHER CODE"} 
//                       required 
//                     />
//                   </div>
//                 </div>
                
//                 {/* Phone */}
//                 <div>
//                   <label className={labelClass}>Phone Number <span className="text-slate-400 normal-case font-normal">(Optional)</span></label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" />
//                   </div>
//                 </div>
//             </div>

//             {/* Password with Strength Meter */}
//             <div>
//               <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Min 6 characters)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                 />
//                 <button 
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               {/* Password Strength Line */}
//               <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
//                   style={{ width: `${(strengthLevel / 3) * 100}%` }}
//                 ></div>
//               </div>
//               <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
//                 {strengthLevel === 0 && "Enter Password"}
//                 {strengthLevel === 1 && "Weak Password"}
//                 {strengthLevel === 2 && "Medium Password"}
//                 {strengthLevel === 3 && "Strong Password"}
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {registerMutation.isPending ? "Processing..." : `Register as ${currentRole}`}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }













// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { X, UploadCloud } from "lucide-react";

// // --- Icons ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );
// const MailIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );
// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );
// const EyeIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );
// const EyeOffIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const adminQueryParam = searchParams.get("admin");
//   const isAdminParamValid = adminQueryParam === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole.toLowerCase(),
//     secretKey: "",
//     phone: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, role: currentRole.toLowerCase() }));
//   }, [currentRole]);

//   // Password Strength Logic
//   const getPasswordStrength = (pass) => {
//     if (pass.length === 0) return 0;
//     if (pass.length < 4) return 1;
//     if (pass.length < 8) return 2;
//     return 3;
//   };

//   const strengthLevel = getPasswordStrength(formData.password);
  
//   const getStrengthColor = () => {
//     if (strengthLevel === 1) return "bg-red-500";
//     if (strengthLevel === 2) return "bg-yellow-500";
//     if (strengthLevel === 3) return "bg-green-500";
//     return "bg-slate-200";
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

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const formDataObj = new FormData();
//       formDataObj.append("name", userData.name);
//       formDataObj.append("email", userData.email);
//       formDataObj.append("password", userData.password);
//       formDataObj.append("role", userData.role);
//       formDataObj.append("secretKey", userData.secretKey);
//       formDataObj.append("phone", userData.phone);
//       if (photoFile && currentRole === "TEACHER") {
//         formDataObj.append("photo", photoFile);
//       }
      
//       const { data } = await axios.post(`/api/auth/register`, formDataObj, {
//         params: { admin: ADMIN_ACCESS_KEY },
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (currentRole === "ADMIN") {
//         toast.success("Admin Profile Created!");
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         setTimeout(() => router.push("/dashboard/admin"), 1500);
//       } else {
//         toast.success("Application Submitted! Pending Approval.");
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     },
//     onError: (err) => {
//       console.error("❌ Registration error:", err.response?.data);
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters.");
//       return;
//     }
    
//     if (formData.phone && formData.phone.length < 10) {
//       toast.error("Please enter a valid phone number (at least 10 digits).");
//       return;
//     }

//     registerMutation.mutate(formData);
//   };

//   const inputWrapperClass = "relative group cursor-pointer";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm placeholder:text-slate-400";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors";

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
//       <Toaster position="top-right" />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
        
//         {/* Left Side: Branding */}
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
//           <div className="relative z-10">
//             <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management Enrollment</p>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">
//               {currentRole === 'ADMIN' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//               {currentRole === 'TEACHER' 
//                 ? "Join our faculty. Fill in your details for administrative review." 
//                 : "Initialize the root administrator profile with master privileges."}
//             </p>
//           </div>
//           <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//         </div>

//         {/* Right Side: Form */}
//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
//               {currentRole === "ADMIN" ? "Admin Enrollment" : "Staff Enrollment"}
//             </h2>
//             <p className="text-slate-500 text-sm mt-1">
//               {currentRole === "ADMIN" ? "Creating Root Admin User." : "Authorized faculty personnel only."}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Name */}
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="FULL NAME" required />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className={labelClass}>Email Address</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="EMAIL@INSTITUTE.EDU" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* Secret Key / Verification Code */}
//                 <div>
//                   <label className={labelClass}>
//                     {currentRole === "ADMIN" ? "Staff Access Code" : "Teacher Verification Code"}
//                   </label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input 
//                       name="secretKey" 
//                       type="password" 
//                       value={formData.secretKey} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder={currentRole === "ADMIN" ? "STAFF ACCESS CODE" : "TEACHER CODE"} 
//                       required 
//                     />
//                   </div>
//                 </div>
                
//                 {/* Phone */}
//                 <div>
//                   <label className={labelClass}>Phone Number <span className="text-slate-400 normal-case font-normal">(Optional)</span></label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" />
//                   </div>
//                 </div>
//             </div>

//             {/* ✅ Photo Upload - ONLY FOR TEACHER */}
//             {currentRole === "TEACHER" && (
//               <div>
//                 <label className={labelClass}>Profile Photo <span className="text-blue-600">(Recommended for ID Card)</span></label>
//                 <div className="flex items-center gap-4">
//                   {photoPreview ? (
//                     <div className="relative">
//                       <img src={photoPreview} className="w-20 h-24 rounded-lg object-cover border-2 border-blue-500" />
//                       <button 
//                         type="button"
//                         onClick={removePhoto}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                       >
//                         <X size={12} />
//                       </button>
//                     </div>
//                   ) : (
//                     <label className="cursor-pointer">
//                       <div className="w-20 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
//                         <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
//                         <span className="text-[9px] text-gray-400 mt-1 group-hover:text-blue-500 transition">Upload</span>
//                       </div>
//                       <input 
//                         type="file" 
//                         accept="image/*" 
//                         className="hidden" 
//                         onChange={handlePhotoChange}
//                       />
//                     </label>
//                   )}
//                   <p className="text-[10px] text-gray-400 max-w-[200px]">
//                     Passport-size photo for ID card (Max 2MB)
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Password */}
//             <div>
//               <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Min 6 characters)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                 />
//                 <button 
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               {/* Password Strength Line */}
//               <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
//                   style={{ width: `${(strengthLevel / 3) * 100}%` }}
//                 ></div>
//               </div>
//               <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
//                 {strengthLevel === 0 && "Enter Password"}
//                 {strengthLevel === 1 && "Weak Password"}
//                 {strengthLevel === 2 && "Medium Password"}
//                 {strengthLevel === 3 && "Strong Password"}
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {registerMutation.isPending ? "Processing..." : `Register as ${currentRole}`}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

































































// // app/register/page.jsx

// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { X, UploadCloud } from "lucide-react";

// // --- Icons ---
// const LockIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//   </svg>
// );
// const UserIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );
// const MailIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//   </svg>
// );
// const PhoneIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//   </svg>
// );
// const EyeIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );
// const EyeOffIcon = () => (
//   <svg className="w-5 h-5 text-slate-400 hover:text-blue-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//   </svg>
// );
// const SchoolIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//   </svg>
// );
// const DepartmentIcon = () => (
//   <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//   </svg>
// );

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const adminQueryParam = searchParams.get("admin");
//   const isAdminParamValid = adminQueryParam === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
  
//   // 🆕 Form Data with Teaching Level & Department
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole.toLowerCase(),
//     secretKey: "",
//     phone: "",
//     teachingLevel: "", // 🆕 junior, middle, senior
//     department: "General", // 🆕 Auto-set for non-senior
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, role: currentRole.toLowerCase() }));
//   }, [currentRole]);

//   // 🆕 CONDITION: Department sirf tab show karo jab:
//   // 1. Role = TEACHER
//   // 2. teachingLevel = 'senior'
//   const showDepartment = currentRole === "TEACHER" && formData.teachingLevel === "senior";

//   // Password Strength Logic
//   const getPasswordStrength = (pass) => {
//     if (pass.length === 0) return 0;
//     if (pass.length < 4) return 1;
//     if (pass.length < 8) return 2;
//     return 3;
//   };

//   const strengthLevel = getPasswordStrength(formData.password);
  
//   const getStrengthColor = () => {
//     if (strengthLevel === 1) return "bg-red-500";
//     if (strengthLevel === 2) return "bg-yellow-500";
//     if (strengthLevel === 3) return "bg-green-500";
//     return "bg-slate-200";
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

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const formDataObj = new FormData();
//       formDataObj.append("name", userData.name);
//       formDataObj.append("email", userData.email);
//       formDataObj.append("password", userData.password);
//       formDataObj.append("role", userData.role);
//       formDataObj.append("secretKey", userData.secretKey);
//       formDataObj.append("phone", userData.phone);
      
//       // 🆕 TEACHER SPECIFIC FIELDS
//       if (currentRole === "TEACHER") {
//         formDataObj.append("teachingLevel", userData.teachingLevel);
//         formDataObj.append("department", userData.department);
//       }
      
//       if (photoFile && currentRole === "TEACHER") {
//         formDataObj.append("photo", photoFile);
//       }
      
//       const { data } = await axios.post(`/api/auth/register`, formDataObj, {
//         params: { admin: ADMIN_ACCESS_KEY },
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (currentRole === "ADMIN") {
//         toast.success("Admin Profile Created!");
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("userRole", data.user.role);
//         localStorage.setItem("userId", data.user.id);
//         localStorage.setItem("userName", data.user.name);
//         setTimeout(() => router.push("/dashboard/admin"), 1500);
//       } else {
//         toast.success("Application Submitted! Pending Approval.");
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     },
//     onError: (err) => {
//       console.error("❌ Registration error:", err.response?.data);
//       const message = err.response?.data?.message || "Registration Failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
    
//     // 🆕 Auto-set department if teaching level is not senior
//     if (name === 'teachingLevel' && value !== 'senior') {
//       setFormData(prev => ({ ...prev, department: 'General' }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // 🆕 Validation for Teacher
//     if (currentRole === "TEACHER") {
//       if (!formData.teachingLevel) {
//         toast.error("Please select your teaching level.");
//         return;
//       }
//     }

//     if (formData.password.length < 6) {
//       toast.error("Password must be at least 6 characters.");
//       return;
//     }
    
//     if (formData.phone && formData.phone.length < 10) {
//       toast.error("Please enter a valid phone number (at least 10 digits).");
//       return;
//     }

//     registerMutation.mutate(formData);
//   };

//   const inputWrapperClass = "relative group cursor-pointer";
//   const inputClass = "w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm placeholder:text-slate-400";
//   const selectClass = "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-900/10 font-semibold text-slate-700 transition-all text-sm appearance-none";
//   const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block";
//   const iconPosition = "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors";

//   // ============================================================
//   // TEACHER REGISTRATION FORM (with Conditional Department)
//   // ============================================================
//   if (currentRole === "TEACHER") {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
//         <Toaster position="top-right" />
        
//         <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
          
//           {/* Left Side: Branding */}
//           <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
//             <div className="relative z-10">
//               <h1 className="text-2xl font-black text-white tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//               <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Staff Enrollment</p>
//             </div>
//             <div className="relative z-10">
//               <h2 className="text-5xl font-extrabold text-white leading-tight">
//                 Join Faculty <span className="text-blue-400">.</span>
//               </h2>
//               <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//                 Fill in your details for administrative review and approval.
//               </p>
//               <div className="mt-6 space-y-2 text-blue-300/60 text-xs">
//                 <p>📚 Junior: Montessori - Class 5</p>
//                 <p>📖 Middle: Class 6 - 8</p>
//                 <p>🎓 Senior: Class 9 - 10 (Matric)</p>
//               </div>
//             </div>
//             <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//           </div>

//           {/* Right Side: Teacher Form */}
//           <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
            
//             <div className="mb-8">
//               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
//                 Staff Enrollment
//               </h2>
//               <p className="text-slate-500 text-sm mt-1">
//                 Authorized faculty personnel only.
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
              
//               {/* Name */}
//               <div>
//                 <label className={labelClass}>Full Name *</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><UserIcon /></div>
//                   <input 
//                     name="name" 
//                     value={formData.name} 
//                     className={inputClass} 
//                     onChange={handleChange} 
//                     placeholder="FULL NAME" 
//                     required 
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className={labelClass}>Email Address *</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><MailIcon /></div>
//                   <input 
//                     name="email" 
//                     type="email" 
//                     value={formData.email} 
//                     className={inputClass} 
//                     onChange={handleChange} 
//                     placeholder="EMAIL@INSTITUTE.EDU" 
//                     required 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {/* Secret Key */}
//                 <div>
//                   <label className={labelClass}>Teacher Verification Code *</label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><LockIcon /></div>
//                     <input 
//                       name="secretKey" 
//                       type="password" 
//                       value={formData.secretKey} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="TEACHER CODE" 
//                       required 
//                     />
//                   </div>
//                 </div>
                
//                 {/* Phone */}
//                 <div>
//                   <label className={labelClass}>Phone Number <span className="text-slate-400 normal-case font-normal">(Optional)</span></label>
//                   <div className={inputWrapperClass}>
//                     <div className={iconPosition}><PhoneIcon /></div>
//                     <input 
//                       name="phone" 
//                       value={formData.phone} 
//                       className={inputClass} 
//                       onChange={handleChange} 
//                       placeholder="03XXXXXXXXX" 
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* 🆕 TEACHING LEVEL */}
//               <div>
//                 <label className={labelClass}>Teaching Level *</label>
//                 <div className="relative group">
//                   <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors z-10">
//                     <SchoolIcon />
//                   </div>
//                   <select
//                     name="teachingLevel"
//                     value={formData.teachingLevel}
//                     onChange={handleChange}
//                     className={selectClass}
//                     required
//                   >
//                     <option value="">SELECT TEACHING LEVEL</option>
//                     <option value="junior">👶 Junior (Montessori - Class 5)</option>
//                     <option value="middle">📚 Middle (Class 6 - 8)</option>
//                     <option value="senior">🎓 Senior (Class 9 - 10 / Matric)</option>
//                   </select>
//                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//                     <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </div>
//                 </div>
//                 <p className="text-[10px] text-slate-400 mt-1 ml-1">
//                   {formData.teachingLevel === 'junior' && '👶 You will teach Montessori to Class 5 students'}
//                   {formData.teachingLevel === 'middle' && '📖 You will teach Class 6 to 8 students'}
//                   {formData.teachingLevel === 'senior' && '🎓 You will teach Class 9-10 (Matric) students'}
//                   {!formData.teachingLevel && 'Select your teaching level to continue'}
//                 </p>
//               </div>

//               {/* 🆕 DEPARTMENT - CONDITIONAL (Only for Senior) */}
//               {showDepartment && (
//                 <div className="animate-fadeIn">
//                   <label className={labelClass}>
//                     Department *
//                     <span className="text-blue-600 text-[8px] ml-2 normal-case font-normal">
//                       (Required for Senior Teachers)
//                     </span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-blue-900 transition-colors z-10">
//                       <DepartmentIcon />
//                     </div>
//                     <select
//                       name="department"
//                       value={formData.department}
//                       onChange={handleChange}
//                       className={selectClass}
//                       required={showDepartment}
//                     >
//                       <option value="">SELECT DEPARTMENT</option>
//                       <option value="Science">🔬 Science</option>
//                       <option value="Arts">🎨 Arts</option>
//                       <option value="Computer">💻 Computer</option>
//                       <option value="General">📋 General</option>
//                     </select>
//                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                   <p className="text-[10px] text-blue-600 mt-1 ml-1">
//                     💡 Senior teachers must select their specialization department.
//                   </p>
//                 </div>
//               )}

//               {/* Photo Upload */}
//               <div>
//                 <label className={labelClass}>Profile Photo <span className="text-blue-600">(Recommended for ID Card)</span></label>
//                 <div className="flex items-center gap-4">
//                   {photoPreview ? (
//                     <div className="relative">
//                       <img src={photoPreview} className="w-20 h-24 rounded-lg object-cover border-2 border-blue-500" />
//                       <button 
//                         type="button"
//                         onClick={removePhoto}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
//                       >
//                         <X size={12} />
//                       </button>
//                     </div>
//                   ) : (
//                     <label className="cursor-pointer">
//                       <div className="w-20 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
//                         <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
//                         <span className="text-[9px] text-gray-400 mt-1 group-hover:text-blue-500 transition">Upload</span>
//                       </div>
//                       <input 
//                         type="file" 
//                         accept="image/*" 
//                         className="hidden" 
//                         onChange={handlePhotoChange}
//                       />
//                     </label>
//                   )}
//                   <p className="text-[10px] text-gray-400 max-w-[200px]">
//                     Passport-size photo for ID card (Max 2MB)
//                   </p>
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Min 6 characters)</span></label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><LockIcon /></div>
//                   <input 
//                     name="password" 
//                     type={showPassword ? "text" : "password"} 
//                     value={formData.password} 
//                     className={inputClass} 
//                     onChange={handleChange} 
//                     placeholder="••••••••" 
//                     required 
//                   />
//                   <button 
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
//                   >
//                     {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                   </button>
//                 </div>
                
//                 {/* Password Strength Line */}
//                 <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
//                     style={{ width: `${(strengthLevel / 3) * 100}%` }}
//                   ></div>
//                 </div>
//                 <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
//                   {strengthLevel === 0 && "Enter Password"}
//                   {strengthLevel === 1 && "Weak Password"}
//                   {strengthLevel === 2 && "Medium Password"}
//                   {strengthLevel === 3 && "Strong Password"}
//                 </p>
//               </div>

//               {/* Submit Button */}
//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={registerMutation.isPending}
//                   className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
//                 >
//                   {registerMutation.isPending ? "Processing..." : "Register as Teacher"}
//                 </button>
//                 <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                   Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//                 </p>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // ADMIN REGISTRATION FORM (Same as before)
//   // ============================================================
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 font-sans">
//       <Toaster position="top-right" />
      
//       <div className="bg-white shadow-2xl rounded-[2.5rem] w-full max-w-6xl min-h-[700px] flex overflow-hidden border border-slate-100">
        
//         {/* Left Side: Branding */}
//         <div className="flex-1 bg-blue-950 p-12 md:p-16 flex flex-col justify-between hidden md:flex relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
//           <div className="relative z-10">
//             <h1 className="text-2xl font-black text-white tracking-tighter uppercase tracking-widest">SMS Portal</h1>
//             <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management Enrollment</p>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl font-extrabold text-white leading-tight">
//               Master Access <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 mt-6 text-sm font-medium leading-relaxed max-w-xs">
//               Initialize the root administrator profile with master privileges.
//             </p>
//           </div>
//           <div className="relative z-10 text-blue-400/40 text-[10px] font-bold uppercase">© 2026 Secure Layer</div>
//         </div>

//         {/* Right Side: Admin Form */}
//         <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white">
          
//           <div className="mb-8">
//             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
//               Admin Enrollment
//             </h2>
//             <p className="text-slate-500 text-sm mt-1">
//               Creating Root Admin User.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
            
//             {/* Name */}
//             <div>
//               <label className={labelClass}>Full Name</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><UserIcon /></div>
//                 <input name="name" value={formData.name} className={inputClass} onChange={handleChange} placeholder="FULL NAME" required />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className={labelClass}>Email Address</label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><MailIcon /></div>
//                 <input name="email" type="email" value={formData.email} className={inputClass} onChange={handleChange} placeholder="EMAIL@INSTITUTE.EDU" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               {/* Secret Key */}
//               <div>
//                 <label className={labelClass}>Staff Access Code</label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><LockIcon /></div>
//                   <input 
//                     name="secretKey" 
//                     type="password" 
//                     value={formData.secretKey} 
//                     className={inputClass} 
//                     onChange={handleChange} 
//                     placeholder="STAFF ACCESS CODE" 
//                     required 
//                   />
//                 </div>
//               </div>
              
//               {/* Phone */}
//               <div>
//                 <label className={labelClass}>Phone Number <span className="text-slate-400 normal-case font-normal">(Optional)</span></label>
//                 <div className={inputWrapperClass}>
//                   <div className={iconPosition}><PhoneIcon /></div>
//                   <input name="phone" value={formData.phone} className={inputClass} onChange={handleChange} placeholder="03XXXXXXXXX" />
//                 </div>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className={labelClass}>Password <span className="text-slate-400 normal-case font-normal">(Min 6 characters)</span></label>
//               <div className={inputWrapperClass}>
//                 <div className={iconPosition}><LockIcon /></div>
//                 <input 
//                   name="password" 
//                   type={showPassword ? "text" : "password"} 
//                   value={formData.password} 
//                   className={inputClass} 
//                   onChange={handleChange} 
//                   placeholder="••••••••" 
//                   required 
//                 />
//                 <button 
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
              
//               {/* Password Strength Line */}
//               <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full transition-all duration-300 ease-out ${getStrengthColor()}`} 
//                   style={{ width: `${(strengthLevel / 3) * 100}%` }}
//                 ></div>
//               </div>
//               <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
//                 {strengthLevel === 0 && "Enter Password"}
//                 {strengthLevel === 1 && "Weak Password"}
//                 {strengthLevel === 2 && "Medium Password"}
//                 {strengthLevel === 3 && "Strong Password"}
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={registerMutation.isPending}
//                 className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
//               >
//                 {registerMutation.isPending ? "Processing..." : "Register as Admin"}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }




























// "use client";

// import { useMutation } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { X, UploadCloud, Eye, EyeOff, User, Mail, Phone, GraduationCap, Lock, Shield, Camera } from "lucide-react";

// export default function RegisterPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
//   const adminQueryParam = searchParams.get("admin");
//   const isAdminParamValid = adminQueryParam === ADMIN_ACCESS_KEY;
//   const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

//   const [photoFile, setPhotoFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: currentRole.toLowerCase(),
//     secretKey: "",
//     phone: "",
//     qualification: ""
//   });

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, role: currentRole.toLowerCase() }));
//   }, [currentRole]);

//   // Password Strength
//   const getPasswordStrength = (pass) => {
//     if (pass.length === 0) return 0;
//     if (pass.length < 4) return 1;
//     if (pass.length < 8) return 2;
//     return 3;
//   };

//   const strengthLevel = getPasswordStrength(formData.password);
//   const strengthColors = ["bg-gray-200", "bg-red-500", "bg-yellow-500", "bg-green-500"];
//   const strengthLabels = ["", "Weak", "Medium", "Strong"];

//   // Real-time validation
//   const validateField = (name, value) => {
//     const newErrors = { ...errors };
    
//     switch (name) {
//       case "name":
//         if (!value.trim()) newErrors.name = "Name is required";
//         else if (value.trim().length < 3) newErrors.name = "At least 3 characters";
//         else delete newErrors.name;
//         break;
//       case "email":
//         if (!value.trim()) newErrors.email = "Email is required";
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = "Invalid email format";
//         else delete newErrors.email;
//         break;
//       case "password":
//         if (!value) newErrors.password = "Password is required";
//         else if (value.length < 6) newErrors.password = "At least 6 characters";
//         else delete newErrors.password;
//         break;
//       case "secretKey":
//         if (!value.trim()) newErrors.secretKey = "Access code is required";
//         else delete newErrors.secretKey;
//         break;
//       case "phone":
//         if (value && value.replace(/\s/g, '').length < 10) newErrors.phone = "At least 10 digits";
//         else delete newErrors.phone;
//         break;
//     }
    
//     setErrors(newErrors);
//   };

//   // ✅ Updated: 4MB photo limit
//   const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // ✅ Check file size (4MB)
//       if (file.size > MAX_PHOTO_SIZE) {
//         toast.error("Photo size should be less than 4MB");
//         return;
//       }
//       // Check file type
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

//   const registerMutation = useMutation({
//     mutationFn: async (userData) => {
//       const formDataObj = new FormData();
//       formDataObj.append("name", userData.name);
//       formDataObj.append("email", userData.email);
//       formDataObj.append("password", userData.password);
//       formDataObj.append("role", userData.role);
//       formDataObj.append("secretKey", userData.secretKey);
//       formDataObj.append("phone", userData.phone || "");
//       if (currentRole === "TEACHER") {
//         formDataObj.append("qualification", userData.qualification || "");
//       }
//       // ✅ Photo for both admin and teacher
//       if (photoFile) {
//         formDataObj.append("photo", photoFile);
//       }
      
//       const { data } = await axios.post(`/api/auth/register`, formDataObj, {
//         params: { admin: ADMIN_ACCESS_KEY },
//         headers: { "Content-Type": "multipart/form-data" }
//       });
//       return data;
//     },
//     onSuccess: (data) => {
//       if (currentRole === "ADMIN") {
//         toast.success(data.message || "Admin account created! Please login.");
//       } else {
//         toast.success(data.message || "Application submitted! Waiting for approval.");
//       }
//       // Reset form
//       setFormData({ name: "", email: "", password: "", role: currentRole.toLowerCase(), secretKey: "", phone: "", qualification: "" });
//       setPhotoFile(null);
//       setPhotoPreview(null);
//       setErrors({});
//       // Redirect to login
//       setTimeout(() => router.push("/login"), 2000);
//     },
//     onError: (err) => {
//       const message = err.response?.data?.message || "Registration failed";
//       toast.error(message);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // Limits
//     if (name === "name" && value.length > 50) return;
//     if (name === "email" && value.length > 60) return;
//     if (name === "password" && value.length > 30) return;
//     if (name === "secretKey" && value.length > 20) return;
//     if (name === "phone") {
//       const cleaned = value.replace(/[^0-9\s+]/g, '');
//       if (cleaned.replace(/\s/g, '').length > 11) return;
//       setFormData((prev) => ({ ...prev, [name]: cleaned }));
//       validateField(name, cleaned);
//       return;
//     }
//     if (name === "qualification" && value.length > 60) return;
    
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     validateField(name, value);
//   };

//   const handleBlur = (e) => {
//     validateField(e.target.name, e.target.value);
//   };

//   const validateAll = () => {
//     const newErrors = {};
//     if (!formData.name.trim() || formData.name.trim().length < 3) newErrors.name = "Valid name required";
//     if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required";
//     if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 characters";
//     if (!formData.secretKey.trim()) newErrors.secretKey = "Access code required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateAll()) {
//       toast.error("Please fix the errors before submitting");
//       return;
//     }
//     registerMutation.mutate(formData);
//   };

//   const labelClass = "text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2 block";
//   const inputClass = "w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all text-gray-700 text-sm placeholder:text-gray-400";
//   const inputErrorClass = "w-full pl-12 pr-4 py-3.5 bg-red-50 border border-red-300 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all text-gray-700 text-sm";
//   const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-sans">
//       <Toaster position="top-right" />
      
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
//             <h2 className="text-3xl font-bold leading-tight">
//               {currentRole === 'ADMIN' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
//             </h2>
//             <p className="text-blue-200/80 text-sm mt-4 leading-relaxed">
//               {currentRole === 'TEACHER' 
//                 ? "Join our faculty. Fill in your details for administrative review." 
//                 : "Initialize the root administrator profile with master privileges."}
//             </p>
//           </div>
          
//           <div className="relative z-10 mt-8">
//             <div className="flex items-center gap-2 text-blue-200/60 text-xs">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//               <span>Secure Registration Portal</span>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Form */}
//         <div className="md:w-[62%] p-6 md:p-8 lg:p-10 bg-white">
//           <div className="mb-6">
//             <h3 className="text-2xl font-bold text-gray-800">
//               {currentRole === "ADMIN" ? "Admin Enrollment" : "Staff Enrollment"}
//             </h3>
//             <p className="text-gray-500 text-xs mt-1">
//               {currentRole === "ADMIN" ? "Creating Root Admin User" : "Authorized faculty personnel only"}
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
//             {/* Name */}
//             <div>
//               <label className={labelClass}>Full Name *</label>
//               <div className="relative group">
//                 <User className={`${iconClass} w-4 h-4 ${errors.name ? 'text-red-400' : ''}`} />
//                 <input name="name" type="text" value={formData.name} onChange={handleChange} onBlur={handleBlur}
//                   className={errors.name ? inputErrorClass : inputClass} placeholder="FULL NAME" maxLength={50} required />
//               </div>
//               <div className="flex justify-between mt-1">
//                 {errors.name ? <p className="text-[11px] text-red-500">{errors.name}</p> : <span></span>}
//                 <p className="text-[10px] text-gray-400">{formData.name.length}/50</p>
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className={labelClass}>Email Address *</label>
//               <div className="relative group">
//                 <Mail className={`${iconClass} w-4 h-4 ${errors.email ? 'text-red-400' : ''}`} />
//                 <input name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
//                   className={errors.email ? inputErrorClass : inputClass} placeholder="EMAIL@INSTITUTE.EDU" maxLength={60} required />
//               </div>
//               <div className="flex justify-between mt-1">
//                 {errors.email ? <p className="text-[11px] text-red-500">{errors.email}</p> : <p className="text-[10px] text-blue-500">✓ Login OTP will be sent here</p>}
//                 <p className="text-[10px] text-gray-400">{formData.email.length}/60</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Secret Key */}
//               <div>
//                 <label className={labelClass}>{currentRole === "ADMIN" ? "Staff Access Code *" : "Teacher Verification Code *"}</label>
//                 <div className="relative group">
//                   <Shield className={`${iconClass} w-4 h-4 ${errors.secretKey ? 'text-red-400' : ''}`} />
//                   <input name="secretKey" type="text" value={formData.secretKey} onChange={handleChange} onBlur={handleBlur}
//                     className={errors.secretKey ? inputErrorClass : inputClass} placeholder={currentRole === "ADMIN" ? "STAFF ACCESS CODE" : "TEACHER CODE"} maxLength={20} required />
//                 </div>
//                 <div className="flex justify-between mt-1">
//                   {errors.secretKey ? <p className="text-[11px] text-red-500">{errors.secretKey}</p> : <span></span>}
//                   <p className="text-[10px] text-gray-400">{formData.secretKey.length}/20</p>
//                 </div>
//               </div>
              
//               {/* Phone */}
//               <div>
//                 <label className={labelClass}>Phone Number <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
//                 <div className="relative group">
//                   <Phone className={`${iconClass} w-4 h-4 ${errors.phone ? 'text-red-400' : ''}`} />
//                   <input name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
//                     className={errors.phone ? inputErrorClass : inputClass} placeholder="03XXXXXXXXX" maxLength={11} />
//                 </div>
//                 <div className="flex justify-between mt-1">
//                   {errors.phone ? <p className="text-[11px] text-red-500">{errors.phone}</p> : <span></span>}
//                   <p className="text-[10px] text-gray-400">{formData.phone.replace(/\s/g, '').length}/11</p>
//                 </div>
//               </div>
//             </div>

//             {/* Qualification - Only for Teacher */}
//             {currentRole === "TEACHER" && (
//               <div>
//                 <label className={labelClass}>Qualification <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
//                 <div className="relative group">
//                   <GraduationCap className={`${iconClass} w-4 h-4`} />
//                   <input name="qualification" type="text" value={formData.qualification} onChange={handleChange}
//                     className={inputClass} placeholder="e.g., MSc, BEd" maxLength={60} />
//                 </div>
//                 <p className="text-[10px] text-gray-400 text-right mt-1">{formData.qualification.length}/60</p>
//               </div>
//             )}

//             {/* ✅ Photo Upload - For Both Admin & Teacher (4MB) */}
//             <div>
//               <label className={labelClass}>
//                 <Camera size={12} className="inline mr-1" />
//                 Profile Photo <span className="text-gray-400 normal-case font-normal">(Optional)</span>
//               </label>
//               <div className="flex items-center gap-4 flex-wrap">
//                 {photoPreview ? (
//                   <div className="relative">
//                     <img src={photoPreview} className="w-20 h-24 rounded-lg object-cover border-2 border-blue-500 shadow-sm" />
//                     <button type="button" onClick={removePhoto}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md cursor-pointer">
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="cursor-pointer">
//                     <div className="w-20 h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
//                       <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
//                       <span className="text-[9px] text-gray-400 mt-1 group-hover:text-blue-500 transition">Upload</span>
//                     </div>
//                     <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
//                   </label>
//                 )}
//                 <p className="text-[10px] text-gray-400 max-w-[200px]">
//                   {currentRole === "TEACHER" ? "Passport-size photo for ID card" : "Profile photo"} (Max 4MB)
//                 </p>
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className={labelClass}>Password <span className="text-gray-400 normal-case font-normal">(Min 6 characters)</span></label>
//               <div className="relative group">
//                 <Lock className={`${iconClass} w-4 h-4 ${errors.password ? 'text-red-400' : ''}`} />
//                 <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} onBlur={handleBlur}
//                   className={errors.password ? inputErrorClass : inputClass} placeholder="••••••••" maxLength={30} required />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none">
//                   {showPassword ? <Eye size={18} className="text-gray-400 hover:text-gray-600" /> : <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />}
//                 </button>
//               </div>
              
//               {/* Password Strength */}
//               <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
//                 <div className={`h-full transition-all duration-300 ${strengthColors[strengthLevel]}`} 
//                   style={{ width: `${(strengthLevel / 3) * 100}%` }} />
//               </div>
//               <div className="flex justify-between mt-1">
//                 <p className={`text-[10px] uppercase font-bold tracking-wider ${
//                   strengthLevel === 0 ? 'text-gray-400' : strengthLevel === 1 ? 'text-red-500' : strengthLevel === 2 ? 'text-yellow-500' : 'text-green-500'
//                 }`}>{strengthLabels[strengthLevel] || "Enter Password"}</p>
//                 <p className="text-[10px] text-gray-400">{formData.password.length}/30</p>
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="pt-4">
//               <button type="submit" disabled={registerMutation.isPending}
//                 className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer">
//                 {registerMutation.isPending ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Processing...</span>
//                   </div>
//                 ) : `Register as ${currentRole}`}
//               </button>
//               <p className="text-center mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
//                 Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { X, UploadCloud, Eye, EyeOff, User, Mail, Phone, GraduationCap, Lock, Shield, Camera } from "lucide-react";

// ==================== MAIN COMPONENT WITH SUSPENSE ====================
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading registration form...</p>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}

// ==================== ACTUAL REGISTER CONTENT ====================
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ADMIN_ACCESS_KEY = process.env.NEXT_PUBLIC_ADMIN; 
  const adminQueryParam = searchParams.get("admin");
  const isAdminParamValid = adminQueryParam === ADMIN_ACCESS_KEY;
  const currentRole = isAdminParamValid ? "ADMIN" : "TEACHER";

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: currentRole.toLowerCase(),
    secretKey: "",
    phone: "",
    qualification: ""
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: currentRole.toLowerCase() }));
  }, [currentRole]);

  // Password Strength
  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return 0;
    if (pass.length < 4) return 1;
    if (pass.length < 8) return 2;
    return 3;
  };

  const strengthLevel = getPasswordStrength(formData.password);
  const strengthColors = ["bg-gray-200", "bg-red-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["", "Weak", "Medium", "Strong"];

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case "name":
        if (!value.trim()) newErrors.name = "Name is required";
        else if (value.trim().length < 3) newErrors.name = "At least 3 characters";
        else delete newErrors.name;
        break;
      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = "Invalid email format";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (value.length < 6) newErrors.password = "At least 6 characters";
        else delete newErrors.password;
        break;
      case "secretKey":
        if (!value.trim()) newErrors.secretKey = "Access code is required";
        else delete newErrors.secretKey;
        break;
      case "phone":
        if (value && value.replace(/\s/g, '').length < 10) newErrors.phone = "At least 10 digits";
        else delete newErrors.phone;
        break;
    }
    
    setErrors(newErrors);
  };

  // 4MB photo limit
  const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_PHOTO_SIZE) {
        toast.error("Photo size should be less than 4MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
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
  };

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const formDataObj = new FormData();
      formDataObj.append("name", userData.name);
      formDataObj.append("email", userData.email);
      formDataObj.append("password", userData.password);
      formDataObj.append("role", userData.role);
      formDataObj.append("secretKey", userData.secretKey);
      formDataObj.append("phone", userData.phone || "");
      if (currentRole === "TEACHER") {
        formDataObj.append("qualification", userData.qualification || "");
      }
      if (photoFile) {
        formDataObj.append("photo", photoFile);
      }
      
      const { data } = await axios.post(`/api/auth/register`, formDataObj, {
        params: { admin: ADMIN_ACCESS_KEY },
        headers: { "Content-Type": "multipart/form-data" }
      });
      return data;
    },
    onSuccess: (data) => {
      if (currentRole === "ADMIN") {
        toast.success(data.message || "Admin account created! Please login.");
      } else {
        toast.success(data.message || "Application submitted! Waiting for approval.");
      }
      setFormData({ name: "", email: "", password: "", role: currentRole.toLowerCase(), secretKey: "", phone: "", qualification: "" });
      setPhotoFile(null);
      setPhotoPreview(null);
      setErrors({});
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "name" && value.length > 50) return;
    if (name === "email" && value.length > 60) return;
    if (name === "password" && value.length > 30) return;
    if (name === "secretKey" && value.length > 20) return;
    if (name === "phone") {
      const cleaned = value.replace(/[^0-9\s+]/g, '');
      if (cleaned.replace(/\s/g, '').length > 11) return;
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      validateField(name, cleaned);
      return;
    }
    if (name === "qualification" && value.length > 60) return;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const validateAll = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) newErrors.name = "Valid name required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Min 6 characters";
    if (!formData.secretKey.trim()) newErrors.secretKey = "Access code required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    registerMutation.mutate(formData);
  };

  const labelClass = "text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2 block";
  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 transition-all text-gray-700 text-sm placeholder:text-gray-400";
  const inputErrorClass = "w-full pl-12 pr-4 py-3.5 bg-red-50 border border-red-300 rounded-xl outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 transition-all text-gray-700 text-sm";
  const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Branding */}
        <div className="md:w-[38%] bg-gradient-to-br from-blue-900 to-indigo-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">SMS Portal</span>
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              {currentRole === 'ADMIN' ? 'Master Access' : 'Staff Request'} <span className="text-blue-400">.</span>
            </h2>
            <p className="text-blue-200/80 text-sm mt-4 leading-relaxed">
              {currentRole === 'TEACHER' 
                ? "Join our faculty. Fill in your details for administrative review." 
                : "Initialize the root administrator profile with master privileges."}
            </p>
          </div>
          
          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-2 text-blue-200/60 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure Registration Portal</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-[62%] p-6 md:p-8 lg:p-10 bg-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {currentRole === "ADMIN" ? "Admin Enrollment" : "Staff Enrollment"}
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              {currentRole === "ADMIN" ? "Creating Root Admin User" : "Authorized faculty personnel only"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Name */}
            <div>
              <label className={labelClass}>Full Name *</label>
              <div className="relative group">
                <User className={`${iconClass} w-4 h-4 ${errors.name ? 'text-red-400' : ''}`} />
                <input name="name" type="text" value={formData.name} onChange={handleChange} onBlur={handleBlur}
                  className={errors.name ? inputErrorClass : inputClass} placeholder="FULL NAME" maxLength={50} required />
              </div>
              <div className="flex justify-between mt-1">
                {errors.name ? <p className="text-[11px] text-red-500">{errors.name}</p> : <span></span>}
                <p className="text-[10px] text-gray-400">{formData.name.length}/50</p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address *</label>
              <div className="relative group">
                <Mail className={`${iconClass} w-4 h-4 ${errors.email ? 'text-red-400' : ''}`} />
                <input name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  className={errors.email ? inputErrorClass : inputClass} placeholder="EMAIL@INSTITUTE.EDU" maxLength={60} required />
              </div>
              <div className="flex justify-between mt-1">
                {errors.email ? <p className="text-[11px] text-red-500">{errors.email}</p> : <p className="text-[10px] text-blue-500">✓ Login OTP will be sent here</p>}
                <p className="text-[10px] text-gray-400">{formData.email.length}/60</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Secret Key */}
              <div>
                <label className={labelClass}>{currentRole === "ADMIN" ? "Staff Access Code *" : "Teacher Verification Code *"}</label>
                <div className="relative group">
                  <Shield className={`${iconClass} w-4 h-4 ${errors.secretKey ? 'text-red-400' : ''}`} />
                  <input name="secretKey" type="text" value={formData.secretKey} onChange={handleChange} onBlur={handleBlur}
                    className={errors.secretKey ? inputErrorClass : inputClass} placeholder={currentRole === "ADMIN" ? "STAFF ACCESS CODE" : "TEACHER CODE"} maxLength={20} required />
                </div>
                <div className="flex justify-between mt-1">
                  {errors.secretKey ? <p className="text-[11px] text-red-500">{errors.secretKey}</p> : <span></span>}
                  <p className="text-[10px] text-gray-400">{formData.secretKey.length}/20</p>
                </div>
              </div>
              
              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                <div className="relative group">
                  <Phone className={`${iconClass} w-4 h-4 ${errors.phone ? 'text-red-400' : ''}`} />
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                    className={errors.phone ? inputErrorClass : inputClass} placeholder="03XXXXXXXXX" maxLength={11} />
                </div>
                <div className="flex justify-between mt-1">
                  {errors.phone ? <p className="text-[11px] text-red-500">{errors.phone}</p> : <span></span>}
                  <p className="text-[10px] text-gray-400">{formData.phone.replace(/\s/g, '').length}/11</p>
                </div>
              </div>
            </div>

            {/* Qualification - Only for Teacher */}
            {currentRole === "TEACHER" && (
              <div>
                <label className={labelClass}>Qualification <span className="text-gray-400 normal-case font-normal">(Optional)</span></label>
                <div className="relative group">
                  <GraduationCap className={`${iconClass} w-4 h-4`} />
                  <input name="qualification" type="text" value={formData.qualification} onChange={handleChange}
                    className={inputClass} placeholder="e.g., MSc, BEd" maxLength={60} />
                </div>
                <p className="text-[10px] text-gray-400 text-right mt-1">{formData.qualification.length}/60</p>
              </div>
            )}

            {/* Photo Upload - For Both Admin & Teacher (4MB) */}
            <div>
              <label className={labelClass}>
                <Camera size={12} className="inline mr-1" />
                Profile Photo <span className="text-gray-400 normal-case font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} className="w-20 h-24 rounded-lg object-cover border-2 border-blue-500 shadow-sm" />
                    <button type="button" onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md cursor-pointer">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-20 h-24 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
                      <UploadCloud size={20} className="text-gray-400 group-hover:text-blue-500 transition" />
                      <span className="text-[9px] text-gray-400 mt-1 group-hover:text-blue-500 transition">Upload</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                )}
                <p className="text-[10px] text-gray-400 max-w-[200px]">
                  {currentRole === "TEACHER" ? "Passport-size photo for ID card" : "Profile photo"} (Max 4MB)
                </p>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password <span className="text-gray-400 normal-case font-normal">(Min 6 characters)</span></label>
              <div className="relative group">
                <Lock className={`${iconClass} w-4 h-4 ${errors.password ? 'text-red-400' : ''}`} />
                <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} onBlur={handleBlur}
                  className={errors.password ? inputErrorClass : inputClass} placeholder="••••••••" maxLength={30} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer focus:outline-none">
                  {showPassword ? <Eye size={18} className="text-gray-400 hover:text-gray-600" /> : <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              
              {/* Password Strength */}
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strengthColors[strengthLevel]}`} 
                  style={{ width: `${(strengthLevel / 3) * 100}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <p className={`text-[10px] uppercase font-bold tracking-wider ${
                  strengthLevel === 0 ? 'text-gray-400' : strengthLevel === 1 ? 'text-red-500' : strengthLevel === 2 ? 'text-yellow-500' : 'text-green-500'
                }`}>{strengthLabels[strengthLevel] || "Enter Password"}</p>
                <p className="text-[10px] text-gray-400">{formData.password.length}/30</p>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button type="submit" disabled={registerMutation.isPending}
                className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer">
                {registerMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : `Register as ${currentRole}`}
              </button>
              <p className="text-center mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Existing Staff? <span onClick={() => router.push("/login")} className="text-blue-900 cursor-pointer hover:underline">Log In</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}