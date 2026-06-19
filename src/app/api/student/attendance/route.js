import dbConnect from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    
    if (!studentId) {
      return NextResponse.json({ 
        success: false, 
        message: "Student ID required" 
      }, { status: 400 });
    }
    
    let query = { studentId: new mongoose.Types.ObjectId(studentId) };
    
    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
    
    // Calculate statistics
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === "present").length;
    const absentDays = attendanceRecords.filter(r => r.status === "absent").length;
    const lateDays = attendanceRecords.filter(r => r.status === "late").length;
    const leaveDays = attendanceRecords.filter(r => r.status === "leave").length;
    
    const attendancePercentage = totalDays > 0 
      ? ((presentDays + lateDays) / totalDays * 100).toFixed(1)
      : 0;
    
    // Group by month for chart
    const monthlyData = {};
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
      }
      monthlyData[monthYear][record.status]++;
      monthlyData[monthYear].total++;
    });
    
    const chartData = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      present: data.present,
      absent: data.absent,
      late: data.late,
      leave: data.leave
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        records: attendanceRecords,
        stats: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          leaveDays,
          attendancePercentage: parseFloat(attendancePercentage)
        },
        chartData: chartData.slice(-6) // Last 6 months
      }
    });
    
  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}