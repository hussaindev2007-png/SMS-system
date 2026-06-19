// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
    
//     // Admin se Month, Amount aur optional Class Name lenge
//     const { month, amount, className } = await req.json();

//     if (!month || !amount) {
//       return NextResponse.json({ message: "Month aur Amount dena lazmi hai!" }, { status: 400 });
//     }

//     // 1. Students Filter Logic (FIXED)
//     // Note: Schema mein field 'className' hai, 'class' nahi.
//     // Note: Testing ke liye 'status: active' hata diya gaya hai taake sab students aa jayein.
//     const query = { role: "student" }; 
    
//     // Agar admin ne specific class di hai toh filter karein
//     if (className && className.trim() !== "") {
//       query.className = className; 
//     }

//     const students = await User.find(query);

//     if (students.length === 0) {
//       return NextResponse.json({ 
//         message: "Koi students nahi mile! Check karein ke database mein students maujood hain aur Class Name sahi likha gaya hai." 
//       }, { status: 404 });
//     }

//     // 2. Smart Duplicate Check & Creation
//     let createdCount = 0;
//     let skippedCount = 0;
//     const bulkOps = [];

//     for (const student of students) {
//       // Check karein ke kya is student ki ye month ki fee pehle se exist karti hai
//       const existingFee = await Fee.findOne({
//         studentId: student._id,
//         month: month
//       });

//       if (!existingFee) {
//         // Agar nahi hai, toh create operation add karein
//         bulkOps.push({
//           insertOne: {
//             document: {
//               studentId: student._id,
//               month: month,
//               amount: amount,
//               status: "unpaid",
//               paymentDate: null,
//             }
//           }
//         });
//         createdCount++;
//       } else {
//         skippedCount++;
//       }
//     }

//     // 3. Execute Bulk Write (Agar kuch create karna hai toh)
//     if (bulkOps.length > 0) {
//       await Fee.bulkWrite(bulkOps);
//     }

//     return NextResponse.json({ 
//       message: "Process Complete!", 
//       created: createdCount,
//       skipped: skippedCount,
//       details: `${createdCount} nayi fees banayi gayi. ${skippedCount} pehle se maujood thin.`
//     }, { status: 201 });

//   } catch (error) {
//     console.error("BULK_FEE_ERROR:", error);
//     return NextResponse.json({ 
//       message: "Server Error", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }
















//  th











// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { month, amount, className } = await req.json();

//     if (!month || !amount) {
//       return NextResponse.json({ message: "Month & Amount are mandatory!" }, { status: 400 });
//     }

//     // 1. Fetch Students based on Class
//     const query = { role: "student" }; 
//     if (className && className !== "") {
//       query.className = className; 
//     }

//     const students = await User.find(query).select("_id");

//     if (students.length === 0) {
//       return NextResponse.json({ message: "No students found in this class!" }, { status: 404 });
//     }

//     // 2. Bulk Operation Logic (Upsert: If not exists, insert)
//     const operations = students.map(student => ({
//       updateOne: {
//         filter: { studentId: student._id, month: month },
//         update: { 
//           $setOnInsert: { 
//             studentId: student._id, 
//             month: month, 
//             amount: Number(amount), 
//             status: "unpaid" 
//           } 
//         },
//         upsert: true
//       }
//     }));

//     const result = await Fee.bulkWrite(operations);

//     return NextResponse.json({ 
//       message: "Bulk generation complete!", 
//       created: result.upsertedCount,
//       skipped: students.length - result.upsertedCount
//     }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ message: "Process failed", error: error.message }, { status: 500 });
//   }
// }







// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { month, amount, className } = await req.json();

//     if (!month || !amount) {
//       return NextResponse.json({ message: "Month & Amount are mandatory!" }, { status: 400 });
//     }

//     // 1. Fetch Students (Ab className bhi select kar rahe hain)
//     const query = { role: "student" }; 
//     if (className && className !== "") {
//       query.className = className; 
//     }

//     const students = await User.find(query).select("_id className");

//     if (students.length === 0) {
//       return NextResponse.json({ message: "No students found!" }, { status: 404 });
//     }

//     // 2. Bulk Operation Logic
//     const operations = students.map(student => ({
//       updateOne: {
//         filter: { studentId: student._id, month: month },
//         update: { 
//           $setOnInsert: { 
//             studentId: student._id, 
//             month: month, 
//             amount: Number(amount), 
//             status: "unpaid",
//             className: student.className // ✅ Schema ke liye class add kar di
//           } 
//         },
//         upsert: true
//       }
//     }));

