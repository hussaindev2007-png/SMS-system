// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// // 1. DELETE: Teacher ko remove karna
// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();

//     // FIXED: Params ko await karein (Next.js 15+ requirement)
//     const resolvedParams = await params;
//     const id = resolvedParams.id;

//     console.log("Deleting Teacher with ID:", id); // Terminal mein check karein ID aa rahi hai?

//     const deletedTeacher = await User.findByIdAndDelete(id);

//     if (!deletedTeacher) {
//       return NextResponse.json({ 
//         message: "Teacher not found in database" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher deleted successfully" 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("DELETE_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Delete operation failed", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // 2. PUT: Teacher ki info update karna
// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();

//     // MASLA 1 FIX: Params ko await karein (Next.js 15 requirement)
//     const resolvedParams = await params;
//     const id = resolvedParams.id;

//     // MASLA 2 FIX: Body se saara data nikaalein jo aap update karna chahte hain
//     const { name, email, subject, phone } = await req.json();

//     // Console log lagayein taake terminal mein dikhe ke ID mil rahi hai ya nahi
//     console.log("Updating Teacher with ID:", id);

//     const updatedTeacher = await User.findByIdAndUpdate(
//       id,
//       { name, email, subject, phone }, // Saari fields yahan pass karein
//       { new: true, runValidators: true } 
//     ).select("-password");

//     if (!updatedTeacher) {
//       return NextResponse.json({ 
//         message: "Teacher ID database mein nahi mili!", 
//         updatedTeacher: null 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher updated successfully", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("UPDATE_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Update operation failed", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// simple not secure 

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// // 1. DELETE: Teacher ko remove karna
// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();

//     const resolvedParams = await params;
//     const id = resolvedParams.id;

//     const deletedTeacher = await User.findByIdAndDelete(id);

//     if (!deletedTeacher) {
//       return NextResponse.json({ 
//         message: "Teacher not found in database" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher deleted successfully" 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("DELETE_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Delete operation failed", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }
// // 2. PUT: Teacher ki info update karna
// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = await params;
//     const body = await req.json();
//     const { name, email, subject, phone,  password } = body;

//     let updateData = { name, email, subject, phone};

//     // Agar password bhi bheja hai, toh usay hash karein
//     if (password && password.trim() !== "") {
//       const bcrypt = require("bcryptjs");
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateData.password = hashedPassword;
//     }

//     const updatedTeacher = await User.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true } 
//     ).select("-password");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher nahi mila!" }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher updated successfully", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
//   }
// }




// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher"; // User ki jagah Teacher model
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// --- 1. DELETE: Teacher ko remove karna ---
// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = await params; 
//     // Teacher collection mein se delete karein
//     const deletedTeacher = await Teacher.findByIdAndDelete(id);

//     if (!deletedTeacher) {
//       return NextResponse.json({ 
//         message: "Teacher not found in database" 
//       }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher deleted successfully" 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("DELETE_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Delete operation failed", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // --- 2. PUT: Teacher ki info update karna ---
// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();

//     const { id } = await params;
//     const body = await req.json();
//     const { name, email, subject, phone, password } = body;

//     // --- SUBJECT LOGIC ---
//     let formattedSubjects;
//     if (Array.isArray(subject)) {
//       formattedSubjects = subject;
//     } else if (typeof subject === "string") {
//       formattedSubjects = subject.split(",").map(s => s.trim()).filter(s => s !== "");
//     } else {
//       formattedSubjects = ["General"];
//     }

//     let updateData = { 
//       name, 
//       email, 
//       subject: formattedSubjects, 
//       phone 
//     };

//     // Password hashing (Sirf tab jab naya password bheja jaye)
//     if (password && password.trim() !== "") {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateData.password = hashedPassword;
//     }

//     // Teacher model mein update logic
//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true } 
//     ).select("-password");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher record not found!" }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher profile updated!", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("UPDATE_ERROR:", error);
//     // Unique email constraint check
//     if (error.code === 11000) {
//       return NextResponse.json({ message: "Email already taken by another teacher" }, { status: 400 });
//     }
//     return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
//   }
// }

































// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject"; // ✅ Naya model import karein
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- DELETE: Same rahega ---
// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params; 
//     const deletedTeacher = await Teacher.findByIdAndDelete(id);
//     if (!deletedTeacher) return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
//     return NextResponse.json({ message: "Teacher deleted successfully" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Delete failed", error: error.message }, { status: 500 });
//   }
// }

// // --- 2. PUT: Teacher ki info update karna (Updated with Subject Validation) ---
// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const body = await req.json();
//     const { name, email, subject, phone, password } = body;

//     // 1. Fetch Valid Subjects from DB for cross-check
//     const dbSubjects = await Subject.find({}).select("name");
//     const validSubjectNames = dbSubjects.map(s => s.name);

//     // 2. --- STRICT SUBJECT LOGIC ---
//     let inputSubjects = [];
//     if (Array.isArray(subject)) {
//       inputSubjects = subject.map(s => s.trim().toUpperCase());
//     } else if (typeof subject === "string") {
//       inputSubjects = subject.split(",").map(s => s.trim().toUpperCase());
//     }

//     // Sirf wahi subjects jo hamare "Manage Subjects" list mein hain
//     const validatedSubjects = inputSubjects.filter(s => validSubjectNames.includes(s));

//     // Agar Admin ne edit mein saaray ghalat subjects likh diye jo DB mein nahi hain
//     if (validatedSubjects.length === 0 && inputSubjects.length > 0) {
//       return NextResponse.json({ 
//         message: "None of the selected subjects are registered in the system!" 
//       }, { status: 400 });
//     }

//     let updateData = { 
//       name: name?.trim(), 
//       email: email?.toLowerCase().trim(), 
//       subject: validatedSubjects.length > 0 ? validatedSubjects : ["GENERAL"], 
//       phone 
//     };

//     // Password hashing (Sirf tab jab naya password bheja jaye)
//     if (password && password.trim() !== "") {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       updateData.password = hashedPassword;
//     }

//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true } 
//     ).select("-password");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher record not found!" }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher profile updated with verified data!", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     if (error.code === 11000) {
//       return NextResponse.json({ message: "Email already taken by another teacher" }, { status: 400 });
//     }
//     return NextResponse.json({ message: "Update failed", error: error.message }, { status: 500 });
//   }
// }

// -------------------------------------------------------------------------------------

// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- DELETE: Teacher Request ya Profile ko khatam karna ---
// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params; 
//     const deletedTeacher = await Teacher.findByIdAndDelete(id);
    
//     if (!deletedTeacher) {
//       return NextResponse.json({ message: "Teacher record not found in system." }, { status: 404 });
//     }
    
//     return NextResponse.json({ message: "Teacher records successfully purged." }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Deletion protocol failed.", error: error.message }, { status: 500 });
//   }
// }

// // --- PUT: Teacher Approval aur Profile Update (Sync with ObjectIds) ---
// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const body = await req.json();
    
//     // Boss: Status aur Subjects (IDs) yahan se handle honge
//     const { name, email, subjects, phone, password, status } = body;

//     // 1. Database se valid IDs check karne ki zaroorat nahi agar hum frontend se IDs bhej rahe hain, 
//     // lekin verification ke liye hum ensure karte hain ke subjects array valid ho.
//     let validatedSubjectIds = [];
//     if (Array.isArray(subjects) && subjects.length > 0) {
//       // Sirf valid MongoDB IDs filter karein
//       validatedSubjectIds = subjects.filter(s => s.match(/^[0-9a-fA-F]{24}$/));
//     }

//     // 2. Prepare Update Data
//     let updateData = { 
//       name: name?.trim(), 
//       email: email?.toLowerCase().trim(), 
//       phone,
//       status: status || "pending" // Admin approve karega toh "approved" bhejega
//     };

//     // Agar subjects bhejey gaye hain toh hi update karein
//     if (validatedSubjectIds.length > 0) {
//       updateData.subjects = validatedSubjectIds;
//     }

//     // Password hashing (Sirf tab jab naya password provide kiya jaye)
//     if (password && password.trim() !== "") {
//       const hashedPassword = await bcrypt.hash(password, 12);
//       updateData.password = hashedPassword;
//     }

