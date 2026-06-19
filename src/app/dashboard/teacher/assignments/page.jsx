"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  Send,
  RefreshCw,
  BookMarked,
  GraduationCap,
  Users,
  Trophy,
  X,
  Save,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [syllabusData, setSyllabusData] = useState(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    targetClass: "",
    dueDate: "",
    maxMarks: 100
  });

  const itemsPerPage = 10;

  // Fetch assignments
  const fetchAssignments = async (page = 1) => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const res = await fetch(`/api/teacher/assignments?userId=${userId}&page=${page}&limit=${itemsPerPage}`);
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data || []);
        setFilteredAssignments(data.data || []);
        setAssignedSubjects(data.assignedSubjects || []);
        setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments(currentPage);
  }, [currentPage]);

  // Filter assignments
  useEffect(() => {
    let filtered = assignments;
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.targetClass?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedStatus) {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }
    setFilteredAssignments(filtered);
  }, [searchTerm, selectedStatus, assignments]);

  // Fetch syllabus for AI
  const fetchSyllabus = async (subjectId, className) => {
    setSyllabusLoading(true);
    setSyllabusData(null);
    setSelectedChapter(null);
    setSelectedTopics([]);
    
    try {
      const res = await fetch(`/api/syllabus?subjectId=${subjectId}&targetClass=${className}&board=sindh`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        // Get the first syllabus (or combine)
        setSyllabusData(data.data[0]);
      } else {
        setSyllabusData(null);
        setFormError("No syllabus found. Please contact admin to upload syllabus first.");
      }
    } catch (error) {
      console.error("Error fetching syllabus:", error);
      setSyllabusData(null);
    } finally {
      setSyllabusLoading(false);
    }
  };

  // Generate AI recommendations
  const generateAIRecommendations = async () => {
    if (!formData.subject || !formData.targetClass) {
      setFormError("Please select subject and class first");
      return;
    }
    
    if (!selectedChapter) {
      setFormError("Please select a chapter first");
      return;
    }
    
    if (selectedTopics.length === 0) {
      setFormError("Please select at least one topic");
      return;
    }
    
    setGeneratingAI(true);
    setFormError("");
    
    try {
      const topicsParam = encodeURIComponent(selectedTopics.join(","));
      const res = await fetch(
        `/api/teacher/assignments?recommend=true&subject=${formData.subject}&targetClass=${formData.targetClass}&chapter=${selectedChapter.chapterNumber}&topics=${topicsParam}`
      );
      const data = await res.json();
      
      if (data.success) {
        setAiRecommendations(data.data || []);
      } else if (data.syllabusExists === false) {
        setFormError(data.message || "No syllabus found. Please upload syllabus first.");
        setAiRecommendations([]);
      } else {
        setFormError(data.message || "Failed to generate recommendations");
        setAiRecommendations([]);
      }
    } catch (error) {
      setFormError("Network error. Please try again.");
    } finally {
      setGeneratingAI(false);
    }
  };

  // Create assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setFormError("");
    
    const userId = localStorage.getItem("userId");
    const teacherName = localStorage.getItem("userName");
    
    try {
      const res = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          teacherId: userId,
          teacherName: teacherName,
          chapterReference: selectedChapter?.chapterNumber,
          chapterName: selectedChapter?.chapterName
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Assignment created successfully!");
        setShowCreateModal(false);
        setShowAIModal(false);
        resetForm();
        fetchAssignments(1);
        setTimeout(() => setFormSuccess(""), 2000);
      } else {
        setFormError(data.message || "Failed to create assignment");
      }
    } catch (error) {
      setFormError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Update assignment
  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setFormError("");
    
    try {
      const res = await fetch(`/api/teacher/assignments/${selectedAssignment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedAssignment)
      });
      
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Assignment updated successfully!");
        setShowEditModal(false);
        setSelectedAssignment(null);
        fetchAssignments(currentPage);
        setTimeout(() => setFormSuccess(""), 2000);
      } else {
        setFormError(data.message || "Failed to update assignment");
      }
    } catch (error) {
      setFormError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Delete assignment
  const handleDeleteAssignment = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      const res = await fetch(`/api/teacher/assignments/${id}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      if (data.success) {
        fetchAssignments(currentPage);
        alert("✅ Assignment deleted successfully!");
      } else {
        alert(data.message || "Failed to delete assignment");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      targetClass: "",
      dueDate: "",
      maxMarks: 100
    });
    setSelectedChapter(null);
    setSelectedTopics([]);
    setAiRecommendations([]);
    setFormError("");
    setSyllabusData(null);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return { icon: CheckCircle, text: "Active", color: "green", bg: "bg-green-100", textColor: "text-green-700" };
      case "expired":
        return { icon: Clock, text: "Expired", color: "red", bg: "bg-red-100", textColor: "text-red-700" };
      default:
        return { icon: AlertCircle, text: "Draft", color: "gray", bg: "bg-gray-100", textColor: "text-gray-700" };
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Classes for dropdown
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  // Toggle chapter expansion
  const toggleChapter = (chapterNumber) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterNumber]: !prev[chapterNumber]
    }));
  };

  // Handle topic selection
  const toggleTopic = (topic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  // Select all topics in chapter
  const selectAllTopics = () => {
    if (selectedChapter && selectedChapter.topics) {
      setSelectedTopics([...selectedChapter.topics]);
    }
  };

  // Clear all topics
  const clearAllTopics = () => {
    setSelectedTopics([]);
  };

  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.status === "active").length;
  const expiredAssignments = assignments.filter(a => a.status === "expired").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-blue-600" size={28} />
                My Assignments
              </h1>
              <p className="text-gray-500 text-sm mt-1">Create and manage student assignments</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchAssignments(1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Create Assignment
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAIModal(true);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Sparkles size={18} />
                AI Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-800">{totalAssignments}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeAssignments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Expired</p>
                <p className="text-2xl font-bold text-red-600">{expiredAssignments}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Subjects</p>
                <p className="text-2xl font-bold text-purple-600">{assignedSubjects.length}</p>
              </div>
              <BookMarked className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
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
                placeholder="Search by title, subject or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-48 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-3 text-gray-500">Loading assignments...</span>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mx-6 mt-6 border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No assignments found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm || selectedStatus ? "Try changing your filters" : "Click 'Create Assignment' to get started"}
          </p>
        </div>
      ) : (
        <>
          {/* Assignments Grid */}
          <div className="px-6 mt-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssignments.map((assignment) => {
                const status = getStatusBadge(assignment.status);
                const StatusIcon = status.icon;
                const isExpired = assignment.status === "expired";
                const dueDate = new Date(assignment.dueDate);
                const isUrgent = dueDate - new Date() < 3 * 24 * 60 * 60 * 1000 && !isExpired;
                
                return (
                  <div
                    key={assignment._id}
                    className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                      isExpired ? "border-gray-200 opacity-75" : "border-gray-100"
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-1">{assignment.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{assignment.subjectName || assignment.subject}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
                          <StatusIcon size={12} />
                          {status.text}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <p className="text-gray-600 text-sm line-clamp-2">{assignment.description || "No description"}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Users size={14} />
                          <span>Class {assignment.targetClass}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Trophy size={14} />
                          <span>{assignment.maxMarks} marks</span>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 text-sm ${isUrgent ? "text-orange-600" : "text-gray-500"}`}>
                        <Calendar size={14} />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                        {isUrgent && <span className="text-orange-600 text-xs ml-1">⚠️ Urgent</span>}
                      </div>
                      
                      {assignment.chapterName && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <BookMarked size={12} />
                          <span>Chapter: {assignment.chapterName}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="p-3 bg-gray-50 rounded-b-xl flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowEditModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
                        className="flex-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
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

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <Modal title="Create New Assignment" onClose={() => setShowCreateModal(false)} size="lg">
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Subject</option>
                  {assignedSubjects.map(sub => (
                    <option key={sub.id || sub} value={sub.id || sub}>
                      {sub.name || sub}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Class *</label>
                <select
                  value={formData.targetClass}
                  onChange={(e) => setFormData({...formData, targetClass: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {formSuccess && <p className="text-green-500 text-sm">{formSuccess}</p>}
            
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Assignment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* AI Generate Modal */}
      {showAIModal && (
        <Modal title="AI Assignment Generator" onClose={() => setShowAIModal(false)} size="lg">
          <div className="space-y-5">
            {/* Step 1: Subject & Class */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({...formData, subject: e.target.value});
                    setSyllabusData(null);
                    setSelectedChapter(null);
                    setSelectedTopics([]);
                    setAiRecommendations([]);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Subject</option>
                  {assignedSubjects.map(sub => (
                    <option key={sub.id || sub} value={sub.id || sub}>
                      {sub.name || sub}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Class *</label>
                <select
                  value={formData.targetClass}
                  onChange={(e) => {
                    setFormData({...formData, targetClass: e.target.value});
                    setSyllabusData(null);
                    setSelectedChapter(null);
                    setSelectedTopics([]);
                    setAiRecommendations([]);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Step 2: Load Syllabus Button */}
            {formData.subject && formData.targetClass && (
              <button
                type="button"
                onClick={() => fetchSyllabus(formData.subject, formData.targetClass)}
                disabled={syllabusLoading}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center justify-center gap-2"
              >
                {syllabusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookMarked size={16} />}
                Load Syllabus
              </button>
            )}
            
            {/* Step 3: Syllabus Display */}
            {syllabusLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                <span className="ml-2 text-gray-500">Loading syllabus...</span>
              </div>
            )}
            
            {syllabusData && syllabusData.chapters && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <p className="font-medium text-gray-700">
                    {syllabusData.subjectName} - Class {syllabusData.targetClass} ({syllabusData.board})
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {syllabusData.chapters.map((chapter) => (
                    <div key={chapter.chapterNumber} className="border-b border-gray-100">
                      <button
                        onClick={() => {
                          toggleChapter(chapter.chapterNumber);
                          if (!selectedChapter || selectedChapter.chapterNumber !== chapter.chapterNumber) {
                            setSelectedChapter(chapter);
                            setSelectedTopics([]);
                          }
                        }}
                        className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 text-left"
                      >
                        <span className="font-medium text-gray-700">
                          Chapter {chapter.chapterNumber}: {chapter.chapterName}
                        </span>
                        {expandedChapters[chapter.chapterNumber] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      
                      {expandedChapters[chapter.chapterNumber] && selectedChapter?.chapterNumber === chapter.chapterNumber && (
                        <div className="px-4 pb-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">Select topics for this assignment:</p>
                            <div className="flex gap-2">
                              <button onClick={selectAllTopics} className="text-xs text-blue-600 hover:text-blue-700">Select All</button>
                              <button onClick={clearAllTopics} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {chapter.topics?.map((topic, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleTopic(topic)}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                  selectedTopics.includes(topic)
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                          {chapter.topics?.length === 0 && (
                            <p className="text-gray-400 text-sm">No topics available for this chapter</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 4: Generate Button */}
            {selectedChapter && selectedTopics.length > 0 && (
              <button
                type="button"
                onClick={generateAIRecommendations}
                disabled={generatingAI}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center justify-center gap-2"
              >
                {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles size={16} />}
                Generate Assignments
              </button>
            )}
            
            {/* Step 5: AI Recommendations */}
            {aiRecommendations.length > 0 && (
              <div className="space-y-3">
                <p className="font-medium text-gray-700">AI Recommendations:</p>
                {aiRecommendations.map((rec, idx) => (
                  <div key={idx} className="border border-purple-200 bg-purple-50 rounded-lg p-3">
                    <h4 className="font-medium text-purple-800">{rec.title}</h4>
                    <p className="text-sm text-purple-600 mt-1">{rec.description}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          title: rec.title,
                          description: rec.description,
                          dueDate: "",
                          maxMarks: 100
                        });
                        setAiRecommendations([]);
                      }}
                      className="mt-2 text-sm text-purple-700 hover:text-purple-800 flex items-center gap-1"
                    >
                      <CheckCircle size={14} /> Use this assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            
            {/* Step 6: Manual Entry Form */}
            {formData.title && (
              <div className="border-t pt-4 mt-2">
                <p className="font-medium text-gray-700 mb-3">Assignment Details:</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Assignment Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="number"
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
                      placeholder="Max Marks"
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleCreateAssignment}
                    disabled={processing}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                    Publish Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && selectedAssignment && (
        <Modal title="Edit Assignment" onClose={() => setShowEditModal(false)} size="lg">
          <form onSubmit={handleUpdateAssignment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={selectedAssignment.title || ""}
                onChange={(e) => setSelectedAssignment({...selectedAssignment, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={selectedAssignment.description || ""}
                onChange={(e) => setSelectedAssignment({...selectedAssignment, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={selectedAssignment.subjectName || selectedAssignment.subject || ""}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
                <input
                  type="text"
                  value={selectedAssignment.targetClass || ""}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={selectedAssignment.dueDate?.split('T')[0] || ""}
                  onChange={(e) => setSelectedAssignment({...selectedAssignment, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  value={selectedAssignment.maxMarks || 100}
                  onChange={(e) => setSelectedAssignment({...selectedAssignment, maxMarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {formSuccess && <p className="text-green-500 text-sm">{formSuccess}</p>}
            
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={processing} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Update Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
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





























// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   BookOpen,
//   Plus,
//   Edit,
//   Trash2,
//   Loader2,
//   Search,
//   Filter,
//   Calendar,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Sparkles,
//   ChevronLeft,
//   ChevronRight,
//   Send,
//   RefreshCw,
//   BookMarked,
//   Users,
//   Trophy,
//   X,
//   Save,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";
// import { 
//   useTeacherAssignments, 
//   useCreateAssignment, 
//   useUpdateAssignment, 
//   useDeleteAssignment,
//   useTeacherSubjects,
//   useSyllabusForTeacher,
//   useGenerateAIRecommendations
// } from "@/hooks/useTeacherQueries";
// import toast from "react-hot-toast";

// export default function TeacherAssignmentsPage() {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showAIModal, setShowAIModal] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [expandedChapters, setExpandedChapters] = useState({});
  
//   // Syllabus state
//   const [syllabusData, setSyllabusData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [aiRecommendations, setAiRecommendations] = useState([]);
//   const [generatingAI, setGeneratingAI] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     subject: "",
//     targetClass: "",
//     dueDate: "",
//     maxMarks: 100
//   });

//   const itemsPerPage = 10;
//   const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
//   const teacherName = typeof window !== "undefined" ? localStorage.getItem("userName") : "";

//   // React Query hooks
//   const { 
//     data: assignmentsData, 
//     isLoading, 
//     refetch, 
//     isFetching 
//   } = useTeacherAssignments(userId, currentPage, itemsPerPage);
  
//   const { data: subjectsData } = useTeacherSubjects(userId);
//   const createAssignmentMutation = useCreateAssignment();
//   const updateAssignmentMutation = useUpdateAssignment();
//   const deleteAssignmentMutation = useDeleteAssignment();
//   const generateAIRecommendationsMutation = useGenerateAIRecommendations();

//   const assignments = assignmentsData?.data || [];
//   const assignedSubjects = subjectsData?.assignedSubjects || [];
//   const pagination = assignmentsData?.pagination || { total: 0, page: 1, totalPages: 1 };

//   // Filter assignments
//   const filteredAssignments = assignments.filter(a => {
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       const matches = 
//         a.title?.toLowerCase().includes(term) ||
//         a.subjectName?.toLowerCase().includes(term) ||
//         a.targetClass?.toLowerCase().includes(term);
//       if (!matches) return false;
//     }
//     if (selectedStatus && a.status !== selectedStatus) return false;
//     return true;
//   });

//   // Fetch syllabus for AI
//   const handleFetchSyllabus = async (subjectId, className) => {
//     setSyllabusData(null);
//     setSelectedChapter(null);
//     setSelectedTopics([]);
    
//     try {
//       const res = await fetch(`/api/syllabus?subjectId=${subjectId}&targetClass=${className}&board=sindh`);
//       const data = await res.json();
//       if (data.success && data.data && data.data.length > 0) {
//         setSyllabusData(data.data[0]);
//       } else {
//         toast.error("No syllabus found. Please contact admin to upload syllabus first.");
//       }
//     } catch (error) {
//       console.error("Error fetching syllabus:", error);
//       toast.error("Failed to load syllabus");
//     }
//   };

//   // Generate AI recommendations
//   const handleGenerateAI = () => {
//     if (!formData.subject || !formData.targetClass) {
//       toast.error("Please select subject and class first");
//       return;
//     }
    
//     if (!selectedChapter) {
//       toast.error("Please select a chapter first");
//       return;
//     }
    
//     if (selectedTopics.length === 0) {
//       toast.error("Please select at least one topic");
//       return;
//     }
    
//     setGeneratingAI(true);
    
//     generateAIRecommendationsMutation.mutate({
//       subject: formData.subject,
//       targetClass: formData.targetClass,
//       chapter: selectedChapter.chapterNumber,
//       topics: selectedTopics
//     }, {
//       onSuccess: (data) => {
//         setAiRecommendations(data.data || []);
//         setGeneratingAI(false);
//       },
//       onError: (error) => {
//         toast.error(error.response?.data?.message || "Failed to generate recommendations");
//         setGeneratingAI(false);
//       }
//     });
//   };

//   // Create assignment
//   const handleCreateAssignment = (e) => {
//     e.preventDefault();
    
//     createAssignmentMutation.mutate({
//       ...formData,
//       teacherId: userId,
//       teacherName: teacherName,
//       chapterReference: selectedChapter?.chapterNumber,
//       chapterName: selectedChapter?.chapterName
//     }, {
//       onSuccess: () => {
//         setShowCreateModal(false);
//         setShowAIModal(false);
//         resetForm();
//         toast.success("Assignment created successfully!");
//       },
//       onError: (error) => {
//         toast.error(error.response?.data?.message || "Failed to create assignment");
//       }
//     });
//   };

//   // Update assignment
//   const handleUpdateAssignment = (e) => {
//     e.preventDefault();
    
//     updateAssignmentMutation.mutate({
//       id: selectedAssignment._id,
//       data: selectedAssignment
//     }, {
//       onSuccess: () => {
//         setShowEditModal(false);
//         setSelectedAssignment(null);
//         toast.success("Assignment updated successfully!");
//       },
//       onError: (error) => {
//         toast.error(error.response?.data?.message || "Failed to update assignment");
//       }
//     });
//   };

//   // Delete assignment
//   const handleDeleteAssignment = (id, title) => {
//     if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
//     deleteAssignmentMutation.mutate(id, {
//       onSuccess: () => {
//         toast.success("Assignment deleted successfully!");
//       }
//     });
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       subject: "",
//       targetClass: "",
//       dueDate: "",
//       maxMarks: 100
//     });
//     setSelectedChapter(null);
//     setSelectedTopics([]);
//     setAiRecommendations([]);
//     setSyllabusData(null);
//   };

//   // Get status badge
//   const getStatusBadge = (status) => {
//     switch(status) {
//       case "active":
//         return { icon: CheckCircle, text: "Active", bg: "bg-green-100", textColor: "text-green-700" };
//       case "expired":
//         return { icon: Clock, text: "Expired", bg: "bg-red-100", textColor: "text-red-700" };
//       default:
//         return { icon: AlertCircle, text: "Draft", bg: "bg-gray-100", textColor: "text-gray-700" };
//     }
//   };

//   // Format date
//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     const d = new Date(date);
//     return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   // Classes for dropdown
//   const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

//   // Toggle chapter expansion
//   const toggleChapter = (chapterNumber) => {
//     setExpandedChapters(prev => ({
//       ...prev,
//       [chapterNumber]: !prev[chapterNumber]
//     }));
//   };

//   // Handle topic selection
//   const toggleTopic = (topic) => {
//     setSelectedTopics(prev => 
//       prev.includes(topic) 
//         ? prev.filter(t => t !== topic)
//         : [...prev, topic]
//     );
//   };

//   // Select all topics
//   const selectAllTopics = () => {
//     if (selectedChapter && selectedChapter.topics) {
//       setSelectedTopics([...selectedChapter.topics]);
//     }
//   };

//   // Clear all topics
//   const clearAllTopics = () => {
//     setSelectedTopics([]);
//   };

//   const totalAssignments = assignments.length;
//   const activeAssignments = assignments.filter(a => a.status === "active").length;
//   const expiredAssignments = assignments.filter(a => a.status === "expired").length;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-500">Loading assignments...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                 <BookOpen className="text-blue-600" size={28} />
//                 My Assignments
//               </h1>
//               <p className="text-gray-500 text-sm mt-1">Create and manage student assignments</p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => refetch()}
//                 disabled={isFetching}
//                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 transition-colors disabled:opacity-50"
//               >
//                 <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setShowCreateModal(true);
//                 }}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2"
//               >
//                 <Plus size={18} />
//                 Create Assignment
//               </button>
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setShowAIModal(true);
//                 }}
//                 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2"
//               >
//                 <Sparkles size={18} />
//                 AI Generate
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="px-6 mt-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <StatCard title="Total Assignments" value={totalAssignments} icon={<BookOpen className="w-8 h-8 text-blue-500 opacity-50" />} />
//           <StatCard title="Active" value={activeAssignments} icon={<CheckCircle className="w-8 h-8 text-green-500 opacity-50" />} valueColor="text-green-600" />
//           <StatCard title="Expired" value={expiredAssignments} icon={<Clock className="w-8 h-8 text-red-500 opacity-50" />} valueColor="text-red-600" />
//           <StatCard title="Subjects" value={assignedSubjects.length} icon={<BookMarked className="w-8 h-8 text-purple-500 opacity-50" />} valueColor="text-purple-600" />
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="px-6 mt-6">
//         <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search by title, subject or class..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               />
//             </div>
//             <div className="w-full md:w-48 relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//               >
//                 <option value="">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="expired">Expired</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* No Results */}
//       {filteredAssignments.length === 0 && (
//         <div className="bg-white rounded-xl shadow-sm p-12 text-center mx-6 mt-6 border border-gray-100">
//           <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg">No assignments found</p>
//           <p className="text-gray-400 text-sm mt-1">
//             {searchTerm || selectedStatus ? "Try changing your filters" : "Click 'Create Assignment' to get started"}
//           </p>
//         </div>
//       )}

//       {/* Assignments Grid */}
//       {filteredAssignments.length > 0 && (
//         <>
//           <div className="px-6 mt-6 pb-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//               {filteredAssignments.map((assignment) => {
//                 const status = getStatusBadge(assignment.status);
//                 const StatusIcon = status.icon;
//                 const isExpired = assignment.status === "expired";
//                 const dueDate = new Date(assignment.dueDate);
//                 const isUrgent = dueDate - new Date() < 3 * 24 * 60 * 60 * 1000 && !isExpired;
                
//                 return (
//                   <div
//                     key={assignment._id}
//                     className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
//                       isExpired ? "border-gray-200 opacity-75" : "border-gray-100"
//                     }`}
//                   >
//                     <div className="p-4 border-b border-gray-100">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-800 line-clamp-1">{assignment.title}</h3>
//                           <p className="text-sm text-gray-500 mt-1">{assignment.subjectName || assignment.subject}</p>
//                         </div>
//                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}>
//                           <StatusIcon size={12} />
//                           {status.text}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="p-4 space-y-3">
//                       <p className="text-gray-600 text-sm line-clamp-2">{assignment.description || "No description"}</p>
                      
//                       <div className="flex items-center justify-between text-sm">
//                         <div className="flex items-center gap-2 text-gray-500">
//                           <Users size={14} />
//                           <span>Class {assignment.targetClass}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-gray-500">
//                           <Trophy size={14} />
//                           <span>{assignment.maxMarks} marks</span>
//                         </div>
//                       </div>
                      
//                       <div className={`flex items-center gap-2 text-sm ${isUrgent ? "text-orange-600" : "text-gray-500"}`}>
//                         <Calendar size={14} />
//                         <span>Due: {formatDate(assignment.dueDate)}</span>
//                         {isUrgent && <span className="text-orange-600 text-xs ml-1">⚠️ Urgent</span>}
//                       </div>
                      
//                       {assignment.chapterName && (
//                         <div className="flex items-center gap-2 text-xs text-gray-400">
//                           <BookMarked size={12} />
//                           <span>Chapter: {assignment.chapterName}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-3 bg-gray-50 rounded-b-xl flex gap-2">
//                       <button
//                         onClick={() => {
//                           setSelectedAssignment(assignment);
//                           setShowEditModal(true);
//                         }}
//                         className="flex-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex items-center justify-center gap-1"
//                       >
//                         <Edit size={14} /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
//                         disabled={deleteAssignmentMutation.isPending}
//                         className="flex-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex items-center justify-center gap-1 disabled:opacity-50"
//                       >
//                         {deleteAssignmentMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-6 pb-6">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 <ChevronLeft size={18} />
//               </button>
//               <span className="text-gray-600">
//                 Page {currentPage} of {pagination.totalPages}
//               </span>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
//                 disabled={currentPage === pagination.totalPages}
//                 className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Create Assignment Modal */}
//       {showCreateModal && (
//         <Modal title="Create New Assignment" onClose={() => setShowCreateModal(false)} size="lg">
//           <form onSubmit={handleCreateAssignment} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => setFormData({...formData, title: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 rows="3"
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
//                 <select
//                   value={formData.subject}
//                   onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   required
//                 >
//                   <option value="">Select Subject</option>
//                   {assignedSubjects.map(sub => (
//                     <option key={sub.id || sub} value={sub.id || sub}>
//                       {sub.name || sub}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Target Class *</label>
//                 <select
//                   value={formData.targetClass}
//                   onChange={(e) => setFormData({...formData, targetClass: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   required
//                 >
//                   <option value="">Select Class</option>
//                   {classes.map(c => (
//                     <option key={c} value={c}>{c}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
//                 <input
//                   type="date"
//                   value={formData.dueDate}
//                   onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
//                 <input
//                   type="number"
//                   value={formData.maxMarks}
//                   onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             </div>
            
//             <div className="flex gap-3 pt-4">
//               <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
//               <button type="submit" disabled={createAssignmentMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
//                 {createAssignmentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Assignment"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* AI Generate Modal */}
//       {showAIModal && (
//         <Modal title="AI Assignment Generator" onClose={() => setShowAIModal(false)} size="lg">
//           <div className="space-y-5">
//             {/* Subject & Class */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
//                 <select
//                   value={formData.subject}
//                   onChange={(e) => {
//                     setFormData({...formData, subject: e.target.value});
//                     setSyllabusData(null);
//                     setSelectedChapter(null);
//                     setSelectedTopics([]);
//                     setAiRecommendations([]);
//                   }}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 >
//                   <option value="">Select Subject</option>
//                   {assignedSubjects.map(sub => (
//                     <option key={sub.id || sub} value={sub.id || sub}>
//                       {sub.name || sub}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Target Class *</label>
//                 <select
//                   value={formData.targetClass}
//                   onChange={(e) => {
//                     setFormData({...formData, targetClass: e.target.value});
//                     setSyllabusData(null);
//                     setSelectedChapter(null);
//                     setSelectedTopics([]);
//                     setAiRecommendations([]);
//                   }}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 >
//                   <option value="">Select Class</option>
//                   {classes.map(c => (
//                     <option key={c} value={c}>{c}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             {/* Load Syllabus Button */}
//             {formData.subject && formData.targetClass && (
//               <button
//                 type="button"
//                 onClick={() => handleFetchSyllabus(formData.subject, formData.targetClass)}
//                 className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center justify-center gap-2"
//               >
//                 <BookMarked size={16} />
//                 Load Syllabus
//               </button>
//             )}
            
//             {/* Syllabus Display */}
//             {syllabusData && syllabusData.chapters && (
//               <div className="border border-gray-200 rounded-lg overflow-hidden">
//                 <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
//                   <p className="font-medium text-gray-700">
//                     {syllabusData.subjectName} - Class {syllabusData.targetClass} ({syllabusData.board})
//                   </p>
//                 </div>
//                 <div className="max-h-80 overflow-y-auto">
//                   {syllabusData.chapters.map((chapter) => (
//                     <div key={chapter.chapterNumber} className="border-b border-gray-100">
//                       <button
//                         onClick={() => {
//                           toggleChapter(chapter.chapterNumber);
//                           if (!selectedChapter || selectedChapter.chapterNumber !== chapter.chapterNumber) {
//                             setSelectedChapter(chapter);
//                             setSelectedTopics([]);
//                           }
//                         }}
//                         className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 text-left"
//                       >
//                         <span className="font-medium text-gray-700">
//                           Chapter {chapter.chapterNumber}: {chapter.chapterName}
//                         </span>
//                         {expandedChapters[chapter.chapterNumber] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                       </button>
                      
//                       {expandedChapters[chapter.chapterNumber] && selectedChapter?.chapterNumber === chapter.chapterNumber && (
//                         <div className="px-4 pb-3 space-y-2">
//                           <div className="flex justify-between items-center">
//                             <p className="text-sm text-gray-500">Select topics for this assignment:</p>
//                             <div className="flex gap-2">
//                               <button onClick={selectAllTopics} className="text-xs text-blue-600 hover:text-blue-700">Select All</button>
//                               <button onClick={clearAllTopics} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
//                             </div>
//                           </div>
//                           <div className="flex flex-wrap gap-2">
//                             {chapter.topics?.map((topic, idx) => (
//                               <button
//                                 key={idx}
//                                 type="button"
//                                 onClick={() => toggleTopic(topic)}
//                                 className={`px-3 py-1 rounded-full text-sm transition-colors ${
//                                   selectedTopics.includes(topic)
//                                     ? "bg-purple-600 text-white"
//                                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                                 }`}
//                               >
//                                 {topic}
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {/* Generate Button */}
//             {selectedChapter && selectedTopics.length > 0 && (
//               <button
//                 type="button"
//                 onClick={handleGenerateAI}
//                 disabled={generatingAI}
//                 className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center justify-center gap-2"
//               >
//                 {generatingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles size={16} />}
//                 Generate Assignments
//               </button>
//             )}
            
//             {/* AI Recommendations */}
//             {aiRecommendations.length > 0 && (
//               <div className="space-y-3">
//                 <p className="font-medium text-gray-700">AI Recommendations:</p>
//                 {aiRecommendations.map((rec, idx) => (
//                   <div key={idx} className="border border-purple-200 bg-purple-50 rounded-lg p-3">
//                     <h4 className="font-medium text-purple-800">{rec.title}</h4>
//                     <p className="text-sm text-purple-600 mt-1">{rec.description}</p>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData({
//                           ...formData,
//                           title: rec.title,
//                           description: rec.description,
//                           dueDate: "",
//                           maxMarks: 100
//                         });
//                         setAiRecommendations([]);
//                       }}
//                       className="mt-2 text-sm text-purple-700 hover:text-purple-800 flex items-center gap-1"
//                     >
//                       <CheckCircle size={14} /> Use this assignment
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             {/* Manual Entry Form */}
//             {formData.title && (
//               <div className="border-t pt-4 mt-2">
//                 <p className="font-medium text-gray-700 mb-3">Assignment Details:</p>
//                 <div className="space-y-3">
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => setFormData({...formData, title: e.target.value})}
//                     placeholder="Assignment Title"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   />
//                   <textarea
//                     rows="2"
//                     value={formData.description}
//                     onChange={(e) => setFormData({...formData, description: e.target.value})}
//                     placeholder="Description"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   />
//                   <div className="grid grid-cols-2 gap-3">
//                     <input
//                       type="date"
//                       value={formData.dueDate}
//                       onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
//                       className="px-3 py-2 border border-gray-300 rounded-lg"
//                       required
//                     />
//                     <input
//                       type="number"
//                       value={formData.maxMarks}
//                       onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
//                       placeholder="Max Marks"
//                       className="px-3 py-2 border border-gray-300 rounded-lg"
//                     />
//                   </div>
//                   <button
//                     onClick={handleCreateAssignment}
//                     disabled={createAssignmentMutation.isPending}
//                     className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center justify-center gap-2"
//                   >
//                     {createAssignmentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
//                     Publish Assignment
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Modal>
//       )}

