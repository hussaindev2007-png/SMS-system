// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import StudentIDCard from "@/models/StudentIDCard";
// import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
    
//     // ✅ FIX: await karo params ko (Next.js 15 requirement)
//     const { id } = await params;
    
//     console.log("🔍 Student ID:", id);
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student ID required" 
//       }, { status: 400 });
//     }

//     // Student find karo database se
//     const student = await User.findById(id).select('-password');
    
//     if (!student) {
//       console.log("❌ Student not found:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student not found" 
//       }, { status: 404 });
//     }

//     // ID Card find karo
//     const card = await StudentIDCard.findOne({ studentId: id });
    
//     if (!card) {
//       console.log("❌ ID Card not found for student:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "ID Card not found" 
//       }, { status: 404 });
//     }

//     const isExpired = new Date(card.expiryDate) < new Date();

//     console.log("✅ Student verified:", student.name);

//     return NextResponse.json({
//       success: true,
//       verified: true,
//       verifiedAt: new Date().toISOString(),
//       data: {
//         _id: student._id,
//         name: student.name,
//         rollNo: student.rollNo,
//         className: student.className,
//         section: student.section,
//         fatherName: student.fatherName,
//         email: student.email,
//         phone: student.phone,
//         photoUrl: student.photoUrl || null,
//         cardNumber: card.cardNumber,
//         issueDate: card.issueDate,
//         expiryDate: card.expiryDate,
//         isExpired: isExpired
//       }
//     });
    
//   } catch (error) {
//     console.error("❌ Verification API Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }





















// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import StudentIDCard from "@/models/StudentIDCard";
// import Attendance from "@/models/Attendance";
// import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
    
//     console.log("🔍 Verifying student ID:", id);
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student ID required" 
//       }, { status: 400 });
//     }

//     // Student find karo
//     const student = await User.findById(id).select('-password');
    
//     if (!student) {
//       console.log("❌ Student not found:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student not found" 
//       }, { status: 404 });
//     }

//     // ID Card find karo
//     const card = await StudentIDCard.findOne({ studentId: id });
    
//     if (!card) {
//       console.log("❌ ID Card not found for student:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "ID Card not found" 
//       }, { status: 404 });
//     }

//     // ✅ CHECK: Aaj ki attendance already hai ya nahi
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const existingAttendance = await Attendance.findOne({
//       studentId: id,
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     });
    
//     let attendanceRecord = null;
//     let isAlreadyMarked = false;
//     let checkInTimeValue = null;
    
//     // ✅ Agar aaj ki attendance nahi hai toh mark karo
//     if (!existingAttendance) {
//       try {
//         const now = new Date();
//         // Format time as HH:MM:SS AM/PM
//         const currentTime = now.toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//           hour12: true
//         });
        
//         attendanceRecord = await Attendance.create({
//           studentId: student._id,
//           studentName: student.name,
//           rollNo: student.rollNo,
//           date: now,
//           status: 'present',
//           checkInTime: currentTime,  // 👈 TIME SAVE HOGA
//           markedBy: student._id,
//           className: student.className,
//           section: student.section,
//           verifiedBy: 'QR Scan'
//         });
        
//         checkInTimeValue = currentTime;
//         console.log("✅ Attendance marked for:", student.name, "at", currentTime);
//       } catch (attError) {
//         console.error("❌ Attendance marking failed:", attError);
//       }
//     } else {
//       isAlreadyMarked = true;
//       checkInTimeValue = existingAttendance.checkInTime || "N/A";
//       console.log("⚠️ Attendance already marked today for:", student.name);
//     }

//     const isExpired = new Date(card.expiryDate) < new Date();
    
//     // Format current time for response if new attendance was created
//     const responseCheckInTime = checkInTimeValue || new Date().toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });

