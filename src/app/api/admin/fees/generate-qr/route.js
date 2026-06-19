// app/api/fees/generate-qr/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import { generateQRCode, generateQRToken } from "@/lib/qr-generator";

export async function POST(request) {
  try {
    const { feeId, studentId, month, amount, dueDate, studentName, rollNo, className, email } = await request.json();
    
    await dbConnect();
    
    let fee = await Fee.findById(feeId);
    
    if (!fee) {
      fee = new Fee({
        studentId: studentId,
        month: month,
        amount: amount,
        dueDate: dueDate,
        status: 'unpaid'
      });
    }
    
    // Generate QR token
    const qrToken = generateQRToken(studentId, fee._id);
    const qrExpiry = new Date();
    qrExpiry.setDate(qrExpiry.getDate() + 30);
    
    // ✅ NEW: Store FULL LINK in QR code (not just token)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const qrLink = `${baseUrl}/pay/qr/${qrToken}`;
    
    // ✅ Store FULL LINK in QR code - Scanner will open this link automatically
    const qrData = qrLink;  // 👈 FULL URL, not just token
    
    // Generate QR code image from full link
    const qrCodeImage = await generateQRCode(qrData);
    
    // Save to database
    fee.qrToken = qrToken;
    fee.qrExpiry = qrExpiry;
    fee.qrCodeImage = qrCodeImage;
    fee.qrLink = qrLink;
    fee.qrGeneratedAt = new Date();
    await fee.save();
    
    console.log(`✅ QR generated for fee ${feeId} with link: ${qrLink}`);
    
    return NextResponse.json({
      success: true,
      qrLink: qrLink,
      qrToken: qrToken,
      qrCodeImage: qrCodeImage,
      expiry: qrExpiry
    });
    
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}