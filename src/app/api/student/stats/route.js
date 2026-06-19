// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");
//     const className = searchParams.get("className");

//     const [total, submissions, upcomingWork] = await Promise.all([
//       Assignment.countDocuments({ targetClass: className }),
//       Submission.find({ studentId }).lean(),
//       Assignment.find({ targetClass: className }).sort({ dueDate: 1 }).limit(3).lean()
//     ]);

//     const submittedIds = submissions.map(s => s.assignmentId.toString());
    
//     return NextResponse.json({
//       success: true,
//       stats: {
//         total,
//         submitted: submissions.length,
//         approved: submissions.filter(s => s.status === "approved").length,
//         pendingReview: submissions.filter(s => s.status === "pending").length,
//         notStarted: Math.max(0, total - submissions.length)
//       },
//       upcomingWork: upcomingWork.filter(a => !submittedIds.includes(a._id.toString()))
//     });
//   } catch (e) {
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }



























// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");
//     const className = searchParams.get("className");

//     // Validation: Ensure required params are present
//     if (!studentId || !className) {
//       return NextResponse.json(
//         { success: false, message: "Missing studentId or className" },
//         { status: 400 }
//       );
//     }

//     // 1. Get Total Assignments for the class
//     const totalAssignments = await Assignment.countDocuments({ 
//       targetClass: className 
//     });

//     // 2. Get All Submissions for this student
//     // We only need _id, assignmentId, and status for calculation
//     const submissions = await Submission.find({ studentId })
//       .select("_id assignmentId status")
//       .lean();

//     // 3. Get Upcoming Work (Assignments not yet submitted by this student)
//     // First, get all assignments for the class, sorted by due date
//     const allClassAssignments = await Assignment.find({ 
//       targetClass: className 
//     })
//     .sort({ dueDate: 1 }) // Ascending order (earliest first)
//     .limit(10) // Limit to 10 to avoid over-fetching
//     .lean();

//     // Create a Set of submitted assignment IDs for O(1) lookup
//     const submittedAssignmentIds = new Set(
//       submissions.map((s) => s.assignmentId.toString())
//     );

//     // Filter out assignments that are already submitted
//     const upcomingWork = allClassAssignments.filter(
//       (a) => !submittedAssignmentIds.has(a._id.toString())
//     );

//     // Calculate Stats
//     const approvedCount = submissions.filter((s) => s.status === "approved").length;
//     const pendingCount = submissions.filter((s) => s.status === "pending").length;
//     const submittedCount = submissions.length;
    
//     // Not started = Total Assignments in Class - Submitted Count
//     const notStartedCount = Math.max(0, totalAssignments - submittedCount);

//     return NextResponse.json({
//       success: true,
//       stats: {
//         total: totalAssignments,
//         submitted: submittedCount,
//         approved: approvedCount,
//         pendingReview: pendingCount,
//         notStarted: notStartedCount,
//       },
//       upcomingWork: upcomingWork, 
//     });

//   } catch (error) {
//     console.error("Dashboard Stats Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

































// up

// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");
//     const className = searchParams.get("className");

//     if (!studentId || !className) {
//       return NextResponse.json(
//         { success: false, message: "Missing studentId or className" },
//         { status: 400 }
//       );
//     }

//     const studentProfile = await User.findById(studentId)
//       .select("rollNo campus city targetCourse")
//       .lean();

//     const feeRecords = await Fee.find({ studentId })
//       .sort({ dueDate: -1 })
//       .lean();

//     const totalAssignments = await Assignment.countDocuments({ 
//       targetClass: className 
//     });

//     const submissions = await Submission.find({ studentId })
//       .select("_id assignmentId status")
//       .lean();

//     const allClassAssignments = await Assignment.find({ 
//       targetClass: className 
//     })
//     .sort({ dueDate: 1 })
//     .limit(5) 
//     .lean();

//     const submittedAssignmentIds = new Set(
//       submissions.map((s) => s.assignmentId.toString())
//     );

//     const upcomingWork = allClassAssignments.filter(
//       (a) => !submittedAssignmentIds.has(a._id.toString())
//     );

