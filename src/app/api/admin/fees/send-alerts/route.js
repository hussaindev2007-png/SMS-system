// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { addToQueue } from "@/lib/queue";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { type, className, sendToAll } = await req.json();
    
//     let query = { status: "unpaid" };
//     if (className && className !== "all") {
//       query.className = className;
//     }
    
//     const fees = await Fee.find(query).populate("studentId", "name email phone");
    
//     let sentCount = 0;
//     let failedCount = 0;
    
//     for (const fee of fees) {
//       if (!fee.studentId?.email) {
//         failedCount++;
//         continue;
//       }
      
//       let queueName = "";
//       if (type === "overdue") {
//         queueName = "fee_overdue_alert";
//       } else if (type === "reminder") {
//         queueName = "fee_reminder";
//       }
      
//       await addToQueue(queueName, {
//         email: fee.studentId.email,
//         studentName: fee.studentId.name,
//         amount: fee.amount,
//         month: fee.month,
//         dueDate: fee.dueDate
//       });
      
//       sentCount++;
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: `Queued ${sentCount} alerts for processing`,
//       sent: sentCount,
//       failed: failedCount
//     });
    
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: error.message
//     }, { status: 500 });
//   }
// }




import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import User from "@/models/User";
import { addToQueue } from "@/lib/queue";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { type, className, sendToAll, month } = await req.json();
    
    // Validate type
    if (!type || !['overdue', 'reminder', 'payment_confirmation', 'test'].includes(type)) {
      return NextResponse.json({
        success: false,
        message: "Invalid alert type. Use: overdue, reminder, payment_confirmation, or test"
      }, { status: 400 });
    }
    
    // Build query
    let query = { status: { $in: ["unpaid", "pending"] } };
    
    if (className && className !== "all" && className !== "") {
      query.className = className;
    }
    
    if (month) {
      query.month = month;
    }
    
    // For overdue alerts, add due date filter
    if (type === "overdue") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.dueDate = { $lt: today };
    }
    
    // For reminders, add upcoming due date filter
    if (type === "reminder") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      query.dueDate = { $gte: today, $lte: nextWeek };
    }
    
    console.log("🔍 Query:", JSON.stringify(query, null, 2));
    
    // Fetch fees with student data
    const fees = await Fee.find(query).populate("studentId", "name email phone rollNo className");
    
    if (fees.length === 0) {
      return NextResponse.json({
        success: true,
        message: `No ${type} fees found`,
        sent: 0,
        failed: 0,
        total: 0
      });
    }
    
    console.log(`📊 Found ${fees.length} fees for ${type} alerts`);
    
    let sentCount = 0;
    let failedCount = 0;
    let noEmailCount = 0;
    const results = [];
    
    for (const fee of fees) {
      const student = fee.studentId;
      
      // Skip if no student or no email
      if (!student) {
        failedCount++;
        results.push({
          feeId: fee._id,
          status: 'failed',
          reason: 'No student found'
        });
        continue;
      }
      
      if (!student.email) {
        noEmailCount++;
        results.push({
          studentName: student.name || 'Unknown',
          rollNo: student.rollNo || 'N/A',
          status: 'failed',
          reason: 'No email address'
        });
        continue;
      }
      
      try {
        // Determine queue name based on type
        let jobName = '';
        let jobData = {};
        
        if (type === 'overdue') {
          jobName = 'fee_overdue_alert';
          jobData = {
            type: 'fee_overdue_alert',
            email: student.email,
            studentName: student.name,
            amount: fee.amount,
            month: fee.month,
            dueDate: fee.dueDate,
            rollNo: student.rollNo,
            className: student.className
          };
        } else if (type === 'reminder') {
          jobName = 'fee_reminder';
          jobData = {
            type: 'fee_reminder',
            email: student.email,
            studentName: student.name,
            amount: fee.amount,
            month: fee.month,
            dueDate: fee.dueDate,
            rollNo: student.rollNo,
            className: student.className
          };
        } else if (type === 'payment_confirmation') {
          jobName = 'fee_payment_confirmation';
          jobData = {
            type: 'fee_payment_confirmation',
            email: student.email,
            studentName: student.name,
            amount: fee.amount,
            month: fee.month,
            rollNo: student.rollNo,
            className: student.className
          };
        } else if (type === 'test') {
          jobName = 'fee_test_alert';
          jobData = {
            type: 'fee_test_alert',
            email: student.email,
            studentName: student.name,
            amount: fee.amount,
            month: fee.month,
            rollNo: student.rollNo,
            className: student.className
          };
        }
        
        // Add to queue using the generic function
        await addToQueue(jobName, jobData);
        
        sentCount++;
        results.push({
          studentName: student.name,
          rollNo: student.rollNo,
          email: student.email,
          status: 'queued'
        });
        
        console.log(`✅ Queued ${type} alert for ${student.name} (${student.email})`);
        
      } catch (error) {
        failedCount++;
        results.push({
          studentName: student.name,
          rollNo: student.rollNo,
          email: student.email,
          status: 'failed',
          error: error.message
        });
        console.error(`❌ Failed to queue for ${student.name}:`, error.message);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Queued ${sentCount} ${type} alerts for processing`,
      summary: {
        total: fees.length,
        queued: sentCount,
        failed: failedCount,
        noEmail: noEmailCount
      },
      results: results.slice(0, 20) // First 20 results
    });
    
  } catch (error) {
    console.error("Send alerts error:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
      error: error.stack
    }, { status: 500 });
  }
}

// GET: Get pending alerts stats
export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('className');
    const action = searchParams.get('action');
    
    // Check queue stats
    if (action === 'queue-stats') {
      const { getQueueStats } = await import('@/lib/queue');
      const stats = await getQueueStats('feeQueue');
      return NextResponse.json({
        success: true,
        stats
      });
    }
    
    // Get fee stats
    let query = { status: { $in: ['unpaid', 'pending'] } };
    if (className && className !== 'all') {
      query.className = className;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Overdue fees count
    const overdueCount = await Fee.countDocuments({
      ...query,
      dueDate: { $lt: today }
    });
    
    // Upcoming fees count (next 7 days)
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcomingCount = await Fee.countDocuments({
      ...query,
      dueDate: { $gte: today, $lte: nextWeek }
    });
    
    // Total pending fees
    const totalPending = await Fee.countDocuments(query);
    
    // Get unique classes
    const classes = await Fee.distinct('className');
    
    // Get queue stats
    const { getQueueStats } = await import('@/lib/queue');
    const queueStats = await getQueueStats('feeQueue');
    
    return NextResponse.json({
      success: true,
      stats: {
        overdue: overdueCount,
        upcoming: upcomingCount,
        totalPending: totalPending,
        totalFees: await Fee.countDocuments()
      },
      classes: classes.filter(Boolean).sort(),
      queue: queueStats
    });
    
  } catch (error) {
    console.error("Get alerts stats error:", error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}