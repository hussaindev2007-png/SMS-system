// import { Worker } from "bullmq";
// import { Redis } from "ioredis";
// import { sendAttendanceEmail } from "./email";

// const redisConnection = new Redis({
//   host: "0.0.0.0",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

// // Worker for fee notifications
// const feeWorker = new Worker("feeQueue", async (job) => {
//   const { email, studentName, amount, month, status, dueDate } = job.data;
  
//   console.log(`📧 Processing fee notification for ${studentName}...`);
  
//   let subject = "";
//   let message = "";
  
//   if (job.name === "fee_overdue_alert") {
//     subject = `⚠️ Fee Overdue Alert - ${studentName}`;
//     message = `
//       Dear Parent,
      
//       This is a reminder that the fee for ${month} of PKR ${amount} is now OVERDUE.
//       Due date was ${new Date(dueDate).toLocaleDateString()}.
      
//       Please clear the pending amount at your earliest convenience.
      
//       Regards,
//       School Management System
//     `;
//   } else if (job.name === "fee_reminder") {
//     subject = `📌 Fee Reminder - ${studentName}`;
//     message = `
//       Dear Parent,
      
//       This is a reminder that the fee for ${month} of PKR ${amount} is due soon.
//       Please ensure timely payment.
      
//       Regards,
//       School Management System
//     `;
//   } else if (job.name === "fee_payment_confirmation") {
//     subject = `✅ Fee Payment Confirmation - ${studentName}`;
//     message = `
//       Dear Parent,
      
//       We have received your payment of PKR ${amount} for ${month}.
//       Thank you for your timely payment.
      
//       Regards,
//       School Management System
//     `;
//   }
  
//   // Send email
//   await sendAttendanceEmail(email, studentName, "fee", null, new Date().toLocaleDateString());
  
//   console.log(`✅ Fee notification sent for ${studentName}`);
  
//   return { success: true };
// }, { connection: redisConnection });

// feeWorker.on('completed', (job) => {
//   console.log(`✅ Fee job ${job.id} completed for ${job.data.studentName}`);
// });

// feeWorker.on('failed', (job, err) => {
//   console.error(`❌ Fee job ${job?.id} failed:`, err.message);
// });

// console.log('🚀 Fee Worker started - listening for feeQueue...');

// export { feeWorker };


















import { Worker } from "bullmq";
import { Redis } from "ioredis";
import nodemailer from 'nodemailer';

// Fix Redis connection - localhost use karo
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "localhost",  // 0.0.0.0 se change kiya
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    console.log(`🔄 Redis reconnecting... attempt ${times}`);
    return Math.min(times * 50, 2000);
  }
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// Worker for fee notifications
const feeWorker = new Worker("feeQueue", async (job) => {
  const { email, studentName, amount, month, status, dueDate, rollNo, className } = job.data;
  
  console.log(`📧 Processing fee notification for ${studentName} (${email})...`);
  console.log(`Job: ${job.name}`);
  
  let subject = "";
  let emoji = "";
  let htmlContent = "";
  
  if (job.name === "fee_overdue_alert") {
    subject = `⚠️ URGENT: Fee Overdue Alert - ${studentName}`;
    emoji = "⚠️";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background-color: #dc3545; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">${emoji} Fee Overdue Alert</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear Parent,</p>
          <p>This is a <strong>URGENT</strong> reminder that the fee for <strong>${month}</strong> is now <strong style="color: #dc3545;">OVERDUE</strong>.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${rollNo || 'N/A'}</p>
            <p><strong>Class:</strong> ${className || 'N/A'}</p>
            <p><strong>Amount:</strong> PKR ${amount?.toLocaleString() || 0}</p>
            <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <p>Please clear the pending amount at your earliest convenience.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">School Management System</p>
        </div>
      </div>
    `;
  } 
  else if (job.name === "fee_reminder") {
    subject = `📌 Fee Reminder - ${studentName}`;
    emoji = "📌";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background-color: #ffc107; color: #333; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">${emoji} Fee Reminder</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear Parent,</p>
          <p>This is a reminder that the fee for <strong>${month}</strong> of <strong>PKR ${amount?.toLocaleString() || 0}</strong> is due soon.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${rollNo || 'N/A'}</p>
            <p><strong>Class:</strong> ${className || 'N/A'}</p>
            <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <p>Please ensure timely payment.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">School Management System</p>
        </div>
      </div>
    `;
  } 
  else if (job.name === "fee_payment_confirmation") {
    subject = `✅ Fee Payment Confirmation - ${studentName}`;
    emoji = "✅";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background-color: #28a745; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">${emoji} Payment Confirmed</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear Parent,</p>
          <p>We have received your payment of <strong>PKR ${amount?.toLocaleString() || 0}</strong> for <strong>${month}</strong>.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${rollNo || 'N/A'}</p>
            <p><strong>Class:</strong> ${className || 'N/A'}</p>
            <p><strong>Amount Paid:</strong> PKR ${amount?.toLocaleString() || 0}</p>
            <p><strong>Status:</strong> <span style="color: #28a745;">PAID</span></p>
          </div>
          <p>Thank you for your timely payment.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">School Management System</p>
        </div>
      </div>
    `;
  }
  
  // Send email using nodemailer directly
  try {
    await transporter.sendMail({
      from: `"School Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent
    });
    
    console.log(`✅ Fee notification sent to ${email} for ${studentName}`);
    return { success: true, emailSent: true };
    
  } catch (emailError) {
    console.error(`❌ Email sending failed for ${studentName}:`, emailError.message);
    throw emailError; // Retry the job
  }
  
}, { 
  connection: redisConnection,
  concurrency: 5 // Process 5 jobs at once
});

feeWorker.on('completed', (job, result) => {
  console.log(`✅ Fee job ${job.id} completed for ${job.data.studentName}`);
});

feeWorker.on('failed', (job, err) => {
  console.error(`❌ Fee job ${job?.id} failed:`, err.message);
});

feeWorker.on('error', (err) => {
  console.error('❌ Worker error:', err);
});

console.log('🚀 Fee Worker started - listening for feeQueue...');
console.log('📡 Redis host:', redisConnection.options.host);
console.log('📡 Redis port:', redisConnection.options.port);

export { feeWorker, redisConnection };