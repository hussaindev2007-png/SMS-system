"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  IdCard, Loader2, Download, Printer, 
  User, Mail, Phone, Calendar, Hash, 
  Building, Award, CheckCircle, AlertCircle,
  QrCode
} from "lucide-react";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

export default function TeacherIDCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [idCard, setIdCard] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    if (!token || userRole !== "teacher") {
      router.push("/login");
      return;
    }

    await fetchIDCard(userId);
  };

  const fetchIDCard = async (teacherId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/teacher/id-card?teacherId=${teacherId}`);
      
      if (response.data.success) {
        setIdCard(response.data.card);
        setTeacher(response.data.teacher);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching ID card:", err);
      setError(err.response?.data?.message || "Failed to load ID card");
      toast.error("Failed to load ID card");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      // Create a temporary link to download the card
      const element = document.getElementById("id-card-container");
      if (!element) return;
      
      // Simple download - just print for now
      window.print();
      toast.success("Print dialog opened");
    } catch (error) {
      toast.error("Download failed");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading ID Card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No ID Card Found</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!idCard || !teacher) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <IdCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No ID card available</p>
          <p className="text-gray-500 text-sm">Please contact admin</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(idCard.expiryDate) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-md mx-auto" id="id-card-container">
        {/* Header */}
        <div className="text-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-white">My ID Card</h1>
          <p className="text-gray-400 text-sm">Teacher Identity Card</p>
        </div>

        {/* ID Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-5">
            <h2 className="text-xl font-bold">🏫 School Management System</h2>
            <p className="text-sm opacity-90 mt-1">Teacher Identity Card</p>
          </div>

          {/* Photo Section */}
          <div className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              {teacher.photoUrl ? (
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="pt-12 pb-6 px-6">
            <div className="text-center mb-5">
              <h3 className="text-xl font-bold text-gray-800">{teacher.name}</h3>
              <p className="text-sm text-gray-500">{teacher.department || "Faculty Member"}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Hash size={14} />
                  <span>Teacher ID</span>
                </div>
                <span className="font-mono text-sm font-medium text-gray-800">{idCard.teacherCode}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Mail size={14} />
                  <span>Email</span>
                </div>
                <span className="text-sm text-gray-800">{teacher.email}</span>
              </div>
              {teacher.phone && (
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Phone size={14} />
                    <span>Phone</span>
                  </div>
                  <span className="text-sm text-gray-800">{teacher.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Building size={14} />
                  <span>Department</span>
                </div>
                <span className="text-sm font-medium text-gray-800">{teacher.department || "General"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Award size={14} />
                  <span>Qualification</span>
                </div>
                <span className="text-sm text-gray-800">{teacher.qualification || "N/A"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={14} />
                  <span>Joined</span>
                </div>
                <span className="text-sm text-gray-800">{formatDate(teacher.joiningDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={14} />
                  <span>Valid Till</span>
                </div>
                <span className={`text-sm font-medium ${isExpired ? "text-red-500" : "text-green-600"}`}>
                  {formatDate(idCard.expiryDate)}
                  {isExpired && " (Expired)"}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                isExpired 
                  ? "bg-red-100 text-red-700" 
                  : "bg-green-100 text-green-700"
              }`}>
                {isExpired ? (
                  <>
                    <AlertCircle size={12} />
                    Card Expired
                  </>
                ) : (
                  <>
                    <CheckCircle size={12} />
                    Active Card
                  </>
                )}
              </span>
            </div>

            {/* QR Code */}
            {idCard.qrCodeData && (
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <img src={idCard.qrCodeData} alt="QR Code" className="w-24 h-24 mx-auto" />
                <p className="text-xs text-gray-400 mt-2">Scan for Login & Attendance</p>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-6 py-3 text-center">
            <p className="text-[10px] text-gray-400">This card is property of School Management System</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white flex items-center justify-center gap-2 transition"
          >
            <Printer size={18} />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white flex items-center justify-center gap-2 transition"
          >
            <Download size={18} />
            Download
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 print:hidden">
          <div className="flex items-start gap-3">
            <QrCode size={18} className="text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-300">About This Card</p>
              <p className="text-xs text-blue-400 mt-1">
                Scan the QR code to login or mark attendance. You can print this card or save it as PDF.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}