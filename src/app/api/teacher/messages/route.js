// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Admin from "@/models/Admin"; // Ya Admin ka model
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");

//     // 1. GLOBAL LOCK CHECK (Teacher ke liye mandatory)
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     // 2. FETCH ADMIN DATA (Taake teacher ko pata ho kis se baat karni hye)
//     // Hum sirf Admin ka naam aur ID nikalenge memory bachane ke liye
//     const admin = await Admin.findOne({ role: "admin" }).select("name _id");

//     if (!teacherId) {
//       return NextResponse.json({ success: false, error: "Teacher ID required" }, { status: 400 });
//     }

//     // 3. CHAT HISTORY WITH ADMIN ONLY
//     const messages = await Message.find({
//       $or: [
//         { sender: teacherId, receiver: admin?._id },
//         { sender: admin?._id, receiver: teacherId }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(50) // Teacher side par history thori kam rakhte hain performance ke liye
//     .select("text sender receiver createdAt isRead");

//     return NextResponse.json({ 
//       success: true, 
//       data: messages, 
//       adminInfo: admin,
//       isLocked // Frontend ko batane ke liye ke input box disable karna hye ya nahi
//     });

//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text } = await req.json();

//     // 1. LOCK CHECK (Teacher locked chat mein msg nahi bhej sakta)
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     if (chatConfig?.value) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Chat is currently disabled by Admin." 
//       }, { status: 403 });
//     }

//     // 2. VALIDATION
//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message is empty" }, { status: 400 });
//     }

//     const newMessage = await Message.create({
//       sender,
//       receiver,
//       text: text.trim(),
//       isRead: false
//     });

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



















// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Admin from "@/models/Admin"; 
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// const ACTUAL_ADMIN_ID = "6a09a669d2c3c90a0113db17";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");

//     // Strict validation taake invalid/undefined ids query crash na karein
//     if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
//       return NextResponse.json({ success: false, error: "Valid Teacher ObjectId required" }, { status: 400 });
//     }

//     // 1. GLOBAL LOCK CHECK
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     // 2. FETCH ADMIN DATA (Using real schema matched document)
//     const admin = await Admin.findOne({ role: "admin" }).select("name _id").lean();
//     const adminTargetId = admin?._id ? admin._id.toString() : ACTUAL_ADMIN_ID;

//     // 3. CHAT HISTORY WITH ADMIN (Strict ObjectId mapping)
//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(teacherId), receiver: new mongoose.Types.ObjectId(adminTargetId) },
//         { sender: new mongoose.Types.ObjectId(adminTargetId), receiver: new mongoose.Types.ObjectId(teacherId) }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(100)
//     .select("text sender receiver createdAt isRead")
//     .lean();

//     return NextResponse.json({ 
//       success: true, 
//       data: messages, 
//       adminInfo: admin || { _id: adminTargetId, name: "Hussain Ali" },
//       isLocked 
//     });

//   } catch (error) {
//     console.error("Teacher GET Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text } = await req.json();

