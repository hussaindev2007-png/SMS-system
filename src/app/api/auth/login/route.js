// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"; 

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password } = await req.json();

//     // 1. Validation check
//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Identifier and Password are required!" }, { status: 400 });
//     }

//     let user;

//     // 2. SMART SEARCH LOGIC
//     if (identifier.includes("@")) {
//       // Agar email hai toh Staff (Admin/Teacher) dhoondo
//       user = await User.findOne({ 
//         email: identifier.toLowerCase().trim(), 
//         role: { $in: ["admin", "teacher"] } 
//       }).lean();
//     } else {
//       // Agar email nahi hai toh Student dhoondo Roll No se
//       user = await User.findOne({ 
//         rollNo: identifier.trim(), 
//         role: "student" 
//       }).lean();
//     }

//     // 3. User existence check
//     if (!user) {
//       const errorMsg = identifier.includes("@") 
//         ? "Staff account not found with this email!" 
//         : "Student not found with this Roll Number!";
//       return NextResponse.json({ message: errorMsg }, { status: 404 });
//     }

//     // 4. Password comparison
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Password! Dubara check karein." }, { status: 401 });
//     }

//     // 5. Token generation
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,            
//       { expiresIn: "1d" }               
//     );

//     // 6. Final Clean Response
//     return NextResponse.json({
//       message: "Login Successful!",
//       token: token,
//       user: { 
//         id: user._id,
//         name: user.name, 
//         role: user.role,
//         // Sirf wahi data bhejain jo user ke paas hai
//         email: user.email || null,
//         className: user.className || null,
//         rollNo: user.rollNo || null
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("LOGIN_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server Error", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }






// // adim db
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin"; // Dono models import karein
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password } = await req.json();

//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Identifier and Password are required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = "";

//     // 1. SMART SEARCH LOGIC
//     if (identifier.includes("@")) {
//       const email = identifier.toLowerCase().trim();

//       // Pehle Admin model mein dhoondo
//       user = await Admin.findOne({ email }).lean();
      
//       if (user) {
//         foundRole = "admin";
//       } else {
//         // Agar Admin mein nahi mila, toh User model mein Teacher dhoondo
//         user = await User.findOne({ email, role: "teacher" }).lean();
//         if (user) foundRole = "teacher";
//       }
//     } else {
//       // Agar email nahi hai toh Student dhoondo User model mein
//       user = await User.findOne({ rollNo: identifier.trim(), role: "student" }).lean();
//       if (user) foundRole = "student";
//     }

//     // 2. User existence check
//     if (!user) {
//       const errorMsg = identifier.includes("@") 
//         ? "Account not found in Staff or Admin records!" 
//         : "Student not found with this Roll Number!";
//       return NextResponse.json({ message: errorMsg }, { status: 404 });
//     }

//     // 3. Password comparison
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Password! Dubara check karein." }, { status: 401 });
//     }

//     // 4. Token generation
//     const token = jwt.sign(
//       { id: user._id, role: foundRole }, // Model se role ya variable use karein
//       process.env.JWT_SECRET,            
//       { expiresIn: "1d" }               
//     );

//     // 5. Final Response
//     return NextResponse.json({
//       message: "Login Successful!",
//       token: token,
//       user: { 
//         id: user._id,
//         name: user.name, 
//         role: foundRole,
//         email: user.email || null,
//         className: user.className || null,
//         rollNo: user.rollNo || null
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("LOGIN_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server Error", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password, action } = await req.json();

//     // 1. Status Check (Frontend Lock ke liye)
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" }).lean();
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     // 2. Normal Login Validation
//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = "";

//     // Identify User
//     if (identifier.includes("@")) {
//       const email = identifier.toLowerCase().trim();
//       user = await Admin.findOne({ email }).lean();
//       if (user) { 
//         foundRole = "admin"; 
//       } else {
//         user = await User.findOne({ email, role: "teacher" }).lean();
//         if (user) foundRole = "teacher";
//       }
//     } else {
//       user = await User.findOne({ rollNo: identifier.trim(), role: "student" }).lean();
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "User not found!" }, { status: 404 });
//     }

//     // 🔒 ADMISSION LOCK: Student tabhi andar jaye jab Admin ne active kiya ho
//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Contact Admin." }, { status: 403 });
//     }

//     // Password Check
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Password!" }, { status: 401 });
//     }

//     // 🟢 ONLINE STATUS UPDATE: Login hote hi Online karo (Admission Status ko chere bina)
//     if (foundRole === "student" || foundRole === "teacher") {
//       await User.findByIdAndUpdate(user._id, { 
//         isOnline: true, 
//         lastSeen: new Date() 
//       });
//     }

//     // Token generation
//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({
//       message: "Login Successful!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         rollNo: user.rollNo || null,
//         status: user.status // Ye "active" hi rahega
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Login Error:", error);
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }










//eoor 500 so update 







// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; // <--- Naya Model Import karein
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password, action } = await req.json();

//     // --- Student Status Check (Same as before) ---
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = "";

//     // --- Login Logic Update ---
//     if (identifier.includes("@")) {
//       const email = identifier.toLowerCase().trim();
      
