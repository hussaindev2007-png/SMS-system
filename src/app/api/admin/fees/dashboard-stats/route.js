import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import User from "@/models/User";
import { analyzeFeesData } from "@/lib/feesAI";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Update overdue fees first
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const updatedOverdue = await Fee.updateMany(
      {
        status: { $in: ["unpaid", "pending"] },
        dueDate: { $lt: today }
      },
      { $set: { status: "overdue", updatedAt: new Date() } }
    );
    
    console.log(`✅ Updated ${updatedOverdue.modifiedCount} fees to overdue`);
    
    // Get AI analysis
    const aiAnalysis = await analyzeFeesData();
    
    // Get total students count
    const totalStudents = await User.countDocuments({ role: "student" });
    
    // Get real-time stats
    const totalFees = await Fee.countDocuments();
    const paidFees = await Fee.countDocuments({ status: "paid" });
    const overdueFees = await Fee.countDocuments({ status: "overdue" });
    const unpaidFees = await Fee.countDocuments({ status: "unpaid" });
    const pendingFees = await Fee.countDocuments({ 
      status: { $in: ["unpaid", "pending", "overdue"] } 
    });
    
    // Calculate amounts
    const totalAmount = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const collectedAmount = await Fee.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const overdueAmount = await Fee.aggregate([
      { $match: { status: "overdue" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const unpaidAmount = await Fee.aggregate([
      { $match: { status: "unpaid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Pending amount = overdue + unpaid
    const pendingAmount = (overdueAmount[0]?.total || 0) + (unpaidAmount[0]?.total || 0);
    
    // Calculate collection rate based on total amount
    const totalAmountValue = totalAmount[0]?.total || 0;
    const collectedAmountValue = collectedAmount[0]?.total || 0;
    const collectionRate = totalAmountValue > 0 
      ? ((collectedAmountValue / totalAmountValue) * 100).toFixed(1) 
      : 0;
    
    // Calculate this month collection
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthCollection = await Fee.aggregate([
      { 
        $match: { 
          status: "paid",
          paidAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalRecords: totalFees,
        totalStudents: totalStudents,
        totalFees: totalFees,
        paidFees: paidFees,
        overdueFees: overdueFees,
        unpaidFees: unpaidFees,
        pendingFees: pendingFees,
        // Amount stats
        totalAmount: totalAmountValue,
        collectedAmount: collectedAmountValue,
        overdueAmount: overdueAmount[0]?.total || 0,
        unpaidAmount: unpaidAmount[0]?.total || 0,
        pendingAmount: pendingAmount,  // ← This is the key fix
        thisMonthCollection: thisMonthCollection[0]?.total || 0,
        // Rate stats
        collectionRate: parseFloat(collectionRate),
        // Student stats
        atRiskCount: aiAnalysis.atRiskStudents?.length || 0
      },
      aiInsights: {
        summary: aiAnalysis.summary,
        atRiskStudents: aiAnalysis.atRiskStudents?.slice(0, 5) || [],
        classPerformance: aiAnalysis.classPerformance || [],
        topClass: aiAnalysis.classPerformance?.[0] || null,
        worstClass: aiAnalysis.classPerformance?.[aiAnalysis.classPerformance.length - 1] || null,
        prediction: aiAnalysis.prediction || {},
        recommendations: aiAnalysis.recommendations?.slice(0, 5) || [],
        trend: aiAnalysis.monthlyTrend?.slice(-3) || [],
        monthlyTrend: aiAnalysis.monthlyTrend || []
      },
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
      error: error.toString()
    }, { status: 500 });
  }
}