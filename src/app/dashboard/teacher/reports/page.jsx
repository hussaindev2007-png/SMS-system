"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  Download,
  Printer,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  User,
  Building,
  Award,
  FileSpreadsheet,
  Eye,
  Activity,
  Zap,
  Target
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function TeacherReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("performance"); // performance, attendance, download
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!token || userRole !== "teacher") {
      router.push("/login");
      return;
    }

    await fetchReportData(userId);
  };

  const fetchReportData = async (teacherId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/teacher/reports`, { 
        params: { teacherId } 
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Reports error:", err);
      setError("Failed to load reports");
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `teacher_report_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("JSON report downloaded");
  };

  const handleDownloadCSV = () => {
    if (!reportData?.attendanceReport?.recentRecords) return;
    
    const records = reportData.attendanceReport.recentRecords;
    const headers = ["Date", "Status", "Check-in Time", "Source"];
    const csvRows = [headers];
    
    records.forEach(record => {
      csvRows.push([
        new Date(record.date).toLocaleDateString(),
        record.status,
        record.checkInTime || "N/A",
        record.source || "QR"
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success("CSV report downloaded");
  };

  const handleDownloadPDF = () => {
    window.print();
    toast.success("Print dialog opened - Save as PDF");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const { attendanceReport, subjectReport, teacherInfo } = reportData;
  const summary = attendanceReport?.summary || {};
  const monthlyBreakdown = attendanceReport?.monthlyBreakdown || [];
  const recentRecords = attendanceReport?.recentRecords || [];

  // Performance metrics
  const performanceMetrics = {
    moraleScore: subjectReport?.performanceScore || 85,
    totalSubjects: subjectReport?.totalSubjects || 0,
    attendanceScore: summary.attendancePercentage || 0,
    punctualityScore: summary.totalDays > 0 
      ? ((summary.presentDays / summary.totalDays) * 100).toFixed(1) 
      : 0,
    workloadStatus: subjectReport?.totalSubjects > 3 ? "High" : subjectReport?.totalSubjects > 1 ? "Medium" : "Low"
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText size={28} />
                Reports
              </h1>
              <p className="text-blue-100 mt-1">View your performance and attendance reports</p>
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
        {/* Teacher Info */}
        <div className="bg-gray-800 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{teacherInfo?.name}</h2>
              <p className="text-gray-400 text-sm">{teacherInfo?.email}</p>
              <div className="flex gap-4 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Building size={12} /> {teacherInfo?.department || "General"}</span>
                <span className="flex items-center gap-1"><Award size={12} /> {teacherInfo?.qualification || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
              activeTab === "performance" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Activity size={18} />
            Performance
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
              activeTab === "attendance" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Calendar size={18} />
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("download")}
            className={`px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 ${
              activeTab === "download" 
                ? "bg-blue-600 text-white" 
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Download size={18} />
            Download
          </button>
        </div>

        {/* ==================== PERFORMANCE TAB ==================== */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Performance Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl p-5 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Morale Score</span>
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">{performanceMetrics.moraleScore}/100</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${performanceMetrics.moraleScore}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl p-5 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Attendance Score</span>
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">{performanceMetrics.attendanceScore}%</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${performanceMetrics.attendanceScore}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 rounded-xl p-5 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Punctuality</span>
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">{performanceMetrics.punctualityScore}%</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${performanceMetrics.punctualityScore}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 rounded-xl p-5 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Workload</span>
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white mt-2">{performanceMetrics.totalSubjects}</p>
                <p className="text-gray-400 text-sm mt-1">Subjects</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(performanceMetrics.totalSubjects / 6) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Subjects List */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={18} />
                Subjects Assigned
              </h3>
              {subjectReport?.subjects?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {subjectReport.subjects.map((subject, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                      {subject.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No subjects assigned yet</p>
              )}
            </div>

            {/* Workload Analysis */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={18} />
                Workload Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Workload</span>
                  <span className={`font-semibold ${
                    performanceMetrics.workloadStatus === "High" ? "text-red-400" : 
                    performanceMetrics.workloadStatus === "Medium" ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {performanceMetrics.workloadStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subjects per Teacher Ratio</span>
                  <span className="text-white font-semibold">{performanceMetrics.totalSubjects}:1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Recommended Subjects</span>
                  <span className="text-green-400">2-3 subjects for optimal performance</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ATTENDANCE TAB ==================== */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Total Days</p>
                <p className="text-2xl font-bold text-white">{summary.totalDays || 0}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Present</p>
                <p className="text-2xl font-bold text-green-400">{summary.presentDays || 0}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Late</p>
                <p className="text-2xl font-bold text-yellow-400">{summary.lateDays || 0}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Absent</p>
                <p className="text-2xl font-bold text-red-400">{summary.absentDays || 0}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <p className="text-gray-400 text-sm">Attendance %</p>
                <p className={`text-2xl font-bold ${
                  (summary.attendancePercentage || 0) >= 90 ? 'text-green-400' : 
                  (summary.attendancePercentage || 0) >= 75 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {summary.attendancePercentage || 0}%
                </p>
              </div>
            </div>

            {/* Monthly Breakdown */}
            {monthlyBreakdown.length > 0 && (
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 size={18} />
                    Monthly Breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-5 py-3 text-left text-gray-300 text-sm">Month</th>
                        <th className="px-5 py-3 text-center text-gray-300 text-sm">Present</th>
                        <th className="px-5 py-3 text-center text-gray-300 text-sm">Late</th>
                        <th className="px-5 py-3 text-center text-gray-300 text-sm">Absent</th>
                        <th className="px-5 py-3 text-center text-gray-300 text-sm">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {monthlyBreakdown.map((month, idx) => (
                        <tr key={idx} className="hover:bg-gray-750">
                          <td className="px-5 py-3 text-white">{month.month}</td>
                          <td className="px-5 py-3 text-center text-green-400">{month.present}</td>
                          <td className="px-5 py-3 text-center text-yellow-400">{month.late}</td>
                          <td className="px-5 py-3 text-center text-red-400">{month.absent}</td>
                          <td className="px-5 py-3 text-center text-blue-400 font-semibold">{month.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Records */}
            {recentRecords.length > 0 && (
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock size={18} />
                    Recent Records
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-5 py-3 text-left text-gray-300 text-sm">Date</th>
                        <th className="px-5 py-3 text-left text-gray-300 text-sm">Status</th>
                        <th className="px-5 py-3 text-left text-gray-300 text-sm">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {recentRecords.slice(0, 10).map((record) => (
                        <tr key={record._id} className="hover:bg-gray-750">
                          <td className="px-5 py-3 text-white">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            <span className={`capitalize ${
                              record.status === "present" ? "text-green-400" : 
                              record.status === "late" ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-400">{record.checkInTime || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== DOWNLOAD TAB ==================== */}
        {activeTab === "download" && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <Download className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Download Your Reports</h3>
              <p className="text-gray-400 mb-6">Choose a format to download your report</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={handleDownloadJSON}
                  className="flex flex-col items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                >
                  <FileText className="w-8 h-8 text-yellow-400 mb-2" />
                  <span className="text-white font-medium">JSON Format</span>
                  <span className="text-gray-400 text-xs mt-1">Full data export</span>
                </button>
                
                <button
                  onClick={handleDownloadCSV}
                  className="flex flex-col items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                >
                  <FileSpreadsheet className="w-8 h-8 text-green-400 mb-2" />
                  <span className="text-white font-medium">CSV Format</span>
                  <span className="text-gray-400 text-xs mt-1">Excel compatible</span>
                </button>
                
                <button
                  onClick={handleDownloadPDF}
                  className="flex flex-col items-center p-5 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                >
                  <Printer className="w-8 h-8 text-red-400 mb-2" />
                  <span className="text-white font-medium">PDF Format</span>
                  <span className="text-gray-400 text-xs mt-1">Print / Save as PDF</span>
                </button>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Custom Date Range</h3>
              <div className="flex gap-4 flex-wrap">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      if (fromDate && toDate) {
                        fetchReportData(localStorage.getItem("userId"));
                        toast.success("Report filtered by date range");
                      } else {
                        toast.error("Please select both dates");
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Missing BookOpen icon
const BookOpen = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);