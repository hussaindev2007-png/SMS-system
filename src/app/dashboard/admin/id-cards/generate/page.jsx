"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  IdCard,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  QrCode,
  Download,
  Printer,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  GraduationCap,
  MapPin,
  BookOpen
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import apiClient from "@/services/apiClient";
import Image from "next/image";

export default function GenerateIDCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [idCardData, setIdCardData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Search students
  const searchStudents = async () => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      toast.error("Please enter at least 2 characters to search");
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get(`/admin/students`, {
        params: {
          search: searchTerm,
          page: 1,
          limit: 10
        }
      });
      
      if (response.data.students && response.data.students.length > 0) {
        setStudents(response.data.students);
      } else {
        setStudents([]);
        toast.error("No students found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search students");
    } finally {
      setLoading(false);
    }
  };

  // Generate ID Card for selected student
  const generateIDCard = async (student) => {
    setGenerating(true);
    try {
      const response = await apiClient.post(`/admin/id-cards/generate`, {
        studentId: student._id
      });
      
      if (response.data.success) {
        setIdCardData(response.data.data);
        setSelectedStudent(student);
        setShowPreview(true);
        toast.success("ID Card generated successfully!");
      } else {
        toast.error(response.data.message || "Failed to generate ID Card");
      }
    } catch (error) {
      console.error("Generate error:", error);
      toast.error(error.response?.data?.message || "Failed to generate ID Card");
    } finally {
      setGenerating(false);
    }
  };

  // Download ID Card
  const downloadIDCard = () => {
    if (!idCardData) return;
    
    // Create a temporary canvas to capture the card
    const cardElement = document.getElementById("id-card-preview");
    if (cardElement) {
      toast.loading("Preparing download...");
      // For now, just show info
      toast.dismiss();
      toast.success("ID Card can be printed or screenshot");
    }
  };

  // Print ID Card
  const printIDCard = () => {
    const printContent = document.getElementById("id-card-preview");
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <IdCard className="w-8 h-8" />
                Generate ID Card
              </h1>
              <p className="text-blue-100 mt-1">
                Search and generate ID card for students (for lost/damaged cards)
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/admin/id-cards")}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Eye size={18} />
              View All ID Cards
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search size={20} />
            Search Student
          </h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, roll number, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchStudents()}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={searchStudents}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={18} />}
              Search
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Enter at least 2 characters to search. You can search by name, roll number, email, or phone.
          </p>
        </div>

        {/* Search Results */}
        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700">Search Results ({students.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium overflow-hidden">
                            {student.photoUrl ? (
                              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                              student.name?.charAt(0).toUpperCase() || "S"
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.fatherName}</p>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <p className="font-mono text-sm font-medium text-gray-700">{student.rollNo}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">Class {student.className}</p>
                        <p className="text-xs text-gray-500">Section: {student.section}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {student.email && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={12} /> {student.email}
                            </p>
                          )}
                          {student.phone && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {student.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => generateIDCard(student)}
                          disabled={generating}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          {generating && selectedStudent?._id === student._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <IdCard size={16} />
                          )}
                          Generate ID Card
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ID Card Preview Modal */}
        {showPreview && selectedStudent && idCardData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <IdCard size={20} className="text-blue-600" />
                  Student ID Card
                </h2>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setSelectedStudent(null);
                    setIdCardData(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {/* ID Card Design */}
                <div id="id-card-preview" className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto">
                  {/* Header */}
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-4 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-xl">School Management System</h3>
                        <p className="text-blue-200 text-xs">Student Identity Card</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-6">
                    <div className="flex gap-5">
                      {/* Student Photo */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 rounded-xl bg-white/10 border-2 border-white/30 overflow-hidden flex items-center justify-center">
                          {selectedStudent.photoUrl ? (
                            <img
                              src={selectedStudent.photoUrl}
                              alt={selectedStudent.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                              <User className="w-10 h-10 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-blue-200 text-xs uppercase tracking-wider">Full Name</p>
                          <p className="text-white font-semibold text-lg">{selectedStudent.name}</p>
                        </div>
                        <div>
                          <p className="text-blue-200 text-xs uppercase tracking-wider">Roll Number</p>
                          <p className="text-white font-mono text-base font-bold">{selectedStudent.rollNo}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-blue-200 text-xs uppercase tracking-wider">Class</p>
                            <p className="text-white font-medium">{selectedStudent.className}</p>
                          </div>
                          <div>
                            <p className="text-blue-200 text-xs uppercase tracking-wider">Section</p>
                            <p className="text-white font-medium">{selectedStudent.section}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/20 my-4"></div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Father Name</p>
                        <p className="text-white text-sm">{selectedStudent.fatherName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Card Number</p>
                        <p className="text-white text-sm font-mono">{idCardData.cardNumber || "SID-2024-XXXX"}</p>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mt-4">
                      <div className="bg-white p-2 rounded-lg">
                        {idCardData.qrCodeData ? (
                          <img
                            src={idCardData.qrCodeData}
                            alt="QR Code"
                            className="w-24 h-24"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-white/20 text-center">
                      <p className="text-blue-200 text-xs">
                        Issued: {formatDate(idCardData.issueDate)} | Valid: {formatDate(idCardData.expiryDate)}
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
                    Download (PNG)
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      setSelectedStudent(null);
                      setIdCardData(null);
                      setStudents([]);
                      setSearchTerm("");
                    }}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-4">
                  ⚠️ This ID card can be printed and laminated. Keep a copy in student's record.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            Instructions
          </h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Search for a student by name, roll number, email, or phone number</li>
            <li>• Select the student from search results and click "Generate ID Card"</li>
            <li>• Preview the ID card before printing</li>
            <li>• Use "Print ID Card" to print directly or "Download as PNG" to save</li>
            <li>• Lost ID cards can be regenerated and printed using this tool</li>
            <li>• Each ID card contains a unique QR code for verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}