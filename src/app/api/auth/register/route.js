// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password, role, secretKey, className, rollNo } = await req.json();

//     // 1. Basic Validation
//     if (!name || !email || !password || !role) {
//       return NextResponse.json({ message: "Zaroori fields (Name, Email, Password) missing hain!" }, { status: 400 });
//     }

//     // Check if Email already exists (Common for everyone now)
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Ye Email pehle se registered hai!" }, { status: 400 });
//     }

//     // 2. Role-Based Check
//     if (role === "student") {
//       if (!rollNo || !className) {
//         return NextResponse.json({ message: "Student ke liye Roll No aur Class lazmi hai!" }, { status: 400 });
//       }

//       const existingStudent = await User.findOne({ rollNo, role: "student" });
//       if (existingStudent) {
//         return NextResponse.json({ message: "Ye Roll Number pehle se registered hai!" }, { status: 400 });
//       }
//     } else {
//       // Staff (Teacher/Admin) validation
//       if (!secretKey) {
//         return NextResponse.json({ message: "Staff ke liye Secret Key lazmi hai!" }, { status: 400 });
//       }

//       const requiredKey = role === "admin" ? process.env.STAFF_ACCESS_CODE : process.env.TEACHER_ACCESS_CODE;
//       if (secretKey !== requiredKey) {
//         return NextResponse.json({ message: "Ghalat Verification Code!" }, { status: 403 });
//       }
//     }

//     // 3. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Create User
//     const newUser = await User.create({
//       name,
//       email, // Ab har koi email ke saath save hoga
//       password: hashedPassword,
//       role,
//       className: role === "student" ? className : undefined,
//       rollNo: role === "student" ? rollNo : undefined,
//     });

//     // 5. Token Generation
//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({ 
//       message: "Mubarak ho! Registration ho gayi.",
//       token, 
//       user: { 
//         id: newUser._id,
//         name: newUser.name, 
//         role: newUser.role,
//         rollNo: newUser.rollNo,
//         email: newUser.email
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("REGISTER_API_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server mein masla aa gaya!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }






















//  with teacher




// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     // 1. Fields mein subject aur phone add kiya
//     const { name, email, password, role, secretKey, className, rollNo, subject, phone } = await req.json();

//     // Basic Validation
//     if (!name || !email || !password || !role) {
//       return NextResponse.json({ message: "Zaroori fields (Name, Email, Password) missing hain!" }, { status: 400 });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Ye Email pehle se registered hai!" }, { status: 400 });
//     }

//     // 2. Role-Based Check
//     if (role === "student") {
//       if (!rollNo || !className) {
//         return NextResponse.json({ message: "Student ke liye Roll No aur Class lazmi hai!" }, { status: 400 });
//       }
//       const existingStudent = await User.findOne({ rollNo, role: "student" });
//       if (existingStudent) {
//         return NextResponse.json({ message: "Ye Roll Number pehle se registered hai!" }, { status: 400 });
//       }
//     } else {
//       // Staff Validation (Teacher/Admin)
//       if (!secretKey) {
//         return NextResponse.json({ message: "Staff ke liye Secret Key lazmi hai!" }, { status: 400 });
//       }

//       const requiredKey = role === "admin" ? process.env.STAFF_ACCESS_CODE : process.env.TEACHER_ACCESS_CODE;
//       if (secretKey !== requiredKey) {
//         return NextResponse.json({ message: "Ghalat Verification Code!" }, { status: 403 });
//       }

//       // TEACHER SPECIAL CHECK: Agar teacher register ho raha hai toh subject lazmi ho
//       if (role === "teacher" && !subject) {
//         return NextResponse.json({ message: "Teacher ke liye Subject batana lazmi hai!" }, { status: 400 });
//       }
//     }

//     // 3. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Create User (Database mein fields map karna)
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       // Students ke liye fields
//       className: role === "student" ? className : undefined,
//       rollNo: role === "student",
//       // Teachers/Staff ke liye fields (Ye add kiya hai)
//       subject: role === "teacher" ? subject : undefined,
//       phone: phone || undefined,
//     });

//     // 5. Token Generation
//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({ 
//       message: "Mubarak ho! Registration ho gayi.",
//       token, 
//       user: { 
//         id: newUser._id,
//         name: newUser.name, 
//         role: newUser.role,
//         email: newUser.email,
//         subject: newUser.subject // Taake frontend ko foran mil jaye
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("REGISTER_API_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server mein masla aa gaya!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }











//  without teacher 




// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name, email, password, role, className, rollNo } = await req.json();

//     // 1. Block any role that is NOT student
//     if (role !== "student") {
//       return NextResponse.json({ 
//         message: "Sirf Students yahan se register ho sakte hain! Teachers ke liye Admin se rabta karein." 
//       }, { status: 403 });
//     }

//     // 2. Basic Validation
//     if (!name || !email || !password || !role) {
//       return NextResponse.json({ message: "Zaroori fields missing hain!" }, { status: 400 });
//     }

//     if (!rollNo || !className) {
//       return NextResponse.json({ message: "Roll No aur Class lazmi hai!" }, { status: 400 });
//     }

//     // 3. Duplicate Check
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ message: "Ye Email pehle se registered hai!" }, { status: 400 });
//     }

