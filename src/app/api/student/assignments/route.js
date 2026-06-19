// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("className");

//     // Check agar className bheja hye
//     if (!className) {
//       return NextResponse.json({ message: "Class name is required" }, { status: 400 });
//     }

//     // Sirf us class ke assignments fetch karein jo active hon
//     const assignments = await Assignment.find({ className: className }).sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }














// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("className");

//     // Agar className "undefined" string hye ya khali hye
//     if (!className || className === "undefined") {
//       return NextResponse.json({ message: "Class name is required and must be valid" }, { status: 400 });
//     }

//     // DB mein field ka naam 'targetClass' hye, is liye wahi use karein
//     const assignments = await Assignment.find({ targetClass: className }).sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }















// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose"; // ID conversion ke liye zaroori hye

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("className");
//     const studentId = searchParams.get("studentId");

//     // 1. Strict Validation: Agar data missing hye toh error dein
//     if (!className || className === "undefined" || !studentId || studentId === "undefined") {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing className or studentId pipeline parameters." 
//       }, { status: 400 });
//     }

//     // 2. Fetch Assignments for the specific class
//     const assignments = await Assignment.find({ targetClass: className }).sort({ createdAt: -1 });

//     // 3. Fetch Submissions for this specific student
//     // Note: Agar aapki studentId DB mein ObjectId hye toh mongoose.Types.ObjectId(studentId) use karein
//     const studentSubmissions = await Submission.find({ studentId: studentId });

//     // 4. Data Transformation (Table View ke liye)
//     const dataWithStatus = assignments.map(asgn => {
//       // Find submission for this specific assignment
//       const sub = studentSubmissions.find(s => s.assignmentId.toString() === asgn._id.toString());
      
//       return {
//         _id: asgn._id,
//         title: asgn.title,
//         course: asgn.course || className, // Fallback to class name if course field is missing
//         dueDate: asgn.dueDate,
//         // Screenshot logic: Agar submission nahi hye toh "NOT SUBMITTED"
//         status: sub ? sub.status : "NOT SUBMITTED", 
//         solutionUrl: sub ? sub.solutionUrl : null,
//         feedback: sub ? sub.feedback : "",
//         submittedAt: sub ? sub.createdAt : null
//       };
//     });

//     // 5. Stats Calculation (Top Cards View ke liye)
//     const stats = {
//       total: assignments.length,
//       submitted: studentSubmissions.length,
//       approved: studentSubmissions.filter(s => s.status === 'approved').length,
//       notApproved: studentSubmissions.filter(s => s.status === 'rejected').length
//     };

//     return NextResponse.json({ 
//       success: true, 
//       stats, 
//       data: dataWithStatus 
//     });

//   } catch (error) {
//     console.error("Backend Pipeline Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }












// des













// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("className");
//     const studentId = searchParams.get("studentId");

//     if (!className || className === "undefined" || !studentId || studentId === "undefined") {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing className or studentId pipeline parameters." 
//       }, { status: 400 });
//     }

//     // 1. Fetch Assignments for the specific class
//     const assignments = await Assignment.find({ targetClass: className }).sort({ createdAt: -1 });

//     // 2. Fetch Submissions for this specific student
//     const studentSubmissions = await Submission.find({ studentId });

//     // 3. Data Transformation (Description field lazmi add ki hye modal ke liye)
//     const dataWithStatus = assignments.map(asgn => {
//       const sub = studentSubmissions.find(s => s.assignmentId.toString() === asgn._id.toString());
      
//       return {
//         _id: asgn._id,
//         title: asgn.title,
//         description: asgn.description || "No instructions provided.", // ✅ Ye Eye icon ke modal ke liye zaroori hye
//         course: asgn.course || className,
//         dueDate: asgn.dueDate,
//         status: sub ? sub.status : "NOT SUBMITTED", 
//         solutionUrl: sub ? sub.solutionUrl : null,
//         feedback: sub ? sub.feedback : "",
//         submittedAt: sub ? sub.createdAt : null
//       };
//     });

//     const stats = {
//       total: assignments.length,
//       submitted: studentSubmissions.length,
//       approved: studentSubmissions.filter(s => s.status === 'approved').length,
//       notApproved: studentSubmissions.filter(s => s.status === 'rejected').length
//     };

//     return NextResponse.json({ success: true, stats, data: dataWithStatus });

//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }







// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("className");
//     const studentId = searchParams.get("studentId");

//     if (!className || className === "undefined" || !studentId || studentId === "undefined") {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing className or studentId pipeline parameters." 
//       }, { status: 400 });
//     }

//     const assignments = await Assignment.find({ targetClass: className }).sort({ createdAt: -1 });
//     const studentSubmissions = await Submission.find({ studentId });

//     const dataWithStatus = assignments.map(asgn => {
//       const sub = studentSubmissions.find(s => s.assignmentId.toString() === asgn._id.toString());
      