//     // 1. LOCK CHECK
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     if (chatConfig?.value) {
//       return NextResponse.json({ success: false, error: "Chat is currently disabled by Admin." }, { status: 403 });
//     }

//     // 2. SCHEMA ACCURATE OBJECTID VALIDATION
//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid Sender or Receiver ObjectId format" }, { status: 400 });
//     }

//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message is empty" }, { status: 400 });
//     }

//     // 3. CREATE MESSAGE WITH CASTING SAFETY
//     const newMessage = await Message.create({
//       sender: new mongoose.Types.ObjectId(sender),
//       receiver: new mongoose.Types.ObjectId(receiver),
//       text: text.trim(),
//       isRead: false
//     });

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     console.error("Teacher POST Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
















































// AI

// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Admin from "@/models/Admin"; 
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// const ACTUAL_ADMIN_ID = "6a09a669d2c3c90a0113db17";

// // 🔥 UPGRADED CORE: True Groq API Rest Call (Fastest Response Output)
// async function generateAIResponse(teacherMessage) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       console.warn("Groq API Key configuration missing inside .env.local");
//       return "System Notice: AI Support line is optimizing. Please wait for the administrator.";
//     }

//     // Correcting target endpoint to official Groq Cloud proxy structure
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: { 
//         "Authorization": `Bearer ${apiKey}`,
//         "Content-Type": "application/json" 
//       },
//       body: JSON.stringify({
//         model: "llama3-8b-8192", // Using ultra-fast Llama-3 model
//         messages: [
//           {
//             role: "system",
//             content: `You are an automated AI Assistant for an Institute and Health Portal Management System. 
//             The administrator (Hussain Ali) is currently offline or away from dashboard terminals.
//             Respond to the following teacher's inquiry professionally, concisely, and keep it under 3 lines max. 
//             Do not state you are an AI or a generic bot. Speak directly as the operations executive portal agent.`
//           },
//           {
//             role: "user",
//             content: `Teacher's message/query: "${teacherMessage}"`
//           }
//         ],
//         temperature: 0.5,
//         max_tokens: 150
//       })
//     });

//     const data = await response.json();
//     return data?.choices?.[0]?.message?.content || "Message acknowledged. Workspace core has logged your request.";
//   } catch (err) {
//     console.error("Groq Engine Communication Error:", err);
//     return "Automated Backup: Message transmitted to secure server logs. Operator review pending.";
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");

//     if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
//       return NextResponse.json({ success: false, error: "Valid Teacher ObjectId required" }, { status: 400 });
//     }

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     const admin = await Admin.findOne({ role: "admin" }).select("name _id").lean();
//     const adminTargetId = admin?._id ? admin._id.toString() : ACTUAL_ADMIN_ID;

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(teacherId), receiver: new mongoose.Types.ObjectId(adminTargetId) },
//         { sender: new mongoose.Types.ObjectId(adminTargetId), receiver: new mongoose.Types.ObjectId(teacherId) }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(100)
//     .lean();

//     return NextResponse.json({ 
//       success: true, 
//       data: messages, 
//       adminInfo: admin || { _id: adminTargetId, name: "Hussain Ali" },
//       isLocked 
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text } = await req.json();

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid ObjectIds" }, { status: 400 });
//     }

//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message is empty" }, { status: 400 });
//     }

//     // 1. SAVE THE TEACHER'S ORIGINAL MESSAGE FIRST
//     const teacherMessage = await Message.create({
//       sender: new mongoose.Types.ObjectId(sender),
//       receiver: new mongoose.Types.ObjectId(receiver),
//       text: text.trim(),
//       isRead: false
//     });

//     // 2. 🔥 AI TRIGGER FIX:
//     // Humne hardcoded lock condition hata di hye taake AI har surrat mein message processing automatic handle kare!
//     const aiReplyText = await generateAIResponse(text.trim());

//     // 3. Save AI Reply to DB where Sender = Admin, Receiver = Teacher
//     await Message.create({
//       sender: new mongoose.Types.ObjectId(receiver), // Admin ID acting as Sender
//       receiver: new mongoose.Types.ObjectId(sender), // Teacher ID acting as Receiver
//       text: `[AI Auto-Reply] ${aiReplyText}`,
//       isRead: false
//     });

//     return NextResponse.json({ success: true, data: teacherMessage });
//   } catch (error) {
//     console.error("POST Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Admin from "@/models/Admin"; 
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Groq from "groq-sdk";

// // ================= CONFIGURATION =================
// const DAILY_MESSAGE_LIMIT = 30;
// const RATE_LIMIT_WINDOW = 60000;
// const MAX_MESSAGES_PER_MINUTE = 10;
// const MAX_MESSAGE_LENGTH = 2000;


// // In-memory rate limiting
// const rateLimitMap = new Map();
// const aiCooldownMap = new Map();

// // ================= HELPER: Get Dynamic Admin ID =================
// async function getAdminId() {
//   try {
//     // 🔥 DYNAMIC: Database se admin fetch karo
//     const admin = await Admin.findOne({ role: "admin" }).select("_id").lean();
    
//     if (admin && admin._id) {
     
//       return admin._id.toString();
//     }
    
//     // Fallback: Agar koi admin nahi hai toh error
//     console.error("❌ No admin found in database!");
//     return null;
//   } catch (error) {
//     console.error("Error fetching admin:", error);
//     return null;
//   }
// }

// // ================= HELPER: Check Daily Limit =================
// async function checkDailyLimit(userId) {
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);
//   const endOfToday = new Date();
//   endOfToday.setHours(23, 59, 59, 999);