//       // 1. Pehle Admin check karein
//       user = await Admin.findOne({ email });
//       if (user) { 
//         foundRole = "admin"; 
//       } else {
//         // 2. Phir Naye Teacher Model mein check karein
//         user = await Teacher.findOne({ email });
//         if (user) {
//           foundRole = "teacher";
//         }
//       }
//     } else {
//       // 3. Roll Number se Student check karein
//       user = await User.findOne({ rollNo: identifier.trim(), role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     // Student Active Status Check
//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Secret Key Mismatch!" }, { status: 401 });
//     }

//     // --- Update Online Status (Sub models par apply hoga) ---
//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         rollNo: user.rollNo || null,
//         status: user.status || "active",
//         subject: user.subject || [] // Teacher ke liye subjects bhi bhej sakte hain
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Critical Login Error:", error);
//     return NextResponse.json({ message: "Internal System Failure" }, { status: 500 });
//   }
// }








// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password, action } = await req.json();

//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = "";

//     if (identifier.includes("@")) {
//       const email = identifier.toLowerCase().trim();
//       user = await Admin.findOne({ email });
//       if (user) { 
//         foundRole = "admin"; 
//       } else {
//         user = await Teacher.findOne({ email });
//         if (user) {
//           foundRole = "teacher";
//         }
//       }
//     } else {
//       user = await User.findOne({ rollNo: identifier.trim(), role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Secret Key Mismatch!" }, { status: 401 });
//     }

//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     // --- FIX: Add targetClass to the response object ---
//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         rollNo: user.rollNo || null,
//         className: user.targetClass || user.className || null, // <--- Ye line lazmi hye
//         status: user.status || "active",
//         subject: user.subject || [] 
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Critical Login Error:", error);
//     return NextResponse.json({ message: "Internal System Failure" }, { status: 500 });
//   }
// }

// --------------------------------------------------------------------
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password, action } = await req.json();

//     // 1. Roll Number Validation (Student Status Check)
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = "";

//     // 2. Identify User (Admin, Teacher, or Student)
//     if (identifier.includes("@")) {
//       const email = identifier.toLowerCase().trim();
//       user = await Admin.findOne({ email });
//       if (user) { 
//         foundRole = "admin"; 
//       } else {
//         user = await Teacher.findOne({ email });
//         if (user) {
//           foundRole = "teacher";
//         }
//       }
//     } else {
//       user = await User.findOne({ rollNo: identifier.trim(), role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     // --- BOSS: TEACHER APPROVAL CHECK (Jaisa Register me logic tha) ---
//     if (foundRole === "teacher" && user.status !== "active") {
//       return NextResponse.json({ 
//         message: "Your application is still pending approval from Admin!" 
//       }, { status: 403 });
//     }

//     // --- STUDENT STATUS CHECK ---
//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     // 3. Password Verification
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
//     }

//     // 4. Online Status & Activity
//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     // 5. Token Generation
//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     // 6. Final Response
//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         email: user.email || null,
//         rollNo: user.rollNo || null,
//         className: user.targetClass || user.className || null,
//         status: user.status || "active",
//         subject: user.subject || [] 
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Critical Login Error:", error);
//     return NextResponse.json({ message: "Internal System Failure" }, { status: 500 });
//   }
// }





























































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { identifier, password, action } = await req.json();

//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = "";

//     if (identifier.includes("@")) {
//       const email = identifier.toLowerCase().trim();
//       user = await Admin.findOne({ email });
//       if (user) { 
//         foundRole = "admin"; 
//       } else {
//         user = await Teacher.findOne({ email }).populate("subjects", "name");
//         if (user) {
//           foundRole = "teacher";
//         }
//       }
//     } else {
//       user = await User.findOne({ rollNo: identifier.trim(), role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     if (foundRole === "teacher" && user.status !== "approved" && user.status !== "active") {
//       return NextResponse.json({ 
//         message: "Your application is still pending approval from Admin!" 
//       }, { status: 403 });
//     }

//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
//     }

//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         email: user.email || null,
//         rollNo: user.rollNo || null,
//         className: user.targetClass || user.className || null,
//         status: user.status || "active",
//         subjects: user.subjects || [] 
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Critical Login Error:", error);
//     return NextResponse.json({ message: "Internal System Failure" }, { status: 500 });
//   }
// }



























// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// // 🔥 YAHAN APNE SUBJECT MODEL KO IMPORT KAREIN (Path apne project ke mutabik check kar lein)
// import Subject from "@/models/Subject"; 

// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     // 🔥 Explicitly extracted role from payload
//     const { identifier, password, action, role } = await req.json();

//     // 1. ACTION: Check Student Admission Status
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = role || ""; // Fallback to provided role

//     // 2. IDENTITY RESOLUTION MATRIX
//     const formattedIdentifier = identifier.trim();

//     if (formattedIdentifier.includes("@")) {
//       const email = formattedIdentifier.toLowerCase();
      
//       // If client explicitly says it's a teacher/staff context or role wasn't strict
//       if (role === "teacher" || !role) {
//         user = await Teacher.findOne({ email }).populate("subjects", "name");
//         if (user) {
//           foundRole = "teacher";
//         } else {
//           // Check if it's an admin trying to log in through staff portal
//           user = await Admin.findOne({ email });
//           if (user) foundRole = "admin";
//         }
//       } else {
//         user = await Admin.findOne({ email });
//         if (user) foundRole = "admin";
//       }
//     } else {
//       user = await User.findOne({ rollNo: formattedIdentifier, role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     // 3. STATUS VIOLATION CHECKERS
//     if (foundRole === "teacher" && user.status !== "approved" && user.status !== "active") {
//       return NextResponse.json({ 
//         message: "Your application is still pending approval from Admin!" 
//       }, { status: 403 });
//     }