//       return {
//         _id: asgn._id,
//         title: asgn.title,
//         description: asgn.description || "No instructions provided.",
//         subject: asgn.subject, // ✅ Added Subject
//         teacherName: asgn.teacherName || "Teacher", // ✅ Added Teacher Name
//         dueDate: asgn.dueDate,
//         status: sub ? sub.status : "NOT SUBMITTED", 
//         solutionUrl: sub ? sub.solutionUrl : null,
//         feedback: sub ? sub.feedback : "",
//         submittedAt: sub ? sub.createdAt : null
//       };
//     });

//     const stats = {
//       total: assignments.length,
//       submitted: studentSubmissions.length,
//       approved: studentSubmissions.filter(s => s.status === 'approved').length,
//       notApproved: studentSubmissions.filter(s => s.status === 'rejected' || s.status === 'not approved').length
//     };

//     return NextResponse.json({ success: true, stats, data: dataWithStatus });

//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }










// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("className");
//     const studentId = searchParams.get("studentId");

//     if (!className || className === "undefined" || !studentId || studentId === "undefined") {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing className or studentId parameters." 
//       }, { status: 400 });
//     }

//     const assignments = await Assignment.find({ targetClass: className }).sort({ createdAt: -1 });
//     const studentSubmissions = await Submission.find({ studentId });

//     const dataWithStatus = assignments.map(asgn => {
//       const sub = studentSubmissions.find(s => s.assignmentId.toString() === asgn._id.toString());
      
//       return {
//         _id: asgn._id,
//         title: asgn.title,
//         description: asgn.description || "No instructions provided.",
//         // 👇 FIXED: Use subjectName instead of subject ID
//         subject: asgn.subjectName || asgn.subject || "Unknown",
//         teacherName: asgn.teacherName || "Teacher",
//         dueDate: asgn.dueDate,
//         status: sub ? sub.status : "NOT SUBMITTED", 
//         solutionUrl: sub ? sub.solutionUrl : null,
//         feedback: sub ? sub.feedback : "",
//         submittedAt: sub ? sub.createdAt : null,
//         marks: sub ? sub.marks : null
//       };
//     });

//     const stats = {
//       total: assignments.length,
//       submitted: studentSubmissions.length,
//       approved: studentSubmissions.filter(s => s.status === 'approved').length,
//       notApproved: studentSubmissions.filter(s => s.status === 'rejected' || s.status === 'not approved').length,
//       pending: studentSubmissions.filter(s => s.status === 'pending').length
//     };

//     return NextResponse.json({ success: true, stats, data: dataWithStatus });

//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



















import dbConnect from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Submission from "@/models/Submission";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");  // ✅ Frontend se userId aayega
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "User ID is required" 
      }, { status: 400 });
    }

    // ✅ Get student details to find their class
    const student = await User.findById(userId);
    if (!student) {
      return NextResponse.json({ 
        success: false, 
        message: "Student not found" 
      }, { status: 404 });
    }

    const className = student.className;
    if (!className) {
      return NextResponse.json({ 
        success: false, 
        message: "Student class not assigned. Please contact admin." 
      }, { status: 400 });
    }

    // ✅ Fetch assignments for student's class
    const assignments = await Assignment.find({ 
      targetClass: className 
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);

    // ✅ Get total count for pagination
    const totalAssignments = await Assignment.countDocuments({ targetClass: className });

    // ✅ Get student's submissions
    const submissions = await Submission.find({ studentId: userId });

    // ✅ Merge assignment data with submission status
    const dataWithStatus = assignments.map(assignment => {
      const submission = submissions.find(s => s.assignmentId?.toString() === assignment._id?.toString());
      
      return {
        _id: assignment._id,
        title: assignment.title,
        description: assignment.description || "No instructions provided.",
        subject: assignment.subjectName || assignment.subject || "Unknown",
        teacherName: assignment.teacherName || "Teacher",
        dueDate: assignment.dueDate,
        status: submission ? submission.status : "NOT SUBMITTED",
        solutionUrl: submission ? submission.solutionUrl : null,
        feedback: submission ? submission.feedback : "",
        submittedAt: submission ? submission.createdAt : null,
        marks: submission ? submission.marks : null
      };
    });

    // ✅ Calculate stats
    const stats = {
      total: totalAssignments,
      submitted: submissions.length,
      approved: submissions.filter(s => s.status === 'approved').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
      pending: submissions.filter(s => s.status === 'pending').length
    };

    return NextResponse.json({ 
      success: true, 
      stats, 
      data: dataWithStatus,
      pagination: {
        total: totalAssignments,
        page: page,
        totalPages: Math.ceil(totalAssignments / limit),
        limit: limit
      }
    });

  } catch (error) {
    console.error("GET /api/student/assignments Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}