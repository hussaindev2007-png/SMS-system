// import { Queue } from "bullmq";
// import { Redis } from "ioredis";

// // Docker Redis Connection
// const redisConnection = new Redis({
//   host: "0.0.0.0",
//   port: 6379,
//   maxRetriesPerRequest: null,
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 50, 2000);
//     return delay;
//   }
// });

// redisConnection.on('connect', () => {
//   console.log('✅ Redis connection established');
// });

// redisConnection.on('error', (err) => {
//   console.error('❌ Redis connection error:', err.message);
// });

// // Email Queue for Assignments
// export const mailQueue = new Queue("emailQueue", {
//   connection: redisConnection,
// });

// // ✅ Attendance Queue for Email Notifications (Changed from WhatsApp)
// export const attendanceQueue = new Queue("attendanceQueue", {
//   connection: redisConnection,
// });

// export const addEmailToQueue = async (email, title) => {
//   try {
//     await mailQueue.add("sendEmail", {
//       email,
//       subject: "Naya Assignment Alert!",
//       body: `Bahi, aapki class ke liye naya assignment aaya hai: ${title}`,
//     });
//     console.log("📧 Email task queued for:", email);
//   } catch (err) {
//     console.error("Queue Error:", err);
//   }
// };

// // ✅ CHANGED: Phone se email ho gaya
// export const addAttendanceNotificationToQueue = async (email, studentName, status, time = null) => {
//   try {
//     await attendanceQueue.add("sendAttendanceEmail", {  // 👈 Changed from sendWhatsApp
//       email,           // 👈 Changed from phone to email
//       studentName,
//       status,
//       time,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Email notification queued for ${studentName}: ${status}`);  // 👈 Changed log
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Attendance Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };































// import { Queue } from "bullmq";
// import { Redis } from "ioredis";

// // Docker Redis Connection
// const redisConnection = new Redis({
//   host: "0.0.0.0",
//   port: 6379,
//   maxRetriesPerRequest: null,
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 50, 2000);
//     return delay;
//   }
// });

// redisConnection.on('connect', () => {
//   console.log('✅ Redis connection established');
// });

// redisConnection.on('error', (err) => {
//   console.error('❌ Redis connection error:', err.message);
// });

// // ==================== EXISTING QUEUES ====================

// // Email Queue for Assignments
// export const mailQueue = new Queue("emailQueue", {
//   connection: redisConnection,
// });

// // Student Attendance Queue
// export const attendanceQueue = new Queue("attendanceQueue", {
//   connection: redisConnection,
// });

// // ==================== NEW TEACHER QUEUES ====================

// // Teacher Attendance Queue
// export const teacherAttendanceQueue = new Queue("teacherAttendanceQueue", {
//   connection: redisConnection,
// });

// // ==================== EXISTING FUNCTIONS ====================

// export const addEmailToQueue = async (email, title) => {
//   try {
//     await mailQueue.add("sendEmail", {
//       email,
//       subject: "Naya Assignment Alert!",
//       body: `Bahi, aapki class ke liye naya assignment aaya hai: ${title}`,
//     });
//     console.log("📧 Email task queued for:", email);
//   } catch (err) {
//     console.error("Queue Error:", err);
//   }
// };

// // Student attendance notification
// export const addAttendanceNotificationToQueue = async (email, studentName, status, time = null) => {
//   try {
//     await attendanceQueue.add("sendAttendanceEmail", {
//       email,
//       studentName,
//       status,
//       time,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Student attendance notification queued for ${studentName}: ${status}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Student Attendance Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // ==================== NEW TEACHER FUNCTIONS ====================

// // Teacher late notification
// export const addTeacherLateNotificationToQueue = async (email, teacherName, time) => {
//   try {
//     await teacherAttendanceQueue.add("sendTeacherLateEmail", {
//       email,
//       teacherName,
//       time,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Teacher late notification queued for ${teacherName} at ${time}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Teacher Late Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Teacher absent notification
// export const addTeacherAbsentNotificationToQueue = async (email, teacherName) => {
//   try {
//     await teacherAttendanceQueue.add("sendTeacherAbsentEmail", {
//       email,
//       teacherName,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Teacher absent notification queued for ${teacherName}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Teacher Absent Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };














// import { Queue } from "bullmq";
// import { Redis } from "ioredis";

// // Docker Redis Connection
// const redisConnection = new Redis({
//   host: process.env.REDIS_HOST || "0.0.0.0",
//   port: process.env.REDIS_PORT || 6379,
//   maxRetriesPerRequest: null,
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 50, 2000);
//     return delay;
//   }
// });

// redisConnection.on('connect', () => {
//   console.log('✅ Redis connection established');
// });

// redisConnection.on('error', (err) => {
//   console.error('❌ Redis connection error:', err.message);
// });

// // ==================== EXISTING QUEUES ====================

// // Email Queue for Assignments
// export const mailQueue = new Queue("emailQueue", {
//   connection: redisConnection,
// });

// // Student Attendance Queue
// export const attendanceQueue = new Queue("attendanceQueue", {
//   connection: redisConnection,
// });

// // Teacher Attendance Queue
// export const teacherAttendanceQueue = new Queue("teacherAttendanceQueue", {
//   connection: redisConnection,
// });

// // Fee Notification Queue
// export const feeQueue = new Queue("feeQueue", {
//   connection: redisConnection,
// });

// // ==================== EXISTING FUNCTIONS ====================

// export const addEmailToQueue = async (email, title) => {
//   try {
//     await mailQueue.add("sendEmail", {
//       email,
//       subject: "Naya Assignment Alert!",
//       body: `Bahi, aapki class ke liye naya assignment aaya hai: ${title}`,
//     });
//     console.log("📧 Email task queued for:", email);
//     return { success: true };
//   } catch (err) {
//     console.error("Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Student attendance notification
// export const addAttendanceNotificationToQueue = async (email, studentName, status, time = null) => {
//   try {
//     await attendanceQueue.add("sendAttendanceEmail", {
//       email,
//       studentName,
//       status,
//       time,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Student attendance notification queued for ${studentName}: ${status}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Student Attendance Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Teacher late notification
// export const addTeacherLateNotificationToQueue = async (email, teacherName, time) => {
//   try {
//     await teacherAttendanceQueue.add("sendTeacherLateEmail", {
//       email,
//       teacherName,
//       time,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Teacher late notification queued for ${teacherName} at ${time}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Teacher Late Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Teacher absent notification
// export const addTeacherAbsentNotificationToQueue = async (email, teacherName) => {
//   try {
//     await teacherAttendanceQueue.add("sendTeacherAbsentEmail", {
//       email,
//       teacherName,
//       date: new Date().toLocaleDateString()
//     });
//     console.log(`📧 Teacher absent notification queued for ${teacherName}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Teacher Absent Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // Fee notification (overdue/reminder/payment confirmation)
// export const addFeeNotificationToQueue = async (email, studentName, amount, month, type, dueDate = null) => {
//   try {
//     const jobData = {
//       email,
//       studentName,
//       amount,
//       month,
//       type, // 'overdue', 'reminder', 'payment_confirmation'
//       dueDate,
//       timestamp: new Date().toISOString()
//     };
    
//     await feeQueue.add(`fee_${type}`, jobData);
//     console.log(`💰 Fee notification queued for ${studentName}: ${type}`);
//     return { success: true };
//   } catch (err) {
//     console.error("❌ Fee Queue Error:", err);
//     return { success: false, error: err.message };
//   }
// };

// // ==================== GENERIC QUEUE FUNCTION (FOR SEND-ALERTS) ====================
// export const addToQueue = async (queueName, data) => {
//   try {
//     let queue;
//     switch(queueName) {
//       case 'emailQueue':
//         queue = mailQueue;
//         break;
//       case 'attendanceQueue':
//         queue = attendanceQueue;
//         break;
//       case 'teacherAttendanceQueue':
//         queue = teacherAttendanceQueue;
//         break;
//       case 'feeQueue':
//         queue = feeQueue;
//         break;
//       default:
//         // Create a new queue if needed
//         const { Queue } = await import('bullmq');
//         queue = new Queue(queueName, { connection: redisConnection });
//     }
    
//     await queue.add('job', data);
//     console.log(`✅ Job added to queue: ${queueName}`, data);
//     return { success: true };
    
