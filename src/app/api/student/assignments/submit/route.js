// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const { assignmentId, studentId, studentName, solutionUrl, notes } = body;

//     // 1. Basic Validation
//     if (!assignmentId || !studentId || !solutionUrl) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     // 2. Assignment Check (Exist, Lock, and DueDate)
//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) {
//       return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
//     }

//     if (assignment.isLocked) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "This assignment is locked by teacher." 
//       }, { status: 403 });
//     }

//     const now = new Date();
//     if (assignment.dueDate && now > new Date(assignment.dueDate)) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Deadline has passed." 
//       }, { status: 400 });
//     }

//     // 3. Duplicate Check
//     const existing = await Submission.findOne({ assignmentId, studentId });
//     if (existing) {
//       return NextResponse.json({ success: false, message: "Already submitted!" }, { status: 400 });
//     }

//     // 4. Create Submission (Approval logic starts here)
//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName,
//       solutionUrl,
//       notes,
//       submittedAt: now,
//       status: "pending", // Shuruat mein status hamesha pending hoga
//       feedback: ""       // Teacher baad mein feedback add karegi
//     });

//     // 5. Atomic Update: Assignment count increase
//     await Assignment.findByIdAndUpdate(assignmentId, { 
//       $inc: { totalSubmissions: 1 } 
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Solution transmitted to pipeline. Awaiting teacher approval.",
//       data: newSubmission 
//     });

//   } catch (error) {
//     console.error("Submission Sync Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// // --- Isi file mein niche ye add karein ---

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");

//     // Agar studentId nahi mili toh Bad Request (400) bhej do
//     if (!studentId) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Student ID is required" 
//       }, { status: 400 });
//     }

//     // Is student ki saari submissions nikalo
//     const submissions = await Submission.find({ studentId }).select("assignmentId");

//     return NextResponse.json({ 
//       success: true, 
//       data: submissions 
//     });

//   } catch (error) {
//     console.error("Fetch Submission Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// // POST method (Submit karne ke liye) - Ye bilkul theek hye
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const { assignmentId, studentId, studentName, solutionUrl, notes } = body;

//     if (!assignmentId || !studentId || !solutionUrl) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) {
//       return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
//     }

//     if (assignment.isLocked) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "This assignment is locked by teacher." 
//       }, { status: 403 });
//     }

//     const now = new Date();
//     if (assignment.dueDate && now > new Date(assignment.dueDate)) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Deadline has passed." 
//       }, { status: 400 });
//     }

//     const existing = await Submission.findOne({ assignmentId, studentId });
//     if (existing) {
//       return NextResponse.json({ success: false, message: "Already submitted!" }, { status: 400 });
//     }

//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName,
//       solutionUrl,
//       notes,
//       submittedAt: now,
//       status: "pending",
//       feedback: ""
//     });

//     await Assignment.findByIdAndUpdate(assignmentId, { 
//       $inc: { totalSubmissions: 1 } 
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Solution transmitted to pipeline. Awaiting teacher approval.",
//       data: newSubmission 
//     });

//   } catch (error) {
//     console.error("Submission Sync Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // ✅ FIXED GET METHOD (Status aur Feedback lene ke liye)
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const studentId = searchParams.get("studentId");

//     if (!studentId) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Student ID is required" 
//       }, { status: 400 });
//     }

//     // ❌ Purana code: .select("assignmentId") sirf ID lata tha
//     // ✅ Naya code: Pura data layega taake status aur feedback frontend ko mile
//     const submissions = await Submission.find({ studentId }).sort({ createdAt: -1 });

//     return NextResponse.json({ 
//       success: true, 
//       data: submissions 
//     }, {
//       headers: {
//         "Cache-Control": "no-store, max-age=0", // ✅ Force refresh
//       }
//     });

//   } catch (error) {
//     console.error("Fetch Submission Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



















































// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const { assignmentId, studentId, studentName, solutionUrl, notes } = body;

//     // Validation
//     if (!assignmentId || !studentId || !solutionUrl) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) {
//       return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
//     }

//     // Lock Check
//     if (assignment.isLocked) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "This assignment is locked by teacher." 
//       }, { status: 403 });
//     }

//     // Deadline Check
//     const now = new Date();
//     if (assignment.dueDate && now > new Date(assignment.dueDate)) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Deadline has passed. Submission closed." 
//       }, { status: 400 });
//     }

//     // Duplicate Check
//     const existing = await Submission.findOne({ assignmentId, studentId });
//     if (existing) {
//       return NextResponse.json({ success: false, message: "Already submitted!" }, { status: 400 });
//     }

//     // Create Submission
//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName: studentName || "Student",
//       solutionUrl,
//       notes,
//       submittedAt: now,
//       status: "pending",
//       feedback: ""
//     });

//     // Increment Submissions Count
//     await Assignment.findByIdAndUpdate(assignmentId, { 
//       $inc: { totalSubmissions: 1 } 
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Solution transmitted to pipeline. Awaiting teacher approval.",
//       data: newSubmission 
//     });

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }














// pdf










// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";
// import { writeFile, mkdir } from "fs/promises";
// import path from "path";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const formData = await req.formData();
    
//     const assignmentId = formData.get("assignmentId");
//     const studentId = formData.get("studentId");
//     const studentName = formData.get("studentName");
//     const solutionUrl = formData.get("solutionUrl"); 
//     const notes = formData.get("notes");
//     const file = formData.get("file"); // PDF File

//     // 1. Validations
//     if (!assignmentId || !studentId) {
//       return NextResponse.json({ message: "Student or Assignment ID missing" }, { status: 400 });
//     }

//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });

//     // 2. Lock & Deadline Checks
//     if (assignment.isLocked) return NextResponse.json({ success: false, message: "Assignment locked" }, { status: 403 });

//     // 3. File Handling (Multer jesa kaam yahan hoga)
//     let finalPath = solutionUrl || "";

//     if (file && typeof file !== "string") {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       // Folder path create karein (public/uploads)
//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       await mkdir(uploadDir, { recursive: true });

//       // Unique filename banayein
//       const uniqueName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
//       const filePath = path.join(uploadDir, uniqueName);

//       // File system mein save karein
//       await writeFile(filePath, buffer);
      
//       // DB mein save karne ke liye URL
//       finalPath = `/uploads/${uniqueName}`;
//     }

//     // 4. Create Submission
//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName: studentName || "Student",
//       solutionUrl: finalPath,
//       notes,
//       submittedAt: new Date(),
//       status: "pending"
//     });

//     // 5. Update Stats
//     await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalSubmissions: 1 } });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment submitted successfully!",
//       data: newSubmission 
//     });

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


















// cloude


// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const formData = await req.formData();
    
//     const assignmentId = formData.get("assignmentId");
//     const studentId = formData.get("studentId");
//     const studentName = formData.get("studentName");
//     const solutionUrl = formData.get("solutionUrl"); 
//     const notes = formData.get("notes");
//     const file = formData.get("file"); 

//     if (!assignmentId || !studentId) {
//       return NextResponse.json({ message: "Student or Assignment ID missing" }, { status: 400 });
//     }

//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });

//     // 1. Check if locked
//     if (assignment.isLocked) return NextResponse.json({ success: false, message: "Assignment locked" }, { status: 403 });

//     let finalUrl = solutionUrl || "";
//     let cloudinaryPublicId = "";

//     // 2. Cloudinary Upload Logic (FS write delete kar diya)
//     if (file && typeof file !== "string") {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       // Cloudinary ko buffer bhej rahe hain
//       const uploadResponse = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           { 
//             resource_type: "raw", // PDF ke liye 'raw' ya 'auto' zaroori hye
//             folder: "student_submissions" 
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(buffer);
//       });

//       finalUrl = uploadResponse.secure_url;
//       cloudinaryPublicId = uploadResponse.public_id;
//     }

//     // 3. Create Submission with Cloudinary Data
//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName: studentName || "Student",
//       solutionUrl: finalUrl,
//       cloudinaryId: cloudinaryPublicId, // Naya field jo humne schema mein add kiya tha
//       notes,
//       status: "pending",
//       fileType: file ? "pdf" : "link"
//     });

//     // 4. Update Stats
//     await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalSubmissions: 1 } });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment submitted to cloud!",
//       data: newSubmission 
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
//   }
// }














// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const formData = await req.formData();
    
//     const assignmentId = formData.get("assignmentId");
//     const studentId = formData.get("studentId");
//     const studentName = formData.get("studentName");
//     const solutionUrl = formData.get("solutionUrl"); 
//     const notes = formData.get("notes");
//     const file = formData.get("file"); 

//     if (!assignmentId || !studentId) {
//       return NextResponse.json({ message: "Student or Assignment ID missing" }, { status: 400 });
//     }

//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) return NextResponse.json({ message: "Assignment not found" }, { status: 404 });

//     // --- 🟢 UPDATED LOGIC START ---

//     // 1. Manual Lock Check
//     if (assignment.isLocked) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment is locked by the instructor." 
//       }, { status: 403 });
//     }

//     // 2. Automatic Expiry Check (Due Date Logic)
//     const now = new Date();
//     const dueDate = new Date(assignment.dueDate);

//     if (now > dueDate) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Submission blocked: The deadline has already passed!" 
//       }, { status: 403 });
//     }

//     // --- 🔴 UPDATED LOGIC END ---

//     let finalUrl = solutionUrl || "";
//     let cloudinaryPublicId = "";

//     // 3. Cloudinary Upload Logic
//     if (file && typeof file !== "string") {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       // Cloudinary upload stream for PDF/Files
//       const uploadResponse = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           { 
//             resource_type: "raw", 
//             folder: "student_submissions" 
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(buffer);
//       });

