import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    const teacher = await Teacher.findById(teacherId).select("preferences");
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher not found" 
      }, { status: 404 });
    }
    
    const preferences = teacher.preferences || {
      language: "english",
      theme: "dark",
      dashboardLayout: "comfortable",
      dateFormat: "DD/MM/YYYY",
      timeZone: "Asia/Karachi"
    };
    
    // Apply date format helper
    const getFormattedDate = (date, format) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      
      if (format === "DD/MM/YYYY") {
        return `${day}/${month}/${year}`;
      }
      return `${month}/${day}/${year}`;
    };
    
    return NextResponse.json({
      success: true,
      preferences: {
        ...preferences,
        getFormattedDate
      }
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}