//   } catch (error) {
//     console.error('❌ Queue error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== BULK QUEUE OPERATIONS ====================
// export const addBulkToQueue = async (queueName, jobs) => {
//   try {
//     let queue;
//     switch(queueName) {
//       case 'emailQueue':
//         queue = mailQueue;
//         break;
//       case 'attendanceQueue':
//         queue = attendanceQueue;
//         break;
//       case 'teacherAttendanceQueue':
//         queue = teacherAttendanceQueue;
//         break;
//       case 'feeQueue':
//         queue = feeQueue;
//         break;
//       default:
//         const { Queue } = await import('bullmq');
//         queue = new Queue(queueName, { connection: redisConnection });
//     }
    
//     const promises = jobs.map(job => queue.add('job', job));
//     await Promise.all(promises);
//     console.log(`✅ ${jobs.length} jobs added to queue: ${queueName}`);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Bulk queue error:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== QUEUE STATS ====================
// export const getQueueStats = async (queueName) => {
//   try {
//     let queue;
//     switch(queueName) {
//       case 'emailQueue':
//         queue = mailQueue;
//         break;
//       case 'attendanceQueue':
//         queue = attendanceQueue;
//         break;
//       case 'teacherAttendanceQueue':
//         queue = teacherAttendanceQueue;
//         break;
//       case 'feeQueue':
//         queue = feeQueue;
//         break;
//       default:
//         return { error: 'Queue not found' };
//     }
    
//     const counts = await queue.getJobCounts();
//     return {
//       success: true,
//       queue: queueName,
//       counts: {
//         waiting: counts.waiting || 0,
//         active: counts.active || 0,
//         completed: counts.completed || 0,
//         failed: counts.failed || 0,
//         delayed: counts.delayed || 0
//       }
//     };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

// // ==================== CLEAR QUEUE ====================
// export const clearQueue = async (queueName) => {
//   try {
//     let queue;
//     switch(queueName) {
//       case 'emailQueue':
//         queue = mailQueue;
//         break;
//       case 'attendanceQueue':
//         queue = attendanceQueue;
//         break;
//       case 'teacherAttendanceQueue':
//         queue = teacherAttendanceQueue;
//         break;
//       case 'feeQueue':
//         queue = feeQueue;
//         break;
//       default:
//         return { error: 'Queue not found' };
//     }
    
//     await queue.obliterate({ force: true });
//     console.log(`✅ Queue cleared: ${queueName}`);
//     return { success: true };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };

// // ==================== EXPORTS ====================
// export { 
//   redisConnection,
//   mailQueue,
//   attendanceQueue,
//   teacherAttendanceQueue,
//   feeQueue
// };































import { Queue } from "bullmq";
import { Redis } from "ioredis";

// ✅ Upstash Redis Connection with TLS
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "0.0.0.0",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_HOST ? {} : undefined,  // ✅ TLS for Upstash
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

// ==================== QUEUES ====================
export const mailQueue = new Queue("emailQueue", { connection: redisConnection });
export const attendanceQueue = new Queue("attendanceQueue", { connection: redisConnection });
export const teacherAttendanceQueue = new Queue("teacherAttendanceQueue", { connection: redisConnection });
export const feeQueue = new Queue("feeQueue", { connection: redisConnection });

// ==================== FUNCTIONS (SAME AS BEFORE) ====================
export const addEmailToQueue = async (email, title) => {
  try {
    await mailQueue.add("sendEmail", {
      email,
      subject: "Naya Assignment Alert!",
      body: `Bahi, aapki class ke liye naya assignment aaya hai: ${title}`,
    });
    console.log("📧 Email task queued for:", email);
    return { success: true };
  } catch (err) {
    console.error("Queue Error:", err);
    return { success: false, error: err.message };
  }
};

