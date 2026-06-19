// app/api/admin/fees/verify-qr/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    console.log("🔍 [ADMIN] Verify QR called with token:", token?.substring(0, 50));
    
    if (!token) {
      return NextResponse.json({ 
        valid: false,
        error: 'Token required' 
      }, { status: 400 });
    }
    
    await dbConnect();
    
    // Find fee by QR token
    const fee = await Fee.findOne({ qrToken: token }).populate('studentId');
    
    if (!fee) {
      return NextResponse.json({
        valid: false,
        reason: 'INVALID',
        message: 'Invalid QR code'
      });
    }
    
    // Check if expired
    if (fee.qrExpiry && new Date() > new Date(fee.qrExpiry)) {
      return NextResponse.json({
        valid: false,
        reason: 'EXPIRED',
        message: `QR code expired on ${new Date(fee.qrExpiry).toLocaleDateString()}`
      });
    }
    
    // Check if already paid
    if (fee.status === 'paid') {
      return NextResponse.json({
        valid: false,
        reason: 'PAID',
        message: `Fee for ${fee.month} already paid on ${fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'unknown date'}`
      });
    }
    
    // Calculate amounts
    const paidAmount = fee.amountPaid || 0;
    const remainingAmount = fee.amount - paidAmount;
    
    return NextResponse.json({
      valid: true,
      reason: 'OK',
      qrCodeImage: fee.qrCodeImage || null,
      qrLink: fee.qrLink || null,
      fee: {
        id: fee._id.toString(),
        month: fee.month,
        totalAmount: fee.amount,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        status: fee.status,
        dueDate: fee.dueDate
      },
      student: {
        id: fee.studentId?._id?.toString(),
        name: fee.studentId?.name || 'N/A',
        rollNo: fee.studentId?.rollNo || 'N/A',
        className: fee.studentId?.className || 'N/A'
      }
    });
    
  } catch (error) {
    console.error("Admin QR verify error:", error);
    return NextResponse.json({ 
      valid: false,
      error: error.message 
    }, { status: 500 });
  }
}

/*
{
"token":"NmEyOTE1ZGY2ZjE4YzVmZTY3NmUxMjk1LTZhMmFmNDllNWFiMGZjM2VhNTAwYTZhZS0xNzgxMjAwMDMxMDg4LWtqOTM3MDc3"
,
"studentId":"6a2915df6f18c5fe676e1295"
,
"feeId":"6a2af49e5ab0fc3ea500a6ae"
,
"amount":34996,"month":"June 2026"
,"rollNo":"123456"
,
"name":"Rayyan"
,
"timestamp":1781200031088}

*/