//     const existingStudent = await User.findOne({ rollNo, role: "student" });
//     if (existingStudent) {
//       return NextResponse.json({ message: "Ye Roll Number pehle se registered hai!" }, { status: 400 });
//     }

//     // 4. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 5. Create Student Only
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "student",
//       className,
//       rollNo,
//     });

//     // 6. Token Generation
//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({ 
//       message: "Student Registration Successful!",
//       token, 
//       user: { 
//         id: newUser._id,
//         name: newUser.name, 
//         role: newUser.role,
//         email: newUser.email
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("REGISTER_API_ERROR:", error);
//     return NextResponse.json({ message: "Server Error!" }, { status: 500 });
//   }
// }




// only admin


// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; // Naya Admin model use kiya
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     // URL se query parameters nikalne ke liye
//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");

//     // 1. DATABASE RECOVERY CHECK (.env se access key uthayi)
//     const MASTER_SECRET = process.env.admin; 

//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     const { name, email, password, secretKey, phone } = await req.json();

//     // 2. Basic Validation
//     if (!name || !email || !password || !secretKey) {
//       return NextResponse.json({ message: "Zaroori fields missing hain!" }, { status: 400 });
//     }

//     // 3. Admin Model mein duplicate email check karein
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return NextResponse.json({ message: "Ye Admin Email pehle se registered hai!" }, { status: 400 });
//     }

//     // 4. Admin Verification Code Check (.env se STAFF_ACCESS_CODE)
//     if (secretKey !== process.env.STAFF_ACCESS_CODE) {
//       return NextResponse.json({ message: "Ghalat Admin Verification Code!" }, { status: 403 });
//     }

//     // 5. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 6. Create Admin in separate Schema
//     const newAdmin = await Admin.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin", // Model mein default bhi hai, yahan safety ke liye
//       phone: phone || undefined,
//     });

