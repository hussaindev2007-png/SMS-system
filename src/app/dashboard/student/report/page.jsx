"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Loader2,
  FileText,
  Download,
  Printer,
  Calendar,
  DollarSign,
  BookOpen,
  User,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function StudentReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState("full");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!token || userRole !== "student") {
      router.push("/login");
      return;
    }
    if (userId) {
      fetchReport();
    }
  }, [userId, activeTab, selectedMonth, selectedYear]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      let url = `/api/student/report?studentId=${userId}&type=${activeTab}`;
      if (selectedMonth && activeTab === "fee") {
        url += `&month=${selectedMonth}&year=${selectedYear}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Report error:", err);
      setError("Failed to load report");
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      toast.loading("Downloading report...");
      const response = await axios.get(`/api/student/report/download?studentId=${userId}&type=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_report_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success("Report downloaded!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to download report");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading Report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg font-semibold">{error}</p>
          <button
            onClick={() => router.push("/dashboard/student")}
            className="mt-6 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{reportData?.student?.name || "Student"} Report</h1>
              {/* <p className="text-blue-100 mt-1">
                {reportData?.student?.name || "Student"} - {reportData?.title}
              </p> */}
            </div>
            <div className="flex gap-3">
              
              <button
                onClick={() => router.push("/dashboard/student")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700 pb-2">
          <button
            onClick={() => setActiveTab("full")}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === "full"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            Full Report
          </button>
          <button
            onClick={() => setActiveTab("fee")}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === "fee"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <DollarSign size={16} className="inline mr-2" />
            Fee Report
          </button>
          <button
            onClick={() => setActiveTab("assignment")}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === "assignment"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <BookOpen size={16} className="inline mr-2" />
            Assignment Report
          </button>
        </div>

        {/* Filters for Fee Report */}
        {activeTab === "fee" && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 cursor-pointer"
                >
                  <option value="">All Months</option>
                  {months.map((month, idx) => (
                    <option key={idx} value={idx + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Apply Filter
              </button>
            </div>
          </div>
        )}

        {/* Full Report Content */}
        {activeTab === "full" && reportData?.student && (
          <div className="space-y-6">
            {/* Student Information */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-medium">{reportData.student.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Roll Number</p>
                  <p className="text-white font-medium">{reportData.student.rollNo}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Class</p>
                  <p className="text-white font-medium">{reportData.student.className} - {reportData.student.section}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Father's Name</p>
                  <p className="text-white font-medium">{reportData.student.fatherName}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{reportData.student.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">{reportData.student.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">City</p>
                  <p className="text-white font-medium">{reportData.student.city}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white font-medium">{reportData.student.address || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Fee Summary */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Fee Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-sm">Total Fee</p>
                  <p className="text-2xl font-bold text-white">PKR {reportData.fee.summary.totalAmount?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <p className="text-green-400 text-sm">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-400">PKR {reportData.fee.summary.paidAmount?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                  <p className="text-yellow-400 text-sm">Remaining</p>
                  <p className="text-2xl font-bold text-yellow-400">PKR {reportData.fee.summary.remainingAmount?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                  <p className="text-blue-400 text-sm">Progress</p>
                  <p className="text-2xl font-bold text-blue-400">{reportData.fee.summary.paymentProgress}%</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Month</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Total</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Paid</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Remaining</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.fee.records.map((fee, idx) => (
                      <tr key={idx} className="border-t border-gray-700">
                        <td className="px-4 py-2 text-white">{fee.month}</td>
                        <td className="px-4 py-2 text-white">PKR {fee.amount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-green-400">PKR {fee.paidAmount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-yellow-400">PKR {fee.remainingAmount.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            fee.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                            fee.status === 'partially-paid' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {fee.status === 'paid' ? 'Paid' : fee.status === 'partially-paid' ? 'Partial' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assignment Summary */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Assignment Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">{reportData.assignment.summary.total}</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-3 text-center">
                  <p className="text-green-400 text-sm">Submitted</p>
                  <p className="text-2xl font-bold text-green-400">{reportData.assignment.summary.submitted}</p>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                  <p className="text-yellow-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{reportData.assignment.summary.pending}</p>
                </div>
                <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                  <p className="text-blue-400 text-sm">Completion</p>
                  <p className="text-2xl font-bold text-blue-400">{reportData.assignment.summary.completionRate}%</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Title</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Due Date</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Status</th>
                      <th className="px-4 py-2 text-left text-gray-300 text-sm">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.assignment.records.map((assignment, idx) => (
                      <tr key={idx} className="border-t border-gray-700">
                        <td className="px-4 py-2 text-white">{assignment.title}</td>
                        <td className="px-4 py-2 text-gray-400">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            assignment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            assignment.status === 'submitted' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-white">{assignment.grade || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Fee Report Content */}
        {activeTab === "fee" && reportData?.records && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Total Records</p>
                <p className="text-2xl font-bold text-white">{reportData.records.length}</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <p className="text-green-400 text-sm">Total Paid</p>
                <p className="text-2xl font-bold text-green-400">PKR {reportData.summary.paidAmount?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                <p className="text-yellow-400 text-sm">Payment Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{reportData.summary.paymentProgress}%</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">Month</th>
                    <th className="px-4 py-3 text-left text-gray-300">Total Amount</th>
                    <th className="px-4 py-3 text-left text-gray-300">Paid Amount</th>
                    <th className="px-4 py-3 text-left text-gray-300">Remaining</th>
                    <th className="px-4 py-3 text-left text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-gray-300">Due Date</th>
                    <th className="px-4 py-3 text-left text-gray-300">Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.records.map((fee, idx) => (
                    <tr key={idx} className="border-t border-gray-700">
                      <td className="px-4 py-3 text-white">{fee.month}</td>
                      <td className="px-4 py-3 text-white">PKR {fee.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-green-400">PKR {fee.paidAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-yellow-400">PKR {fee.remainingAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          fee.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          fee.status === 'partially-paid' ? 'bg-yellow-500/20 text-yellow-400' :
                          fee.isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {fee.status === 'paid' ? 'Paid' : fee.status === 'partially-paid' ? 'Partial' : fee.isOverdue ? 'Overdue' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assignment Report Content */}
        {activeTab === "assignment" && reportData?.records && (
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-white">{reportData.summary.total}</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 text-center">
                <p className="text-green-400 text-sm">Submitted</p>
                <p className="text-2xl font-bold text-green-400">{reportData.summary.submitted}</p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                <p className="text-blue-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-blue-400">{reportData.summary.approved}</p>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                <p className="text-yellow-400 text-sm">Completion Rate</p>
                <p className="text-2xl font-bold text-yellow-400">{reportData.summary.completionRate}%</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300">Assignment</th>
                    <th className="px-4 py-3 text-left text-gray-300">Due Date</th>
                    <th className="px-4 py-3 text-left text-gray-300">Submitted Date</th>
                    <th className="px-4 py-3 text-left text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-gray-300">Grade</th>
                    <th className="px-4 py-3 text-left text-gray-300">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.records.map((assignment, idx) => (
                    <tr key={idx} className="border-t border-gray-700">
                      <td className="px-4 py-3 text-white">{assignment.title}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {assignment.submittedDate ? new Date(assignment.submittedDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          assignment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          assignment.status === 'submitted' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {assignment.status === 'approved' ? '✓ Approved' : 
                           assignment.status === 'submitted' ? '⏳ Submitted' : '✗ Not Submitted'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white">{assignment.grade || '-'}</td>
                      <td className="px-4 py-3 text-gray-400">{assignment.feedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Generated Date */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Report generated on: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}