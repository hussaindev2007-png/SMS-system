import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherIDCard from "@/models/TeacherIDCard";
import TeacherAttendance from "@/models/TeacherAttendance";
import { NextResponse } from "next/server";
import { addTeacherAttendanceNotificationToQueue } from "@/lib/queue";

// Helper function to check if teacher is late
const checkLateStatus = (checkInTime) => {
  const [time, period] = checkInTime.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (period === 'PM' && hours !== '12') {
    hours = parseInt(hours) + 12;
  }
  if (period === 'AM' && hours === '12') {
    hours = 0;
  }
  
  const checkInMinutes = parseInt(hours) * 60 + parseInt(minutes);
  const schoolStartMinutes = 8 * 60; // 8:00 AM
  const graceMinutes = 60; // Grace period till 9:00 AM
  
  if (checkInMinutes > schoolStartMinutes && checkInMinutes <= schoolStartMinutes + graceMinutes) {
    return 'on-time';
  } else if (checkInMinutes > schoolStartMinutes + graceMinutes) {
    return 'late';
  }
  return 'on-time';
};

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    console.log("🔍 Verifying teacher ID:", id);
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Teacher ID required" 
      }, { status: 400 });
    }

    // Check if it's a teacherCode or teacherId
    let teacher = null;
    let idCard = null;
    
    // First try to find by teacherCode
    idCard = await TeacherIDCard.findOne({ teacherCode: id });
    
    if (idCard) {
      teacher = await Teacher.findById(idCard.teacherId).select('-password');
    } else {
      // Try by MongoDB _id
      teacher = await Teacher.findById(id).select('-password');
      if (teacher) {
        idCard = await TeacherIDCard.findOne({ teacherId: teacher._id });
      }
    }
    
    if (!teacher) {
      console.log("❌ Teacher not found:", id);
      return NextResponse.json({ 
        success: false, 
        error: "Teacher not found" 
      }, { status: 404 });
    }
    
    if (teacher.status !== "approved" && teacher.status !== "active") {
      return NextResponse.json({ 
        success: false, 
        error: "Teacher account not approved yet" 
      }, { status: 403 });
    }
    
    if (!idCard) {
      console.log("❌ ID Card not found for teacher:", teacher.name);
      return NextResponse.json({ 
        success: false, 
        error: "ID Card not found. Please contact admin." 
      }, { status: 404 });
    }

    // Check today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingAttendance = await TeacherAttendance.findOne({
      teacherId: teacher._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    let attendanceRecord = null;
    let isAlreadyMarked = false;
    let checkInTimeValue = null;
    let attendanceStatus = 'present';
    
    // If no attendance today, mark it
    if (!existingAttendance) {
      try {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        
        // Check if teacher is late
        const lateCheck = checkLateStatus(currentTime);
        attendanceStatus = lateCheck === 'late' ? 'late' : 'present';
        
        attendanceRecord = await TeacherAttendance.create({
          teacherId: teacher._id,
          date: now,
          status: attendanceStatus,
          checkInTime: currentTime,
          source: "QR",
          verifiedBy: "QR Scan"
        });
        
        checkInTimeValue = currentTime;
        console.log(`✅ Attendance marked for teacher ${teacher.name}: ${attendanceStatus} at ${currentTime}`);
        
        // If late, add to notification queue (if implemented)
        if (attendanceStatus === 'late') {
          // Optional: Send notification to admin
          console.log(`📧 Teacher ${teacher.name} was late at ${currentTime}`);
        }
        
      } catch (attError) {
        console.error("❌ Attendance marking failed:", attError);
      }
    } else {
      isAlreadyMarked = true;
      checkInTimeValue = existingAttendance.checkInTime || "N/A";
      attendanceStatus = existingAttendance.status || "present";
      console.log(`⚠️ Attendance already marked for teacher ${teacher.name} (${attendanceStatus})`);
    }

    const isExpired = idCard.expiryDate ? new Date(idCard.expiryDate) < new Date() : false;

    return NextResponse.json({
      success: true,
      verified: true,
      verifiedAt: new Date().toISOString(),
      role: "teacher",
      attendance: {
        marked: !isAlreadyMarked,
        alreadyMarked: isAlreadyMarked,
        status: attendanceStatus,
        checkInTime: checkInTimeValue || "N/A",
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        isLate: attendanceStatus === 'late'
      },
      data: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        department: teacher.department,
        qualification: teacher.qualification,
        photoUrl: teacher.photoUrl,
        cardNumber: idCard.cardNumber,
        teacherCode: idCard.teacherCode,
        issueDate: idCard.issueDate,
        expiryDate: idCard.expiryDate,
        isExpired: isExpired
      }
    });
    
  } catch (error) {
    console.error("❌ Teacher Verification API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}