//     const approvedCount = submissions.filter((s) => s.status === "approved").length;
//     const pendingCount = submissions.filter((s) => s.status === "pending").length;
//     const submittedCount = submissions.length;

//     return NextResponse.json({
//       success: true,
//       profile: {
//         rollNo: studentProfile?.rollNo || "N/A",
//         campus: studentProfile?.campus || "Main Campus",
//         city: studentProfile?.city || "Karachi",
//         courseName: studentProfile?.targetCourse || "Web Development",
//       },
//       stats: {
//         total: totalAssignments,
//         submitted: submittedCount,
//         approved: approvedCount,
//         pendingReview: pendingCount,
//         notStarted: Math.max(0, totalAssignments - submittedCount),
//       },
//       upcomingWork,
//       fees: feeRecords,
//     });

//   } catch (error) {
//     console.error("Dashboard Stats Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }








// ----------------------------------------------------------------






// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");
//     const className = searchParams.get("className");

//     if (!studentId || !className) {
//       return NextResponse.json(
//         { success: false, message: "Missing studentId or className" },
//         { status: 400 }
//       );
//     }

//     // 1. Profile, Fees, and Basic Stats (Existing logic)
//     const studentProfile = await User.findById(studentId)
//       .select("rollNo campus city targetCourse")
//       .lean();

//     const feeRecords = await Fee.find({ studentId })
//       .sort({ dueDate: -1 })
//       .lean();

//     const totalAssignments = await Assignment.countDocuments({ 
//       targetClass: className 
//     });

//     const submissions = await Submission.find({ studentId })
//       .select("_id assignmentId status createdAt")
//       .lean();

//     // 2. Assignment Analytics (Chart Data Logic)
//     // Hum pichle 6 months ka data nikal rahe hain
//     const analytics = await Submission.aggregate([
//       {
//         $match: {
//           studentId: new mongoose.Types.ObjectId(studentId)
//         }
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } },
//       { $limit: 6 }
//     ]);

//     // Analytics data ko readable format mein convert karna (e.g., "Jan", "Feb")
//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const chartData = analytics.map(item => ({
//       name: monthNames[item._id.month - 1],
//       value: item.count
//     }));

//     // Agar data khali ho toh default empty state dikhana
//     const finalChartData = chartData.length > 0 ? chartData : [
//       { name: "Start", value: 0 }
//     ];

//     // 3. Upcoming Work (Existing logic)
//     const allClassAssignments = await Assignment.find({ 
//       targetClass: className 
//     })
//     .sort({ dueDate: 1 })
//     .limit(5) 
//     .lean();

//     const submittedAssignmentIds = new Set(
//       submissions.map((s) => s.assignmentId.toString())
//     );

//     const upcomingWork = allClassAssignments.filter(
//       (a) => !submittedAssignmentIds.has(a._id.toString())
//     );

//     const approvedCount = submissions.filter((s) => s.status === "approved").length;
//     const pendingCount = submissions.filter((s) => s.status === "pending").length;
//     const submittedCount = submissions.length;

//     return NextResponse.json({
//       success: true,
//       profile: {
//         rollNo: studentProfile?.rollNo || "N/A",
//         campus: studentProfile?.campus || "Main Campus",
//         city: studentProfile?.city || "Karachi",
//         courseName: studentProfile?.targetCourse || "Web Development",
//       },
//       stats: {
//         total: totalAssignments,
//         submitted: submittedCount,
//         approved: approvedCount,
//         pendingReview: pendingCount,
//         notStarted: Math.max(0, totalAssignments - submittedCount),
//       },
//       chartData: finalChartData, // ✅ Yeh ab frontend chart mein jayega
//       upcomingWork,
//       fees: feeRecords,
//     });

//   } catch (error) {
//     console.error("Dashboard Stats Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }



































// --------------------------------------------------------------



// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");
//     const className = searchParams.get("className");

//     console.log("--- BACKEND DEBUG ---");
//     console.log("Input Params:", { studentId, className });

//     if (!studentId || !className) {
//       return NextResponse.json(
//         { success: false, message: "Missing params" },
//         { status: 400 }
//       );
//     }