//       finalUrl = uploadResponse.secure_url;
//       cloudinaryPublicId = uploadResponse.public_id;
//     }

//     // 4. Create Submission with Cloudinary Data
//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName: studentName || "Student",
//       solutionUrl: finalUrl,
//       cloudinaryId: cloudinaryPublicId,
//       notes,
//       status: "pending",
//       fileType: file ? "pdf" : "link"
//     });

//     // 5. Update Assignment Stats
//     await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalSubmissions: 1 } });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment submitted to cloud successfully!",
//       data: newSubmission 
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     return NextResponse.json({ error: "Failed to process submission" }, { status: 500 });
//   }
// }









// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const formData = await req.formData();
    
//     const assignmentId = formData.get("assignmentId");
//     const studentId = formData.get("studentId");
//     const studentName = formData.get("studentName");
//     const solutionUrl = formData.get("solutionUrl"); 
//     const notes = formData.get("notes");
//     const file = formData.get("file"); 

//     if (!assignmentId || !studentId) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Student or Assignment ID missing" 
//       }, { status: 400 });
//     }

//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment not found" 
//       }, { status: 404 });
//     }

//     // Check if already submitted
//     const existingSubmission = await Submission.findOne({ assignmentId, studentId });
//     if (existingSubmission) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "You have already submitted this assignment" 
//       }, { status: 400 });
//     }

//     // Check if assignment is locked
//     if (assignment.isLocked) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment is locked by the instructor." 
//       }, { status: 403 });
//     }

//     // Check deadline
//     const now = new Date();
//     const dueDate = new Date(assignment.dueDate);
//     if (now > dueDate) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Submission deadline has passed!" 
//       }, { status: 403 });
//     }

//     let finalUrl = solutionUrl || "";
//     let cloudinaryPublicId = "";

//     // Cloudinary Upload Logic
//     if (file && typeof file !== "string") {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const uploadResponse = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           { 
//             resource_type: "raw", 
//             folder: "student_submissions" 
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(buffer);
//       });

//       finalUrl = uploadResponse.secure_url;
//       cloudinaryPublicId = uploadResponse.public_id;
//     }

//     // Create Submission
//     const newSubmission = await Submission.create({
//       assignmentId,
//       studentId,
//       studentName: studentName || "Student",
//       solutionUrl: finalUrl,
//       cloudinaryId: cloudinaryPublicId,
//       notes: notes || "",
//       status: "pending",
//       fileType: file ? "pdf" : "link"
//     });

//     // Update Assignment Stats
//     await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalSubmissions: 1 } });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment submitted successfully!",
//       data: newSubmission 
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: "Failed to process submission",
//       message: error.message 
//     }, { status: 500 });
//   }
// }














import dbConnect from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Assignment from "@/models/Assignment";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  await dbConnect();
  try {
    const formData = await req.formData();
    
    const assignmentId = formData.get("assignmentId");
    const studentId = formData.get("studentId");
    const studentName = formData.get("studentName");
    const solutionUrl = formData.get("solutionUrl"); 
    const notes = formData.get("notes");
    const file = formData.get("file"); 

    if (!assignmentId || !studentId) {
      return NextResponse.json({ 
        success: false, 
        message: "Student or Assignment ID missing" 
      }, { status: 400 });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ 
        success: false, 
        message: "Assignment not found" 
      }, { status: 404 });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({ assignmentId, studentId });
    if (existingSubmission) {
      return NextResponse.json({ 
        success: false, 
        message: "You have already submitted this assignment" 
      }, { status: 400 });
    }

    // Check if assignment is locked
    if (assignment.isLocked) {
      return NextResponse.json({ 
        success: false, 
        message: "Assignment is locked by the instructor." 
      }, { status: 403 });
    }

    // Check deadline
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    if (now > dueDate) {
      return NextResponse.json({ 
        success: false, 
        message: "Submission deadline has passed!" 
      }, { status: 403 });
    }

    let finalUrl = solutionUrl || "";
    let cloudinaryPublicId = "";

    // Cloudinary Upload Logic
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: "raw", 
            folder: "student_submissions" 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      finalUrl = uploadResponse.secure_url;
      cloudinaryPublicId = uploadResponse.public_id;
    }

    // Create Submission
    const newSubmission = await Submission.create({
      assignmentId,
      studentId,
      studentName: studentName || "Student",
      solutionUrl: finalUrl,
      cloudinaryId: cloudinaryPublicId,
      notes: notes || "",
      status: "pending",
      fileType: file ? "pdf" : "link"
    });

    // Update Assignment Stats
    await Assignment.findByIdAndUpdate(assignmentId, { $inc: { totalSubmissions: 1 } });

    return NextResponse.json({ 
      success: true, 
      message: "Assignment submitted successfully!",
      data: newSubmission 
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process submission",
      message: error.message 
    }, { status: 500 });
  }
}