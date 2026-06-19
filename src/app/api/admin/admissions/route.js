// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// // --- GET: Pending Admissions ki list dikhane ke liye ---
// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingStudents = await User.find({ 
//       role: "student", 
//       status: "inactive" 
//     }).sort({ createdAt: -1 });

//     return NextResponse.json(pendingStudents, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Data fetch nahi ho saka" }, { status: 500 });
//   }
// }
// export async function PUT(req) { // PATCH ko PUT kar diya
//   try {
//     await dbConnect();
//     const body = await req.json();
    
//     // Yahan userId, rollNumber (front-end se jo aa raha hai), section, aur action le rahe hain
//     const { userId, rollNumber, section, action } = body;

//     if (action === "approve") {
//       if (!rollNumber || !section) {
//         return NextResponse.json({ message: "Roll Number aur Section dena lazmi hai!" }, { status: 400 });
//       }

//       // 1. Duplicate check (Schema mein field rollNo hai)
//       const duplicateRoll = await User.findOne({ 
//         rollNo: rollNumber, // Schema ke mutabiq rollNo use karein
//         section: section.toUpperCase(), 
//         status: "active" 
//       });

//       if (duplicateRoll) {
//         return NextResponse.json({ message: "Ye Roll Number is section mein pehle se hai!" }, { status: 400 });
//       }

//       // 2. Student ko Update karein (PUT style - replacing status/role details)
//       const updatedStudent = await User.findByIdAndUpdate(
//         userId,
//         { 
//           $set: { // $set safe tarika hai specific fields update karne ka
//             status: "active", 
//             rollNo: rollNumber, // Aapke Schema mein "rollNo" hai
//             section: section.toUpperCase() 
//           }
//         },
//         { new: true, runValidators: true }
//       );

//       if (!updatedStudent) {
//         return NextResponse.json({ message: "Student nahi mila" }, { status: 404 });
//       }

//       return NextResponse.json({ 
//         message: `${updatedStudent.name} is now approved!`,
//         student: updatedStudent 
//       }, { status: 200 });
//     }

//     // Reject logic
//     if (action === "reject") {
//        await User.findByIdAndDelete(userId);
//        return NextResponse.json({ message: "Request rejected" });
//     }

//     return NextResponse.json({ message: "Invalid Action" }, { status: 400 });

//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }











































































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission"; // Pending requests yahan hain
// import { NextResponse } from "next/server";

// // --- GET: Pending Admissions ki list dikhane ke liye ---
// export async function GET() {
//   try {
//     await dbConnect();
//     // Ab hum Admission model se pending requests nikal rahe hain
//     const pendingRequests = await Admission.find({ 
//       status: "pending" 
//     }).sort({ createdAt: -1 });

//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Data fetch nahi ho saka" }, { status: 500 });
//   }
// }

// // --- PUT: Approve ya Reject karne ke liye ---
// export async function PUT(req) {
//  try {
//     await dbConnect();
//     const body = await req.json();
//     const { requestId, rollNumber, section, action } = body; // Frontend se ab requestId aayegi

//     if (action === "approve") {
//        // Check if requestId exists
//        if(!requestId) return NextResponse.json({ message: "Request ID missing" }, { status: 400 });

//        const requestData = await Admission.findById(requestId);
//        if (!requestData) {
//          return NextResponse.json({ message: "Admission request nahi mili (Database Error)" }, { status: 404 });
//        }
//       // 1. Check karein ke ye Roll Number User table mein pehle se toh nahi
//       const duplicateRoll = await User.findOne({ 
//         rollNo: rollNumber,
//         role: "student"
//       });

//       if (duplicateRoll) {
//         return NextResponse.json({ message: "Ye Roll Number pehle se kisi student ko assigned hai!" }, { status: 400 });
//       }

//       // 2. Admission model se request ka data nikalain
//       // const requestData = await Admission.findById(requestId);
//       // if (!requestData) {
//       //   return NextResponse.json({ message: "Admission request nahi mili" }, { status: 404 });
//       // }

//       // 3. User Model mein data Move (Shift) karein
//       const newStudent = await User.create({
//         name: requestData.name,
//         email: requestData.email, // Agar email hai
//         password: requestData.password, // Jo hashed tha pehle se
//         phone: requestData.phone,
//         rollNo: rollNumber,
//         className: requestData.className,
//         section: section.toUpperCase(),
//         role: "student",
//         status: "active" // Approve hote hi active
//       });

//       // 4. Admission model se ye request Delete kar dein
//       await Admission.findByIdAndDelete(requestId);

//       return NextResponse.json({ 
//         message: `${newStudent.name} is now approved and enrolled!`,
//         student: newStudent 
//       }, { status: 200 });
//     }

//     // --- REJECT LOGIC ---
//     if (action === "reject") {
//        const deleted = await Admission.findByIdAndDelete(requestId);
//        if (!deleted) return NextResponse.json({ message: "Request nahi mili" }, { status: 404 });
//        return NextResponse.json({ message: "Admission request rejected and deleted." });
//     }

//     return NextResponse.json({ message: "Invalid Action" }, { status: 400 });

//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
//   }
// }
















// fees + new ad





// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission";
// import Fee from "@/models/Fee"; // ✅ Fee model import kar liya
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingRequests = await Admission.find({ 
//       status: "pending" 
//     }).sort({ createdAt: -1 });
//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Data fetch nahi ho saka" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//  try {
//     await dbConnect();
//     const body = await req.json();
//     const { requestId, rollNumber, section, action } = body;

//     if (action === "approve") {
//        if(!requestId) return NextResponse.json({ message: "Request ID missing" }, { status: 400 });

//        const requestData = await Admission.findById(requestId);
//        if (!requestData) {
//          return NextResponse.json({ message: "Admission request nahi mili (Database Error)" }, { status: 404 });
//        }

//       const duplicateRoll = await User.findOne({ 
//         rollNo: rollNumber,
//         role: "student"
//       });

//       if (duplicateRoll) {
//         return NextResponse.json({ message: "Ye Roll Number pehle se kisi student ko assigned hai!" }, { status: 400 });
//       }

//       // 1. User Model mein data Move karein
//       const newStudent = await User.create({
//         name: requestData.name,
//         email: requestData.email,
//         password: requestData.password, 
//         phone: requestData.phone,
//         rollNo: rollNumber,
//         className: requestData.className,
//         section: section.toUpperCase(),
//         role: "student",
//         status: "active"
//       });

//       // ✅ 2. AUTO-FEE GENERATION LOGIC (Naye bache ke liye)
//       const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + " " + new Date().getFullYear();
      
//       await Fee.create({
//         studentId: newStudent._id,
//         className: newStudent.className, // Student ki class auto-pick
//         month: currentMonth,             // Current month (e.g. April 2026)
//         amount: 5000,                    // Default amount (aap change kar sakte hain)
//         status: "unpaid"                 // By default unpaid
//       });

//       // 3. Admission model se request Delete kar dein
//       await Admission.findByIdAndDelete(requestId);

//       return NextResponse.json({ 
//         message: `${newStudent.name} is now approved and fee record created!`,
//         student: newStudent 
//       }, { status: 200 });
//     }

//     if (action === "reject") {
//        const deleted = await Admission.findByIdAndDelete(requestId);
//        if (!deleted) return NextResponse.json({ message: "Request nahi mili" }, { status: 404 });
//        return NextResponse.json({ message: "Admission request rejected." });
//     }

//     return NextResponse.json({ message: "Invalid Action" }, { status: 400 });

//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
//   }
// }












// --------------------------------

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission";
// import Fee from "@/models/Fee"; 
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Data fetch nahi ho saka" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { requestId, rollNumber, section, action, admissionFee } = body;

//     if (action === "approve") {
//       if (!requestId) return NextResponse.json({ message: "Request ID missing" }, { status: 400 });

//       const requestData = await Admission.findById(requestId);
//       if (!requestData) {
//         return NextResponse.json({ message: "Admission request nahi mili!" }, { status: 404 });
//       }

//       const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
//       if (duplicateRoll) {
//         return NextResponse.json({ message: "Ye Roll Number pehle se assigned hai!" }, { status: 400 });
//       }

//       // 1. Create Student
//       const newStudent = await User.create({
//         name: requestData.name,
//         email: requestData.email,
//         password: requestData.password, 
//         phone: requestData.phone,
//         rollNo: rollNumber,
//         className: requestData.className,
//         section: section.toUpperCase(),
//         role: "student",
//         status: "active"
//       });

//       // 2. Auto-Fee Generation (Schema ke hisab se)
//       const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + " " + new Date().getFullYear();
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 7); // 7 din ka time

//       try {
//         await Fee.create({
//           studentId: newStudent._id,
//           className: newStudent.className,
//           month: currentMonth,
//           amount: Number(admissionFee) || 5000, 
//           status: "unpaid",
//           dueDate: dueDate,
//           feeType: "admission",
//           rollNo: rollNumber,
//           discount: 0
//         });
//       } catch (feeError) {
//         // Rollback student if fee fails
//         await User.findByIdAndDelete(newStudent._id);
//         return NextResponse.json({ message: "Fee creation failed: " + feeError.message }, { status: 500 });
//       }

//       await Admission.findByIdAndDelete(requestId);
//       return NextResponse.json({ message: `${newStudent.name} enroll ho gaya!` }, { status: 200 });
//     }

//     if (action === "reject") {
//       await Admission.findByIdAndDelete(requestId);
//       return NextResponse.json({ message: "Admission request rejected." });
//     }

//     return NextResponse.json({ message: "Invalid Action" }, { status: 400 });

//   } catch (error) {
//     return NextResponse.json({ message: "Server error: " + error.message }, { status: 500 });
//   }
// }




// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission";
// import Fee from "@/models/Fee"; 
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Failed to fetch admission data" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { requestId, rollNumber, section, action, admissionFee } = body;

//     // Boss: Check if requestId exists first
//     if (!requestId) {
//       return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
//     }

//     if (action === "approve") {
//       const requestData = await Admission.findById(requestId);
//       if (!requestData) {
//         return NextResponse.json({ message: "Admission request not found" }, { status: 404 });
//       }

//       // Check for duplicate Roll Number in the student role
//       const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
//       if (duplicateRoll) {
//         return NextResponse.json({ message: "This Roll Number is already assigned" }, { status: 400 });
//       }

//       // 1. Create New Student record
//       const newStudent = await User.create({
//         name: requestData.name,
//         email: requestData.email,
//         password: requestData.password, 
//         phone: requestData.phone,
//         rollNo: rollNumber,
//         className: requestData.className,
//         section: section.toUpperCase(),
//         role: "student",
//         status: "active"
//       });

//       // 2. Generate Initial Fee record
//       const date = new Date();
//       const currentMonth = date.toLocaleString('en-US', { month: 'long' }) + " " + date.getFullYear();
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 7); // Set due date to 7 days from now

