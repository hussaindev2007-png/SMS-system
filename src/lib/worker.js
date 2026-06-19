// import { Worker } from "bullmq";
// import { Redis } from "ioredis";
// import { sendAttendanceEmail } from "./email.js";  // 👈 ADD THIS

// const redisConnection = new Redis({
//   host: "0.0.0.0",  // 👈 Change to 0.0.0.0
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// // ❌ DELETE sendWhatsAppMessage function - No longer needed
// // ✅ Use email instead

// // Create worker for attendance queue
// const attendanceWorker = new Worker("attendanceQueue", async (job) => {
//   // 👈 CHANGE: phone → email
//   const { email, studentName, status, time, date } = job.data;
  
//   console.log(`📧 Processing attendance email for ${studentName}...`);
//   console.log(`   To: ${email}, Status: ${status}, Time: ${time || 'N/A'}`);
  
//   try {
//     // 👈 CHANGE: sendWhatsAppMessage → sendAttendanceEmail
//     const result = await sendAttendanceEmail(email, studentName, status, time, date);
//     console.log(`✅ Email notification sent for ${studentName}`);
//     return result;
//   } catch (error) {
//     console.error(`❌ Failed to send email for ${studentName}:`, error.message);
//     throw error;
//   }
// }, {
//   connection: redisConnection,
//   concurrency: 5,
// });

// attendanceWorker.on('completed', (job) => {
//   console.log(`✅ Job ${job.id} completed for ${job.data.studentName}`);
// });

// attendanceWorker.on('failed', (job, err) => {
//   console.error(`❌ Job ${job?.id} failed for ${job?.data?.studentName}:`, err.message);
// });

// console.log('🚀 Email Worker started - listening for attendance jobs...');

// export { attendanceWorker };



































// import { Worker } from "bullmq";
// import { Redis } from "ioredis";
// import { sendAttendanceEmail, sendTeacherLateEmail, sendTeacherAbsentEmail } from "./email.js";

// const redisConnection = new Redis({
//   host: "0.0.0.0",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// // ==================== STUDENT ATTENDANCE WORKER ====================
// const attendanceWorker = new Worker("attendanceQueue", async (job) => {
//   const { email, studentName, status, time, date } = job.data;
  
//   console.log(`📧 Processing student attendance email for ${studentName}...`);
//   console.log(`   To: ${email}, Status: ${status}, Time: ${time || 'N/A'}`);
  
//   try {
//     const result = await sendAttendanceEmail(email, studentName, status, time, date);
//     console.log(`✅ Student email sent for ${studentName}`);
//     return result;
//   } catch (error) {
//     console.error(`❌ Failed to send student email for ${studentName}:`, error.message);
//     throw error;
//   }
// }, {
//   connection: redisConnection,
//   concurrency: 5,
// });

// attendanceWorker.on('completed', (job) => {
//   console.log(`✅ Student job ${job.id} completed for ${job.data.studentName}`);
// });

// attendanceWorker.on('failed', (job, err) => {
//   console.error(`❌ Student job ${job?.id} failed:`, err.message);
// });

// // ==================== TEACHER ATTENDANCE WORKER ====================
// const teacherAttendanceWorker = new Worker("teacherAttendanceQueue", async (job) => {
//   const { email, teacherName, time, date } = job.data;
  
//   console.log(`📧 Processing teacher attendance notification for ${teacherName}...`);
//   console.log(`   To: ${email}, Job: ${job.name}, Time: ${time || 'N/A'}`);
  
//   try {
//     if (job.name === "sendTeacherLateEmail") {
//       await sendTeacherLateEmail(email, teacherName, time, date);
//       console.log(`✅ Teacher late email sent for ${teacherName}`);
//     } else if (job.name === "sendTeacherAbsentEmail") {
//       await sendTeacherAbsentEmail(email, teacherName, date);
//       console.log(`✅ Teacher absent email sent for ${teacherName}`);
//     }
//     return { success: true };
//   } catch (error) {
//     console.error(`❌ Failed to send teacher email for ${teacherName}:`, error.message);
//     throw error;
//   }
// }, {
//   connection: redisConnection,
//   concurrency: 5,
// });

// teacherAttendanceWorker.on('completed', (job) => {
//   console.log(`✅ Teacher job ${job.id} completed for ${job.data.teacherName}`);
// });

// teacherAttendanceWorker.on('failed', (job, err) => {
//   console.error(`❌ Teacher job ${job?.id} failed:`, err.message);
// });

// // ==================== STARTUP LOGS ====================
// console.log('🚀 Student Attendance Worker started - listening for attendanceQueue...');
// console.log('🚀 Teacher Attendance Worker started - listening for teacherAttendanceQueue...');

// export { attendanceWorker, teacherAttendanceWorker };



























import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { sendAttendanceEmail, sendTeacherLateEmail, sendTeacherAbsentEmail } from "./email.js";

// ✅ Upstash Redis Connection with TLS
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "0.0.0.0",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_HOST ? {} : undefined,  // ✅ TLS for Upstash
  maxRetriesPerRequest: null,
});

// ==================== STUDENT ATTENDANCE WORKER ====================
const attendanceWorker = new Worker("attendanceQueue", async (job) => {
  const { email, studentName, status, time, date } = job.data;
  console.log(`📧 Processing student attendance email for ${studentName}...`);
  console.log(`   To: ${email}, Status: ${status}, Time: ${time || 'N/A'}`);
  
  try {
    const result = await sendAttendanceEmail(email, studentName, status, time, date);
    console.log(`✅ Student email sent for ${studentName}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send student email for ${studentName}:`, error.message);
    throw error;
  }
}, {
  connection: redisConnection,
  concurrency: 5,
});

attendanceWorker.on('completed', (job) => {
  console.log(`✅ Student job ${job.id} completed for ${job.data.studentName}`);
});

attendanceWorker.on('failed', (job, err) => {
  console.error(`❌ Student job ${job?.id} failed:`, err.message);
});

// ==================== TEACHER ATTENDANCE WORKER ====================
const teacherAttendanceWorker = new Worker("teacherAttendanceQueue", async (job) => {
  const { email, teacherName, time, date } = job.data;
  console.log(`📧 Processing teacher attendance notification for ${teacherName}...`);
  console.log(`   To: ${email}, Job: ${job.name}, Time: ${time || 'N/A'}`);
  
  try {
    if (job.name === "sendTeacherLateEmail") {
      await sendTeacherLateEmail(email, teacherName, time, date);
      console.log(`✅ Teacher late email sent for ${teacherName}`);
    } else if (job.name === "sendTeacherAbsentEmail") {
      await sendTeacherAbsentEmail(email, teacherName, date);
      console.log(`✅ Teacher absent email sent for ${teacherName}`);
    }
    return { success: true };
  } catch (error) {
    console.error(`❌ Failed to send teacher email for ${teacherName}:`, error.message);
    throw error;
  }
}, {
  connection: redisConnection,
  concurrency: 5,
});

teacherAttendanceWorker.on('completed', (job) => {
  console.log(`✅ Teacher job ${job.id} completed for ${job.data.teacherName}`);
});

teacherAttendanceWorker.on('failed', (job, err) => {
  console.error(`❌ Teacher job ${job?.id} failed:`, err.message);
});

// ==================== STARTUP LOGS ====================
console.log('🚀 Student Attendance Worker started - listening for attendanceQueue...');
console.log('🚀 Teacher Attendance Worker started - listening for teacherAttendanceQueue...');

export { attendanceWorker, teacherAttendanceWorker };