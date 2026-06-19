// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// // GET: Assignments ki list aur Auto-Expiry logic
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const now = new Date();

//     // Logic: Agar Due Date nikal gayi hye to status 'expired' kar do
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );

//     const assignments = await Assignment.find().sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }

// // POST: Naya Assignment create karna
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newAssignment = await Assignment.create(body);
//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }





// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; // User model import karna zaroori hye
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); // Frontend se User ID aaye gi

//     const now = new Date();

//     // 1. Auto-Expiry Logic
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );

//     let query = {};

//     // 2. Filter Logic: Agar userId hye to pehle uski class dhoondo
//     if (userId) {
//       const user = await User.findById(userId);
      
//       if (user && user.role === "student") {
//         // User schema mein 'className' use ho raha hye
//         query.targetClass = user.className; 
//       }
//     }

//     // 3. Assignments find karo filtered query ke sath
//     const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    
//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }

// // POST: Naya Assignment create karna (No Change)
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     const newAssignment = await Assignment.create(body);
//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }







// teacher




















// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     const now = new Date();

//     // 1. Auto-Expiry Logic
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );

//     let query = {};

//     // 2. Filter Logic: Agar userId hye to uski class ke mutabiq filter karo
//     if (userId) {
//       const user = await User.findById(userId);
      
//       // Agar user student hye to sirf uski class ke assignments dikhao
//       if (user && user.role === "student") {
//         query.targetClass = user.className; 
//       } 
//       // Agar user teacher hye to sirf uske apne banaye huay assignments dikhao
//       else if (user && user.role === "teacher") {
//         query.teacherId = userId;
//       }
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    
//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }


// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // Frontend se hum sirf title, subject, targetClass, dueDate, aur description bhej rahe hain
//     // teacherId aur teacherName hum session/body se confirm kar ke save karenge
    
//     const newAssignment = await Assignment.create({
//       ...body,
//       // Ensure status is active for new posts
//       status: 'active' 
//     });

//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }









//  updated th







// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User";
// import { NextResponse } from "next/server";


// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ FIX: "10th" ya "10-A" se "th" wagaira saaf karne ka logic
//     // Hum check karenge agar targetClass mein string hye to suffixes hata den
//     let cleanClass = body.targetClass;
//     if (cleanClass) {
//       // Ye regex "th", "st", "nd", "rd" ko khatam kar degi (Case insensitive)
//       cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     }

//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass, // Clean data save hoga (e.g., "10")
//       status: 'active' 
//     });

//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }

// // export async function GET(req) {
// //   await dbConnect();
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const userId = searchParams.get("userId");
// //     const now = new Date();

// //     await Assignment.updateMany(
// //       { dueDate: { $lt: now }, status: 'active' },
// //       { $set: { status: 'expired' } }
// //     );

// //     let query = {};
// //     if (userId) {
// //       const user = await User.findById(userId);
// //       if (user?.role === "student") {
// //         query.targetClass = user.className;
// //       } else if (user?.role === "teacher") {
// //         query.teacherId = userId;
// //       }
// //     }

// //     // Assignments fetch karein
// //     const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();

// //     // Har assignment ke liye submission count nikalne ke liye (Optional but helpful)
// //     // Agar aapne Submission model bana liya hye toh yahan count add kar sakte hain
    
// //     return NextResponse.json({ success: true, data: assignments });
// //   } catch (error) {
// //     return NextResponse.json({ success: false, error: error.message });
// //   }
// // }






// // export async function GET(req) {
// //   await dbConnect();
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const userId = searchParams.get("userId");
// //     const now = new Date();

// //     // 1. Jo assignments purani date ki hain unhe 'expired' karo
// //     await Assignment.updateMany(
// //       { dueDate: { $lt: now }, status: 'active' },
// //       { $set: { status: 'expired' } }
// //     );

// //     // 2. FIX: Agar teacher ne date barha di hai aur status abhi bhi 'expired' hai, toh use 'active' karo
// //     await Assignment.updateMany(
// //       { dueDate: { $gt: now }, status: 'expired' },
// //       { $set: { status: 'active' } }
// //     );

// //     let query = {};
// //     if (userId) {
// //       const user = await User.findById(userId);
// //       if (user?.role === "student") {
// //         query.targetClass = user.className;
// //       } else if (user?.role === "teacher") {
// //         query.teacherId = userId;
// //       }
// //     }

// //     const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();
    
// //     return NextResponse.json({ success: true, data: assignments });
// //   } catch (error) {
// //     return NextResponse.json({ success: false, error: error.message });
// //   }
// // }







// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const now = new Date();

//     // 1. Update statuses
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );
//     await Assignment.updateMany(
//       { dueDate: { $gt: now }, status: 'expired' },
//       { $set: { status: 'active' } }
//     );

//     let query = {};
//     let assignedSubjects = []; // Teacher ke subjects store karne ke liye

//     if (userId) {
//       const user = await User.findById(userId);
//       if (user?.role === "student") {
//         query.targetClass = user.className;
//       } else if (user?.role === "teacher") {
//         query.teacherId = userId;
//         // ✅ Teacher ke assigned subjects yahan se milenge
//         assignedSubjects = user.expertise || []; 
//       }
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();
    
//     // ✅ Response mein subjects bhi bhej rahe hain
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects 
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }

































// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; // ✅ Import Teacher Model
// import User from "@/models/User"; // Students ke liye
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name (e.g., "10th" -> "10")
//     let cleanClass = body.targetClass;
//     if (cleanClass) {
//       cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     }

//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const now = new Date();

//     // 1. Auto-update status (Expired/Active)
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );
//     await Assignment.updateMany(
//       { dueDate: { $gt: now }, status: 'expired' },
//       { $set: { status: 'active' } }
//     );

//     let query = {};
//     let assignedSubjects = []; 

//     if (userId) {
//       // ✅ Pehle Teacher model mein check karein
//       let teacher = await Teacher.findById(userId);
      
//       if (teacher) {
//         query.teacherId = userId;
//         // ✅ Aapke Schema ke mutabiq 'subject' field use ki hye
//         assignedSubjects = teacher.subject || []; 
//       } else {
//         // Agar teacher nahi hye to shayad student ho (User model)
//         const student = await User.findById(userId);
//         if (student?.role === "student") {
//           query.targetClass = student.className;
//         }
//       }
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects 
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }















































// email






// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher-js"; // ✅ Pusher import karein
// import { addEmailToQueue } from "@/lib/mailQueue"; // ✅ Jo humne pehle discuss kiya tha

// // 1. Pusher Config
// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY,
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster,
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name logic (Same as before)
//     let cleanClass = body.targetClass;
//     if (cleanClass) {
//       cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     }

//     // 2. Assignment Create karein
//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     // 3. REAL-TIME NOTIFICATION (Pusher)
//     // Hum "sms-portal" channel par event bhej rahe hain
//     await pusher.trigger("sms-portal", "new-update", {
//       message: `Bahi, New Assignment: ${newAssignment.title} has been uploaded for class ${cleanClass}!`,
//     });

//     // 4. BACKGROUND EMAIL (Redis/BullMQ)
//     // Pehle us class ke saare students ke emails dhoondein
//     const students = await User.find({ className: cleanClass, role: 'student' }).select('email');
    
//     // Har student ko queue mein add karein
//     for (const student of students) {
//       await addEmailToQueue(student.email, newAssignment.title);
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment created, Notification sent & Emails queued!",
//       data: newAssignment 
//     });

//   } catch (error) {
//     console.error("Backend Error:", error);
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }












// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; // ✅ FIXED: 'pusher-js' ko hata kar sirf 'pusher' kar diya
// import { addEmailToQueue } from "@/lib/mailQueue";
// import Teacher from "@/models/Teacher";

// // 1. Pusher Config (FIXED Syntax & Variables)
// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, // ✅ Server-side par NEXT_PUBLIC ki zaroorat nahi
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name logic
//     let cleanClass = body.targetClass;
//     if (cleanClass) {
//       cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     }

//     // 2. Assignment Create karein
//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     // 3. REAL-TIME NOTIFICATION (Pusher)
//     try {
//       await pusher.trigger("sms-portal", "new-update", {
//         message: `Bahi, New Assignment: ${newAssignment.title} for class ${cleanClass}!`,
//       });
//     } catch (pusherErr) {
//       console.error("Pusher Trigger Error:", pusherErr);
//       // Notificaton fail ho jaye toh bhi assignment save honi chahiye
//     }

