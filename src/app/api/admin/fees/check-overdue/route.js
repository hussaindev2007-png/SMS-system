import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log("🔍 Checking overdue fees...");
    console.log(`📅 Today's date: ${today.toLocaleDateString()}`);
    
    // Find all unpaid or pending fees with due date less than today
    const overdueFees = await Fee.find({
      status: { $in: ["unpaid", "pending"] },
      dueDate: { $lt: today }
    }).populate("studentId", "name rollNo className phone email");
    
    console.log(`📊 Found ${overdueFees.length} overdue fees`);
    
    if (overdueFees.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No overdue fees found. All payments are up to date! ✅",
        updated: 0,
        overdueList: []
      });
    }
    
    // Update all to "overdue" status
    const result = await Fee.updateMany(
      {
        status: { $in: ["unpaid", "pending"] },
        dueDate: { $lt: today }
      },
      { 
        $set: { 
          status: "overdue",
          updatedAt: new Date()
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} fees to overdue status`);
    
    // Get details for response
    const updatedFees = await Fee.find({
      status: "overdue",
      dueDate: { $lt: today }
    }).populate("studentId", "name rollNo className phone email");
    
    // Calculate total overdue amount
    const totalOverdueAmount = updatedFees.reduce((sum, fee) => sum + fee.amount, 0);
    
    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} fees marked as overdue`,
      updated: result.modifiedCount,
      totalOverdueAmount: totalOverdueAmount,
      overdueList: updatedFees.map(fee => ({
        id: fee._id,
        studentName: fee.studentId?.name || "Unknown",
        rollNo: fee.rollNo,
        className: fee.className,
        month: fee.month,
        amount: fee.amount,
        dueDate: fee.dueDate,
        daysOverdue: Math.floor((today - new Date(fee.dueDate)) / (1000 * 60 * 60 * 24))
      }))
    });
    
  } catch (error) {
    console.error("❌ Error checking overdue fees:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to check overdue fees",
      error: error.message
    }, { status: 500 });
  }
}

// GET method to check without updating
export async function GET() {
  try {
    await dbConnect();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueFees = await Fee.find({
      status: { $in: ["unpaid", "pending"] },
      dueDate: { $lt: today }
    }).populate("studentId", "name rollNo className");
    
    const totalOverdueAmount = overdueFees.reduce((sum, fee) => sum + fee.amount, 0);
    
    return NextResponse.json({
      success: true,
      count: overdueFees.length,
      totalAmount: totalOverdueAmount,
      overdueFees: overdueFees.map(fee => ({
        studentName: fee.studentId?.name,
        rollNo: fee.rollNo,
        className: fee.className,
        month: fee.month,
        amount: fee.amount,
        dueDate: fee.dueDate
      }))
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}