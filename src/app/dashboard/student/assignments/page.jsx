"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Send,
  FileText,
  Link2,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  User,
  Award
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionType, setSubmissionType] = useState("file");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setIsMounted(true);
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    
    if (!userId) {
      router.push("/login");
      return;
    }
    
    setStudentId(userId);
    setStudentName(userName || "Student");
  }, [router]);

  // Fetch assignments using direct API call (bypassing hook issue)
  const fetchAssignments = async () => {
    if (!studentId) return [];
    const response = await apiClient.get(`/student/assignments?userId=${studentId}&page=${currentPage}&limit=${itemsPerPage}`);
    return response.data;
  };

  const { 
    data: assignmentsData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useQuery({
    queryKey: ["student", "assignments", studentId, currentPage],
    queryFn: fetchAssignments,
    enabled: !!studentId,
  });

  // Submit assignment mutation
  const submitAssignmentMutation = useMutation({
    mutationFn: async ({ assignmentId, formData }) => {
      const response = await apiClient.post(`/student/assignments/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "assignments"] });
      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSubmissionLink("");
      setSubmissionFile(null);
      setSubmissionNotes("");
      setSubmissionType("file");
      toast.success("Assignment submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit assignment");
    },
  });

  const assignments = assignmentsData?.data || [];
  const stats = assignmentsData?.stats || { total: 0, submitted: 0, approved: 0, rejected: 0, pending: 0 };
  const pagination = assignmentsData?.pagination || { total: 0, page: 1, totalPages: 1 };

  // Filter assignments locally
  const filteredAssignments = assignments.filter(a => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = 
        a.title?.toLowerCase().includes(term) ||
        a.subject?.toLowerCase().includes(term) ||
        a.teacherName?.toLowerCase().includes(term);
      if (!matches) return false;
    }
    if (filterStatus) {
      if (filterStatus === "submitted" && a.status === "NOT SUBMITTED") return false;
      if (filterStatus === "pending" && a.status !== "pending") return false;
      if (filterStatus === "approved" && a.status !== "approved") return false;
      if (filterStatus === "rejected" && a.status !== "rejected") return false;
      if (filterStatus === "not_submitted" && a.status !== "NOT SUBMITTED") return false;
    }
    return true;
  });

  // Handle submit assignment
  const handleSubmitAssignment = () => {
    if (!selectedAssignment) return;

    if (submissionType === "link" && !submissionLink.trim()) {
      toast.error("Please enter a valid link");
      return;
    }

    if (submissionType === "file" && !submissionFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentId", selectedAssignment._id);
    formData.append("studentId", studentId);
    formData.append("studentName", studentName);
    
    if (submissionType === "link") {
      formData.append("solutionUrl", submissionLink);
    } else {
      formData.append("file", submissionFile);
    }
    
    if (submissionNotes) {
      formData.append("notes", submissionNotes);
    }

    submitAssignmentMutation.mutate({ assignmentId: selectedAssignment._id, formData });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "approved":
        return { icon: CheckCircle, text: "Approved", bg: "bg-green-100", textColor: "text-green-700", iconColor: "text-green-500" };
      case "pending":
        return { icon: Clock, text: "Pending Review", bg: "bg-yellow-100", textColor: "text-yellow-700", iconColor: "text-yellow-500" };
      case "rejected":
        return { icon: AlertCircle, text: "Rejected", bg: "bg-red-100", textColor: "text-red-700", iconColor: "text-red-500" };
      default:
        return { icon: AlertCircle, text: "Not Submitted", bg: "bg-gray-100", textColor: "text-gray-500", iconColor: "text-gray-400" };
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "No due date";
    const d = new Date(date);
    const today = new Date();
    const isOverdue = d < today;
    const formatted = d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return { formatted, isOverdue };
  };

  // Get days remaining
  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error loading assignments</p>
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                My Assignments
              </h1>
              <p className="text-blue-100 mt-1">View and submit your assignments</p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard title="Total" value={stats.total} icon={<BookOpen className="w-6 h-6 text-blue-500" />} />
          <StatCard title="Submitted" value={stats.submitted} icon={<CheckCircle className="w-6 h-6 text-green-500" />} />
          <StatCard title="Approved" value={stats.approved} icon={<Award className="w-6 h-6 text-purple-500" />} />
          <StatCard title="Pending Review" value={stats.pending || 0} icon={<Clock className="w-6 h-6 text-yellow-500" />} />
          <StatCard title="Not Submitted" value={stats.total - stats.submitted} icon={<AlertCircle className="w-6 h-6 text-gray-500" />} />
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
                placeholder="Search by title, subject or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="not_submitted">Not Submitted</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="px-6 mt-6 pb-6">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No assignments found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || filterStatus ? "Try changing your filters" : "No assignments have been posted yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssignments.map((assignment) => {
              const status = getStatusBadge(assignment.status);
              const StatusIcon = status.icon;
              const dueDate = formatDate(assignment.dueDate);
              const daysRemaining = getDaysRemaining(assignment.dueDate);
              const isOverdue = dueDate.isOverdue && assignment.status === "NOT SUBMITTED";
              const isUrgent = daysRemaining !== null && daysRemaining <= 3 && daysRemaining > 0 && assignment.status === "NOT SUBMITTED";
              
              return (
                <div
                  key={assignment._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{assignment.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
                        <StatusIcon size={12} className={status.iconColor} />
                        {status.text}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={14} />
                        <span>Teacher: {assignment.teacherName}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${isOverdue ? "text-red-500" : isUrgent ? "text-orange-500" : "text-gray-500"}`}>
                        <Calendar size={14} />
                        <span>Due: {dueDate.formatted}</span>
                        {isOverdue && <span className="text-xs ml-1">(Overdue)</span>}
                        {isUrgent && !isOverdue && <span className="text-xs ml-1">⚠️ {daysRemaining} days left</span>}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      {assignment.status === "NOT SUBMITTED" && !isOverdue && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setSubmissionType("file");
                            setSubmissionLink("");
                            setSubmissionFile(null);
                            setSubmissionNotes("");
                            setShowSubmitModal(true);
                          }}
                          className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                        >
                          <Send size={14} /> Submit
                        </button>
                      )}
                      {assignment.status !== "NOT SUBMITTED" && (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowDetailModal(true);
                          }}
                          className="flex-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                        >
                          <FileText size={14} /> View Submission
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
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
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAssignment && (
        <Modal title="Assignment Details" onClose={() => setShowDetailModal(false)} size="lg">
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 text-lg">{selectedAssignment.title}</h3>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Subject</p>
                  <p className="font-medium text-gray-700">{selectedAssignment.subject}</p>
                </div>
                <div>
                  <p className="text-gray-500">Teacher</p>
                  <p className="font-medium text-gray-700">{selectedAssignment.teacherName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-700">{formatDate(selectedAssignment.dueDate).formatted}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium text-gray-700 capitalize">{selectedAssignment.status || "Not Submitted"}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">{selectedAssignment.description || "No description provided"}</p>
              </div>
            </div>

            {selectedAssignment.status !== "NOT SUBMITTED" && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Submission</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {selectedAssignment.solutionUrl && (
                    <div>
                      <p className="text-xs text-gray-500">Submitted File/Link</p>
                      <a href={selectedAssignment.solutionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm break-all">
                        {selectedAssignment.solutionUrl}
                      </a>
                    </div>
                  )}
                  {selectedAssignment.submittedAt && (
                    <div>
                      <p className="text-xs text-gray-500">Submitted On</p>
                      <p className="text-sm text-gray-700">{new Date(selectedAssignment.submittedAt).toLocaleString()}</p>
                    </div>
                  )}
                  {selectedAssignment.feedback && (
                    <div>
                      <p className="text-xs text-gray-500">Teacher's Feedback</p>
                      <p className="text-sm text-gray-700">{selectedAssignment.feedback}</p>
                    </div>
                  )}
                  {selectedAssignment.marks && (
                    <div>
                      <p className="text-xs text-gray-500">Marks Obtained</p>
                      <p className="text-sm font-medium text-gray-700">{selectedAssignment.marks}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Submit Modal */}
      {showSubmitModal && selectedAssignment && (
        <Modal title="Submit Assignment" onClose={() => setShowSubmitModal(false)} size="lg">
          <div className="space-y-5">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-800">{selectedAssignment.title}</p>
              <p className="text-xs text-gray-500">Due: {formatDate(selectedAssignment.dueDate).formatted}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSubmissionType("file")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  submissionType === "file" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Upload size={16} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setSubmissionType("link")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  submissionType === "link" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Link2 size={16} /> Submit Link
              </button>
            </div>

            {submissionType === "file" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{submissionFile ? submissionFile.name : "Click to select file"}</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)</p>
                  </label>
                </div>
              </div>
            )}

            {submissionType === "link" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Submit Link</label>
                <input
                  type="url"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Make sure the link is accessible</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                rows="3"
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                placeholder="Any comments for the teacher..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {new Date(selectedAssignment.dueDate) < new Date() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={14} />
                  This assignment is overdue. Late submissions may be penalized.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button type="button" onClick={handleSubmitAssignment} disabled={submitAssignmentMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {submitAssignmentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                Submit Assignment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          {icon}
        </div>
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