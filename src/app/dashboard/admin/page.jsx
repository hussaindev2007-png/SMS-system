// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { 
//   Users, GraduationCap, BookOpen, DollarSign, 
//   TrendingUp, Calendar, Activity, Shield, 
//   Zap, AlertCircle, CheckCircle, Clock, 
//   UserCheck, UserX, BarChart3, RefreshCw,
//   Wifi, WifiOff, Brain, Sparkles
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "react-hot-toast";

// export default function AdminDashboard() {
//   const [refreshing, setRefreshing] = useState(false);

//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ["admin-stats"],
//     queryFn: async () => {
//       const res = await fetch("/api/admin/stats");
//       if (!res.ok) throw new Error("Failed to fetch");
//       return res.json();
//     },
//   });

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await refetch();
//     toast.success("Dashboard refreshed!");
//     setRefreshing(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//           <p className="mt-4 text-slate-500 font-medium">Loading dashboard analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   const stats = data?.summary || { totalTeachers: 0, totalStudents: 0, onlineTeachers: 0, onlineStudents: 0 };
//   const aiAnalytics = data?.aiAnalytics || { systemStatus: "STABLE", aiInsight: "Loading insights...", alerts: [] };
//   const latestTeachers = data?.latestTeachers || [];

//   const teacherAttendanceRate = stats.totalTeachers > 0 
//     ? Math.round((stats.onlineTeachers / stats.totalTeachers) * 100) 
//     : 0;

//   const studentTeacherRatio = stats.totalTeachers > 0 
//     ? (stats.totalStudents / stats.totalTeachers).toFixed(1) 
//     : stats.totalStudents;

//   // Status color mapping
//   const statusColors = {
//     EXCELLENT: "text-emerald-600 bg-emerald-50 border-emerald-200",
//     STABLE: "text-blue-600 bg-blue-50 border-blue-200",
//     WARNING: "text-yellow-600 bg-yellow-50 border-yellow-200",
//     CRITICAL: "text-red-600 bg-red-50 border-red-200",
//   };

//   const statusIcons = {
//     EXCELLENT: <CheckCircle size={20} />,
//     STABLE: <Activity size={20} />,
//     WARNING: <AlertCircle size={20} />,
//     CRITICAL: <Zap size={20} />,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
//               <BarChart3 size={28} className="text-indigo-600" />
//               Admin Dashboard
//             </h1>
//             <p className="text-slate-500 text-sm mt-1">Real-time analytics and system insights</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
//           >
//             <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
//             {refreshing ? "Refreshing..." : "Refresh Data"}
//           </button>
//         </div>

//         {/* AI Analytics Card */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Brain size={24} className="text-white/80" />
//               <span className="text-sm font-semibold tracking-wide text-white/80">AI EXECUTIVE INSIGHTS</span>
//             </div>
//             <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusColors[aiAnalytics.systemStatus] || statusColors.STABLE} bg-white/20 backdrop-blur-sm`}>
//               {statusIcons[aiAnalytics.systemStatus] || statusIcons.STABLE}
//               <span>SYSTEM {aiAnalytics.systemStatus || "STABLE"}</span>
//             </div>
//           </div>
//           <p className="text-lg font-medium leading-relaxed mb-4">{aiAnalytics.aiInsight}</p>
//           {aiAnalytics.alerts?.length > 0 && (
//             <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
//               <p className="text-xs font-semibold tracking-wide text-white/80 mb-2">ACTIONABLE ALERTS</p>
//               {aiAnalytics.alerts.map((alert, i) => (
//                 <div key={i} className="flex items-start gap-2 text-sm text-white/90 mt-1">
//                   <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
//                   <span>{alert}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </motion.div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-slate-500 font-medium">Total Teachers</p>
//                 <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalTeachers}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
//                     <UserCheck size={10} /> {stats.onlineTeachers} Online
//                   </div>
//                 </div>
//               </div>
//               <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
//                 <GraduationCap size={22} className="text-indigo-600" />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-slate-500 font-medium">Total Students</p>
//                 <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalStudents}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
//                     <Wifi size={10} /> {stats.onlineStudents} Online
//                   </div>
//                 </div>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                 <Users size={22} className="text-blue-600" />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-slate-500 font-medium">Teacher Attendance</p>
//                 <p className="text-3xl font-bold text-slate-900 mt-1">{teacherAttendanceRate}%</p>
//                 <p className="text-xs text-slate-500 mt-2">Currently active</p>
//               </div>
//               <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
//                 <Activity size={22} className="text-emerald-600" />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-slate-500 font-medium">Student-Teacher Ratio</p>
//                 <p className="text-3xl font-bold text-slate-900 mt-1">{studentTeacherRatio}:1</p>
//                 <p className="text-xs text-slate-500 mt-2">Optimal: 20:1</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <TrendingUp size={22} className="text-purple-600" />
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Recent Teachers & Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Recent Teachers */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//             <div className="p-5 border-b border-slate-100">
//               <h3 className="font-semibold text-slate-900 flex items-center gap-2">
//                 <Users size={18} className="text-indigo-600" />
//                 Recently Joined Teachers
//               </h3>
//             </div>
//             <div className="divide-y divide-slate-100">
//               {latestTeachers.length === 0 ? (
//                 <div className="p-8 text-center text-slate-400">No teachers found</div>
//               ) : (
//                 latestTeachers.map((teacher, i) => (
//                   <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
//                         <span className="font-bold text-indigo-600">{teacher.name?.charAt(0) || "T"}</span>
//                       </div>
//                       <div>
//                         <p className="font-medium text-slate-800">{teacher.name}</p>
//                         <p className="text-xs text-slate-500">{teacher.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {teacher.isOnline ? (
//                         <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                           <Wifi size={10} /> Online
//                         </span>
//                       ) : (
//                         <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
//                           <WifiOff size={10} /> Offline
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </motion.div>