//     // 1. Basic Stats
//     const studentProfile = await User.findById(studentId).select("rollNo campus city targetCourse").lean();
//     const feeRecords = await Fee.find({ studentId }).sort({ dueDate: -1 }).lean();
//     const totalAssignments = await Assignment.countDocuments({ targetClass: className });

//     // Important: Convert string ID to Mongoose ObjectId for Aggregation
//     const validStudentId = new mongoose.Types.ObjectId(studentId);

//     // 2. Submission Data for Logic
//     const submissions = await Submission.find({ studentId: validStudentId }).lean();
//     console.log("Submissions count:", submissions.length);

//     // 3. Assignment Analytics (Fixed Aggregation)
//     const analytics = await Submission.aggregate([
//       {
//         $match: {
//           studentId: validStudentId // Proper ObjectId match
//         }
//       },
//       {
//         $group: {
//           _id: {
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     console.log("Raw Analytics Result:", JSON.stringify(analytics));

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     // Formatting for Recharts
//     const chartData = analytics.map(item => ({
//       name: monthNames[item._id.month - 1],
//       value: item.count
//     }));

//     // Dashboard data logic
//     const submittedAssignmentIds = new Set(submissions.map((s) => s.assignmentId.toString()));
//     const allClassAssignments = await Assignment.find({ targetClass: className }).sort({ dueDate: 1 }).limit(5).lean();
//     const upcomingWork = allClassAssignments.filter((a) => !submittedAssignmentIds.has(a._id.toString()));

//     return NextResponse.json({
//       success: true,
//       profile: {
//         rollNo: studentProfile?.rollNo || "N/A",
//         campus: studentProfile?.campus || "Main Campus",
//         city: studentProfile?.city || "Karachi",
//         courseName: studentProfile?.targetCourse || "Web Development",
//       },
//       stats: {
//         total: totalAssignments,
//         submitted: submissions.length,
//         approved: submissions.filter((s) => s.status === "approved").length,
//         pendingReview: submissions.filter((s) => s.status === "pending").length,
//       },
//       chartData: chartData.length > 0 ? chartData : [{ name: "New", value: 0 }],
//       upcomingWork,
//       fees: feeRecords,
//     });

//   } catch (error) {
//     console.error("Dashboard Stats Error:", error);
//     return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 });
//   }
// }










































// ----------------------------------------quen











// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import StudentIDCard from "@/models/StudentIDCard";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");
//     const className = searchParams.get("className");

//     if (!studentId || !className) {
//       return NextResponse.json(
//         { success: false, message: "Missing params" },
//         { status: 400 }
//       );
//     }

//     // Convert ID safely
//     let validStudentId;
//     try {
//       validStudentId = new mongoose.Types.ObjectId(studentId);
//     } catch (e) {
//       return NextResponse.json({ success: false, message: "Invalid Student ID" }, { status: 400 });
//     }

//     // 1. Fetch Profile, ID Card (with photo), and Fees
//     const [studentProfile, idCard, feeRecords] = await Promise.all([
//       User.findById(studentId).select("rollNo className section fatherName name email phone photoUrl").lean(),
//       StudentIDCard.findOne({ studentId: validStudentId }).populate('studentId', 'photoUrl name').lean(),
//       Fee.find({ studentId: validStudentId }).populate('studentId').sort({ dueDate: -1 }).lean()
//     ]);

//     // Extract photo URL from ID card or User profile
//     let photoUrl = null;
//     if (idCard?.studentId?.photoUrl) {
//       photoUrl = idCard.studentId.photoUrl;
//     } else if (studentProfile?.photoUrl) {
//       photoUrl = studentProfile.photoUrl;
//     }

//     // Calculate Fee Summary
//     let totalFeeAmount = 0;
//     let totalPaidAmount = 0;
//     let paidMonths = 0;
//     let partialMonths = 0;
//     let unpaidMonths = 0;
//     let overdueMonths = 0;
    
//     const feeDetails = feeRecords.map(fee => {
//       const paidAmount = fee.amountPaid || 0;
//       const remainingAmount = fee.amount - paidAmount - (fee.discount || 0);
//       const isOverdue = fee.dueDate && new Date(fee.dueDate) < new Date() && fee.status !== 'paid';
      
