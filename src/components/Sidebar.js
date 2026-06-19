// // components/Sidebar.js
// "use client";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// export default function Sidebar({ user }) {
//   const router = useRouter();

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     toast.info("Logged out successfully!");
//     router.push("/login");
//   };

//   return (
//     <div className="w-64 bg-blue-900 text-white flex flex-col p-6 shadow-xl h-screen sticky top-0">
//       <h2 className="text-2xl font-black italic tracking-tighter mb-10">SMS PANEL</h2>
      
//       <nav className="flex-1 space-y-4">
//         <button 
//           onClick={() => router.push("/dashboard")}
//           className="w-full text-left p-4 rounded-2xl bg-blue-800 font-bold shadow-lg transition-all hover:bg-blue-700"
//         >
//           🏠 Dashboard
//         </button>
        
//         {user.role === "admin" && (
//           <>
//             <button onClick={() => router.push("/dashboard/teachers")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold">👨‍🏫 Manage Teachers</button>
//             <button onClick={() => router.push("/dashboard/students")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold">🎓 Manage Students</button>
            
//             {/* --- Naya Fees Management Button --- */}
//             <button 
//               onClick={() => router.push("/dashboard/fees")} 
//               className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold bg-opacity-50 border border-blue-400/20"
//             >
//               💰 Fees Management
//             </button>
//           </>
//         )}

//         {user.role === "teacher" && (
//           <>
//             <button onClick={() => router.push("/dashboard/attendance")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold">📝 Mark Attendance</button>
//             <button onClick={() => router.push("/dashboard/marks")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold">📊 Upload Marks</button>
//           </>
//         )}
//       </nav>

//       <button onClick={handleLogout} className="mt-auto p-4 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg active:scale-95">
//         Logout System
//       </button>
//     </div>
//   );
// }









// "use client";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// export default function Sidebar({ user }) {
//   const router = useRouter();

//   const handleLogout = async () => {
//     const userId = user?._id || user?.id || user?.user?._id;

//     if (!userId) {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (response.ok) {
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//         toast.info("Logged out successfully!");
//         router.push("/login");
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//       localStorage.removeItem("user");
//       router.push("/login");
//     }
//   };

//   return (
//     <div className="w-64 bg-blue-900 text-white flex flex-col p-6 shadow-xl h-screen sticky top-0 overflow-y-auto">
//       <div className="mb-10 text-center">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">SMS PANEL</h2>
//         <p className="text-[8px] text-blue-400 font-bold tracking-[0.3em] mt-2">ADMINISTRATION SYSTEM</p>
//       </div>
      
//       <nav className="flex-1 space-y-2">
//         {/* common for all */}
//         <button 
//           onClick={() => router.push("/dashboard")}
//           className="w-full text-left p-4 rounded-2xl bg-blue-800 font-bold shadow-lg transition-all hover:bg-blue-700 flex items-center gap-3"
//         >
//           <span className="text-lg">🏠</span> Dashboard
//         </button>

//         <div className="pt-4 pb-2">
//           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-4 mb-2">Main Menu</p>
//         </div>
        
//         {user.role === "admin" && (
//           <>
//             <button onClick={() => router.push("/dashboard/admissions")} className="w-full text-left p-4 rounded-2xl bg-yellow-600/20 border border-yellow-500/30 hover:bg-yellow-600/40 transition-all font-bold text-yellow-100 flex items-center gap-3">
//               <span>📩</span> New Admissions
//             </button>

//             <button onClick={() => router.push("/dashboard/teachers")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center gap-3">
//               <span>👨‍🏫</span> Manage Teachers
//             </button>
            
//             <button onClick={() => router.push("/dashboard/students")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center gap-3">
//               <span>🎓</span> Manage Students
//             </button>

//             {/* Attendance for Admin - Taake admin reports dekh sakay */}
//             <button onClick={() => router.push("/dashboard/attendance")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center gap-3 bg-blue-800/40 border border-blue-400/10">
//               <span>📝</span> Attendance Records
//             </button>

//             <button onClick={() => router.push("/dashboard/fees")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center gap-3">
//               <span>💰</span> Fees Management
//             </button>
//           </>
//         )}

//         {user.role === "teacher" && (
//           <>
//             <button onClick={() => router.push("/dashboard/attendance")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center gap-3">
//               <span>📝</span> Mark Attendance
//             </button>
//             <button onClick={() => router.push("/dashboard/marks")} className="w-full text-left p-4 rounded-2xl hover:bg-blue-700 transition-all font-bold flex items-center gap-3">
//               <span>📊</span> Upload Marks
//             </button>
//           </>
//         )}
//       </nav>

