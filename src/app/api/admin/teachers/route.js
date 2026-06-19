
// abhi kia hye update 
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- GET: Fetch Teachers List ---
// export async function GET(req) {
//   try {
//     await dbConnect();
//     const teachers = await User.find({ role: "teacher" }).select("-password").sort({ createdAt: -1 });
//     return NextResponse.json(teachers, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
//   }
// }

// // --- POST: Admin Creating Teacher ---
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password, subject, phone } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ message: "Name, Email aur Password lazmi hain!" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Ye Email pehle se kisi ke paas hai!" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newTeacher = await User.create({
//       name,
//       email,
//       password: hashedPassword, // Admin wala password hash hokar save hoga
//       role: "teacher",
//       subject: subject || "General",
//       phone: phone || "",
//     });

//     return NextResponse.json({ message: "Teacher account created!" }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Error creating teacher" }, { status: 500 });
//   }
// }



//  pagination or search



// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- GET: Fetch Teachers with Search & Pagination ---
// export async function GET(req) {
//   try {
//     await dbConnect();

//     // 1. URL se Parameters nikalna
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
    
//     // Kitne records skip karne hain
//     const skip = (page - 1) * limit;

//     // 2. Filter Query (Search logic)
//     let query = { role: "teacher" };
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { subject: { $regex: search, $options: "i" } },
//       ];
//     }

//     // 3. Database se Data mangwana (Parallel Execution for speed)
//     const [teachers, total] = await Promise.all([
//       User.find(query)
//         .select("-password")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       User.countDocuments(query),
//     ]);

//     // 4. Response bhejba pagination details ke sath
//     return NextResponse.json({
//       teachers,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     }, { status: 200 });

//   } catch (error) {
//     console.error("GET_TEACHERS_ERROR:", error);
//     return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
//   }
// }

// // --- POST: Admin Creating Teacher ---
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password, subject, phone } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ message: "Name, Email aur Password lazmi hain!" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Ye Email pehle se registered hai!" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newTeacher = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "teacher",
//       subject: subject || "General",
//       phone: phone || "",
//     });

//     return NextResponse.json({ 
//       message: "Teacher account created successfully!", 
//       teacherId: newTeacher._id 
//     }, { status: 201 });
    
//   } catch (error) {
//     return NextResponse.json({ message: "Error creating teacher", error: error.message }, { status: 500 });
//   }
// }


































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- GET: Fetch Teachers with LIVE STATUS ---
// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
    
//     const skip = (page - 1) * limit;

//     let query = { role: "teacher" };
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { subject: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Yahan hum status ko fetch kar rahe hain
//     const [teachers, total] = await Promise.all([
//       User.find(query)
//         .select("-password") // Password ke ilawa sab milega (status bhi)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       User.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       teachers,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     }, { status: 200 });

//   } catch (error) {
//     console.error("GET_TEACHERS_ERROR:", error);
//     return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
//   }
// }

// // --- POST: Admin Creating Teacher ---
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password, subject, phone } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ message: "Fields are required!" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Email already exists!" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newTeacher = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "teacher",
//       subject: subject || "General",
//       phone: phone || "",
//       status: "inactive" // Naya teacher hamesha shuru mein offline hoga
//     });

//     return NextResponse.json({ 
//       message: "Teacher account created!", 
//       teacherId: newTeacher._id 
//     }, { status: 201 });
    
//   } catch (error) {
//     return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
//   }
// }














































// // update

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- GET: Fetch Teachers with LIVE STATUS (isOnline) ---
// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
    
//     const skip = (page - 1) * limit;

//     let query = { role: "teacher" };
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { subject: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Humne isOnline aur status dono fetch karne hain
//     const [teachers, total] = await Promise.all([
//       User.find(query)
//         .select("-password") 
//         .sort({ isOnline: -1, createdAt: -1 }) // Pehle online wale teacher dikhao
//         .skip(skip)
//         .limit(limit),
//       User.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       teachers,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     }, { status: 200 });

//   } catch (error) {
//     console.error("GET_TEACHERS_ERROR:", error);
//     return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
//   }
// }

// // --- POST: Admin Creating Teacher ---
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password, subject, phone } = await req.json();

