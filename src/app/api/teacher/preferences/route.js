import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

// GET: Fetch teacher preferences
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
    
    // Default preferences if not set
    const defaultPreferences = {
      language: "english",
      theme: "dark",
      dashboardLayout: "comfortable",
      dateFormat: "DD/MM/YYYY",
      timeZone: "Asia/Karachi"
    };
    
    const preferences = { ...defaultPreferences, ...teacher.preferences };
    
    return NextResponse.json({
      success: true,
      preferences
    });
    
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// PUT: Update teacher preferences
export async function PUT(req) {
  try {
    await dbConnect();
    
    const { teacherId, preferences } = await req.json();
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $set: { preferences } },
      { new: true }
    ).select("preferences");
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: teacher.preferences
    });
    
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}