//       <div className="pt-6 border-t border-blue-800 mt-6">
//         <div className="flex items-center gap-3 mb-6 px-2">
//           <div className="w-10 h-10 rounded-full bg-blue-700 border-2 border-blue-500 flex items-center justify-center font-black italic">
//             {user.name?.charAt(0)}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate">{user.name}</p>
//             <p className="text-[8px] text-blue-400 uppercase font-bold tracking-tighter">{user.role} ID: {user.rollNo || "STAFF"}</p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
//         >
//           <span>🚀</span> Logout System
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   Trophy, BookOpen
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleLogout = async () => {
//     const userId = user?._id || user?.id || user?.user?._id;
//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (response.ok) {
//         localStorage.clear();
//         toast.info("System Session Terminated", { theme: "dark" });
//         router.push("/login");
//       }
//     } catch (error) {
//       localStorage.clear();
//       router.push("/login");
//     }
//   };

//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//            <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//            <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       <nav className="flex-1 space-y-1">
//         {/* Dashboard Link */}
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={user.role === "admin" ? "/dashboard" : "/dashboard"} 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/teacherdashboard/task" />
//             <NavItem icon={ScanLine} label="Attendance Scanner" path="/dashboard/attendance/scanner" />
//             <NavItem icon={BookOpen} label="Student Reports" path="/dashboard/attendance/reports" />
//           </>
//         )}

//         {user.role === "admin" && (
//           <>
//             <NavItem icon={ScanLine} label="Live Scanner" path="/dashboard/attendance/scanner" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/tasks" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase">
//             {user.name?.charAt(0)}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }






// msg






// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool // UserPlus (Admission) aur PenTool add kiye
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleLogout = async () => {
//     const userId = user?._id || user?.id || user?.user?._id;
//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (response.ok) {
//         localStorage.clear();
//         toast.info("System Session Terminated", { theme: "dark" });
//         router.push("/login");
//       }
//     } catch (error) {
//       localStorage.clear();
//       router.push("/login");
//     }
//   };

//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       <nav className="flex-1 space-y-1">
//         {/* Dashboard Link */}
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path="/dashboard" 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- TEACHER LINKS --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={PenTool} label="Issue Assignment" path="/teacherdashboard/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/teacherdashboard/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/teacherdashboard/messages" />
//             <NavItem icon={ScanLine} label="Attendance Scanner" path="/dashboard/attendance/scanner" />
//             <NavItem icon={BookOpen} label="Student Reports" path="/dashboard/attendance/reports" />
//           </>
//         )}

//         {/* --- ADMIN LINKS --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admissions" />
//             <NavItem icon={ScanLine} label="Live Scanner" path="/dashboard/attendance/scanner" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase">
//             {user.name?.charAt(0)}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }



















// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, FileText 
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleLogout = async () => {
//     const userId = user?._id || user?.id || user?.user?._id;
//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       if (response.ok) {
//         localStorage.clear();
//         toast.info("System Session Terminated", { theme: "dark" });
//         router.push("/login");
//       }
//     } catch (error) {
//       localStorage.clear();
//       router.push("/login");
//     }
//   };

//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       <nav className="flex-1 space-y-1">
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path="/dashboard" 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT LINKS --- */}
//         {user.role === "student" && (
//           <>
//             {/* Path updated as per your folder: studentdasboard (no 'h') */}
//             <NavItem 
//               icon={FileText} 
//               label="Task Pipeline" 
//               path="/studentdasboard/assignments" 
//             />
            
          
//           </>
//         )}

//         {/* --- TEACHER LINKS --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={PenTool} label="Issue Assignment" path="/teacherdashboard/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/teacherdashboard/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/teacherdashboard/messages" />
//             <NavItem icon={ScanLine} label="Attendance Scanner" path="/dashboard/attendance/scanner" />
//             <NavItem icon={BookOpen} label="Student Reports" path="/dashboard/attendance/reports" />
//           </>
//         )}

//         {/* --- ADMIN LINKS --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admissions" />
//             <NavItem icon={ScanLine} label="Live Scanner" path="/dashboard/attendance/scanner" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase">
//             {user.name?.charAt(0)}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }







// up





















// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, FileText 
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

  
//   const handleLogout = async () => {
  
//   const userId = user?.id || user?._id || user?.user?._id || user?.user?.id;

  

//   if (!userId) {
//     console.error("Logout Blocked: No ID detected in user object");
//     localStorage.clear();
//     router.push("/login");
//     return;
//   }

//   try {
//     const response = await fetch("/api/auth/logout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId }),
//     });

//     if (response.ok) {
//       localStorage.clear();
//       toast.info("System Session Terminated", { theme: "dark" });
//       router.push("/login");
//     } else {
//       // Agar API fail bhi ho jaye tab bhi login par bhej dein
//       localStorage.clear();
//       router.push("/login");
//     }
//   } catch (error) {
    
//     localStorage.clear();
//     router.push("/login");
//   }
// };
//   const NavItem = ({ icon: Icon, label, path }) => {
//     // Check if current path matches the link path
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       <nav className="flex-1 space-y-1">
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path="/dashboard" 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT LINKS --- */}
//         {user.role === "student" && (
//           <>
//             <NavItem 
//               icon={FileText} 
//               label="Task Pipeline" 
//               path="/dashboard/student/assignments" 
//             />
           
//             <NavItem icon={BookOpen} label="Academic Reports" path="/dashboard/student/reports" />
//           </>
//         )}

      
       
// {user.role === "teacher" && (
//   <>
//     {/* Naya Link: Jise click kar ke teacher submissions dekh sakegi */}
//     <NavItem 
//       icon={ScanLine} 
//       label="View Submissions" 
//       path="/dashboard/teacher/submissions" 
//     />
    
//     <NavItem 
//       icon={PenTool} 
//       label="Issue Assignment" 
//       path="/dashboard/teacher/assignments" 
//     />
    
//     <NavItem 
//       icon={ClipboardCheck} 
//       label="My Task Pipeline" 
//       path="/dashboard/teacher/task" 
//     />
    
//     <NavItem 
//       icon={MessageSquare} 
//       label="Admin Support" 
//       path="/dashboard/teacher/messages" 
//     />
//   </>
// )}

//         {/* --- ADMIN LINKS --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admin/admissions" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/admin/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/admin/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase">
//             {user.name?.charAt(0)}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }















// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers // Naya Icon for Subjects
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   // const handleLogout = async () => {
//   //   const userId = user?.id || user?._id || user?.user?._id || user?.user?.id;

//   //   if (!userId) {
//   //     console.error("Logout Blocked: No ID detected in user object");
//   //     localStorage.clear();
//   //     router.push("/login");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch("/api/auth/logout", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ userId }),
//   //     });

//   //     if (response.ok) {
//   //       localStorage.clear();
//   //       toast.info("System Session Terminated", { theme: "dark" });
//   //       router.push("/login");
//   //     } else {
//   //       localStorage.clear();
//   //       router.push("/login");
//   //     }
//   //   } catch (error) {
//   //     localStorage.clear();
//   //     router.push("/login");
//   //   }
//   // };

//   // const handleLogout = async () => {
//   //   // 1. Precise ID Extraction
//   //   // Hum sirf un properties ko check kar rahe hain jo actual mein data provide karti hain
//   //   const userId = user?._id || user?.id || user?.user?._id;

//   //   console.log("Initiating Logout Protocol for ID:", userId);

//   //   if (!userId) {
//   //     console.warn("Direct Termination: No ID found, clearing local storage.");
//   //     localStorage.clear();
//   //     router.push("/login");
//   //     return;
//   //   }

//   //   try {
//   //     // 2. Database Status Update
//   //     const response = await fetch("/api/auth/logout", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ userId }),
//   //     });

//   //     // Response check karne ke baad hi storage clear karein
//   //     if (response.ok) {
//   //       toast.info("Session Terminated Successfully", { theme: "dark", autoClose: 2000 });
//   //     } else {
//   //       console.error("Server-side logout failed, forcing local cleanup.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Network Error during logout:", error);
//   //   } finally {
//   //     // 3. Absolute Cleanup
//   //     // Ye block hamesha chalega chahe API fail ho ya pass
//   //     localStorage.clear();
//   //     // Agar aap cookies use kar rahe hain toh unhein bhi yahan clear kar sakte hain
//   //     router.push("/login");
//   //   }
//   // };



//   const handleLogout = async () => {
//   // 1. Precise ID & Role Extraction
//   // LocalStorage se fresh data nikalna behtar hye agar state update na hui ho
//   const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  
//   const userId = user?._id || user?.id || storedUser?._id || storedUser?.id;
//   const userRole = user?.role || storedUser?.role;

//   console.log("Initiating Logout Protocol for ID:", userId, "Role:", userRole);

//   if (!userId) {
//     console.warn("Direct Termination: No ID found, clearing local storage.");
//     localStorage.clear();
//     router.push("/login");
//     return;
//   }

//   try {
//     // 2. Database Status Update
//     // Hum userId aur role dono bhej rahe hain
//     const response = await fetch("/api/auth/logout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         userId: userId,
//         role: userRole 
//       }),
//     });

//     const data = await response.json();

//     if (response.ok && data.success) {
//       toast.info("Session Terminated Successfully", { 
//         theme: "dark", 
//         autoClose: 1500,
//         icon: "🚀" 
//       });
//     } else {
//       console.error("Server-side logout failed:", data.message);
//     }
//   } catch (error) {
//     console.error("Network Error during logout:", error);
//   } finally {
//     // 3. Absolute Cleanup
//     // 1.5 second ka delay diya hye taake toast nazar aa jaye
//     setTimeout(() => {
//       localStorage.clear();
//       // Session storage bhi clear kar dena behtar hye
//       sessionStorage.clear();
//       router.push("/login");
//     }, 1500);
//   }
// };

//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       <nav className="flex-1 space-y-1">
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path="/dashboard" 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT LINKS --- */}
//         {user.role === "student" && (
//           <>
//             <NavItem icon={FileText} label="Task Pipeline" path="/dashboard/student/assignments" />
//             <NavItem icon={BookOpen} label="Academic Reports" path="/dashboard/student/reports" />
//           </>
//         )}

