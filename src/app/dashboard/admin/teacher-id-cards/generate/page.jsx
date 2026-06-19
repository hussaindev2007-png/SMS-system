"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IdCard,
  Search,
  Loader2,
  RefreshCw,
  Eye,
  Printer,
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  QrCode,
  CheckCircle,
  AlertCircle,
  School,
  Briefcase,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/services/apiClient";

export default function GenerateTeacherIDCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // ✅ Use correct API endpoint
      const response = await apiClient.get(`/admin/teacher-id-card`);
      
      console.log("Fetch teachers response:", response.data);
      
      if (response.data.success) {
        // ✅ Use teachers array from response
        setTeachers(response.data.teachers || []);
      } else {
        toast.error("Failed to fetch teachers");
      }
    } catch (error) {
      console.error("Fetch teachers error:", error);
      toast.error("Error loading teachers");
    } finally {
      setLoading(false);
    }
  };

  const generateIDCard = async (teacher) => {
    setGenerating(true);
    setSelectedTeacher(teacher);
    
    try {
      // ✅ Use correct API endpoint (plural, not singular)
      const response = await apiClient.post(`/admin/teacher-id-card`, {
        teacherId: teacher._id
      });
      
      console.log("Generate response:", response.data);
      
      if (response.data.success) {
        setGeneratedCard(response.data.card);
        setShowPreview(true);
        toast.success(response.data.message || "ID Card generated successfully!");
        // Refresh teacher list to update status
        await fetchTeachers();
      } else {
        toast.error(response.data.message || "Failed to generate ID card");
      }
    } catch (error) {
      console.error("Generate error:", error);
      toast.error(error.response?.data?.message || "Error generating ID card");
    } finally {
      setGenerating(false);
    }
  };

  const printIDCard = () => {
    const printContent = document.getElementById("teacher-id-card-preview");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const downloadIDCard = () => {
    const cardElement = document.getElementById("teacher-id-card-preview");
    if (cardElement) {
      toast.loading("Preparing download...");
      setTimeout(() => {
        toast.dismiss();
        toast.success("Use Print to save as PDF");
      }, 1000);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    fetchTeachers();
    toast.success("Data refreshed!");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <IdCard className="w-8 h-8" />
                Generate Teacher ID Card
              </h1>
              <p className="text-purple-100 mt-1">
                Search and generate ID cards for approved teachers
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={fetchTeachers}
                disabled={loading}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={18} />}
                Search
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Showing {filteredTeachers.length} approved teachers
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}

        {/* No Teachers */}
        {!loading && filteredTeachers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <IdCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No approved teachers found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? "Try a different search term" : "Teachers will appear here after approval"}
            </p>
          </div>
        )}

        {/* Teachers Table */}
        {!loading && filteredTeachers.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Card Status</th>
                      <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedTeachers.map((teacher) => {
                      const isGenerating = generating && selectedTeacher?._id === teacher._id;
                      
                      return (
                        <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                          {/* Teacher Info */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden flex-shrink-0">
                                {teacher.photoUrl ? (
                                  <img 
                                    src={teacher.photoUrl} 
                                    alt={teacher.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-sm font-bold">
                                    {teacher.name?.charAt(0).toUpperCase() || "T"}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{teacher.name}</p>
                                <p className="text-xs text-gray-400">ID: {teacher._id?.slice(-8)}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{teacher.qualification || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          
                          {/* Department */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <Briefcase size={14} className="text-gray-400" />
                              <span className="text-sm text-gray-700">{teacher.department || "N/A"}</span>
                            </div>
                          </td>
                          
                          {/* Contact */}
                          <td className="px-5 py-4">
                            <div className="space-y-1">
                              {teacher.email && (
                                <div className="flex items-center gap-1.5">
                                  <Mail size={12} className="text-gray-400 flex-shrink-0" />
                                  <span className="text-xs text-gray-500 truncate max-w-[180px]">{teacher.email}</span>
                                </div>
                              )}
                              {teacher.phone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone size={12} className="text-gray-400 flex-shrink-0" />
                                  <span className="text-xs text-gray-500">{teacher.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          
                          {/* ID Card Status */}
                          <td className="px-5 py-4">
                            {teacher.idCardGenerated ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                <CheckCircle size={12} />
                                Generated
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                                <AlertCircle size={12} />
                                Not Generated
                              </span>
                            )}
                          </td>
                          
                          {/* Action Button */}
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => generateIDCard(teacher)}
                              disabled={isGenerating}
                              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto ${
                                teacher.idCardGenerated
                                  ? "bg-orange-600 hover:bg-orange-700"
                                  : "bg-purple-600 hover:bg-purple-700"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                              style={{ minWidth: "140px" }}
                            >
                              {isGenerating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <IdCard size={16} />
                              )}
                              {teacher.idCardGenerated ? "Regenerate" : "Generate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <p className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTeachers.length)} of {filteredTeachers.length} teachers
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-700 font-medium px-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                  >
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ID Card Preview Modal */}
        {showPreview && selectedTeacher && generatedCard && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <IdCard size={20} className="text-purple-600" />
                  Teacher ID Card Preview
                </h2>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setSelectedTeacher(null);
                    setGeneratedCard(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* ID Card Design */}
                <div id="teacher-id-card-preview" className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto">
                  {/* Header */}
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-xl">School Management System</h3>
                        <p className="text-purple-200 text-xs">Teacher Identity Card</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <School className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-6">
                    <div className="flex gap-5">
                      {/* Teacher Photo */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-xl bg-white/10 border-2 border-white/30 overflow-hidden flex items-center justify-center">
                          {selectedTeacher.photoUrl ? (
                            <img
                              src={selectedTeacher.photoUrl}
                              alt={selectedTeacher.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                              <User className="w-10 h-10 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-purple-200 text-xs uppercase tracking-wider">Full Name</p>
                          <p className="text-white font-semibold text-lg">{selectedTeacher.name}</p>
                        </div>
                        <div>
                          <p className="text-purple-200 text-xs uppercase tracking-wider">Teacher Code</p>
                          <p className="text-white font-mono text-base font-bold">{generatedCard.teacherCode}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-purple-200 text-xs uppercase tracking-wider">Department</p>
                            <p className="text-white font-medium">{selectedTeacher.department || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-purple-200 text-xs uppercase tracking-wider">Qualification</p>
                            <p className="text-white font-medium">{selectedTeacher.qualification || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/20 my-4"></div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-purple-200 text-xs uppercase tracking-wider">Email</p>
                        <p className="text-white text-sm truncate">{selectedTeacher.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-purple-200 text-xs uppercase tracking-wider">Phone</p>
                        <p className="text-white text-sm">{selectedTeacher.phone || "N/A"}</p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-purple-200 text-xs uppercase tracking-wider">Joining Date</p>
                      <p className="text-white text-sm">{formatDate(selectedTeacher.joiningDate)}</p>
                    </div>

                    <div className="flex justify-center mt-4">
                      <div className="bg-white p-2 rounded-lg">
                        <img src={generatedCard.qrCodeData} alt="QR Code" className="w-24 h-24" />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/20 text-center">
                      <p className="text-purple-200 text-xs">
                        Issued: {formatDate(generatedCard.issueDate)} | Valid: {formatDate(generatedCard.expiryDate)}
                      </p>
                      <p className="text-white/50 text-[10px] mt-1">
                        Scan QR code for verification | This card is property of SMS
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3 justify-center">
                  <button
                    onClick={printIDCard}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    <Printer size={18} />
                    Print ID Card
                  </button>
                  <button
                    onClick={downloadIDCard}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      setSelectedTeacher(null);
                      setGeneratedCard(null);
                    }}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-4">
                  ⚠️ This ID card can be printed and laminated. Keep a copy in teacher's record.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}