//       totalFeeAmount += fee.amount;
//       totalPaidAmount += paidAmount;
      
//       if (fee.status === 'paid') paidMonths++;
//       else if (fee.status === 'partially-paid') partialMonths++;
//       else if (isOverdue) overdueMonths++;
//       else if (fee.status === 'unpaid') unpaidMonths++;
      
//       return {
//         id: fee._id,
//         month: fee.month,
//         amount: fee.amount,
//         amountPaid: paidAmount,
//         remainingAmount: Math.max(0, remainingAmount),
//         status: fee.status,
//         dueDate: fee.dueDate,
//         paymentDate: fee.paymentDate,
//         discount: fee.discount || 0,
//         isOverdue: isOverdue,
//         paymentMethod: fee.paymentMethod,
//         collectedBy: fee.collectedByName || fee.collectedBy
//       };
//     });
    
//     const remainingAmount = totalFeeAmount - totalPaidAmount;
//     const paymentProgress = totalFeeAmount > 0 ? (totalPaidAmount / totalFeeAmount) * 100 : 0;
    
//     // Generate Fee Recommendations
//     const feeRecommendations = [];
//     if (remainingAmount > 0) {
//       if (overdueMonths > 0) {
//         feeRecommendations.push(`⚠️ You have ${overdueMonths} overdue month(s). Please clear pending fees immediately to avoid late fees.`);
//       }
//       if (partialMonths > 0) {
//         feeRecommendations.push(`💰 You have ${partialMonths} partially paid month(s). Remaining amount: PKR ${(feeRecords.filter(f => f.status === 'partially-paid').reduce((sum, f) => sum + (f.amount - (f.amountPaid || 0)), 0)).toLocaleString()}`);
//       }
//       if (unpaidMonths > 0) {
//         feeRecommendations.push(`📌 You have ${unpaidMonths} unpaid month(s). Please pay before due date.`);
//       }
//       feeRecommendations.push(`💡 Total pending amount: PKR ${remainingAmount.toLocaleString()}. Visit fee counter to pay.`);
//     } else {
//       feeRecommendations.push(`✅ Great! All your fees are paid. Thank you!`);
//     }

//     // 2. Fetch Assignments Stats
//     const totalAssignments = await Assignment.countDocuments({ targetClass: className });
    
//     // 3. Fetch Submissions
//     const submissions = await Submission.find({ studentId: validStudentId }).lean();
    
//     // Calculate assignment recommendations
//     const submittedCount = submissions.length;
//     const pendingCount = totalAssignments - submittedCount;
//     const approvedCount = submissions.filter(s => s.status === "approved").length;
//     const rejectedCount = submissions.filter(s => s.status === "rejected").length;
    
//     const assignmentRecommendations = [];
//     if (pendingCount > 0) {
//       assignmentRecommendations.push(`📚 You have ${pendingCount} pending assignment(s). Submit them before due date.`);
//     }
//     if (rejectedCount > 0) {
//       assignmentRecommendations.push(`📝 ${rejectedCount} assignment(s) need revision. Check feedback and resubmit.`);
//     }
//     if (approvedCount > 0 && pendingCount === 0) {
//       assignmentRecommendations.push(`🎉 Excellent! All assignments completed. Keep it up!`);
//     }

//     // 4. Generate Chart Data (Monthly Trend)
//     const analytics = await Submission.aggregate([
//       { $match: { studentId: validStudentId } },
//       {
//         $group: {
//           _id: {
//             month: { $month: "$createdAt" },
//             year: { $year: "$createdAt" }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
//     let chartData = analytics.map(item => ({
//       name: monthNames[item._id.month - 1],
//       value: item.count
//     }));

//     if (chartData.length === 0) {
//       chartData = [{ name: "No Data", value: 0 }]; 
//     }

//     // 5. Upcoming Work Logic
//     const submittedIds = new Set(submissions.map((s) => s.assignmentId?.toString()));
//     const upcomingWork = await Assignment.find({ 
//       targetClass: className,
//       _id: { $nin: Array.from(submittedIds) }
//     })
//     .sort({ dueDate: 1 })
//     .limit(5)
//     .lean();

//     // Add due date warnings to upcoming work
//     const today = new Date();
//     const upcomingWorkWithWarnings = upcomingWork.map(assignment => {
//       const dueDate = new Date(assignment.dueDate);
//       const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
//       let warning = '';
//       if (daysLeft <= 2) warning = '⚠️ Due soon!';
//       else if (daysLeft <= 7) warning = '📅 Due this week';
//       else warning = `📅 ${daysLeft} days left`;
      
//       return {
//         ...assignment,
//         daysLeft,
//         warning
//       };
//     });

//     // 6. Overall Performance Summary
//     const overallProgress = {
//       assignmentsComplete: totalAssignments > 0 ? (submittedCount / totalAssignments) * 100 : 0,
//       assignmentsApproved: submittedCount > 0 ? (approvedCount / submittedCount) * 100 : 0,
//       feePaid: paymentProgress,
//       message: getOverallMessage(paymentProgress, submittedCount, totalAssignments, approvedCount)
//     };

//     return NextResponse.json({
//       success: true,
//       profile: {
//         name: studentProfile?.fullName || "Student",
//         rollNo: studentProfile?.rollNo || "N/A",
//         city: studentProfile?.city || "Not Specified",
//         courseName: studentProfile?.targetCourse || "General Course",
//         email: studentProfile?.email,
//         phone: studentProfile?.phone,
//         photoUrl: photoUrl  // 👈 ADD PHOTO URL
//       },
//       stats: {
//         total: totalAssignments,
//         submitted: submittedCount,
//         approved: approvedCount,
//         pendingReview: submissions.filter((s) => s.status === "pending").length,
//         rejected: rejectedCount,
//         pendingAssignment: pendingCount
//       },
//       feeSummary: {
//         totalAmount: totalFeeAmount,
//         paidAmount: totalPaidAmount,
//         remainingAmount: remainingAmount,
//         paymentProgress: paymentProgress.toFixed(1),
//         paidMonths,
//         partialMonths,
//         unpaidMonths,
//         overdueMonths,
//         totalMonths: feeRecords.length
//       },
//       feeDetails,
//       feeRecommendations,
//       assignmentRecommendations,
//       chartData: chartData,
//       upcomingWork: upcomingWorkWithWarnings,
//       fees: feeDetails,
//       overallProgress,
//       lastUpdated: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error("Dashboard Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: "Internal Error",
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // Helper function for overall message
// function getOverallMessage(paymentProgress, submittedCount, totalAssignments, approvedCount) {
//   if (paymentProgress === 100 && submittedCount === totalAssignments && approvedCount === submittedCount) {
//     return "🏆 Excellent performance! All fees paid and assignments completed!";
//   } else if (paymentProgress === 100) {
//     return "💰 All fees paid! Focus on completing pending assignments.";
//   } else if (submittedCount === totalAssignments) {
//     return "📚 All assignments submitted! Clear your pending fees.";
//   } else if (paymentProgress > 50 && submittedCount > totalAssignments / 2) {
//     return "👍 Good progress! Keep going on both fees and assignments.";
//   } else if (paymentProgress === 0 && submittedCount === 0) {
//     return "📢 Start your journey! Pay fees and submit assignments.";
//   } else {
//     return "📌 You're on track! Complete pending tasks to stay ahead.";
//   }
// }