//     // 4. BACKGROUND EMAIL (Redis/BullMQ)
//     const students = await User.find({ className: cleanClass, role: 'student' }).select('email');
    
//     if (students.length > 0) {
//       for (const student of students) {
//         if (student.email) {
//           await addEmailToQueue(student.email, newAssignment.title);
//         }
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment created, Notification sent & Emails queued!",
//       data: newAssignment 
//     });

//   } catch (error) {
//     console.error("Backend Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     let assignedSubjects = [];
//     let query = {};

//     if (userId) {
//       // Teacher model se subjects nikaalna
//       const teacher = await Teacher.findById(userId);
//       if (teacher) {
//         query.teacherId = userId;
//         assignedSubjects = teacher.subject || []; // ✅ Ensure this is an array
//       }
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 });

//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects // ✅ Ye frontend ko milna zaroori hye
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }














// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; // ✅ Notification history ke liye
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 
// import { addEmailToQueue } from "@/lib/mailQueue";

// // 1. Pusher Config
// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name logic
//     let cleanClass = body.targetClass;
//     if (cleanClass) {
//       cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     }

//     // 2. Assignment Create karein
//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     const notificationMsg = `Bahi, New Assignment: ${newAssignment.title} has been uploaded for class ${cleanClass}!`;

//     // 3. SAVE TO DATABASE (For Offline History) ✅
//     // Is se student login karte waqt purani notifications dekh sakega
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     // 4. REAL-TIME NOTIFICATION (Pusher)
//     try {
//       await pusher.trigger("sms-portal", "new-update", {
//         message: notificationMsg,
//         assignmentId: newAssignment._id
//       });
//     } catch (pusherErr) {
//       console.error("Pusher Trigger Error:", pusherErr);
//     }

//     // 5. BACKGROUND EMAIL (Redis/BullMQ)
//     // Us class ke saare students ko email queue mein daalna
//     const students = await User.find({ className: cleanClass, role: 'student' }).select('email');
    
//     if (students.length > 0) {
//       for (const student of students) {
//         if (student.email) {
//           await addEmailToQueue(student.email, newAssignment.title);
//         }
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment Created, History Saved & Notifications Sent!",
//       data: newAssignment 
//     });

//   } catch (error) {
//     console.error("Backend Critical Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // 6. GET Method for Dashboard Stats & Subjects
// // export async function GET(req) {
// //   await dbConnect();
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const className = searchParams.get("className");

// //     const query = className ? { targetClass: className } : {};
// //     const assignments = await Assignment.find(query).sort({ createdAt: -1 });

// //     return NextResponse.json({ success: true, data: assignments });
// //   } catch (error) {
// //     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
// //   }
// // }









// // // Aapka mojuda backend GET method
// // export async function GET(req) {
// //   await dbConnect();
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const className = searchParams.get("className"); // ❌ Sirf className check ho raha hai

// //     const query = className ? { targetClass: className } : {}; // ❌ userId missing hai
// //     const assignments = await Assignment.find(query).sort({ createdAt: -1 });

// //     return NextResponse.json({ success: true, data: assignments });
// //   } catch (error) {
// //     // Agar yahan koi validation fail hui toh 400 ya 500 aayega
// //     return NextResponse.json({ success: false, error: error.message }, { status: 400 });
// //   }
// // }






















// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const className = searchParams.get("className");

//     // ✅ LOGS FOR DEBUGGING
//     console.log("--- DEBUG START ---");
//     console.log("Incoming Teacher ID:", userId);
//     console.log("Incoming Class Name:", className);
//     console.log("--- DEBUG END ---");

//     let query = {};

//     // 1. Agar userId "undefined" string aa rahi hye ya khali hye
//     if (userId && userId !== "undefined") {
//       query.teacherId = userId; 
//     } 
//     // 2. Agar student apni class ke liye assignments mang raha hye
//     else if (className && className !== "undefined") {
//       query.targetClass = className;
//     } 
//     // 3. Agar dono nahi hain, to error bhej do taake client crash na ho
//     else {
//       console.warn("⚠️ No valid ID or ClassName provided");
//       return NextResponse.json({ 
//         success: false, 
//         error: "Teacher ID ya Class missing hye bahi!" 
//       }, { status: 400 });
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     console.error("Backend GET Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }





















































































































































































// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     let cleanClass = body.targetClass?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     const notificationMsg = `Bahi, New Assignment: ${newAssignment.title} for class ${cleanClass}!`;

//     // 1. Save History (Jo model aapne dikhaya wahi use kiya hye)
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     // 2. Real-time Trigger
//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id
//     });

//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const className = searchParams.get("className");

//     let query = {};

//     // ✅ Strict check for valid IDs
//     if (userId && userId !== "undefined" && userId !== "null") {
//       query.teacherId = userId; 
//     } 
//     else if (className && className !== "undefined" && className !== "null") {
//       query.targetClass = className.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     } 
//     else {
//       return NextResponse.json({ success: true, data: [] }); // Khali data bhejdo error ke bajaye
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, data: assignments });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }















































// all in one







// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 

// // Pusher Initialization
// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name (e.g., "10th" -> "10")
//     let cleanClass = body.targetClass?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     // 1. Create Assignment
//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     const notificationMsg = `Bahi, New Assignment: ${newAssignment.title} for class ${cleanClass}!`;

//     // 2. Save to Notification History (Database)
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     // 3. Real-time Trigger with Pusher
//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ success: true, data: newAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const now = new Date();

//     // 1. Auto-update status logic (Expired/Active)
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );
//     await Assignment.updateMany(
//       { dueDate: { $gt: now }, status: 'expired' },
//       { $set: { status: 'active' } }
//     );

//     let query = {};
//     let assignedSubjects = []; 

//     // ✅ Advanced Role-based Fetching
//     if (userId && userId !== "undefined" && userId !== "null") {
//       // Pehle check karein ke ye Teacher hye?
//       let teacher = await Teacher.findById(userId);
      
//       if (teacher) {
//         query.teacherId = userId;
//         assignedSubjects = teacher.subject || []; 
//       } else {
//         // Agar teacher nahi hye to User (Student) check karein
//         const student = await User.findById(userId);
//         if (student) {
//           // Student ki class ko bhi clean karein fetch ke liye
//           const studentClass = student.className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//           query.targetClass = studentClass;
//         }
//       }
//     } else {
//       return NextResponse.json({ success: true, data: [], assignedSubjects: [] });
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects 
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }





































// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 

// // Pusher Initialization
// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name (e.g., "10th" -> "10")
//     let cleanClass = body.targetClass?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     // 1. Create Assignment
//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     // Boss: Notification message updated to English
//     const notificationMsg = `New Assignment Alert: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;

//     // 2. Save to Notification History
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     // 3. Real-time Trigger with Pusher
//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published and notifications sent successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         message: "No User ID provided." 
//       });
//     }

//     // 1. Auto-update status logic
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );
//     await Assignment.updateMany(
//       { dueDate: { $gt: now }, status: 'expired' },
//       { $set: { status: 'active' } }
//     );

//     let query = {};
//     let assignedSubjects = []; 

//     // ✅ Role-based Fetching
//     let teacher = await Teacher.findById(userId);
    
//     if (teacher) {
//       query.teacherId = userId;
//       assignedSubjects = teacher.subject || []; 
//     } else {
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = student.className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//         query.targetClass = studentClass;
//       } else {
//         return NextResponse.json({ 
//           success: false, 
//           message: "User account not found." 
//         }, { status: 404 });
//       }
//     }

//     const assignments = await Assignment.find(query).sort({ createdAt: -1 }).lean();
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects,
//       message: "Assignments fetched successfully."
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }





















// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 

// // Pusher Initialization
// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // ✅ Clean Class Name (e.g., "10th" -> "10")
//     let cleanClass = body.targetClass?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     // 1. Create Assignment
//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     // Boss: Notification message updated to English
//     const notificationMsg = `New Assignment Alert: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;

//     // 2. Save to Notification History
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     // 3. Real-time Trigger with Pusher
//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published and notifications sent successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
    
//     // Pagination Parameters
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; // CHANGED: Default 5 assignments per page
    
//     const skip = (page - 1) * limit;
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         pagination: { total: 0, page: 1, totalPages: 0 },
//         message: "No User ID provided." 
//       });
//     }

//     // 1. Auto-update status logic
//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );
//     await Assignment.updateMany(
//       { dueDate: { $gt: now }, status: 'expired' },
//       { $set: { status: 'active' } }
//     );