export const addAttendanceNotificationToQueue = async (email, studentName, status, time = null) => {
  try {
    await attendanceQueue.add("sendAttendanceEmail", {
      email,
      studentName,
      status,
      time,
      date: new Date().toLocaleDateString()
    });
    console.log(`📧 Student attendance notification queued for ${studentName}: ${status}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Student Attendance Queue Error:", err);
    return { success: false, error: err.message };
  }
};

export const addTeacherLateNotificationToQueue = async (email, teacherName, time) => {
  try {
    await teacherAttendanceQueue.add("sendTeacherLateEmail", {
      email,
      teacherName,
      time,
      date: new Date().toLocaleDateString()
    });
    console.log(`📧 Teacher late notification queued for ${teacherName} at ${time}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Teacher Late Queue Error:", err);
    return { success: false, error: err.message };
  }
};

export const addTeacherAbsentNotificationToQueue = async (email, teacherName) => {
  try {
    await teacherAttendanceQueue.add("sendTeacherAbsentEmail", {
      email,
      teacherName,
      date: new Date().toLocaleDateString()
    });
    console.log(`📧 Teacher absent notification queued for ${teacherName}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Teacher Absent Queue Error:", err);
    return { success: false, error: err.message };
  }
};

export const addFeeNotificationToQueue = async (email, studentName, amount, month, type, dueDate = null) => {
  try {
    const jobData = {
      email,
      studentName,
      amount,
      month,
      type,
      dueDate,
      timestamp: new Date().toISOString()
    };
    await feeQueue.add(`fee_${type}`, jobData);
    console.log(`💰 Fee notification queued for ${studentName}: ${type}`);
    return { success: true };
  } catch (err) {
    console.error("❌ Fee Queue Error:", err);
    return { success: false, error: err.message };
  }
};

export const addToQueue = async (queueName, data) => {
  try {
    let queue;
    switch(queueName) {
      case 'emailQueue': queue = mailQueue; break;
      case 'attendanceQueue': queue = attendanceQueue; break;
      case 'teacherAttendanceQueue': queue = teacherAttendanceQueue; break;
      case 'feeQueue': queue = feeQueue; break;
      default:
        const { Queue } = await import('bullmq');
        queue = new Queue(queueName, { connection: redisConnection });
    }
    await queue.add('job', data);
    console.log(`✅ Job added to queue: ${queueName}`, data);
    return { success: true };
  } catch (error) {
    console.error('❌ Queue error:', error);
    return { success: false, error: error.message };
  }
};

export const addBulkToQueue = async (queueName, jobs) => {
  try {
    let queue;
    switch(queueName) {
      case 'emailQueue': queue = mailQueue; break;
      case 'attendanceQueue': queue = attendanceQueue; break;
      case 'teacherAttendanceQueue': queue = teacherAttendanceQueue; break;
      case 'feeQueue': queue = feeQueue; break;
      default:
        const { Queue } = await import('bullmq');
        queue = new Queue(queueName, { connection: redisConnection });
    }
    const promises = jobs.map(job => queue.add('job', job));
    await Promise.all(promises);
    console.log(`✅ ${jobs.length} jobs added to queue: ${queueName}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Bulk queue error:', error);
    return { success: false, error: error.message };
  }
};

export const getQueueStats = async (queueName) => {
  try {
    let queue;
    switch(queueName) {
      case 'emailQueue': queue = mailQueue; break;
      case 'attendanceQueue': queue = attendanceQueue; break;
      case 'teacherAttendanceQueue': queue = teacherAttendanceQueue; break;
      case 'feeQueue': queue = feeQueue; break;
      default: return { error: 'Queue not found' };
    }
    const counts = await queue.getJobCounts();
    return {
      success: true,
      queue: queueName,
      counts: {
        waiting: counts.waiting || 0,
        active: counts.active || 0,
        completed: counts.completed || 0,
        failed: counts.failed || 0,
        delayed: counts.delayed || 0
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const clearQueue = async (queueName) => {
  try {
    let queue;
    switch(queueName) {
      case 'emailQueue': queue = mailQueue; break;
      case 'attendanceQueue': queue = attendanceQueue; break;
      case 'teacherAttendanceQueue': queue = teacherAttendanceQueue; break;
      case 'feeQueue': queue = feeQueue; break;
      default: return { error: 'Queue not found' };
    }
    await queue.obliterate({ force: true });
    console.log(`✅ Queue cleared: ${queueName}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { redisConnection, mailQueue, attendanceQueue, teacherAttendanceQueue, feeQueue };