//       try {
//         await Fee.create({
//           studentId: newStudent._id,
//           className: newStudent.className,
//           month: currentMonth,
//           amount: Number(admissionFee) || 5000, 
//           status: "unpaid",
//           dueDate: dueDate,
//           feeType: "admission",
//           rollNo: rollNumber,
//           discount: 0
//         });
//       } catch (feeError) {
//         // Boss: Rollback student creation if fee fails to maintain data integrity
//         await User.findByIdAndDelete(newStudent._id);
//         return NextResponse.json({ message: "Process failed at fee generation: " + feeError.message }, { status: 500 });
//       }

//       // Delete the pending request after successful enrollment
//       await Admission.findByIdAndDelete(requestId);
//       return NextResponse.json({ message: `${newStudent.name} has been enrolled successfully!` }, { status: 200 });
//     }

//     if (action === "reject") {
//       const deletedRequest = await Admission.findByIdAndDelete(requestId);
//       if (!deletedRequest) {
//         return NextResponse.json({ message: "Request already processed or not found" }, { status: 404 });
//       }
//       return NextResponse.json({ message: "Admission request has been rejected" }, { status: 200 });
//     }

//     return NextResponse.json({ message: "Invalid action type provided" }, { status: 400 });

//   } catch (error) {
//     return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
//   }
// }










































































// ID CARD

// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission";
// import Fee from "@/models/Fee";
// import StudentIDCard from "@/models/StudentIDCard";
// import { NextResponse } from "next/server";
// import QRCode from "qrcode";

// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ message: "Failed to fetch admission data" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { requestId, rollNumber, section, action, admissionFee } = body;

//     // Check if requestId exists
//     if (!requestId) {
//       return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
//     }

//     if (action === "approve") {
//       const requestData = await Admission.findById(requestId);
//       if (!requestData) {
//         return NextResponse.json({ message: "Admission request not found" }, { status: 404 });
//       }

//       // Check for duplicate Roll Number
//       const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
//       if (duplicateRoll) {
//         return NextResponse.json({ message: "This Roll Number is already assigned" }, { status: 400 });
//       }

//       // 1. Create New Student record
//       const newStudent = await User.create({
//         name: requestData.name,
//         email: requestData.email,
//         password: requestData.password,
//         phone: requestData.phone,
//         rollNo: rollNumber,
//         className: requestData.className,
//         section: section.toUpperCase(),
//         role: "student",
//         status: "active"
//       });

//       // 2. Generate Initial Fee record
//       const date = new Date();
//       const currentMonth = date.toLocaleString('en-US', { month: 'long' }) + " " + date.getFullYear();
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 7);

//       try {
//         await Fee.create({
//           studentId: newStudent._id,
//           className: newStudent.className,
//           month: currentMonth,
//           amount: Number(admissionFee) || 5000,
//           status: "unpaid",
//           dueDate: dueDate,
//           feeType: "admission",
//           rollNo: rollNumber,
//           discount: 0
//         });
//       } catch (feeError) {
//         // Rollback student creation if fee fails
//         await User.findByIdAndDelete(newStudent._id);
//         return NextResponse.json({ message: "Process failed at fee generation: " + feeError.message }, { status: 500 });
//       }

//       // 3. 🪪 Generate ID Card for Student
//       let idCard = null;
//       try {
//         const cardNumber = `SID-${new Date().getFullYear()}-${newStudent._id.toString().slice(-6)}`;
//         const qrData = `${process.env.NEXTAUTH_URL}/verify/student/${newStudent._id}`;
//         const qrCodeDataUrl = await QRCode.toDataURL(qrData);
        
//         idCard = await StudentIDCard.create({
//           studentId: newStudent._id,
//           cardNumber: cardNumber,
//           rollNumber: rollNumber,
//           course: requestData.course || "Matric",
//           batch: new Date().getFullYear().toString(),
//           issueDate: new Date(),
//           expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
//           qrCodeData: qrCodeDataUrl,
//           status: 'active'
//         });
        
//         console.log(`✅ ID Card generated for ${newStudent.name} - Card No: ${cardNumber}`);
//       } catch (cardError) {
//         console.error("ID Card generation failed:", cardError);
//         // Don't block enrollment, just log error
//       }

//       // 4. Delete the pending request after successful enrollment
//       await Admission.findByIdAndDelete(requestId);
      