//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     // 4. CRYPTO PASSWORD VALIDATION
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
//     }

//     // 5. SESSION TRACKING UPDATES
//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     // 6. TOKEN GENERATION
//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         email: user.email || null,
//         rollNo: user.rollNo || null,
//         className: user.targetClass || user.className || null,
//         status: user.status || "active",
//         subjects: user.subjects || [] 
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Critical Login Error:", error);
//     return NextResponse.json({ message: "Internal System Failure" }, { status: 500 });
//   }
// }










// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { generateOTP, saveOTP, verifyOTP, sendOTPviaEmail, sendOTPviaSMS } from "@/lib/otp";

// // Helper function to send OTP
// const sendOTPToUser = async (user, method = "email") => {
//   const otp = generateOTP();
//   saveOTP(user._id.toString(), otp);
 
//   if (method === "email" && user.email) {
//     await sendOTPviaEmail(user.email, otp, user.name);
//     return { success: true, method: "email" };
//   } else if (method === "sms" && user.phone) {
//     await sendOTPviaSMS(user.phone, otp, user.name);
//     return { success: true, method: "sms" };
//   }
  
//   return { success: false, error: "No valid contact method" };
// };

// export async function POST(req) {
//   try {
    
//     await dbConnect();
   
//     const body = await req.json();
    
//     const { identifier, password, action, role, studentId, otp, qrMode, otpMethod, email } = body;

//     // 1. ACTION: Check Student Admission Status
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     // 2. ACTION: Send OTP for QR Login
//     if (action === "send-otp") {
//       if (!studentId) {
//         return NextResponse.json({ message: "Student ID required" }, { status: 400 });
//       }
      
//       const student = await User.findById(studentId);
//       if (!student || student.role !== "student") {
//         return NextResponse.json({ message: "Invalid student" }, { status: 404 });
//       }
      
//       const method = otpMethod || "email";
//       const result = await sendOTPToUser(student, method);
      
//       if (!result.success) {
//         return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
//       }
      
//       return NextResponse.json({ 
//         success: true, 
//         message: `OTP sent to your ${result.method}`,
//         expiresIn: 5
//       });
//     }

//     // 3. ACTION: Verify OTP and Login (from QR or Email)
//     if (action === "verify-otp") {
//      if (!studentId || !otp) {
//         return NextResponse.json({ message: "Student ID and OTP required" }, { status: 400 });
//       }
      
//       const otpResult = verifyOTP(studentId, otp);
      
//       if (!otpResult.success) {
//         return NextResponse.json({ message: otpResult.message }, { status: 401 });
//       }
      
//       const user = await User.findById(studentId);
//       if (!user) {
//         return NextResponse.json({ message: "User not found" }, { status: 404 });
//       }
      
//       if (user.status !== "active") {
//         return NextResponse.json({ message: "Account not active" }, { status: 403 });
//       }
      
//       // Update session
//       user.isOnline = true;
//       user.lastSeen = new Date();
//       await user.save();
      
//       // Generate token
//       const token = jwt.sign(
//         { id: user._id, role: "student" },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
      
      
//       return NextResponse.json({
//         success: true,
//         message: "Login successful!",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           role: "student",
//           rollNo: user.rollNo,
//           className: user.className,
//           section: user.section,
//           email: user.email
//         }
//       });
//     }

//     // 4. ACTION: QR Login - Get student info (no OTP yet)
//     if (action === "qr-login-info") {
//       if (!studentId) {
//         return NextResponse.json({ message: "Student ID required" }, { status: 400 });
//       }
      
//       const student = await User.findById(studentId);
//       if (!student || student.role !== "student") {
//         return NextResponse.json({ message: "Invalid student" }, { status: 404 });
//       }
      
//       return NextResponse.json({
//         success: true,
//         studentId: student._id,
//         name: student.name,
//         hasEmail: !!student.email,
//         hasPhone: !!student.phone
//       });
//     }

//     // ✅ 5. NEW ACTION: Email OTP Login (without QR code)
//     if (action === "email-otp") {
      
//       if (!email) {
//         return NextResponse.json({ message: "Email required" }, { status: 400 });
//       }
      
//       const student = await User.findOne({ email, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Email not registered" }, { status: 404 });
//       }
      
      
//       if (student.status !== "active") {
//         return NextResponse.json({ message: "Account not active" }, { status: 403 });
//       }
      
//       // Send OTP via email
//       const otpCode = generateOTP();
//       saveOTP(student._id.toString(), otpCode);
      
//       await sendOTPviaEmail(email, otpCode, student.name);
     
//       return NextResponse.json({ 
//         success: true, 
//         name: student.name,
//         studentId: student._id,
//         message: "OTP sent to your email"
//       });
//     }

//     // 6. REGULAR LOGIN (Roll No + Password OR Email + Password)
//     if (!identifier || !password) {
      
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

    
//     let user = null;
//     let foundRole = role || "";

//     const formattedIdentifier = identifier.trim();

//     if (formattedIdentifier.includes("@")) {
//       const emailId = formattedIdentifier.toLowerCase();
      
