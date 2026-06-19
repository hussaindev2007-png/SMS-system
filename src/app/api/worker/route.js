// import { Worker } from "bullmq";
// import { Redis } from "ioredis";
// import { sendAttendanceEmail } from "@/lib/email";  // 👈 ADD THIS

// const redisConnection = new Redis({
//   host: "0.0.0.0",  // 👈 Change localhost to 0.0.0.0
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// // ❌ DELETE sendWhatsAppMessage function

// // Start worker - NOW USING EMAIL
// const worker = new Worker("attendanceQueue", async (job) => {
//   const { email, studentName, status, time, date } = job.data;  // 👈 phone → email
//   console.log(`📧 Processing email: ${studentName} - ${status}`);
  
//   // 👈 Send email instead of WhatsApp
//   const result = await sendAttendanceEmail(email, studentName, status, time, date);
  
//   return result;
// }, { connection: redisConnection });

// worker.on('completed', (job) => {
//   console.log(`✅ Email sent for ${job.data.studentName}`);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Failed for ${job?.data?.studentName}:`, err.message);
// });

// console.log('🚀 Email Worker API started - listening for attendance jobs...');

// export async function GET() {
//   return new Response("Email Worker running", { status: 200 });
// }





















































// import { Worker } from "bullmq";
// import { Redis } from "ioredis";
// import { sendAttendanceEmail } from "@/lib/email";

// const redisConnection = new Redis({
//   host: "0.0.0.0",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// // Student attendance worker
// const worker = new Worker("attendanceQueue", async (job) => {
//   const { email, studentName, status, time, date } = job.data;
//   console.log(`📧 Processing student email: ${studentName} - ${status}`);
  
//   const result = await sendAttendanceEmail(email, studentName, status, time, date);
//   return result;
// }, { connection: redisConnection });

// worker.on('completed', (job) => {
//   console.log(`✅ Student email sent for ${job.data.studentName}`);
// });

// worker.on('failed', (job, err) => {
//   console.error(`❌ Student email failed for ${job?.data?.studentName}:`, err.message);
// });

// console.log('🚀 Student Email Worker started - listening for attendanceQueue...');

// export async function GET() {
//   return new Response("Student Email Worker running", { status: 200 });
// }










import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { sendAttendanceEmail } from "@/lib/email";

// ✅ Upstash Redis Connection with TLS
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "0.0.0.0",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_HOST ? {} : undefined,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisConnection.on('connect', () => {
  console.log('✅ Redis connection established');
});

redisConnection.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

// Student attendance worker
const worker = new Worker("attendanceQueue", async (job) => {
  const { email, studentName, status, time, date } = job.data;
  console.log(`📧 Processing student email: ${studentName} - ${status}`);
  
  try {
    const result = await sendAttendanceEmail(email, studentName, status, time, date);
    console.log(`✅ Student email processed for ${studentName}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send student email for ${studentName}:`, error.message);
    throw error;
  }
}, { 
  connection: redisConnection,
  concurrency: 5,
});

worker.on('completed', (job) => {
  console.log(`✅ Student email sent for ${job.data.studentName}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Student email failed for ${job?.data?.studentName}:`, err.message);
});

console.log('🚀 Student Email Worker started - listening for attendanceQueue...');

export async function GET() {
  return new Response("Student Email Worker running", { status: 200 });
}