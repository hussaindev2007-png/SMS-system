// import { Worker } from "bullmq";
// import { Redis } from "ioredis";
// import { sendTeacherLateEmail, sendTeacherAbsentEmail } from "@/lib/email";

// const redisConnection = new Redis({
//   host: "0.0.0.0",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// let teacherWorker = null;

// function startTeacherWorker() {
//   if (teacherWorker) {
//     console.log("⚠️ Teacher worker already running");
//     return;
//   }

//   teacherWorker = new Worker("teacherAttendanceQueue", async (job) => {
//     const { email, teacherName, time, date } = job.data;
    
//     console.log(`📧 Processing teacher notification for ${teacherName}...`);
//     console.log(`   Job: ${job.name}, Email: ${email}, Time: ${time || 'N/A'}`);
    
//     if (job.name === "sendTeacherLateEmail") {
//       await sendTeacherLateEmail(email, teacherName, time, date);
//       console.log(`✅ Teacher late email sent for ${teacherName}`);
//     } else if (job.name === "sendTeacherAbsentEmail") {
//       await sendTeacherAbsentEmail(email, teacherName, date);
//       console.log(`✅ Teacher absent email sent for ${teacherName}`);
//     }
    
//     return { success: true };
//   }, { 
//     connection: redisConnection,
//     concurrency: 5 
//   });

//   teacherWorker.on('completed', (job) => {
//     console.log(`✅ Teacher job ${job.id} completed for ${job.data.teacherName}`);
//   });

//   teacherWorker.on('failed', (job, err) => {
//     console.error(`❌ Teacher job ${job?.id} failed:`, err.message);
//   });

//   console.log('🚀 Teacher Attendance Worker started - listening for teacherAttendanceQueue...');
// }

// export async function GET() {
//   startTeacherWorker();
//   return new Response("Teacher worker running", { status: 200 });
// }

// export async function POST() {
//   startTeacherWorker();
//   return new Response("Teacher worker started", { status: 200 });
// }
















import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { sendTeacherLateEmail, sendTeacherAbsentEmail } from "@/lib/email";

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

let teacherWorker = null;

function startTeacherWorker() {
  if (teacherWorker) {
    console.log("⚠️ Teacher worker already running");
    return;
  }

  teacherWorker = new Worker("teacherAttendanceQueue", async (job) => {
    const { email, teacherName, time, date } = job.data;
    
    console.log(`📧 Processing teacher notification for ${teacherName}...`);
    console.log(`   Job: ${job.name}, Email: ${email}, Time: ${time || 'N/A'}`);
    
    try {
      if (job.name === "sendTeacherLateEmail") {
        await sendTeacherLateEmail(email, teacherName, time, date);
        console.log(`✅ Teacher late email sent for ${teacherName}`);
      } else if (job.name === "sendTeacherAbsentEmail") {
        await sendTeacherAbsentEmail(email, teacherName, date);
        console.log(`✅ Teacher absent email sent for ${teacherName}`);
      } else {
        console.log(`⚠️ Unknown job name: ${job.name}`);
      }
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to send teacher email for ${teacherName}:`, error.message);
      throw error;
    }
  }, { 
    connection: redisConnection,
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 }
  });

  teacherWorker.on('completed', (job) => {
    console.log(`✅ Teacher job ${job.id} completed for ${job.data.teacherName}`);
  });

  teacherWorker.on('failed', (job, err) => {
    console.error(`❌ Teacher job ${job?.id} failed:`, err.message);
  });

  teacherWorker.on('error', (err) => {
    console.error('❌ Teacher worker error:', err.message);
  });

  console.log('🚀 Teacher Attendance Worker started - listening for teacherAttendanceQueue...');
}

// Start worker when module loads
if (typeof window === 'undefined') {
  startTeacherWorker();
}

export async function GET() {
  return new Response("Teacher worker is running", { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export async function POST() {
  startTeacherWorker();
  return new Response("Teacher worker started", { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}