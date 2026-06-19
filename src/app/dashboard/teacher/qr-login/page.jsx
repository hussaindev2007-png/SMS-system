"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { School, CheckCircle, Loader2, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import apiClient from "@/services/apiClient";

export default function TeacherQRLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherCode = searchParams.get("code");
  
  const [step, setStep] = useState("loading"); // loading, otp, success
  const [teacherId, setTeacherId] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  useEffect(() => {
    if (teacherCode) {
      getTeacherInfo();
    } else {
      setError("Invalid QR code");
      setStep("error");
    }
  }, [teacherCode]);

  const getTeacherInfo = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/auth/teacher-qr-login", {
        action: "qr-info",
        teacherCode
      });
      
      if (response.data.success) {
        setTeacherId(response.data.teacherId);
        setTeacherName(response.data.name);
        setTeacherEmail(response.data.email);
        setStep("otp");
      } else {
        setError(response.data.message);
        setStep("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Failed to verify QR code");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post("/api/auth/teacher-qr-login", {
        action: "send-otp",
        teacherId
      });
      
      if (response.data.success) {
        alert("OTP sent to your email!");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post("/api/auth/teacher-qr-login", {
        action: "verify-otp",
        teacherId,
        otp
      });
      
      if (response.data.success) {
        // Save to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("userName", response.data.user.name);
        
        // Mark attendance
        await markAttendance();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      const response = await apiClient.post("/api/teacher/attendance", {
        teacherId,
        source: "QR"
      });
      
      if (response.data.success) {
        setAttendanceStatus({
          marked: true,
          checkInTime: response.data.checkInTime,
          alreadyMarked: false
        });
        setStep("success");
      } else if (response.data.alreadyMarked) {
        setAttendanceStatus({
          marked: false,
          alreadyMarked: true,
          checkInTime: response.data.checkInTime
        });
        setStep("success");
      }
    } catch (error) {
      console.error("Attendance error:", error);
      setAttendanceStatus({
        marked: false,
        alreadyMarked: false,
        error: true
      });
      setStep("success");
    }
  };

  const goToDashboard = () => {
    router.push("/dashboard/teacher");
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Verifying QR code...</p>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Invalid QR Code</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 rounded-2xl p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Welcome, {teacherName}</h2>
            <p className="text-gray-400 text-sm">OTP sent to {teacherEmail}</p>
          </div>
          
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-2xl tracking-widest py-3 bg-gray-700 border border-gray-600 rounded-xl text-white mb-4 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          
          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
          
          <button
            onClick={verifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full py-3 bg-green-600 rounded-xl text-white font-medium mb-3 disabled:opacity-50 hover:bg-green-700 transition"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Login"}
          </button>
          
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full py-2 text-gray-400 text-sm hover:text-white transition"
          >
            Resend OTP
          </button>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {attendanceStatus?.alreadyMarked ? "Already Marked" : "Login Successful!"}
          </h2>
          {attendanceStatus?.checkInTime && (
            <p className="text-gray-400 mb-2">
              {attendanceStatus.alreadyMarked 
                ? `You were already marked at ${attendanceStatus.checkInTime}`
                : `Checked in at ${attendanceStatus.checkInTime}`}
            </p>
          )}
          <button
            onClick={goToDashboard}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}