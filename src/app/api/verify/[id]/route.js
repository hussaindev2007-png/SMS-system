import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import StudentIDCard from "@/models/StudentIDCard";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendAttendanceEmail } from "@/lib/email";

// ✅ PAKISTAN TIME HELPER FUNCTION
const getPakistanTime = () => {
  const now = new Date();
  // Pakistan UTC+5
  const pakistanOffset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
  const pakistanTime = new Date(now.getTime() + pakistanOffset);
  return pakistanTime;
};

// ✅ PAKISTAN TIME FORMATTER
const formatPakistanTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi'  // Pakistan timezone
  });
};

// ✅ PAKISTAN DATE FORMATTER
const formatPakistanDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Karachi'  // Pakistan timezone
  });
};

// ✅ UPDATED: Late/Absent check with Pakistan time
const checkAttendanceStatus = () => {
  const now = getPakistanTime(); // Pakistan time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const schoolStartMinutes = 8 * 60;      // 8:00 AM
  const absentThreshold = 10 * 60;        // 10:00 AM - Iske baad ABSENT
  
  if (totalMinutes >= absentThreshold) {
    return 'absent';  // 10:00 AM ke baad → ABSENT
  } else if (totalMinutes > schoolStartMinutes) {
    return 'late';    // 8:01 AM - 9:59 AM → LATE
  }
  return 'present';   // 8:00 AM ya pehle → PRESENT
};

export async function GET(request, { params }) {
  try {
    if (!params) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request parameters" 
      }, { status: 400 });
    }
    
    const { id } = await params;
    
    console.log("🔍 Verifying student ID:", id);
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Student ID required" 
      }, { status: 400 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid student ID format" 
      }, { status: 400 });
    }
    
    await dbConnect();
    console.log("✅ Database connected");

    const student = await User.findById(id).select('-password').lean();
    
    if (!student) {
      console.log("❌ Student not found:", id);
      return NextResponse.json({ 
        success: false, 
        error: "Student not found" 
      }, { status: 404 });
    }
    
    console.log("✅ Student found:", student.name);

    const card = await StudentIDCard.findOne({ studentId: id }).lean();
    
    if (!card) {
      console.log("❌ ID Card not found for student:", id);
      return NextResponse.json({ 
        success: false, 
        error: "ID Card not found. Please contact administration." 
      }, { status: 404 });
    }
    
    console.log("✅ ID Card found:", card.cardNumber);

    // ✅ PAKISTAN TIME use karo
    const pakistanNow = getPakistanTime();
    const pakistanTimeFormatted = formatPakistanTime(pakistanNow);
    const pakistanDateFormatted = formatPakistanDate(pakistanNow);
    
    // Today's date in Pakistan timezone (start of day)
    const todayStart = new Date(pakistanNow);
    todayStart.setHours(0, 0, 0, 0);
    
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    
    console.log(`🕐 Pakistan Time: ${pakistanTimeFormatted} | ${pakistanDateFormatted}`);
    
    // Check today's attendance
    const existingAttendance = await Attendance.findOne({
      studentId: id,
      date: {
        $gte: todayStart,
        $lt: tomorrowStart
      }
    }).lean();
    
    let attendanceRecord = null;
    let isAlreadyMarked = false;
    let attendanceStatus = 'present';
    
    // If no attendance today, mark it
    if (!existingAttendance) {
      try {
        // ✅ Check attendance status with Pakistan time
        attendanceStatus = checkAttendanceStatus();
        
        attendanceRecord = await Attendance.create({
          studentId: student._id,
          studentName: student.name,
          rollNo: student.rollNo,
          date: pakistanNow,
          status: attendanceStatus,
          checkInTime: pakistanTimeFormatted,  // Pakistan time
          markedBy: student._id,
          className: student.className,
          section: student.section,
          verifiedBy: 'QR Scan'
        });
        
        console.log(`✅ Attendance marked for ${student.name}: ${attendanceStatus} at ${pakistanTimeFormatted}`);
        
        // ✅ Send email with Pakistan time
        if (student.email) {
          sendAttendanceEmail(
            student.email,
            student.name,
            attendanceStatus,
            attendanceStatus === 'absent' ? null : pakistanTimeFormatted,
            pakistanDateFormatted
          ).then(result => {
            if (result.success) {
              console.log(`📧 ${attendanceStatus.toUpperCase()} email sent to ${student.email}`);
            } else {
              console.error(`❌ Email failed:`, result.error);
            }
          }).catch(err => {
            console.error("Email send error:", err);
          });
        }
        
      } catch (attError) {
        console.error("❌ Attendance marking failed:", attError);
        return NextResponse.json({ 
          success: false, 
          error: "Failed to mark attendance. Please try again." 
        }, { status: 500 });
      }
    } else {
      isAlreadyMarked = true;
      attendanceStatus = existingAttendance.status || "present";
      console.log(`⚠️ Attendance already marked for ${student.name} (${attendanceStatus})`);
    }

    const isExpired = new Date(card.expiryDate) < new Date();
    
    const responseCheckInTime = isAlreadyMarked 
      ? existingAttendance.checkInTime 
      : pakistanTimeFormatted;

    return NextResponse.json({
      success: true,
      verified: true,
      verifiedAt: pakistanNow.toISOString(),
      timezone: 'Asia/Karachi (UTC+5)',
      attendance: {
        marked: !isAlreadyMarked,
        alreadyMarked: isAlreadyMarked,
        status: attendanceStatus,
        checkInTime: responseCheckInTime,
        date: pakistanDateFormatted,
        isLate: attendanceStatus === 'late',
        isAbsent: attendanceStatus === 'absent'
      },
      data: {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        className: student.className,
        section: student.section,
        fatherName: student.fatherName || "N/A",
        email: student.email || "N/A",
        phone: student.phone || "N/A",
        photoUrl: student.photoUrl || null,
        cardNumber: card.cardNumber,
        issueDate: card.issueDate,
        expiryDate: card.expiryDate,
        isExpired: isExpired
      }
    });
    
  } catch (error) {
    console.error("❌ Verification API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