//     // 7. Token Generation
//     const token = jwt.sign(
//       { id: newAdmin._id, role: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({ 
//       message: "Admin account successfully created in Admin Schema!",
//       token, 
//       user: { 
//         id: newAdmin._id,
//         name: newAdmin.name, 
//         role: "admin",
//         email: newAdmin.email,
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("ADMIN_REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server mein masla aa gaya!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }
// // ... (imports same raheinge)

































// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");

//     // 🔴 ERROR YAHAN THA: process.env.admin likha tha
//     // ✅ FIX: Ab ye NEXT_PUBLIC_ADMIN use karega jo aapne set kiya hai
//     const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     const { name, email, password, secretKey, phone } = await req.json();

//     // 2. Basic Validation
//     if (!name || !email || !password || !secretKey) {
//       return NextResponse.json({ message: "Zaroori fields missing hain!" }, { status: 400 });
//     }

//     // 3. Duplicate email check
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return NextResponse.json({ message: "Ye Admin Email pehle se registered hai!" }, { status: 400 });
//     }

//     // 4. Verification Code Check
//     if (secretKey !== process.env.STAFF_ACCESS_CODE) {
//       return NextResponse.json({ message: "Ghalat Admin Verification Code!" }, { status: 403 });
//     }

//     // 5. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 6. Create Admin
//     const newAdmin = await Admin.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//       phone: phone || undefined,
//     });

//     // 7. Token Generation
//     const token = jwt.sign(
//       { id: newAdmin._id, role: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({ 
//       message: "Admin account successfully created!",
//       token, 
//       user: { 
//         id: newAdmin._id,
//         name: newAdmin.name, 
//         role: "admin",
//         email: newAdmin.email,
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("ADMIN_REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server mein masla aa gaya!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }



// -----------------------------------------------------------------
// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; 
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");
//     const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

//     // 1. URL Authorization Check (Jo pehle se tha)
//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     const { name, email, password, secretKey, phone, role } = await req.json();

//     // 2. Basic Validation
//     if (!name || !email || !password || !secretKey) {
//       return NextResponse.json({ message: "Zaroori fields missing hain!" }, { status: 400 });
//     }

//     // 3. Verification Code Check (Dono ke liye lazmi hai jaisa aapka logic tha)
//     if (secretKey !== process.env.STAFF_ACCESS_CODE) {
//       return NextResponse.json({ message: "Ghalat Verification Code!" }, { status: 403 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // --- CASE 1: TEACHER REGISTRATION (With Approval Logic) ---
//     if (role === "teacher") {
//       const existingTeacher = await Teacher.findOne({ email });
//       if (existingTeacher) {
//         return NextResponse.json({ message: "Ye Teacher Email pehle se registered hai!" }, { status: 400 });
//       }

//       await Teacher.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "teacher",
//         phone: phone || "",
//         status: "pending", // Teacher apply karega toh status pending jayega
//       });

//       return NextResponse.json({ 
//         message: "Teacher Application Submitted! Wait for Admin Approval.",
//       }, { status: 201 });
//     }

//     // --- CASE 2: ADMIN REGISTRATION (Direct Active) ---
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return NextResponse.json({ message: "Ye Admin Email pehle se registered hai!" }, { status: 400 });
//     }

//     const newAdmin = await Admin.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//       phone: phone || "",
//     });

//     const token = jwt.sign(
//       { id: newAdmin._id, role: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     return NextResponse.json({ 
//       message: "Admin account successfully created!",
//       token, 
//       user: { 
//         id: newAdmin._id,
//         name: newAdmin.name, 
//         role: "admin",
//         email: newAdmin.email,
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server mein masla aa gaya!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }































































// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; 
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");
//     const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     const { name, email, password, secretKey, phone, role } = await req.json();

//     if (!name || !email || !password || !secretKey || !role) {
//       return NextResponse.json({ message: "Zaroori fields missing hain!" }, { status: 400 });
//     }

//     if (role === "teacher") {
//       if (secretKey !== process.env.TEACHER_ACCESS_CODE) {
//         return NextResponse.json({ message: "Ghalat Teacher Verification Code!" }, { status: 403 });
//       }

//       const existingTeacher = await Teacher.findOne({ email });
//       if (existingTeacher) {
//         return NextResponse.json({ message: "Ye Teacher Email pehle se registered hai!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       await Teacher.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "teacher",
//         phone: phone || "",
//         status: "pending",
//       });

//       return NextResponse.json({ 
//         message: "Teacher Application Submitted! Wait for Admin Approval.",
//       }, { status: 201 });
//     }

//     if (role === "admin") {
//       if (secretKey !== process.env.STAFF_ACCESS_CODE) {
//         return NextResponse.json({ message: "Ghalat Admin Verification Code!" }, { status: 403 });
//       }

//       const existingAdmin = await Admin.findOne({ email });
//       if (existingAdmin) {
//         return NextResponse.json({ message: "Ye Admin Email pehle se registered hai!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newAdmin = await Admin.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "admin",
//         phone: phone || "",
//       });

//       const token = jwt.sign(
//         { id: newAdmin._id, role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return NextResponse.json({ 
//         message: "Admin account successfully created!",
//         token, 
//         user: { 
//           id: newAdmin._id,
//           name: newAdmin.name, 
//           role: "admin",
//           email: newAdmin.email,
//         }
//       }, { status: 201 });
//     }

//     return NextResponse.json({ message: "Ghalat role specify kiya gaya hai!" }, { status: 400 });

//   } catch (error) {
//     console.error("REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server mein masla aa gaya!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }






















// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; 
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");
//     const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

//     // Master access check
//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     const { name, email, password, secretKey, phone, role } = await req.json();

//     if (!name || !email || !password || !secretKey || !role) {
//       return NextResponse.json({ message: "Required fields missing!" }, { status: 400 });
//     }

//     // Password length validation
//     if (password.length < 6) {
//       return NextResponse.json({ message: "Password must be at least 6 characters!" }, { status: 400 });
//     }

//     // TEACHER REGISTRATION
//     if (role === "teacher") {
//       const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || "SMS";
      
//       if (secretKey !== TEACHER_CODE) {
//         return NextResponse.json({ message: "Invalid Teacher Verification Code!" }, { status: 403 });
//       }

//       const existingTeacher = await Teacher.findOne({ email });
//       if (existingTeacher) {
//         return NextResponse.json({ message: "Teacher with this email already exists!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       await Teacher.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "teacher",
//         phone: phone || "",
//         status: "pending",
//       });

//       return NextResponse.json({ 
//         message: "Teacher application submitted! Waiting for admin approval.",
//       }, { status: 201 });
//     }

//     // ADMIN REGISTRATION
//     if (role === "admin") {
//       const STAFF_CODE = process.env.STAFF_ACCESS_CODE || "SAC";
      
//       if (secretKey !== STAFF_CODE) {
//         return NextResponse.json({ message: "Invalid Staff Access Code!" }, { status: 403 });
//       }

//       const existingAdmin = await Admin.findOne({ email });
//       if (existingAdmin) {
//         return NextResponse.json({ message: "Admin with this email already exists!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newAdmin = await Admin.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "admin",
//         phone: phone || "",
//       });

//       const token = jwt.sign(
//         { id: newAdmin._id, role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return NextResponse.json({ 
//         message: "Admin account created successfully!",
//         token, 
//         user: { 
//           id: newAdmin._id,
//           name: newAdmin.name, 
//           role: "admin",
//           email: newAdmin.email,
//         }
//       }, { status: 201 });
//     }

//     return NextResponse.json({ message: "Invalid role specified!" }, { status: 400 });

//   } catch (error) {
//     console.error("REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Internal server error!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }






































// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; 
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { v2 as cloudinary } from "cloudinary";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");
//     const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

//     // Master access check
//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     // Check if request is multipart form data (with photo) or JSON
//     let name, email, password, secretKey, phone, role;
//     let photoFile = null;
    
//     const contentType = req.headers.get("content-type") || "";
    
//     if (contentType.includes("multipart/form-data")) {
//       const formData = await req.formData();
//       name = formData.get("name");
//       email = formData.get("email");
//       password = formData.get("password");
//       secretKey = formData.get("secretKey");
//       phone = formData.get("phone");
//       role = formData.get("role");
//       photoFile = formData.get("photo");
//     } else {
//       const body = await req.json();
//       name = body.name;
//       email = body.email;
//       password = body.password;
//       secretKey = body.secretKey;
//       phone = body.phone;
//       role = body.role;
//     }

//     if (!name || !email || !password || !secretKey || !role) {
//       return NextResponse.json({ message: "Required fields missing!" }, { status: 400 });
//     }

//     // Password length validation
//     if (password.length < 6) {
//       return NextResponse.json({ message: "Password must be at least 6 characters!" }, { status: 400 });
//     }

//     // TEACHER REGISTRATION
//     if (role === "teacher") {
//       const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || "SMS";
      
//       if (secretKey !== TEACHER_CODE) {
//         return NextResponse.json({ message: "Invalid Teacher Verification Code!" }, { status: 403 });
//       }

//       const existingTeacher = await Teacher.findOne({ email });
//       if (existingTeacher) {
//         return NextResponse.json({ message: "Teacher with this email already exists!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       // Upload photo if provided
//       let photoUrl = null;
//       let photoPublicId = null;
      
//       if (photoFile && photoFile.size > 0) {
//         try {
//           const bytes = await photoFile.arrayBuffer();
//           const buffer = Buffer.from(bytes);
          
//           const uploadResponse = await new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream(
//               { folder: "teacher_photos", width: 300, height: 300, crop: "fill" },
//               (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result);
//               }
//             ).end(buffer);
//           });
          
//           photoUrl = uploadResponse.secure_url;
//           photoPublicId = uploadResponse.public_id;
//         } catch (uploadError) {
//           console.error("Photo upload error:", uploadError);
//         }
//       }

//       await Teacher.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "teacher",
//         phone: phone || "",
//         status: "pending",
//         photoUrl,
//         photoPublicId
//       });

//       return NextResponse.json({ 
//         message: "Teacher application submitted! Waiting for admin approval.",
//       }, { status: 201 });
//     }

//     // ADMIN REGISTRATION
//     if (role === "admin") {
//       const STAFF_CODE = process.env.STAFF_ACCESS_CODE || "SAC";
      
//       if (secretKey !== STAFF_CODE) {
//         return NextResponse.json({ message: "Invalid Staff Access Code!" }, { status: 403 });
//       }

//       const existingAdmin = await Admin.findOne({ email });
//       if (existingAdmin) {
//         return NextResponse.json({ message: "Admin with this email already exists!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newAdmin = await Admin.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "admin",
//         phone: phone || "",
//       });

//       const token = jwt.sign(
//         { id: newAdmin._id, role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return NextResponse.json({ 
//         message: "Admin account created successfully!",
//         token, 
//         user: { 
//           id: newAdmin._id,
//           name: newAdmin.name, 
//           role: "admin",
//           email: newAdmin.email,
//         }
//       }, { status: 201 });
//     }

//     return NextResponse.json({ message: "Invalid role specified!" }, { status: 400 });

//   } catch (error) {
//     console.error("REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Internal server error!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }
















































// // app/api/auth/register/route.js

// import dbConnect from "@/lib/mongodb";
// import Admin from "@/models/Admin"; 
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { v2 as cloudinary } from "cloudinary";

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const adminAccess = searchParams.get("admin");
//     const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

//     // Master access check
//     if (!adminAccess || adminAccess !== MASTER_SECRET) {
//       return NextResponse.json({ 
//         message: "Unauthorized! Registration access is restricted." 
//       }, { status: 403 });
//     }

//     // Check if request is multipart form data (with photo) or JSON
//     let name, email, password, secretKey, phone, role;
//     let qualification = "";
//     let photoFile = null;
    
//     const contentType = req.headers.get("content-type") || "";
    
//     if (contentType.includes("multipart/form-data")) {
//       const formData = await req.formData();
//       name = formData.get("name");
//       email = formData.get("email");
//       password = formData.get("password");
//       secretKey = formData.get("secretKey");
//       phone = formData.get("phone");
//       role = formData.get("role");
//       qualification = formData.get("qualification") || "";
//       photoFile = formData.get("photo");
//     } else {
//       const body = await req.json();
//       name = body.name;
//       email = body.email;
//       password = body.password;
//       secretKey = body.secretKey;
//       phone = body.phone;
//       role = body.role;
//       qualification = body.qualification || "";
//     }

//     if (!name || !email || !password || !secretKey || !role) {
//       return NextResponse.json({ message: "Required fields missing!" }, { status: 400 });
//     }

//     // Password length validation
//     if (password.length < 6) {
//       return NextResponse.json({ message: "Password must be at least 6 characters!" }, { status: 400 });
//     }

//     // ============================================================
//     // TEACHER REGISTRATION (SIMPLIFIED)
//     // ============================================================
//     if (role === "teacher") {
//       const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || "SMS";
      
//       if (secretKey !== TEACHER_CODE) {
//         return NextResponse.json({ message: "Invalid Teacher Verification Code!" }, { status: 403 });
//       }

//       // Check if teacher already exists
//       const existingTeacher = await Teacher.findOne({ email });
//       if (existingTeacher) {
//         return NextResponse.json({ message: "Teacher with this email already exists!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       // Upload photo if provided
//       let photoUrl = null;
//       let photoPublicId = null;
      
//       if (photoFile && photoFile.size > 0) {
//         try {
//           const bytes = await photoFile.arrayBuffer();
//           const buffer = Buffer.from(bytes);
          
//           const uploadResponse = await new Promise((resolve, reject) => {
//             cloudinary.uploader.upload_stream(
//               { folder: "teacher_photos", width: 300, height: 300, crop: "fill" },
//               (error, result) => {
//                 if (error) reject(error);
//                 else resolve(result);
//               }
//             ).end(buffer);
//           });
          
//           photoUrl = uploadResponse.secure_url;
//           photoPublicId = uploadResponse.public_id;
//         } catch (uploadError) {
//           console.error("Photo upload error:", uploadError);
//         }
//       }

//       // ✅ CREATE TEACHER WITH FULL SCHEMA FIELDS
//       const newTeacher = await Teacher.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "teacher",
//         phone: phone || "",
//         status: "pending",
//         qualification: qualification || "",
//         photoUrl,
//         photoPublicId,
//         joiningDate: new Date(),
//         // Teacher ID, teacherCode, cardNumber will be auto-generated by pre-save hook
//         // 2FA enabled by default (schema default)
//         // preferences will use schema defaults
//       });

//       console.log("✅ Teacher registered:", {
//         id: newTeacher._id,
//         name: newTeacher.name,
//         email: newTeacher.email,
//         teacherId: newTeacher.teacherId,
//         teacherCode: newTeacher.teacherCode,
//         cardNumber: newTeacher.cardNumber,
//         status: newTeacher.status
//       });

//       return NextResponse.json({ 
//         message: "Teacher application submitted! Waiting for admin approval.",
//         teacher: {
//           id: newTeacher._id,
//           name: newTeacher.name,
//           email: newTeacher.email,
//           teacherId: newTeacher.teacherId,
//           teacherCode: newTeacher.teacherCode,
//           status: newTeacher.status,
//           qualification: newTeacher.qualification,
//           photoUrl: newTeacher.photoUrl
//         }
//       }, { status: 201 });
//     }

//     // ============================================================
//     // ADMIN REGISTRATION
//     // ============================================================
//     if (role === "admin") {
//       const STAFF_CODE = process.env.STAFF_ACCESS_CODE || "SAC";
      
//       if (secretKey !== STAFF_CODE) {
//         return NextResponse.json({ message: "Invalid Staff Access Code!" }, { status: 403 });
//       }

//       const existingAdmin = await Admin.findOne({ email });
//       if (existingAdmin) {
//         return NextResponse.json({ message: "Admin with this email already exists!" }, { status: 400 });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const newAdmin = await Admin.create({
//         name,
//         email,
//         password: hashedPassword,
//         role: "admin",
//         phone: phone || "",
//       });

//       const token = jwt.sign(
//         { id: newAdmin._id, role: "admin" },
//         process.env.JWT_SECRET,
//         { expiresIn: "1d" }
//       );

//       return NextResponse.json({ 
//         message: "Admin account created successfully!",
//         token, 
//         user: { 
//           id: newAdmin._id,
//           name: newAdmin.name, 
//           role: "admin",
//           email: newAdmin.email,
//         }
//       }, { status: 201 });
//     }

//     return NextResponse.json({ message: "Invalid role specified!" }, { status: 400 });

//   } catch (error) {
//     console.error("REGISTER_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Internal server error!", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }






















































































































// app/api/auth/register/route.js

import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin"; 
import Teacher from "@/models/Teacher"; 
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const adminAccess = searchParams.get("admin");
    const MASTER_SECRET = process.env.NEXT_PUBLIC_ADMIN; 

    // Master access check
    if (!adminAccess || adminAccess !== MASTER_SECRET) {
      return NextResponse.json({ 
        message: "Unauthorized! Registration access is restricted." 
      }, { status: 403 });
    }

    // Check if request is multipart form data (with photo) or JSON
    let name, email, password, secretKey, phone, role;
    let qualification = "";
    let photoFile = null;
    
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = formData.get("name");
      email = formData.get("email");
      password = formData.get("password");
      secretKey = formData.get("secretKey");
      phone = formData.get("phone");
      role = formData.get("role");
      qualification = formData.get("qualification") || "";
      photoFile = formData.get("photo");
    } else {
      const body = await req.json();
      name = body.name;
      email = body.email;
      password = body.password;
      secretKey = body.secretKey;
      phone = body.phone;
      role = body.role;
      qualification = body.qualification || "";
    }

    // Validate required fields
    if (!name || !email || !password || !secretKey || !role) {
      return NextResponse.json({ message: "Required fields missing!" }, { status: 400 });
    }

    // Name validation
    if (name.trim().length < 3) {
      return NextResponse.json({ message: "Name must be at least 3 characters!" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address!" }, { status: 400 });
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters!" }, { status: 400 });
    }

    // ✅ Photo size validation - 4MB
    const MAX_PHOTO_SIZE = 4 * 1024 * 1024; // 4MB
    if (photoFile && photoFile.size > MAX_PHOTO_SIZE) {
      return NextResponse.json({ 
        message: "Photo size should be less than 4MB!" 
      }, { status: 400 });
    }

    // ✅ Helper: Upload photo to Cloudinary
    const uploadPhoto = async (file, folder) => {
      if (!file || file.size === 0) return { url: null, publicId: null };
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              folder, 
              width: 500, 
              height: 500, 
              crop: "fill",
              quality: "auto",
              resource_type: "image"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        
        return {
          url: uploadResponse.secure_url,
          publicId: uploadResponse.public_id
        };
      } catch (error) {
        console.error(`Photo upload error for ${folder}:`, error);
        return { url: null, publicId: null };
      }
    };

    // ============================================================
    // TEACHER REGISTRATION
    // ============================================================
    if (role === "teacher") {
      const TEACHER_CODE = process.env.TEACHER_ACCESS_CODE || "SMS";
      
      if (secretKey !== TEACHER_CODE) {
        return NextResponse.json({ message: "Invalid Teacher Verification Code!" }, { status: 403 });
      }

      const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() });
      if (existingTeacher) {
        return NextResponse.json({ message: "Teacher with this email already exists!" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Upload photo
      const { url: photoUrl, publicId: photoPublicId } = await uploadPhoto(photoFile, "teacher_photos");

      const newTeacher = await Teacher.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "teacher",
        phone: phone || "",
        status: "pending",
        qualification: qualification || "",
        photoUrl,
        photoPublicId,
        joiningDate: new Date(),
      });

      console.log("✅ Teacher registered:", {
        id: newTeacher._id,
        name: newTeacher.name,
        email: newTeacher.email,
        teacherCode: newTeacher.teacherCode,
        status: newTeacher.status
      });

      return NextResponse.json({ 
        success: true,
        message: "Teacher application submitted! Waiting for admin approval.",
        teacher: {
          id: newTeacher._id,
          name: newTeacher.name,
          email: newTeacher.email,
          teacherCode: newTeacher.teacherCode,
          status: newTeacher.status,
          qualification: newTeacher.qualification,
          photoUrl: newTeacher.photoUrl
        }
      }, { status: 201 });
    }

    // ============================================================
    // ADMIN REGISTRATION (NO AUTO-LOGIN, WITH PHOTO SUPPORT)
    // ============================================================
    if (role === "admin") {
      const STAFF_CODE = process.env.STAFF_ACCESS_CODE || "SAC";
      
      if (secretKey !== STAFF_CODE) {
        return NextResponse.json({ message: "Invalid Staff Access Code!" }, { status: 403 });
      }

      const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
      if (existingAdmin) {
        return NextResponse.json({ message: "Admin with this email already exists!" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Upload photo for admin too
      const { url: photoUrl, publicId: photoPublicId } = await uploadPhoto(photoFile, "admin_photos");

      const newAdmin = await Admin.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin",
        phone: phone || "",
        photoUrl,
        photoPublicId,
        status: "active",
      });

      console.log("✅ Admin registered:", {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        photoUrl: newAdmin.photoUrl
      });

      return NextResponse.json({ 
        success: true,
        message: "Admin account created successfully! Please login to continue.",
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: "admin",
          photoUrl: newAdmin.photoUrl
        }
      }, { status: 201 });
    }

    return NextResponse.json({ message: "Invalid role specified!" }, { status: 400 });

  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json({ 
      success: false,
      message: "Internal server error!", 
      error: error.message 
    }, { status: 500 });
  }
}