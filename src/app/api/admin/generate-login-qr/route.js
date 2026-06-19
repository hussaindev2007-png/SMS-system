import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { sendLoginQREmail } from "@/lib/email";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { studentId, studentEmail, studentName } = await req.json();
    
    if (!studentId || !studentEmail) {
      return NextResponse.json({ 
        message: "Student ID and email required" 
      }, { status: 400 });
    }
    
    const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Create special login QR code (different from attendance QR)
    const loginQRData = `${FRONTEND_URL}/login?qr=${studentId}&mode=login`;
    
    // Generate QR code image
    const qrCodeDataUrl = await QRCode.toDataURL(loginQRData);
    
    // Send email with QR code
    const emailSent = await sendLoginQREmail(studentEmail, studentName, qrCodeDataUrl, loginQRData);
    
    if (!emailSent) {
      return NextResponse.json({ 
        message: "Failed to send email" 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: `Login QR code sent to ${studentEmail}`,
      qrCodeData: qrCodeDataUrl
    });
    
  } catch (error) {
    console.error("Generate login QR error:", error);
    return NextResponse.json({ 
      message: error.message 
    }, { status: 500 });
  }
}