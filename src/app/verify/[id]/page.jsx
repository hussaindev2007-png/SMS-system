"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Hash,
  Calendar,
  IdCard,
  Shield,
  School,
  Clock,
  Mail,
  Phone,
  XCircle
} from "lucide-react";
import apiClient from "@/services/apiClient";

export default function VerifyStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id;
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationTime, setVerificationTime] = useState(null);
  const [attendance, setAttendance] = useState(null); // 👈 ADDED

  useEffect(() => {
    if (studentId) {
      verifyStudent();
      setVerificationTime(new Date().toLocaleString());
    }
  }, [studentId]);

  const verifyStudent = async () => {
    try {
      setLoading(true);
      console.log("📡 Calling API:", `/verify/${studentId}`);
      const response = await apiClient.get(`/verify/${studentId}`);
      
      if (response.data.success) {
        setStudent(response.data.data);
        // 👈 STORE ATTENDANCE DATA
        if (response.data.attendance) {
          setAttendance(response.data.attendance);
          console.log("✅ Attendance:", response.data.attendance);
        }
      } else {
        setError(response.data.error || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || "Student not found or invalid ID");
    } finally {
      setLoading(false);
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-300" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Verifying Student Identity...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we verify the credentials</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-400">Scanned ID: {studentId}</p>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            This ID card may be invalid, expired, or not registered in our system.
            Please contact the school administration for assistance.
          </p>
          <button
            onClick={() => window.close()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  // No Student Found
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Found</h2>
          <p className="text-gray-500">Unable to retrieve student information</p>
        </div>
      </div>
    );
  }

  const isExpired = student.isExpired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Animated Success Badge */}
        <div className="text-center mb-6 animate-in fade-in zoom-in duration-500">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-md ${
            isExpired ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {isExpired ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 font-semibold">⚠️ Card Expired</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-semibold">✓ Verified Student</span>
              </>
            )}
          </div>
        </div>

        {/* Main ID Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-6">
            <School className="w-12 h-12 mx-auto mb-2 opacity-90" />
            <h2 className="text-xl font-bold tracking-wide">SCHOOL MANAGEMENT SYSTEM</h2>
            <p className="text-sm opacity-90 mt-1">Official Student Verification Document</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
              <div className="relative">
                {student.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {student.name?.charAt(0).toUpperCase() || "S"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1">
                  {!isExpired && (
                    <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-500">Student ID: {student._id?.slice(-8)}</p>
                {student.fatherName && (
                  <p className="text-xs text-gray-400 mt-1">S/O: {student.fatherName}</p>
                )}
              </div>
            </div>

            {/* Student Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Hash size={16} />
                  <span className="text-sm">Roll Number</span>
                </div>
                <span className="font-medium text-gray-800">{student.rollNo}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <GraduationCap size={16} />
                  <span className="text-sm">Class & Section</span>
                </div>
                <span className="font-medium text-gray-800">
                  Class {student.className} - {student.section}
                </span>
              </div>
              
              {student.email && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail size={16} />
                    <span className="text-sm">Email</span>
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{student.email}</span>
                </div>
              )}
              
              {student.phone && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={16} />
                    <span className="text-sm">Phone</span>
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{student.phone}</span>
                </div>
              )}
            </div>

            {/* Card Details */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Card Number:</span>
                <span className="font-mono text-gray-700">{student.cardNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Issue Date:</span>
                <span className="text-gray-700">{formatDate(student.issueDate)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-500">Expiry Date:</span>
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                  {formatDate(student.expiryDate)}
                </span>
              </div>
            </div>

            {/* Verification Stamp */}
            <div className={`p-4 rounded-lg border-2 ${isExpired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isExpired ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-semibold">CARD EXPIRED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">VERIFICATION SUCCESSFUL</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>Verified on: {verificationTime}</span>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-[10px] text-gray-400">
                  This is an electronically generated verification document
                </p>
              </div>
            </div>

            {/* 👇 ATTENDANCE STATUS - NEW SECTION */}
            {attendance && (
              <div className={`mt-4 p-4 rounded-lg text-center ${
                attendance.marked 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-yellow-100 border border-yellow-300'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {attendance.marked ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-semibold text-sm">
                        ✓ Attendance Marked Successfully!
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-700 font-semibold text-sm">
                        ⚠️ Attendance Already Marked Today
                      </span>
                    </>
                  )}
                </div>
                {attendance.checkInTime && (
                  <p className="text-xs text-gray-500 mt-2">
                    Check-in Time: {attendance.checkInTime}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Date: {attendance.date} | Status: {attendance.status || 'present'}
                </p>
                {attendance.alreadyMarked && (
                  <p className="text-xs text-gray-400 mt-2">
                    Student has already been marked present today
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <IdCard size={10} />
                Digitally Verified • School Management System
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This verification is valid only for the current session.<br />
            For any discrepancies, please contact the school administration.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <button
            onClick={() => window.close()}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Close Window →
          </button>
        </div>
      </div>
    </div>
  );
}