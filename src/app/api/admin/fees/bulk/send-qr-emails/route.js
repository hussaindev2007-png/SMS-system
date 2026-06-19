// app/api/admin/fees/bulk/send-qr-emails/route.js
// Send QR emails to existing fees that don't have QR yet

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import { generateQRCode, generateQRToken } from "@/lib/qr-generator";
import { sendFeeQREmail } from "@/lib/email";  // ✅ Path sahi karo (email.js, email-service nahi)

export async function POST(request) {
  try {
    await dbConnect();
    
    const { month, className } = await request.json();
    
    // Find fees without QR codes
    const query = {
      qrToken: { $exists: false },
      status: { $ne: 'paid' }
    };
    
    if (month) query.month = month;
    if (className) query.className = className;
    
    const fees = await Fee.find(query).populate('studentId');
    
    console.log(`Found ${fees.length} fees without QR codes`);
    
    let processed = 0;
    let successCount = 0;
    let failedCount = 0;
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    for (const fee of fees) {
      try {
        const student = fee.studentId;
        if (!student) {
          console.log(`⚠️ No student found for fee ${fee._id}`);
          failedCount++;
          continue;
        }
        
        console.log(`📧 Processing: ${student.name} (${student.email})`);
        
        // Generate QR token
        const qrToken = generateQRToken(student._id.toString(), fee._id.toString());
        const qrExpiry = new Date();
        qrExpiry.setDate(qrExpiry.getDate() + 30);
        
        const qrData = {
          token: qrToken,
          studentId: student._id.toString(),
          feeId: fee._id.toString(),
          amount: fee.amount,
          month: fee.month,
          rollNo: student.rollNo,
          name: student.name,
          timestamp: Date.now()
        };
        
        // Generate QR code image
        const qrCodeImage = await generateQRCode(qrData);
        const qrLink = `${baseUrl}/pay/qr/${qrToken}`;
        
        // Update fee with QR data
        fee.qrToken = qrToken;
        fee.qrExpiry = qrExpiry;
        fee.qrCodeImage = qrCodeImage;
        fee.qrLink = qrLink;
        fee.qrGeneratedAt = new Date();
        await fee.save();
        
        // ✅ Send email with QR IMAGE ATTACHMENT (not just link)
        if (student.email) {
          const emailResult = await sendFeeQREmail(
            student.email,
            student.name,
            student.rollNo,
            fee.month,
            fee.amount,
            fee.dueDate,
            qrCodeImage,  // ✅ QR IMAGE (base64)
            qrLink        // ✅ LINK (backup)
          );
          
          if (emailResult.success) {
            successCount++;
            console.log(`✅ Email sent to ${student.email} with QR attachment`);
          } else {
            failedCount++;
            console.log(`❌ Email failed for ${student.email}: ${emailResult.error}`);
          }
        } else {
          console.log(`⚠️ No email for ${student.name}, skipping`);
          failedCount++;
        }
        
        processed++;
        
      } catch (error) {
        failedCount++;
        console.error(`❌ Failed for fee ${fee._id}:`, error.message);
      }
    }
    
    console.log(`📊 Summary: Processed: ${processed}, Success: ${successCount}, Failed: ${failedCount}`);
    
    return NextResponse.json({
      success: true,
      processed,
      successCount,
      failedCount,
      message: `Processed ${processed} fees: ${successCount} emails sent, ${failedCount} failed`
    });
    
  } catch (error) {
    console.error("Send QR emails error:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}