//   const count = await Message.countDocuments({
//     sender: new mongoose.Types.ObjectId(userId),
//     createdAt: { $gte: startOfToday, $lte: endOfToday },
//   });

//   return {
//     limited: count >= DAILY_MESSAGE_LIMIT,
//     remaining: Math.max(0, DAILY_MESSAGE_LIMIT - count),
//     used: count,
//     limit: DAILY_MESSAGE_LIMIT
//   };
// }

// // ================= HELPER: Check Rate Limit =================
// function checkRateLimit(userId) {
//   const now = Date.now();
//   const userStats = rateLimitMap.get(userId) || { count: 0, timestamp: now };
  
//   if (now - userStats.timestamp > RATE_LIMIT_WINDOW) {
//     userStats.count = 1;
//     userStats.timestamp = now;
//     rateLimitMap.set(userId, userStats);
//     return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - 1 };
//   }
  
//   if (userStats.count >= MAX_MESSAGES_PER_MINUTE) {
//     const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - userStats.timestamp)) / 1000);
//     return { 
//       limited: true, 
//       error: `Too many messages. Please wait ${waitTime} seconds.`,
//       waitTime
//     };
//   }
  
//   userStats.count++;
//   rateLimitMap.set(userId, userStats);
//   return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - userStats.count };
// }

// // ================= HELPER: Check AI Cooldown =================
// // function checkAICooldown(teacherId) {
// //   const lastReply = aiCooldownMap.get(teacherId);
// //   if (!lastReply) return { limited: false };
  
// //   const timeSinceLastReply = Date.now() - lastReply;
// //   if (timeSinceLastReply < AI_COOLDOWN) {
// //     const waitTime = Math.ceil((AI_COOLDOWN - timeSinceLastReply) / 1000);
// //     return { 
// //       limited: true, 
// //       waitTime,
// //       message: `Please wait ${waitTime} seconds before sending another message.`
// //     };
// //   }
// //   return { limited: false };
// // }

// function updateAICooldown(teacherId) {
//   aiCooldownMap.set(teacherId, Date.now());
  
//   if (aiCooldownMap.size > 100) {
//     const oneHourAgo = Date.now() - 3600000;
//     for (const [key, timestamp] of aiCooldownMap.entries()) {
//       if (timestamp < oneHourAgo) aiCooldownMap.delete(key);
//     }
//   }
// }

// // ================= HELPER: Validate Message =================
// function validateMessage(text) {
//   if (!text || text.trim().length < 1) {
//     return { valid: false, error: "Message cannot be empty" };
//   }
//   if (text.trim().length > MAX_MESSAGE_LENGTH) {
//     return { valid: false, error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` };
//   }
//   return { valid: true };
// }

// // ================= AI ENGINE =================
// async function generateAIResponse(teacherMessage) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       console.warn("Groq API Key missing");
//       return "I will check and get back to you shortly.";
//     }

//     const groq = new Groq({ apiKey: apiKey.trim() });

//     const chatCompletion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant", 
//       messages: [
//         {
//           role: "system",
//           content: `You are Hussain Ali, the human Administrator. You are a busy professional with zero tolerance for small talk.

// CRITICAL RULES:
// 1. Respond in under 2 lines max
// 2. NO small talk - ignore casual greetings
// 3. Only address official school issues
// 4. Never mention you are an AI
// 5. Be direct and professional`
//         },
//         {
//           role: "user",
//           content: `Teacher's message: "${teacherMessage}"`
//         }
//       ],
//       temperature: 0.4,
//       max_tokens: 100
//     });

//     return chatCompletion.choices[0]?.message?.content?.trim() || "Noted. I'll review this shortly.";
//   } catch (err) {
//     console.error("AI Error:", err);
//     return "Received. Will look into this.";
//   }
// }

// // ================= GET REQUEST =================
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");

//     if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Valid Teacher ObjectId required" 
//       }, { status: 400 });
//     }

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     // 🔥 DYNAMIC: Admin info fetch karo
//     const admin = await Admin.findOne({ role: "admin" }).select("name _id").lean();
    
//     if (!admin) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Admin not found in database" 
//       }, { status: 404 });
//     }