//       return NextResponse.json({ 
//         message: `${newStudent.name} has been enrolled successfully!`,
//         student: {
//           id: newStudent._id,
//           name: newStudent.name,
//           rollNo: rollNumber,
//           className: newStudent.className
//         },
//         idCard: idCard ? {
//           cardNumber: idCard.cardNumber,
//           status: idCard.status
//         } : null
//       }, { status: 200 });
//     }

//     if (action === "reject") {
//       const deletedRequest = await Admission.findByIdAndDelete(requestId);
//       if (!deletedRequest) {
//         return NextResponse.json({ message: "Request already processed or not found" }, { status: 404 });
//       }
//       return NextResponse.json({ message: "Admission request has been rejected" }, { status: 200 });
//     }

//     return NextResponse.json({ message: "Invalid action type provided" }, { status: 400 });

//   } catch (error) {
//     console.error("PUT error:", error);
//     return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
//   }
// }






















// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission";
// import Fee from "@/models/Fee";
// import StudentIDCard from "@/models/StudentIDCard";
// import { NextResponse } from "next/server";
// import QRCode from "qrcode";

// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ message: "Failed to fetch admission data" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { requestId, rollNumber, section, action, admissionFee } = body;

//     if (!requestId) {
//       return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
//     }

//     if (action === "approve") {
//       const requestData = await Admission.findById(requestId);
//       if (!requestData) {
//         return NextResponse.json({ message: "Admission request not found" }, { status: 404 });
//       }

//       // Check for duplicate Roll Number
//       const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
//       if (duplicateRoll) {
//         return NextResponse.json({ message: "This Roll Number is already assigned" }, { status: 400 });
//       }

//       // 1. Create New Student record (with fatherName and photo)
//       const newStudent = await User.create({
//         name: requestData.name,
//         fatherName: requestData.fatherName,
//         email: requestData.email,
//         password: requestData.password,
//         phone: requestData.phone,
//         rollNo: rollNumber,
//         className: requestData.className,
//         section: section.toUpperCase(),
//         role: "student",
//         status: "active",
//         photoUrl: requestData.photoUrl || null,      // 👈 ADD PHOTO
//         photoPublicId: requestData.photoPublicId || null
//       });

//       // 2. Generate Initial Fee record
//       const date = new Date();
//       const currentMonth = date.toLocaleString('en-US', { month: 'long' }) + " " + date.getFullYear();
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 7);

//       try {
//         await Fee.create({
//           studentId: newStudent._id,
//           className: newStudent.className,
//           month: currentMonth,
//           amount: Number(admissionFee) || 5000,
//           status: "unpaid",
//           dueDate: dueDate,
//           feeType: "admission",
//           rollNo: rollNumber,
//           discount: 0
//         });
//       } catch (feeError) {
//         // Rollback student creation if fee fails
//         await User.findByIdAndDelete(newStudent._id);
//         return NextResponse.json({ message: "Process failed at fee generation: " + feeError.message }, { status: 500 });
//       }

//       // 3. Generate ID Card for Student with Photo
//       let idCard = null;
//       try {
//         const cardNumber = `SID-${new Date().getFullYear()}-${newStudent._id.toString().slice(-6)}`;
//         const qrData = `${process.env.NEXTAUTH_URL}/verify/student/${newStudent._id}`;
//         const qrCodeDataUrl = await QRCode.toDataURL(qrData);
        
//         idCard = await StudentIDCard.create({
//           studentId: newStudent._id,
//           cardNumber: cardNumber,
//           rollNumber: rollNumber,
//           course: requestData.course || "Matric",
//           batch: new Date().getFullYear().toString(),
//           issueDate: new Date(),
//           expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
//           qrCodeData: qrCodeDataUrl,
//           photoUrl: requestData.photoUrl || null,  // 👈 ADD PHOTO TO ID CARD
//           status: 'active'
//         });
        
//         console.log(`✅ ID Card generated for ${newStudent.name} - Card No: ${cardNumber}`);
//       } catch (cardError) {
//         console.error("ID Card generation failed:", cardError);
//       }

//       // 4. Delete the pending request
//       await Admission.findByIdAndDelete(requestId);
      
//       return NextResponse.json({ 
//         message: `${newStudent.name} has been enrolled successfully!`,
//         student: {
//           id: newStudent._id,
//           name: newStudent.name,
//           fatherName: newStudent.fatherName,
//           rollNo: rollNumber,
//           className: newStudent.className,
//           photoUrl: requestData.photoUrl || null
//         },
//         idCard: idCard ? {
//           cardNumber: idCard.cardNumber,
//           status: idCard.status
//         } : null
//       }, { status: 200 });
//     }

//     if (action === "reject") {
//       const deletedRequest = await Admission.findByIdAndDelete(requestId);
//       if (!deletedRequest) {
//         return NextResponse.json({ message: "Request already processed or not found" }, { status: 404 });
//       }
//       return NextResponse.json({ message: "Admission request has been rejected" }, { status: 200 });
//     }

//     return NextResponse.json({ message: "Invalid action type provided" }, { status: 400 });

//   } catch (error) {
//     console.error("PUT error:", error);
//     return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
//   }
// }.














// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admission from "@/models/Admission";
// import Fee from "@/models/Fee";
// import StudentIDCard from "@/models/StudentIDCard";
// import { NextResponse } from "next/server";
// import QRCode from "qrcode";

