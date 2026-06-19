"use client";

import { useState } from "react";
import { Search, Loader2, Mail, QrCode, Download, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/services/apiClient";

export default function GenerateLoginQRPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  // Search students
  const searchStudents = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/admin/students/search?q=${searchTerm}`);
      setStudents(response.data.students || []);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Generate login QR for a student
  const generateLoginQR = async (student) => {
    setGenerating(student._id);
    try {
      const response = await apiClient.post("/admin/generate-login-qr", {
        studentId: student._id,
        studentEmail: student.email,
        studentName: student.name
      });
      
      if (response.data.success) {
        toast.success(`Login QR sent to ${student.email}`);
        setQrPreview(response.data.qrCodeData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <QrCode className="text-blue-500" />
            Generate Login QR Codes
          </h1>
          <p className="text-gray-400 mt-1">Send login QR codes to students via email</p>
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search by name, roll number, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchStudents()}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <button
              onClick={searchStudents}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Search"}
            </button>
          </div>
        </div>

        {/* Students List */}
        {students.length > 0 && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-5 py-3 text-left text-gray-300">Student</th>
                  <th className="px-5 py-3 text-left text-gray-300">Roll No</th>
                  <th className="px-5 py-3 text-left text-gray-300">Class</th>
                  <th className="px-5 py-3 text-left text-gray-300">Email</th>
                  <th className="px-5 py-3 text-left text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-750">
                    <td className="px-5 py-3 text-white">{student.name}</td>
                    <td className="px-5 py-3 text-gray-400">{student.rollNo}</td>
                    <td className="px-5 py-3 text-gray-400">Class {student.className}-{student.section}</td>
                    <td className="px-5 py-3 text-gray-400">{student.email || "No email"}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => generateLoginQR(student)}
                        disabled={generating === student._id || !student.email}
                        className="px-3 py-1.5 bg-green-600 rounded-lg text-white text-sm flex items-center gap-1 disabled:opacity-50"
                      >
                        {generating === student._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Mail size={14} />
                        )}
                        Send QR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <h3 className="text-blue-400 font-medium mb-2">ℹ️ About Login QR Code</h3>
          <p className="text-gray-400 text-sm">
            When student scans this QR code on login page, they will receive an OTP on their registered email.
            After entering OTP, they will be logged in automatically. No password required!
          </p>
        </div>
      </div>
    </div>
  );
}