//     const adminId = admin._id.toString();

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(teacherId), receiver: new mongoose.Types.ObjectId(adminId) },
//         { sender: new mongoose.Types.ObjectId(adminId), receiver: new mongoose.Types.ObjectId(teacherId) }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(100)
//     .lean();

//     // Get message limits info
//     const dailyLimit = await checkDailyLimit(teacherId);
//     const rateLimit = checkRateLimit(teacherId);

//     return NextResponse.json({ 
//       success: true, 
//       data: messages, 
//       adminInfo: { _id: adminId, name: admin.name },
//       isLocked,
//       limits: {
//         daily: {
//           used: dailyLimit.used,
//           remaining: dailyLimit.remaining,
//           limit: dailyLimit.limit
//         },
//         rate: {
//           remaining: rateLimit.remaining
//         }
//       }
//     });
//   } catch (error) {
//     console.error("GET Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // ================= POST REQUEST =================
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     // ✅ Validate IDs
//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Invalid ObjectIds" 
//       }, { status: 400 });
//     }

//     // ✅ Validate message
//     const validation = validateMessage(text);
//     if (!validation.valid) {
//       return NextResponse.json({ 
//         success: false, 
//         error: validation.error 
//       }, { status: 400 });
//     }

//     // ✅ Check chat lock
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     if (chatConfig?.value) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Chat is currently locked by admin. Please try again later." 
//       }, { status: 403 });
//     }

//     // ✅ TEACHER-ONLY LIMITS
//     if (requesterRole !== "admin") {
//       // Check daily limit
//       const dailyLimit = await checkDailyLimit(sender);
//       if (dailyLimit.limited) {
//         return NextResponse.json({ 
//           success: false, 
//           error: `Daily message limit reached (${DAILY_MESSAGE_LIMIT}/day). You can send more messages tomorrow.`,
//           limits: { daily: dailyLimit }
//         }, { status: 429 });
//       }

//       // Check rate limit
//       const rateLimit = checkRateLimit(sender);
//       if (rateLimit.limited) {
//         return NextResponse.json({ 
//           success: false, 
//           error: rateLimit.error,
//           waitTime: rateLimit.waitTime
//         }, { status: 429 });
//       }

//       // Check AI cooldown
//       // const aiCooldown = checkAICooldown(sender);
//       // if (aiCooldown.limited) {
//       //   return NextResponse.json({ 
//       //     success: false, 
//       //     error: aiCooldown.message,
//       //     waitTime: aiCooldown.waitTime
//       //   }, { status: 429 });
//       // }
//     }

//     // ✅ Save teacher's message
//     const teacherMessage = await Message.create({
//       sender: new mongoose.Types.ObjectId(sender),
//       receiver: new mongoose.Types.ObjectId(receiver),
//       text: text.trim(),
//       isRead: false,
//       isAutoReply: false
//     });

//     // ✅ Trigger AI reply for teacher messages only
//     if (requesterRole !== "admin") {
//       const aiReplyText = await generateAIResponse(text.trim());
      
//       await Message.create({
//         sender: new mongoose.Types.ObjectId(receiver),
//         receiver: new mongoose.Types.ObjectId(sender),
//         text: aiReplyText,
//         isRead: false,
//         isAutoReply: true
//       });
      
//       updateAICooldown(sender);
//     }

//     // Get updated limits for response
//     const updatedDailyLimit = await checkDailyLimit(sender);
//     const updatedRateLimit = checkRateLimit(sender);

//     return NextResponse.json({ 
//       success: true, 
//       data: teacherMessage,
//       limits: requesterRole !== "admin" ? {
//         daily: {
//           used: updatedDailyLimit.used,
//           remaining: updatedDailyLimit.remaining,
//           limit: updatedDailyLimit.limit
//         },
//         rate: {
//           remaining: updatedRateLimit.remaining
//         }
//       } : null
//     });

//   } catch (error) {
//     console.error("POST Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message || "Internal Server Error" 
//     }, { status: 500 });
//   }
// }

// // ================= GET STATS =================
// export async function HEAD(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");

//     if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Valid Teacher ID required" 
//       }, { status: 400 });
//     }

//     const dailyLimit = await checkDailyLimit(teacherId);
//     const rateLimit = checkRateLimit(teacherId);