//         {/* --- TEACHER LINKS --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={ScanLine} label="View Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={PenTool} label="Issue Assignment" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/dashboard/teacher/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/dashboard/teacher/messages" />
//           </>
//         )}

//         {/* --- ADMIN LINKS --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admin/admissions" />
            
//             {/* ✅ Naya Link: Manage Subjects */}
//             <NavItem 
//               icon={Layers} 
//               label="Manage Subjects" 
//               path="/dashboard/admin/subjects" 
//             />

//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/admin/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/admin/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase">
//             {user.name?.charAt(0)}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }


























// role based login





// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers 
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   // --- 1. Dynamic Path Logic ---
//   // Ye function check karega ke Dashboard link kis page par bheje
//   const getDashboardPath = () => {
//     if (user?.role === "admin") return "/dashboard/admin/dashboard";
//     if (user?.role === "teacher") return "/dashboard/teacher/dashboard";
//     if (user?.role === "student") return "/dashboard/student/dashboard";
//     return "/dashboard";
//   };

//   // --- 2. Logout Protocol ---
//   const handleLogout = async () => {
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = user?._id || user?.id || storedUser?._id || storedUser?.id;
//     const userRole = user?.role || storedUser?.role;

//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: userRole }),
//       });

//       const data = await response.json();
//       if (response.ok && data.success) {
//         toast.info("Session Terminated", { theme: "dark", autoClose: 1000 });
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       setTimeout(() => {
//         localStorage.clear();
//         sessionStorage.clear();
//         router.push("/login");
//       }, 1200);
//     }
//   };

//   // --- 3. NavItem Sub-Component ---
//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   if (!user) return null;

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       {/* Navigation Links */}
//       <nav className="flex-1 space-y-1">
//         {/* Main Dashboard Link (Dynamic Based on Role) */}
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={getDashboardPath()} 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT ONLY --- */}
//         {user.role === "student" && (
//           <>
//             <NavItem icon={FileText} label="Task Pipeline" path="/dashboard/student/assignments" />
//             <NavItem icon={BookOpen} label="Academic Reports" path="/dashboard/student/reports" />
//           </>
//         )}

//         {/* --- TEACHER ONLY --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={ScanLine} label="View Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={PenTool} label="Issue Assignment" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/dashboard/teacher/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/dashboard/teacher/messages" />
//           </>
//         )}

//         {/* --- ADMIN ONLY --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admin/admissions" />
//             <NavItem icon={Layers} label="Manage Subjects" path="/dashboard/admin/subjects" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/admin/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/admin/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase shrink-0">
//             {user.name?.charAt(0) || "U"}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name || "User"}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }












































// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers, LifeBuoy 
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   // --- 1. Dynamic Path Logic ---
//   const getDashboardPath = () => {
//     if (user?.role === "admin") return "/dashboard/admin/dashboard";
//     if (user?.role === "teacher") return "/dashboard/teacher/dashboard";
//     if (user?.role === "student") return "/dashboard/student/dashboard";
//     return "/dashboard";
//   };

//   // --- 2. Logout Protocol ---
//   const handleLogout = async () => {
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = user?._id || user?.id || storedUser?._id || storedUser?.id;
//     const userRole = user?.role || storedUser?.role;

//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: userRole }),
//       });

//       const data = await response.json();
//       if (response.ok && data.success) {
//         toast.info("Session Terminated", { theme: "dark", autoClose: 1000 });
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       setTimeout(() => {
//         localStorage.clear();
//         sessionStorage.clear();
//         router.push("/login");
//       }, 1200);
//     }
//   };

//   // --- 3. NavItem Sub-Component ---
//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   if (!user) return null;

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800 custom-scrollbar">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       {/* Navigation Links */}
//       <nav className="flex-1 space-y-1">
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={getDashboardPath()} 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT ONLY --- */}
//         {user.role === "student" && (
//           <>
//             <NavItem icon={FileText} label="Task Pipeline" path="/dashboard/student/assignments" />
//             <NavItem icon={BookOpen} label="Academic Reports" path="/dashboard/student/reports" />
//             {/* Added Feedback for Student */}
//             <NavItem icon={LifeBuoy} label="Submit Feedback" path="/dashboard/student/feedback" />
//           </>
//         )}

//         {/* --- TEACHER ONLY --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={ScanLine} label="View Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={PenTool} label="Issue Assignment" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/dashboard/teacher/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/dashboard/teacher/messages" />
//           </>
//         )}

//         {/* --- ADMIN ONLY --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admin/admissions" />
//             {/* Added Help Desk (Complaints) for Admin */}
//             <NavItem icon={LifeBuoy} label="Help Desk (Complaints)" path="/dashboard/admin/complaints" />
//             <NavItem icon={Layers} label="Manage Subjects" path="/dashboard/admin/subjects" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/admin/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/admin/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase shrink-0">
//             {user.name?.charAt(0) || "U"}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name || "User"}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }













































// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers, LifeBuoy, Sparkles 
// } from "lucide-react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   // --- 1. Dynamic Path Logic ---
//   const getDashboardPath = () => {
//     if (user?.role === "admin") return "/dashboard/admin/dashboard";
//     if (user?.role === "teacher") return "/dashboard/teacher/dashboard";
//     if (user?.role === "student") return "/dashboard/student/dashboard";
//     return "/dashboard";
//   };

//   // --- 2. Logout Protocol ---
//   const handleLogout = async () => {
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = user?._id || user?.id || storedUser?._id || storedUser?.id;
//     const userRole = user?.role || storedUser?.role;

//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: userRole }),
//       });

//       const data = await response.json();
//       if (response.ok && data.success) {
//         toast.info("Session Terminated", { theme: "dark", autoClose: 1000 });
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       setTimeout(() => {
//         localStorage.clear();
//         sessionStorage.clear();
//         router.push("/login");
//       }, 1200);
//     }
//   };

//   // --- 3. NavItem Sub-Component ---
//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   if (!user) return null;

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800 custom-scrollbar">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       {/* Navigation Links */}
//       <nav className="flex-1 space-y-1">
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={getDashboardPath()} 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT ONLY --- */}
//         {user.role === "student" && (
//           <>
//             <NavItem icon={FileText} label="Task Pipeline" path="/dashboard/student/assignments" />
//             <NavItem icon={BookOpen} label="Academic Reports" path="/dashboard/student/reports" />
//             <NavItem icon={LifeBuoy} label="Submit Feedback" path="/dashboard/student/feedback" />
//           </>
//         )}

//         {/* --- TEACHER ONLY --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={ScanLine} label="View Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={PenTool} label="Issue Assignment" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/dashboard/teacher/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/dashboard/teacher/messages" />
//           </>
//         )}

//         {/* --- ADMIN ONLY --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admin/admissions" />
//             <NavItem icon={LifeBuoy} label="Help Desk (Complaints)" path="/dashboard/admin/complaints" />
//             <NavItem icon={Layers} label="Manage Subjects" path="/dashboard/admin/subjects" />
//             <NavItem icon={Sparkles} label="Syllabus Engine" path="/dashboard/admin/syllabus" />
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/admin/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/admin/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase shrink-0">
//             {user.name?.charAt(0) || "U"}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name || "User"}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }








































// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers, LifeBuoy, Sparkles,
//   Upload,  Eye,  List, 
//   ChevronDown, ChevronRight
// } from "lucide-react";
// import { useState } from "react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

//   // --- 1. Dynamic Path Logic ---
//   const getDashboardPath = () => {
//     if (user?.role === "admin") return "/dashboard/admin/dashboard";
//     if (user?.role === "teacher") return "/dashboard/teacher/dashboard";
//     if (user?.role === "student") return "/dashboard/student/dashboard";
//     return "/dashboard";
//   };

//   // --- 2. Logout Protocol ---
//   const handleLogout = async () => {
//     const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = user?._id || user?.id || storedUser?._id || storedUser?.id;
//     const userRole = user?.role || storedUser?.role;

//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: userRole }),
//       });

//       const data = await response.json();
//       if (response.ok && data.success) {
//         toast.info("Session Terminated", { theme: "dark", autoClose: 1000 });
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       setTimeout(() => {
//         localStorage.clear();
//         sessionStorage.clear();
//         router.push("/login");
//       }, 1200);
//     }
//   };

//   // --- 3. NavItem Sub-Component ---
//   const NavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//         <span className="text-sm tracking-tight">{label}</span>
//       </button>
//     );
//   };

//   // --- 4. SubNavItem for Dropdown Items ---
//   const SubNavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left py-2.5 px-12 rounded-xl transition-all font-medium flex items-center gap-3 mb-1 text-sm ${
//           isActive 
//             ? "bg-blue-600/30 text-blue-400 border-l-2 border-blue-500" 
//             : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
//         }`}
//       >
//         <Icon size={14} />
//         <span>{label}</span>
//       </button>
//     );
//   };

//   // --- 5. Syllabus Dropdown Component (Admin Only) ---
//   const SyllabusDropdown = () => {
//     const isAnyActive = [
//       "/dashboard/admin/syllabus",
//       "/dashboard/admin/syllabus/ingest",
//       "/dashboard/admin/syllabus/list",
//       "/dashboard/admin/syllabus/extract"
//     ].includes(pathname) || pathname?.startsWith("/dashboard/admin/syllabus/");

//     return (
//       <div className="mb-1.5">
//         <button 
//           onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}
//           className={`w-full text-left p-3.5 rounded-xl transition-all font-bold flex items-center justify-between gap-3 border ${
//             isAnyActive
//               ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//               : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <Sparkles size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
//             <span className="text-sm tracking-tight">Syllabus Engine</span>
//           </div>
//           {isSyllabusOpen ? (
//             <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           ) : (
//             <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           )}
//         </button>
        
//         {isSyllabusOpen && (
//           <div className="mt-1 ml-2 space-y-0.5">
//             <SubNavItem 
//               icon={List} 
//               label="All Syllabuses" 
//               path="/dashboard/admin/syllabus" 
//             />
//             <SubNavItem 
//               icon={Upload} 
//               label="Upload PDF (AI Extract)" 
//               path="/dashboard/admin/syllabus/ingest" 
//             />
            
            
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!user) return null;

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col p-5 shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800 custom-scrollbar">
      
//       {/* Logo Section */}
//       <div className="mb-10 mt-2 px-2">
//         <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-500">
//           SMS <span className="text-slate-300">HUB</span>
//         </h2>
//         <div className="flex items-center gap-2 mt-2">
//             <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
//             <p className="text-[7px] text-slate-500 font-black tracking-[0.4em] uppercase whitespace-nowrap">Core v2.1.0</p>
//         </div>
//       </div>
      
//       {/* Navigation Links */}
//       <nav className="flex-1 space-y-1">
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={getDashboardPath()} 
//         />

//         <div className="pt-6 pb-2 px-1">
//           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2">Operations</p>
//         </div>

//         {/* --- STUDENT ONLY --- */}
//         {user.role === "student" && (
//           <>
//             <NavItem icon={FileText} label="Task Pipeline" path="/dashboard/student/assignments" />
//             <NavItem icon={BookOpen} label="Academic Reports" path="/dashboard/student/reports" />
//             <NavItem icon={LifeBuoy} label="Submit Feedback" path="/dashboard/student/feedback" />
//           </>
//         )}

//         {/* --- TEACHER ONLY --- */}
//         {user.role === "teacher" && (
//           <>
//             <NavItem icon={ScanLine} label="View Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={PenTool} label="Issue Assignment" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ClipboardCheck} label="My Task Pipeline" path="/dashboard/teacher/task" />
//             <NavItem icon={MessageSquare} label="Admin Support" path="/dashboard/teacher/messages" />
//           </>
//         )}

//         {/* --- ADMIN ONLY --- */}
//         {user.role === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="New Admission" path="/dashboard/admin/admissions" />
//             <NavItem icon={LifeBuoy} label="Help Desk (Complaints)" path="/dashboard/admin/complaints" />
//             <NavItem icon={Layers} label="Manage Subjects" path="/dashboard/admin/subjects" />
            
//             {/* Syllabus Dropdown - Updated */}
//             <SyllabusDropdown />
            
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Communication Hub" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Manage Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Manage Students" path="/dashboard/admin/students" />
//             <NavItem icon={Receipt} label="Fees & Billing" path="/dashboard/admin/fees" />
//           </>
//         )}
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="pt-6 border-t border-slate-800 mt-auto">
//         <div className="flex items-center gap-3 mb-6 px-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase shrink-0">
//             {user.name?.charAt(0) || "U"}
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[10px] font-black truncate uppercase text-slate-300">{user.name || "User"}</p>
//             <p className="text-[8px] text-blue-500 uppercase font-black tracking-tighter italic">
//               Access: {user.role}
//             </p>
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full p-4 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> 
//           Kill Session
//         </button>
//       </div>
//     </div>
//   );
// }





































// ID CARD 
// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers, LifeBuoy, Sparkles,
//   Upload, Eye, List, ChevronDown, ChevronRight,
//   IdCard, Home, Settings, HelpCircle, Bell,
//   Calendar, DollarSign, Award, Target, CheckSquare,
//   BookMarked, Mail, Phone, MapPin, CreditCard,
//   QrCode, Download, Printer, RefreshCw
// } from "lucide-react";
// import { useState } from "react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
//   const [isIDCardsOpen, setIsIDCardsOpen] = useState(false);
//   const [isReportsOpen, setIsReportsOpen] = useState(false);

//   // --- 1. Dynamic Path Logic ---
//   const getDashboardPath = () => {
//     if (user?.role === "admin") return "/dashboard/admin";
//     if (user?.role === "teacher") return "/dashboard/teacher";
//     if (user?.role === "student") return "/dashboard/student";
//     return "/dashboard";
//   };

//   // --- 2. Logout Protocol ---
//   const handleLogout = async () => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     const userRole = user?.role || localStorage.getItem("userRole");

//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: userRole, token }),
//       });

//       if (response.ok) {
//         toast.success("Logged out successfully!");
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       localStorage.clear();
//       sessionStorage.clear();
//       router.push("/login");
//     }
//   };

//   // --- 3. NavItem Sub-Component ---
//   const NavItem = ({ icon: Icon, label, path, badge, onClick }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => onClick ? onClick() : router.push(path)} 
//         className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <div className="flex items-center gap-3">
//           <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//           <span className="text-sm tracking-tight">{label}</span>
//         </div>
//         {badge && (
//           <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
//             {badge}
//           </span>
//         )}
//       </button>
//     );
//   };

//   // --- 4. SubNavItem for Dropdown Items ---
//   const SubNavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left py-2 px-12 rounded-xl transition-all font-medium flex items-center gap-3 mb-1 text-sm ${
//           isActive 
//             ? "bg-blue-600/30 text-blue-400 border-l-2 border-blue-500" 
//             : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
//         }`}
//       >
//         <Icon size={14} />
//         <span>{label}</span>
//       </button>
//     );
//   };

//   // --- 5. Syllabus Dropdown (Admin Only) ---
//   const SyllabusDropdown = () => {
//     const isAnyActive = [
//       "/dashboard/admin/syllabus",
//       "/dashboard/admin/syllabus/ingest",
//     ].includes(pathname) || pathname?.startsWith("/dashboard/admin/syllabus/");

//     return (
//       <div className="mb-1.5">
//         <button 
//           onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}
//           className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
//             isAnyActive
//               ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//               : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <Sparkles size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
//             <span className="text-sm tracking-tight">Syllabus</span>
//           </div>
//           {isSyllabusOpen ? (
//             <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           ) : (
//             <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           )}
//         </button>
        
//         {isSyllabusOpen && (
//           <div className="mt-1 ml-2 space-y-0.5">
//             <SubNavItem icon={List} label="All Syllabuses" path="/dashboard/admin/syllabus" />
//             <SubNavItem icon={Upload} label="Upload PDF" path="/dashboard/admin/syllabus/ingest" />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // --- 6. ID Cards Dropdown (Admin Only) ---
//   const IDCardsDropdown = () => {
//     const isAnyActive = pathname === "/dashboard/admin/id-cards";

//     return (
//       <div className="mb-1.5">
//         <button 
//           onClick={() => setIsIDCardsOpen(!isIDCardsOpen)}
//           className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
//             isAnyActive
//               ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//               : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <IdCard size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
//             <span className="text-sm tracking-tight">ID Cards</span>
//           </div>
//           {isIDCardsOpen ? (
//             <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           ) : (
//             <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           )}
//         </button>
        
//         {isIDCardsOpen && (
//           <div className="mt-1 ml-2 space-y-0.5">
//             <SubNavItem icon={List} label="All ID Cards" path="/dashboard/admin/id-cards" />
//             <SubNavItem icon={Download} label="Bulk Download" path="/dashboard/admin/id-cards/bulk" />
//           </div>
//         )}
//       </div>
//     );
//   };

//   // --- 7. Reports Dropdown (Student/Teacher) ---
//   const ReportsDropdown = () => {
//     const isAnyActive = pathname === `/dashboard/${user?.role}/reports/performance` || 
//                         pathname === `/dashboard/${user?.role}/reports/attendance` ||
//                         pathname === `/dashboard/${user?.role}/reports/download`;

//     return (
//       <div className="mb-1.5">
//         <button 
//           onClick={() => setIsReportsOpen(!isReportsOpen)}
//           className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
//             isAnyActive
//               ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//               : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <Award size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
//             <span className="text-sm tracking-tight">Reports</span>
//           </div>
//           {isReportsOpen ? (
//             <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           ) : (
//             <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           )}
//         </button>
        
//         {isReportsOpen && (
//           <div className="mt-1 ml-2 space-y-0.5">
//             <SubNavItem icon={FileText} label="Performance" path={`/dashboard/${user?.role}/reports/performance`} />
//             <SubNavItem icon={Calendar} label="Attendance" path={`/dashboard/${user?.role}/reports/attendance`} />
//             <SubNavItem icon={Download} label="Download Reports" path={`/dashboard/${user?.role}/reports/download`} />
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (!user) return null;

//   // Get user info from localStorage if not in props
//   const userName = user?.name || localStorage.getItem("userName") || "User";
//   const userRole = user?.role || localStorage.getItem("userRole") || "guest";
//   const userEmail = user?.email || localStorage.getItem("userEmail") || "";

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800 custom-scrollbar">
      
//       {/* Logo Section */}
//       <div className="p-5 pb-0">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//             <School className="w-4 h-4 text-white" />
//           </div>
//           <h2 className="text-lg font-bold tracking-tight">
//             <span className="text-blue-500">SMS</span>
//             <span className="text-slate-300"> Hub</span>
//           </h2>
//         </div>
//         <div className="h-px bg-gradient-to-r from-blue-500 to-transparent opacity-50" />
//       </div>
      
//       {/* Navigation Links */}
//       <nav className="flex-1 p-3 space-y-1">
//         {/* Dashboard - Common for all */}
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={getDashboardPath()} 
//         />

//         <div className="pt-4 pb-1 px-2">
//           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Main Menu</p>
//         </div>

//         {/* ==================== STUDENT ONLY ==================== */}
//         {userRole === "student" && (
//           <>
//             <NavItem icon={FileText} label="Assignments" path="/dashboard/student/assignments" />
//             {/* ✅ NEW - Attendance Page Link */}
//             <NavItem icon={Calendar} label="My Attendance" path="/dashboard/student/attendance" />
//             <NavItem icon={IdCard} label="My ID Card" path="/dashboard/student/id-card" />
//             <ReportsDropdown />
//             <NavItem icon={LifeBuoy} label="Submit Complaint" path="/dashboard/student/complaints" />
//             <NavItem icon={MessageSquare} label="Messages" path="/dashboard/student/messages" />
//           </>
//         )}

//         {/* ==================== TEACHER ONLY ==================== */}
//         {userRole === "teacher" && (
//           <>
//             <NavItem icon={PenTool} label="Assignments" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ScanLine} label="Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={CheckSquare} label="My Tasks" path="/dashboard/teacher/tasks" />
//             <NavItem icon={MessageSquare} label="Messages" path="/dashboard/teacher/messages" />
//             <ReportsDropdown />
//           </>
//         )}

//         {/* ==================== ADMIN ONLY ==================== */}
//         {userRole === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="Admissions" path="/dashboard/admin/admissions" />
//             <NavItem icon={LifeBuoy} label="Complaints" path="/dashboard/admin/complaints" />
//             <NavItem icon={Layers} label="Subjects" path="/dashboard/admin/subjects" />
            
//             {/* Syllabus Dropdown */}
//             <SyllabusDropdown />
            
//             {/* ID Cards Dropdown */}
//             <IDCardsDropdown />
            
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Messages" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Students" path="/dashboard/admin/students" />
//             <NavItem icon={DollarSign} label="Fees" path="/dashboard/admin/fees" />
//           </>
//         )}

//         <div className="pt-4 pb-1 px-2">
//           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Support</p>
//         </div>

//         {/* Common for all roles */}
//         <NavItem icon={HelpCircle} label="Help & Support" path={`/dashboard/${userRole}/support`} />
//         <NavItem icon={Settings} label="Settings" path={`/dashboard/${userRole}/settings`} />
//       </nav>

//       {/* User Profile & Logout */}
//       <div className="p-4 border-t border-slate-800">
//         <div className="flex items-center gap-3 mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white uppercase shrink-0">
//             {userName.charAt(0) || "U"}
//           </div>
//           <div className="overflow-hidden flex-1">
//             <p className="text-sm font-medium truncate text-slate-200">{userName}</p>
//             <p className="text-xs text-blue-400 capitalize">{userRole}</p>
//             {userEmail && <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>}
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full py-2.5 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-medium text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// // School icon for logo
// const School = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
//     <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//   </svg>
// );







// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { 
//   LayoutDashboard, ScanLine, ClipboardCheck, 
//   GraduationCap, Users, Receipt, LogOut, 
//   BookOpen, MessageSquare, UserPlus, PenTool, 
//   FileText, Layers, LifeBuoy, Sparkles,
//   Upload, Eye, List, ChevronDown, ChevronRight,
//   IdCard, Home, Settings, HelpCircle, Bell,
//   Calendar, DollarSign, Award, Target, CheckSquare,
//   BookMarked, Mail, Phone, MapPin, CreditCard,
//   QrCode, Download, Printer, RefreshCw,
//   Layout
// } from "lucide-react";
// import { useState } from "react";

// export default function Sidebar({ user }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
//   const [isIDCardsOpen, setIsIDCardsOpen] = useState(false);

//   // --- 1. Dynamic Path Logic ---
//   const getDashboardPath = () => {
//     if (user?.role === "admin") return "/dashboard/admin";
//     if (user?.role === "teacher") return "/dashboard/teacher";
//     if (user?.role === "student") return "/dashboard/student";
//     return "/dashboard";
//   };

//   // --- 2. Logout Protocol ---
//   const handleLogout = async () => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");
//     const userRole = user?.role || localStorage.getItem("userRole");

//     if (!userId) {
//       localStorage.clear();
//       router.push("/login");
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: userRole, token }),
//       });

//       if (response.ok) {
//         toast.success("Logged out successfully!");
//       }
//     } catch (error) {
//       console.error("Logout Error:", error);
//     } finally {
//       localStorage.clear();
//       sessionStorage.clear();
//       router.push("/login");
//     }
//   };

//   // --- 3. NavItem Sub-Component ---
//   const NavItem = ({ icon: Icon, label, path, badge, onClick }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => onClick ? onClick() : router.push(path)} 
//         className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 mb-1.5 border ${
//           isActive 
//             ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//             : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//         }`}
//       >
//         <div className="flex items-center gap-3">
//           <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
//           <span className="text-sm tracking-tight">{label}</span>
//         </div>
//         {badge && (
//           <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
//             {badge}
//           </span>
//         )}
//       </button>
//     );
//   };

//   // --- 4. SubNavItem for Dropdown Items ---
//   const SubNavItem = ({ icon: Icon, label, path }) => {
//     const isActive = pathname === path;
    
//     return (
//       <button 
//         onClick={() => router.push(path)} 
//         className={`w-full text-left py-2 px-12 rounded-xl transition-all font-medium flex items-center gap-3 mb-1 text-sm ${
//           isActive 
//             ? "bg-blue-600/30 text-blue-400 border-l-2 border-blue-500" 
//             : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
//         }`}
//       >
//         <Icon size={14} />
//         <span>{label}</span>
//       </button>
//     );
//   };

//   // --- 5. Syllabus Dropdown (Admin Only) ---
//   const SyllabusDropdown = () => {
//     const isAnyActive = [
//       "/dashboard/admin/syllabus",
//       "/dashboard/admin/syllabus/ingest",
//     ].includes(pathname) || pathname?.startsWith("/dashboard/admin/syllabus/");

//     return (
//       <div className="mb-1.5">
//         <button 
//           onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}
//           className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
//             isAnyActive
//               ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//               : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <Sparkles size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
//             <span className="text-sm tracking-tight">Syllabus</span>
//           </div>
//           {isSyllabusOpen ? (
//             <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           ) : (
//             <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           )}
//         </button>
        
//         {isSyllabusOpen && (
//           <div className="mt-1 ml-2 space-y-0.5">
//             <SubNavItem icon={List} label="All Syllabuses" path="/dashboard/admin/syllabus" />
//            </div>
//         )}
//       </div>
//     );
//   };

//   // --- 6. ID Cards Dropdown (Admin Only) ---
//   const IDCardsDropdown = () => {
//     const isAnyActive = pathname === "/dashboard/admin/id-cards";

//     return (
//       <div className="mb-1.5">
//         <button 
//           onClick={() => setIsIDCardsOpen(!isIDCardsOpen)}
//           className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
//             isAnyActive
//               ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
//               : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <IdCard size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
//             <span className="text-sm tracking-tight">ID Cards</span>
//           </div>
//           {isIDCardsOpen ? (
//             <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           ) : (
//             <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
//           )}
//         </button>
        
//         {isIDCardsOpen && (
//           <div className="mt-1 ml-2 space-y-0.5">
//             <SubNavItem icon={List} label="All ID Cards" path="/dashboard/admin/id-cards" />
//              </div>
//         )}
//       </div>
//     );
//   };

//   if (!user) return null;

//   // Get user info from localStorage if not in props
//   const userName = user?.name || localStorage.getItem("userName") || "User";
//   const userRole = user?.role || localStorage.getItem("userRole") || "guest";
//   const userEmail = user?.email || localStorage.getItem("userEmail") || "";

//   return (
//     <div className="w-64 bg-slate-900 text-slate-200 flex flex-col shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800 custom-scrollbar">
      
//       {/* Logo Section */}
//       <div className="p-5 pb-0">
//         <div className="flex items-center gap-2 mb-2">
//           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
//             <School className="w-4 h-4 text-white" />
//           </div>
//           <h2 className="text-lg font-bold tracking-tight">
//             <span className="text-blue-500">SMS</span>
//             <span className="text-slate-300"> Hub</span>
//           </h2>
//         </div>
//         <div className="h-px bg-gradient-to-r from-blue-500 to-transparent opacity-50" />
//       </div>
      
//       {/* Navigation Links */}
//       <nav className="flex-1 p-3 space-y-1">
//         {/* Dashboard - Common for all */}
//         <NavItem 
//           icon={LayoutDashboard} 
//           label="Dashboard" 
//           path={getDashboardPath()} 
//         />

//         <div className="pt-4 pb-1 px-2">
//           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Main Menu</p>
//         </div>

//         {/* ==================== STUDENT ONLY ==================== */}
//         {userRole === "student" && (
//           <>
//             <NavItem icon={FileText} label="Assignments" path="/dashboard/student/assignments" />
//             <NavItem icon={Calendar} label="My Attendance" path="/dashboard/student/attendance" />
//             <NavItem icon={IdCard} label="My ID Card" path="/dashboard/student/id-card" />
//             <NavItem icon={FileText} label="Reports" path="/dashboard/student/report" />
//           </>
//         )}

//         {/* ==================== TEACHER ONLY ==================== */}
//         {userRole === "teacher" && (
//           <>
//             <NavItem icon={PenTool} label="Assignments" path="/dashboard/teacher/assignments" />
//             <NavItem icon={ScanLine} label="Submissions" path="/dashboard/teacher/submissions" />
//             <NavItem icon={CheckSquare} label="My Tasks" path="/dashboard/teacher/tasks" />
//             <NavItem icon={Calendar} label="My Attendance" path="/dashboard/teacher/attendance" />
//             <NavItem icon={IdCard} label="My ID Card" path="/dashboard/teacher/id-card" />
//             <NavItem icon={MessageSquare} label="Messages" path="/dashboard/teacher/messages" />
//             <NavItem icon={FileText} label="Reports" path="/dashboard/teacher/reports" />
          
//           </>
//         )}

//         {/* ==================== ADMIN ONLY ==================== */}
//         {userRole === "admin" && (
//           <>
//             <NavItem icon={UserPlus} label="Admissions" path="/dashboard/admin/admissions" />
//             <NavItem icon={LifeBuoy} label="Complaints" path="/dashboard/admin/complaints" />
//             <NavItem icon={Layers} label="Subjects" path="/dashboard/admin/subjects" />
            
//             {/* Syllabus Dropdown */}
//             <SyllabusDropdown />
            
//             {/* ID Cards Dropdown */}
//             <IDCardsDropdown />
            
//             <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
//             <NavItem icon={MessageSquare} label="Messages" path="/dashboard/admin/messages" />
//             <NavItem icon={Users} label="Teachers" path="/dashboard/admin/teachers" />
//             <NavItem icon={GraduationCap} label="Students" path="/dashboard/admin/students" />
//             <NavItem icon={DollarSign} label="Fees" path="/dashboard/admin/fees" />
            
//             </>
//         )}

        

//        </nav>

//       {/* User Profile & Logout */}
//       <div className="p-4 border-t border-slate-800">
//         <div className="flex items-center gap-3 mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
//           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white uppercase shrink-0">
//             {userName.charAt(0) || "U"}
//           </div>
//           <div className="overflow-hidden flex-1">
//             <p className="text-sm font-medium truncate text-slate-200">{userName}</p>
//             <p className="text-xs text-blue-400 capitalize">{userRole}</p>
//             {userEmail && <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>}
//           </div>
//         </div>

//         <button 
//           onClick={handleLogout} 
//           className="w-full py-2.5 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-medium text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2 group cursor-pointer"
//         >
//           <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// // School icon for logo
// const School = ({ size, className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
//     <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//   </svg>
// );








"use client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { 
  LayoutDashboard, ScanLine, ClipboardCheck, 
  GraduationCap, Users, Receipt, LogOut, 
  BookOpen, MessageSquare, UserPlus, PenTool, 
  FileText, Layers, LifeBuoy, Sparkles,
  Upload, Eye, List, ChevronDown, ChevronRight,
  IdCard, Home, Settings, HelpCircle, Bell,
  Calendar, DollarSign, Award, Target, CheckSquare,
  BookMarked, Mail, Phone, MapPin, CreditCard,
  QrCode, Download, Printer, RefreshCw,
  Layout, Shield, Sliders, User
} from "lucide-react";
import { useState } from "react";

// Custom School Icon (since lucide-react may not have it)
const SchoolIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

export default function Sidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isStudentIDCardsOpen, setIsStudentIDCardsOpen] = useState(false);
  const [isTeacherIDCardsOpen, setIsTeacherIDCardsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- 1. Dynamic Path Logic ---
  const getDashboardPath = () => {
    if (user?.role === "admin") return "/dashboard/admin";
    if (user?.role === "teacher") return "/dashboard/teacher";
    if (user?.role === "student") return "/dashboard/student";
    return "/dashboard";
  };

  // --- 2. Logout Protocol ---
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userRole = user?.role || localStorage.getItem("userRole");

    if (!userId) {
      localStorage.clear();
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: userRole, token }),
      });

      if (response.ok) {
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      router.push("/login");
    }
  };

  // --- 3. NavItem Sub-Component ---
  const NavItem = ({ icon: Icon, label, path, badge, onClick }) => {
    const isActive = pathname === path;
    
    return (
      <button 
        onClick={() => onClick ? onClick() : router.push(path)} 
        className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 mb-1.5 border ${
          isActive 
            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
            : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={isActive ? "text-white" : "text-slate-500"} />
          <span className="text-sm tracking-tight">{label}</span>
        </div>
        {badge && (
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  };

  // --- 4. SubNavItem for Dropdown Items ---
  const SubNavItem = ({ icon: Icon, label, path }) => {
    const isActive = pathname === path;
    
    return (
      <button 
        onClick={() => router.push(path)} 
        className={`w-full text-left py-2 px-12 rounded-xl transition-all font-medium flex items-center gap-3 mb-1 text-sm ${
          isActive 
            ? "bg-blue-600/30 text-blue-400 border-l-2 border-blue-500" 
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
        }`}
      >
        <Icon size={14} />
        <span>{label}</span>
      </button>
    );
  };

  // --- 5. Syllabus Dropdown (Admin Only) ---
  const SyllabusDropdown = () => {
    const isAnyActive = [
      "/dashboard/admin/syllabus",
      "/dashboard/admin/syllabus/ingest",
    ].includes(pathname) || pathname?.startsWith("/dashboard/admin/syllabus/");

    return (
      <div className="mb-1.5">
        <button 
          onClick={() => setIsSyllabusOpen(!isSyllabusOpen)}
          className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
            isAnyActive
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
            <span className="text-sm tracking-tight">Syllabus</span>
          </div>
          {isSyllabusOpen ? (
            <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          ) : (
            <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          )}
        </button>
        
        {isSyllabusOpen && (
          <div className="mt-1 ml-2 space-y-0.5">
            <SubNavItem icon={List} label="All Syllabuses" path="/dashboard/admin/syllabus" />
            <SubNavItem icon={Upload} label="Upload Syllabus" path="/dashboard/admin/syllabus/ingest" />
          </div>
        )}
      </div>
    );
  };

  // --- 6. Student ID Cards Dropdown (Admin Only) ---
  const StudentIDCardsDropdown = () => {
    const isAnyActive = [
      "/dashboard/admin/id-cards",
      "/dashboard/admin/id-cards/generate"
    ].includes(pathname);

    return (
      <div className="mb-1.5">
        <button 
          onClick={() => setIsStudentIDCardsOpen(!isStudentIDCardsOpen)}
          className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
            isAnyActive
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <IdCard size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
            <span className="text-sm tracking-tight">Student ID Cards</span>
          </div>
          {isStudentIDCardsOpen ? (
            <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          ) : (
            <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          )}
        </button>
        
        {isStudentIDCardsOpen && (
          <div className="mt-1 ml-2 space-y-0.5">
            <SubNavItem icon={List} label="All ID Cards" path="/dashboard/admin/id-cards" />
            <SubNavItem icon={QrCode} label="Generate ID Card" path="/dashboard/admin/id-cards/generate" />
          </div>
        )}
      </div>
    );
  };

  // --- 7. Teacher ID Cards Dropdown (Admin Only) - NEW ---
  const TeacherIDCardsDropdown = () => {
    const isAnyActive = [
      "/dashboard/admin/teacher-id-cards",
      "/dashboard/admin/teacher-id-cards/generate"
    ].includes(pathname);

    return (
      <div className="mb-1.5">
        <button 
          onClick={() => setIsTeacherIDCardsOpen(!isTeacherIDCardsOpen)}
          className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
            isAnyActive
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <IdCard size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
            <span className="text-sm tracking-tight">Teacher ID Cards</span>
          </div>
          {isTeacherIDCardsOpen ? (
            <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          ) : (
            <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          )}
        </button>
        
        {isTeacherIDCardsOpen && (
          <div className="mt-1 ml-2 space-y-0.5">
            <SubNavItem icon={List} label="All Teacher ID Cards" path="/dashboard/admin/teacher-id-cards" />
            <SubNavItem icon={QrCode} label="Generate Teacher ID" path="/dashboard/admin/teacher-id-cards/generate" />
          </div>
        )}
      </div>
    );
  };

  // --- 8. Settings Dropdown (Admin Only) ---
  const SettingsDropdown = () => {
    const isAnyActive = [
      "/dashboard/admin/settings",
      "/dashboard/admin/sections",
      "/dashboard/admin/settings/profile"
    ].includes(pathname);

    return (
      <div className="mb-1.5">
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`w-full text-left p-3 rounded-xl transition-all font-medium flex items-center justify-between gap-3 border ${
            isAnyActive
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
              : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600"
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className={isAnyActive ? "text-white" : "text-slate-500"} />
            <span className="text-sm tracking-tight">Settings</span>
          </div>
          {isSettingsOpen ? (
            <ChevronDown size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          ) : (
            <ChevronRight size={16} className={isAnyActive ? "text-white" : "text-slate-500"} />
          )}
        </button>
        
        {isSettingsOpen && (
          <div className="mt-1 ml-2 space-y-0.5">
            <SubNavItem icon={Sliders} label="Class Sections" path="/dashboard/admin/sections" />
            <SubNavItem icon={User} label="Profile" path="/dashboard/admin/profile" />
          </div>
        )}
      </div>
    );
  };

  if (!user) return null;

  // Get user info from localStorage if not in props
  const userName = user?.name || localStorage.getItem("userName") || "User";
  const userRole = user?.role || localStorage.getItem("userRole") || "guest";
  const userEmail = user?.email || localStorage.getItem("userEmail") || "";

  return (
    <div className="w-64 bg-slate-900 text-slate-200 flex flex-col shadow-2xl h-screen sticky top-0 overflow-y-auto border-r border-slate-800 custom-scrollbar">
      
      {/* Logo Section */}
      <div className="p-5 pb-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <SchoolIcon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            <span className="text-blue-500">SMS</span>
            <span className="text-slate-300"> Hub</span>
          </h2>
        </div>
        <div className="h-px bg-gradient-to-r from-blue-500 to-transparent opacity-50" />
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {/* Dashboard - Common for all */}
        <NavItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          path={getDashboardPath()} 
        />

        <div className="pt-4 pb-1 px-2">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Main Menu</p>
        </div>

        {/* ==================== STUDENT ONLY ==================== */}
        {userRole === "student" && (
          <>
            <NavItem icon={FileText} label="Assignments" path="/dashboard/student/assignments" />
            <NavItem icon={Calendar} label="My Attendance" path="/dashboard/student/attendance" />
            <NavItem icon={IdCard} label="My ID Card" path="/dashboard/student/id-card" />
            <NavItem icon={FileText} label="Reports" path="/dashboard/student/report" />
          </>
        )}

        {/* ==================== TEACHER ONLY ==================== */}
        {userRole === "teacher" && (
          <>
            <NavItem icon={PenTool} label="Assignments" path="/dashboard/teacher/assignments" />
            <NavItem icon={ScanLine} label="Submissions" path="/dashboard/teacher/submissions" />
            <NavItem icon={CheckSquare} label="My Tasks" path="/dashboard/teacher/tasks" />
            <NavItem icon={Calendar} label="My Attendance" path="/dashboard/teacher/attendance" />
            <NavItem icon={IdCard} label="My ID Card" path="/dashboard/teacher/id-card" />
            <NavItem icon={MessageSquare} label="Messages" path="/dashboard/teacher/messages" />
            <NavItem icon={FileText} label="Reports" path="/dashboard/teacher/reports" />
          </>
        )}

        {/* ==================== ADMIN ONLY ==================== */}
        {userRole === "admin" && (
          <>
            <NavItem icon={UserPlus} label="Admissions" path="/dashboard/admin/admissions" />
            <NavItem icon={LifeBuoy} label="Complaints" path="/dashboard/admin/complaints" />
            <NavItem icon={Layers} label="Subjects" path="/dashboard/admin/subjects" />
            
            {/* Syllabus Dropdown */}
            <SyllabusDropdown />
            
            {/* Student ID Cards Dropdown */}
            <StudentIDCardsDropdown />
            
            {/* Teacher ID Cards Dropdown - NEW */}
            <TeacherIDCardsDropdown />
            
            <NavItem icon={ClipboardCheck} label="Task Manager" path="/dashboard/admin/tasks" />
            <NavItem icon={MessageSquare} label="Messages" path="/dashboard/admin/messages" />
            <NavItem icon={Users} label="Teachers" path="/dashboard/admin/teachers" />
            <NavItem icon={GraduationCap} label="Students" path="/dashboard/admin/students" />
            <NavItem icon={DollarSign} label="Fees" path="/dashboard/admin/fees" />
            
            {/* Settings Dropdown */}
            <SettingsDropdown />
          </>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white uppercase shrink-0">
            {userName.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium truncate text-slate-200">{userName}</p>
            <p className="text-xs text-blue-400 capitalize">{userRole}</p>
            {userEmail && <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>}
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="w-full py-2.5 bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl font-medium text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> 
          Logout
        </button>
      </div>
    </div>
  );
}