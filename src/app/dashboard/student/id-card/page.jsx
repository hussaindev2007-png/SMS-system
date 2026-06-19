"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  IdCard,
  Loader2,
  RefreshCw,
  Download,
  Printer,
  AlertCircle,
  CheckCircle,
  Calendar,
  Hash,
  User,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  QrCode
} from "lucide-react";
import { useStudentIDCard, useDownloadIDCard } from "@/hooks/useStudentQueries";
import toast from "react-hot-toast";

export default function StudentIDCardPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (!token || userRole !== "student") {
      router.push("/login");
      return;
    }
    
    setStudentId(userId);
  }, [router]);

  // Fetch ID Card
  const { 
    data: idCardData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
    isFetching 
  } = useStudentIDCard(studentId);

  const downloadMutation = useDownloadIDCard();

  const idCard = idCardData?.data;
  const student = idCard?.student;

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if card is expired
  const isExpired = idCard?.expiryDate && new Date(idCard.expiryDate) < new Date();

  // Handle download
  const handleDownload = () => {
    if (!studentId) return;
    
    downloadMutation.mutate(studentId, {
      onSuccess: (blob) => {
        // Download handled in mutation
      },
      onError: (err) => {
        toast.error("Failed to download ID card");
      }
    });
  };

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student ID Card - ${student?.name || "Student"}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
          }
          .id-card {
            width: 400px;
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
          .card-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            text-align: center;
            padding: 20px;
          }
          .card-header h2 {
            font-size: 20px;
            margin-bottom: 5px;
          }
          .card-header p {
            font-size: 12px;
            opacity: 0.8;
          }
          .photo-section {
            text-align: center;
            margin-top: -40px;
            position: relative;
            z-index: 2;
          }
          .student-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 4px solid white;
            background: white;
            object-fit: cover;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
          .default-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            border: 4px solid white;
          }
          .default-photo span {
            font-size: 40px;
          }
          .card-body {
            padding: 20px;
          }
          .info-row {
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px dashed #e0e0e0;
            padding-bottom: 8px;
          }
          .info-label {
            font-weight: 600;
            color: #555;
            font-size: 12px;
          }
          .info-value {
            color: #333;
            font-size: 12px;
            font-weight: 500;
          }
          .qr-section {
            text-align: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
          }
          .qr-code {
            width: 80px;
            height: 80px;
            margin: 0 auto;
          }
          .card-footer {
            background: #f5f5f5;
            padding: 12px;
            text-align: center;
            font-size: 10px;
            color: #777;
          }
          @media print {
            body {
              background: white;
              padding: 0;
              margin: 0;
            }
            .id-card {
              box-shadow: none;
              margin: 0 auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          <div class="card-header">
            <h2>🏫 School Management System</h2>
            <p>Student Identity Card</p>
          </div>
          <div class="photo-section">
            ${student?.photoUrl ? 
              `<img src="${student.photoUrl}" class="student-photo" alt="Photo">` :
              `<div class="default-photo"><span>📷</span></div>`
            }
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Student Name:</span>
              <span class="info-value">${student?.name || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Father Name:</span>
              <span class="info-value">${student?.fatherName || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Roll Number:</span>
              <span class="info-value">${student?.rollNo || idCard?.rollNumber || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Class:</span>
              <span class="info-value">${student?.className || "N/A"} - ${student?.section || ""}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Card Number:</span>
              <span class="info-value">${idCard?.cardNumber || "N/A"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Valid Till:</span>
              <span class="info-value">${formatDate(idCard?.expiryDate)}</span>
            </div>
            ${idCard?.qrCodeData ? `
            <div class="qr-section">
              <img src="${idCard.qrCodeData}" class="qr-code" alt="QR Code">
              <p style="font-size: 10px; margin-top: 5px;">Scan to Verify</p>
            </div>
            ` : ""}
          </div>
          <div class="card-footer">
            This card is the property of School Management System
          </div>
        </div>
        <script>
          window.print();
          setTimeout(() => window.close(), 1000);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading ID Card...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error loading ID Card</p>
          <p className="text-gray-500 text-sm">{error?.response?.data?.error || "Please contact admin"}</p>
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

  if (!idCard || !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <IdCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No ID Card Found</p>
          <p className="text-gray-400 text-sm">Please contact admin to generate your ID card</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <IdCard className="text-blue-600" size={28} />
            My ID Card
          </h1>
          <p className="text-gray-500 mt-1">Your official student identity card</p>
        </div>

        {/* ID Card Container */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* ID Card */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-4">
                <h2 className="text-xl font-bold">School Management System</h2>
                <p className="text-sm opacity-90">Student Identity Card</p>
              </div>

              {/* Photo Section */}
              <div className="relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <User size={40} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-16 pb-6 px-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-500">Student</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Hash size={14} />
                      <span>Roll Number</span>
                    </div>
                    <span className="font-medium text-gray-800">{student.rollNo || idCard.rollNumber}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <GraduationCap size={14} />
                      <span>Class</span>
                    </div>
                    <span className="font-medium text-gray-800">{student.className} - {student.section}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <User size={14} />
                      <span>Father Name</span>
                    </div>
                    <span className="font-medium text-gray-800">{student.fatherName || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CreditCard size={14} />
                      <span>Card Number</span>
                    </div>
                    <span className="font-medium text-gray-800 font-mono text-xs">{idCard.cardNumber}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={14} />
                      <span>Valid Till</span>
                    </div>
                    <span className={`font-medium ${isExpired ? "text-red-500" : "text-green-600"}`}>
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
                  <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                    <img src={idCard.qrCodeData} alt="QR Code" className="w-20 h-20 mx-auto" />
                    <p className="text-xs text-gray-400 mt-1">Scan to Verify</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-6 py-3 text-center">
                <p className="text-xs text-gray-400">This card is the property of School Management System</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer size={18} />
                  Print ID Card
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Download as PDF
                </button>
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                  Refresh Card
                </button>
              </div>

              {/* Info Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <QrCode size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">About This Card</p>
                    <p className="text-xs text-blue-600 mt-1">
                      This digital ID card is your official identification. You can print it or save it as PDF.
                      The QR code can be scanned to verify your identity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}