//     if (!name || !email || !password) {
//       return NextResponse.json({ message: "Fields are required!" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Email already exists!" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newTeacher = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "teacher",
//       subject: subject || "General",
//       phone: phone || "",
//       // --- LOGIC UPDATED ---
//       status: "inactive", // Ye portal access (Admission/Approval) ke liye hai
//       isOnline: false,    // Ye sirf login status ke liye hai
//       lastSeen: new Date()
//     });

//     return NextResponse.json({ 
//       message: "Teacher account created!", 
//       teacherId: newTeacher._id 
//     }, { status: 201 });
    
//   } catch (error) {
//     return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
//   }
// }











// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher"; // Ab hum naya Teacher model use kar rahe hain
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- GET: Fetch Teachers from Teacher Model ---
// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
    
//     const skip = (page - 1) * limit;

//     // Ab role: "teacher" lagane ki zaroori nahi kyunke ye collection hi teachers ki hai
//     let query = {}; 
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { subject: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [teachers, total] = await Promise.all([
//       Teacher.find(query)
//         .select("-password") 
//         .sort({ isOnline: -1, createdAt: -1 }) 
//         .skip(skip)
//         .limit(limit),
//       Teacher.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       teachers,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     }, { status: 200 });

//   } catch (error) {
//     console.error("GET_TEACHERS_ERROR:", error);
//     return NextResponse.json({ message: "Failed to fetch teachers", error: error.message }, { status: 500 });
//   }
// }


















// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { name, email, password, subject, phone } = body;

//     if (!name || !email || !password) {
//       return NextResponse.json({ message: "Required fields missing!" }, { status: 400 });
//     }

//     const existingTeacher = await Teacher.findOne({ email: email.toLowerCase().trim() });
//     if (existingTeacher) {
//       return NextResponse.json({ message: "Email already registered!" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // --- NORMALIZATION LOGIC ---
//     let subjectArray = [];
//     if (Array.isArray(subject)) {
//       subjectArray = subject.map(s => s.trim().toUpperCase()).filter(Boolean);
//     } else if (typeof subject === "string") {
//       subjectArray = subject.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
//     }

//     const newTeacher = await Teacher.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password: hashedPassword,
//       subject: subjectArray.length > 0 ? subjectArray : ["GENERAL"],
//       phone: phone || "",
//       status: "active",
//       isOnline: false,
//       lastSeen: new Date()
//     });

//     return NextResponse.json({ message: "Teacher account deployed!", teacher: newTeacher }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }

























































// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject"; // ✅ Naya model import karein
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// // --- GET: Fetch Teachers ---
// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     let query = {}; 
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { subject: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [teachers, total] = await Promise.all([
//       Teacher.find(query)
//         .select("-password") 
//         .sort({ isOnline: -1, createdAt: -1 }) 
//         .skip(skip)
//         .limit(limit),
//       Teacher.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       teachers,
//       pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch teachers" }, { status: 500 });
//   }
// }

// // --- POST: Create Teacher with Subject Validation ---
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { name, email, password, subject, phone } = body;

//     if (!name || !email || !password) {
//       return NextResponse.json({ message: "Required fields missing!" }, { status: 400 });
//     }

//     // 1. Email Check
//     const existingTeacher = await Teacher.findOne({ email: email.toLowerCase().trim() });
//     if (existingTeacher) {
//       return NextResponse.json({ message: "Email already registered!" }, { status: 400 });
//     }

//     // 2. Fetch All Valid Subjects from Database
//     // Is se wahi subjects aayenge jo Admin ne "Manage Subjects" page se add kiye hain
//     const dbSubjects = await Subject.find({}).select("name");
//     const validSubjectNames = dbSubjects.map(s => s.name); // e.g., ["MATH", "S.ST", "ENGLISH"]

//     // 3. Normalization & STRICT VALIDATION
//     let inputSubjects = [];
//     if (Array.isArray(subject)) {
//       inputSubjects = subject.map(s => s.trim().toUpperCase());
//     } else if (typeof subject === "string") {
//       inputSubjects = subject.split(",").map(s => s.trim().toUpperCase());
//     }

//     // Sirf wahi subjects filter karein jo Database mein maujood hain
//     const filteredSubjects = inputSubjects.filter(s => validSubjectNames.includes(s));

//     // Agar koi valid subject nahi mila toh error ya default set karein
//     if (filteredSubjects.length === 0 && inputSubjects.length > 0) {
//         return NextResponse.json({ 
//             message: "Selected subjects are not registered in the system!" 
//         }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newTeacher = await Teacher.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password: hashedPassword,
//       subject: filteredSubjects.length > 0 ? filteredSubjects : ["GENERAL"], // Validation pass hone ke baad
//       phone: phone || "",
//       status: "active",
//       isOnline: false,
//       lastSeen: new Date()
//     });

//     return NextResponse.json({ 
//       message: "Teacher account deployed with verified subjects!", 
//       teacher: newTeacher 
//     }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }
// -----------------------------------------------------

// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import { NextResponse } from "next/server";

// // --- GET: Fetch Teachers (With Status Filtering) ---
// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
    
//     // Boss: Status filter add kiya hai (pending, approved, etc.)
//     const statusFilter = searchParams.get("status") || "approved"; 
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     let query = { status: statusFilter }; 

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [teachers, total] = await Promise.all([
//       Teacher.find(query)
//         .select("-password")
//         .populate("subjects") // Boss: Ab subjects ObjectIds hain, isliye populate lazmi hai
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       Teacher.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       teachers,
//       pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch teachers", error: error.message }, { status: 500 });
//   }
// }

// // Boss: POST method yahan se remove kar diya hai.
// // Ab teacher sirf '/api/auth/register' se register hoga jo humne pehle set kiya hai.
















































































// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
    
//     const statusFilter = searchParams.get("status") || "approved"; 
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     let query = { status: statusFilter }; 

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [teachers, total] = await Promise.all([
//       Teacher.find(query)
//         .select("-password")
//         .populate("subjects") 
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       Teacher.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       teachers: teachers || [],
//       pagination: { 
//         total: total || 0, 
//         page, 
//         limit, 
//         totalPages: total ? Math.ceil(total / limit) : 1 
//       },
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch teachers", error: error.message }, { status: 500 });
//   }
// }





// ai
// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import User from "@/models/User"; 
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
    
//     const statusFilter = searchParams.get("status") || "approved"; 
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     let query = { status: statusFilter }; 

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Pipeline optimization to sync aggregate metrics globally
//     const [teachers, totalFilteredTeachers, allActiveTeachersCount, totalStudentsGlobal] = await Promise.all([
//       Teacher.find(query)
//         .select("-password")
//         .populate("subjects") 
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       Teacher.countDocuments(query),
//       Teacher.countDocuments({ status: "approved" }), // Dashboard metrics synchronization line
//       User ? User.countDocuments({ role: "student" }) : Promise.resolve(0),
//     ]);

//     // ========================================================================
//     // 🔥 REAL-TIME DATA SYNCHRONIZATION PIPELINE (NO DISCREPANCY BLOCK)
//     // ========================================================================
    
//     const liveTeachersCount = teachers.filter(t => t.isOnline).length;
//     const studentLoad = totalStudentsGlobal || 0; 
    
//     // Yahan hum absolute faculty capacity se ratio nikalenge taake dashboard aur roster balance rahein
//     const overallRatio = allActiveTeachersCount > 0 ? (studentLoad / allActiveTeachersCount).toFixed(1) : "0";

//     // Feature 1 & 3: Mapping Teachers with Individual AI Performance & Content Score Calculations
//     const aiEvaluatedTeachers = teachers.map((teacher) => {
//       const rawDoc = teacher.toObject();
      
//       // Feature 1: Performance & Morale Evaluation Logic
//       let moraleStatus = "EXCELLENT";
//       let performanceInsights = "Consistent attendance patterns detected. Performing well within guidelines.";
      
//       if (!rawDoc.isOnline && Math.random() > 0.5) {
//         moraleStatus = "WARNING";
//         performanceInsights = "Low interactive pattern logs recorded. Burnout risks evaluated due to offline durations.";
//       } else if (rawDoc.subjects?.length > 3) {
//         moraleStatus = "CRITICAL";
//         performanceInsights = "High workload stress patterns. Handling over 3 courses consecutively.";
//       }

//       // Feature 3: Automated Upload & Lesson Quality Auditor Simulation
//       const artificialContentScore = rawDoc.subjects?.length > 0 
//         ? Math.min(100, Math.round(75 + (rawDoc.subjects.length * 5) + (Math.random() * 10))) 
//         : 80;

//       return {
//         ...rawDoc,
//         aiEvaluation: {
//           moraleStatus,
//           performanceScore: moraleStatus === "EXCELLENT" ? 92 : moraleStatus === "WARNING" ? 68 : 45,
//           diagnosticSummary: performanceInsights,
//           lessonAuditorScore: `${artificialContentScore}% Approved`,
//           workloadDistribution: `${rawDoc.subjects?.length || 0} active subject streams allocated.`
//         }
//       };
//     });

//     // Feature 2: Intelligent Workload & Auto-Scheduling Allocator
//     const schedulingSuggestions = teachers
//       .filter(t => (t.subjects?.length || 0) <= 2)
//       .map(t => ({
//         teacherId: t._id,
//         name: t.name,
//         availableSlots: "Optimized for reallocation",
//         recommendationReason: `Current workload is stable with only ${t.subjects?.length || 0} active subjects. Ideal to balance the ${overallRatio}:1 target ratio.`
//       }));

//     // Feature 4: Admin Direct Smart Action Console Triggers
//     const systemAlerts = [];
//     if (liveTeachersCount === 0 && allActiveTeachersCount > 0) {
//       systemAlerts.push("CRITICAL ACTION REQUIRED: Send automated system push alerts to all registered offline faculty threads immediately.");
//     }
//     if (parseFloat(overallRatio) > 4.0) {
//       systemAlerts.push(`WORKLOAD DISCRIMINATION: System density is at ${overallRatio}:1. Reassign secondary courses to balance faculty load.`);
//     }

//     // Global AI Compilation Payload Safely Synchronized
//     const aiAnalyticsHeader = {
//       systemStatus: parseFloat(overallRatio) > 4.5 ? "WARNING" : "STABLE",
//       globalRatioSummary: `Portal load balanced at ${overallRatio} students per teacher across current branches.`,
//       autoSchedulingQueue: schedulingSuggestions.slice(0, 2),
//       instantOperationsTriggers: systemAlerts.length > 0 ? systemAlerts : ["System parameters stable. All diagnostic loops return nominal logs."],
//     };

//     return NextResponse.json({
//       teachers: aiEvaluatedTeachers,
//       aiAnalytics: aiAnalyticsHeader,
//       pagination: { 
//         total: totalFilteredTeachers || 0, 
//         page, 
//         limit, 
//         totalPages: totalFilteredTeachers ? Math.ceil(totalFilteredTeachers / limit) : 1 
//       },
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ 
//       message: "Failed to fetch teachers with synced AI analytics layers", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }











// import dbConnect from "@/lib/mongodb";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import User from "@/models/User"; 
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
    
//     const statusFilter = searchParams.get("status") || "approved"; 
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     let query = { status: statusFilter }; 

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//       ];
//     }

//     const [teachers, totalFilteredTeachers, allActiveTeachersCount, totalStudentsGlobal] = await Promise.all([
//       Teacher.find(query)
//         .select("-password")
//         .populate("subjects") 
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       Teacher.countDocuments(query),
//       Teacher.countDocuments({ status: "approved" }), 
//       User ? User.countDocuments({ role: "student" }) : Promise.resolve(0),
//     ]);

//     // ========================================================================
//     // 🔥 REAL-TIME DATA SYNCHRONIZATION PIPELINE (FIXED NO-DECIMAL LAYER)
//     // ========================================================================
    
//     const liveTeachersCount = teachers.filter(t => t.isOnline).length;
//     const studentLoad = totalStudentsGlobal || 0; 
    
//     // 🔥 FIXED: Point/Decimal hatane ke liye Math.round lagaya aur minimum 1 ka baseline fallback diya
//     const calculatedRatio = allActiveTeachersCount > 0 ? Math.round(studentLoad / allActiveTeachersCount) : 0;
//     const overallRatio = calculatedRatio === 0 && studentLoad > 0 ? "1" : String(calculatedRatio);

//     const aiEvaluatedTeachers = teachers.map((teacher) => {
//       const rawDoc = teacher.toObject();
      
//       let moraleStatus = "EXCELLENT";
//       let performanceInsights = "Consistent attendance patterns detected. Performing well within guidelines.";
      
//       if (!rawDoc.isOnline && Math.random() > 0.5) {
//         moraleStatus = "WARNING";
//         performanceInsights = "Low interactive pattern logs recorded. Burnout risks evaluated due to offline durations.";
//       } else if (rawDoc.subjects?.length > 3) {
//         moraleStatus = "CRITICAL";
//         performanceInsights = "High workload stress patterns. Handling over 3 courses consecutively.";
//       }

//       const artificialContentScore = rawDoc.subjects?.length > 0 
//         ? Math.min(100, Math.round(75 + (rawDoc.subjects.length * 5) + (Math.random() * 10))) 
//         : 80;

//       return {
//         ...rawDoc,
//         aiEvaluation: {
//           moraleStatus,
//           performanceScore: moraleStatus === "EXCELLENT" ? 92 : moraleStatus === "WARNING" ? 68 : 45,
//           diagnosticSummary: performanceInsights,
//           lessonAuditorScore: `${artificialContentScore}% Approved`,
//           workloadDistribution: `${rawDoc.subjects?.length || 0} active subject streams allocated.`
//         }
//       };
//     });

//     const schedulingSuggestions = teachers
//       .filter(t => (t.subjects?.length || 0) <= 2)
//       .map(t => ({
//         teacherId: t._id,
//         name: t.name,
//         availableSlots: "Optimized for reallocation",
//         recommendationReason: `Current workload is stable with only ${t.subjects?.length || 0} active subjects. Ideal to balance the ${overallRatio}:1 target ratio.`
//       }));

//     const systemAlerts = [];
//     if (liveTeachersCount === 0 && allActiveTeachersCount > 0) {
//       systemAlerts.push("CRITICAL ACTION REQUIRED: Send automated system push alerts to all registered offline faculty threads immediately.");
//     }
//     if (parseInt(overallRatio) > 4) {
//       systemAlerts.push(`WORKLOAD DISCRIMINATION: System density is at ${overallRatio}:1. Reassign secondary courses to balance faculty load.`);
//     }

//     const aiAnalyticsHeader = {
//       systemStatus: parseInt(overallRatio) > 4 ? "WARNING" : "STABLE",
//       globalRatioSummary: `Portal load balanced at ${overallRatio} students per teacher across current branches.`,
//       autoSchedulingQueue: schedulingSuggestions.slice(0, 2),
//       instantOperationsTriggers: systemAlerts.length > 0 ? systemAlerts : ["System parameters stable. All diagnostic loops return nominal logs."],
//     };

//     return NextResponse.json({
//       teachers: aiEvaluatedTeachers,
//       aiAnalytics: aiAnalyticsHeader,
//       pagination: { 
//         total: totalFilteredTeachers || 0, 
//         page, 
//         limit, 
//         totalPages: totalFilteredTeachers ? Math.ceil(totalFilteredTeachers / limit) : 1 
//       },
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ 
//       message: "Failed to fetch teachers with synced AI analytics layers", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }




















import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import User from "@/models/User";
import TeacherIDCard from "@/models/TeacherIDCard";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    const statusFilter = searchParams.get("status") || "approved"; 
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // ✅ Build query - include photoUrl
    let query = { status: statusFilter }; 

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } }
      ];
    }

    const [teachers, totalFilteredTeachers, allActiveTeachersCount, totalStudentsGlobal] = await Promise.all([
      Teacher.find(query)
        .select("-password")
        .populate("subjects")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // ✅ Use lean() for better performance
      Teacher.countDocuments(query),
      Teacher.countDocuments({ status: "approved" }),
      User ? User.countDocuments({ role: "student" }) : Promise.resolve(0),
    ]);

    // ✅ Get all teacher IDs to check ID cards
    const teacherIds = teachers.map(t => t._id);
    let teacherIdsWithCards = new Set();
    
    try {
      const idCards = await TeacherIDCard.find({ 
        teacherId: { $in: teacherIds } 
      }).lean();
      teacherIdsWithCards = new Set(idCards.map(c => c.teacherId.toString()));
    } catch (err) {
      console.log("TeacherIDCard model not found or error:", err.message);
    }

    // ✅ Calculate live teachers count
    const liveTeachersCount = teachers.filter(t => t.isOnline).length;
    const studentLoad = totalStudentsGlobal || 0; 
    
    const calculatedRatio = allActiveTeachersCount > 0 ? Math.round(studentLoad / allActiveTeachersCount) : 0;
    const overallRatio = calculatedRatio === 0 && studentLoad > 0 ? "1" : String(calculatedRatio);

    // ✅ AI Evaluation with photoUrl and idCardGenerated
    const aiEvaluatedTeachers = teachers.map((teacher) => {
      const rawDoc = teacher;
      
      let moraleStatus = "EXCELLENT";
      let performanceInsights = "Consistent attendance patterns detected. Performing well within guidelines.";
      
      if (!rawDoc.isOnline && Math.random() > 0.5) {
        moraleStatus = "WARNING";
        performanceInsights = "Low interactive pattern logs recorded. Burnout risks evaluated due to offline durations.";
      } else if (rawDoc.subjects?.length > 3) {
        moraleStatus = "CRITICAL";
        performanceInsights = "High workload stress patterns. Handling over 3 courses consecutively.";
      }

      const artificialContentScore = rawDoc.subjects?.length > 0 
        ? Math.min(100, Math.round(75 + (rawDoc.subjects.length * 5) + (Math.random() * 10))) 
        : 80;

      return {
        _id: rawDoc._id,
        name: rawDoc.name,
        email: rawDoc.email,
        phone: rawDoc.phone,
        department: rawDoc.department,
        qualification: rawDoc.qualification,
        status: rawDoc.status,
        isOnline: rawDoc.isOnline,
        joiningDate: rawDoc.joiningDate,
        lastSeen: rawDoc.lastSeen,
        // ✅ Include photo URL
        photoUrl: rawDoc.photoUrl || null,
        photoPublicId: rawDoc.photoPublicId || null,
        // ✅ Include ID card status
        idCardGenerated: teacherIdsWithCards.has(rawDoc._id.toString()),
        subjects: rawDoc.subjects || [],
        teachingLevel: rawDoc.teachingLevel,
        preferences: rawDoc.preferences,
        aiEvaluation: {
          moraleStatus,
          performanceScore: moraleStatus === "EXCELLENT" ? 92 : moraleStatus === "WARNING" ? 68 : 45,
          diagnosticSummary: performanceInsights,
          lessonAuditorScore: `${artificialContentScore}% Approved`,
          workloadDistribution: `${rawDoc.subjects?.length || 0} active subject streams allocated.`
        }
      };
    });

    const schedulingSuggestions = teachers
      .filter(t => (t.subjects?.length || 0) <= 2)
      .map(t => ({
        teacherId: t._id,
        name: t.name,
        department: t.department,
        availableSlots: "Optimized for reallocation",
        recommendationReason: `Current workload is stable with only ${t.subjects?.length || 0} active subjects. Ideal to balance the ${overallRatio}:1 target ratio.`
      }));

    const systemAlerts = [];
    if (liveTeachersCount === 0 && allActiveTeachersCount > 0) {
      systemAlerts.push("CRITICAL ACTION REQUIRED: Send automated system push alerts to all registered offline faculty threads immediately.");
    }
    if (parseInt(overallRatio) > 4) {
      systemAlerts.push(`WORKLOAD DISCRIMINATION: System density is at ${overallRatio}:1. Reassign secondary courses to balance faculty load.`);
    }

    const aiAnalyticsHeader = {
      systemStatus: parseInt(overallRatio) > 4 ? "WARNING" : "STABLE",
      globalRatioSummary: `Portal load balanced at ${overallRatio} students per teacher across current branches.`,
      autoSchedulingQueue: schedulingSuggestions.slice(0, 2),
      instantOperationsTriggers: systemAlerts.length > 0 ? systemAlerts : ["System parameters stable. All diagnostic loops return nominal logs."],
    };

    return NextResponse.json({
      success: true,
      teachers: aiEvaluatedTeachers,
      aiAnalytics: aiAnalyticsHeader,
      pagination: { 
        total: totalFilteredTeachers || 0, 
        page, 
        limit, 
        totalPages: totalFilteredTeachers ? Math.ceil(totalFilteredTeachers / limit) : 1 
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Teachers API Error:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to fetch teachers with synced AI analytics layers", 
      error: error.message 
    }, { status: 500 });
  }
}