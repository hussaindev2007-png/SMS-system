import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherAttendance from "@/models/TeacherAttendance";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const reportType = searchParams.get("type") || "attendance"; // attendance, performance, summary
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    // Get teacher info
    const teacher = await Teacher.findById(teacherId).populate("subjects");
    if (!teacher) {
      return NextResponse.json({ success: false, message: "Teacher not found" }, { status: 404 });
    }
    
    // Build date filter
    let dateFilter = {};
    if (fromDate && toDate) {
      dateFilter = {
        date: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        }
      };
    }
    
    // Get attendance records
    const attendanceRecords = await TeacherAttendance.find({
      teacherId,
      ...dateFilter
    }).sort({ date: -1 });
    
    // Calculate statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === "present").length;
    const lateDays = attendanceRecords.filter(r => r.status === "late").length;
    const absentDays = attendanceRecords.filter(r => r.status === "absent").length;
    
    const attendancePercentage = totalDays > 0 
      ? ((presentDays + lateDays) / totalDays * 100).toFixed(1)
      : 0;
    
    // Monthly breakdown
    const monthlyBreakdown = {};
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      if (!monthlyBreakdown[monthYear]) {
        monthlyBreakdown[monthYear] = { present: 0, late: 0, absent: 0, total: 0 };
      }
      monthlyBreakdown[monthYear][record.status]++;
      monthlyBreakdown[monthYear].total++;
    });
    
    // Weekly breakdown
    const weeklyBreakdown = {};
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const weekNumber = getWeekNumber(date);
      const weekKey = `Week ${weekNumber}, ${date.getFullYear()}`;
      if (!weeklyBreakdown[weekKey]) {
        weeklyBreakdown[weekKey] = { present: 0, late: 0, absent: 0, total: 0, week: weekNumber };
      }
      weeklyBreakdown[weekKey][record.status]++;
      weeklyBreakdown[weekKey].total++;
    });
    
    // Generate summary report
    const summaryReport = {
      teacherName: teacher.name,
      teacherEmail: teacher.email,
      department: teacher.department,
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendancePercentage: parseFloat(attendancePercentage),
      reportGenerated: new Date().toISOString(),
      period: fromDate && toDate ? `${fromDate} to ${toDate}` : "All time"
    };
    
    // Generate attendance report
    const attendanceReport = {
      summary: summaryReport,
      monthlyBreakdown: Object.entries(monthlyBreakdown).map(([month, data]) => ({
        month,
        present: data.present,
        late: data.late,
        absent: data.absent,
        total: data.total,
        percentage: data.total > 0 ? ((data.present + data.late) / data.total * 100).toFixed(1) : 0
      })),
      weeklyBreakdown: Object.entries(weeklyBreakdown).map(([week, data]) => ({
        week,
        present: data.present,
        late: data.late,
        absent: data.absent,
        total: data.total,
        percentage: data.total > 0 ? ((data.present + data.late) / data.total * 100).toFixed(1) : 0
      })),
      recentRecords: attendanceRecords.slice(0, 30)
    };
    
    // Subject-wise report (if subjects exist)
    const subjectReport = {
      totalSubjects: teacher.subjects?.length || 0,
      subjects: teacher.subjects?.map(s => ({ name: s.name, code: s.code || "N/A" })) || []
    };
    
    return NextResponse.json({
      success: true,
      data: {
        attendanceReport,
        subjectReport,
        teacherInfo: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
          qualification: teacher.qualification,
          joiningDate: teacher.joiningDate
        }
      }
    });
    
  } catch (error) {
    console.error("Teacher Reports error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}