// export async function GET() {
//   try {
//     await dbConnect();
//     const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
//     return NextResponse.json(pendingRequests, { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ message: "Failed to fetch admission data" }, { status: 500 });
//   }
// }

// export async function PUT(req) {
//   try {
//     console.log("=".repeat(50));
//     console.log("🚀 [ADMISSION] PUT request received");
    
//     await dbConnect();
//     console.log("✅ [ADMISSION] Database connected");
    
//     const body = await req.json();
//     console.log("📦 [ADMISSION] Request body:", JSON.stringify(body, null, 2));
    
//     const { requestId, rollNumber, section, action, admissionFee } = body;

//     if (!requestId) {
//       console.log("❌ [ADMISSION] Request ID missing");
//       return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
//     }

//     if (action === "approve") {
//       console.log("✅ [ADMISSION] Action: APPROVE");
//       console.log("🔍 [ADMISSION] Finding admission request:", requestId);
      
//       const requestData = await Admission.findById(requestId);
//       if (!requestData) {
//         console.log("❌ [ADMISSION] Admission request not found:", requestId);
//         return NextResponse.json({ message: "Admission request not found" }, { status: 404 });
//       }
//       console.log("✅ [ADMISSION] Admission request found:", requestData.name);

//       // Check for duplicate Roll Number
//       console.log("🔍 [ADMISSION] Checking duplicate roll number:", rollNumber);
//       const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
//       if (duplicateRoll) {
//         console.log("❌ [ADMISSION] Duplicate roll number found:", rollNumber);
//         return NextResponse.json({ message: "This Roll Number is already assigned" }, { status: 400 });
//       }
//       console.log("✅ [ADMISSION] Roll number is unique");

//       // 1. Create New Student record
//       console.log("📝 [ADMISSION] Creating new student...");
//       console.log("   Name:", requestData.name);
//       console.log("   Roll No:", rollNumber);
//       console.log("   Class:", requestData.className);
//       console.log("   Section:", section.toUpperCase());
      
//       let newStudent = null; // 👈 DECLARE OUTSIDE TRY BLOCK
      
//       try {
//         newStudent = await User.create({
//           name: requestData.name,
//           fatherName: requestData.fatherName,
//           email: requestData.email,
//           password: requestData.password,
//           phone: requestData.phone,
//           rollNo: rollNumber,
//           className: requestData.className,
//           section: section.toUpperCase(),
//           role: "student",
//           status: "active",
//           photoUrl: requestData.photoUrl || null,
//           photoPublicId: requestData.photoPublicId || null
//         });
        
//         console.log("✅ [ADMISSION] Student created successfully!");
//         console.log("   Student ID:", newStudent._id);
//         console.log("   Student Name:", newStudent.name);
//         console.log("   Student Roll No:", newStudent.rollNo);
//       } catch (createError) {
//         console.log("❌ [ADMISSION] Student creation FAILED!");
//         console.log("   Error:", createError.message);
//         return NextResponse.json({ 
//           message: "Student creation failed: " + createError.message 
//         }, { status: 500 });
//       }

//       // Check if newStudent was created
//       if (!newStudent) {
//         console.log("❌ [ADMISSION] newStudent is null or undefined!");
//         return NextResponse.json({ 
//           message: "Student creation failed - no student returned" 
//         }, { status: 500 });
//       }

//       // Wait a moment to ensure student is saved
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Verify student was actually saved
//       const verifyStudent = await User.findById(newStudent._id);
//       console.log("🔍 [ADMISSION] Student verification in DB:", verifyStudent ? "FOUND" : "NOT FOUND");
//       if (verifyStudent) {
//         console.log("   Student name in DB:", verifyStudent.name);
//         console.log("   Student rollNo in DB:", verifyStudent.rollNo);
//       } else {
//         console.log("❌ [ADMISSION] CRITICAL: Student not found in DB after creation!");
//         return NextResponse.json({ 
//           message: "Student not found in database after creation" 
//         }, { status: 500 });
//       }

//       // 2. Generate Initial Fee record
//       console.log("💰 [ADMISSION] Creating fee record...");
//       const date = new Date();
//       const currentMonth = date.toLocaleString('en-US', { month: 'long' }) + " " + date.getFullYear();
//       const dueDate = new Date();
//       dueDate.setDate(dueDate.getDate() + 7);

//       try {
//         const feeRecord = await Fee.create({
//           studentId: newStudent._id,
//           className: newStudent.className,
//           month: currentMonth,
//           amount: Number(admissionFee) || 5000,
//           status: "unpaid",
//           dueDate: dueDate,
//           feeType: "admission",
//           rollNo: rollNumber,
//           discount: 0
//         });
//         console.log("✅ [ADMISSION] Fee record created:", feeRecord._id);
//       } catch (feeError) {
//         console.log("❌ [ADMISSION] Fee creation FAILED!");
//         console.log("   Error:", feeError.message);
//         // Rollback student creation if fee fails
//         await User.findByIdAndDelete(newStudent._id);
//         console.log("🗑️ [ADMISSION] Student rolled back (deleted)");
//         return NextResponse.json({ message: "Process failed at fee generation: " + feeError.message }, { status: 500 });
//       }