//     return NextResponse.json({
//       success: true,
//       verified: true,
//       verifiedAt: new Date().toISOString(),
//       attendance: {
//         marked: !isAlreadyMarked,
//         alreadyMarked: isAlreadyMarked,
//         status: attendanceRecord?.status || existingAttendance?.status || "present",
//         checkInTime: responseCheckInTime,
//         date: new Date().toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric'
//         })
//       },
//       data: {
//         _id: student._id,
//         name: student.name,
//         rollNo: student.rollNo,
//         className: student.className,
//         section: student.section,
//         fatherName: student.fatherName,
//         email: student.email,
//         phone: student.phone,
//         photoUrl: student.photoUrl,
//         cardNumber: card.cardNumber,
//         issueDate: card.issueDate,
//         expiryDate: card.expiryDate,
//         isExpired: isExpired
//       }
//     });
    
//   } catch (error) {
//     console.error("❌ Verification API Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }
































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import StudentIDCard from "@/models/StudentIDCard";
// import Attendance from "@/models/Attendance";
// import { NextResponse } from "next/server";
// import { addAttendanceNotificationToQueue } from "@/lib/queue"; // 👈 ADD THIS

// // 👈 ADD LATE CHECK FUNCTION
// const checkLateStatus = (checkInTime) => {
//   const [time, period] = checkInTime.split(' ');
//   let [hours, minutes] = time.split(':');
  
//   if (period === 'PM' && hours !== '12') {
//     hours = parseInt(hours) + 12;
//   }
//   if (period === 'AM' && hours === '12') {
//     hours = 0;
//   }
  
//   const checkInMinutes = parseInt(hours) * 60 + parseInt(minutes);
//   const schoolStartMinutes = 8 * 60; // 8:00 AM
//   const graceMinutes = 60; // Grace period till 9:00 AM
  
//   if (checkInMinutes > schoolStartMinutes && checkInMinutes <= schoolStartMinutes + graceMinutes) {
//     return 'on-time';
//   } else if (checkInMinutes > schoolStartMinutes + graceMinutes) {
//     return 'late';
//   }
//   return 'on-time';
// };

// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
    
//     console.log("🔍 Verifying student ID:", id);
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student ID required" 
//       }, { status: 400 });
//     }

//     // Student find karo
//     const student = await User.findById(id).select('-password');
    
//     if (!student) {
//       console.log("❌ Student not found:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student not found" 
//       }, { status: 404 });
//     }

//     // ID Card find karo
//     const card = await StudentIDCard.findOne({ studentId: id });
    
//     if (!card) {
//       console.log("❌ ID Card not found for student:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "ID Card not found" 
//       }, { status: 404 });
//     }

//     // ✅ CHECK: Aaj ki attendance already hai ya nahi
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const existingAttendance = await Attendance.findOne({
//       studentId: id,
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     });
    
//     let attendanceRecord = null;
//     let isAlreadyMarked = false;
//     let checkInTimeValue = null;
//     let attendanceStatus = 'present';
    
//     // ✅ Agar aaj ki attendance nahi hai toh mark karo
//     if (!existingAttendance) {
//       try {
//         const now = new Date();
//         // Format time as HH:MM:SS AM/PM
//         const currentTime = now.toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//           hour12: true
//         });
        
//         // 👈 CHECK IF STUDENT IS LATE
//         const lateCheck = checkLateStatus(currentTime);
//         attendanceStatus = lateCheck === 'late' ? 'late' : 'present';
        
//         attendanceRecord = await Attendance.create({
//           studentId: student._id,
//           studentName: student.name,
//           rollNo: student.rollNo,
//           date: now,
//           status: attendanceStatus,  // 👈 'present' or 'late'
//           checkInTime: currentTime,
//           markedBy: student._id,
//           className: student.className,
//           section: student.section,
//           verifiedBy: 'QR Scan'
//         });
        
//         checkInTimeValue = currentTime;
//         console.log(`✅ Attendance marked for ${student.name}: ${attendanceStatus} at ${currentTime}`);
        