//     let query = {};
//     let assignedSubjects = []; 

//     // ✅ Role-based Fetching
//     let teacher = await Teacher.findById(userId);
    
//     if (teacher) {
//       query.teacherId = userId;
//       assignedSubjects = teacher.subject || []; 
//     } else {
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = student.className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//         query.targetClass = studentClass;
//       } else {
//         return NextResponse.json({ 
//           success: false, 
//           message: "User account not found." 
//         }, { status: 404 });
//       }
//     }

//     // Get Total Count for Pagination
//     const totalAssignments = await Assignment.countDocuments(query);

//     // Fetch Data with Skip and Limit
//     const assignments = await Assignment.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects,
//       pagination: {
//         total: totalAssignments,
//         page: page,
//         totalPages: Math.ceil(totalAssignments / limit),
//         hasMore: skip + assignments.length < totalAssignments
//       },
//       message: "Assignments fetched successfully."
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }











// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     let cleanClass = body.targetClass?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     const notificationMsg = `New Assignment Alert: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;

//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published and notifications sent successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
    
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; 
    
//     const skip = (page - 1) * limit;
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         pagination: { total: 0, page: 1, totalPages: 0 },
//         message: "No User ID provided." 
//       });
//     }

//     await Assignment.updateMany(
//       { dueDate: { $lt: now }, status: 'active' },
//       { $set: { status: 'expired' } }
//     );
//     await Assignment.updateMany(
//       { dueDate: { $gt: now }, status: 'expired' },
//       { $set: { status: 'active' } }
//     );

//     let query = {};
//     let assignedSubjects = []; 

//     let teacher = await Teacher.findById(userId).populate("subjects");
    
//     if (teacher) {
//       query.teacherId = userId;
      
//       let rawSubjects = teacher.subjects || [];
      
//       assignedSubjects = rawSubjects.map(sub => {
//         if (typeof sub === 'object' && sub !== null) {
//           return sub.name || sub.title || String(sub._id);
//         }
//         return String(sub);
//       });
//     } else {
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = student.className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//         query.targetClass = studentClass;
//       } else {
//         return NextResponse.json({ 
//           success: false, 
//           message: "User account not found." 
//         }, { status: 404 });
//       }
//     }

//     const totalAssignments = await Assignment.countDocuments(query);

//     const assignments = await Assignment.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects,
//       pagination: {
//         total: totalAssignments,
//         page: page,
//         totalPages: Math.ceil(totalAssignments / limit),
//         hasMore: skip + assignments.length < totalAssignments
//       },
//       message: "Assignments fetched successfully."
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }











































// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// // Agat Subject ka model bana hua hy toh usko import karna zaroori hy populate ke liye
// import "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     let cleanClass = body.targetClass?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active' 
//     });

//     const notificationMsg = `New Assignment Alert: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;

//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment'
//     });

//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published and notifications sent successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
    
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; 
    
//     const skip = (page - 1) * limit;
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         pagination: { total: 0, page: 1, totalPages: 0 },
//         message: "No User ID provided." 
//       });
//     }

//     // Safely execute state updates
//     try {
//       await Assignment.updateMany(
//         { dueDate: { $lt: now }, status: 'active' },
//         { $set: { status: 'expired' } }
//       );
//       await Assignment.updateMany(
//         { dueDate: { $gt: now }, status: 'expired' },
//         { $set: { status: 'active' } }
//       );
//     } catch (e) {
//       console.warn("Status auto-update bypassed:", e.message);
//     }

//     let query = {};
//     let assignedSubjects = []; 

//     // Safe lookup structure to avoid 500 error engine crashes
//     let teacher = null;
//     try {
//       teacher = await Teacher.findById(userId).populate("subjects");
//     } catch (err) {
//       console.warn("Teacher collection verification bypassed, falling back to Student profile query layer.");
//     }
    
//     if (teacher) {
//       query.teacherId = userId;
//       let rawSubjects = teacher.subjects || [];
//       assignedSubjects = rawSubjects.map(sub => {
//         if (typeof sub === 'object' && sub !== null) {
//           return sub.name || sub.title || String(sub._id);
//         }
//         return String(sub);
//       });
//     } else {
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = student.className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//         query.targetClass = studentClass;
//       } else {
//         // Return 200 clean dataset instead of standard breaking crashes
//         return NextResponse.json({ 
//           success: true, 
//           data: [], 
//           assignedSubjects: [],
//           pagination: { total: 0, page: 1, totalPages: 0 },
//           message: "User account profile node not found." 
//         });
//       }
//     }

//     const totalAssignments = await Assignment.countDocuments(query);

//     const assignments = await Assignment.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignments, 
//       assignedSubjects: assignedSubjects,
//       pagination: {
//         total: totalAssignments,
//         page: page,
//         totalPages: Math.ceil(totalAssignments / limit),
//         hasMore: skip + assignments.length < totalAssignments
//       },
//       message: "Assignments fetched successfully."
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }



// AI
// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import Syllabus from "@/models/Syllabus"; 
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 
// import Groq from "groq-sdk";

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// // Helper function to clean class name
// function cleanClassName(className) {
//   return className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
// }

// // Helper function to extract JSON from AI response
// function extractJSONFromResponse(text) {
//   const firstBrace = text.indexOf('{');
//   const lastBrace = text.lastIndexOf('}') + 1;
  
//   if (firstBrace !== -1 && lastBrace !== 0) {
//     return text.substring(firstBrace, lastBrace);
//   }
  
//   const jsonMatch = text.match(/\{[\s\S]*\}/);
//   if (jsonMatch) {
//     return jsonMatch[0];
//   }
  
//   return '{"assignments":[]}';
// }

// // POST: Create new assignment
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     let cleanClass = cleanClassName(body.targetClass);

//     // Validate required fields
//     if (!body.title || !body.subject || !cleanClass) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing required fields: title, subject, targetClass" 
//       }, { status: 400 });
//     }

//     const newAssignment = await Assignment.create({
//       ...body,
//       targetClass: cleanClass,
//       status: 'active',
//       createdAt: new Date()
//     });

//     // Send notification to class
//     const notificationMsg = `📚 New Assignment: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;

//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment',
//       assignmentId: newAssignment._id
//     });

//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published and notifications sent successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // GET: Fetch assignments (for teacher or student) + AI recommendations
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const recommend = searchParams.get("recommend");
//     const subject = searchParams.get("subject");
//     const targetClass = searchParams.get("targetClass");
//     const board = searchParams.get("board") || "sindh";
//     const chapterNumber = searchParams.get("chapter"); // 👈 NEW: specific chapter

//     // --- AI Recommendation Engine ---
//     if (recommend === "true") {
//       if (!subject || !targetClass) {
//         return NextResponse.json({ 
//           success: false, 
//           error: "Subject and Target Class parameters required" 
//         }, { status: 400 });
//       }

//       const apiKey = process.env.GROQ_API_KEY;
//       if (!apiKey) {
//         return NextResponse.json({ 
//           success: false, 
//           error: "AI Engine Configuration Key missing." 
//         }, { status: 500 });
//       }

//       const cleanClassQuery = cleanClassName(targetClass);
      
//       // Find subject by ID or name
//       let subjectDoc = null;
//       if (subject.match(/^[0-9a-fA-F]{24}$/)) {
//         subjectDoc = await Subject.findById(subject);
//       } else {
//         subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${subject}$`, 'i') } });
//       }
      
//       const subjectName = subjectDoc?.name || subject;
      
//       // Find syllabus based on subject, class, board
//       let lockedSyllabus = await Syllabus.findOne({ 
//         $or: [
//           { subjectId: subjectDoc?._id || subject },
//           { subjectName: { $regex: new RegExp(`^${subjectName}$`, 'i') } }
//         ],
//         targetClass: cleanClassQuery,
//         board: board.toLowerCase()
//       }).lean();

//       let syllabusContextString = "No specific textbook constraints found. Generate general high-standard educational tasks.";
//       let selectedChapterData = null;
      
//       if (lockedSyllabus && lockedSyllabus.chapters && lockedSyllabus.chapters.length > 0) {
//         // 👇 If specific chapter requested
//         if (chapterNumber) {
//           selectedChapterData = lockedSyllabus.chapters.find(
//             ch => ch.chapterNumber === parseInt(chapterNumber)
//           );
          
//           if (selectedChapterData) {
//             syllabusContextString = `CRITICAL COMPLIANCE: You MUST base the assignment ONLY on this specific chapter:
            
