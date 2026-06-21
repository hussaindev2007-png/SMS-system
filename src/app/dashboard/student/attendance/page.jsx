

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Download,
  Users,
  Award,
  ArrowUp,
  Eye,
  Monitor,
  Smartphone,
  QrCode,
  Brain,
  TrendingUp,
  Shield,
  Bell,
  Sparkles,
  Zap
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function StudentAttendancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [selectedMonth, selectedYear, aiEnabled]);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!token || userRole !== "student") {
      router.push("/login");
      return;
    }

    await fetchAttendanceData(userId);
  };

  const fetchAttendanceData = async (studentId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/student/attendance`, {
        params: { 
          studentId, 
          month: selectedMonth, 
          year: selectedYear,
          ai: aiEnabled
        }
      });
      
      if (response.data.success) {
        setAttendanceData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Attendance error:", err);
      setError("Failed to load attendance data");
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "present":
        return { icon: CheckCircle, text: "Present", bg: "bg-green-500/10", textColor: "text-green-400", border: "border-green-500/20" };
      case "absent":
        return { icon: XCircle, text: "Absent", bg: "bg-red-500/10", textColor: "text-red-400", border: "border-red-500/20" };
      case "late":
        return { icon: Clock, text: "Late", bg: "bg-yellow-500/10", textColor: "text-yellow-400", border: "border-yellow-500/20" };
      case "leave":
        return { icon: Calendar, text: "Leave", bg: "bg-blue-500/10", textColor: "text-blue-400", border: "border-blue-500/20" };
      default:
        return { icon: AlertCircle, text: "Unknown", bg: "bg-gray-500/10", textColor: "text-gray-400", border: "border-gray-500/20" };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time || time === "N/A" || time === "--:--") return "--:--";
    
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }
    
    try {
      const date = new Date(time);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
    } catch (e) {
      return time;
    }
    
    return time;
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2023, 2024, 2025, 2026, 2027];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading attendance records with AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { 
    records = [], 
    stats = {}, 
    chartData = [], 
    weeklyStats = [],
    weeklyPresent = [],
    weeklyLate = [],
    weeklyAbsent = [],
    aiInsights = null
  } = attendanceData || {};
  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const weeklyData = daysOfWeek.map((day, index) => ({
    day,
    total: weeklyStats[index] || 0,
    present: weeklyPresent[index] || 0,
    late: weeklyLate[index] || 0,
    absent: weeklyAbsent[index] || 0
  }));

  const maxAttendance = Math.max(...weeklyData.map(d => d.total), 1);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Brain className="w-64 h-64 text-white" />
        </div>
        <div className="px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">📊 Attendance Dashboard</h1>
                {aiInsights && (
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs flex items-center gap-1 animate-pulse">
                    <Zap size={12} className="text-yellow-300" />
                    AI-Powered
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm mt-1">Real-time attendance tracking with AI insights</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 text-sm"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* 🤖 AI Insights Section */}
        {aiInsights && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* AI Prediction Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={12} className="text-blue-400" />
                    AI Prediction
                  </p>
                  <p className="text-3xl font-bold mt-1 text-blue-400">
                    {aiInsights.predictedAttendance || stats.attendancePercentage || 0}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {aiInsights.nextWeekPrediction || "Predicting next week..."}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${aiInsights.predictedAttendance || stats.attendancePercentage || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {aiInsights.performanceMessage || "Keep up the good work!"}
              </p>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-5 border border-red-500/20 hover:border-red-500/40 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Shield size={12} className="text-red-400" />
                    Risk Assessment
                  </p>
                  <p className={`text-3xl font-bold mt-1 ${
                    aiInsights.riskLevel === 'Low' ? 'text-green-400' : 
                    aiInsights.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {aiInsights.riskLevel || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {aiInsights.riskFactors?.[0] || "Analyzing risk factors..."}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
              {aiInsights.alerts && aiInsights.alerts.length > 0 && aiInsights.alerts.map((alert, idx) => (
                <div key={idx} className={`mt-2 text-xs flex items-center gap-1 ${
                  alert.priority === 'high' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  <Bell size={12} />
                  <span>{alert.message}</span>
                </div>
              ))}
              {(!aiInsights.alerts || aiInsights.alerts.length === 0) && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>No critical alerts</span>
                </div>
              )}
            </div>

            {/* Smart Recommendations */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} className="text-green-400" />
                    AI Recommendations
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {aiInsights.recommendations && aiInsights.recommendations.slice(0, 3).map((rec, idx) => (
                      <p key={idx} className="text-sm text-gray-300 flex items-start gap-1.5">
                        <span className="text-green-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ml-3">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111128] rounded-2xl p-5 border border-white/5 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Total Attendance</p>
                <p className="text-2xl font-bold mt-1">{stats.totalDays || 0}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-400">Present {stats.presentDays || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span className="text-gray-400">Absent {stats.absentDays || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111128] rounded-2xl p-5 border border-white/5 hover:border-pink-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Check-in Methods</p>
                <p className="text-2xl font-bold mt-1">{stats.totalDays || 0}</p>
                <p className="text-gray-400 text-xs">Total Check-ins</p>
              </div>
              <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3 text-xs">
              <span className="px-2 py-1 bg-purple-500/20 rounded-lg text-purple-300 flex items-center gap-1">
                <Monitor size={10} /> Web
              </span>
              <span className="px-2 py-1 bg-blue-500/20 rounded-lg text-blue-300 flex items-center gap-1">
                <Smartphone size={10} /> Mobile
              </span>
              <span className="px-2 py-1 bg-orange-500/20 rounded-lg text-orange-300 flex items-center gap-1">
                <QrCode size={10} /> QR
              </span>
            </div>
          </div>

          <div className="bg-[#111128] rounded-2xl p-5 border border-white/5 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Staff Performance</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.attendancePercentage || 0}
                  <span className="text-sm text-gray-400 font-normal">/100</span>
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs">
              <ArrowUp className="w-3 h-3 text-green-400" />
              <span className="text-green-400">
                {stats.attendancePercentage > 75 ? 'Excellent' : stats.attendancePercentage > 60 ? 'Good' : 'Needs Improvement'}
              </span>
              <span className="text-gray-400">this month</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${stats.attendancePercentage || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-[#111128] rounded-2xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Attendance Overview</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.attendancePercentage || 0}
                  <span className="text-sm text-gray-400 font-normal">%</span>
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {stats.attendancePercentage > 80 ? '🎯 Excellent' : stats.attendancePercentage > 60 ? '📈 Good' : '📉 Needs Improvement'} 
              {' '}{stats.totalDays || 0} days recorded
            </p>
            <div className="w-full bg-white/5 rounded-full h-1.5 mt-3">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${stats.attendancePercentage || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Attendance Chart */}
          <div className="bg-[#111128] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold">Attendance</h3>
                <p className="text-xs text-gray-400">Last 7 Days</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button 
                  onClick={() => setViewMode("week")}
                  className={`px-3 py-1 rounded-lg transition-all ${viewMode === "week" ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400 hover:text-white'}`}
                >
                  Week
                </button>
                <button 
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1 rounded-lg transition-all ${viewMode === "month" ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400 hover:text-white'}`}
                >
                  Month
                </button>
              </div>
            </div>

            <div className="relative h-48">
              <div className="flex items-end justify-between h-full gap-2">
                {weeklyData.map((data, idx) => {
                  const totalHeight = (data.total / maxAttendance) * 150;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div className="relative w-full flex justify-center gap-0.5">
                        {data.present > 0 && (
                          <div 
                            className="w-3 bg-gradient-to-t from-green-400 to-emerald-400 rounded-t-sm transition-all hover:from-green-300 hover:to-emerald-300 cursor-pointer"
                            style={{ 
                              height: `${(data.present / maxAttendance) * 150 || 4}px`,
                              minHeight: '4px'
                            }}
                            title={`Present: ${data.present}`}
                          />
                        )}
                        {data.late > 0 && (
                          <div 
                            className="w-3 bg-gradient-to-t from-yellow-400 to-orange-400 rounded-t-sm transition-all hover:from-yellow-300 hover:to-orange-300 cursor-pointer"
                            style={{ 
                              height: `${(data.late / maxAttendance) * 150 || 4}px`,
                              minHeight: '4px'
                            }}
                            title={`Late: ${data.late}`}
                          />
                        )}
                        {data.absent > 0 && (
                          <div 
                            className="w-3 bg-gradient-to-t from-red-400 to-pink-400 rounded-t-sm transition-all hover:from-red-300 hover:to-pink-300 cursor-pointer"
                            style={{ 
                              height: `${(data.absent / maxAttendance) * 150 || 4}px`,
                              minHeight: '4px'
                            }}
                            title={`Absent: ${data.absent}`}
                          />
                        )}
                        {data.total === 0 && (
                          <div 
                            className="w-3 bg-gray-600/30 rounded-t-sm"
                            style={{ height: '4px' }}
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">{data.day}</p>
                      <p className="text-xs text-white mt-1 font-bold">{data.total}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-400">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-xs text-gray-400">Late</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-xs text-gray-400">Absent</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white/5 rounded-lg text-center">
              <p className="text-xs text-gray-400">
                Total this week: <span className="text-white font-bold">{weeklyData.reduce((sum, d) => sum + d.total, 0)}</span> records
              </p>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="bg-[#111128] rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-semibold mb-4">Monthly Overview</h3>
            {chartData && chartData.length > 0 && chartData.some(m => m.present + m.absent + m.late + m.leave > 0) ? (
              <div className="space-y-4">
                {chartData.map((month, idx) => {
                  const total = month.present + month.absent + month.late + month.leave;
                  const maxTotal = Math.max(...chartData.map(m => m.present + m.absent + m.late + m.leave), 1);
                  const presentPct = (month.present / maxTotal) * 100;
                  const absentPct = (month.absent / maxTotal) * 100;
                  const latePct = (month.late / maxTotal) * 100;
                  
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">{month.name}</span>
                        <span className="text-white font-medium">{total} days</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden flex">
                        {month.present > 0 && (
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all"
                            style={{ width: `${presentPct}%` }}
                            title={`Present: ${month.present}`}
                          />
                        )}
                        {month.late > 0 && (
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all"
                            style={{ width: `${latePct}%` }}
                            title={`Late: ${month.late}`}
                          />
                        )}
                        {month.absent > 0 && (
                          <div 
                            className="bg-gradient-to-r from-red-400 to-pink-500 h-full transition-all"
                            style={{ width: `${absentPct}%` }}
                            title={`Absent: ${month.absent}`}
                          />
                        )}
                        {month.leave > 0 && (
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-full transition-all"
                            style={{ width: `${(month.leave / maxTotal) * 100}%` }}
                            title={`Leave: ${month.leave}`}
                          />
                        )}
                      </div>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-green-400">P: {month.present}</span>
                        <span className="text-yellow-400">L: {month.late}</span>
                        <span className="text-red-400">A: {month.absent}</span>
                        </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No monthly data available</p>
                <p className="text-gray-500 text-xs mt-1">Start marking attendance to see data</p>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#111128] rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between border border-white/5">
          <div className="flex gap-3 items-center">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 bg-[#1a1a3a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 bg-[#1a1a3a] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5 ${
                aiEnabled 
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30' 
                  : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
              }`}
            >
              <Brain size={14} />
              AI {aiEnabled ? 'On' : 'Off'}
            </button>
          </div>
          
        </div>

        {/* Attendance Records Table */}
        {records.length === 0 ? (
          <div className="bg-[#111128] rounded-2xl p-12 text-center border border-white/5">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No attendance records found</p>
            <p className="text-gray-500 text-sm mt-2">
              {selectedMonth && selectedYear 
                ? `No records for ${months[selectedMonth - 1]} ${selectedYear}`
                : "Attendance records will appear here"}
            </p>
          </div>
        ) : (
          <div className="bg-[#111128] rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a3a]">
                  <tr>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Student</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Roll No</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Class</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Check-in</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-xs font-semibold uppercase tracking-wider">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((record) => {
                    const status = getStatusBadge(record.status);
                    const StatusIcon = status.icon;
                    return (
                      <tr key={record._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-sm text-white">
                          {record.studentName || "Unknown"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-400 font-mono">
                          {record.rollNo || "--"}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-400">
                          {record.className} {record.section}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-400">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-300 font-mono">
                          {formatTime(record.checkInTime)}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${status.bg} ${status.textColor} ${status.border}`}>
                            <StatusIcon size={12} />
                            {status.text}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-400">
                          {record.verifiedBy || "QR Scan"}
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
    </div>
  );
}