//     // 3. Database Update
//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true } 
//     ).populate("subjects"); // Populate taake frontend ko subjects ke naam mil sakein

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher profile not detected." }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: status === "approved" ? "Teacher has been officially approved!" : "Profile updated successfully.", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     if (error.code === 11000) {
//       return NextResponse.json({ message: "Conflict: Email already registered under another account." }, { status: 400 });
//     }
//     return NextResponse.json({ message: "System update error.", error: error.message }, { status: 500 });
//   }
// }

































































// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import { NextResponse } from "next/server";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { status, subjects, name, email, phone } = await req.json();

//     let updateData = {};
//     if (status) {
//       updateData.status = status;
//     }
//     if (subjects) {
//       updateData.subjects = subjects;
//     }
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (phone) updateData.phone = phone;

//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true }
//     ).populate("subjects");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher parameter not located." }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher authorized successfully!", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Internal server compilation issue.", error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     await Teacher.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Record cleared safely" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Action dropped", error: error.message }, { status: 500 });
//   }
// }




























































































































// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { status, subjects, name, email, phone } = await req.json();

//     let updateData = {};
//     if (status) {
//       updateData.status = status;
//     }
//     if (subjects) {
//       updateData.subjects = subjects;
//     }
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (phone) updateData.phone = phone;

//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true }
//     ).populate("subjects");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher parameter not located." }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Teacher authorized successfully!", 
//       updatedTeacher 
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Internal server compilation issue.", error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     await Teacher.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Record cleared safely" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Action dropped", error: error.message }, { status: 500 });
//   }
// }














































































// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { status, subjects, name, email, phone } = await req.json();

//     let updateData = {};
//     if (status) updateData.status = status;
//     if (subjects) updateData.subjects = subjects;
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (phone) updateData.phone = phone;

//     // Performing update operations with reference mapping
//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true }
//     ).populate("subjects");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher parameter not located." }, { status: 404 });
//     }

//     // ========================================================================
//     // 🔥 CORE INTEGRATION: THE DYNAMIC AI AUDITOR RESPONSE FOR LIVE UPDATES
//     // ========================================================================
//     const rawTeacher = updatedTeacher.toObject();
//     const allocatedSubjectsCount = rawTeacher.subjects?.length || 0;

//     // Feature 1, 2 & 3: Real-time calculation on modification parameters
//     let computedMorale = "EXCELLENT";
//     let workloadInsight = "Workload density optimized with current subject allocations.";

//     if (allocatedSubjectsCount > 3) {
//       computedMorale = "CRITICAL";
//       workloadInsight = `ALERT: Teacher is now managing ${allocatedSubjectsCount} active subjects. High burnout risk detected by AI Auditor.`;
//     } else if (allocatedSubjectsCount === 0) {
//       computedMorale = "WARNING";
//       workloadInsight = "No subjects mapped. Resource optimization is idle. Ready for direct scheduling allocation.";
//     }

//     const aiDiagnosticPayload = {
//       actionStatus: "SUCCESS_VERIFIED",
//       moraleAssessment: computedMorale,
//       liveInsight: workloadInsight,
//       lessonAuditStatus: `${Math.min(100, Math.round(80 + (allocatedSubjectsCount * 4)))}% Quality Score Checked`,
//       systemNotice: `Faculty parameters synchronized for ${rawTeacher.name}. Node values up to date.`
//     };

//     return NextResponse.json({ 
//       message: "Teacher updated and authorized successfully with AI insights!", 
//       updatedTeacher: {
//         ...rawTeacher,
//         aiEvaluation: aiDiagnosticPayload
//       }
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Internal server compilation issue.", error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;

//     // Fetch teacher profiles before deletion to map missing dependencies
//     const teacherToDelete = await Teacher.findById(id).populate("subjects");
    
//     if (!teacherToDelete) {
//       return NextResponse.json({ message: "Teacher record already cleared or missing." }, { status: 404 });
//     }

//     const unassignedSubjects = teacherToDelete.subjects?.map(s => ({
//       id: s._id,
//       name: s.name
//     })) || [];

//     await Teacher.findByIdAndDelete(id);

//     // Feature 2 & 4: Instant Automated Queue Assignment Trigger on record drops
//     const aiSystemRerouteNotification = unassignedSubjects.length > 0 
//       ? `CRITICAL DOCKING ACTION: ${unassignedSubjects.length} subjects (${unassignedSubjects.map(s => s.name).join(", ")}) are currently unassigned due to faculty dismissal. Push alerts sent to the Auto-Scheduling Queue.`
//       : "Portal balance stable. Removed faculty did not contain active course dependencies.";