// Chapter ${selectedChapterData.chapterNumber}: ${selectedChapterData.chapterName}
// Topics to cover: ${selectedChapterData.topics?.join(", ") || "All topics in this chapter"}

// DO NOT include any content from other chapters.`;
//           } else {
//             // If chapter not found, show all chapters
//             const structuralMap = lockedSyllabus.chapters.map(ch => 
//               `Chapter ${ch.chapterNumber}: ${ch.chapterName} (Topics: ${ch.topics?.slice(0, 5).join(", ")})`
//             ).join("\n");
//             syllabusContextString = `CRITICAL COMPLIANCE: Align assignments with this locked syllabus:\n${structuralMap}`;
//           }
//         } else {
//           // No specific chapter, show all for recommendations
//           const structuralMap = lockedSyllabus.chapters.map(ch => 
//             `Chapter ${ch.chapterNumber}: ${ch.chapterName}`
//           ).join("\n");
//           syllabusContextString = `Available chapters in syllabus:\n${structuralMap}\n\nGenerate assignments covering different chapters.`;
//         }
//       }

//       const groq = new Groq({ apiKey: apiKey.trim() });

//       const prompt = `You are an elite academic curriculum manager.

// Generate exactly 3 structured assignments for:
// - Class: ${targetClass}
// - Subject: ${subjectName}
// - Board: ${board.toUpperCase()}

// ${syllabusContextString}

// Requirements:
// 1. Each assignment title must be engaging and educational
// 2. Each description must explain what students will learn (2-3 sentences)
// 3. If a specific chapter is provided, ALL assignments MUST be based on that chapter
// 4. If no specific chapter, cover different chapters

// Return ONLY valid JSON:
// {
//   "assignments": [
//     {
//       "title": "Assignment Title Here",
//       "description": "Detailed description of the assignment",
//       "chapterReference": 1
//     }
//   ]
// }`;

//       const chatCompletion = await groq.chat.completions.create({
//         model: "llama-3.1-8b-instant",
//         messages: [
//           {
//             role: "system",
//             content: "You are a professional educational curriculum engine. Output must be a JSON object containing an array named assignments. Do not include markdown or extra text."
//           },
//           {
//             role: "user",
//             content: prompt
//           }
//         ],
//         temperature: 0.3,
//         max_tokens: 2000,
//       });

//       const rawText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
      
//       try {
//         let cleanJson = extractJSONFromResponse(rawText);
//         const parsedData = JSON.parse(cleanJson);
        
//         let aiRecommendations = [];
//         if (parsedData && Array.isArray(parsedData.assignments)) {
//           aiRecommendations = parsedData.assignments;
//         } else if (parsedData && Array.isArray(parsedData)) {
//           aiRecommendations = parsedData;
//         }
        
//         // Add syllabus info to response
//         return NextResponse.json({ 
//           success: true, 
//           data: aiRecommendations,
//           syllabusInfo: lockedSyllabus ? {
//             subject: lockedSyllabus.subjectName,
//             class: lockedSyllabus.targetClass,
//             board: lockedSyllabus.board,
//             totalChapters: lockedSyllabus.chapters?.length || 0,
//             selectedChapter: selectedChapterData ? {
//               number: selectedChapterData.chapterNumber,
//               name: selectedChapterData.chapterName,
//               topics: selectedChapterData.topics?.slice(0, 5) || []
//             } : null
//           } : null
//         });
//       } catch (jsonErr) {
//         console.error("JSON parse error:", jsonErr.message);
//         console.error("Raw response:", rawText);
//         return NextResponse.json({ 
//           success: false, 
//           error: "AI response processing error",
//           rawResponse: rawText 
//         }, { status: 500 });
//       }
//     }

//     // --- Regular Assignment Fetching ---
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         pagination: { total: 0, page: 1, totalPages: 0 }
//       });
//     }

//     // Update expired assignments
//     try {
//       await Assignment.updateMany(
//         { dueDate: { $lt: now }, status: 'active' },
//         { $set: { status: 'expired' } }
//       );
//     } catch (e) {
//       console.warn("Status update warning:", e.message);
//     }

//     let query = {};
//     let assignedSubjects = []; 

//     // Check if user is teacher
//     let teacher = null;
//     try {
//       teacher = await Teacher.findById(userId).populate("subjects");
//     } catch (err) {
//       // Not a teacher
//     }
    
//     if (teacher) {
//       // Teacher sees their own assignments
//       query.teacherId = userId;
//       let rawSubjects = teacher.subjects || [];
//       assignedSubjects = rawSubjects.map(sub => {
//         if (typeof sub === 'object' && sub !== null) {
//           return { id: sub._id, name: sub.name };
//         }
//         return { id: sub, name: sub };
//       });
//     } else {
//       // Student: filter by class
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = cleanClassName(student.className);
//         query.targetClass = studentClass;
//       } else {
//         return NextResponse.json({ 
//           success: true, 
//           data: [], 
//           assignedSubjects: [],
//           pagination: { total: 0, page: 1, totalPages: 0 }
//         });
//       }
//     }

//     const totalAssignments = await Assignment.countDocuments(query);
//     const assignments = await Assignment.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
    
//     // Add subject names to assignments
//     const assignmentsWithSubjects = await Promise.all(assignments.map(async (assignment) => {
//       if (assignment.subject && !assignment.subjectName) {
//         const subjectDoc = await Subject.findById(assignment.subject);
//         assignment.subjectName = subjectDoc?.name || assignment.subject;
//       }
//       return assignment;
//     }));
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignmentsWithSubjects, 
//       assignedSubjects: assignedSubjects,
//       pagination: {
//         total: totalAssignments,
//         page: page,
//         totalPages: Math.ceil(totalAssignments / limit),
//         hasMore: skip + assignments.length < totalAssignments
//       }
//     });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }





// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import Syllabus from "@/models/Syllabus"; 
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 
// import Groq from "groq-sdk";

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// // Helper function to clean class name
// function cleanClassName(className) {
//   return className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
// }

// // Helper function to extract JSON from AI response
// function extractJSONFromResponse(text) {
//   const firstBrace = text.indexOf('{');
//   const lastBrace = text.lastIndexOf('}') + 1;
  
//   if (firstBrace !== -1 && lastBrace !== 0) {
//     return text.substring(firstBrace, lastBrace);
//   }
  
//   const jsonMatch = text.match(/\{[\s\S]*\}/);
//   if (jsonMatch) {
//     return jsonMatch[0];
//   }
  
//   return '{"assignments":[]}';
// }

// // POST: Create new assignment
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     let cleanClass = cleanClassName(body.targetClass);

//     // Validate required fields
//     if (!body.title || !body.subject || !cleanClass) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing required fields: title, subject, targetClass" 
//       }, { status: 400 });
//     }

//     // 👇 Fetch subject name from ID
//     let subjectName = body.subject;
//     let subjectDoc = null;
    
//     if (body.subject.match(/^[0-9a-fA-F]{24}$/)) {
//       subjectDoc = await Subject.findById(body.subject);
//       subjectName = subjectDoc?.name || body.subject;
//     } else {
//       // If name is passed instead of ID
//       subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${body.subject}$`, 'i') } });
//       if (subjectDoc) {
//         subjectName = subjectDoc.name;
//       }
//     }

//     const newAssignment = await Assignment.create({
//       title: body.title,
//       description: body.description || "",
//       subject: subjectDoc?._id || body.subject,
//       subjectName: subjectName,
//       teacherId: body.teacherId,
//       teacherName: body.teacherName,
//       targetClass: cleanClass,
//       dueDate: body.dueDate,
//       maxMarks: body.maxMarks || 100,
//       chapterReference: body.chapterReference || null,
//       chapterName: body.chapterName || null,
//       status: 'active'
//     });

//     // Send notification to class
//     const notificationMsg = `📚 New Assignment: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;

//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment',
//       assignmentId: newAssignment._id
//     });

//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published and notifications sent successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // GET: Fetch assignments (for teacher or student) + AI recommendations
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const recommend = searchParams.get("recommend");
//     const subject = searchParams.get("subject");
//     const targetClass = searchParams.get("targetClass");
//     const board = searchParams.get("board") || "sindh";
//     const chapterNumber = searchParams.get("chapter");

  
// // --- AI Recommendation Engine ---
// if (recommend === "true") {
//   if (!subject || !targetClass) {
//     return NextResponse.json({ 
//       success: false, 
//       error: "Subject and Target Class parameters required" 
//     }, { status: 400 });
//   }

