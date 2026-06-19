import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import StudentIDCard from "@/models/StudentIDCard";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { studentId } = await req.json();
    
    if (!studentId) {
      return NextResponse.json({ error: "Student ID required" }, { status: 400 });
    }
    
    // Find student
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    
    // Check if ID card already exists
    let existingCard = await StudentIDCard.findOne({ studentId });
    
    // Generate QR code data
    const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const qrData = `${FRONTEND_URL}/verify/${studentId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    
    if (existingCard) {
      // Update existing card with new QR code and dates
      existingCard.qrCodeData = qrCodeDataUrl;
      existingCard.issueDate = new Date();
      existingCard.expiryDate = new Date();
      existingCard.expiryDate.setFullYear(existingCard.expiryDate.getFullYear() + 2);
      existingCard.status = "active";
      await existingCard.save();
      
      return NextResponse.json({
        success: true,
        message: "ID Card regenerated successfully!",
        data: existingCard
      });
    }
    
    // Generate new ID card
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const cardNumber = `SID-${year}-${random}`;
    
    const newCard = await StudentIDCard.create({
      studentId: student._id,
      cardNumber: cardNumber,
      rollNumber: student.rollNo,
      course: student.targetCourse || "General",
      batch: year.toString(),
      issueDate: new Date(),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      qrCodeData: qrCodeDataUrl,
      photoUrl: student.photoUrl || null,
      status: "active"
    });
    
    return NextResponse.json({
      success: true,
      message: "ID Card generated successfully!",
      data: newCard
    });
    
  } catch (error) {
    console.error("Generate ID Card error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}