//         // 👈 IF LATE, ADD TO QUEUE FOR WHATSAPP NOTIFICATION
//         if (attendanceStatus === 'late') {
//           await addAttendanceNotificationToQueue(
//             student.phone,
//             student.name,
//             'late',
//             currentTime
//           );
//           console.log(`📱 Added ${student.name} to late notification queue`);
//         }
        
//       } catch (attError) {
//         console.error("❌ Attendance marking failed:", attError);
//       }
//     } else {
//       isAlreadyMarked = true;
//       checkInTimeValue = existingAttendance.checkInTime || "N/A";
//       attendanceStatus = existingAttendance.status || "present";
//       console.log(`⚠️ Attendance already marked for ${student.name} (${attendanceStatus})`);
//     }

//     const isExpired = new Date(card.expiryDate) < new Date();
    
//     const responseCheckInTime = checkInTimeValue || new Date().toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });

//     return NextResponse.json({
//       success: true,
//       verified: true,
//       verifiedAt: new Date().toISOString(),
//       attendance: {
//         marked: !isAlreadyMarked,
//         alreadyMarked: isAlreadyMarked,
//         status: attendanceStatus,
//         checkInTime: responseCheckInTime,
//         date: new Date().toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric'
//         }),
//         isLate: attendanceStatus === 'late'  // 👈 ADD THIS
//       },
//       data: {
//         _id: student._id,
//         name: student.name,
//         rollNo: student.rollNo,
//         className: student.className,
//         section: student.section,
//         fatherName: student.fatherName,
//         email: student.email,
//         phone: student.phone,
//         photoUrl: student.photoUrl,
//         cardNumber: card.cardNumber,
//         issueDate: card.issueDate,
//         expiryDate: card.expiryDate,
//         isExpired: isExpired
//       }
//     });
    
//   } catch (error) {
//     console.error("❌ Verification API Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }


































// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import StudentIDCard from "@/models/StudentIDCard";
// import Attendance from "@/models/Attendance";
// import { NextResponse } from "next/server";
// import { addAttendanceNotificationToQueue } from "@/lib/queue";

// // Late check function
// const checkLateStatus = (checkInTime) => {
//   const [time, period] = checkInTime.split(' ');
//   let [hours, minutes] = time.split(':');
  
//   if (period === 'PM' && hours !== '12') {
//     hours = parseInt(hours) + 12;
//   }
//   if (period === 'AM' && hours === '12') {
//     hours = 0;
//   }
  
//   const checkInMinutes = parseInt(hours) * 60 + parseInt(minutes);
//   const schoolStartMinutes = 8 * 60; // 8:00 AM
//   const graceMinutes = 60; // Grace period till 9:00 AM
  
//   if (checkInMinutes > schoolStartMinutes && checkInMinutes <= schoolStartMinutes + graceMinutes) {
//     return 'on-time';
//   } else if (checkInMinutes > schoolStartMinutes + graceMinutes) {
//     return 'late';
//   }
//   return 'on-time';
// };

// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
    
//     console.log("🔍 Verifying student ID:", id);
    
//     if (!id) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student ID required" 
//       }, { status: 400 });
//     }

//     // Student find karo
//     const student = await User.findById(id).select('-password');
    
//     if (!student) {
//       console.log("❌ Student not found:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "Student not found" 
//       }, { status: 404 });
//     }

//     // ID Card find karo
//     const card = await StudentIDCard.findOne({ studentId: id });
    
//     if (!card) {
//       console.log("❌ ID Card not found for student:", id);
//       return NextResponse.json({ 
//         success: false, 
//         error: "ID Card not found" 
//       }, { status: 404 });
//     }

//     // Check today's attendance
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const existingAttendance = await Attendance.findOne({
//       studentId: id,
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     });
    
//     let attendanceRecord = null;
//     let isAlreadyMarked = false;
//     let checkInTimeValue = null;
//     let attendanceStatus = 'present';
    