//   const apiKey = process.env.GROQ_API_KEY;
//   if (!apiKey) {
//     return NextResponse.json({ 
//       success: false, 
//       error: "AI Engine Configuration Key missing." 
//     }, { status: 500 });
//   }

//   const cleanClassQuery = cleanClassName(targetClass);
  
//   // Find subject by ID or name
//   let subjectDoc = null;
//   let subjectIdForQuery = subject;
//   let subjectNameForDisplay = subject;
  
//   if (subject.match(/^[0-9a-fA-F]{24}$/)) {
//     subjectDoc = await Subject.findById(subject);
//     subjectIdForQuery = subjectDoc?._id || subject;
//     subjectNameForDisplay = subjectDoc?.name || subject;
//   } else {
//     subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${subject}$`, 'i') } });
//     subjectIdForQuery = subjectDoc?._id || subject;
//     subjectNameForDisplay = subjectDoc?.name || subject;
//   }
  
//   // Find syllabus based on subject, class, board
//   let lockedSyllabus = await Syllabus.findOne({ 
//     subjectId: subjectIdForQuery,
//     targetClass: cleanClassQuery,
//     board: board.toLowerCase()
//   }).lean();

//   let selectedChapterData = null;
//   let chapterTopics = [];
//   let allChaptersData = [];
  
//   if (lockedSyllabus && lockedSyllabus.chapters && lockedSyllabus.chapters.length > 0) {
//     // Store all chapters for reference
//     allChaptersData = lockedSyllabus.chapters.map(ch => ({
//       number: ch.chapterNumber,
//       name: ch.chapterName,
//       topics: ch.topics || []
//     }));
    
//     if (chapterNumber) {
//       selectedChapterData = lockedSyllabus.chapters.find(
//         ch => ch.chapterNumber === parseInt(chapterNumber)
//       );
      
//       if (selectedChapterData) {
//         chapterTopics = selectedChapterData.topics || [];
//         console.log(`📚 Chapter ${selectedChapterData.chapterNumber}: ${selectedChapterData.chapterName}`);
//         console.log(`📝 Topics in syllabus: ${chapterTopics.length}`);
//         console.log(`📋 Topics list: ${chapterTopics.join(", ")}`);
//       }
//     }
//   }

//   const groq = new Groq({ apiKey: apiKey.trim() });

//   // 👇 MAIN PROMPT - Sirf syllabus ke topics use kare
//   const prompt = `You are a strict syllabus-based assignment generator.

// Generate exactly 3 UNIQUE assignments for:
// - Class: ${targetClass}
// - Subject: ${subjectNameForDisplay}
// - Chapter: ${selectedChapterData?.chapterName || "General"}

// STRICT RULES - YOU MUST FOLLOW:
// 1. ONLY use topics from the list below. DO NOT invent new topics.
// 2. Topics available in syllabus: ${chapterTopics.join(", ")}

// 3. Each assignment MUST cover DIFFERENT topics from the list:
//    - Assignment 1 → Use first 2-3 topics from the list
//    - Assignment 2 → Use next 2-3 topics from the list
//    - Assignment 3 → Use remaining 2-3 topics from the list

// 4. Assignment titles MUST directly mention the topics they cover
// 5. DO NOT repeat any topic across assignments
// 6. DO NOT add any topic not in the list
// 7. Descriptions should explain what students will learn (2 sentences max)

// VALID EXAMPLE (if topics are "Introduction, Branches, Instruments, Prefixes"):
// - Assignment 1: "Introduction to Physics and Its Branches" - Based on Introduction, Branches
// - Assignment 2: "Understanding Measuring Instruments" - Based on Instruments
// - Assignment 3: "Mastering Prefixes in Physics" - Based on Prefixes

// INVALID EXAMPLE (DO NOT DO THIS):
// - Adding topics like "Quantum Physics" or "Relativity" - NOT in the list

// Return ONLY valid JSON:
// {
//   "assignments": [
//     {"title": "Title Using Specific Topics", "description": "Description of what students will learn", "chapterReference": ${selectedChapterData?.chapterNumber || 1}},
//     {"title": "Different Title Using Different Topics", "description": "Different description", "chapterReference": ${selectedChapterData?.chapterNumber || 1}},
//     {"title": "Third Title Using Remaining Topics", "description": "Third description", "chapterReference": ${selectedChapterData?.chapterNumber || 1}}
//   ]
// }`;

//   const chatCompletion = await groq.chat.completions.create({
//     model: "llama-3.1-8b-instant",
//     messages: [
//       {
//         role: "system",
//         content: "You are a strict syllabus-based assignment generator. You MUST ONLY use topics provided in the user's message. NEVER invent new topics. NEVER add content outside the syllabus. Output must be valid JSON."
//       },
//       {
//         role: "user",
//         content: prompt
//       }
//     ],
//     temperature: 0.3,
//     max_tokens: 2000,
//   });

//   const rawText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
  
//   try {
//     let cleanJson = extractJSONFromResponse(rawText);
//     const parsedData = JSON.parse(cleanJson);
    
//     let aiRecommendations = [];
//     if (parsedData && Array.isArray(parsedData.assignments)) {
//       aiRecommendations = parsedData.assignments;
//     } else if (parsedData && Array.isArray(parsedData)) {
//       aiRecommendations = parsedData;
//     }
    
//     console.log("🤖 Generated Assignments based on syllabus topics:");
//     aiRecommendations.forEach((a, i) => {
//       console.log(`   ${i+1}. ${a.title}`);
//     });
    
//     return NextResponse.json({ 
//       success: true, 
//       data: aiRecommendations,
//       syllabusInfo: {
//         subject: lockedSyllabus?.subjectName,
//         class: lockedSyllabus?.targetClass,
//         totalChapters: lockedSyllabus?.chapters?.length || 0,
//         selectedChapter: selectedChapterData ? {
//           number: selectedChapterData.chapterNumber,
//           name: selectedChapterData.chapterName,
//           topics: chapterTopics
//         } : null
//       }
//     });
//   } catch (jsonErr) {
//     console.error("JSON parse error:", jsonErr.message);
//     return NextResponse.json({ 
//       success: false, 
//       error: "AI response processing error"
//     }, { status: 500 });
//   }
// }

//     // --- Regular Assignment Fetching ---
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         pagination: { total: 0, page: 1, totalPages: 0 }
//       });
//     }

//     // Update expired assignments
//     try {
//       await Assignment.updateMany(
//         { dueDate: { $lt: now }, status: 'active' },
//         { $set: { status: 'expired' } }
//       );
//     } catch (e) {
//       console.warn("Status update warning:", e.message);
//     }

//     let query = {};
//     let assignedSubjects = []; 

//     // Check if user is teacher
//     let teacher = null;
//     try {
//       teacher = await Teacher.findById(userId).populate("subjects");
//     } catch (err) {
//       // Not a teacher
//     }
    
//     if (teacher) {
//       // Teacher sees their own assignments
//       query.teacherId = userId;
//       let rawSubjects = teacher.subjects || [];
//       assignedSubjects = rawSubjects.map(sub => {
//         if (typeof sub === 'object' && sub !== null) {
//           return { id: sub._id, name: sub.name };
//         }
//         return { id: sub, name: sub };
//       });
//     } else {
//       // Student: filter by class
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = cleanClassName(student.className);
//         query.targetClass = studentClass;
//       } else {
//         return NextResponse.json({ 
//           success: true, 
//           data: [], 
//           assignedSubjects: [],
//           pagination: { total: 0, page: 1, totalPages: 0 }
//         });
//       }
//     }

//     const totalAssignments = await Assignment.countDocuments(query);
    
//     // 👇 POPULATE subject to get name
//     const assignments = await Assignment.find(query)
//       .populate('subject', 'name')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
    
//     // Add subject name to each assignment
//     const assignmentsWithSubjects = assignments.map(assignment => ({
//       ...assignment,
//       subjectName: assignment.subject?.name || assignment.subjectName,
//       subject: assignment.subject?._id || assignment.subject
//     }));
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignmentsWithSubjects, 
//       assignedSubjects: assignedSubjects,
//       pagination: {
//         total: totalAssignments,
//         page: page,
//         totalPages: Math.ceil(totalAssignments / limit),
//         hasMore: skip + assignments.length < totalAssignments
//       }
//     });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // PUT: Update assignment
// export async function PUT(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params;
//     const body = await req.json();
    
