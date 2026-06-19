import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherIDCard from "@/models/TeacherIDCard";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { teacherId } = await req.json();
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher not found" 
      }, { status: 404 });
    }
    
    if (teacher.status !== "approved") {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher must be approved first" 
      }, { status: 400 });
    }
    
    const year = new Date().getFullYear();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const teacherCode = `TCH${year}${randomStr}`;
    const cardNumber = `TCRD${year}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    
    const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const qrData = `${FRONTEND_URL}/verify/teacher/${teacherCode}`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    
    // Delete existing card if any
    await TeacherIDCard.findOneAndDelete({ teacherId });
    
    const idCard = await TeacherIDCard.create({
      teacherId: teacher._id,
      cardNumber,
      teacherCode,
      qrCodeData: qrCodeDataUrl,
      issueDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      status: "active",
      photoUrl: teacher.photoUrl
    });
    
    return NextResponse.json({
      success: true,
      message: "Teacher ID card generated successfully",
      card: idCard,
      teacher: {
        name: teacher.name,
        email: teacher.email,
        department: teacher.department
      }
    });
    
  } catch (error) {
    console.error("Error generating teacher ID card:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}