//     // If no attendance today, mark it
//     if (!existingAttendance) {
//       try {
//         const now = new Date();
//         const currentTime = now.toLocaleTimeString('en-US', {
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit',
//           hour12: true
//         });
        
//         // Check if student is late
//         const lateCheck = checkLateStatus(currentTime);
//         attendanceStatus = lateCheck === 'late' ? 'late' : 'present';
        
//         attendanceRecord = await Attendance.create({
//           studentId: student._id,
//           studentName: student.name,
//           rollNo: student.rollNo,
//           date: now,
//           status: attendanceStatus,
//           checkInTime: currentTime,
//           markedBy: student._id,
//           className: student.className,
//           section: student.section,
//           verifiedBy: 'QR Scan'
//         });
        
//         checkInTimeValue = currentTime;
//         console.log(`✅ Attendance marked for ${student.name}: ${attendanceStatus} at ${currentTime}`);
        
//         // ✅ CHANGED: If late, add to queue with EMAIL (not phone)
//         if (attendanceStatus === 'late') {
//           // Make sure student has email
//           if (!student.email) {
//             console.log(`⚠️ No email found for ${student.name}, cannot send notification`);
//           } else {
//             await addAttendanceNotificationToQueue(
//               student.email,     // 👈 CHANGED: phone → email
//               student.name,
//               'late',
//               currentTime
//             );
//             console.log(`📧 Added ${student.name} to email notification queue`);
//           }
//         }
        
//       } catch (attError) {
//         console.error("❌ Attendance marking failed:", attError);
//       }
//     } else {
//       isAlreadyMarked = true;
//       checkInTimeValue = existingAttendance.checkInTime || "N/A";
//       attendanceStatus = existingAttendance.status || "present";
//       console.log(`⚠️ Attendance already marked for ${student.name} (${attendanceStatus})`);
//     }

//     const isExpired = new Date(card.expiryDate) < new Date();
    
//     const responseCheckInTime = checkInTimeValue || new Date().toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true
//     });

//     return NextResponse.json({
//       success: true,
//       verified: true,
//       verifiedAt: new Date().toISOString(),
//       attendance: {
//         marked: !isAlreadyMarked,
//         alreadyMarked: isAlreadyMarked,
//         status: attendanceStatus,
//         checkInTime: responseCheckInTime,
//         date: new Date().toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric'
//         }),
//         isLate: attendanceStatus === 'late'
//       },
//       data: {
//         _id: student._id,
//         name: student.name,
//         rollNo: student.rollNo,
//         className: student.className,
//         section: student.section,
//         fatherName: student.fatherName,
//         email: student.email,
//         phone: student.phone,
//         photoUrl: student.photoUrl,
//         cardNumber: card.cardNumber,
//         issueDate: card.issueDate,
//         expiryDate: card.expiryDate,
//         isExpired: isExpired
//       }
//     });
    
//   } catch (error) {
//     console.error("❌ Verification API Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

























import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import StudentIDCard from "@/models/StudentIDCard";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Late check function
const checkLateStatus = (checkInTime) => {
  try {
    const [time, period] = checkInTime.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (period === 'PM' && hours !== '12') {
      hours = parseInt(hours) + 12;
    }
    if (period === 'AM' && hours === '12') {
      hours = 0;
    }
    
    const checkInMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const schoolStartMinutes = 8 * 60; // 8:00 AM
    const graceMinutes = 60; // Grace period till 9:00 AM
    
    if (checkInMinutes > schoolStartMinutes && checkInMinutes <= schoolStartMinutes + graceMinutes) {
      return 'on-time';
    } else if (checkInMinutes > schoolStartMinutes + graceMinutes) {
      return 'late';
    }
    return 'on-time';
  } catch (error) {
    console.error("Late check error:", error);
    return 'on-time';
  }
};

