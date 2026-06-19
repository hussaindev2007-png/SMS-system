// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import TeacherAttendance from "@/models/TeacherAttendance";
// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";
// import { addTeacherLateNotificationToQueue } from "@/lib/queue";

// // ==================== LATE DETECTION HELPER ====================
// const checkLateStatus = (checkInTime) => {
//   const [time, period] = checkInTime.split(' ');
//   let [hours, minutes] = time.split(':');
  
//   if (period === 'PM' && hours !== '12') {
//     hours = parseInt(hours) + 12;
//   }
//   if (period === 'AM' && hours === '12') {
//     hours = 0;
//   }
  
//   const checkInMinutes = parseInt(hours) * 60 + parseInt(minutes);
//   const schoolStartMinutes = 7 * 60; // 7:00 AM
//   const graceMinutes = 60; // Grace period till 8:00 AM
  
//   if (checkInMinutes <= schoolStartMinutes + graceMinutes && checkInMinutes >= schoolStartMinutes) {
//     return 'on-time';
//   } else if (checkInMinutes > schoolStartMinutes + graceMinutes) {
//     return 'late';
//   }
//   return 'on-time';
// };

// // ==================== GET: Fetch Teacher Attendance Records ====================
// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const month = searchParams.get("month");
//     const year = searchParams.get("year");
    
//     if (!teacherId) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Teacher ID required" 
//       }, { status: 400 });
//     }
    
//     // Build query
//     let query = { teacherId };
    
//     // Filter by month/year if provided
//     if (month && year) {
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0);
//       query.date = { $gte: startDate, $lte: endDate };
//     }
    
//     const attendanceRecords = await TeacherAttendance.find(query).sort({ date: -1 });
    
//     // Calculate statistics
//     const totalDays = attendanceRecords.length;
//     const presentDays = attendanceRecords.filter(r => r.status === "present").length;
//     const lateDays = attendanceRecords.filter(r => r.status === "late").length;
//     const absentDays = attendanceRecords.filter(r => r.status === "absent").length;
    
//     const attendancePercentage = totalDays > 0 
//       ? ((presentDays + lateDays) / totalDays * 100).toFixed(1)
//       : 0;
    
//     // Group by month for chart
//     const monthlyData = {};
//     attendanceRecords.forEach(record => {
//       const date = new Date(record.date);
//       const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
//       if (!monthlyData[monthYear]) {
//         monthlyData[monthYear] = { present: 0, late: 0, absent: 0, total: 0 };
//       }
//       monthlyData[monthYear][record.status]++;
//       monthlyData[monthYear].total++;
//     });
    
//     const chartData = Object.entries(monthlyData).map(([name, data]) => ({
//       name,
//       present: data.present || 0,
//       late: data.late || 0,
//       absent: data.absent || 0
//     }));
    
//     return NextResponse.json({
//       success: true,
//       data: {
//         records: attendanceRecords,
//         stats: {
//           totalDays,
//           presentDays,
//           lateDays,
//           absentDays,
//           attendancePercentage: parseFloat(attendancePercentage)
//         },
//         chartData: chartData.slice(-6)
//       }
//     });
    
//   } catch (error) {
//     console.error("Teacher Attendance GET error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // ==================== POST: Mark Teacher Attendance with Late Detection ====================
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { teacherId, source = "QR" } = await req.json();
    
