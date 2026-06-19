import { analyzeFeesData } from "./feesAI";
import dbConnect from "./mongodb";
import Fee from "@/models/Fee";
import User from "@/models/User";
import { addToQueue } from "./queue";

// Check and update overdue fees
const updateOverdueFees = async () => {
  console.log("🔍 Checking for overdue fees...");
  await dbConnect();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result = await Fee.updateMany(
    {
      status: { $in: ["unpaid", "pending"] },
      dueDate: { $lt: today }
    },
    { $set: { status: "overdue" } }
  );
  
  console.log(`✅ Updated ${result.modifiedCount} fees to overdue`);
  return result.modifiedCount;
};

// Send reminders for upcoming due dates
const sendDueDateReminders = async () => {
  console.log("🔔 Checking for upcoming due dates...");
  await dbConnect();
  
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);
  
  const upcomingFees = await Fee.find({
    status: { $in: ["unpaid", "pending"] },
    dueDate: { $gte: today, $lte: threeDaysLater }
  }).populate("studentId", "name email");
  
  for (const fee of upcomingFees) {
    // Add to queue for reminder
    await addToQueue("fee_reminder", {
      email: fee.studentId?.email,
      studentName: fee.studentId?.name,
      amount: fee.amount,
      month: fee.month,
      dueDate: fee.dueDate
    });
  }
  
  console.log(`📧 Queued ${upcomingFees.length} reminder emails`);
  return upcomingFees.length;
};

// Run full AI analysis and send report to admin
const runAIAnalysis = async () => {
  console.log("🤖 Running AI analysis...");
  
  const analysis = await analyzeFeesData();
  
  // Here you can send report to admin email
  console.log("📊 AI Analysis Complete:");
  console.log(`   Collection Rate: ${analysis.summary.collectionRate}%`);
  console.log(`   Overdue Amount: PKR ${analysis.summary.totalOverdueAmount.toLocaleString()}`);
  console.log(`   At Risk Students: ${analysis.atRiskStudents.length}`);
  console.log(`   Predictions: ${analysis.prediction.nextMonthCollection}`);
  
  return analysis;
};

// Main scheduler function - runs daily at 9 AM
export const scheduleDailyFeeCheck = async () => {
  console.log("🕐 Scheduling daily fee check...");
  
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(9, 0, 0, 0); // 9:00 AM
  
  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const delay = scheduledTime - now;
  console.log(`⏰ Next fee check at ${scheduledTime.toLocaleString()}`);
  
  setTimeout(async () => {
    console.log("🚀 Running scheduled fee check...");
    
    // Step 1: Update overdue fees
    await updateOverdueFees();
    
    // Step 2: Send due date reminders
    await sendDueDateReminders();
    
    // Step 3: Run AI analysis
    await runAIAnalysis();
    
    // Reschedule for next day
    scheduleDailyFeeCheck();
  }, delay);
};

// Start scheduler on server start
if (typeof window === 'undefined') {
  scheduleDailyFeeCheck();
}