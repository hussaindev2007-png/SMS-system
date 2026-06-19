"use client";

import { useState } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Upload,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  GraduationCap,
  Layers,
  BookMarked,
  RefreshCw
} from "lucide-react";
import { 
  useSyllabuses, 
  useUploadSyllabus, 
  useGenerateAISyllabus, 
  useUpdateSyllabus, 
  useDeleteSyllabus 
} from "@/hooks/useAdminQueries";
import { useSubjects } from "@/hooks/useAdminQueries";
import toast from "react-hot-toast";

export default function AdminSyllabusPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [editChapters, setEditChapters] = useState([]);
  
  // Upload form state
  const [uploadData, setUploadData] = useState({
    pdf: null,
    className: "",
    subjectId: "",
    board: "sindh",
    academicYear: new Date().getFullYear().toString()
  });

  // React Query hooks
  const { 
    data: syllabusesData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useSyllabuses();
  
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  
  const uploadMutation = useUploadSyllabus();
  const generateAIMutation = useGenerateAISyllabus();
  const updateMutation = useUpdateSyllabus();
  const deleteMutation = useDeleteSyllabus();

  const syllabuses = syllabusesData?.data || [];
  
  // Filter syllabuses
  const filteredSyllabuses = syllabuses.filter(s =>
    !searchTerm || 
    s.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.targetClass?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.board?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get subject name by ID
  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => s._id === subjectId);
    return subject?.name || subjectId;
  };

  // Upload PDF syllabus
  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadData.pdf || !uploadData.className || !uploadData.subjectId) {
      toast.error("Please fill all required fields and select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", uploadData.pdf);
    formData.append("class", uploadData.className);
    formData.append("subject", uploadData.subjectId);
    formData.append("board", uploadData.board);
    formData.append("academicYear", uploadData.academicYear);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setUploadData({
          pdf: null,
          className: "",
          subjectId: "",
          board: "sindh",
          academicYear: new Date().getFullYear().toString()
        });
        setShowUploadModal(false);
      }
    });
  };

  // Generate AI syllabus
  const handleGenerateAI = () => {
    if (!uploadData.subjectId || !uploadData.className) {
      toast.error("Please select subject and class first");
      return;
    }

    generateAIMutation.mutate({
      subjectId: uploadData.subjectId,
      targetClass: uploadData.className,
      board: uploadData.board,
      academicYear: uploadData.academicYear
    }, {
      onSuccess: () => {
        setShowUploadModal(false);
        setUploadData({
          pdf: null,
          className: "",
          subjectId: "",
          board: "sindh",
          academicYear: new Date().getFullYear().toString()
        });
      }
    });
  };

  // Update syllabus chapters
  const handleUpdate = () => {
    if (!selectedSyllabus) return;

    updateMutation.mutate({
      id: selectedSyllabus._id,
      data: {
        chapters: editChapters,
        isVerified: false
      }
    }, {
      onSuccess: () => {
        setShowEditModal(false);
        setSelectedSyllabus(null);
        setEditChapters([]);
      }
    });
  };

  // Delete syllabus
  const handleDelete = (id, name) => {
    if (!confirm(`Are you sure you want to delete syllabus for "${name}"?`)) return;
    deleteMutation.mutate(id);
  };

  // Toggle chapter expansion
  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Update chapter in edit mode
  const updateChapter = (index, field, value) => {
    const updated = [...editChapters];
    updated[index][field] = value;
    setEditChapters(updated);
  };

  // Add topic to chapter
  const addTopic = (chapterIndex) => {
    const updated = [...editChapters];
    if (!updated[chapterIndex].topics) updated[chapterIndex].topics = [];
    updated[chapterIndex].topics.push("");
    setEditChapters(updated);
  };

  // Remove topic from chapter
  const removeTopic = (chapterIndex, topicIndex) => {
    const updated = [...editChapters];
    updated[chapterIndex].topics.splice(topicIndex, 1);
    setEditChapters(updated);
  };

  // Update topic
  const updateTopic = (chapterIndex, topicIndex, value) => {
    const updated = [...editChapters];
    updated[chapterIndex].topics[topicIndex] = value;
    setEditChapters(updated);
  };

  // Add new chapter
  const addNewChapter = () => {
    const newChapterNumber = editChapters.length + 1;
    setEditChapters([
      ...editChapters,
      {
        chapterNumber: newChapterNumber,
        chapterName: "",
        topics: []
      }
    ]);
  };

  // Remove chapter
  const removeChapter = (index) => {
    const updated = editChapters.filter((_, i) => i !== index);
    updated.forEach((ch, idx) => {
      ch.chapterNumber = idx + 1;
    });
    setEditChapters(updated);
  };

  // Classes for dropdown
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const boards = ["sindh", "punjab", "kpk", "balochistan"];

  const totalSyllabuses = syllabuses.length;
  const totalChapters = syllabuses.reduce((acc, s) => acc + (s.chapters?.length || 0), 0);
  const totalTopics = syllabuses.reduce((acc, s) => 
    acc + (s.chapters?.reduce((a, ch) => a + (ch.topics?.length || 0), 0) || 0), 0);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading syllabuses...</p>
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
          <p className="text-red-500 text-lg">Error loading syllabuses</p>
          <p className="text-gray-500 text-sm">{error?.message || "Please try again"}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
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
                <BookMarked className="text-blue-600" size={28} />
                Syllabus Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">Upload PDF or generate AI syllabus</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setUploadData({
                    pdf: null,
                    className: "",
                    subjectId: "",
                    board: "sindh",
                    academicYear: new Date().getFullYear().toString()
                  });
                  setShowUploadModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Upload size={18} />
                Add Syllabus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Total Syllabuses" value={totalSyllabuses} icon={<BookMarked className="w-8 h-8 text-blue-500 opacity-50" />} />
          <StatCard title="Total Chapters" value={totalChapters} icon={<Layers className="w-8 h-8 text-green-500 opacity-50" />} valueColor="text-green-600" />
          <StatCard title="Total Topics" value={totalTopics} icon={<BookOpen className="w-8 h-8 text-purple-500 opacity-50" />} valueColor="text-purple-600" />
          <StatCard title="Subjects" value={subjects.length} icon={<GraduationCap className="w-8 h-8 text-orange-500 opacity-50" />} valueColor="text-orange-600" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by subject, class or board..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredSyllabuses.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mx-6 mt-6 border border-gray-100">
          <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No syllabuses found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm ? "Try a different search term" : "Click 'Add Syllabus' to get started"}
          </p>
        </div>
      )}

      {/* Syllabuses Grid */}
      {filteredSyllabuses.length > 0 && (
        <>
          <div className="px-6 mt-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredSyllabuses.map((syllabus) => (
                <div
                  key={syllabus._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {getSubjectName(syllabus.subjectId || syllabus.subjectName)}
                        </h3>
                        <div className="flex gap-3 mt-1">
                          <span className="text-sm text-gray-500">Class: {syllabus.targetClass}</span>
                          <span className="text-sm text-gray-500">Board: {syllabus.board?.toUpperCase()}</span>
                          <span className="text-sm text-gray-500">
                            Year: {syllabus.academicYear || new Date().getFullYear()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSyllabus(syllabus);
                            setShowViewModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSyllabus(syllabus);
                            setEditChapters(JSON.parse(JSON.stringify(syllabus.chapters || [])));
                            setShowEditModal(true);
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(syllabus._id, getSubjectName(syllabus.subjectId || syllabus.subjectName))}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold text-blue-600">{syllabus.chapters?.length || 0}</p>
                        <p className="text-xs text-gray-500">Chapters</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {syllabus.chapters?.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0) || 0}
                        </p>
                        <p className="text-xs text-gray-500">Topics</p>
                      </div>
                    </div>
                    
                    {/* Chapter Preview */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">Chapters:</p>
                      <div className="flex flex-wrap gap-1">
                        {(syllabus.chapters || []).slice(0, 5).map((ch, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            {ch.chapterName?.substring(0, 20)}{(ch.chapterName?.length || 0) > 20 ? "..." : ""}
                          </span>
                        ))}
                        {(syllabus.chapters?.length || 0) > 5 && (
                          <span className="text-xs text-gray-400">+{syllabus.chapters.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500">
                Showing {filteredSyllabuses.length} of {syllabuses.length} syllabuses
              </p>
            </div>
          </div>
        </>
      )}

      {/* Add Syllabus Modal */}
      {showUploadModal && (
        <Modal title="Add Syllabus" onClose={() => setShowUploadModal(false)} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <select
                  value={uploadData.subjectId}
                  onChange={(e) => setUploadData({...uploadData, subjectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                  disabled={subjectsLoading}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <select
                  value={uploadData.className}
                  onChange={(e) => setUploadData({...uploadData, className: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board *</label>
                <select
                  value={uploadData.board}
                  onChange={(e) => setUploadData({...uploadData, board: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {boards.map(b => (
                    <option key={b} value={b}>{b.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={uploadData.academicYear}
                  onChange={(e) => setUploadData({...uploadData, academicYear: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUploadData({...uploadData, pdf: e.target.files[0]})}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {uploadData.pdf ? uploadData.pdf.name : "Click to select PDF file"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF format only (or use AI generate)</p>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-600 text-sm flex items-center gap-2">
                <AlertCircle size={14} />
                AI will automatically extract chapters and topics from PDF
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={generateAIMutation.isPending || !uploadData.subjectId || !uploadData.className}
                className="flex-1 px-4 py-2 bg-purple-600 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generateAIMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain size={16} />}
                AI Generate
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !uploadData.pdf}
                className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={16} />}
                Upload PDF
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && selectedSyllabus && (
        <Modal title="Syllabus Details" onClose={() => setShowViewModal(false)} size="lg">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800">{getSubjectName(selectedSyllabus.subjectId || selectedSyllabus.subjectName)}</h3>
              <div className="flex gap-3 mt-1 text-sm text-gray-500">
                <span>Class: {selectedSyllabus.targetClass}</span>
                <span>Board: {selectedSyllabus.board?.toUpperCase()}</span>
                <span>Year: {selectedSyllabus.academicYear || new Date().getFullYear()}</span>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(selectedSyllabus.chapters || []).map((chapter, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleChapter(idx)}
                    className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100"
                  >
                    <span className="font-medium text-gray-800">
                      Chapter {chapter.chapterNumber}: {chapter.chapterName}
                    </span>
                    {expandedChapters[idx] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedChapters[idx] && (
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">Topics:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {(chapter.topics || []).map((topic, tIdx) => (
                          <li key={tIdx} className="text-gray-600 text-sm">{topic}</li>
                        ))}
                        {(chapter.topics || []).length === 0 && (
                          <li className="text-gray-400 text-sm">No topics available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSyllabus && (
        <Modal title="Edit Syllabus" onClose={() => setShowEditModal(false)} size="lg">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p><strong>Subject:</strong> {getSubjectName(selectedSyllabus.subjectId || selectedSyllabus.subjectName)}</p>
              <p><strong>Class:</strong> {selectedSyllabus.targetClass}</p>
              <p><strong>Board:</strong> {selectedSyllabus.board?.toUpperCase()}</p>
            </div>

            {editChapters.map((chapter, chIdx) => (
              <div key={chIdx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Chapter {chapter.chapterNumber}</h4>
                  <button
                    type="button"
                    onClick={() => removeChapter(chIdx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove Chapter
                  </button>
                </div>
                
                <input
                  type="text"
                  value={chapter.chapterName || ""}
                  onChange={(e) => updateChapter(chIdx, "chapterName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                  placeholder="Chapter Name"
                />
                
                <label className="text-sm text-gray-600 mb-2 block">Topics:</label>
                {(chapter.topics || []).map((topic, tIdx) => (
                  <div key={tIdx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateTopic(chIdx, tIdx, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder={`Topic ${tIdx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeTopic(chIdx, tIdx)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addTopic(chIdx)}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  + Add Topic
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addNewChapter}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              + Add New Chapter
            </button>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Save Changes
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

// Brain icon for AI generate
const Brain = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4a4 4 0 0 1 3.5 6A4 4 0 0 1 12 18a4 4 0 0 1-3.5-6A4 4 0 0 1 12 4z"/>
    <path d="M12 8v8"/>
    <path d="M8 12h8"/>
  </svg>
);