//     const updatedAssignment = await Assignment.findByIdAndUpdate(
//       id,
//       { ...body },
//       { new: true }
//     ).populate('subject', 'name');
    
//     if (!updatedAssignment) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment not found" 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       data: updatedAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // DELETE: Delete assignment
// export async function DELETE(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params;
    
//     const deletedAssignment = await Assignment.findByIdAndDelete(id);
    
//     if (!deletedAssignment) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment not found" 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment deleted successfully" 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }
































// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import Teacher from "@/models/Teacher"; 
// import User from "@/models/User"; 
// import Notification from "@/models/Notification"; 
// import Syllabus from "@/models/Syllabus"; 
// import Subject from "@/models/Subject"; 
// import { NextResponse } from "next/server";
// import Pusher from "pusher"; 
// import Groq from "groq-sdk";

// const pusher = new Pusher({
//   appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
//   secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
//   cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
//   useTLS: true,
// });

// function cleanClassName(className) {
//   return className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
// }

// function extractJSONFromResponse(text) {
//   const firstBrace = text.indexOf('{');
//   const lastBrace = text.lastIndexOf('}') + 1;
  
//   if (firstBrace !== -1 && lastBrace !== 0) {
//     return text.substring(firstBrace, lastBrace);
//   }
  
//   const jsonMatch = text.match(/\{[\s\S]*\}/);
//   if (jsonMatch) {
//     return jsonMatch[0];
//   }
  
//   return '{"assignments":[]}';
// }

// // POST: Create new assignment
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     let cleanClass = cleanClassName(body.targetClass);

//     if (!body.title || !body.subject || !cleanClass) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing required fields: title, subject, targetClass" 
//       }, { status: 400 });
//     }

//     let subjectName = body.subject;
//     let subjectDoc = null;
    
//     if (body.subject.match(/^[0-9a-fA-F]{24}$/)) {
//       subjectDoc = await Subject.findById(body.subject);
//       subjectName = subjectDoc?.name || body.subject;
//     } else {
//       subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${body.subject}$`, 'i') } });
//       if (subjectDoc) subjectName = subjectDoc.name;
//     }

//     const newAssignment = await Assignment.create({
//       title: body.title,
//       description: body.description || "",
//       subject: subjectDoc?._id || body.subject,
//       subjectName: subjectName,
//       teacherId: body.teacherId,
//       teacherName: body.teacherName,
//       targetClass: cleanClass,
//       dueDate: body.dueDate,
//       maxMarks: body.maxMarks || 100,
//       chapterReference: body.chapterReference || null,
//       chapterName: body.chapterName || null,
//       status: 'active'
//     });

//     const notificationMsg = `📚 New Assignment: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment',
//       assignmentId: newAssignment._id
//     });
//     await pusher.trigger("sms-portal", "new-update", {
//       message: notificationMsg,
//       assignmentId: newAssignment._id,
//       targetClass: cleanClass
//     });

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // GET: Fetch assignments + AI recommendations with topic selection
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const recommend = searchParams.get("recommend");
//     const subject = searchParams.get("subject");
//     const targetClass = searchParams.get("targetClass");
//     const board = searchParams.get("board") || "sindh";
//     const chapterNumber = searchParams.get("chapter");
//     const selectedTopicsParam = searchParams.get("topics"); // 👈 NEW: Comma-separated topics

//     // --- AI Recommendation Engine ---
//     if (recommend === "true") {
//       if (!subject || !targetClass) {
//         return NextResponse.json({ 
//           success: false, 
//           error: "Subject and Target Class parameters required" 
//         }, { status: 400 });
//       }

//       const apiKey = process.env.GROQ_API_KEY;
//       if (!apiKey) {
//         return NextResponse.json({ 
//           success: false, 
//           error: "AI Engine Configuration Key missing." 
//         }, { status: 500 });
//       }

//       const cleanClassQuery = cleanClassName(targetClass);
      
//       let subjectDoc = null;
//       let subjectIdForQuery = subject;
//       let subjectNameForDisplay = subject;
      
//       if (subject.match(/^[0-9a-fA-F]{24}$/)) {
//         subjectDoc = await Subject.findById(subject);
//         subjectIdForQuery = subjectDoc?._id || subject;
//         subjectNameForDisplay = subjectDoc?.name || subject;
//       } else {
//         subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${subject}$`, 'i') } });
//         subjectIdForQuery = subjectDoc?._id || subject;
//         subjectNameForDisplay = subjectDoc?.name || subject;
//       }
      
//       let lockedSyllabus = await Syllabus.findOne({ 
//         subjectId: subjectIdForQuery,
//         targetClass: cleanClassQuery,
//         board: board.toLowerCase()
//       }).lean();

//       let syllabusExists = false;
//       let selectedChapterData = null;
//       let chapterTopics = [];
      
//       if (lockedSyllabus && lockedSyllabus.chapters && lockedSyllabus.chapters.length > 0) {
//         syllabusExists = true;
        
//         if (chapterNumber) {
//           selectedChapterData = lockedSyllabus.chapters.find(
//             ch => ch.chapterNumber === parseInt(chapterNumber)
//           );
//           if (selectedChapterData) {
//             chapterTopics = selectedChapterData.topics || [];
//           }
//         }
//       }

//       if (!syllabusExists) {
//         return NextResponse.json({ 
//           success: false, 
//           syllabusExists: false,
//           message: `No syllabus found for Class ${targetClass} - ${subjectNameForDisplay}. Please upload syllabus first.`,
//           data: []
//         });
//       }

//       if (!selectedChapterData) {
//         return NextResponse.json({ 
//           success: false, 
//           syllabusExists: true,
//           message: "Please select a chapter first",
//           data: []
//         });
//       }

//       // 👇 PARSE SELECTED TOPICS FROM FRONTEND
//       let selectedTopicsList = [];
//       if (selectedTopicsParam) {
//         selectedTopicsList = decodeURIComponent(selectedTopicsParam).split(',');
//         console.log(`📝 Teacher selected topics: ${selectedTopicsList.length} topics`);
//       }

//       // If no topics selected, use all topics
//       if (selectedTopicsList.length === 0) {
//         selectedTopicsList = chapterTopics;
//       }

//       if (selectedTopicsList.length === 0) {
//         return NextResponse.json({ 
//           success: false, 
//           syllabusExists: true,
//           message: `No topics found for Chapter ${selectedChapterData.chapterNumber}. Please check syllabus.`,
//           data: []
//         });
//       }

//       const groq = new Groq({ apiKey: apiKey.trim() });

//       // 👇 PROMPT WITH SELECTED TOPICS ONLY
//       const prompt = `You are a strict syllabus-based assignment generator.

// Generate exactly 3 UNIQUE assignments for:
// - Class: ${targetClass}
// - Subject: ${subjectNameForDisplay}
// - Chapter: ${selectedChapterData?.chapterName}

// SELECTED TOPICS (USE ONLY THESE): ${selectedTopicsList.join(", ")}

// STRICT RULES:
// 1. ONLY use topics from the selected topics list above
// 2. Each assignment MUST cover DIFFERENT topics
// 3. Assignment titles MUST mention the topics they cover
// 4. DO NOT repeat any topic across assignments
// 5. DO NOT add any topic not in the selected list

// Return ONLY valid JSON:
// {
//   "assignments": [
//     {"title": "Title with Topic1", "description": "Description", "topicsUsed": ["Topic1"]},
//     {"title": "Title with Topic2", "description": "Description", "topicsUsed": ["Topic2"]},
//     {"title": "Title with Topic3", "description": "Description", "topicsUsed": ["Topic3"]}
//   ]
// }`;

//       const chatCompletion = await groq.chat.completions.create({
//         model: "llama-3.1-8b-instant",
//         messages: [
//           {
//             role: "system",
//             content: "You are a strict syllabus-based assignment generator. ONLY use topics provided. Output must be valid JSON."
//           },
//           {
//             role: "user",
//             content: prompt
//           }
//         ],
//         temperature: 0.5,
//         max_tokens: 2000,
//       });

//       const rawText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
      
//       try {
//         let cleanJson = extractJSONFromResponse(rawText);
//         const parsedData = JSON.parse(cleanJson);
        
//         let aiRecommendations = [];
//         if (parsedData && Array.isArray(parsedData.assignments)) {
//           aiRecommendations = parsedData.assignments;
//         } else if (parsedData && Array.isArray(parsedData)) {
//           aiRecommendations = parsedData;
//         }
        