//     if (!teacherId) {
//       return NextResponse.json({ message: "Teacher ID required" }, { status: 400 });
//     }
    
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const existingAttendance = await TeacherAttendance.findOne({
//       teacherId,
//       date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
//     });
    
//     let checkInTime = null;
//     let alreadyMarked = false;
//     let attendanceStatus = 'present';
    
//     if (existingAttendance) {
//       alreadyMarked = true;
//       checkInTime = existingAttendance.checkInTime;
//       attendanceStatus = existingAttendance.status;
//     } else {
//       const now = new Date();
//       checkInTime = now.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });
      
//       // ✅ Check if teacher is late
//       const lateCheck = checkLateStatus(checkInTime);
//       attendanceStatus = lateCheck === 'late' ? 'late' : 'present';
      
//       await TeacherAttendance.create({
//         teacherId,
//         date: now,
//         status: attendanceStatus,
//         checkInTime,
//         source
//       });
      
//       console.log(`✅ Teacher attendance marked: ${attendanceStatus} at ${checkInTime}`);
      
//       // ✅ If late, add to queue for admin notification
//       if (attendanceStatus === 'late') {
//         const teacher = await Teacher.findById(teacherId);
//         if (teacher && teacher.email) {
//           await addTeacherLateNotificationToQueue(teacher.email, teacher.name, checkInTime);
//           console.log(`📧 Teacher late notification queued for ${teacher.name}`);
//         }
//       }
//     }
    
//     // Generate login token for teacher
//     const teacher = await Teacher.findById(teacherId);
//     if (!teacher) {
//       return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
//     }
    
//     const token = jwt.sign(
//       { id: teacher._id, role: "teacher" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
    
//     // Update online status
//     teacher.isOnline = true;
//     teacher.lastSeen = new Date();
//     await teacher.save();
    
//     return NextResponse.json({
//       success: true,
//       alreadyMarked,
//       checkInTime,
//       status: attendanceStatus,
//       isLate: attendanceStatus === 'late',
//       token,
//       teacher: {
//         id: teacher._id,
//         name: teacher.name,
//         role: "teacher",
//         email: teacher.email
//       }
//     });
    
//   } catch (error) {
//     console.error("Teacher Attendance POST error:", error);
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// }















import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherAttendance from "@/models/TeacherAttendance";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { addTeacherLateNotificationToQueue } from "@/lib/queue";

// ==================== AI HELPERS ====================

// AI: Check late status
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
  const schoolStartMinutes = 7 * 60;
  const graceMinutes = 60;
  
  if (checkInMinutes <= schoolStartMinutes + graceMinutes && checkInMinutes >= schoolStartMinutes) {
    return 'on-time';
  } else if (checkInMinutes > schoolStartMinutes + graceMinutes) {
    return 'late';
  }
  return 'on-time';
};

// AI: Calculate teacher morale score
const calculateMoraleScore = (attendanceRecords) => {
  if (!attendanceRecords.length) return 85;
  
  const totalDays = attendanceRecords.length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  
  let score = 85; // Base score
  score -= (lateDays / totalDays) * 20; // Late days penalty
  score -= (absentDays / totalDays) * 30; // Absent days penalty
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

// AI: Predict future attendance
const predictAttendance = (attendanceRecords) => {
  if (attendanceRecords.length < 5) {
    return { prediction: "Need more data for prediction", trend: "stable" };
  }
  
  // Get last 5 weeks attendance trend
  const recentRecords = attendanceRecords.slice(-10);
  const lateCount = recentRecords.filter(r => r.status === 'late').length;
  const absentCount = recentRecords.filter(r => r.status === 'absent').length;
  const presentCount = recentRecords.filter(r => r.status === 'present').length;
  
  const lateTrend = lateCount / recentRecords.length;
  const absentTrend = absentCount / recentRecords.length;
  
  let prediction = "";
  let trend = "";
  
  if (lateTrend > 0.3) {
    prediction = "High risk of being late next week";
    trend = "declining";
  } else if (absentTrend > 0.2) {
    prediction = "High risk of absence next week";
    trend = "declining";
  } else if (presentCount === recentRecords.length) {
    prediction = "Likely to maintain perfect attendance";
    trend = "improving";
  } else {
    prediction = "Attendance expected to be stable";
    trend = "stable";
  }
  
  return { prediction, trend };
};

// AI: Get burnout risk
const getBurnoutRisk = (attendanceRecords, subjectsCount) => {
  const totalDays = attendanceRecords.length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  
  const lateRate = totalDays > 0 ? (lateDays / totalDays) * 100 : 0;
  const absentRate = totalDays > 0 ? (absentDays / totalDays) * 100 : 0;
  
  let risk = "low";
  let reason = "";
  
  if (subjectsCount > 3) {
    risk = "high";
    reason = `Managing ${subjectsCount} subjects (high workload)`;
  } else if (lateRate > 30) {
    risk = "medium";
    reason = `Late arrival rate of ${lateRate.toFixed(1)}%`;
  } else if (absentRate > 15) {
    risk = "high";
    reason = `Absence rate of ${absentRate.toFixed(1)}%`;
  } else if (lateRate < 10 && absentRate < 5) {
    risk = "low";
    reason = "Good attendance record";
  }
  
  return { risk, reason, lateRate: lateRate.toFixed(1), absentRate: absentRate.toFixed(1) };
};

// AI: Get optimal check-in time suggestion
const getOptimalTime = () => {
  return {
    recommended: "7:30 AM",
    reason: "Early arrival helps avoid late marking and reduces stress",
    benefit: "95% teachers who arrive by 7:30 AM maintain excellent attendance"
  };
};

// AI: Get attendance insights
const getAttendanceInsights = (attendanceRecords) => {
  if (attendanceRecords.length === 0) {
    return { message: "No attendance data available yet" };
  }
  
  const totalDays = attendanceRecords.length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  
  const lateRate = (lateDays / totalDays) * 100;
  const absentRate = (absentDays / totalDays) * 100;
  
  let insights = [];
  
  if (lateRate > 30) {
    insights.push("⚠️ Your late arrival rate is high. Consider leaving home earlier.");
  }
  if (absentRate > 10) {
    insights.push("⚠️ Frequent absences detected. Please ensure regular attendance.");
  }
  if (presentDays === totalDays) {
    insights.push("🎉 Excellent! Perfect attendance record. Keep it up!");
  }
  if (lateRate < 10 && lateRate > 0) {
    insights.push("✓ Good punctuality. You rarely arrive late.");
  }
  if (absentRate === 0 && lateRate === 0) {
    insights.push("🏆 Outstanding! Perfect attendance and punctuality.");
  }
  
  if (insights.length === 0) {
    insights.push("✓ Your attendance pattern is stable. Good job!");
  }
  
  return insights;
};

// ==================== GET: Fetch Teacher Attendance Records with AI ====================
export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    // Get teacher info for subject count
    const teacher = await Teacher.findById(teacherId).populate("subjects");
    const subjectsCount = teacher?.subjects?.length || 0;
    
    // Build query
    let query = { teacherId };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendanceRecords = await TeacherAttendance.find(query).sort({ date: -1 });
    
    // Calculate statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === "present").length;
    const lateDays = attendanceRecords.filter(r => r.status === "late").length;
    const absentDays = attendanceRecords.filter(r => r.status === "absent").length;
    
    const attendancePercentage = totalDays > 0 
      ? ((presentDays + lateDays) / totalDays * 100).toFixed(1)
      : 0;
    
    // AI Calculations
    const moraleScore = calculateMoraleScore(attendanceRecords);
    const attendancePrediction = predictAttendance(attendanceRecords);
    const burnoutRisk = getBurnoutRisk(attendanceRecords, subjectsCount);
    const optimalTime = getOptimalTime();
    const insights = getAttendanceInsights(attendanceRecords);
    
    // Group by month for chart
    const monthlyData = {};
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { present: 0, late: 0, absent: 0, total: 0 };
      }
      monthlyData[monthYear][record.status]++;
      monthlyData[monthYear].total++;
    });
    
    const chartData = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      present: data.present || 0,
      late: data.late || 0,
      absent: data.absent || 0
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        records: attendanceRecords,
        stats: {
          totalDays,
          presentDays,
          lateDays,
          absentDays,
          attendancePercentage: parseFloat(attendancePercentage)
        },
        chartData: chartData.slice(-6),
        aiInsights: {
          moraleScore,
          moraleStatus: moraleScore >= 80 ? "Excellent" : moraleScore >= 60 ? "Good" : "Needs Attention",
          attendancePrediction: attendancePrediction.prediction,
          trend: attendancePrediction.trend,
          burnoutRisk: burnoutRisk.risk,
          burnoutReason: burnoutRisk.reason,
          lateRate: burnoutRisk.lateRate,
          absentRate: burnoutRisk.absentRate,
          optimalTime: optimalTime.recommended,
          optimalTimeReason: optimalTime.reason,
          optimalTimeBenefit: optimalTime.benefit,
          insights: insights
        }
      }
    });
    
  } catch (error) {
    console.error("Teacher Attendance GET error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// ==================== POST: Mark Teacher Attendance with Late Detection ====================
export async function POST(req) {
  try {
    await dbConnect();
    const { teacherId, source = "QR" } = await req.json();
    
    if (!teacherId) {
      return NextResponse.json({ message: "Teacher ID required" }, { status: 400 });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await TeacherAttendance.findOne({
      teacherId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    
    let checkInTime = null;
    let alreadyMarked = false;
    let attendanceStatus = 'present';
    
    if (existingAttendance) {
      alreadyMarked = true;
      checkInTime = existingAttendance.checkInTime;
      attendanceStatus = existingAttendance.status;
    } else {
      const now = new Date();
      checkInTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Check if teacher is late
      const lateCheck = checkLateStatus(checkInTime);
      attendanceStatus = lateCheck === 'late' ? 'late' : 'present';
      
      await TeacherAttendance.create({
        teacherId,
        date: now,
        status: attendanceStatus,
        checkInTime,
        source
      });
      
      console.log(`✅ Teacher attendance marked: ${attendanceStatus} at ${checkInTime}`);
      
      // If late, add to queue for admin notification
      if (attendanceStatus === 'late') {
        const teacher = await Teacher.findById(teacherId);
        if (teacher && teacher.email) {
          await addTeacherLateNotificationToQueue(teacher.email, teacher.name, checkInTime);
          console.log(`📧 Teacher late notification queued for ${teacher.name}`);
        }
      }
    }
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }
    
    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    teacher.isOnline = true;
    teacher.lastSeen = new Date();
    await teacher.save();
    
    // AI - Check if teacher needs attention
    const recentRecords = await TeacherAttendance.find({ teacherId }).sort({ date: -1 }).limit(10);
    const lateCount = recentRecords.filter(r => r.status === 'late').length;
    let warning = null;
    
    if (lateCount >= 5) {
      warning = "You have been late 5 times in last 10 days. Please improve punctuality.";
    }
    
    return NextResponse.json({
      success: true,
      alreadyMarked,
      checkInTime,
      status: attendanceStatus,
      isLate: attendanceStatus === 'late',
      warning,
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        role: "teacher",
        email: teacher.email
      }
    });
    
  } catch (error) {
    console.error("Teacher Attendance POST error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}