import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherIDCard from "@/models/TeacherIDCard";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { action, teacherCode } = await req.json();
    
    // QR Scan - Get teacher info (no OTP, just return info)
    if (action === "qr-info") {
      const card = await TeacherIDCard.findOne({ teacherCode });
      
      if (!card || card.status !== "active") {
        return NextResponse.json({ message: "Invalid QR code" }, { status: 404 });
      }
      
      const teacher = await Teacher.findById(card.teacherId);
      if (!teacher || teacher.status !== "approved") {
        return NextResponse.json({ message: "Teacher account not active" }, { status: 403 });
      }
      
      // Return teacher info - no login token yet
      return NextResponse.json({
        success: true,
        teacherId: teacher._id,
        name: teacher.name,
        email: teacher.email
      });
    }
    
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    
  } catch (error) {
    console.error("Teacher QR error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}