//         return NextResponse.json({ 
//           success: true, 
//           syllabusExists: true,
//           data: aiRecommendations,
//           syllabusInfo: {
//             subject: lockedSyllabus?.subjectName,
//             class: lockedSyllabus?.targetClass,
//             selectedChapter: {
//               number: selectedChapterData.chapterNumber,
//               name: selectedChapterData.chapterName,
//               topics: chapterTopics
//             }
//           }
//         });
//       } catch (jsonErr) {
//         return NextResponse.json({ 
//           success: false, 
//           syllabusExists: true,
//           error: "AI response processing error",
//           message: "Failed to generate assignments. Please try again."
//         }, { status: 500 });
//       }
//     }

//     // --- Regular Assignment Fetching ---
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;
//     const now = new Date();

//     if (!userId || userId === "undefined" || userId === "null") {
//       return NextResponse.json({ 
//         success: true, 
//         data: [], 
//         assignedSubjects: [],
//         pagination: { total: 0, page: 1, totalPages: 0 }
//       });
//     }

//     try {
//       await Assignment.updateMany(
//         { dueDate: { $lt: now }, status: 'active' },
//         { $set: { status: 'expired' } }
//       );
//     } catch (e) {}

//     let query = {};
//     let assignedSubjects = [];

//     let teacher = null;
//     try {
//       teacher = await Teacher.findById(userId).populate("subjects");
//     } catch (err) {}
    
//     if (teacher) {
//       query.teacherId = userId;
//       let rawSubjects = teacher.subjects || [];
//       assignedSubjects = rawSubjects.map(sub => {
//         if (typeof sub === 'object' && sub !== null) {
//           return { id: sub._id, name: sub.name };
//         }
//         return { id: sub, name: sub };
//       });
//     } else {
//       const student = await User.findById(userId);
//       if (student) {
//         const studentClass = cleanClassName(student.className);
//         query.targetClass = studentClass;
//       } else {
//         return NextResponse.json({ 
//           success: true, 
//           data: [], 
//           assignedSubjects: [],
//           pagination: { total: 0, page: 1, totalPages: 0 }
//         });
//       }
//     }

//     const totalAssignments = await Assignment.countDocuments(query);
//     const assignments = await Assignment.find(query)
//       .populate('subject', 'name')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean();
    
//     const assignmentsWithSubjects = assignments.map(assignment => ({
//       ...assignment,
//       subjectName: assignment.subject?.name || assignment.subjectName,
//       subject: assignment.subject?._id || assignment.subject
//     }));
    
//     return NextResponse.json({ 
//       success: true, 
//       data: assignmentsWithSubjects, 
//       assignedSubjects: assignedSubjects,
//       pagination: {
//         total: totalAssignments,
//         page: page,
//         totalPages: Math.ceil(totalAssignments / limit),
//         hasMore: skip + assignments.length < totalAssignments
//       }
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: "Error fetching assignments.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // PUT: Update assignment
// export async function PUT(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params;
//     const body = await req.json();
    
//     const updatedAssignment = await Assignment.findByIdAndUpdate(
//       id,
//       { ...body },
//       { new: true }
//     ).populate('subject', 'name');
    
//     if (!updatedAssignment) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment not found" 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       data: updatedAssignment 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }

// // DELETE: Delete assignment
// export async function DELETE(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params;
//     const deletedAssignment = await Assignment.findByIdAndDelete(id);
    
//     if (!deletedAssignment) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Assignment not found" 
//       }, { status: 404 });
//     }
    
//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment deleted successfully" 
//     });
//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       message: error.message 
//     }, { status: 500 });
//   }
// }







































import dbConnect from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import Teacher from "@/models/Teacher"; 
import User from "@/models/User"; 
import Notification from "@/models/Notification"; 
import Syllabus from "@/models/Syllabus"; 
import Subject from "@/models/Subject"; 
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// ✅ FIX: Only initialize Pusher if environment variables exist
let pusher = null;
try {
  if (process.env.NEXT_PUBLIC_PUSHER_app_id && 
      process.env.NEXT_PUBLIC_PUSHER_KEY && 
      process.env.NEXT_PUBLIC_PUSHER_secret) {
    const Pusher = (await import("pusher")).default;
    pusher = new Pusher({
      appId: process.env.NEXT_PUBLIC_PUSHER_app_id, 
      key: process.env.NEXT_PUBLIC_PUSHER_KEY, 
      secret: process.env.NEXT_PUBLIC_PUSHER_secret, 
      cluster: process.env.NEXT_PUBLIC_PUSHER_cluster || "ap2",
      useTLS: true,
    });
    console.log("✅ Pusher initialized successfully");
  } else {
    console.warn("⚠️ Pusher credentials missing, notifications disabled");
  }
} catch (error) {
  console.warn("⚠️ Failed to initialize Pusher:", error.message);
}

function cleanClassName(className) {
  return className?.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
}

function extractJSONFromResponse(text) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}') + 1;
  
  if (firstBrace !== -1 && lastBrace !== 0) {
    return text.substring(firstBrace, lastBrace);
  }
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  return '{"assignments":[]}';
}

// // POST: Create new assignment
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
//     let cleanClass = cleanClassName(body.targetClass);

//     if (!body.title || !body.subject || !cleanClass) {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Missing required fields: title, subject, targetClass" 
//       }, { status: 400 });
//     }

//     let subjectName = body.subject;
//     let subjectDoc = null;
    
//     if (body.subject.match(/^[0-9a-fA-F]{24}$/)) {
//       subjectDoc = await Subject.findById(body.subject);
//       subjectName = subjectDoc?.name || body.subject;
//     } else {
//       subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${body.subject}$`, 'i') } });
//       if (subjectDoc) subjectName = subjectDoc.name;
//     }

//     const newAssignment = await Assignment.create({
//       title: body.title,
//       description: body.description || "",
//       subject: subjectDoc?._id || body.subject,
//       subjectName: subjectName,
//       teacherId: body.teacherId,
//       teacherName: body.teacherName,
//       targetClass: cleanClass,
//       dueDate: body.dueDate,
//       maxMarks: body.maxMarks || 100,
//       chapterReference: body.chapterReference || null,
//       chapterName: body.chapterName || null,
//       status: 'active'
//     });

//     const notificationMsg = `📚 New Assignment: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;
    
//     // Save notification to database
//     await Notification.create({
//       recipientClass: cleanClass,
//       message: notificationMsg,
//       type: 'assignment',
//       assignmentId: newAssignment._id
//     });
    
//     // ✅ FIX: Only trigger Pusher if initialized
//     if (pusher) {
//       try {
//         await pusher.trigger("sms-portal", "new-update", {
//           message: notificationMsg,
//           assignmentId: newAssignment._id,
//           targetClass: cleanClass
//         });
//       } catch (pusherError) {
//         console.error("Pusher trigger failed:", pusherError);
//         // Don't fail the request if Pusher fails
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       message: "Assignment published successfully.",
//       data: newAssignment 
//     });
//   } catch (error) {
//     console.error("POST error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to publish assignment.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }



// POST: Create new assignment
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    let cleanClass = cleanClassName(body.targetClass);

    console.log("📥 Received assignment data:", {
      title: body.title,
      subject: body.subject,
      targetClass: cleanClass,
      teacherId: body.teacherId,
      teacherName: body.teacherName
    });

    // Validation
    if (!body.title || !body.subject || !cleanClass) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields: title, subject, targetClass" 
      }, { status: 400 });
    }

    if (!body.teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID is required" 
      }, { status: 400 });
    }

    // Get subject name
    let subjectName = body.subject;
    let subjectDoc = null;
    
    if (body.subject.match(/^[0-9a-fA-F]{24}$/)) {
      subjectDoc = await Subject.findById(body.subject);
      subjectName = subjectDoc?.name || body.subject;
    } else {
      subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${body.subject}$`, 'i') } });
      if (subjectDoc) subjectName = subjectDoc.name;
    }

    // ✅ Create assignment with correct fields (NO assignedBy/assignedTo)
    const newAssignment = await Assignment.create({
      title: body.title,
      description: body.description || "",
      subject: subjectDoc?._id || body.subject,
      subjectName: subjectName,
      teacherId: body.teacherId,
      teacherName: body.teacherName || "Teacher",
      targetClass: cleanClass,
      dueDate: body.dueDate,
      maxMarks: body.maxMarks || 100,
      chapterReference: body.chapterReference || null,
      chapterName: body.chapterName || null,
      // status will use default 'active'
    });

    console.log("✅ Assignment created:", newAssignment._id);

    // Send notification
    const notificationMsg = `📚 New Assignment: "${newAssignment.title}" has been posted for Class ${cleanClass}.`;
    
    await Notification.create({
      recipientClass: cleanClass,
      message: notificationMsg,
      type: 'assignment',
      assignmentId: newAssignment._id
    });
    
    if (pusher) {
      try {
        await pusher.trigger("sms-portal", "new-update", {
          message: notificationMsg,
          assignmentId: newAssignment._id,
          targetClass: cleanClass
        });
      } catch (pusherError) {
        console.error("Pusher trigger failed:", pusherError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Assignment published successfully.",
      data: newAssignment 
    });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to publish assignment.", 
      error: error.message 
    }, { status: 500 });
  }
}

// GET: Fetch assignments + AI recommendations with topic selection
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const recommend = searchParams.get("recommend");
    const subject = searchParams.get("subject");
    const targetClass = searchParams.get("targetClass");
    const board = searchParams.get("board") || "sindh";
    const chapterNumber = searchParams.get("chapter");
    const selectedTopicsParam = searchParams.get("topics");

    // --- AI Recommendation Engine ---
    if (recommend === "true") {
      if (!subject || !targetClass) {
        return NextResponse.json({ 
          success: false, 
          error: "Subject and Target Class parameters required" 
        }, { status: 400 });
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ 
          success: false, 
          error: "AI Engine Configuration Key missing." 
        }, { status: 500 });
      }

      const cleanClassQuery = cleanClassName(targetClass);
      
      let subjectDoc = null;
      let subjectIdForQuery = subject;
      let subjectNameForDisplay = subject;
      
      if (subject.match(/^[0-9a-fA-F]{24}$/)) {
        subjectDoc = await Subject.findById(subject);
        subjectIdForQuery = subjectDoc?._id || subject;
        subjectNameForDisplay = subjectDoc?.name || subject;
      } else {
        subjectDoc = await Subject.findOne({ name: { $regex: new RegExp(`^${subject}$`, 'i') } });
        subjectIdForQuery = subjectDoc?._id || subject;
        subjectNameForDisplay = subjectDoc?.name || subject;
      }
      
      let lockedSyllabus = await Syllabus.findOne({ 
        subjectId: subjectIdForQuery,
        targetClass: cleanClassQuery,
        board: board.toLowerCase()
      }).lean();

      let syllabusExists = false;
      let selectedChapterData = null;
      let chapterTopics = [];
      
      if (lockedSyllabus && lockedSyllabus.chapters && lockedSyllabus.chapters.length > 0) {
        syllabusExists = true;
        
        if (chapterNumber) {
          selectedChapterData = lockedSyllabus.chapters.find(
            ch => ch.chapterNumber === parseInt(chapterNumber)
          );
          if (selectedChapterData) {
            chapterTopics = selectedChapterData.topics || [];
          }
        }
      }

      if (!syllabusExists) {
        return NextResponse.json({ 
          success: false, 
          syllabusExists: false,
          message: `No syllabus found for Class ${targetClass} - ${subjectNameForDisplay}. Please upload syllabus first.`,
          data: []
        });
      }

      if (!selectedChapterData) {
        return NextResponse.json({ 
          success: false, 
          syllabusExists: true,
          message: "Please select a chapter first",
          data: []
        });
      }

      let selectedTopicsList = [];
      if (selectedTopicsParam) {
        selectedTopicsList = decodeURIComponent(selectedTopicsParam).split(',');
      }

      if (selectedTopicsList.length === 0) {
        selectedTopicsList = chapterTopics;
      }

      if (selectedTopicsList.length === 0) {
        return NextResponse.json({ 
          success: false, 
          syllabusExists: true,
          message: `No topics found for Chapter ${selectedChapterData.chapterNumber}. Please check syllabus.`,
          data: []
        });
      }

      const groq = new Groq({ apiKey: apiKey.trim() });

      const prompt = `You are a strict syllabus-based assignment generator.

Generate exactly 3 UNIQUE assignments for:
- Class: ${targetClass}
- Subject: ${subjectNameForDisplay}
- Chapter: ${selectedChapterData?.chapterName}

SELECTED TOPICS (USE ONLY THESE): ${selectedTopicsList.join(", ")}

STRICT RULES:
1. ONLY use topics from the selected topics list above
2. Each assignment MUST cover DIFFERENT topics
3. Assignment titles MUST mention the topics they cover
4. DO NOT repeat any topic across assignments
5. DO NOT add any topic not in the selected list

Return ONLY valid JSON:
{
  "assignments": [
    {"title": "Title with Topic1", "description": "Description", "topicsUsed": ["Topic1"]},
    {"title": "Title with Topic2", "description": "Description", "topicsUsed": ["Topic2"]},
    {"title": "Title with Topic3", "description": "Description", "topicsUsed": ["Topic3"]}
  ]
}`;

      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a strict syllabus-based assignment generator. ONLY use topics provided. Output must be valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      });

      const rawText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
      
      try {
        let cleanJson = extractJSONFromResponse(rawText);
        const parsedData = JSON.parse(cleanJson);
        
        let aiRecommendations = [];
        if (parsedData && Array.isArray(parsedData.assignments)) {
          aiRecommendations = parsedData.assignments;
        } else if (parsedData && Array.isArray(parsedData)) {
          aiRecommendations = parsedData;
        }
        
        return NextResponse.json({ 
          success: true, 
          syllabusExists: true,
          data: aiRecommendations,
          syllabusInfo: {
            subject: lockedSyllabus?.subjectName,
            class: lockedSyllabus?.targetClass,
            selectedChapter: {
              number: selectedChapterData.chapterNumber,
              name: selectedChapterData.chapterName,
              topics: chapterTopics
            }
          }
        });
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        return NextResponse.json({ 
          success: false, 
          syllabusExists: true,
          error: "AI response processing error",
          message: "Failed to generate assignments. Please try again."
        }, { status: 500 });
      }
    }

    // --- Regular Assignment Fetching ---
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const now = new Date();

    if (!userId || userId === "undefined" || userId === "null") {
      return NextResponse.json({ 
        success: true, 
        data: [], 
        assignedSubjects: [],
        pagination: { total: 0, page: 1, totalPages: 0 }
      });
    }

    try {
      await Assignment.updateMany(
        { dueDate: { $lt: now }, status: 'active' },
        { $set: { status: 'expired' } }
      );
    } catch (e) {
      console.warn("Status update warning:", e.message);
    }

    let query = {};
    let assignedSubjects = [];

    let teacher = null;
    try {
      teacher = await Teacher.findById(userId).populate("subjects");
    } catch (err) {
      console.warn("Teacher not found:", err.message);
    }
    
    if (teacher) {
      query.teacherId = userId;
      let rawSubjects = teacher.subjects || [];
      assignedSubjects = rawSubjects.map(sub => {
        if (typeof sub === 'object' && sub !== null) {
          return { id: sub._id, name: sub.name };
        }
        return { id: sub, name: sub };
      });
    } else {
      const student = await User.findById(userId);
      if (student && student.role === "student") {
        const studentClass = cleanClassName(student.className);
        query.targetClass = studentClass;
      } else {
        return NextResponse.json({ 
          success: true, 
          data: [], 
          assignedSubjects: [],
          pagination: { total: 0, page: 1, totalPages: 0 }
        });
      }
    }

    const totalAssignments = await Assignment.countDocuments(query);
    const assignments = await Assignment.find(query)
      .populate('subject', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const assignmentsWithSubjects = assignments.map(assignment => ({
      ...assignment,
      subjectName: assignment.subject?.name || assignment.subjectName,
      subject: assignment.subject?._id || assignment.subject
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: assignmentsWithSubjects, 
      assignedSubjects: assignedSubjects,
      pagination: {
        total: totalAssignments,
        page: page,
        totalPages: Math.ceil(totalAssignments / limit),
        hasMore: skip + assignments.length < totalAssignments
      }
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Error fetching assignments.", 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT: Update assignment
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();
    
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    ).populate('subject', 'name');
    
    if (!updatedAssignment) {
      return NextResponse.json({ 
        success: false, 
        message: "Assignment not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedAssignment 
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// DELETE: Delete assignment
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    
    if (!deletedAssignment) {
      return NextResponse.json({ 
        success: false, 
        message: "Assignment not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Assignment deleted successfully" 
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}