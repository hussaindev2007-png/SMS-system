// import { Queue } from "bullmq";
// import { Redis } from "ioredis";
// import dbConnect from "./mongodb";
// import User from "@/models/User";
// import Attendance from "@/models/Attendance";
// import { addAttendanceNotificationToQueue } from "./queue";

// const redisConnection = new Redis({
//   host: "localhost",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// const attendanceCheckQueue = new Queue("attendanceCheckQueue", {
//   connection: redisConnection,
// });

// // Schedule daily check at 9:00 AM
// export const scheduleDailyAttendanceCheck = async () => {
//   const now = new Date();
//   const scheduledTime = new Date();
//   scheduledTime.setHours(9, 0, 0, 0); // 9:00 AM
  
//   if (now > scheduledTime) {
//     scheduledTime.setDate(scheduledTime.getDate() + 1);
//   }
  
//   const delay = scheduledTime - now;
//   console.log(`⏰ Next attendance check at ${scheduledTime.toLocaleString()} (in ${Math.round(delay / 60000)} minutes)`);
  
//   setTimeout(async () => {
//     await checkAbsentStudents();
//     scheduleDailyAttendanceCheck(); // Reschedule
//   }, delay);
// };

// // Check for absent students
// export const checkAbsentStudents = async () => {
//   console.log("🔍 Running attendance check for absent students...");
//   await dbConnect();
  
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);
  
//   // Get all active students
//   const students = await User.find({ role: 'student', status: 'active' });
  
//   // Get today's attendance records
//   const attendanceRecords = await Attendance.find({
//     date: { $gte: today, $lt: tomorrow }
//   });
  
//   const presentStudentIds = new Set(attendanceRecords.map(r => r.studentId.toString()));
//   const lateStudents = attendanceRecords.filter(r => r.status === 'late');
  
//   // Process absent students
//   for (const student of students) {
//     const studentIdStr = student._id.toString();
    
//     if (!presentStudentIds.has(studentIdStr)) {
//       // Student is absent
//       console.log(`❌ Absent: ${student.name} (${student.phone})`);
      
//       // Add to queue for WhatsApp notification
//       await addAttendanceNotificationToQueue(
//         student.phone,
//         student.name,
//         'absent',
//         null
//       );
//     }
//   }
  
//   // Process late students (already notified at scan time, but can resend)
//   for (const late of lateStudents) {
//     console.log(`⚠️ Late: ${late.studentName} at ${late.checkInTime}`);
//   }
  
//   console.log(`📊 Summary: Present: ${presentStudentIds.size}, Late: ${lateStudents.length}, Absent: ${students.length - presentStudentIds.size}`);
// };

// // Start scheduler
// if (typeof window === 'undefined') {
//   scheduleDailyAttendanceCheck();
// }










































// import { Queue } from "bullmq";
// import { Redis } from "ioredis";
// import dbConnect from "./mongodb";
// import User from "@/models/User";
// import Teacher from "@/models/Teacher";
// import Attendance from "@/models/Attendance";
// import TeacherAttendance from "@/models/TeacherAttendance";
// import { addAttendanceNotificationToQueue, addTeacherAbsentNotificationToQueue } from "./queue";

// const redisConnection = new Redis({
//   host: "0.0.0.0",  // Changed from localhost to 0.0.0.0
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// const attendanceCheckQueue = new Queue("attendanceCheckQueue", {
//   connection: redisConnection,
// });

// // Schedule daily check at 8:00 AM (for both students and teachers)
// export const scheduleDailyAttendanceCheck = async () => {
//   const now = new Date();
//   const scheduledTime = new Date();
//   scheduledTime.setHours(8, 0, 0, 0); // 8:00 AM
  
//   if (now > scheduledTime) {
//     scheduledTime.setDate(scheduledTime.getDate() + 1);
//   }
  
//   const delay = scheduledTime - now;
//   console.log(`⏰ Next attendance check at ${scheduledTime.toLocaleString()} (in ${Math.round(delay / 60000)} minutes)`);
  
//   setTimeout(async () => {
//     await checkAbsentStudents();
//     await checkAbsentTeachers();  // ✅ Added teacher check
//     scheduleDailyAttendanceCheck();
//   }, delay);
// };

// // Check for absent students
// export const checkAbsentStudents = async () => {
//   console.log("🔍 Running attendance check for absent students...");
//   await dbConnect();
  
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);
  
//   // Get all active students
//   const students = await User.find({ role: 'student', status: 'active' });
  
//   // Get today's attendance records
//   const attendanceRecords = await Attendance.find({
//     date: { $gte: today, $lt: tomorrow }
//   });
  
//   const presentStudentIds = new Set(attendanceRecords.map(r => r.studentId.toString()));
//   const lateStudents = attendanceRecords.filter(r => r.status === 'late');
  
//   // Process absent students
//   let absentCount = 0;
//   for (const student of students) {
//     const studentIdStr = student._id.toString();
    
//     if (!presentStudentIds.has(studentIdStr)) {
//       absentCount++;
//       console.log(`❌ Student Absent: ${student.name} (${student.email})`);
      
//       // Add to queue for email notification
//       await addAttendanceNotificationToQueue(
//         student.email,
//         student.name,
//         'absent',
//         null
//       );
//     }
//   }
  
