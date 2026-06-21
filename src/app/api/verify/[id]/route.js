import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import StudentIDCard from "@/models/StudentIDCard";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { sendAttendanceEmail } from "@/lib/email";

// ✅ PAKISTAN TIME HELPERS
const getPakistanDateTime = () => {
  // Pakistan is UTC+5
  const now = new Date();
  const pakistanTime = new Date(now.getTime() + (5 * 60 * 60 * 1000)); // +5 hours
  return pakistanTime;
};

const getPakistanTimeString = () => {
  const now = new Date();
  // Format directly to Pakistan time
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Karachi'
  });
};

const getPakistanDateString = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Karachi'
  });
};

// Get Pakistan hours for attendance check
const getPakistanHours = () => {
  const now = new Date();
  const pakistanTimeString = now.toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const [hours, minutes] = pakistanTimeString.split(':').map(Number);
  return { hours, minutes, totalMinutes: hours * 60 + minutes };
};

// ✅ UPDATED: Attendance check with proper Pakistan time
const checkAttendanceStatus = () => {
  const { totalMinutes } = getPakistanHours();
  
  console.log(`🕐 Pakistan Time Check: ${Math.floor(totalMinutes / 60)}:${totalMinutes % 60} (Total minutes: ${totalMinutes})`);
  
  const schoolStartMinutes = 8 * 60;      // 8:00 AM
  const absentThreshold = 10 * 60;        // 10:00 AM
  
  if (totalMinutes >= absentThreshold) {
    return 'absent';
  } else if (totalMinutes > schoolStartMinutes) {
    return 'late';
  }
  return 'present';
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

    // ✅ Get Pakistan time
    const pakistanTime = getPakistanTimeString();
    const pakistanDate = getPakistanDateString();
    const pakistanDateTime = getPakistanDateTime();
    
    // Today's date in Pakistan timezone
    const todayStart = new Date(pakistanDateTime);
    todayStart.setHours(0, 0, 0, 0);
    
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    
    console.log(`🕐 Pakistan Time: ${pakistanTime} | ${pakistanDate}`);
    console.log(`📅 Query Range: ${todayStart.toISOString()} to ${tomorrowStart.toISOString()}`);
    
    // Check today's attendance
    const existingAttendance = await Attendance.findOne({
      studentId: id,
      date: {
        $gte: todayStart,
        $lt: tomorrowStart
      }
    }).lean();
    
    let isAlreadyMarked = false;
    let attendanceStatus = 'present';
    
    // If no attendance today, mark it
    if (!existingAttendance) {
      try {
        attendanceStatus = checkAttendanceStatus();
        
        const newAttendance = await Attendance.create({
          studentId: student._id,
          studentName: student.name,
          rollNo: student.rollNo,
          date: pakistanDateTime,
          status: attendanceStatus,
          checkInTime: pakistanTime,
          markedBy: student._id,
          className: student.className,
          section: student.section,
          verifiedBy: 'QR Scan'
        });
        
        console.log(`✅ Attendance marked: ${student.name} - ${attendanceStatus} at ${pakistanTime}`);
        
        // Send email
        if (student.email) {
          sendAttendanceEmail(
            student.email,
            student.name,
            attendanceStatus,
            attendanceStatus === 'absent' ? null : pakistanTime,
            pakistanDate
          ).then(result => {
            if (result.success) {
              console.log(`📧 Email sent to ${student.email}`);
            }
          }).catch(err => {
            console.error("Email error:", err);
          });
        }
        
      } catch (attError) {
        console.error("❌ Attendance marking failed:", attError);
        return NextResponse.json({ 
          success: false, 
          error: "Failed to mark attendance" 
        }, { status: 500 });
      }
    } else {
      isAlreadyMarked = true;
      attendanceStatus = existingAttendance.status || "present";
      console.log(`⚠️ Already marked: ${student.name} (${attendanceStatus})`);
    }

    const isExpired = new Date(card.expiryDate) < new Date();
    
    const responseCheckInTime = isAlreadyMarked 
      ? existingAttendance.checkInTime 
      : pakistanTime;

    return NextResponse.json({
      success: true,
      verified: true,
      verifiedAt: new Date().toISOString(),
      timezone: 'Asia/Karachi (PKT)',
      serverTime: new Date().toISOString(),
      pakistanTime: pakistanTime,
      attendance: {
        marked: !isAlreadyMarked,
        alreadyMarked: isAlreadyMarked,
        status: attendanceStatus,
        checkInTime: responseCheckInTime,
        date: pakistanDate,
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
