import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherIDCard from "@/models/TeacherIDCard";
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
    
    // Find teacher
    const teacher = await Teacher.findById(teacherId).select("-password");
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher not found" 
      }, { status: 404 });
    }
    
    // Find ID card
    let idCard = await TeacherIDCard.findOne({ teacherId });
    
    // If no ID card exists, generate one
    if (!idCard && teacher.status === "approved") {
      const year = new Date().getFullYear();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const teacherCode = `TCH${year}${randomStr}`;
      const cardNumber = `TCRD${year}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const qrData = `${FRONTEND_URL}/teacher/qr-login?code=${teacherCode}`;
      
      const QRCode = (await import('qrcode')).default;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      
      idCard = await TeacherIDCard.create({
        teacherId: teacher._id,
        cardNumber,
        teacherCode,
        qrCodeData: qrCodeDataUrl,
        issueDate: new Date(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        status: "active",
        photoUrl: teacher.photoUrl
      });
    }
    
    if (!idCard) {
      return NextResponse.json({ 
        success: false, 
        message: "ID Card not found. Please contact admin." 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      card: idCard,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        department: teacher.department,
        qualification: teacher.qualification,
        photoUrl: teacher.photoUrl,
        joiningDate: teacher.joiningDate
      }
    });
    
  } catch (error) {
    console.error("Teacher ID Card error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}