//   console.log(`📊 Student Summary: Present: ${presentStudentIds.size}, Late: ${lateStudents.length}, Absent: ${absentCount}`);
// };

// // ✅ NEW: Check for absent teachers
// export const checkAbsentTeachers = async () => {
//   console.log("🔍 Running attendance check for absent teachers...");
//   await dbConnect();
  
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);
  
//   // Get all approved teachers
//   const teachers = await Teacher.find({ status: "approved" });
  
//   // Get today's attendance records
//   const attendanceRecords = await TeacherAttendance.find({
//     date: { $gte: today, $lt: tomorrow }
//   });
  
//   const presentTeacherIds = new Set(attendanceRecords.map(r => r.teacherId.toString()));
//   const lateTeachers = attendanceRecords.filter(r => r.status === 'late');
  
//   // Process absent teachers
//   let absentCount = 0;
//   for (const teacher of teachers) {
//     const teacherIdStr = teacher._id.toString();
    
//     if (!presentTeacherIds.has(teacherIdStr)) {
//       absentCount++;
//       console.log(`❌ Teacher Absent: ${teacher.name} (${teacher.email})`);
      
//       // Add to queue for admin notification
//       await addTeacherAbsentNotificationToQueue(teacher.email, teacher.name);
//     }
//   }
  
//   // Log late teachers (already notified at scan time)
//   for (const late of lateTeachers) {
//     console.log(`⚠️ Teacher Late: ${late.teacherName || 'Unknown'} at ${late.checkInTime}`);
//   }
  
//   console.log(`📊 Teacher Summary: Present: ${presentTeacherIds.size}, Late: ${lateTeachers.length}, Absent: ${absentCount}`);
// };

// // Start scheduler
// if (typeof window === 'undefined') {
//   scheduleDailyAttendanceCheck();
// }










import { Queue } from "bullmq";
import { Redis } from "ioredis";
import dbConnect from "./mongodb";
import User from "@/models/User";
import Teacher from "@/models/Teacher";
import Attendance from "@/models/Attendance";
import TeacherAttendance from "@/models/TeacherAttendance";
import { addAttendanceNotificationToQueue, addTeacherAbsentNotificationToQueue } from "./queue";

// ✅ Upstash Redis Connection with TLS
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "0.0.0.0",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_HOST ? {} : undefined,  // ✅ TLS for Upstash
  maxRetriesPerRequest: null,
});

const attendanceCheckQueue = new Queue("attendanceCheckQueue", {
  connection: redisConnection,
});

// Schedule daily check at 8:00 AM
export const scheduleDailyAttendanceCheck = async () => {
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(8, 0, 0, 0);
  
  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const delay = scheduledTime - now;
  console.log(`⏰ Next attendance check at ${scheduledTime.toLocaleString()} (in ${Math.round(delay / 60000)} minutes)`);
  
  setTimeout(async () => {
    await checkAbsentStudents();
    await checkAbsentTeachers();
    scheduleDailyAttendanceCheck();
  }, delay);
};

// Check for absent students
export const checkAbsentStudents = async () => {
  console.log("🔍 Running attendance check for absent students...");
  await dbConnect();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const students = await User.find({ role: 'student', status: 'active' });
  const attendanceRecords = await Attendance.find({
    date: { $gte: today, $lt: tomorrow }
  });
  
  const presentStudentIds = new Set(attendanceRecords.map(r => r.studentId.toString()));
  const lateStudents = attendanceRecords.filter(r => r.status === 'late');
  
  let absentCount = 0;
  for (const student of students) {
    const studentIdStr = student._id.toString();
    if (!presentStudentIds.has(studentIdStr)) {
      absentCount++;
      console.log(`❌ Student Absent: ${student.name} (${student.email})`);
      await addAttendanceNotificationToQueue(student.email, student.name, 'absent', null);
    }
  }
  
  console.log(`📊 Student Summary: Present: ${presentStudentIds.size}, Late: ${lateStudents.length}, Absent: ${absentCount}`);
};

// Check for absent teachers
export const checkAbsentTeachers = async () => {
  console.log("🔍 Running attendance check for absent teachers...");
  await dbConnect();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const teachers = await Teacher.find({ status: "approved" });
  const attendanceRecords = await TeacherAttendance.find({
    date: { $gte: today, $lt: tomorrow }
  });
  
  const presentTeacherIds = new Set(attendanceRecords.map(r => r.teacherId.toString()));
  const lateTeachers = attendanceRecords.filter(r => r.status === 'late');
  
  let absentCount = 0;
  for (const teacher of teachers) {
    const teacherIdStr = teacher._id.toString();
    if (!presentTeacherIds.has(teacherIdStr)) {
      absentCount++;
      console.log(`❌ Teacher Absent: ${teacher.name} (${teacher.email})`);
      await addTeacherAbsentNotificationToQueue(teacher.email, teacher.name);
    }
  }
  
  for (const late of lateTeachers) {
    console.log(`⚠️ Teacher Late: ${late.teacherName || 'Unknown'} at ${late.checkInTime}`);
  }
  
  console.log(`📊 Teacher Summary: Present: ${presentTeacherIds.size}, Late: ${lateTeachers.length}, Absent: ${absentCount}`);
};

// Start scheduler
if (typeof window === 'undefined') {
  scheduleDailyAttendanceCheck();
}