//     return NextResponse.json({ 
//       success: true,
//       limits: {
//         daily: {
//           limit: DAILY_MESSAGE_LIMIT,
//           used: dailyLimit.used,
//           remaining: dailyLimit.remaining
//         },
//         rate: {
//           limit: MAX_MESSAGES_PER_MINUTE,
//           remaining: rateLimit.remaining
//         },
//         messageLength: {
//           max: MAX_MESSAGE_LENGTH
//         }
//       }
//     });

//   } catch (error) {
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }




















import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";
import Admin from "@/models/Admin"; 
import SystemConfig from "@/models/SystemConfig";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Groq from "groq-sdk";

// ================= CONFIGURATION =================
const DAILY_MESSAGE_LIMIT = 30;           // 30 messages per day for teachers
const RATE_LIMIT_WINDOW = 60000;          // 1 minute
const MAX_MESSAGES_PER_MINUTE = 10;       // 10 messages per minute
const MAX_MESSAGE_LENGTH = 2000;

// In-memory rate limiting
const rateLimitMap = new Map();

// ================= HELPER: Get Dynamic Admin ID =================
async function getAdminId() {
  try {
    const admin = await Admin.findOne({ role: "admin" }).select("_id").lean();
    
    if (admin && admin._id) {
      return admin._id.toString();
    }
    
    console.error("❌ No admin found in database!");
    return null;
  } catch (error) {
    console.error("Error fetching admin:", error);
    return null;
  }
}

// ================= HELPER: Check Daily Limit =================
async function checkDailyLimit(userId) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const count = await Message.countDocuments({
    sender: new mongoose.Types.ObjectId(userId),
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });

  return {
    limited: count >= DAILY_MESSAGE_LIMIT,
    remaining: Math.max(0, DAILY_MESSAGE_LIMIT - count),
    used: count,
    limit: DAILY_MESSAGE_LIMIT
  };
}

// ================= HELPER: Check Rate Limit =================
function checkRateLimit(userId) {
  const now = Date.now();
  const userStats = rateLimitMap.get(userId) || { count: 0, timestamp: now };
  
  if (now - userStats.timestamp > RATE_LIMIT_WINDOW) {
    userStats.count = 1;
    userStats.timestamp = now;
    rateLimitMap.set(userId, userStats);
    return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - 1 };
  }
  
  if (userStats.count >= MAX_MESSAGES_PER_MINUTE) {
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - userStats.timestamp)) / 1000);
    return { 
      limited: true, 
      error: `Too many messages. Please wait ${waitTime} seconds.`,
      waitTime
    };
  }
  
  userStats.count++;
  rateLimitMap.set(userId, userStats);
  return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - userStats.count };
}

// ================= HELPER: Validate Message =================
function validateMessage(text) {
  if (!text || text.trim().length < 1) {
    return { valid: false, error: "Message cannot be empty" };
  }
  if (text.trim().length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` };
  }
  return { valid: true };
}

// ================= AI ENGINE =================
async function generateAIResponse(teacherMessage) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("Groq API Key missing");
      return "I will check and get back to you shortly.";
    }

    const groq = new Groq({ apiKey: apiKey.trim() });

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", 
      messages: [
        {
          role: "system",
          content: `You are Hussain Ali, the human Administrator. You are a busy professional with zero tolerance for small talk.

CRITICAL RULES:
1. Respond in under 2 lines max
2. NO small talk - ignore casual greetings
3. Only address official school issues
4. Never mention you are an AI
5. Be direct and professional`
        },
        {
          role: "user",
          content: `Teacher's message: "${teacherMessage}"`
        }
      ],
      temperature: 0.4,
      max_tokens: 100
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "Noted. I'll review this shortly.";
  } catch (err) {
    console.error("AI Error:", err);
    return "Received. Will look into this.";
  }
}