//     const result = await Fee.bulkWrite(operations);

//     return NextResponse.json({ 
//       message: "Bulk generation complete!", 
//       created: result.upsertedCount,
//       skipped: students.length - result.upsertedCount
//     }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ message: "Process failed", error: error.message }, { status: 500 });
//   }
// }










// ... baaqi imports wahi rahen gye

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { month, amount, className } = await req.json();

//     if (!month || !amount) {
//       return NextResponse.json({ message: "Month & Amount are mandatory!" }, { status: 400 });
//     }

//     // 1. Fetch Students with Regex (Smart Search)
//     const query = { role: "student" }; 
    
//     if (className && className.trim() !== "") {
//       // ✅ Regex use karein taake "10" aur "10th" ya extra space wale masle hal hon
//       // "i" ka matlab hye Case-Insensitive (ABC aur abc dono barabar)
//       query.className = { $regex: new RegExp(`^${className.trim()}$`, "i") };
//     }

//     const students = await User.find(query).select("_id className");

//     // DEBUG: Console mein check karein kitne students mile
//     console.log(`Found ${students.length} students for class: ${className}`);

//     if (students.length === 0) {
//       return NextResponse.json({ message: "No students found in this class!" }, { status: 404 });
//     }

//     // 2. Bulk Operation Logic
//     const operations = students.map(student => ({
//       updateOne: {
//         filter: { studentId: student._id, month: month },
//         update: { 
//           $setOnInsert: { 
//             studentId: student._id, 
//             month: month, 
//             amount: Number(amount), 
//             status: "unpaid",
//             className: student.className 
//           } 
//         },
//         upsert: true
//       }
//     }));

//     const result = await Fee.bulkWrite(operations);

//     return NextResponse.json({ 
//       message: "Bulk generation complete!", 
//       totalFound: students.length, // ✅ Ye bhi bhejen taake pata chale kitne milay
//       created: result.upsertedCount,
//       skipped: students.length - result.upsertedCount
//     }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ message: "Process failed", error: error.message }, { status: 500 });
//   }
// }

// ---------------------------































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { month, amount, className, feeType, dueDate } = await req.json();

//     // Basic Validation
//     if (!month || !amount) {
//       return NextResponse.json({ message: "Month & Amount are mandatory!" }, { status: 400 });
//     }

//     const query = { role: "student" }; 
    
//     if (className && className.trim() !== "") {
//       // Case-insensitive search for class
//       query.className = { $regex: new RegExp(`^${className.trim()}$`, "i") };
//     }

//     const students = await User.find(query).select("_id className");

//     if (students.length === 0) {
//       return NextResponse.json({ message: "Is class mein koi students nahi mile!" }, { status: 404 });
//     }

//     // Bulk Operation Logic
//     const operations = students.map(student => ({
//       updateOne: {
//         // Filter: Check if this specific fee type for this month already exists
//         filter: { 
//             studentId: student._id, 
//             month: month, 
//             feeType: feeType || "monthly" 
//         },
//         update: { 
//           $setOnInsert: { 
//             studentId: student._id, 
//             month: month, 
//             amount: Number(amount), 
//             status: "unpaid",
//             className: student.className,
//             feeType: feeType || "monthly",
//             dueDate: dueDate || null
//           } 
//         },
//         upsert: true
//       }
//     }));

//     const result = await Fee.bulkWrite(operations);

//     return NextResponse.json({ 
//       message: "Bulk generation complete!", 
//       totalFound: students.length,
//       created: result.upsertedCount,
//       skipped: result.matchedCount // Jo pehle se exist karte thay
//     }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ message: "Process failed", error: error.message }, { status: 500 });
//   }
// }




// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { month, amount, className, feeType, dueDate } = await req.json();

//     // Boss: Validation with English messages
//     if (!month || !amount) {
//       return NextResponse.json({ message: "Month and Amount are required fields." }, { status: 400 });
//     }

//     const query = { role: "student", status: "active" }; // Active students only
    
//     if (className && className.trim() !== "") {
//       // Case-insensitive search for class
//       query.className = { $regex: new RegExp(`^${className.trim()}$`, "i") };
//     }

//     const students = await User.find(query).select("_id className rollNo");

//     if (students.length === 0) {
//       return NextResponse.json({ message: "No active students found for the selected criteria." }, { status: 404 });
//     }

