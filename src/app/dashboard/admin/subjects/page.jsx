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
  GraduationCap,
  Layers,
  RefreshCw
} from "lucide-react";
import { useSubjects, useAddSubject, useUpdateSubject, useDeleteSubject } from "@/hooks/useAdminQueries";
import toast from "react-hot-toast";

export default function AdminSubjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editSubjectName, setEditSubjectName] = useState("");
  const [formError, setFormError] = useState("");

  // React Query hooks
  const { data: subjects = [], isLoading, isError, error, refetch, isFetching } = useSubjects();
  const addSubjectMutation = useAddSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();

  // Filter subjects
  const filteredSubjects = subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Add Subject
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      setFormError("Subject name is required");
      return;
    }

    setFormError("");
    addSubjectMutation.mutate(newSubjectName.trim(), {
      onSuccess: () => {
        setShowAddModal(false);
        setNewSubjectName("");
      },
      onError: (err) => {
        setFormError(err.response?.data?.message || "Failed to add subject");
      }
    });
  };

  // Handle Update Subject
  const handleUpdateSubject = (e) => {
    e.preventDefault();
    if (!editSubjectName.trim()) {
      setFormError("Subject name is required");
      return;
    }

    setFormError("");
    updateSubjectMutation.mutate({
      id: selectedSubject._id,
      name: editSubjectName.trim()
    }, {
      onSuccess: () => {
        setShowEditModal(false);
        setSelectedSubject(null);
        setEditSubjectName("");
      },
      onError: (err) => {
        setFormError(err.response?.data?.message || "Failed to update subject");
      }
    });
  };

  // Handle Delete Subject
  const handleDeleteSubject = (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    
    deleteSubjectMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`"${name}" deleted successfully!`);
      }
    });
  };

  const totalSubjects = subjects.length;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading subjects...</p>
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
          <p className="text-red-500 text-lg">Error loading subjects</p>
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
                <BookOpen className="text-blue-600" size={28} />
                Subject Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage academic subjects for the school</p>
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
                  setNewSubjectName("");
                  setFormError("");
                  setShowAddModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Add New Subject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Subjects" value={totalSubjects} icon={<BookOpen className="w-8 h-8 text-blue-500 opacity-50" />} />
          <StatCard title="Active Subjects" value={totalSubjects} icon={<CheckCircle className="w-8 h-8 text-green-500 opacity-50" />} valueColor="text-green-600" />
          <StatCard title="Categories" value="Academic" icon={<Layers className="w-8 h-8 text-purple-500 opacity-50" />} valueColor="text-purple-600" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search subjects by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredSubjects.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mx-6 mt-6 border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No subjects found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm ? "Try a different search term" : "Click 'Add New Subject' to get started"}
          </p>
        </div>
      )}

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 && (
        <div className="px-6 mt-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSubjects.map((subject) => (
              <div
                key={subject._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">ID: {subject._id.slice(-6)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubject(subject);
                        setEditSubjectName(subject.name);
                        setFormError("");
                        setShowEditModal(true);
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject._id, subject.name)}
                      disabled={deleteSubjectMutation.isPending}
                      className="flex-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                    >
                      {deleteSubjectMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredSubjects.length} of {subjects.length} subjects
            </p>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <Modal title="Add New Subject" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g., MATHEMATICS, PHYSICS, ENGLISH"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
                autoComplete="off"
              />
              <p className="text-xs text-gray-400 mt-1">Subject name will be stored in uppercase</p>
            </div>
            
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {formError}
                </p>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={addSubjectMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50">
                {addSubjectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Add Subject
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && selectedSubject && (
        <Modal title="Edit Subject" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleUpdateSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                value={editSubjectName}
                onChange={(e) => setEditSubjectName(e.target.value)}
                placeholder="e.g., MATHEMATICS, PHYSICS, ENGLISH"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 uppercase"
                autoComplete="off"
              />
              <p className="text-xs text-gray-400 mt-1">Subject name will be stored in uppercase</p>
            </div>
            
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{formError}</p>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={updateSubjectMutation.isPending} className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-50">
                {updateSubjectMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Update Subject
              </button>
            </div>
          </form>
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
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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