// ================= GET REQUEST =================
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Valid Teacher ObjectId required" 
      }, { status: 400 });
    }

    const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
    const isLocked = chatConfig?.value || false;

    const admin = await Admin.findOne({ role: "admin" }).select("name _id").lean();
    
    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        error: "Admin not found in database" 
      }, { status: 404 });
    }

    const adminId = admin._id.toString();

    const messages = await Message.find({
      $or: [
        { sender: new mongoose.Types.ObjectId(teacherId), receiver: new mongoose.Types.ObjectId(adminId) },
        { sender: new mongoose.Types.ObjectId(adminId), receiver: new mongoose.Types.ObjectId(teacherId) }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();

    // Get message limits info
    const dailyLimit = await checkDailyLimit(teacherId);
    const rateLimit = checkRateLimit(teacherId);

    return NextResponse.json({ 
      success: true, 
      data: messages, 
      adminInfo: { _id: adminId, name: admin.name },
      isLocked,
      limits: {
        daily: {
          used: dailyLimit.used,
          remaining: dailyLimit.remaining,
          limit: dailyLimit.limit
        },
        rate: {
          remaining: rateLimit.remaining,
          limit: MAX_MESSAGES_PER_MINUTE
        }
      }
    });

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// ================= POST REQUEST =================
export async function POST(req) {
  await dbConnect();
  try {
    const { sender, receiver, text } = await req.json();
    const requesterRole = req.headers.get("x-user-role");

    // ✅ Validate IDs
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid ObjectIds" 
      }, { status: 400 });
    }

    // ✅ Validate message
    const validation = validateMessage(text);
    if (!validation.valid) {
      return NextResponse.json({ 
        success: false, 
        error: validation.error 
      }, { status: 400 });
    }

    // ✅ Check chat lock
    const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
    if (chatConfig?.value) {
      return NextResponse.json({ 
        success: false, 
        error: "Chat is currently locked by admin. Please try again later." 
      }, { status: 403 });
    }

    // ✅ TEACHER-ONLY LIMITS
    if (requesterRole !== "admin") {
      // Check daily limit (30 messages per day)
      const dailyLimit = await checkDailyLimit(sender);
      if (dailyLimit.limited) {
        return NextResponse.json({ 
          success: false, 
          error: `Daily message limit reached (${DAILY_MESSAGE_LIMIT}/day). You can send more messages tomorrow.`,
          limits: { 
            daily: {
              used: dailyLimit.used,
              remaining: dailyLimit.remaining,
              limit: dailyLimit.limit
            }
          }
        }, { status: 429 });
      }

      // Check rate limit (10 messages per minute)
      const rateLimit = checkRateLimit(sender);
      if (rateLimit.limited) {
        return NextResponse.json({ 
          success: false, 
          error: rateLimit.error,
          waitTime: rateLimit.waitTime,
          limitType: "rate"
        }, { status: 429 });
      }
    }

    // ✅ Save teacher's message
    const teacherMessage = await Message.create({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      text: text.trim(),
      isRead: false,
      isAutoReply: false
    });

    // ✅ Trigger AI reply for teacher messages only
    if (requesterRole !== "admin") {
      const aiReplyText = await generateAIResponse(text.trim());
      
      await Message.create({
        sender: new mongoose.Types.ObjectId(receiver),
        receiver: new mongoose.Types.ObjectId(sender),
        text: aiReplyText,
        isRead: false,
        isAutoReply: true
      });
    }

    // Get updated limits for response
    const updatedDailyLimit = await checkDailyLimit(sender);
    const updatedRateLimit = checkRateLimit(sender);

    return NextResponse.json({ 
      success: true, 
      data: teacherMessage,
      limits: {
        daily: {
          used: updatedDailyLimit.used,
          remaining: updatedDailyLimit.remaining,
          limit: updatedDailyLimit.limit
        },
        rate: {
          remaining: updatedRateLimit.remaining,
          limit: MAX_MESSAGES_PER_MINUTE
        }
      }
    });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

// ================= GET STATS =================
export async function HEAD(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Valid Teacher ID required" 
      }, { status: 400 });
    }

    const dailyLimit = await checkDailyLimit(teacherId);
    const rateLimit = checkRateLimit(teacherId);

    return NextResponse.json({ 
      success: true,
      limits: {
        daily: {
          limit: DAILY_MESSAGE_LIMIT,
          used: dailyLimit.used,
          remaining: dailyLimit.remaining
        },
        rate: {
          limit: MAX_MESSAGES_PER_MINUTE,
          remaining: rateLimit.remaining
        },
        messageLength: {
          max: MAX_MESSAGE_LENGTH
        }
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}