//           {/* Quick Actions */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//             <div className="p-5 border-b border-slate-100">
//               <h3 className="font-semibold text-slate-900 flex items-center gap-2">
//                 <Zap size={18} className="text-yellow-500" />
//                 Quick Actions
//               </h3>
//             </div>
//             <div className="p-5 space-y-3">
//               <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all group">
//                 <span className="font-medium text-slate-700">Process New Admissions</span>
//                 <span className="text-indigo-600 group-hover:translate-x-1 transition">→</span>
//               </button>
//               <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all group">
//                 <span className="font-medium text-slate-700">Generate ID Cards</span>
//                 <span className="text-indigo-600 group-hover:translate-x-1 transition">→</span>
//               </button>
//               <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all group">
//                 <span className="font-medium text-slate-700">Upload Syllabus</span>
//                 <span className="text-indigo-600 group-hover:translate-x-1 transition">→</span>
//               </button>
//               <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all group">
//                 <span className="font-medium text-slate-700">Manage Fee Records</span>
//                 <span className="text-indigo-600 group-hover:translate-x-1 transition">→</span>
//               </button>
//             </div>
//           </motion.div>
//         </div>

//         {/* System Health Footer */}
//         <div className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-4">
//           <span className="flex items-center gap-1">🟢 System Online</span>
//           <span>Last updated: {new Date().toLocaleString()}</span>
//           <span className="flex items-center gap-1">🤖 AI Analytics Active</span>
//         </div>
//       </div>
//     </div>
//   );
// }











