//     // Bulk Operation Logic
//     const operations = students.map(student => ({
//       updateOne: {
//         // Filter: Check if this specific fee type for this month already exists
//         filter: { 
//             studentId: student._id, 
//             month: month, 
//             feeType: feeType || "monthly" 
//         },
//         update: { 
//           $setOnInsert: { 
//             studentId: student._id, 
//             rollNo: student.rollNo, // Added rollNo for better record keeping
//             month: month, 
//             amount: Number(amount), 
//             status: "unpaid",
//             className: student.className,
//             feeType: feeType || "monthly",
//             dueDate: dueDate || null,
//             discount: 0
//           } 
//         },
//         upsert: true
//       }
//     }));

//     const result = await Fee.bulkWrite(operations);

//     // Boss: Detailed English response
//     return NextResponse.json({ 
//       message: `Bulk processing complete. ${result.upsertedCount} new records created.`, 
//       totalProcessed: students.length,
//       created: result.upsertedCount,
//       alreadyExists: result.matchedCount 
//     }, { status: 201 });

//   } catch (error) {
//     return NextResponse.json({ 
//       message: "An error occurred during bulk generation.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }








// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";

// // Helper function to calculate due date (10th of the month)
// const calculateDueDate = (monthStr) => {
//   try {
//     // Input format: "June 2026" or "June 2026"
//     const [monthName, year] = monthStr.trim().split(' ');
    
//     if (!monthName || !year) {
//       console.log(`⚠️ Invalid month format: ${monthStr}, using default 7 days from now`);
//       return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     }
    
//     // Convert month name to month index (0-11)
//     const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    
//     if (isNaN(monthIndex)) {
//       console.log(`⚠️ Invalid month name: ${monthName}, using default`);
//       return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     }
    
//     // Due date is 10th of the month at 11:59 PM
//     const dueDate = new Date(parseInt(year), monthIndex, 10, 23, 59, 59);
    
//     // If due date is in the past, add 1 year?
//     // if (dueDate < new Date()) {
//     //   dueDate.setFullYear(dueDate.getFullYear() + 1);
//     // }
    
//     console.log(`📅 Calculated due date for ${monthStr}: ${dueDate.toLocaleDateString()}`);
//     return dueDate;
    
//   } catch (error) {
//     console.error(`❌ Error calculating due date:`, error);
//     return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   }
// };

// export async function POST(req) {
//   try {
//     console.log("🔍 Bulk fee generation started");
//     await dbConnect();
//     console.log("✅ Database connected");

//     const { month, amount, className, feeType, customDueDate } = await req.json();
    
//     console.log("📦 Request data:", { month, amount, className, feeType, customDueDate });

//     // Validation
//     if (!month || !amount) {
//       return NextResponse.json({ 
//         success: false,
//         message: "Month and Amount are required fields." 
//       }, { status: 400 });
//     }

//     // Calculate due date (priority: customDueDate > auto-calculate > default)
//     let dueDate;
//     if (customDueDate) {
//       dueDate = new Date(customDueDate);
//       console.log(`📅 Using custom due date: ${dueDate.toLocaleDateString()}`);
//     } else {
//       dueDate = calculateDueDate(month);
//       console.log(`📅 Auto-calculated due date: ${dueDate.toLocaleDateString()}`);
//     }

//     // Build query for students
//     const query = { role: "student" };
    
//     if (className && className.trim() !== "") {
//       query.className = { $regex: new RegExp(`^${className.trim()}$`, "i") };
//     }

//     console.log("🔍 Query:", query);
    
//     const students = await User.find(query).select("_id className rollNo name");

//     console.log(`👨‍🎓 Found ${students.length} students`);

//     if (students.length === 0) {
//       return NextResponse.json({ 
//         success: false,
//         message: "No students found for the selected criteria." 
//       }, { status: 404 });
//     }

//     // Prepare operations
//     let createdCount = 0;
//     let skippedCount = 0;
//     let errorCount = 0;

//     for (const student of students) {
//       try {
//         // Check if fee already exists for this student, month, and feeType
//         const existingFee = await Fee.findOne({
//           studentId: student._id,
//           month: month,
//           feeType: feeType || "monthly"
//         });
        
//         if (existingFee) {
//           console.log(`⚠️ Fee already exists for ${student.name} (${student.rollNo})`);
//           skippedCount++;
//           continue;
//         }
        
