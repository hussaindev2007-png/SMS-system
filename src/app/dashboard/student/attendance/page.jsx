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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
  Download,
  UserCheck
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

  useEffect(() => {
    checkAuthAndFetchData();
  }, [selectedMonth, selectedYear]);

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
          year: selectedYear 
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
        return { icon: CheckCircle, text: "Present", color: "green", bg: "bg-green-500/20", textColor: "text-green-400" };
      case "absent":
        return { icon: XCircle, text: "Absent", color: "red", bg: "bg-red-500/20", textColor: "text-red-400" };
      case "late":
        return { icon: Clock, text: "Late", color: "yellow", bg: "bg-yellow-500/20", textColor: "text-yellow-400" };
      case "leave":
        return { icon: Calendar, text: "Leave", color: "blue", bg: "bg-blue-500/20", textColor: "text-blue-400" };
      default:
        return { icon: AlertCircle, text: "Unknown", color: "gray", bg: "bg-gray-500/20", textColor: "text-gray-400" };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time || time === "N/A") return "N/A";
    
    // Check if time is already formatted
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }
    
    // Try to parse if it's a timestamp
    try {
      const date = new Date(time);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { records = [], stats = {}, chartData = [] } = attendanceData || {};

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Attendance</h1>
              <p className="text-blue-100 mt-1">Track your attendance records</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-750 transition-colors">
            <p className="text-gray-400 text-sm">Total Days</p>
            <p className="text-2xl font-bold text-white">{stats.totalDays || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-750 transition-colors">
            <p className="text-gray-400 text-sm">Present</p>
            <p className="text-2xl font-bold text-green-400">{stats.presentDays || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-750 transition-colors">
            <p className="text-gray-400 text-sm">Absent</p>
            <p className="text-2xl font-bold text-red-400">{stats.absentDays || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-750 transition-colors">
            <p className="text-gray-400 text-sm">Late</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.lateDays || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-750 transition-colors">
            <p className="text-gray-400 text-sm">Attendance %</p>
            <p className={`text-2xl font-bold ${
              (stats.attendancePercentage || 0) >= 75 ? 'text-green-400' : 
              (stats.attendancePercentage || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {stats.attendancePercentage || 0}%
            </p>
          </div>
        </div>

        {/* Chart Section */}
        {chartData.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Monthly Overview
            </h3>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex items-end justify-around h-64">
                  {chartData.map((month, idx) => {
                    const total = month.present + month.absent + month.late;
                    const maxTotal = Math.max(...chartData.map(m => m.present + m.absent + m.late), 1);
                    return (
                      <div key={idx} className="text-center">
                        <div className="flex gap-1 mb-2">
                          <div 
                            className="w-8 bg-green-500 rounded-t transition-all hover:bg-green-400 cursor-pointer"
                            style={{ height: `${(month.present / maxTotal) * 150}px` }}
                            title={`Present: ${month.present}`}
                          />
                          <div 
                            className="w-8 bg-red-500 rounded-t transition-all hover:bg-red-400 cursor-pointer"
                            style={{ height: `${(month.absent / maxTotal) * 150}px` }}
                            title={`Absent: ${month.absent}`}
                          />
                          <div 
                            className="w-8 bg-yellow-500 rounded-t transition-all hover:bg-yellow-400 cursor-pointer"
                            style={{ height: `${(month.late / maxTotal) * 150}px` }}
                            title={`Late: ${month.late}`}
                          />
                        </div>
                        <p className="text-gray-400 text-xs">{month.name}</p>
                        <p className="text-white text-xs mt-1">{total} days</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-400 text-xs">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-400 text-xs">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-400 text-xs">Late</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            Download Report
          </button>
        </div>

        {/* Attendance Records Table */}
        {records.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No attendance records found</p>
            <p className="text-gray-500 text-sm mt-2">
              {selectedMonth && selectedYear 
                ? `No records for ${months[selectedMonth - 1]} ${selectedYear}`
                : "Attendance records will appear here"}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-5 py-3 text-left text-gray-300 text-sm font-semibold">Date</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-sm font-semibold">Day</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-sm font-semibold">Status</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-sm font-semibold">Check-in Time</th>
                    <th className="px-5 py-3 text-left text-gray-300 text-sm font-semibold">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {records.map((record) => {
                    const status = getStatusBadge(record.status);
                    const StatusIcon = status.icon;
                    const displayTime = formatTime(record.checkInTime);
                    return (
                      <tr key={record._id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-5 py-3 text-white">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-5 py-3 text-gray-400">
                          {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
                            <StatusIcon size={12} />
                            {status.text}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {displayTime !== "N/A" ? (
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-gray-500" />
                              <span className="text-gray-300 font-mono text-sm">{displayTime}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">{displayTime}</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            <UserCheck size={12} className="text-gray-500" />
                            <span className="text-gray-400 text-sm">{record.verifiedBy || "QR Scan"}</span>
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
    </div>
  );
}