//       if (role === "teacher" || !role) {
//         user = await Teacher.findOne({ email: emailId }).populate("subjects", "name");
//         if (user) foundRole = "teacher";
//         else {
//           user = await Admin.findOne({ email: emailId });
//           if (user) foundRole = "admin";
//         }
//       } else {
//         user = await Admin.findOne({ email: emailId });
//         if (user) foundRole = "admin";
//       }
//     } else {
//       user = await User.findOne({ rollNo: formattedIdentifier, role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     if (foundRole === "teacher" && user.status !== "approved" && user.status !== "active") {
//       return NextResponse.json({ 
//         message: "Your application is still pending approval from Admin!" 
//       }, { status: 403 });
//     }

//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
//     }

//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         email: user.email || null,
//         rollNo: user.rollNo || null,
//         className: user.targetClass || user.className || null,
//         status: user.status || "active",
//         subjects: user.subjects || [] 
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("=".repeat(50));
//     console.error("💥 [LOGIN API] CRITICAL ERROR!");
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     console.error("=".repeat(50));
//     return NextResponse.json({ message: "Internal System Failure: " + error.message }, { status: 500 });
//   }
// }
































































// // app/api/auth/login/route.js
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { generateOTP, saveOTP, verifyOTP, sendOTPviaEmail } from "@/lib/otp";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { identifier, password, action, role, studentId, otp, email } = body;

//     // 1. ACTION: Check Student Admission Status
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     // 2. ACTION: Email OTP Login
//     if (action === "email-otp") {
//       if (!email) {
//         return NextResponse.json({ message: "Email required" }, { status: 400 });
//       }
      
//       const student = await User.findOne({ email, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Email not registered" }, { status: 404 });
//       }
      
//       if (student.status !== "active") {
//         return NextResponse.json({ message: "Account not active" }, { status: 403 });
//       }
      
//       // Send OTP via email
//       const otpCode = generateOTP();
//       saveOTP(student._id.toString(), otpCode);
//       await sendOTPviaEmail(email, otpCode, student.name);
      
//       return NextResponse.json({ 
//         success: true, 
//         name: student.name,
//         studentId: student._id,
//         message: "OTP sent to your email"
//       });
//     }

//     // 3. ACTION: Verify OTP and Login
//     if (action === "verify-otp") {
//       if (!studentId || !otp) {
//         return NextResponse.json({ message: "Student ID and OTP required" }, { status: 400 });
//       }
      
//       const otpResult = verifyOTP(studentId, otp);
      
//       if (!otpResult.success) {
//         return NextResponse.json({ message: otpResult.message }, { status: 401 });
//       }
      
//       const user = await User.findById(studentId);
//       if (!user) {
//         return NextResponse.json({ message: "User not found" }, { status: 404 });
//       }
      
//       if (user.status !== "active") {
//         return NextResponse.json({ message: "Account not active" }, { status: 403 });
//       }
      
//       // Update session
//       user.isOnline = true;
//       user.lastSeen = new Date();
//       await user.save();
      
//       // Generate token
//       const token = jwt.sign(
//         { id: user._id, role: "student" },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
      
//       return NextResponse.json({
//         success: true,
//         message: "Login successful!",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           role: "student",
//           rollNo: user.rollNo,
//           className: user.className,
//           section: user.section,
//           email: user.email
//         }
//       });
//     }

//     // 4. ACTION: QR Login - Get student info
//     if (action === "qr-login-info") {
//       if (!studentId) {
//         return NextResponse.json({ message: "Student ID required" }, { status: 400 });
//       }
      
//       const student = await User.findById(studentId);
//       if (!student || student.role !== "student") {
//         return NextResponse.json({ message: "Invalid student" }, { status: 404 });
//       }
      
//       return NextResponse.json({
//         success: true,
//         studentId: student._id,
//         name: student.name,
//         hasEmail: !!student.email,
//         hasPhone: !!student.phone
//       });
//     }

//     // 5. REGULAR LOGIN (Roll No + Password)
//     if (!identifier || !password) {
//       return NextResponse.json({ message: "Credentials required!" }, { status: 400 });
//     }

//     let user = null;
//     let foundRole = role || "";
//     const formattedIdentifier = identifier.trim();

//     if (formattedIdentifier.includes("@")) {
//       const emailId = formattedIdentifier.toLowerCase();
      
//       if (role === "teacher" || !role) {
//         user = await Teacher.findOne({ email: emailId }).populate("subjects", "name");
//         if (user) foundRole = "teacher";
//         else {
//           user = await Admin.findOne({ email: emailId });
//           if (user) foundRole = "admin";
//         }
//       } else {
//         user = await Admin.findOne({ email: emailId });
//         if (user) foundRole = "admin";
//       }
//     } else {
//       user = await User.findOne({ rollNo: formattedIdentifier, role: "student" });
//       if (user) foundRole = "student";
//     }

//     if (!user) {
//       return NextResponse.json({ message: "Identity not recognized!" }, { status: 404 });
//     }

//     if (foundRole === "teacher" && user.status !== "approved" && user.status !== "active") {
//       return NextResponse.json({ 
//         message: "Your application is still pending approval from Admin!" 
//       }, { status: 403 });
//     }

//     if (foundRole === "student" && user.status !== "active") {
//       return NextResponse.json({ message: "Admission Pending! Access Forbidden." }, { status: 403 });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return NextResponse.json({ message: "Invalid Credentials!" }, { status: 401 });
//     }

