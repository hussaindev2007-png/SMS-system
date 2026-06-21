

import dbConnect from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GROQ API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const month = parseInt(searchParams.get("month"));
    const year = parseInt(searchParams.get("year"));
    const getAIInsights = searchParams.get("ai") === "true";
    
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ 
        success: false, 
        message: "Valid Student ID required" 
      }, { status: 400 });
    }
    
    // Base query
    let query = { studentId: new mongoose.Types.ObjectId(studentId) };
    
    // Precise date filtering
    if (month && year) {
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendanceRecords = await Attendance.find(query)
      .populate('studentId', 'name email')
      .sort({ date: -1 });
    
    // ── Statistics ───
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === "present").length;
    const absentDays = attendanceRecords.filter(r => r.status === "absent").length;
    const lateDays = attendanceRecords.filter(r => r.status === "late").length;
    const leaveDays = attendanceRecords.filter(r => r.status === "leave").length;
    
    const attendancePercentage = totalDays > 0 
      ? parseFloat((((presentDays + lateDays) / totalDays) * 100).toFixed(1))
      : 0;

    // ─── Weekly Performance - COUNT ALL STATUSES ───
    const weeklyStats = [0, 0, 0, 0, 0, 0, 0];
    const weeklyPresent = [0, 0, 0, 0, 0, 0, 0];
    const weeklyLate = [0, 0, 0, 0, 0, 0, 0];
    const weeklyAbsent = [0, 0, 0, 0, 0, 0, 0];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push(d);
    }
    
    attendanceRecords.forEach(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      
      const dayIndex = last7Days.findIndex(day => 
        day.getTime() === recordDate.getTime()
      );
      
      if (dayIndex !== -1) {
        const dayOfWeek = recordDate.getDay();
        const chartIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        weeklyStats[chartIndex]++;
        
        if (record.status === "present") {
          weeklyPresent[chartIndex]++;
        } else if (record.status === "late") {
          weeklyLate[chartIndex]++;
        } else if (record.status === "absent") {
          weeklyAbsent[chartIndex]++;
        }
      }
    });
    
    // ─── Device/Check-in Method Breakdown ───
    const deviceBreakdown = {
      webPortal: attendanceRecords.filter(r => r.checkInMethod === "web").length,
      mobileApp: attendanceRecords.filter(r => r.checkInMethod === "mobile").length,
      qrScanner: attendanceRecords.filter(r => r.checkInMethod === "qr").length
    };
    
    // ─── Monthly Chart Data (Last 3 Months) ───
    const monthlyData = {};
    const now = new Date();
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      monthlyData[key] = { present: 0, absent: 0, late: 0, leave: 0 };
    }
    
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (monthlyData[monthYear]) {
        if (monthlyData[monthYear][record.status] !== undefined) {
          monthlyData[monthYear][record.status]++;
        }
      }
    });
    
    const chartData = Object.entries(monthlyData).map(([name, data]) => ({
      name,
      present: data.present,
      absent: data.absent,
      late: data.late,
      leave: data.leave
    }));

    // ─── 🤖 AI INSIGHTS ───
    let aiInsights = null;
    
    if (getAIInsights && GROQ_API_KEY && attendanceRecords.length > 0) {
      try {
        // Prepare data for AI
        const weeklyDataStr = weeklyStats.map((val, idx) => 
          `${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][idx]}: ${val}`
        ).join(', ');
        
        const prompt = `
          You are an AI attendance analyst. Analyze this student's attendance data and provide insights:

          Attendance Statistics:
          - Total Days: ${totalDays}
          - Present: ${presentDays}
          - Absent: ${absentDays}
          - Late: ${lateDays}
          - Leave: ${leaveDays}
          - Attendance Percentage: ${attendancePercentage}%
          - Weekly Distribution: ${weeklyDataStr}

          Provide a JSON response with:
          1. predictedAttendance (number): Predicted attendance percentage for next month
          2. riskLevel (string): "Low", "Medium", or "High"
          3. riskFactors (array): 2-3 specific risk factors
          4. recommendations (array): 3 actionable recommendations
          5. patterns (array): 2-3 attendance patterns detected
          6. comparison (object): { yourAttendance, classAverage (estimate), topPerformer (estimate) }
          7. alerts (array): Important alerts if any
          8. performanceMessage (string): A motivational message
          9. nextWeekPrediction (string): Prediction for next week

          Return ONLY valid JSON, no other text.
        `;

        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are an AI attendance analyst. Always respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content || '';
          
          // Parse the JSON response
          try {
            // Extract JSON from the content (in case there's any extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              aiInsights = JSON.parse(jsonMatch[0]);
            } else {
              // Fallback: try parsing the whole content
              aiInsights = JSON.parse(content);
            }
          } catch (parseError) {
            console.error("AI Parse Error:", parseError);
            // Use fallback insights
            aiInsights = generateFallbackInsights(attendancePercentage, totalDays, weeklyStats);
          }
        } else {
          console.error("GROQ API Error:", response.status);
          aiInsights = generateFallbackInsights(attendancePercentage, totalDays, weeklyStats);
        }
      } catch (aiError) {
        console.error("AI Service Error:", aiError);
        aiInsights = generateFallbackInsights(attendancePercentage, totalDays, weeklyStats);
      }
    } else if (getAIInsights && !GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not configured");
      aiInsights = generateFallbackInsights(attendancePercentage, totalDays, weeklyStats);
    }

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
          attendancePercentage
        },
        weeklyStats,
        weeklyPresent,
        weeklyLate,
        weeklyAbsent,
        deviceBreakdown,
        chartData,
        aiInsights // 🤖 AI Insights
      }
    });
    
  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