"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, GraduationCap, BookOpen, DollarSign, 
  TrendingUp, Calendar, Activity, Shield, 
  Zap, AlertCircle, CheckCircle, Clock, 
  UserCheck, UserX, BarChart3, RefreshCw,
  Wifi, WifiOff, Brain, Sparkles, LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    toast.success("Dashboard refreshed!");
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050610] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <p className="mt-4 text-blue-200/70 font-medium tracking-wide">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = data?.summary || { totalTeachers: 0, totalStudents: 0, onlineTeachers: 0, onlineStudents: 0 };
  const aiAnalytics = data?.aiAnalytics || { systemStatus: "STABLE", aiInsight: "Loading insights...", alerts: [] };
  const latestTeachers = data?.latestTeachers || [];

  const teacherAttendanceRate = stats.totalTeachers > 0 
    ? Math.round((stats.onlineTeachers / stats.totalTeachers) * 100) 
    : 0;

  const studentTeacherRatio = stats.totalTeachers > 0 
    ? (stats.totalStudents / stats.totalTeachers).toFixed(1) 
    : stats.totalStudents;

  // NeuroBank Style Status Colors
  const statusColors = {
    EXCELLENT: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    STABLE: "text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    WARNING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
    CRITICAL: "text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  };

  return (
    <div className="min-h-screen bg-[#050610] text-slate-200 p-6 relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                <LayoutDashboard size={24} className="text-blue-400" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-2 ml-1">Real-time analytics and system insights</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl text-sm font-medium text-slate-300 transition-all backdrop-blur-md disabled:opacity-50 shadow-lg"
          >
            <RefreshCw size={16} className={`${refreshing ? "animate-spin text-blue-400" : "text-slate-400 group-hover:text-blue-400"} transition-colors`} />
            {refreshing ? "Syncing..." : "Refresh Data"}
          </button>
        </div>

        {/* AI Analytics Card (Holographic Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-purple-900/40 p-6 shadow-[0_0_30px_rgba(37,99,235,0.15)] backdrop-blur-xl"
        >
          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <Brain size={22} className="text-blue-300" />
              </div>
              <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">AI Executive Insights</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusColors[aiAnalytics.systemStatus] || statusColors.STABLE}`}>
              {aiAnalytics.systemStatus === 'EXCELLENT' || aiAnalytics.systemStatus === 'STABLE' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              <span>SYSTEM {aiAnalytics.systemStatus || "STABLE"}</span>
            </div>
          </div>
          
          <p className="relative z-10 text-lg font-medium leading-relaxed mb-4 text-blue-50">{aiAnalytics.aiInsight}</p>
          
          {aiAnalytics.alerts?.length > 0 && (
            <div className="relative z-10 bg-black/20 border border-white/5 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 mb-3 uppercase">Actionable Alerts</p>
              <div className="space-y-2">
                {aiAnalytics.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <AlertCircle size={16} className="mt-0.5 text-yellow-400 flex-shrink-0" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Teachers", value: stats.totalTeachers, sub: `${stats.onlineTeachers} Online`, icon: GraduationCap, color: "indigo", delay: 0.1 },
            { label: "Total Students", value: stats.totalStudents, sub: `${stats.onlineStudents} Active`, icon: Users, color: "blue", delay: 0.2 },
            { label: "Teacher Attendance", value: `${teacherAttendanceRate}%`, sub: "Currently active", icon: Activity, color: "emerald", delay: 0.3 },
            { label: "Student Ratio", value: `${studentTeacherRatio}:1`, sub: "Optimal: 20:1", icon: TrendingUp, color: "purple", delay: 0.4 },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: stat.delay }} 
              className="group relative bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-lg backdrop-blur-md overflow-hidden"
            >
              {/* Hover Glow Effect */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${stat.color}-500/20 rounded-full blur-3xl group-hover:bg-${stat.color}-500/30 transition-all duration-500`}></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-${stat.color}-400`}>
                      {idx < 2 ? <Wifi size={10} /> : <Activity size={10} />} 
                      {stat.sub}
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                  <stat.icon size={22} className={`text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Teachers & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Teachers List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }} 
            className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md shadow-lg"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Users size={18} className="text-indigo-400" />
                Recently Joined Teachers
              </h3>
              <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">{latestTeachers.length} New</span>
            </div>
            <div className="divide-y divide-white/5">
              {latestTeachers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No recent activity</div>
              ) : (
                latestTeachers.map((teacher, i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                        <span className="font-bold text-indigo-300 text-sm">{teacher.name?.charAt(0) || "T"}</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-200 group-hover:text-white transition-colors">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {teacher.isOnline ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2.5 py-1 rounded-full border border-slate-500/20">
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }} 
            className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md shadow-lg"
          >
            <div className="p-6 border-b border-white/5">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                Quick Actions
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {[
                { title: "Process New Admissions", icon: UserCheck },
                { title: "Generate ID Cards", icon: Shield },
                { title: "Upload Syllabus", icon: BookOpen },
                { title: "Manage Fee Records", icon: DollarSign }
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/40 rounded-xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <action.icon size={18} className="text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{action.title}</span>
                  </div>
                  <span className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">→</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* System Health Footer */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            System Operational
          </span>
          <span className="flex items-center gap-2">
            <Clock size={12} /> Last sync: {new Date().toLocaleTimeString()}
          </span>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400">
            <Sparkles size={12} /> AI Analytics Active
          </span>
        </div>
      </div>
    </div>
  );
}