//         // Create fee record individually (instead of bulkWrite for better error handling)
//         await Fee.create({
//           studentId: student._id,
//           rollNo: student.rollNo || `STU-${student._id.toString().slice(-6)}`,
//           className: student.className || "Not Assigned",
//           month: month,
//           amount: Number(amount),
//           amountPaid: 0,
//           status: "unpaid",
//           feeType: feeType || "monthly",
//           dueDate: dueDate,
//           discount: 0,
//           paymentMethod: ""
//         });
        
//         createdCount++;
//         console.log(`✅ Fee created for ${student.name} (${student.rollNo})`);
        
//       } catch (studentError) {
//         console.error(`❌ Error creating fee for ${student.name}:`, studentError.message);
//         errorCount++;
//       }
//     }

//     console.log(`📊 Summary: Created: ${createdCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);

//     return NextResponse.json({ 
//       success: true,
//       message: `Fees generated successfully! ${createdCount} new records created.`, 
//       summary: {
//         totalStudents: students.length,
//         created: createdCount,
//         skipped: skippedCount,
//         errors: errorCount,
//         dueDate: dueDate,
//         dueDateFormatted: dueDate.toLocaleDateString()
//       }
//     }, { status: 201 });

//   } catch (error) {
//     console.error("❌ Bulk fee generation error:", error);
//     console.error("Error details:", error.message);
//     console.error("Error stack:", error.stack);
    
//     return NextResponse.json({ 
//       success: false,
//       message: "An error occurred during bulk generation.", 
//       error: error.message
//     }, { status: 500 });
//   }
// }




































import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Fee from "@/models/Fee";
import { NextResponse } from "next/server";
import { generateQRCode, generateQRToken } from "@/lib/qr-generator";
import { sendFeeQREmail } from "@/lib/email";