//     user.isOnline = true;
//     if (foundRole !== "admin") {
//       user.lastSeen = new Date();
//     }
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: foundRole },
//       process.env.JWT_SECRET || "fallback_secret_key",
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({
//       message: "Session Initialized!",
//       token,
//       user: { 
//         id: user._id, 
//         name: user.name, 
//         role: foundRole, 
//         email: user.email || null,
//         rollNo: user.rollNo || null,
//         className: user.targetClass || user.className || null,
//         status: user.status || "active",
//         subjects: user.subjects || [] 
//       }
//     }, { status: 200 });

//   } catch (error) {
//     console.error("💥 [LOGIN API] CRITICAL ERROR!", error.message);
//     return NextResponse.json({ message: "Internal System Failure: " + error.message }, { status: 500 });
//   }
// }







// // app/api/auth/login/route.js
// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; 
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { generateOTP, saveOTP, verifyOTP, sendOTPviaEmail } from "@/lib/otp";

// // Store 2FA sessions temporarily
// const twoFASessions = new Map();

// // Helper function to get client IP
// const getClientIP = (req) => {
//   const forwarded = req.headers.get('x-forwarded-for');
//   return forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
// };

// // Helper function to get device info
// const getDeviceInfo = (req) => {
//   return req.headers.get('user-agent') || 'unknown';
// };

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { identifier, password, action, role, studentId, otp, email, tempToken } = body;
//     const clientIP = getClientIP(req);
//     const deviceInfo = getDeviceInfo(req);

//     // ==================== 1. STUDENT ADMISSION STATUS CHECK ====================
//     if (action === "check_status") {
//       const student = await User.findOne({ rollNo: identifier, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
//       }
//       return NextResponse.json({ 
//         status: student.status, 
//         name: student.name 
//       }, { status: 200 });
//     }

//     // ==================== 2. STUDENT EMAIL OTP LOGIN ====================
//     if (action === "email-otp") {
//       if (!email) {
//         return NextResponse.json({ message: "Email required" }, { status: 400 });
//       }
      
//       const student = await User.findOne({ email, role: "student" });
//       if (!student) {
//         return NextResponse.json({ message: "Email not registered" }, { status: 404 });
//       }
      
//       if (student.status !== "active") {
//         return NextResponse.json({ message: "Account not active" }, { status: 403 });
//       }
      
//       const otpCode = generateOTP();
//       saveOTP(student._id.toString(), otpCode);
//       await sendOTPviaEmail(email, otpCode, student.name);
      
//       return NextResponse.json({ 
//         success: true, 
//         name: student.name,
//         studentId: student._id,
//         message: "OTP sent to your email"
//       });
//     }

//     // ==================== 3. STUDENT VERIFY OTP & LOGIN ====================
//     if (action === "verify-otp") {
//       if (!studentId || !otp) {
//         return NextResponse.json({ message: "Student ID and OTP required" }, { status: 400 });
//       }
      
//       const otpResult = verifyOTP(studentId, otp);
//       if (!otpResult.success) {
//         return NextResponse.json({ message: otpResult.message }, { status: 401 });
//       }
      
//       const user = await User.findById(studentId);
//       if (!user) {
//         return NextResponse.json({ message: "User not found" }, { status: 404 });
//       }
      
//       if (user.status !== "active") {
//         return NextResponse.json({ message: "Account not active" }, { status: 403 });
//       }
      
//       user.isOnline = true;
//       user.lastSeen = new Date();
//       await user.save();
      
//       const token = jwt.sign(
//         { id: user._id, role: "student" },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
      
//       return NextResponse.json({
//         success: true,
//         message: "Login successful!",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           role: "student",
//           rollNo: user.rollNo,
//           className: user.className,
//           section: user.section,
//           email: user.email
//         }
//       });
//     }

//     // ==================== 4. STUDENT QR LOGIN INFO ====================
//     if (action === "qr-login-info") {
//       if (!studentId) {
//         return NextResponse.json({ message: "Student ID required" }, { status: 400 });
//       }
      
//       const student = await User.findById(studentId);
//       if (!student || student.role !== "student") {
//         return NextResponse.json({ message: "Invalid student" }, { status: 404 });
//       }
      
//       return NextResponse.json({
//         success: true,
//         studentId: student._id,
//         name: student.name,
//         hasEmail: !!student.email,
//         hasPhone: !!student.phone
//       });
//     }

//     // ==================== 5. MAIN LOGIN (Student/Teacher/Admin) ====================
//     if (action === "login" || (!action && identifier && password)) {
//       if (!identifier || !password) {
//         return NextResponse.json({ message: "Email/ID and password required" }, { status: 400 });
//       }

//       let user = null;
//       let foundRole = role || "";
//       const formattedIdentifier = identifier.trim();

//       // STUDENT LOGIN (Roll Number)
//       if (!formattedIdentifier.includes("@")) {
//         user = await User.findOne({ rollNo: formattedIdentifier, role: "student" });
//         if (user) foundRole = "student";
//       }
      
//       // TEACHER or ADMIN LOGIN (Email)
//       if (formattedIdentifier.includes("@")) {
//         const emailId = formattedIdentifier.toLowerCase();
        
//         // Check Teacher first
//         const teacher = await Teacher.findOne({ email: emailId }).populate("subjects", "name");
//         if (teacher) {
//           user = teacher;
//           foundRole = "teacher";
          
//           if (user.status !== "approved" && user.status !== "active") {
//             return NextResponse.json({ 
//               message: "Your application is pending approval from Admin." 
//             }, { status: 403 });
//           }
//         } else {
//           // Check Admin
//           const admin = await Admin.findOne({ email: emailId });
//           if (admin) {
//             user = admin;
//             foundRole = "admin";
            
//             if (user.status !== "active") {
//               return NextResponse.json({ 
//                 message: "Admin account is not active." 
//               }, { status: 403 });
//             }
//           }
//         }
//       }

//       if (!user) {
//         return NextResponse.json({ message: "Invalid credentials" }, { status: 404 });
//       }

//       // ========== ACCOUNT LOCK CHECK ==========
//       if (user.isAccountLocked && await user.isAccountLocked()) {
//         return NextResponse.json({ 
//           message: "Account locked due to multiple failed attempts. Try after 30 minutes." 
//         }, { status: 403 });
//       }

//       // ========== PASSWORD CHECK ==========
//       const isPasswordMatch = await bcrypt.compare(password, user.password);
//       if (!isPasswordMatch) {
//         if (user.recordLoginAttempt) await user.recordLoginAttempt(false);
//         return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
//       }

//       // ========== IP WHITELIST FOR ADMIN ONLY ==========
//       if (foundRole === "admin") {
//         const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
//         if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
//          await user.recordLoginAttempt?.(false);
//           return NextResponse.json({ 
//             message: "Access denied from this location. Contact administrator." 
//           }, { status: 403 });
//         }
//       }

//       // ========== RECORD SUCCESSFUL ATTEMPT ==========
//       if (user.recordLoginAttempt) await user.recordLoginAttempt(true);
      
//       // Update last login info
//       if (foundRole === "admin" && user.updateLastLogin) {
//         await user.updateLastLogin(clientIP, deviceInfo);
//       } else {
//         user.isOnline = true;
//         user.lastSeen = new Date();
//         await user.save();
//       }

//       // ========== 2FA FOR TEACHER & ADMIN (Not for Student) ==========
//       const requires2FA = (foundRole === "teacher" && user.twoFactorEnabled) || 
//                           (foundRole === "admin" && user.twoFactorEnabled);

//       if (requires2FA) {
//         const otpCode = generateOTP();
//         saveOTP(user._id.toString(), otpCode);
//         await sendOTPviaEmail(user.email, otpCode, user.name);
        
//         const tempSessionToken = jwt.sign(
//           { id: user._id, role: foundRole, step: "2fa_pending" },
//           process.env.JWT_SECRET,
//           { expiresIn: "10m" }
//         );
        
//         twoFASessions.set(tempSessionToken, {
//           userId: user._id,
//           role: foundRole,
//           expiresAt: Date.now() + 10 * 60 * 1000,
//           ipAddress: clientIP,
//           deviceInfo: deviceInfo
//         });
        
//         setTimeout(() => {
//           if (twoFASessions.has(tempSessionToken)) twoFASessions.delete(tempSessionToken);
//         }, 10 * 60 * 1000);
        
//         return NextResponse.json({
//           requires2FA: true,
//           tempToken: tempSessionToken,
//           message: "OTP sent to your email for verification."
//         });
//       }

//       // ========== STUDENT DIRECT LOGIN (No 2FA) ==========
//       const token = jwt.sign(
//         { id: user._id, role: foundRole },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );

//       return NextResponse.json({
//         success: true,
//         message: "Login successful!",
//         token,
//         user: { 
//           id: user._id, 
//           name: user.name, 
//           role: foundRole, 
//           email: user.email || null,
//           rollNo: user.rollNo || null,
//           className: user.className || null,
//           section: user.section || null,
//           status: user.status || "active",
//           subjects: user.subjects || [] 
//         }
//       });
//     }

//     // ==================== 6. VERIFY 2FA OTP (Teacher/Admin) ====================
//     if (action === "verify-2fa") {
//       if (!tempToken || !otp) {
//         return NextResponse.json({ message: "Session token and OTP required" }, { status: 400 });
//       }
      
//       const session = twoFASessions.get(tempToken);
//       if (!session || session.expiresAt < Date.now()) {
//         twoFASessions.delete(tempToken);
//         return NextResponse.json({ message: "Session expired. Please login again." }, { status: 401 });
//       }
      
//       const otpResult = verifyOTP(session.userId, otp);
//       if (!otpResult.success) {
//         return NextResponse.json({ message: otpResult.message }, { status: 401 });
//       }
      
//       let user;
//       if (session.role === "teacher") {
//         user = await Teacher.findById(session.userId);
//       } else {
//         user = await Admin.findById(session.userId);
//       }
      
//       if (!user) {
//         return NextResponse.json({ message: "User not found" }, { status: 404 });
//       }
      
//       twoFASessions.delete(tempToken);
      
//       user.isOnline = true;
//       user.lastSeen = new Date();
//       await user.save();
      
//       // Update admin login info
//       if (session.role === "admin" && user.updateLastLogin) {
//         await user.updateLastLogin(session.ipAddress, session.deviceInfo);
//       }
      
//       const token = jwt.sign(
//         { id: user._id, role: session.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
      
//       return NextResponse.json({
//         success: true,
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           role: session.role,
//           email: user.email,
//           rollNo: user.rollNo || null,
//           className: user.className || null,
//           section: user.section || null
//         }
//       });
//     }

//     return NextResponse.json({ message: "Invalid request" }, { status: 400 });

//   } catch (error) {
//     console.error("💥 [LOGIN API] ERROR:", error.message);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }







// app/api/auth/login/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import Teacher from "@/models/Teacher"; 
import Subject from "@/models/Subject"; 
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, saveOTP, verifyOTP, sendOTPviaEmail } from "@/lib/otp";

// Store 2FA sessions temporarily
const twoFASessions = new Map();

// Helper function to get client IP
const getClientIP = (req) => {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
};

// Helper function to get device info
const getDeviceInfo = (req) => {
  return req.headers.get('user-agent') || 'unknown';
};

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { identifier, password, action, role, studentId, otp, email, tempToken } = body;
    const clientIP = getClientIP(req);
    const deviceInfo = getDeviceInfo(req);

    // ==================== 1. STUDENT ADMISSION STATUS CHECK ====================
    if (action === "check_status") {
      const student = await User.findOne({ rollNo: identifier, role: "student" });
      if (!student) {
        return NextResponse.json({ message: "Roll Number not found!" }, { status: 404 });
      }
      return NextResponse.json({ 
        status: student.status, 
        name: student.name 
      }, { status: 200 });
    }

    // ==================== 2. STUDENT EMAIL OTP LOGIN ====================
    if (action === "email-otp") {
      if (!email) {
        return NextResponse.json({ message: "Email required" }, { status: 400 });
      }
      
      const student = await User.findOne({ email: email.toLowerCase().trim(), role: "student" });
      if (!student) {
        return NextResponse.json({ message: "No student account found with this email. Please check or register first." }, { status: 404 });
      }
      
      if (student.status !== "active") {
        return NextResponse.json({ message: "Your account is not active yet. Please wait for admin approval." }, { status: 403 });
      }
      
      const otpCode = generateOTP();
      saveOTP(student._id.toString(), otpCode);
      await sendOTPviaEmail(email, otpCode, student.name);
      
      return NextResponse.json({ 
        success: true, 
        name: student.name,
        studentId: student._id,
        message: "OTP sent to your email"
      });
    }

    // ==================== 3. STUDENT VERIFY OTP & LOGIN ====================
    if (action === "verify-otp") {
      if (!studentId || !otp) {
        return NextResponse.json({ message: "Student ID and OTP required" }, { status: 400 });
      }
      
      const otpResult = verifyOTP(studentId, otp);
      if (!otpResult.success) {
        return NextResponse.json({ message: otpResult.message }, { status: 401 });
      }
      
      const user = await User.findById(studentId);
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      
      // ✅ Verify this is actually a student
      if (user.role !== "student") {
        return NextResponse.json({ 
          message: `This email is registered as ${user.role}. Please use the ${user.role} login tab.` 
        }, { status: 403 });
      }
      
      if (user.status !== "active") {
        return NextResponse.json({ message: "Account not active" }, { status: 403 });
      }
      
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();
      
      const token = jwt.sign(
        { id: user._id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      return NextResponse.json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          name: user.name,
          role: "student",
          rollNo: user.rollNo,
          className: user.className,
          section: user.section,
          email: user.email
        }
      });
    }

    // ==================== 4. STUDENT QR LOGIN INFO ====================
    if (action === "qr-login-info") {
      if (!studentId) {
        return NextResponse.json({ message: "Student ID required" }, { status: 400 });
      }
      
      const student = await User.findById(studentId);
      if (!student || student.role !== "student") {
        return NextResponse.json({ message: "Invalid student" }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        studentId: student._id,
        name: student.name,
        hasEmail: !!student.email,
        hasPhone: !!student.phone
      });
    }

    // ==================== 5. MAIN LOGIN (Student/Teacher/Admin) ====================
    if (action === "login" || (!action && identifier && password)) {
      if (!identifier || !password) {
        return NextResponse.json({ message: "Email/ID and password required" }, { status: 400 });
      }

      let user = null;
      let foundRole = "";
      const formattedIdentifier = identifier.trim();

      // STUDENT LOGIN (Roll Number)
      if (!formattedIdentifier.includes("@")) {
        user = await User.findOne({ rollNo: formattedIdentifier, role: "student" });
        if (user) foundRole = "student";
        
        // ✅ Check if student selected wrong tab
        if (role && role !== "student" && user) {
          return NextResponse.json({ 
            message: `This roll number belongs to a student. Please use the Student login tab.` 
          }, { status: 403 });
        }
      }
      
      // TEACHER or ADMIN LOGIN (Email)
      if (formattedIdentifier.includes("@")) {
        const emailId = formattedIdentifier.toLowerCase();
        
        // ✅ Check role mismatch - Teacher tab selected but email is admin
        if (role === "teacher") {
          const adminCheck = await Admin.findOne({ email: emailId });
          if (adminCheck) {
            return NextResponse.json({ 
              message: "This email is registered as Admin. Please use the Admin login tab." 
            }, { status: 403 });
          }
        }
        
        // ✅ Check role mismatch - Admin tab selected but email is teacher
        if (role === "admin") {
          const teacherCheck = await Teacher.findOne({ email: emailId });
          if (teacherCheck) {
            return NextResponse.json({ 
              message: "This email is registered as Teacher. Please use the Teacher login tab." 
            }, { status: 403 });
          }
          // Also check if it's a student
          const studentCheck = await User.findOne({ email: emailId, role: "student" });
          if (studentCheck) {
            return NextResponse.json({ 
              message: "This email is registered as Student. Please use the Student login tab." 
            }, { status: 403 });
          }
        }
        
        // ✅ Check role mismatch - Student tab selected but email is teacher/admin
        if (role === "student") {
          const teacherCheck = await Teacher.findOne({ email: emailId });
          if (teacherCheck) {
            return NextResponse.json({ 
              message: "This email is registered as Teacher. Please use the Teacher login tab." 
            }, { status: 403 });
          }
          const adminCheck = await Admin.findOne({ email: emailId });
          if (adminCheck) {
            return NextResponse.json({ 
              message: "This email is registered as Admin. Please use the Admin login tab." 
            }, { status: 403 });
          }
        }
        
        // Check Teacher
        const teacher = await Teacher.findOne({ email: emailId }).populate("subjects", "name");
        if (teacher) {
          user = teacher;
          foundRole = "teacher";
          
          if (user.status !== "approved" && user.status !== "active") {
            return NextResponse.json({ 
              message: "Your application is pending approval from Admin." 
            }, { status: 403 });
          }
        } else {
          // Check Admin
          const admin = await Admin.findOne({ email: emailId });
          if (admin) {
            user = admin;
            foundRole = "admin";
            
            if (user.status !== "active") {
              return NextResponse.json({ 
                message: "Admin account is not active." 
              }, { status: 403 });
            }
          }
        }
      }

      if (!user) {
        return NextResponse.json({ 
          message: `No ${role || ""} account found with these credentials. Please check your email/password or select the correct role.` 
        }, { status: 404 });
      }

      // ========== ACCOUNT LOCK CHECK ==========
      if (user.isAccountLocked && await user.isAccountLocked()) {
        return NextResponse.json({ 
          message: "Account locked due to multiple failed attempts. Try after 30 minutes." 
        }, { status: 403 });
      }

      // ========== PASSWORD CHECK ==========
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        if (user.recordLoginAttempt) await user.recordLoginAttempt(false);
        return NextResponse.json({ message: "Invalid password. Please try again." }, { status: 401 });
      }

      // ========== IP WHITELIST FOR ADMIN ONLY ==========
      if (foundRole === "admin") {
        const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
        if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
          await user.recordLoginAttempt?.(false);
          return NextResponse.json({ 
            message: "Access denied from this location. Contact administrator." 
          }, { status: 403 });
        }
      }

      // ========== RECORD SUCCESSFUL ATTEMPT ==========
      if (user.recordLoginAttempt) await user.recordLoginAttempt(true);
      
      // Update last login info
      if (foundRole === "admin" && user.updateLastLogin) {
        await user.updateLastLogin(clientIP, deviceInfo);
      } else {
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save();
      }

      // ========== 2FA FOR TEACHER & ADMIN (Not for Student) ==========
      const requires2FA = (foundRole === "teacher" && user.twoFactorEnabled) || 
                          (foundRole === "admin" && user.twoFactorEnabled);

      if (requires2FA) {
        const otpCode = generateOTP();
        saveOTP(user._id.toString(), otpCode);
        await sendOTPviaEmail(user.email, otpCode, user.name);
        
        const tempSessionToken = jwt.sign(
          { id: user._id, role: foundRole, step: "2fa_pending" },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );
        
        twoFASessions.set(tempSessionToken, {
          userId: user._id,
          role: foundRole,
          expiresAt: Date.now() + 10 * 60 * 1000,
          ipAddress: clientIP,
          deviceInfo: deviceInfo
        });
        
        setTimeout(() => {
          if (twoFASessions.has(tempSessionToken)) twoFASessions.delete(tempSessionToken);
        }, 10 * 60 * 1000);
        
        return NextResponse.json({
          requires2FA: true,
          tempToken: tempSessionToken,
          message: "OTP sent to your email for verification."
        });
      }

      // ========== DIRECT LOGIN (No 2FA) ==========
      const token = jwt.sign(
        { id: user._id, role: foundRole },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({
        success: true,
        message: "Login successful!",
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          role: foundRole, 
          email: user.email || null,
          rollNo: user.rollNo || null,
          className: user.className || null,
          section: user.section || null,
          status: user.status || "active",
          subjects: user.subjects || [] 
        }
      });
    }

    // ==================== 6. VERIFY 2FA OTP (Teacher/Admin) ====================
    if (action === "verify-2fa") {
      if (!tempToken || !otp) {
        return NextResponse.json({ message: "Session token and OTP required" }, { status: 400 });
      }
      
      const session = twoFASessions.get(tempToken);
      if (!session || session.expiresAt < Date.now()) {
        twoFASessions.delete(tempToken);
        return NextResponse.json({ message: "Session expired. Please login again." }, { status: 401 });
      }
      
      const otpResult = verifyOTP(session.userId, otp);
      if (!otpResult.success) {
        return NextResponse.json({ message: otpResult.message }, { status: 401 });
      }
      
      let user;
      if (session.role === "teacher") {
        user = await Teacher.findById(session.userId);
      } else {
        user = await Admin.findById(session.userId);
      }
      
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      
      twoFASessions.delete(tempToken);
      
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save();
      
      if (session.role === "admin" && user.updateLastLogin) {
        await user.updateLastLogin(session.ipAddress, session.deviceInfo);
      }
      
      const token = jwt.sign(
        { id: user._id, role: session.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          role: session.role,
          email: user.email,
          rollNo: user.rollNo || null,
          className: user.className || null,
          section: user.section || null
        }
      });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });

  } catch (error) {
    console.error("💥 [LOGIN API] ERROR:", error.message);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}