"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  Eye,
  MessageSquare,
  Send,
  RefreshCw,
  Users,
  FileText,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTeacherSubmissions, useReviewSubmission } from "@/hooks/useTeacherQueries";
import toast from "react-hot-toast";

export default function TeacherSubmissionsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [showArchive, setShowArchive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [reviewStatus, setReviewStatus] = useState("approved");
  const [assignments, setAssignments] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [reviewedSubmissionId, setReviewedSubmissionId] = useState(null); // ✅ Track reviewed submission

  const itemsPerPage = 10;
  const teacherId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fix hydration - Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch submissions
  const { 
    data: submissionsData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useTeacherSubmissions(teacherId, showArchive, currentPage, itemsPerPage);

  // Review submission mutation
  const reviewMutation = useReviewSubmission();

  const submissions = submissionsData?.data || [];
  const pagination = submissionsData?.pagination || { total: 0, page: 1, totalPages: 1 };

  // Fetch teacher's assignments for filter
  const fetchAssignments = async () => {
    if (!teacherId) return;
    try {
      const res = await fetch(`/api/teacher/assignments?userId=${teacherId}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchAssignments();
    }
  }, [teacherId]);

  // Filter submissions locally
  const filteredSubmissions = submissions.filter(s => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        s.studentId?.name?.toLowerCase().includes(term) ||
        s.studentId?.rollNo?.toLowerCase().includes(term) ||
        s.assignmentId?.title?.toLowerCase().includes(term);
      if (!matches) return false;
    }
    if (selectedStatus && s.status !== selectedStatus) return false;
    if (selectedAssignment && s.assignmentId?._id !== selectedAssignment) return false;
    return true;
  });

  // Review submission
  const handleReview = () => {
    if (!selectedSubmission) return;

    setReviewedSubmissionId(selectedSubmission._id); // ✅ Set reviewing state

    reviewMutation.mutate({
      submissionId: selectedSubmission._id,
      feedback: feedbackText,
      status: reviewStatus
    }, {
      onSuccess: () => {
        setShowReviewModal(false);
        setSelectedSubmission(null);
        setFeedbackText("");
        setReviewStatus("approved");
        toast.success("Submission reviewed successfully!");
        refetch();
        setTimeout(() => setReviewedSubmissionId(null), 1000); // ✅ Reset after 1 second
      },
      onError: (err) => {
        toast.error(err.response?.data?.error || "Failed to review submission");
        setReviewedSubmissionId(null);
      }
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return { icon: CheckCircle, text: "Approved", bg: "bg-green-100", textColor: "text-green-700", iconColor: "text-green-500" };
      case "reviewed":
        return { icon: CheckCircle, text: "Reviewed", bg: "bg-green-100", textColor: "text-green-700", iconColor: "text-green-500" };
      case "pending":
        return { icon: Clock, text: "Pending", bg: "bg-yellow-100", textColor: "text-yellow-700", iconColor: "text-yellow-500" };
      case "rejected":
        return { icon: XCircle, text: "Rejected", bg: "bg-red-100", textColor: "text-red-700", iconColor: "text-red-500" };
      default:
        return { icon: AlertCircle, text: status || "Submitted", bg: "bg-blue-100", textColor: "text-blue-700", iconColor: "text-blue-500" };
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique assignments for filter
  const uniqueAssignments = [...new Map(assignments.map(a => [a._id, a])).values()];

  const pendingCount = submissions.filter(s => s.status === "pending").length;
  const reviewedCount = submissions.filter(s => s.status === "approved" || s.status === "reviewed").length;
  const rejectedCount = submissions.filter(s => s.status === "rejected").length;
  const totalSubmissions = submissions.length;

  // Fix hydration - Don't render until mounted
  if (!isMounted) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading submissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error loading submissions</p>
          <p className="text-gray-500 text-sm">{error?.message || "Please try again"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-blue-600" size={28} />
                Assignment Submissions
              </h1>
              <p className="text-gray-500 text-sm mt-1">Review and grade student submissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowArchive(!showArchive);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  showArchive 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock size={18} />
                {showArchive ? "Show Current" : "Show Archive"}
              </button>
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Submissions" value={totalSubmissions} icon={<FileText className="w-8 h-8 text-blue-500 opacity-50" />} />
          <StatCard title="Pending Review" value={pendingCount} icon={<Clock className="w-8 h-8 text-yellow-500 opacity-50" />} valueColor="text-yellow-600" />
          <StatCard title="Approved" value={reviewedCount} icon={<CheckCircle className="w-8 h-8 text-green-500 opacity-50" />} valueColor="text-green-600" />
          <StatCard title="Rejected" value={rejectedCount} icon={<XCircle className="w-8 h-8 text-red-500 opacity-50" />} valueColor="text-red-600" />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by student name, roll number or assignment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="w-full md:w-56 relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">All Assignments</option>
                {uniqueAssignments.map(a => (
                  <option key={a._id} value={a._id}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredSubmissions.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mx-6 mt-6 border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No submissions found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm || selectedStatus ? "Try changing your filters" : "Students haven't submitted any assignments yet"}
          </p>
        </div>
      )}

      {/* Submissions Table */}
      {filteredSubmissions.length > 0 && (
        <>
          <div className="px-6 mt-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assignment</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubmissions.map((submission) => {
                      const status = getStatusBadge(submission.status);
                      const StatusIcon = status.icon;
                      const isPending = submission.status === "pending";
                      const isReviewed = submission.status === "approved" || submission.status === "reviewed" || submission.status === "rejected";
                      const isReviewing = reviewedSubmissionId === submission._id;
                      
                      return (
                        <tr key={submission._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-gray-800">{submission.studentId?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">Roll: {submission.studentId?.rollNo || "N/A"}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-gray-800 font-medium">{submission.assignmentId?.title || "N/A"}</p>
                            <p className="text-xs text-gray-500">Class: {submission.assignmentId?.targetClass || "N/A"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-600">
                              {submission.assignmentId?.subjectDisplay || submission.assignmentId?.subjectName || "N/A"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-gray-600 text-sm">{formatDate(submission.createdAt)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
                              <StatusIcon size={12} className={status.iconColor} />
                              {status.text}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => {
                                if (!isReviewed && !isReviewing) {
                                  setSelectedSubmission(submission);
                                  setFeedbackText(submission.feedback || "");
                                  setReviewStatus("approved");
                                  setShowReviewModal(true);
                                }
                              }}
                              disabled={isReviewed || isReviewing || reviewMutation.isPending}
                              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                                isReviewed 
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                  : isPending 
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" 
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              title={isReviewed ? "Already reviewed" : "Review submission"}
                            >
                              {isReviewing || reviewMutation.isPending ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <MessageSquare size={14} />
                              )}
                              {isReviewed ? "Reviewed" : isPending ? "Review" : "View Feedback"}
                            </button>
                          </td>
                        </tr>

);
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 pb-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <Modal title="Review Submission" onClose={() => setShowReviewModal(false)} size="lg">
          <div className="space-y-5">
            {/* Student & Assignment Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Student</p>
                  <p className="font-medium text-gray-800">{selectedSubmission.studentId?.name}</p>
                  <p className="text-xs text-gray-500">Roll No: {selectedSubmission.studentId?.rollNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Assignment</p>
                  <p className="font-medium text-gray-800">{selectedSubmission.assignmentId?.title}</p>
                  <p className="text-xs text-gray-500">Class: {selectedSubmission.assignmentId?.targetClass}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-500">Submitted on</p>
                <p className="text-sm text-gray-700">{formatDate(selectedSubmission.createdAt)}</p>
              </div>
            </div>

            {/* Student Notes */}
            {selectedSubmission.notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student's Notes</label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedSubmission.notes}</p>
                </div>
              </div>
            )}

            {/* Feedback Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback / Remarks
              </label>
              <textarea
                rows="4"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Provide feedback to the student..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mark as</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewStatus("approved")}
                  className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    reviewStatus === "approved"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle size={16} />
                  Approved
                </button>
                <button
                  type="button"
                  onClick={() => setReviewStatus("rejected")}
                  className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    reviewStatus === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <XCircle size={16} />
                  Rejected
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReview}
                disabled={reviewMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
              >
                {reviewMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                Submit Review
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, valueColor = "text-gray-800" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose, size = "md" }) {
  const maxWidth = size === "lg" ? "max-w-2xl" : "max-w-md";
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// X icon for modal
const X = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);