// Helper function to calculate due date (10th of the month)
const calculateDueDate = (monthStr) => {
  try {
    const [monthName, year] = monthStr.trim().split(' ');
    
    if (!monthName || !year) {
      console.log(`⚠️ Invalid month format: ${monthStr}, using default 7 days from now`);
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    
    if (isNaN(monthIndex)) {
      console.log(`⚠️ Invalid month name: ${monthName}, using default`);
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    
    const dueDate = new Date(parseInt(year), monthIndex, 10, 23, 59, 59);
    
    console.log(`📅 Calculated due date for ${monthStr}: ${dueDate.toLocaleDateString()}`);
    return dueDate;
    
  } catch (error) {
    console.error(`❌ Error calculating due date:`, error);
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
};

export async function POST(req) {
  try {
    console.log("🔍 Bulk fee generation started");
    await dbConnect();
    console.log("✅ Database connected");

    const { month, amount, className, feeType, customDueDate, sendEmail = true } = await req.json();
    
    console.log("📦 Request data:", { month, amount, className, feeType, customDueDate, sendEmail });

    if (!month || !amount) {
      return NextResponse.json({ 
        success: false,
        message: "Month and Amount are required fields." 
      }, { status: 400 });
    }

    let dueDate;
    if (customDueDate) {
      dueDate = new Date(customDueDate);
      console.log(`📅 Using custom due date: ${dueDate.toLocaleDateString()}`);
    } else {
      dueDate = calculateDueDate(month);
      console.log(`📅 Auto-calculated due date: ${dueDate.toLocaleDateString()}`);
    }

    const query = { role: "student" };
    
    if (className && className.trim() !== "") {
      query.className = { $regex: new RegExp(`^${className.trim()}$`, "i") };
    }

    console.log("🔍 Query:", query);
    
    const students = await User.find(query).select("_id className rollNo name email phone");

    console.log(`👨‍🎓 Found ${students.length} students`);

    if (students.length === 0) {
      return NextResponse.json({ 
        success: false,
        message: "No students found for the selected criteria." 
      }, { status: 404 });
    }

    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let qrGeneratedCount = 0;
    let emailSentCount = 0;
    
    const results = [];
    const failedEmails = [];

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    for (const student of students) {
      try {
        const existingFee = await Fee.findOne({
          studentId: student._id,
          month: month,
          feeType: feeType || "monthly"
        });
        
        if (existingFee) {
          console.log(`⚠️ Fee already exists for ${student.name} (${student.rollNo})`);
          skippedCount++;
          results.push({
            student: student.name,
            rollNo: student.rollNo,
            status: 'skipped',
            reason: 'Fee already exists'
          });
          continue;
        }
        
        const fee = await Fee.create({
          studentId: student._id,
          rollNo: student.rollNo || `STU-${student._id.toString().slice(-6)}`,
          className: student.className || "Not Assigned",
          month: month,
          amount: Number(amount),
          amountPaid: 0,
          status: "unpaid",
          feeType: feeType || "monthly",
          dueDate: dueDate,
          discount: 0,
          paymentMethod: "",
          paymentHistory: []
        });
        
        createdCount++;
        console.log(`✅ Fee created for ${student.name} (${student.rollNo})`);
        
        let qrResult = null;
        let qrCodeImage = null;
        
        try {
          const qrToken = generateQRToken(student._id.toString(), fee._id.toString());
          const qrExpiry = new Date();
          qrExpiry.setDate(qrExpiry.getDate() + 30);
          
          // ✅ NEW: Store FULL LINK in QR code (not just token)
          const qrLink = `${baseUrl}/pay/qr/${qrToken}`;
          const qrData = qrLink;  // 👈 FULL URL - scanner will open browser automatically
          
          // Generate QR code image from full link
          qrCodeImage = await generateQRCode(qrData);
          
          fee.qrToken = qrToken;
          fee.qrExpiry = qrExpiry;
          fee.qrCodeImage = qrCodeImage;
          fee.qrLink = qrLink;
          fee.qrGeneratedAt = new Date();
          await fee.save();
          
          qrGeneratedCount++;
          console.log(`✅ QR generated for ${student.name} with link: ${qrLink}`);
          
          qrResult = { token: qrToken, link: qrLink, image: qrCodeImage };
          
        } catch (qrError) {
          console.error(`❌ QR generation failed for ${student.name}:`, qrError.message);
        }
        
        // Send email with QR image attachment
        if (sendEmail && student.email) {
          try {
            const emailResult = await sendFeeQREmail(
              student.email,
              student.name,
              student.rollNo,
              month,
              Number(amount),
              dueDate,
              qrCodeImage,
              qrResult?.link || `${baseUrl}/pay/qr/${fee.qrToken}`
            );
            
            if (emailResult.success) {
              emailSentCount++;
              console.log(`✅ Email sent to ${student.email} with QR attachment`);
            } else {
              failedEmails.push({ email: student.email, name: student.name, error: emailResult.error });
              console.log(`❌ Email failed for ${student.email}`);
            }
          } catch (emailError) {
            failedEmails.push({ email: student.email, name: student.name, error: emailError.message });
            console.error(`❌ Email error for ${student.name}:`, emailError.message);
          }
        } else if (sendEmail && !student.email) {
          console.log(`⚠️ No email for ${student.name}, skipping email`);
          failedEmails.push({ email: 'No email', name: student.name, error: 'Email not found' });
        }
        
        results.push({
          student: student.name,
          rollNo: student.rollNo,
          email: student.email,
          status: 'created',
          qrGenerated: !!qrResult,
          emailSent: sendEmail && !!student.email
        });
        
      } catch (studentError) {
        console.error(`❌ Error creating fee for ${student.name}:`, studentError.message);
        errorCount++;
        results.push({
          student: student.name,
          rollNo: student.rollNo,
          status: 'error',
          error: studentError.message
        });
      }
    }

    console.log(`📊 Summary: Created: ${createdCount}, Skipped: ${skippedCount}, Errors: ${errorCount}`);
    console.log(`📊 QR Generated: ${qrGeneratedCount}, Emails Sent: ${emailSentCount}`);

    return NextResponse.json({ 
      success: true,
      message: `Fees generated successfully! ${createdCount} new records created.`, 
      summary: {
        totalStudents: students.length,
        created: createdCount,
        skipped: skippedCount,
        errors: errorCount,
        qrGenerated: qrGeneratedCount,
        emailsSent: emailSentCount,
        emailsFailed: failedEmails.length,
        dueDate: dueDate,
        dueDateFormatted: dueDate.toLocaleDateString()
      },
      results: results.slice(0, 20),
      failedEmails: failedEmails.length > 0 ? failedEmails.slice(0, 10) : []
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Bulk fee generation error:", error);
    
    return NextResponse.json({ 
      success: false,
      message: "An error occurred during bulk generation.", 
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Bulk fee generation API is ready",
    features: {
      qrGeneration: true,
      emailSending: true,
      partialPayment: true
    }
  });
}