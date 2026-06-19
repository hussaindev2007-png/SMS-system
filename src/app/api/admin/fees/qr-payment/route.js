// app/api/admin/fees/qr-payment/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";

// Staff PINs
const STAFF_PINS = {
  'admin123': { role: 'admin', name: 'Admin' },
  'staff001': { role: 'staff', name: 'Fee Counter 1' },
  'staff002': { role: 'staff', name: 'Fee Counter 2' },
  'staff003': { role: 'staff', name: 'Fee Counter 3' }
};

export async function POST(request) {
  try {
    const { token, amount, staffPin, remarks = "" } = await request.json();
    
    // Step 1: Verify staff PIN
    if (!staffPin) {
      return NextResponse.json({ 
        error: 'Staff PIN required',
        requirePin: true 
      }, { status: 401 });
    }
    
    const staff = STAFF_PINS[staffPin];
    if (!staff) {
      return NextResponse.json({ 
        error: 'Invalid staff PIN',
        requirePin: true 
      }, { status: 401 });
    }
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
    }
    
    await dbConnect();
    
    const fee = await Fee.findOne({ qrToken: token }).populate('studentId');
    
    if (!fee) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 });
    }
    
    if (fee.status === 'paid') {
      return NextResponse.json({ 
        error: `Fee already paid` 
      }, { status: 400 });
    }
    
    // Calculate amounts
    const currentPaid = fee.amountPaid || 0;
    const newPaid = currentPaid + amount;
    const remainingAmount = Math.max(0, fee.amount - newPaid);
    const isFullyPaid = remainingAmount === 0;
    
    // ✅ FIXED: Use string fields only, avoid ObjectId
    const updateData = {
      amountPaid: newPaid,
      remainingAmount: remainingAmount,
      paymentDate: new Date(),
      paymentMethod: 'cash',
      // ✅ Use string fields (not ObjectId)
      collectedBy: staff.name,        // String field
      collectedByName: staff.name,    // String field
      collectedByPin: staffPin,       // String field
      collectedByRole: staff.role,    // String field
      paymentRemarks: remarks,
      paymentHistory: [
        ...(fee.paymentHistory || []),
        {
          amount: amount,
          date: new Date(),
          method: 'cash',
          receivedBy: staff.name,      // String field
          receivedByName: staff.name,  // String field
          staffPin: staffPin,
          remarks: remarks,
          remainingAfter: remainingAmount
        }
      ]
    };
    
    if (isFullyPaid) {
      updateData.status = 'paid';
    } else {
      updateData.status = 'partially-paid';
    }
    
    // ✅ Use returnDocument instead of new (deprecated warning fix)
    const updatedFee = await Fee.findByIdAndUpdate(
      fee._id, 
      updateData, 
      { new: true, returnDocument: 'after' }
    );
    
    // Send confirmation email
    const student = fee.studentId;
    if (student?.email) {
      try {
        const { sendFeePaymentConfirmation } = await import('@/lib/email');
        await sendFeePaymentConfirmation(
          student.email,
          student.name,
          student.rollNo,
          fee.month,
          amount,
          remainingAmount,
          isFullyPaid
        );
      } catch (emailError) {
        console.error("Email error:", emailError);
      }
    }
    
    return NextResponse.json({
      success: true,
      isFullyPaid: isFullyPaid,
      amountPaid: amount,
      totalPaid: newPaid,
      remainingAmount: remainingAmount,
      collectedBy: staff.name,
      collectedAt: new Date().toISOString(),
      status: isFullyPaid ? 'paid' : 'partially-paid',
      message: isFullyPaid 
        ? `✅ Payment complete! PKR ${amount.toLocaleString()} received by ${staff.name}`
        : `💰 PKR ${amount.toLocaleString()} received by ${staff.name}. Remaining: PKR ${remainingAmount.toLocaleString()}`
    });
    
  } catch (error) {
    console.error("QR payment error:", error);
    return NextResponse.json({ 
      error: error.message,
      message: 'Payment processing failed. Please try again.'
    }, { status: 500 });
  }
}