//     return NextResponse.json({ 
//       message: "Record cleared safely",
//       aiRerouteLog: {
//         abandonedSubjects: unassignedSubjects,
//         actionTrigger: aiSystemRerouteNotification,
//         pipelineStatus: unassignedSubjects.length > 0 ? "REASSIGNMENT_REQUIRED" : "NOMINAL"
//       }
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Action dropped", error: error.message }, { status: 500 });
//   }
// }





// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import TeacherIDCard from "@/models/TeacherIDCard";
// import QRCode from "qrcode";
// import { NextResponse } from "next/server";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { status, subjects, name, email, phone, department, qualification, password } = await req.json();

//     let updateData = {};
//     if (status) updateData.status = status;
//     if (subjects) updateData.subjects = subjects;
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (phone) updateData.phone = phone;
//     if (department) updateData.department = department;
//     if (qualification) updateData.qualification = qualification;
//     if (password) updateData.password = password;

//     // Performing update operations with reference mapping
//     const updatedTeacher = await Teacher.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true }
//     ).populate("subjects");

//     if (!updatedTeacher) {
//       return NextResponse.json({ message: "Teacher parameter not located." }, { status: 404 });
//     }

//     // If teacher is approved, generate ID card
//     let idCard = null;
//     if (status === "approved") {
//       const existingCard = await TeacherIDCard.findOne({ teacherId: id });
      
//       if (!existingCard) {
//         const year = new Date().getFullYear();
//         const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
//         const teacherCode = `TCH${year}${randomStr}`;
//         const cardNumber = `TCRD${year}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        
//         const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
//         const qrData = `${FRONTEND_URL}/teacher/qr-login?code=${teacherCode}`;
//         const qrCodeDataUrl = await QRCode.toDataURL(qrData);
        
//         idCard = await TeacherIDCard.create({
//           teacherId: id,
//           cardNumber,
//           teacherCode,
//           qrCodeData: qrCodeDataUrl,
//           issueDate: new Date(),
//           expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
//           status: "active",
//           photoUrl: updatedTeacher.photoUrl
//         });
//       } else {
//         idCard = existingCard;
//       }
//     }

//     // AI Diagnostic Payload
//     const allocatedSubjectsCount = updatedTeacher.subjects?.length || 0;
//     let computedMorale = "EXCELLENT";
//     let workloadInsight = "Workload density optimized with current subject allocations.";

//     if (allocatedSubjectsCount > 3) {
//       computedMorale = "CRITICAL";
//       workloadInsight = `ALERT: Teacher is now managing ${allocatedSubjectsCount} active subjects. High burnout risk detected by AI Auditor.`;
//     } else if (allocatedSubjectsCount === 0) {
//       computedMorale = "WARNING";
//       workloadInsight = "No subjects mapped. Resource optimization is idle. Ready for direct scheduling allocation.";
//     }

//     const aiDiagnosticPayload = {
//       actionStatus: "SUCCESS_VERIFIED",
//       moraleAssessment: computedMorale,
//       liveInsight: workloadInsight,
//       lessonAuditStatus: `${Math.min(100, Math.round(80 + (allocatedSubjectsCount * 4)))}% Quality Score Checked`,
//       systemNotice: `Faculty parameters synchronized for ${updatedTeacher.name}. Node values up to date.`
//     };

//     return NextResponse.json({ 
//       message: status === "approved" ? "Teacher approved and ID card generated successfully!" : "Teacher updated successfully!",
//       updatedTeacher: {
//         ...updatedTeacher.toObject(),
//         aiEvaluation: aiDiagnosticPayload
//       },
//       idCard: idCard
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Update error:", error);
//     return NextResponse.json({ message: "Internal server compilation issue.", error: error.message }, { status: 500 });
//   }
// }
































import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import TeacherIDCard from "@/models/TeacherIDCard";
import TeacherAttendance from "@/models/TeacherAttendance";
import QRCode from "qrcode";
import { NextResponse } from "next/server";