//       // 3. Generate ID Card for Student
//       console.log("🪪 [ADMISSION] Generating ID Card...");
//       let idCard = null;
//       try {
//         const cardNumber = `SID-${new Date().getFullYear()}-${newStudent._id.toString().slice(-6)}`;
        
//         const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
//         const qrData = `${FRONTEND_URL}/verify/${newStudent._id}`;
        
//         console.log("🔍 [ADMISSION] QR Data URL:", qrData);
//         console.log("🔍 [ADMISSION] Frontend URL used:", FRONTEND_URL);
        
//         const qrCodeDataUrl = await QRCode.toDataURL(qrData);
//         console.log("✅ [ADMISSION] QR Code generated successfully");
        
//         idCard = await StudentIDCard.create({
//           studentId: newStudent._id,
//           cardNumber: cardNumber,
//           rollNumber: rollNumber,
//           course: requestData.course || "Matric",
//           batch: new Date().getFullYear().toString(),
//           issueDate: new Date(),
//           expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
//           qrCodeData: qrCodeDataUrl,
//           photoUrl: requestData.photoUrl || null,
//           status: 'active'
//         });
        
//         console.log(`✅ [ADMISSION] ID Card generated successfully!`);
//         console.log(`   Card Number: ${cardNumber}`);
//         console.log(`   Student ID: ${newStudent._id}`);
//         console.log(`   QR Code URL: ${qrData}`);
//       } catch (cardError) {
//         console.log("❌ [ADMISSION] ID Card generation FAILED!");
//         console.log("   Error:", cardError.message);
//         // Don't rollback for card error, just log it
//       }

//       // 4. Delete the pending request
//       console.log("🗑️ [ADMISSION] Deleting admission request...");
//       await Admission.findByIdAndDelete(requestId);
//       console.log("✅ [ADMISSION] Admission request deleted");
      
//       console.log("=".repeat(50));
//       console.log("🎉 [ADMISSION] Process completed successfully!");
//       console.log(`   Student: ${newStudent.name}`);
//       console.log(`   Student ID: ${newStudent._id}`);
//       console.log(`   Roll No: ${rollNumber}`);
//       console.log("=".repeat(50));
      
//       return NextResponse.json({ 
//         message: `${newStudent.name} has been enrolled successfully!`,
//         student: {
//           id: newStudent._id,
//           name: newStudent.name,
//           fatherName: newStudent.fatherName,
//           rollNo: rollNumber,
//           className: newStudent.className,
//           photoUrl: requestData.photoUrl || null
//         },
//         idCard: idCard ? {
//           cardNumber: idCard.cardNumber,
//           status: idCard.status
//         } : null
//       }, { status: 200 });
//     }

//     if (action === "reject") {
//       console.log("❌ [ADMISSION] Action: REJECT");
//       const deletedRequest = await Admission.findByIdAndDelete(requestId);
//       if (!deletedRequest) {
//         return NextResponse.json({ message: "Request already processed or not found" }, { status: 404 });
//       }
//       return NextResponse.json({ message: "Admission request has been rejected" }, { status: 200 });
//     }

//     return NextResponse.json({ message: "Invalid action type provided" }, { status: 400 });

//   } catch (error) {
//     console.log("=".repeat(50));
//     console.log("💥 [ADMISSION] UNHANDLED ERROR!");
//     console.log("   Error message:", error.message);
//     console.log("   Error stack:", error.stack);
//     console.log("=".repeat(50));
//     return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
//   }
// }








import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Admission from "@/models/Admission";
import Fee from "@/models/Fee";
import StudentIDCard from "@/models/StudentIDCard";
import SchoolConfig from "@/models/SchoolConfig";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

// ========== HELPER FUNCTIONS ==========

// Get next roll number automatically
async function getNextRollNumber(className, section) {
  // Find the highest roll number for this class and section
  const lastStudent = await User.findOne({
    role: "student",
    className: className,
    section: section.toUpperCase()
  }).sort({ rollNo: -1 });
  
  let nextNumber = 1;
  
  if (lastStudent && lastStudent.rollNo) {
    // Extract number from roll number (e.g., "10A025" -> 25)
    const match = lastStudent.rollNo.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }
  
  // Handle class name (might be non-numeric like "Pre-9", "Nursery")
  let classNum = className;
  if (!isNaN(parseInt(classNum))) {
    classNum = classNum.toString().padStart(2, '0');
  }
  
  const sectionLetter = section.toUpperCase();
  const numberStr = nextNumber.toString().padStart(3, '0');
  
  return `${classNum}${sectionLetter}${numberStr}`;
}

// Get available section with least students from SchoolConfig
async function getAvailableSection(className) {
  // Get configured sections from SchoolConfig
  const config = await SchoolConfig.findOne();
  let availableSections = ['A', 'B', 'C', 'D']; // Default fallback
  
  if (config) {
    const classConfig = config.classConfigs.find(c => c.className === className);
    if (classConfig && classConfig.sections && classConfig.sections.length > 0) {
      availableSections = classConfig.sections;
    }
  }
  
  let sectionCounts = [];
  
  for (const section of availableSections) {
    const count = await User.countDocuments({
      role: "student",
      className: className,
      section: section,
      status: "active"
    });
    sectionCounts.push({ section, count });
  }
  
  // Sort by count (lowest first)
  sectionCounts.sort((a, b) => a.count - b.count);
  
  // Return section with least students
  return sectionCounts[0].section;
}