export async function GET(request, { params }) {
  try {
    // Validate params
    if (!params) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request parameters" 
      }, { status: 400 });
    }
    
    // ✅ IMPORTANT: await params in Next.js 15
    const { id } = await params;
    
    console.log("🔍 Verifying student ID:", id);
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Student ID required" 
      }, { status: 400 });
    }
    
    // ✅ Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid student ID format" 
      }, { status: 400 });
    }
    
    await dbConnect();
    console.log("✅ Database connected");

    // Student find karo - use lean() for better performance
    const student = await User.findById(id).select('-password').lean();
    
    if (!student) {
      console.log("❌ Student not found:", id);
      return NextResponse.json({ 
        success: false, 
        error: "Student not found" 
      }, { status: 404 });
    }
    
    console.log("✅ Student found:", student.name);

    // ID Card find karo
    const card = await StudentIDCard.findOne({ studentId: id }).lean();
    
    if (!card) {
      console.log("❌ ID Card not found for student:", id);
      return NextResponse.json({ 
        success: false, 
        error: "ID Card not found. Please contact administration." 
      }, { status: 404 });
    }
    
    console.log("✅ ID Card found:", card.cardNumber);

    // Check today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingAttendance = await Attendance.findOne({
      studentId: id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).lean();
    
    let attendanceRecord = null;
    let isAlreadyMarked = false;
    let checkInTimeValue = null;
    let attendanceStatus = 'present';
    
    // If no attendance today, mark it
    if (!existingAttendance) {
      try {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        
        // Check if student is late
        const lateCheck = checkLateStatus(currentTime);
        attendanceStatus = lateCheck === 'late' ? 'late' : 'present';
        
        attendanceRecord = await Attendance.create({
          studentId: student._id,
          studentName: student.name,
          rollNo: student.rollNo,
          date: now,
          status: attendanceStatus,
          checkInTime: currentTime,
          markedBy: student._id,
          className: student.className,
          section: student.section,
          verifiedBy: 'QR Scan'
        });
        
        checkInTimeValue = currentTime;
        console.log(`✅ Attendance marked for ${student.name}: ${attendanceStatus} at ${currentTime}`);
        
        // If late, send email notification
        if (attendanceStatus === 'late') {
          if (student.email) {
            try {
              // Send email asynchronously - don't await
              fetch(`${process.env.NEXTAUTH_URL}/api/notifications/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: student.email,
                  studentName: student.name,
                  status: 'late',
                  time: currentTime
                })
              }).catch(err => console.error("Email send error:", err));
              console.log(`📧 Email notification queued for ${student.name}`);
            } catch (emailError) {
              console.error("Email error:", emailError);
            }
          }
        }
        
      } catch (attError) {
        console.error("❌ Attendance marking failed:", attError);
      }
    } else {
      isAlreadyMarked = true;
      checkInTimeValue = existingAttendance.checkInTime || "N/A";
      attendanceStatus = existingAttendance.status || "present";
      console.log(`⚠️ Attendance already marked for ${student.name} (${attendanceStatus})`);
    }

    const isExpired = new Date(card.expiryDate) < new Date();
    
    const responseCheckInTime = checkInTimeValue || new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    return NextResponse.json({
      success: true,
      verified: true,
      verifiedAt: new Date().toISOString(),
      attendance: {
        marked: !isAlreadyMarked,
        alreadyMarked: isAlreadyMarked,
        status: attendanceStatus,
        checkInTime: responseCheckInTime,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        isLate: attendanceStatus === 'late'
      },
      data: {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        className: student.className,
        section: student.section,
        fatherName: student.fatherName || "N/A",
        email: student.email || "N/A",
        phone: student.phone || "N/A",
        photoUrl: student.photoUrl || null,
        cardNumber: card.cardNumber,
        issueDate: card.issueDate,
        expiryDate: card.expiryDate,
        isExpired: isExpired
      }
    });
    
  } catch (error) {
    console.error("❌ Verification API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}