//       {/* Edit Assignment Modal */}
//       {showEditModal && selectedAssignment && (
//         <Modal title="Edit Assignment" onClose={() => setShowEditModal(false)} size="lg">
//           <form onSubmit={handleUpdateAssignment} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
//               <input
//                 type="text"
//                 value={selectedAssignment.title || ""}
//                 onChange={(e) => setSelectedAssignment({...selectedAssignment, title: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 required
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//               <textarea
//                 rows="3"
//                 value={selectedAssignment.description || ""}
//                 onChange={(e) => setSelectedAssignment({...selectedAssignment, description: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
//                 <input
//                   type="text"
//                   value={selectedAssignment.subjectName || selectedAssignment.subject || ""}
//                   disabled
//                   className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
//                 <input
//                   type="text"
//                   value={selectedAssignment.targetClass || ""}
//                   disabled
//                   className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
//                 />
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
//                 <input
//                   type="date"
//                   value={selectedAssignment.dueDate?.split('T')[0] || ""}
//                   onChange={(e) => setSelectedAssignment({...selectedAssignment, dueDate: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
//                 <input
//                   type="number"
//                   value={selectedAssignment.maxMarks || 100}
//                   onChange={(e) => setSelectedAssignment({...selectedAssignment, maxMarks: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 />
//               </div>
//             </div>
            
//             <div className="flex gap-3 pt-4">
//               <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
//               <button type="submit" disabled={updateAssignmentMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
//                 {updateAssignmentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
//                 Update Assignment
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, icon, valueColor = "text-gray-800" }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
//         </div>
//         {icon}
//       </div>
//     </div>
//   );
// }

// // Modal Component
// function Modal({ title, children, onClose, size = "md" }) {
//   const maxWidth = size === "lg" ? "max-w-2xl" : "max-w-md";
  
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className={`bg-white rounded-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}>
//         <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
//           <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X size={24} />
//           </button>
//         </div>
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }