import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Fee from "@/models/Fee";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import StudentIDCard from "@/models/StudentIDCard";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type") || "full"; // full, fee, assignment, attendance
    const month = searchParams.get("month");
    const year = searchParams.get("year") || new Date().getFullYear();

    if (!studentId) {
      return NextResponse.json(
        { success: false, message: "Student ID required" },
        { status: 400 }
      );
    }

    let validStudentId;
    try {
      validStudentId = new mongoose.Types.ObjectId(studentId);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid Student ID" }, { status: 400 });
    }

    // Fetch student profile
    const studentProfile = await User.findById(studentId).select(
      "name rollNo className section fatherName motherName email phone address city photoUrl targetCourse"
    ).lean();

    if (!studentProfile) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    // Fetch ID card
    const idCard = await StudentIDCard.findOne({ studentId: validStudentId }).lean();

    // Fetch fee records
    const feeRecords = await Fee.find({ studentId: validStudentId })
      .sort({ dueDate: -1 })
      .lean();

    // Fetch assignments and submissions
    const className = studentProfile.className;
    const assignments = await Assignment.find({ targetClass: className })
      .sort({ dueDate: -1 })
      .lean();

    const submissions = await Submission.find({ studentId: validStudentId }).lean();
    const submittedIds = new Set(submissions.map(s => s.assignmentId?.toString()));

    // Calculate fee summary
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
        month: fee.month,
        amount: fee.amount,
        paidAmount: paidAmount,
        remainingAmount: Math.max(0, remainingAmount),
        status: fee.status,
        dueDate: fee.dueDate,
        paymentDate: fee.paymentDate,
        isOverdue: isOverdue,
        collectedBy: fee.collectedByName || fee.collectedBy,
        paymentMethod: fee.paymentMethod
      };
    });

    // Assignment summary
    let totalAssignments = assignments.length;
    let submittedCount = submissions.length;
    let pendingCount = totalAssignments - submittedCount;
    let approvedCount = submissions.filter(s => s.status === "approved").length;
    let rejectedCount = submissions.filter(s => s.status === "rejected").length;
    let pendingReviewCount = submissions.filter(s => s.status === "pending").length;

    const assignmentDetails = assignments.map(assignment => {
      const submission = submissions.find(s => s.assignmentId?.toString() === assignment._id.toString());
      return {
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        status: submission ? submission.status : "not_submitted",
        submittedDate: submission?.createdAt,
        marks: submission?.marks,
        feedback: submission?.feedback,
        grade: submission?.grade
      };
    });

    // Filter by month/year if provided
    let filteredFees = feeDetails;
    if (month && year) {
      filteredFees = feeDetails.filter(fee => {
        const feeDate = new Date(fee.dueDate);
        return feeDate.getMonth() + 1 === parseInt(month) && feeDate.getFullYear() === parseInt(year);
      });
    }

    // Prepare report data based on type
    let reportData = {};

    switch (type) {
      case "fee":
        reportData = {
          type: "fee",
          title: "Fee Report",
          summary: {
            totalAmount: totalFeeAmount,
            paidAmount: totalPaidAmount,
            remainingAmount: totalFeeAmount - totalPaidAmount,
            paymentProgress: totalFeeAmount > 0 ? ((totalPaidAmount / totalFeeAmount) * 100).toFixed(1) : 0,
            paidMonths,
            partialMonths,
            unpaidMonths,
            overdueMonths,
            totalMonths: feeRecords.length
          },
          records: filteredFees
        };
        break;

      case "assignment":
        reportData = {
          type: "assignment",
          title: "Assignment Report",
          summary: {
            total: totalAssignments,
            submitted: submittedCount,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
            pendingReview: pendingReviewCount,
            completionRate: totalAssignments > 0 ? ((submittedCount / totalAssignments) * 100).toFixed(1) : 0,
            approvalRate: submittedCount > 0 ? ((approvedCount / submittedCount) * 100).toFixed(1) : 0
          },
          records: assignmentDetails
        };
        break;

      case "full":
      default:
        reportData = {
          type: "full",
          title: "Complete Student Report",
          student: {
            name: studentProfile.name,
            rollNo: studentProfile.rollNo,
            className: studentProfile.className,
            section: studentProfile.section,
            fatherName: studentProfile.fatherName,
            motherName: studentProfile.motherName,
            email: studentProfile.email,
            phone: studentProfile.phone,
            address: studentProfile.address,
            city: studentProfile.city,
            courseName: studentProfile.targetCourse,
            cardNumber: idCard?.cardNumber || "N/A",
            issueDate: idCard?.issueDate,
            expiryDate: idCard?.expiryDate
          },
          fee: {
            summary: {
              totalAmount: totalFeeAmount,
              paidAmount: totalPaidAmount,
              remainingAmount: totalFeeAmount - totalPaidAmount,
              paymentProgress: totalFeeAmount > 0 ? ((totalPaidAmount / totalFeeAmount) * 100).toFixed(1) : 0,
              paidMonths,
              partialMonths,
              unpaidMonths,
              overdueMonths
            },
            records: feeDetails
          },
          assignment: {
            summary: {
              total: totalAssignments,
              submitted: submittedCount,
              pending: pendingCount,
              approved: approvedCount,
              rejected: rejectedCount,
              completionRate: totalAssignments > 0 ? ((submittedCount / totalAssignments) * 100).toFixed(1) : 0
            },
            records: assignmentDetails.slice(0, 10)
          }
        };
        break;
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      generatedAt: new Date().toISOString(),
      studentId: studentId,
      studentName: studentProfile.name
    });

  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}