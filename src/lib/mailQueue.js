import { Queue } from "bullmq";
import { Redis } from "ioredis";

// Docker Redis Connection
const redisConnection = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const mailQueue = new Queue("emailQueue", {
  connection: redisConnection,
});

export const addEmailToQueue = async (email, title) => {
  try {
    await mailQueue.add("sendEmail", {
      email,
      subject: "Naya Assignment Alert!",
      body: `Bahi, aapki class ke liye naya assignment aaya hai: ${title}`,
    });
    console.log("Email task queued for:", email);
  } catch (err) {
    console.error("Queue Error:", err);
  }
};  