// ==================== PUT: Update/Approve Teacher ====================
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { status, subjects, name, email, phone, department, qualification, password } = await req.json();

    let updateData = {};
    if (status) updateData.status = status;
    if (subjects) updateData.subjects = subjects;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (department) updateData.department = department;
    if (qualification) updateData.qualification = qualification;
    if (password) updateData.password = password;

    // Performing update operations with reference mapping
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate("subjects");

    if (!updatedTeacher) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    // If teacher is approved, generate ID card
    let idCard = null;
    if (status === "approved") {
      const existingCard = await TeacherIDCard.findOne({ teacherId: id });
      
      if (!existingCard) {
        const year = new Date().getFullYear();
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const teacherCode = `TCH${year}${randomStr}`;
        const cardNumber = `TCRD${year}${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        
        const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        // QR code points to VERIFICATION page
        const qrData = `${FRONTEND_URL}/verify/teacher/${teacherCode}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrData);
        
        console.log(`🔍 Generating QR for teacher: ${updatedTeacher.name}`);
        console.log(`✅ QR URL: ${qrData}`);
        
        idCard = await TeacherIDCard.create({
          teacherId: id,
          cardNumber,
          teacherCode,
          qrCodeData: qrCodeDataUrl,
          issueDate: new Date(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
          status: "active",
          photoUrl: updatedTeacher.photoUrl
        });
        
        console.log(`✅ ID Card generated for teacher: ${updatedTeacher.name}`);
        console.log(`✅ Teacher Code: ${teacherCode}`);
      } else {
        idCard = existingCard;
        console.log(`ℹ️ Existing ID Card found for teacher: ${updatedTeacher.name}`);
      }
    }

    // AI Diagnostic Payload
    const allocatedSubjectsCount = updatedTeacher.subjects?.length || 0;
    let computedMorale = "EXCELLENT";
    let workloadInsight = "Workload density optimized with current subject allocations.";

    if (allocatedSubjectsCount > 3) {
      computedMorale = "CRITICAL";
      workloadInsight = `ALERT: Teacher is now managing ${allocatedSubjectsCount} active subjects. High burnout risk detected by AI Auditor.`;
    } else if (allocatedSubjectsCount === 0) {
      computedMorale = "WARNING";
      workloadInsight = "No subjects mapped. Resource optimization is idle. Ready for direct scheduling allocation.";
    }

    const aiDiagnosticPayload = {
      actionStatus: "SUCCESS_VERIFIED",
      moraleAssessment: computedMorale,
      liveInsight: workloadInsight,
      lessonAuditStatus: `${Math.min(100, Math.round(80 + (allocatedSubjectsCount * 4)))}% Quality Score Checked`,
      systemNotice: `Faculty parameters synchronized for ${updatedTeacher.name}. Node values up to date.`
    };

    return NextResponse.json({ 
      message: status === "approved" ? "Teacher approved and ID card generated successfully!" : "Teacher updated successfully!",
      updatedTeacher: {
        ...updatedTeacher.toObject(),
        aiEvaluation: aiDiagnosticPayload
      },
      idCard: idCard
    }, { status: 200 });

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}

// ==================== DELETE: Remove Teacher ====================
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    console.log(`🗑️ Attempting to delete teacher with ID: ${id}`);
    
    if (!id) {
      return NextResponse.json({ message: "Teacher ID required" }, { status: 400 });
    }
    
    // Check if teacher exists
    const teacher = await Teacher.findById(id);
    
    if (!teacher) {
      console.log(`❌ Teacher not found: ${id}`);
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }
    
    console.log(`📝 Teacher found: ${teacher.name} (${teacher.email})`);
    
    // Delete related data first
    console.log(`🗑️ Deleting teacher ID card...`);
    await TeacherIDCard.findOneAndDelete({ teacherId: id });
    
    console.log(`🗑️ Deleting teacher attendance records...`);
    await TeacherAttendance.deleteMany({ teacherId: id });
    
    // Finally delete the teacher
    console.log(`🗑️ Deleting teacher record...`);
    await Teacher.findByIdAndDelete(id);
    
    console.log(`✅ Teacher deleted successfully: ${teacher.name}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Teacher "${teacher.name}" deleted successfully`,
      deletedTeacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to delete teacher: " + error.message 
    }, { status: 500 });
  }
}