// Get max students per section from config
async function getMaxStudentsPerSection(className) {
  const config = await SchoolConfig.findOne();
  if (config) {
    const classConfig = config.classConfigs.find(c => c.className === className);
    if (classConfig && classConfig.maxStudentsPerSection) {
      return classConfig.maxStudentsPerSection;
    }
  }
  return 30; // Default
}

// Generate unique card number
async function generateCardNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const cardNumber = `SID-${year}-${random}`;
  
  // Check if unique
  const existing = await StudentIDCard.findOne({ cardNumber });
  if (existing) {
    return generateCardNumber(); // Recursively generate new one
  }
  return cardNumber;
}

export async function GET() {
  try {
    await dbConnect();
    const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
    return NextResponse.json(pendingRequests, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Failed to fetch admission data" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    console.log("=".repeat(50));
    console.log("🚀 [ADMISSION] PUT request received");
    
    await dbConnect();
    console.log("✅ [ADMISSION] Database connected");
    
    const body = await req.json();
    console.log("📦 [ADMISSION] Request body:", JSON.stringify(body, null, 2));
    
    const { requestId, action, admissionFee } = body;
    
    // If manual rollNumber and section provided, use them, otherwise auto-assign
    let { rollNumber, section } = body;

    if (!requestId) {
      console.log("❌ [ADMISSION] Request ID missing");
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    if (action === "approve") {
      console.log("✅ [ADMISSION] Action: APPROVE");
      console.log("🔍 [ADMISSION] Finding admission request:", requestId);
      
      const requestData = await Admission.findById(requestId);
      if (!requestData) {
        console.log("❌ [ADMISSION] Admission request not found:", requestId);
        return NextResponse.json({ message: "Admission request not found" }, { status: 404 });
      }
      console.log("✅ [ADMISSION] Admission request found:", requestData.name);

      // ========== AUTO SECTION ASSIGNMENT ==========
      if (!section) {
        console.log("🔄 [ADMISSION] Auto-assigning section...");
        section = await getAvailableSection(requestData.className);
        console.log(`✅ [ADMISSION] Section auto-assigned: ${section}`);
      } else {
        console.log(`📝 [ADMISSION] Section provided manually: ${section}`);
      }

      // ========== AUTO ROLL NUMBER GENERATION ==========
      if (!rollNumber) {
        console.log("🔄 [ADMISSION] Auto-generating roll number...");
        rollNumber = await getNextRollNumber(requestData.className, section);
        console.log(`✅ [ADMISSION] Roll number auto-generated: ${rollNumber}`);
      } else {
        console.log(`📝 [ADMISSION] Roll number provided manually: ${rollNumber}`);
      }

      // Check for duplicate Roll Number
      console.log("🔍 [ADMISSION] Checking duplicate roll number:", rollNumber);
      const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
      if (duplicateRoll) {
        console.log("❌ [ADMISSION] Duplicate roll number found:", rollNumber);
        return NextResponse.json({ message: "This Roll Number is already assigned" }, { status: 400 });
      }
      console.log("✅ [ADMISSION] Roll number is unique");

      // Check if section is full
      const maxPerSection = await getMaxStudentsPerSection(requestData.className);
      const currentSectionCount = await User.countDocuments({
        role: "student",
        className: requestData.className,
        section: section.toUpperCase(),
        status: "active"
      });
      
      if (currentSectionCount >= maxPerSection) {
        console.log("⚠️ [ADMISSION] Section is full!");
        return NextResponse.json({ 
          message: `Section ${section} is full (max ${maxPerSection} students). Please choose another section or increase capacity in settings.` 
        }, { status: 400 });
      }

      // 1. Create New Student record
      console.log("📝 [ADMISSION] Creating new student...");
      console.log("   Name:", requestData.name);
      console.log("   Roll No:", rollNumber);
      console.log("   Class:", requestData.className);
      console.log("   Section:", section.toUpperCase());
      
      let newStudent = null;
      
      try {
        newStudent = await User.create({
          name: requestData.name,
          fatherName: requestData.fatherName,
          motherName: requestData.motherName || "",
          email: requestData.email,
          phone: requestData.phone || "",
          cnic: requestData.cnic || "",
          address: requestData.address || "",
          city: requestData.city || "",
          rollNo: rollNumber,
          className: requestData.className,
          section: section.toUpperCase(),
          targetCourse: requestData.targetCourse || requestData.course || "General",
          role: "student",
          status: "active",
          admissionDate: new Date(),
          photoUrl: requestData.photoUrl || null,
          photoPublicId: requestData.photoPublicId || null
        });
        
        console.log("✅ [ADMISSION] Student created successfully!");
        console.log("   Student ID:", newStudent._id);
        console.log("   Student Name:", newStudent.name);
        console.log("   Student Roll No:", newStudent.rollNo);
      } catch (createError) {
        console.log("❌ [ADMISSION] Student creation FAILED!");
        console.log("   Error:", createError.message);
        return NextResponse.json({ 
          message: "Student creation failed: " + createError.message 
        }, { status: 500 });
      }

      // Check if newStudent was created
      if (!newStudent) {
        console.log("❌ [ADMISSION] newStudent is null or undefined!");
        return NextResponse.json({ 
          message: "Student creation failed - no student returned" 
        }, { status: 500 });
      }

      // Wait a moment to ensure student is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify student was actually saved
      const verifyStudent = await User.findById(newStudent._id);
      console.log("🔍 [ADMISSION] Student verification in DB:", verifyStudent ? "FOUND" : "NOT FOUND");
      if (verifyStudent) {
        console.log("   Student name in DB:", verifyStudent.name);
        console.log("   Student rollNo in DB:", verifyStudent.rollNo);
      } else {
        console.log("❌ [ADMISSION] CRITICAL: Student not found in DB after creation!");
        await User.findByIdAndDelete(newStudent._id);
        return NextResponse.json({ 
          message: "Student not found in database after creation" 
        }, { status: 500 });
      }

      // 2. Generate Initial Fee record
      console.log("💰 [ADMISSION] Creating fee record...");
      const date = new Date();
      const currentMonth = date.toLocaleString('en-US', { month: 'long' }) + " " + date.getFullYear();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      try {
        const feeRecord = await Fee.create({
          studentId: newStudent._id,
          className: newStudent.className,
          month: currentMonth,
          amount: Number(admissionFee) || 5000,
          status: "unpaid",
          dueDate: dueDate,
          feeType: "admission",
          rollNo: rollNumber,
          discount: 0
        });
        console.log("✅ [ADMISSION] Fee record created:", feeRecord._id);
      } catch (feeError) {
        console.log("❌ [ADMISSION] Fee creation FAILED!");
        console.log("   Error:", feeError.message);
        // Rollback student creation if fee fails
        await User.findByIdAndDelete(newStudent._id);
        console.log("🗑️ [ADMISSION] Student rolled back (deleted)");
        return NextResponse.json({ message: "Process failed at fee generation: " + feeError.message }, { status: 500 });
      }

      // 3. Generate ID Card for Student
      console.log("🪪 [ADMISSION] Generating ID Card...");
      let idCard = null;
      try {
        const cardNumber = await generateCardNumber();
        
        const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const qrData = `${FRONTEND_URL}/verify/${newStudent._id}`;
        
        console.log("🔍 [ADMISSION] QR Data URL:", qrData);
        console.log("🔍 [ADMISSION] Frontend URL used:", FRONTEND_URL);
        
        const qrCodeDataUrl = await QRCode.toDataURL(qrData);
        console.log("✅ [ADMISSION] QR Code generated successfully");
        
        idCard = await StudentIDCard.create({
          studentId: newStudent._id,
          cardNumber: cardNumber,
          rollNumber: rollNumber,
          course: requestData.targetCourse || requestData.course || "Matric",
          batch: new Date().getFullYear().toString(),
          issueDate: new Date(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
          qrCodeData: qrCodeDataUrl,
          photoUrl: requestData.photoUrl || null,
          status: 'active'
        });
        
        console.log(`✅ [ADMISSION] ID Card generated successfully!`);
        console.log(`   Card Number: ${cardNumber}`);
        console.log(`   Student ID: ${newStudent._id}`);
        console.log(`   QR Code URL: ${qrData}`);
      } catch (cardError) {
        console.log("❌ [ADMISSION] ID Card generation FAILED!");
        console.log("   Error:", cardError.message);
        // Don't rollback for card error, just log it
      }

      // 4. Delete the pending request
      console.log("🗑️ [ADMISSION] Deleting admission request...");
      await Admission.findByIdAndDelete(requestId);
      console.log("✅ [ADMISSION] Admission request deleted");
      
      console.log("=".repeat(50));
      console.log("🎉 [ADMISSION] Process completed successfully!");
      console.log(`   Student: ${newStudent.name}`);
      console.log(`   Student ID: ${newStudent._id}`);
      console.log(`   Roll No: ${rollNumber}`);
      console.log(`   Section: ${section}`);
      console.log("=".repeat(50));
      
      return NextResponse.json({ 
        message: `${newStudent.name} has been enrolled successfully!`,
        student: {
          id: newStudent._id,
          name: newStudent.name,
          fatherName: newStudent.fatherName,
          rollNo: rollNumber,
          className: newStudent.className,
          section: section,
          photoUrl: requestData.photoUrl || null
        },
        idCard: idCard ? {
          cardNumber: idCard.cardNumber,
          status: idCard.status
        } : null
      }, { status: 200 });
    }

    if (action === "reject") {
      console.log("❌ [ADMISSION] Action: REJECT");
      const deletedRequest = await Admission.findByIdAndDelete(requestId);
      if (!deletedRequest) {
        return NextResponse.json({ message: "Request already processed or not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Admission request has been rejected" }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action type provided" }, { status: 400 });

  } catch (error) {
    console.log("=".repeat(50));
    console.log("💥 [ADMISSION] UNHANDLED ERROR!");
    console.log("   Error message:", error.message);
    console.log("   Error stack:", error.stack);
    console.log("=".repeat(50));
    return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
  }
}