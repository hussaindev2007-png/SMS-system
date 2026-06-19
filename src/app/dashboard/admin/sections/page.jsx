"use client";

import { useState, useEffect } from "react";
import { 
  Save, Loader2, Plus, X, AlertCircle, 
  CheckCircle, RefreshCw, Settings, BookOpen,
  Trash2, Edit, Pencil, School, Eye
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SectionsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState(null);
  const [classConfigs, setClassConfigs] = useState([]);
  const [error, setError] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [editData, setEditData] = useState({ sections: [], maxStudents: 30 });
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassSections, setNewClassSections] = useState(["A"]);
  const [newClassMaxStudents, setNewClassMaxStudents] = useState(30);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/sections");
      const data = await response.json();
      
      if (data.success) {
        setConfig(data.data);
        setClassConfigs(data.data.classConfigs || []);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to load configuration");
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  // Update class sections
  const updateClassSections = (className, sections) => {
    const updated = [...classConfigs];
    const index = updated.findIndex(c => c.className === className);
    
    if (index !== -1) {
      updated[index].sections = sections;
    } else {
      updated.push({ className, sections, maxStudentsPerSection: 30 });
    }
    
    setClassConfigs(updated);
  };

  // Delete entire class configuration
  const deleteClassConfig = (className) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="font-medium text-sm">Delete Class {className} Configuration?</p>
          <p className="text-xs text-gray-500 mt-0.5">This will remove all section settings for Class {className}.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading("Deleting...");
              try {
                const response = await fetch(`/api/admin/sections?className=${className}`, {
                  method: "DELETE",
                });
                const data = await response.json();
                if (data.success) {
                  toast.dismiss(loadingToast);
                  toast.success(`Class ${className} configuration removed`);
                  fetchConfig();
                } else {
                  toast.dismiss(loadingToast);
                  toast.error(data.error || "Failed to delete");
                }
              } catch (error) {
                toast.dismiss(loadingToast);
                toast.error("Network error");
              }
            }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
    });
  };

  // Edit class configuration
  const startEdit = (className) => {
    const classConfig = classConfigs.find(c => c.className === className);
    setEditingClass(className);
    setEditData({
      sections: classConfig?.sections || ["A"],
      maxStudents: classConfig?.maxStudentsPerSection || 30
    });
  };

  const saveEdit = async () => {
    const loadingToast = toast.loading("Saving...");
    try {
      const response = await fetch(`/api/admin/sections?className=${editingClass}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: editData.sections,
          maxStudentsPerSection: editData.maxStudents
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.dismiss(loadingToast);
        toast.success(`Class ${editingClass} configuration updated`);
        setEditingClass(null);
        fetchConfig();
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Failed to update");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error");
    }
  };

  const cancelEdit = () => {
    setEditingClass(null);
    setEditData({ sections: [], maxStudents: 30 });
  };

  // Add new class
  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      toast.error("Class name is required");
      return;
    }
    
    if (classConfigs.some(c => c.className === newClassName)) {
      toast.error(`Class ${newClassName} already exists`);
      return;
    }
    
    const loadingToast = toast.loading("Adding class...");
    
    try {
      const response = await fetch(`/api/admin/sections?className=${newClassName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: newClassSections,
          maxStudentsPerSection: newClassMaxStudents
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.dismiss(loadingToast);
        toast.success(`Class ${newClassName} added successfully`);
        setShowAddClassModal(false);
        setNewClassName("");
        setNewClassSections(["A"]);
        setNewClassMaxStudents(30);
        fetchConfig();
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Failed to add class");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Network error");
    }
  };

  const addNewSection = () => {
    const nextSection = String.fromCharCode(65 + newClassSections.length);
    if (nextSection <= 'G') {
      setNewClassSections([...newClassSections, nextSection]);
    } else {
      toast.error("Maximum 7 sections allowed (A-G)");
    }
  };

  const removeNewSection = (sectionToRemove) => {
    if (newClassSections.length > 1) {
      setNewClassSections(newClassSections.filter(s => s !== sectionToRemove));
    } else {
      toast.error("At least one section is required");
    }
  };

  const getSectionsForClass = (className) => {
    const classConfig = classConfigs.find(c => c.className === className);
    return classConfig?.sections || ["A"];
  };

  const getMaxStudentsForClass = (className) => {
    const classConfig = classConfigs.find(c => c.className === className);
    return classConfig?.maxStudentsPerSection || 30;
  };

  const handleSaveAll = async () => {
    setSaving(true);
    
    try {
      const response = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academicYear: config?.academicYear,
          classConfigs: classConfigs
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("All configurations saved successfully!");
        fetchConfig();
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Sort class configs numerically
  const sortedClassConfigs = [...classConfigs].sort((a, b) => {
    const numA = parseInt(a.className);
    const numB = parseInt(b.className);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.className.localeCompare(b.className);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings size={24} />
                Class Section Configuration
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure sections and capacity for each class
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddClassModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                Add New Class
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                Save All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Academic Year Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <p className="text-blue-700 text-sm flex items-center gap-2">
            <BookOpen size={16} />
            Academic Year: <strong>{config?.academicYear || "Not set"}</strong>
          </p>
        </div>

        {/* No Classes Message */}
        {sortedClassConfigs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <School size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No classes configured yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Add New Class" to configure sections for a class
            </p>
          </div>
        )}

        {/* Class Sections Grid */}
        {sortedClassConfigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedClassConfigs.map((classItem) => {
              const className = classItem.className;
              const sections = classItem.sections;
              const maxStudents = classItem.maxStudentsPerSection;
              const isEditing = editingClass === className;
              
              return (
                <div key={className} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 flex justify-between items-center">
                    <h3 className="text-white font-semibold text-lg">Class {className}</h3>
                    <div className="flex gap-1">
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(className)}
                          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors cursor-pointer"
                          title="Edit Configuration"
                        >
                          <Pencil size={14} className="text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteClassConfig(className)}
                        className="p-1.5 bg-white/20 hover:bg-red-500/80 rounded-lg transition-colors cursor-pointer"
                        title="Delete Configuration"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {isEditing ? (
                      // EDIT MODE
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Sections (A-G)
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editData.sections.map((section) => (
                              <div key={section} className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1.5">
                                <span className="text-sm font-medium text-gray-700">Section {section}</span>
                                <button
                                  onClick={() => {
                                    if (editData.sections.length > 1) {
                                      setEditData({
                                        ...editData,
                                        sections: editData.sections.filter(s => s !== section)
                                      });
                                    }
                                  }}
                                  className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
                                >
                                  <X size={12} className="text-gray-500" />
                                </button>
                              </div>
                            ))}
                            {editData.sections.length < 7 && (
                              <button
                                onClick={() => {
                                  const nextSection = String.fromCharCode(65 + editData.sections.length);
                                  if (nextSection <= 'G') {
                                    setEditData({
                                      ...editData,
                                      sections: [...editData.sections, nextSection]
                                    });
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-500 hover:text-blue-500 cursor-pointer"
                              >
                                <Plus size={12} />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Max Students per Section
                          </label>
                          <input
                            type="number"
                            value={editData.maxStudents}
                            onChange={(e) => setEditData({...editData, maxStudents: parseInt(e.target.value)})}
                            min="1"
                            max="100"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={saveEdit}
                            className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // VIEW MODE
                      <>
                        <div className="mb-4">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Max Students per Section
                          </label>
                          <div className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            {maxStudents} students
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-2">
                            Sections
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {sections.map((section) => (
                              <div key={section} className="bg-gray-100 rounded-lg px-3 py-1.5">
                                <span className="text-sm font-medium text-gray-700">Section {section}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-400">Roll Number Format:</p>
                          <p className="text-xs font-mono text-gray-600 mt-1">
                            {sections.map(s => `${className}${s}001`).join(", ")}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Info Box */}
        <div className="mt-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-amber-700 text-sm flex items-start gap-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> When approving new students, the system will automatically 
              assign the section with the least number of students based on this configuration. 
              Once a section reaches its maximum capacity, new students will be assigned to other available sections.
            </span>
          </p>
        </div>
      </div>

      {/* ADD CLASS MODAL */}
      {showAddClassModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add New Class</h2>
                <p className="text-xs text-gray-500 mt-0.5">Configure sections for a new class</p>
              </div>
              <button 
                onClick={() => setShowAddClassModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., 5, 6, 7, 8, 9, 10, 11, 12, 13"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">You can add any class number (e.g., 5, 6, 7, 8, 9, 10, 11, 12, 13, etc.)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sections
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newClassSections.map((section) => (
                    <div key={section} className="flex items-center gap-1 bg-gray-100 rounded-lg px-3 py-1.5">
                      <span className="text-sm font-medium text-gray-700">Section {section}</span>
                      <button
                        onClick={() => removeNewSection(section)}
                        className="p-0.5 hover:bg-gray-200 rounded cursor-pointer"
                      >
                        <X size={12} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
                  {newClassSections.length < 7 && (
                    <button
                      onClick={addNewSection}
                      className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-blue-500 hover:text-blue-500 cursor-pointer"
                    >
                      <Plus size={12} />
                      Add Section
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Maximum 7 sections (A-G)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Max Students per Section
                </label>
                <input
                  type="number"
                  value={newClassMaxStudents}
                  onChange={(e) => setNewClassMaxStudents(parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowAddClassModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}