// ─── Fallback AI Insights ───
function generateFallbackInsights(percentage, totalDays, weeklyStats) {
  const riskLevel = percentage >= 80 ? "Low" : percentage >= 60 ? "Medium" : "High";
  
  // Find best and worst days
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let bestDay = 'Mon';
  let worstDay = 'Sun';
  let maxVal = 0;
  let minVal = Infinity;
  
  weeklyStats.forEach((val, idx) => {
    if (val > maxVal) { maxVal = val; bestDay = dayNames[idx]; }
    if (val < minVal && val > 0) { minVal = val; worstDay = dayNames[idx]; }
  });

  const recommendations = [];
  if (percentage < 75) {
    recommendations.push(`📚 Focus on ${worstDay} attendance, it's your weakest day`);
    recommendations.push("⏰ Set multiple alarms to avoid being late");
    recommendations.push("📝 Review your weekly schedule to identify conflicts");
  } else if (percentage < 85) {
    recommendations.push(`⭐ Keep up the good work! Try to maintain consistency on ${worstDay}s`);
    recommendations.push("📈 Aim for 90% attendance this month");
    recommendations.push("🎯 Set a personal attendance goal");
  } else {
    recommendations.push("🌟 Excellent attendance! Keep it up!");
    recommendations.push("🎓 You're on track for academic excellence");
    recommendations.push("💪 Be a role model for other students");
  }

  return {
    predictedAttendance: Math.min(Math.round(percentage + (Math.random() * 5 - 2)), 100),
    riskLevel,
    riskFactors: [
      percentage < 70 ? "Attendance below 70% requires attention" : "Attendance is stable",
      totalDays < 10 ? "Limited data available for analysis" : "Good data coverage",
      percentage < 80 ? "Need improvement to reach excellent level" : "Maintaining good attendance"
    ],
    recommendations,
    patterns: [
      `${bestDay} has highest attendance with ${maxVal} records`,
      `${worstDay} needs improvement with ${minVal || 0} records`,
      percentage >= 70 ? "Overall attendance trend is positive" : "Attendance needs attention"
    ],
    comparison: {
      yourAttendance: percentage,
      classAverage: Math.min(percentage + 5 + Math.floor(Math.random() * 8), 98),
      topPerformer: Math.min(95 + Math.floor(Math.random() * 5), 100)
    },
    alerts: percentage < 60 ? [
      { type: "warning", message: "Attendance is critically low. Please improve immediately!", priority: "high" }
    ] : percentage < 75 ? [
      { type: "warning", message: "Attendance needs improvement. Aim for 75% or higher.", priority: "medium" }
    ] : [],
    performanceMessage: percentage >= 85 ? "🌟 Excellent performance! You're doing great!" :
                       percentage >= 70 ? "👏 Good job! Keep pushing for excellence!" :
                       "💪 You can do better! Let's improve together!",
    nextWeekPrediction: percentage >= 80 ? "Predicted: 85-90% attendance next week" :
                        percentage >= 60 ? "Predicted: 70-75% attendance next week" :
                        "Predicted: Need to focus on improving attendance"
  };
}