import dbConnect from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import User from "@/models/User";
import Fee from "@/models/Fee";
import StudentIDCard from "@/models/StudentIDCard";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const className = searchParams.get("className");

    if (!studentId || !className) {
      return NextResponse.json(
        { success: false, message: "Missing params" },
        { status: 400 }
      );
    }

    // Convert ID safely
    let validStudentId;
    try {
      validStudentId = new mongoose.Types.ObjectId(studentId);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid Student ID" }, { status: 400 });
    }

    // 1. Fetch Profile, ID Card (with photo), and Fees
    const [studentProfile, idCard, feeRecords] = await Promise.all([
      User.findById(studentId).select("rollNo className section fatherName name email phone photoUrl city targetCourse").lean(),
      StudentIDCard.findOne({ studentId: validStudentId }).populate('studentId', 'photoUrl name').lean(),
      Fee.find({ studentId: validStudentId }).populate('studentId').sort({ dueDate: -1 }).lean()
    ]);

   

    // Extract photo URL from ID card or User profile
    let photoUrl = null;
    if (idCard?.studentId?.photoUrl) {
      photoUrl = idCard.studentId.photoUrl;
    } else if (studentProfile?.photoUrl) {
      photoUrl = studentProfile.photoUrl;
    }

    // Calculate Fee Summary
    let totalFeeAmount = 0;
    let totalPaidAmount = 0;
    let paidMonths = 0;
    let partialMonths = 0;
    let unpaidMonths = 0;
    let overdueMonths = 0;
    
    const feeDetails = feeRecords.map(fee => {
      const paidAmount = fee.amountPaid || 0;
      const remainingAmount = fee.amount - paidAmount - (fee.discount || 0);
      const isOverdue = fee.dueDate && new Date(fee.dueDate) < new Date() && fee.status !== 'paid';
      
      totalFeeAmount += fee.amount;
      totalPaidAmount += paidAmount;
      
      if (fee.status === 'paid') paidMonths++;
      else if (fee.status === 'partially-paid') partialMonths++;
      else if (isOverdue) overdueMonths++;
      else if (fee.status === 'unpaid') unpaidMonths++;
      
      return {
        id: fee._id,
        month: fee.month,
        amount: fee.amount,
        amountPaid: paidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        status: fee.status,
        dueDate: fee.dueDate,
        paymentDate: fee.paymentDate,
        discount: fee.discount || 0,
        isOverdue: isOverdue,
        paymentMethod: fee.paymentMethod,
        collectedBy: fee.collectedByName || fee.collectedBy
      };
    });
    
    const remainingAmount = totalFeeAmount - totalPaidAmount;
    const paymentProgress = totalFeeAmount > 0 ? (totalPaidAmount / totalFeeAmount) * 100 : 0;
    
    // Generate Fee Recommendations
    const feeRecommendations = [];
    if (remainingAmount > 0) {
      if (overdueMonths > 0) {
        feeRecommendations.push(`⚠️ You have ${overdueMonths} overdue month(s). Please clear pending fees immediately to avoid late fees.`);
      }
      if (partialMonths > 0) {
        feeRecommendations.push(`💰 You have ${partialMonths} partially paid month(s). Remaining amount: PKR ${(feeRecords.filter(f => f.status === 'partially-paid').reduce((sum, f) => sum + (f.amount - (f.amountPaid || 0)), 0)).toLocaleString()}`);
      }
      if (unpaidMonths > 0) {
        feeRecommendations.push(`📌 You have ${unpaidMonths} unpaid month(s). Please pay before due date.`);
      }
      feeRecommendations.push(`💡 Total pending amount: PKR ${remainingAmount.toLocaleString()}. Visit fee counter to pay.`);
    } else {
      feeRecommendations.push(`✅ Great! All your fees are paid. Thank you!`);
    }

    // 2. Fetch Assignments Stats
    const totalAssignments = await Assignment.countDocuments({ targetClass: className });
    
    // 3. Fetch Submissions
    const submissions = await Submission.find({ studentId: validStudentId }).lean();
    
    // Calculate assignment recommendations
    const submittedCount = submissions.length;
    const pendingCount = totalAssignments - submittedCount;
    const approvedCount = submissions.filter(s => s.status === "approved").length;
    const rejectedCount = submissions.filter(s => s.status === "rejected").length;
    
    const assignmentRecommendations = [];
    if (pendingCount > 0) {
      assignmentRecommendations.push(`📚 You have ${pendingCount} pending assignment(s). Submit them before due date.`);
    }
    if (rejectedCount > 0) {
      assignmentRecommendations.push(`📝 ${rejectedCount} assignment(s) need revision. Check feedback and resubmit.`);
    }
    if (approvedCount > 0 && pendingCount === 0) {
      assignmentRecommendations.push(`🎉 Excellent! All assignments completed. Keep it up!`);
    }

    // 4. Generate Chart Data (Monthly Trend)
    const analytics = await Submission.aggregate([
      { $match: { studentId: validStudentId } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let chartData = analytics.map(item => ({
      name: monthNames[item._id.month - 1],
      value: item.count
    }));

    if (chartData.length === 0) {
      chartData = [{ name: "No Data", value: 0 }]; 
    }

    // 5. Upcoming Work Logic
    const submittedIds = new Set(submissions.map((s) => s.assignmentId?.toString()));
    const upcomingWork = await Assignment.find({ 
      targetClass: className,
      _id: { $nin: Array.from(submittedIds) }
    })
    .sort({ dueDate: 1 })
    .limit(5)
    .lean();

    // Add due date warnings to upcoming work
    const today = new Date();
    const upcomingWorkWithWarnings = upcomingWork.map(assignment => {
      const dueDate = new Date(assignment.dueDate);
      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      let warning = '';
      if (daysLeft <= 2) warning = '⚠️ Due soon!';
      else if (daysLeft <= 7) warning = '📅 Due this week';
      else warning = `📅 ${daysLeft} days left`;
      
      return {
        ...assignment,
        daysLeft,
        warning
      };
    });

    // 6. Overall Performance Summary
    const overallProgress = {
      assignmentsComplete: totalAssignments > 0 ? (submittedCount / totalAssignments) * 100 : 0,
      assignmentsApproved: submittedCount > 0 ? (approvedCount / submittedCount) * 100 : 0,
      feePaid: paymentProgress,
      message: getOverallMessage(paymentProgress, submittedCount, totalAssignments, approvedCount)
    };

    // ✅ FIXED: Use correct field names from database
    return NextResponse.json({
      success: true,
      profile: {
        name: studentProfile?.name || studentProfile?.fullName || "Student",  // ✅ Fixed
        rollNo: studentProfile?.rollNo || "N/A",
        city: studentProfile?.city || "Not Specified",
        className: studentProfile?.className || "N/A",
        section: studentProfile?.section || "N/A",
        fatherName: studentProfile?.fatherName || "N/A",
        email: studentProfile?.email || null,
        phone: studentProfile?.phone || null,
        photoUrl: photoUrl  // ✅ Photo URL from ID card or User
      },
      stats: {
        total: totalAssignments,
        submitted: submittedCount,
        approved: approvedCount,
        pendingReview: submissions.filter((s) => s.status === "pending").length,
        rejected: rejectedCount,
        pendingAssignment: pendingCount
      },
      feeSummary: {
        totalAmount: totalFeeAmount,
        paidAmount: totalPaidAmount,
        remainingAmount: remainingAmount,
        paymentProgress: paymentProgress.toFixed(1),
        paidMonths,
        partialMonths,
        unpaidMonths,
        overdueMonths,
        totalMonths: feeRecords.length
      },
      feeDetails,
      feeRecommendations,
      assignmentRecommendations,
      chartData: chartData,
      upcomingWork: upcomingWorkWithWarnings,
      fees: feeDetails,
      overallProgress,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Error",
      error: error.message 
    }, { status: 500 });
  }
}

// Helper function for overall message
function getOverallMessage(paymentProgress, submittedCount, totalAssignments, approvedCount) {
  if (paymentProgress === 100 && submittedCount === totalAssignments && approvedCount === submittedCount) {
    return "🏆 Excellent performance! All fees paid and assignments completed!";
  } else if (paymentProgress === 100) {
    return "💰 All fees paid! Focus on completing pending assignments.";
  } else if (submittedCount === totalAssignments) {
    return "📚 All assignments submitted! Clear your pending fees.";
  } else if (paymentProgress > 50 && submittedCount > totalAssignments / 2) {
    return "👍 Good progress! Keep going on both fees and assignments.";
  } else if (paymentProgress === 0 && submittedCount === 0) {
    return "📢 Start your journey! Pay fees and submit assignments.";
  } else {
    return "📌 You're on track! Complete pending tasks to stay ahead.";
  }
}