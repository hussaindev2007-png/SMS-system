// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import { NextResponse } from "next/server";
// // api/messages/route.js
// export async function GET(req) {
//   await dbConnect();
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");
//   const contactId = searchParams.get("contactId");

//   const messages = await Message.find({
//     $or: [
//       { sender: userId, receiver: contactId }, // Admin ne bhejay
//       { sender: contactId, receiver: userId }  // Teacher ne bhejay
//     ]
//   }).sort({ createdAt: 1 });

//   return NextResponse.json({ success: true, data: messages });
// }

// // // POST: Naya message bhejne ke liye
// export async function POST(req) {
//   await dbConnect();
  
//   try {
//     const { sender, receiver, text } = await req.json();
    
//     if (!sender || !receiver || !text) {
//       return NextResponse.json({ success: false, error: "Empty message or missing IDs" }, { status: 400 });
//     }
    

//     const newMessage = await Message.create({ sender, receiver, text });

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }














// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import { NextResponse } from "next/server";

// // GET: Chat history nikalna aur unread messages ko 'read' mark karna
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); // Jo user chat dekh raha hye
//     const contactId = searchParams.get("contactId"); // Jis se chat ho rahi hye

//     if (!userId || !contactId) {
//       return NextResponse.json({ success: false, error: "IDs missing" }, { status: 400 });
//     }

//     // 1. Pehle messages fetch karein
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, receiver: contactId }, 
//         { sender: contactId, receiver: userId } 
//       ]
//     }).sort({ createdAt: 1 });

//     // 2. LOGIC: Jo messages contact ne bheje hain aur current user ne nahi parhay (isRead: false)
//     // Unhe foran update kar do
//     await Message.updateMany(
//       { 
//         sender: contactId, 
//         receiver: userId, 
//         isRead: false 
//       },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // POST: Naya message bhejne ke liye
// export async function POST(req) {
//   await dbConnect();
  
//   try {
//     const { sender, receiver, text } = await req.json();
    
//     if (!sender || !receiver || !text) {
//       return NextResponse.json({ success: false, error: "Empty message or missing IDs" }, { status: 400 });
//     }

//     // Naya message create karna (Model mein default isRead: false hota hye)
//     const newMessage = await Message.create({ 
//       sender, 
//       receiver, 
//       text,
//       isRead: false // explicitly setting it to false for new messages
//     });

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }




// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const contactId = searchParams.get("contactId");
//     const requesterRole = req.headers.get("x-user-role"); 

//     // 1. DYNAMIC GLOBAL LOCK CHECK
//     // Database se current lock status uthana
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     if (isLocked && requesterRole !== "admin") {
//       return NextResponse.json({ 
//         success: false, 
//         isLocked: true,
//         error: "Maintenance: Chat is currently disabled by Admin." 
//       }, { status: 403 });
//     }

//     // 2. TEACHER LIST (ONLY FOR ADMIN)
//     if (!userId || !contactId) {
//       if (requesterRole !== "admin") {
//         return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
//       }
      
//       const teachers = await Teacher.find({}).select("name _id subject status");
//       // Sath mein isLocked status bhi bhej rahe hain taake frontend ko pata ho
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     // 3. CHAT HISTORY (Optimized for 8GB RAM)
//     const messages = await Message.find({
//       $or: [
//         { sender: userId, receiver: contactId }, 
//         { sender: contactId, receiver: userId } 
//       ]
//     }).sort({ createdAt: 1 }).limit(100); 

//     await Message.updateMany(
//       { sender: contactId, receiver: userId, isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     // 1. POST LOCK CHECK
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     if (chatConfig?.value && requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Channel locked" }, { status: 403 });
//     }

//     // 2. VALIDATION
//     if (!text || text.trim().length < 2) {
//       return NextResponse.json({ success: false, error: "Message too short" }, { status: 400 });
//     }

//     // 3. RECIPIENT VERIFICATION
//     const receiverExists = await Teacher.findById(receiver);
//     if (!receiverExists) {
//       return NextResponse.json({ success: false, error: "Recipient not found" }, { status: 404 });
//     }

//     const newMessage = await Message.create({ 
//       sender, 
//       receiver, 
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false 
//     });

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // 4. ADMIN TOGGLE ROUTE (Chat Lock on/off karne ke liye)
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }











// AI
// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); // Admin ID
//     const contactId = searchParams.get("contactId"); // Selected Teacher ID
//     const requesterRole = req.headers.get("x-user-role"); 

//     // 1. DYNAMIC GLOBAL LOCK CHECK
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     // 2. TEACHER DIRECTORY GENERATOR (Agar sidebar load ho raha ho)
//     if (!userId || !contactId) {
//       const teachers = await Teacher.find({}).select("name _id subject status").lean();
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     // Strict Verification check for active selected pane
//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ success: false, error: "Invalid User or Contact ObjectId format" }, { status: 400 });
//     }

//     // 3. CHAT HISTORY (Strict Casting mapping for deep filter search)
//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) }, 
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) } 
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean(); 

//     // 4. BULK READ STATUS UPDATE
//     await Message.updateMany(
//       { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId), isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Admin GET Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid parameters formatting" }, { status: 400 });
//     }

//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message too short" }, { status: 400 });
//     }

//     const newMessage = await Message.create({ 
//       sender: new mongoose.Types.ObjectId(sender), 
//       receiver: new mongoose.Types.ObjectId(receiver), 
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false 
//     });

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     console.error("Admin POST Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // 4. ADMIN TOGGLE ROUTE
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden: Operator role insufficient" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }






// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// // 🔥 CORE AI AUTO-PILOT ENGINE (POWERED BY GROQ API)
// async function generateAutoPilotReply(teacherMessage) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       console.warn("Groq API Key missing in environment variables.");
//       return "Message received. The system administrator will look into this.";
//     }

//     // Groq Cloud REST API implementation (Using llama3-8b-8192 for blazing fast responses)
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama3-8b-8192", // Fast and highly efficient tool for operations
//         messages: [
//           {
//             role: "system",
//             content: `You are the AI Assistant acting directly on behalf of the Administrator (Hussain Ali) for a School Management Portal.
//             A teacher has sent a message. Write a highly professional, helpful, and direct reply as the Admin.
//             Keep the tone realistic, corporate, and make sure the response is under 2-3 lines max.
//             Do not mention that you are an AI or a bot. Reply as the automated workspace executor.`
//           },
//           {
//             role: "user",
//             content: `Teacher's message: "${teacherMessage}"`
//           }
//         ],
//         temperature: 0.5,
//         max_tokens: 150
//       }),
//     });

//     const data = await response.json();
//     return data?.choices?.[0]?.message?.content || "Acknowledged. Added to tasks logs.";
//   } catch (err) {
//     console.error("Groq Auto-Pilot Error:", err);
//     return "Acknowledged. Your log has been recorded inside the portal core.";
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); // Admin ID
//     const contactId = searchParams.get("contactId"); // Selected Teacher ID

//     // 1. DYNAMIC GLOBAL LOCK CHECK
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     // 2. TEACHER DIRECTORY GENERATOR (Sidebar load state)
//     if (!userId || !contactId) {
//       const teachers = await Teacher.find({}).select("name _id subject status").lean();
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ success: false, error: "Invalid User or Contact ObjectId format" }, { status: 400 });
//     }

//     // 3. CHAT HISTORY FETCH
//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) }, 
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) } 
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean(); 

//     // 4. BULK READ STATUS UPDATE
//     await Message.updateMany(
//       { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId), isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Admin GET Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role"); // Reads role context directly from frontend query headers

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid parameters formatting" }, { status: 400 });
//     }

//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message too short" }, { status: 400 });
//     }

//     // 1. Save original message (Jo teacher ne portal se hit kiya hye)
//     const newMessage = await Message.create({ 
//       sender: new mongoose.Types.ObjectId(sender), 
//       receiver: new mongoose.Types.ObjectId(receiver), 
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false 
//     });

//     // 2. 🔥 FAIL-SAFE TRIGGER: 
//     // Agar message bhejney wala admin NAHI hye (yaani incoming teacher text hye), to AI auto-pilot trigger hoga!
//     if (requesterRole !== "admin") {
      
//       const aiAutoReplyText = await generateAutoPilotReply(text.trim());

//       // 3. Admin user identity ki taraf se database mein instantly data inject karein
//       await Message.create({
//         sender: new mongoose.Types.ObjectId(receiver), // Admin become Sender here
//         receiver: new mongoose.Types.ObjectId(sender), // Teacher become Receiver
//         text: `[AI Auto-Pilot] ${aiAutoReplyText}`,
//         isRead: false,
//         isImportant: false
//       });
//     }

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     console.error("Admin POST Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden: Operator role insufficient" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }





// advance



// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Groq from "groq-sdk";

// // 🔥 CORE AI AUTO-PILOT ENGINE (HUMANIZED WITH LLAMA 3.1)
// async function generateAutoPilotReply(teacherMessage) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       console.warn("Groq API Key missing in environment variables.");
//       return "Message received. I will check and get back to you shortly.";
//     }

//     const groq = new Groq({ apiKey: apiKey.trim() });

//     // const chatCompletion = await groq.chat.completions.create({
//     //   model: "llama-3.1-8b-instant", // Updated to supported stable model
//     //   messages: [
//     //     {
//     //       role: "system",
//     //       content: `You are Hussain Ali, the human Administrator of the Institute and School Management Portal. 
//     //       A teacher has messaged you. Respond exactly like a busy, professional human admin. 
//     //       Keep the tone polite, natural, and direct. Write like a real person typing on a chat dashboard. 
//     //       Do NOT use generic assistant greetings like "How can I help you today?" or formal AI structures. 
//     //       Keep your response extremely short (under 2 lines max). 
//     //       Never mention you are an AI, automation, or a system agent.`
//     //     },
//     //     {
//     //       role: "user",
//     //       content: `Teacher's message: "${teacherMessage}"`
//     //     }
//     //   ],
//     //   temperature: 0.7, // Higher temperature makes it sound less like a boring repetitive bot
//     //   max_tokens: 100
//     // });

//     const chatCompletion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant", 
//       messages: [
//         {
//           role: "system",
//           content: `You are Hussain Ali, the human Administrator of the Institute and School Management Portal. 
//           You are a busy professional with zero tolerance for small talk, time-passing, or casual chatting.

//           CRITICAL RULES FOR RESPONDING:
//           1. STRICT PROFESSIONALISM: Act strictly as a busy admin. Write naturally like a real person typing on a dashboard (under 2 lines max).
//           2. NO SMALL TALK: If the teacher tries to do time-pass, asks casual questions (e.g., "How are you?", "What are you doing?"), or sends generic greetings beyond a basic hello, completely ignore the casual part. Do not engage in friendly banter.
//           3. ISSUE-FOCUSED: Only address official school issues, student queries, or portal problems.
//           4. ACTIONABLE FALLBACK (IF NO ISSUE): If the teacher has no genuine issue or is just making casual conversation, cut the talk immediately and professionally tell them to focus on their current work, check their pending student assignments/grading, or update their lecture logs.
//           5. NO AI IDENTIFIER: Never mention you are an AI, a bot, or an automated assistant. Keep the illusion of a real human admin 100% intact.`
//         },
//         {
//           role: "user",
//           content: `Teacher's message: "${teacherMessage}"`
//         }
//       ],
//       temperature: 0.4, // Strict token control
//       max_tokens: 100
//     });

//     const aiText = chatCompletion.choices[0]?.message?.content;
//     return aiText ? aiText.trim() : "Noted. I'll review this shortly.";
//   } catch (err) {
//     console.error("Groq Auto-Pilot Error:", err);
//     return "Received. Will look into the logs when back at my desk.";
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); // Admin ID
//     const contactId = searchParams.get("contactId"); // Selected Teacher ID

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     if (!userId || !contactId) {
//       const teachers = await Teacher.find({}).select("name _id subject status").lean();
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ success: false, error: "Invalid User or Contact ObjectId format" }, { status: 400 });
//     }

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) }, 
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) } 
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean(); 

//     await Message.updateMany(
//       { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId), isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Admin GET Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role"); 

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid parameters formatting" }, { status: 400 });
//     }

//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message too short" }, { status: 400 });
//     }

//     // 🔥 50 MESSAGES PER DAY LIMIT LOGIC
//     // Agar bhejney wala admin nahi hye (yani teacher message bhej raha hye), tab check lagayenge
//     if (requesterRole !== "admin") {
//       const startOfToday = new Date();
//       startOfToday.setHours(0, 0, 0, 0);

//       const endOfToday = new Date();
//       endOfToday.setHours(23, 59, 59, 999);

//       // Aaj ke din is teacher ke total sent messages count karo
//       const todayMessagesCount = await Message.countDocuments({
//         sender: new mongoose.Types.ObjectId(sender),
//         createdAt: { $gte: startOfToday, $lte: endOfToday }
//       });

//       // Agar limit (50) reach ho chuki hye, toh error response return karke block kar do
//       if (todayMessagesCount >= 50) {
//         return NextResponse.json({ 
//           success: false, 
//           error: "Daily message threshold reached. You can send up to 50 messages per day to prevent system overload." 
//         }, { status: 429 }); // 429 is HTTP Standard for Too Many Requests
//       }
//     }

//     // 1. Save original message (Teacher text)
//     const newMessage = await Message.create({ 
//       sender: new mongoose.Types.ObjectId(sender), 
//       receiver: new mongoose.Types.ObjectId(receiver), 
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false 
//     });

//     // 2. TRIGGER HUMANIZED AI AUTO-PILOT
//     if (requesterRole !== "admin") {
//       const aiAutoReplyText = await generateAutoPilotReply(text.trim());

//       // 3. Admin user identity ki taraf se database mein data inject karein
//       // 🔥 NOTICE: Yahan se "[AI Auto-Pilot]" ka tag permanent hata diya hye taake yeh real chat lagay!
//       await Message.create({
//         sender: new mongoose.Types.ObjectId(receiver), 
//         receiver: new mongoose.Types.ObjectId(sender), 
//         text: aiAutoReplyText, 
//         isRead: false,
//         isImportant: false
//       });
//     }

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     console.error("Admin POST Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden: Operator role insufficient" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }











// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Groq from "groq-sdk";

// // 🔥 CORE AI AUTO-PILOT ENGINE (HUMANIZED WITH LLAMA 3.1)
// async function generateAutoPilotReply(teacherMessage) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       console.warn("Groq API Key missing in environment variables.");
//       return "Message received. I will check and get back to you shortly.";
//     }

//     const groq = new Groq({ apiKey: apiKey.trim() });

//     const chatCompletion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant", 
//       messages: [
//         {
//           role: "system",
//           content: `You are Hussain Ali, the human Administrator of the Institute and School Management Portal. 
//           You are a busy professional with zero tolerance for small talk, time-passing, or casual chatting.

//           CRITICAL RULES FOR RESPONDING:
//           1. STRICT PROFESSIONALISM: Act strictly as a busy admin. Write naturally like a real person typing on a dashboard (under 2 lines max).
//           2. NO SMALL TALK: If the teacher tries to do time-pass, asks casual questions (e.g., "How are you?", "What are you doing?"), or sends generic greetings beyond a basic hello, completely ignore the casual part. Do not engage in friendly banter.
//           3. ISSUE-FOCUSED: Only address official school issues, student queries, or portal problems.
//           4. ACTIONABLE FALLBACK (IF NO ISSUE): If the teacher has no genuine issue or is just making casual conversation, cut the talk immediately and professionally tell them to focus on their current work, check their pending student assignments/grading, or update their lecture logs.
//           5. NO AI IDENTIFIER: Never mention you are an AI, a bot, or an automated assistant. Keep the illusion of a real human admin 100% intact.`
//         },
//         {
//           role: "user",
//           content: `Teacher's message: "${teacherMessage}"`
//         }
//       ],
//       temperature: 0.4, 
//       max_tokens: 100
//     });

//     const aiText = chatCompletion.choices[0]?.message?.content;
//     return aiText ? aiText.trim() : "Noted. I'll review this shortly.";
//   } catch (err) {
//     console.error("Groq Auto-Pilot Error:", err);
//     return "Received. Will look into the logs when back at my desk.";
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); 
//     const contactId = searchParams.get("contactId"); 

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     if (!userId || !contactId) {
//       const teachers = await Teacher.find({}).select("name _id subject status").lean();
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ success: false, error: "Invalid User or Contact ObjectId format" }, { status: 400 });
//     }

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) }, 
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) } 
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean(); 

//     await Message.updateMany(
//       { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId), isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Admin GET Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role"); 

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid parameters formatting" }, { status: 400 });
//     }

//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message too short" }, { status: 400 });
//     }

//     // 🔥 50 MESSAGES PER DAY LIMIT LOGIC (AI-MODEL INLINE STYLE)
//     if (requesterRole !== "admin") {
//       const startOfToday = new Date();
//       startOfToday.setHours(0, 0, 0, 0);

//       const endOfToday = new Date();
//       endOfToday.setHours(23, 59, 59, 999);

//       const todayMessagesCount = await Message.countDocuments({
//         sender: new mongoose.Types.ObjectId(sender),
//         createdAt: { $gte: startOfToday, $lte: endOfToday }
//       });

//       // 🔥 CHAT LIMIT OVERFLOW PROTECTION
//       if (todayMessagesCount >= 50) {
//         // AI models ki tarah chat panel ke andar inline automated system notice generate karein
//         const limitNoticeMessage = await Message.create({
//           sender: new mongoose.Types.ObjectId(receiver), // Admin ID acting as Sender
//           receiver: new mongoose.Types.ObjectId(sender), // Teacher ID acting as Receiver
//           text: "⚠️ System Notice: Your daily transmission limit of 50 messages has been reached. Secure line will reset at midnight.",
//           isRead: false,
//           isImportant: true
//         });

//         return NextResponse.json({ 
//           success: true, 
//           limitReached: true,
//           data: limitNoticeMessage,
//           message: "Daily threshold reached. Embedded notice pushed to layout logs smoothly."
//         }, { status: 200 }); // Status 200 taake console ya dashboard network logs crash na hon
//       }
//     }

//     // 1. Save original message (Teacher text)
//     const newMessage = await Message.create({ 
//       sender: new mongoose.Types.ObjectId(sender), 
//       receiver: new mongoose.Types.ObjectId(receiver), 
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false 
//     });

//     // 2. TRIGGER HUMANIZED AI AUTO-PILOT
//     if (requesterRole !== "admin") {
//       const aiAutoReplyText = await generateAutoPilotReply(text.trim());

//       // 3. Admin user identity ki taraf se database mein data inject karein
//       await Message.create({
//         sender: new mongoose.Types.ObjectId(receiver), 
//         receiver: new mongoose.Types.ObjectId(sender), 
//         text: aiAutoReplyText, 
//         isRead: false,
//         isImportant: false
//       });
//     }

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     console.error("Admin POST Chat API Error:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden: Operator role insufficient" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }





































// quen



// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import Task from "@/models/Task"; 
// import { NextResponse } from "next/server";
// import mongoose from "mongoose"; 
// import Groq from "groq-sdk";

// // 🔥 CONFIGURATION
// const DAILY_MESSAGE_LIMIT = 50;

// // 🔥 HELPER: Fetch Teacher Context (Strictly from DB)
// async function getTeacherContext(teacherId) {
//   try {
//     // 1. Fetch Teacher Details
//     const teacher = await Teacher.findById(teacherId).select("name subject").lean();
//     if (!teacher) return null;

//     // 2. Fetch Admin Assigned Tasks (Official Duties)
//     const adminTasks = await Task.find({ 
//       assignedTo: new mongoose.Types.ObjectId(teacherId), 
//       status: { $in: ["pending", "in-progress"] } 
//     })
//     .select('title')
//     .limit(3)
//     .lean();

//     // Format Admin Tasks
//     let adminTaskList = "None";
//     if (adminTasks.length > 0) {
//       adminTaskList = adminTasks.map(t => t.title).join(", ");
//     }

//     // NOTE: Hum filhal Student Assignments count nahi kar rahe kyunki uska model schema confirm nahi hai.
//     // AI ko sirf Admin Tasks dikhaye jayenge taake wo jhoot na bole.
    
//     return {
//       name: teacher.name,
//       subject: teacher.subject,
//       adminTasks: adminTaskList
//     };
//   } catch (error) {
//     console.error("Context Fetch Error:", error);
//     return null;
//   }
// }

// // 🔥 HELPER: Check Daily Limit
// async function checkAndEnforceLimit(userId) {
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);
//   const endOfToday = new Date();
//   endOfToday.setHours(23, 59, 59, 999);

//   const count = await Message.countDocuments({
//     sender: new mongoose.Types.ObjectId(userId),
//     createdAt: { $gte: startOfToday, $lte: endOfToday },
//   });

//   if (count >= DAILY_MESSAGE_LIMIT) {
//     return {
//       limited: true,
//       error: `Daily limit of ${DAILY_MESSAGE_LIMIT} messages reached. Please wait until midnight.`
//     };
//   }
//   return { limited: false };
// }

// // 🔥 CORE AI AUTO-PILOT ENGINE (ANTI-HALLUCINATION MODE)
// async function generateAutoPilotReply(teacherMessage, teacherContext) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       return "Message received. I will check and get back to you shortly.";
//     }

//     const groq = new Groq({ apiKey: apiKey.trim() });

//     // Prepare Strict Context String
//     let contextString = "";
//     if (teacherContext) {
//       contextString = `
//       [OFFICIAL ADMIN DATA - DO NOT INVENT NUMBERS]:
//       - Teacher Name: ${teacherContext.name}
//       - Subject: ${teacherContext.subject}
//       - PENDING ADMIN TASKS: ${teacherContext.adminTasks}
      
//       CRITICAL RULES FOR YOU:
//       1. TRUTHFULNESS ONLY: If "PENDING ADMIN TASKS" says "None", you MUST say "No official tasks."
//       2. NO HALLUCINATION: NEVER make up numbers like "34 assignments" or "12 grading tasks" if they are not in the data above.
//       3. SCOPE: You only know about Admin-assigned tasks. Do not mention student work unless explicitly asked and present in logs.
//       4. PERSONA: You are Hussain Ali (Admin). Be brief, strict, and professional. Max 2 lines.
//       `;
//     }

//     const chatCompletion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant", 
//       messages: [
//         {
//           role: "system",
//           content: `You are Hussain Ali, the human Administrator. 
          
//           ${contextString}

//           FINAL INSTRUCTION: Stick strictly to the provided data. If no data, direct them to check their dashboard logs manually.`
//         },
//         {
//           role: "user",
//           content: `Teacher's message: "${teacherMessage}"`
//         }
//       ],
//       temperature: 0.1, // 🔥 Low temperature for factual accuracy
//       max_tokens: 100
//     });

//     const aiText = chatCompletion.choices[0]?.message?.content;
//     return aiText ? aiText.trim() : "Noted. Will review.";
//   } catch (err) {
//     console.error("Groq Auto-Pilot Error:", err);
//     return "Received. Will look into it.";
//   }
// }

// // ================= GET REQUEST =================
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId"); 
//     const contactId = searchParams.get("contactId"); 

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     if (!userId || !contactId) {
//       const teachers = await Teacher.find({}).select("name _id subject status").lean();
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
//     }

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) }, 
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) } 
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean(); 

//     await Message.updateMany(
//       { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId), isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Admin GET Chat API Error:", error);
//     return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
//   }
// }

// // ================= POST REQUEST =================
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role"); 

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid IDs" }, { status: 400 });
//     }
//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message empty" }, { status: 400 });
//     }

//     // CHECK LIMIT FOR SENDER
//     const limitCheck = await checkAndEnforceLimit(sender);
//     if (limitCheck.limited) {
//       return NextResponse.json({ 
//         success: false, 
//         error: limitCheck.error 
//       }, { status: 429 }); 
//     }

//     // Save Original Message
//     const newMessage = await Message.create({ 
//       sender: new mongoose.Types.ObjectId(sender), 
//       receiver: new mongoose.Types.ObjectId(receiver), 
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false 
//     });

//     // AI AUTO-REPLY LOGIC (Only if sender is NOT admin)
//     if (requesterRole !== "admin") {
//       const context = await getTeacherContext(sender);
//       const aiReplyText = await generateAutoPilotReply(text.trim(), context);

//       // Check Limit for Admin before sending AI reply
//       const adminLimitCheck = await checkAndEnforceLimit(receiver);
      
//       if (!adminLimitCheck.limited) {
//         await Message.create({
//           sender: new mongoose.Types.ObjectId(receiver), 
//           receiver: new mongoose.Types.ObjectId(sender), 
//           text: aiReplyText, 
//           isRead: false,
//           isImportant: false
//         });
//       }
//     }

//     return NextResponse.json({ success: true, data: newMessage });
//   } catch (error) {
//     console.error("Admin POST Chat API Error:", error);
//     return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // ================= PATCH REQUEST =================
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

































































// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import Task from "@/models/Task";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Groq from "groq-sdk";

// // ================= CONFIGURATION =================
// const DAILY_MESSAGE_LIMIT = 50;
// const AI_REPLY_COOLDOWN = 60000; // 1 minute cooldown between AI replies
// const ADMIN_OFFLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutes offline threshold

// // Track last AI reply times (in-memory cache)
// const lastAITimestamps = new Map();

// // ================= HELPER: Check if Admin is Online =================
// async function isAdminOnline(adminId) {
//   try {
//     // Check for recent activity in Message collection
//     // If admin sent any message in last 5 minutes, consider them online
//     const fiveMinutesAgo = new Date(Date.now() - ADMIN_OFFLINE_THRESHOLD);
    
//     const recentAdminMessage = await Message.findOne({
//       sender: new mongoose.Types.ObjectId(adminId),
//       createdAt: { $gte: fiveMinutesAgo }
//     }).sort({ createdAt: -1 });

//     return !!recentAdminMessage;
//   } catch (error) {
//     console.error("Admin Online Check Error:", error);
//     return false; // Default to offline if check fails
//   }
// }

// // ================= HELPER: Check AI Reply Cooldown =================
// function shouldSendAIReply(teacherId) {
//   const lastReply = lastAITimestamps.get(teacherId.toString());
//   if (!lastReply) return true;
  
//   const timeSinceLastReply = Date.now() - lastReply;
//   if (timeSinceLastReply < AI_REPLY_COOLDOWN) {
//     return false; // Too soon for another AI reply
//   }
//   return true;
// }

// function updateAIReplyTimestamp(teacherId) {
//   lastAITimestamps.set(teacherId.toString(), Date.now());
  
//   // Clean up old entries periodically
//   if (lastAITimestamps.size > 100) {
//     const oneHourAgo = Date.now() - 3600000;
//     for (const [key, timestamp] of lastAITimestamps.entries()) {
//       if (timestamp < oneHourAgo) {
//         lastAITimestamps.delete(key);
//       }
//     }
//   }
// }

// // ================= HELPER: Fetch Teacher Context =================
// async function getTeacherContext(teacherId) {
//   try {
//     const teacher = await Teacher.findById(teacherId).select("name subject").lean();
//     if (!teacher) return null;

//     const adminTasks = await Task.find({
//       assignedTo: new mongoose.Types.ObjectId(teacherId),
//       status: { $in: ["pending", "in-progress"] }
//     })
//     .select('title')
//     .limit(3)
//     .lean();

//     let adminTaskList = "None";
//     if (adminTasks.length > 0) {
//       adminTaskList = adminTasks.map(t => t.title).join(", ");
//     }
    
//     return {
//       name: teacher.name,
//       subject: teacher.subject,
//       adminTasks: adminTaskList
//     };
//   } catch (error) {
//     console.error("Context Fetch Error:", error);
//     return null;
//   }
// }

// // ================= HELPER: Check Daily Limit =================
// async function checkAndEnforceLimit(userId) {
//   const startOfToday = new Date();
//   startOfToday.setHours(0, 0, 0, 0);
//   const endOfToday = new Date();
//   endOfToday.setHours(23, 59, 59, 999);

//   const count = await Message.countDocuments({
//     sender: new mongoose.Types.ObjectId(userId),
//     createdAt: { $gte: startOfToday, $lte: endOfToday },
//   });

//   if (count >= DAILY_MESSAGE_LIMIT) {
//     return {
//       limited: true,
//       error: `Daily limit of ${DAILY_MESSAGE_LIMIT} messages reached. Please wait until midnight.`
//     };
//   }
//   return { limited: false };
// }

// // ================= AI AUTO-PILOT ENGINE =================
// async function generateAutoPilotReply(teacherMessage, teacherContext) {
//   try {
//     const apiKey = process.env.GROQ_API_KEY;
//     if (!apiKey) {
//       return "Message received. I will check and get back to you shortly.";
//     }

//     const groq = new Groq({ apiKey: apiKey.trim() });

//     let contextString = "";
//     if (teacherContext) {
//       contextString = `
//       [OFFICIAL ADMIN DATA - DO NOT INVENT NUMBERS]:
//       - Teacher Name: ${teacherContext.name}
//       - Subject: ${teacherContext.subject}
//       - PENDING ADMIN TASKS: ${teacherContext.adminTasks}
      
//       CRITICAL RULES FOR YOU:
//       1. TRUTHFULNESS ONLY: If "PENDING ADMIN TASKS" says "None", you MUST say "No official tasks."
//       2. NO HALLUCINATION: NEVER make up numbers like "34 assignments" or "12 grading tasks"
//       3. SCOPE: You only know about Admin-assigned tasks.
//       4. PERSONA: You are Hussain Ali (Admin). Be brief, strict, and professional. Max 2 lines.
//       5. MARK YOUR REPLY: Start with "[Away] " to indicate admin is offline.
//       `;
//     }

//     const chatCompletion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content: `You are Hussain Ali, the human Administrator. 
          
//           ${contextString}

//           FINAL INSTRUCTION: Stick strictly to the provided data. Start your reply with "[Away] "`
//         },
//         {
//           role: "user",
//           content: `Teacher's message: "${teacherMessage}"`
//         }
//       ],
//       temperature: 0.1,
//       max_tokens: 100
//     });

//     let aiText = chatCompletion.choices[0]?.message?.content;
    
//     // Ensure the [Away] prefix exists
//     if (aiText && !aiText.startsWith("[Away]")) {
//       aiText = `[Away] ${aiText}`;
//     }
    
//     return aiText ? aiText.trim() : "[Away] Noted. Will review.";
//   } catch (err) {
//     console.error("Groq Auto-Pilot Error:", err);
//     return "[Away] Received. Will look into it.";
//   }
// }

// // ================= GET REQUEST =================
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const contactId = searchParams.get("contactId");

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     if (!userId || !contactId) {
//       const teachers = await Teacher.find({}).select("name _id subject status").lean();
//       return NextResponse.json({ success: true, teachers, isLocked }, { status: 200 });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ success: false, error: "Invalid ID format" }, { status: 400 });
//     }

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) },
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean();

//     await Message.updateMany(
//       { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId), isRead: false },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ success: true, data: messages, isLocked });
//   } catch (error) {
//     console.error("Admin GET Chat API Error:", error);
//     return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
//   }
// }

// // ================= POST REQUEST =================
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ success: false, error: "Invalid IDs" }, { status: 400 });
//     }
//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ success: false, error: "Message empty" }, { status: 400 });
//     }

//     // Check lock status
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     if (chatConfig?.value && requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Chat is currently locked by admin" }, { status: 403 });
//     }

//     // CHECK LIMIT FOR SENDER
//     const limitCheck = await checkAndEnforceLimit(sender);
//     if (limitCheck.limited) {
//       return NextResponse.json({
//         success: false,
//         error: limitCheck.error
//       }, { status: 429 });
//     }

//     // Save Original Message
//     const newMessage = await Message.create({
//       sender: new mongoose.Types.ObjectId(sender),
//       receiver: new mongoose.Types.ObjectId(receiver),
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false,
//       isAutoReply: false,
//       replyType: 'human'
//     });

//     // ========== AI AUTO-REPLY LOGIC (Only if sender is NOT admin) ==========
//     if (requesterRole !== "admin") {
//       const adminOnline = await isAdminOnline(receiver);
//       const canSendAIReply = shouldSendAIReply(sender);
      
//       // Case 1: Admin is ONLINE - NO AI reply
//       if (adminOnline) {
//         console.log(`Admin ${receiver} is online, skipping auto-reply for teacher ${sender}`);
        
//         // Optional: Send a "admin is online" indicator (can be handled by frontend)
//         // No automatic message sent
//       }
//       // Case 2: Admin is OFFLINE AND cooldown allows reply
//       else if (!adminOnline && canSendAIReply) {
//         console.log(`Admin ${receiver} is offline, sending AI auto-reply to teacher ${sender}`);
        
//         const context = await getTeacherContext(sender);
//         const aiReplyText = await generateAutoPilotReply(text.trim(), context);
        
//         // Check Admin's daily limit before sending AI reply
//         const adminLimitCheck = await checkAndEnforceLimit(receiver);
        
//         if (!adminLimitCheck.limited) {
//           await Message.create({
//             sender: new mongoose.Types.ObjectId(receiver),
//             receiver: new mongoose.Types.ObjectId(sender),
//             text: aiReplyText,
//             isRead: false,
//             isImportant: false,
//             isAutoReply: true,
//             replyType: 'ai_offline'
//           });
          
//           // Update cooldown timestamp
//           updateAIReplyTimestamp(sender);
//         } else {
//           // Admin limit reached, send system message instead
//           await Message.create({
//             sender: new mongoose.Types.ObjectId(receiver),
//             receiver: new mongoose.Types.ObjectId(sender),
//             text: "[System] Admin's daily message limit has been reached. Your message has been queued.",
//             isRead: false,
//             isImportant: false,
//             isAutoReply: true,
//             isSystemMessage: true,
//             replyType: 'none'
//           });
//         }
//       }
//       // Case 3: Admin is OFFLINE but cooldown active
//       else if (!adminOnline && !canSendAIReply) {
//         console.log(`AI cooldown active for teacher ${sender}, skipping auto-reply`);
        
//         // Send a single cooldown message per session (not every time)
//         // Optional: Send a reminder message
//         const cooldownMessageSent = lastAITimestamps.get(`${sender}_cooldown_notified`);
//         if (!cooldownMessageSent) {
//           await Message.create({
//             sender: new mongoose.Types.ObjectId(receiver),
//             receiver: new mongoose.Types.ObjectId(sender),
//             text: "[System] Admin is currently offline. Your message has been saved. Please wait for a response.",
//             isRead: false,
//             isImportant: false,
//             isAutoReply: true,
//             isSystemMessage: true,
//             replyType: 'ai_cooldown'
//           });
//           lastAITimestamps.set(`${sender}_cooldown_notified`, Date.now());
//         }
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       data: newMessage,
//       meta: {
//         autoReplySent: requesterRole !== "admin" ? !(await isAdminOnline(receiver)) : false
//       }
//     });
//   } catch (error) {
//     console.error("Admin POST Chat API Error:", error);
//     return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // ================= PATCH REQUEST =================
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     if (requesterRole !== "admin") {
//       return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
//     }

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ success: true, isLocked: updatedConfig.value });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // ================= OPTIONAL: DELETE old cooldown entries periodically =================
// // This can be called via a cron job or scheduled function
// export async function DELETE(req) {
//   // Clean up old cooldown timestamps (optional maintenance endpoint)
//   const oneHourAgo = Date.now() - 3600000;
//   for (const [key, timestamp] of lastAITimestamps.entries()) {
//     if (timestamp < oneHourAgo) {
//       lastAITimestamps.delete(key);
//     }
//   }
//   return NextResponse.json({ success: true, message: "Cache cleaned" });
// }











































// import dbConnect from "@/lib/mongodb";
// import Message from "@/models/Message";
// import Teacher from "@/models/Teacher";
// import SystemConfig from "@/models/SystemConfig";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// // ================= CONFIGURATION =================
// const DAILY_MESSAGE_LIMIT = 30;        // 50 messages per day per user
// const RATE_LIMIT_WINDOW = 60000;       // 1 minute
// const MAX_MESSAGES_PER_MINUTE = 10;    // 10 messages per minute

// // In-memory rate limiting (for development - use Redis in production)
// const rateLimitMap = new Map();

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

//   if (count >= DAILY_MESSAGE_LIMIT) {
//     return {
//       limited: true,
//       error: `Daily limit of ${DAILY_MESSAGE_LIMIT} messages reached. You can send more messages tomorrow.`,
//       remaining: 0
//     };
//   }
//   return {
//     limited: false,
//     remaining: DAILY_MESSAGE_LIMIT - count,
//     used: count
//   };
// }

// // ================= HELPER: Check Rate Limit (Per Minute) =================
// function checkRateLimit(userId) {
//   const now = Date.now();
//   const userStats = rateLimitMap.get(userId) || { count: 0, timestamp: now };
  
//   // Reset if window has passed
//   if (now - userStats.timestamp > RATE_LIMIT_WINDOW) {
//     userStats.count = 1;
//     userStats.timestamp = now;
//     rateLimitMap.set(userId, userStats);
//     return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - 1 };
//   }
  
//   // Check if within limit
//   if (userStats.count >= MAX_MESSAGES_PER_MINUTE) {
//     return { 
//       limited: true, 
//       error: `Too many messages. Please wait ${Math.ceil((RATE_LIMIT_WINDOW - (now - userStats.timestamp)) / 1000)} seconds.`,
//       remaining: 0
//     };
//   }
  
//   userStats.count++;
//   rateLimitMap.set(userId, userStats);
//   return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - userStats.count };
// }

// // ================= GET REQUEST =================
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//     const contactId = searchParams.get("contactId");

//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     const isLocked = chatConfig?.value || false;

//     // ✅ CASE 1: No contactId - Return teachers list for sidebar
//     if (!userId || !contactId) {
//       console.log("📋 Fetching teachers list for admin:", userId);
      
//       const teachers = await Teacher.find({})
//         .select("name _id subject status")
//         .lean();
      
//       console.log(`✅ Found ${teachers.length} teachers`);
      
//       return NextResponse.json({ 
//         success: true, 
//         teachers: teachers || [], 
//         isLocked 
//       });
//     }

//     // ✅ CASE 2: Both userId and contactId exist - Return chat history
//     if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Invalid ID format" 
//       }, { status: 400 });
//     }

//     const messages = await Message.find({
//       $or: [
//         { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) },
//         { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) }
//       ]
//     })
//     .sort({ createdAt: 1 })
//     .limit(120)
//     .lean();

//     // Mark unread messages as read
//     await Message.updateMany(
//       { 
//         sender: new mongoose.Types.ObjectId(contactId), 
//         receiver: new mongoose.Types.ObjectId(userId), 
//         isRead: false 
//       },
//       { $set: { isRead: true } }
//     );

//     return NextResponse.json({ 
//       success: true, 
//       data: messages, 
//       isLocked 
//     });

//   } catch (error) {
//     console.error("❌ GET /api/admin/messages Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message || "Server Error" 
//     }, { status: 500 });
//   }
// }

// // ================= POST REQUEST (with Limits) =================
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { sender, receiver, text, isImportant } = await req.json();
//     const requesterRole = req.headers.get("x-user-role");

//     // ✅ Validate IDs
//     if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Invalid IDs" 
//       }, { status: 400 });
//     }
    
//     // ✅ Validate message
//     if (!text || text.trim().length < 1) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Message cannot be empty" 
//       }, { status: 400 });
//     }
    
//     if (text.trim().length > 2000) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Message too long. Maximum 2000 characters allowed." 
//       }, { status: 400 });
//     }

//     // ✅ Check chat lock status
//     const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
//     if (chatConfig?.value && requesterRole !== "admin") {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Chat is currently locked by admin" 
//       }, { status: 403 });
//     }

//     // ✅ CHECK RATE LIMIT (Per Minute)
//     const rateLimit = checkRateLimit(sender);
//     if (rateLimit.limited) {
//       return NextResponse.json({ 
//         success: false, 
//         error: rateLimit.error,
//         limitType: "rate"
//       }, { status: 429 });
//     }

//     // ✅ CHECK DAILY LIMIT (For non-admin users)
//     if (requesterRole !== "admin") {
//       const dailyLimit = await checkDailyLimit(sender);
//       if (dailyLimit.limited) {
//         return NextResponse.json({ 
//           success: false, 
//           error: dailyLimit.error,
//           limitType: "daily",
//           remaining: dailyLimit.remaining,
//           used: dailyLimit.used
//         }, { status: 429 });
//       }
//     }

//     // ✅ Create message
//     const newMessage = await Message.create({
//       sender: new mongoose.Types.ObjectId(sender),
//       receiver: new mongoose.Types.ObjectId(receiver),
//       text: text.trim(),
//       isRead: false,
//       isImportant: isImportant || false
//     });

//     console.log(`✅ Message sent: ${newMessage._id} | Sender: ${sender}`);

//     return NextResponse.json({ 
//       success: true, 
//       data: newMessage,
//       limits: requesterRole !== "admin" ? {
//         remainingDaily: (await checkDailyLimit(sender)).remaining,
//         remainingPerMinute: rateLimit.remaining
//       } : null
//     });

//   } catch (error) {
//     console.error("❌ POST /api/admin/messages Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message || "Internal Server Error" 
//     }, { status: 500 });
//   }
// }

// // ================= PATCH REQUEST (Toggle Lock) =================
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { lockStatus } = await req.json();

//     const updatedConfig = await SystemConfig.findOneAndUpdate(
//       { key: "chat_lock" },
//       { value: lockStatus },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json({ 
//       success: true, 
//       isLocked: updatedConfig.value 
//     });

//   } catch (error) {
//     console.error("❌ PATCH /api/admin/messages Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// // ================= OPTIONAL: Get user message stats =================
// export async function HEAD(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Valid User ID required" 
//       }, { status: 400 });
//     }

//     const dailyLimit = await checkDailyLimit(userId);
//     const now = Date.now();
//     const userStats = rateLimitMap.get(userId) || { count: 0, timestamp: now };
//     const timeRemaining = RATE_LIMIT_WINDOW - (now - userStats.timestamp);

//     return NextResponse.json({ 
//       success: true,
//       stats: {
//         daily: {
//           limit: DAILY_MESSAGE_LIMIT,
//           used: dailyLimit.used,
//           remaining: dailyLimit.remaining,
//           isLimited: dailyLimit.limited
//         },
//         rate: {
//           limit: MAX_MESSAGES_PER_MINUTE,
//           used: userStats.count,
//           remaining: Math.max(0, MAX_MESSAGES_PER_MINUTE - userStats.count),
//           resetIn: Math.max(0, Math.ceil(timeRemaining / 1000))
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
import Teacher from "@/models/Teacher";
import SystemConfig from "@/models/SystemConfig";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ================= CONFIGURATION =================
const DAILY_MESSAGE_LIMIT = 30;           // 30 messages per day for TEACHERS only
const RATE_LIMIT_WINDOW = 60000;          // 1 minute
const MAX_MESSAGES_PER_MINUTE = 15;       // 15 messages per minute (for both)

// In-memory rate limiting
const rateLimitMap = new Map();

// ================= HELPER: Check Daily Limit (Teachers only) =================
async function checkDailyLimit(userId, isAdmin = false) {
  // ✅ Admin ke liye koi limit nahi
  if (isAdmin) {
    return {
      limited: false,
      remaining: Infinity,
      used: 0,
      limit: Infinity,
      isUnlimited: true
    };
  }
  
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
    limit: DAILY_MESSAGE_LIMIT,
    isUnlimited: false
  };
}

// ================= HELPER: Check Rate Limit =================
function checkRateLimit(userId) {
  const now = Date.now();
  const userStats = rateLimitMap.get(userId) || { count: 0, timestamp: now };
  
  // Reset if window has passed
  if (now - userStats.timestamp > RATE_LIMIT_WINDOW) {
    userStats.count = 1;
    userStats.timestamp = now;
    rateLimitMap.set(userId, userStats);
    return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - 1 };
  }
  
  // Check if within limit
  if (userStats.count >= MAX_MESSAGES_PER_MINUTE) {
    const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - userStats.timestamp)) / 1000);
    return { 
      limited: true, 
      error: `Too many messages. Please wait ${waitTime} seconds.`,
      remaining: 0,
      waitTime
    };
  }
  
  userStats.count++;
  rateLimitMap.set(userId, userStats);
  return { limited: false, remaining: MAX_MESSAGES_PER_MINUTE - userStats.count };
}

// ================= GET REQUEST =================
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const contactId = searchParams.get("contactId");

    const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
    const isLocked = chatConfig?.value || false;

    // ✅ CASE 1: No contactId - Return teachers list for sidebar
    if (!userId || !contactId) {
      console.log("📋 Fetching teachers list for admin:", userId);
      
      const teachers = await Teacher.find({})
        .select("name _id subject status")
        .lean();
      
      console.log(`✅ Found ${teachers.length} teachers`);
      
      return NextResponse.json({ 
        success: true, 
        teachers: teachers || [], 
        isLocked 
      });
    }

    // ✅ CASE 2: Both userId and contactId exist - Return chat history
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(contactId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid ID format" 
      }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { sender: new mongoose.Types.ObjectId(userId), receiver: new mongoose.Types.ObjectId(contactId) },
        { sender: new mongoose.Types.ObjectId(contactId), receiver: new mongoose.Types.ObjectId(userId) }
      ]
    })
    .sort({ createdAt: 1 })
    .limit(120)
    .lean();

    // Mark unread messages as read
    await Message.updateMany(
      { 
        sender: new mongoose.Types.ObjectId(contactId), 
        receiver: new mongoose.Types.ObjectId(userId), 
        isRead: false 
      },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ 
      success: true, 
      data: messages, 
      isLocked 
    });

  } catch (error) {
    console.error("❌ GET /api/admin/messages Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Server Error" 
    }, { status: 500 });
  }
}

// ================= POST REQUEST =================
export async function POST(req) {
  await dbConnect();
  try {
    const { sender, receiver, text, isImportant } = await req.json();
    const requesterRole = req.headers.get("x-user-role");
    
    // ✅ Check if sender is admin
    const isAdmin = requesterRole === "admin";

    // ✅ Validate IDs
    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid IDs" 
      }, { status: 400 });
    }
    
    // ✅ Validate message
    if (!text || text.trim().length < 1) {
      return NextResponse.json({ 
        success: false, 
        error: "Message cannot be empty" 
      }, { status: 400 });
    }
    
    if (text.trim().length > 2000) {
      return NextResponse.json({ 
        success: false, 
        error: "Message too long. Maximum 2000 characters allowed." 
      }, { status: 400 });
    }

    // ✅ Check chat lock status (only for teachers)
    const chatConfig = await SystemConfig.findOne({ key: "chat_lock" });
    if (chatConfig?.value && !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: "Chat is currently locked by admin. Please try again later." 
      }, { status: 403 });
    }

    // ✅ CHECK RATE LIMIT (Both admin and teacher)
    const rateLimit = checkRateLimit(sender);
    if (rateLimit.limited) {
      return NextResponse.json({ 
        success: false, 
        error: rateLimit.error,
        limitType: "rate",
        waitTime: rateLimit.waitTime
      }, { status: 429 });
    }

    // ✅ CHECK DAILY LIMIT (Only for teachers, admin has NO limit)
    let dailyLimit = null;
    if (!isAdmin) {
      dailyLimit = await checkDailyLimit(sender, false);
      if (dailyLimit.limited) {
        return NextResponse.json({ 
          success: false, 
          error: `Daily message limit reached (${DAILY_MESSAGE_LIMIT}/day). You can send more messages tomorrow.`,
          limitType: "daily",
          remaining: dailyLimit.remaining,
          used: dailyLimit.used
        }, { status: 429 });
      }
    } else {
      // Admin ke liye daily limit fetch (unlimited)
      dailyLimit = await checkDailyLimit(sender, true);
    }

    // ✅ Create message
    const newMessage = await Message.create({
      sender: new mongoose.Types.ObjectId(sender),
      receiver: new mongoose.Types.ObjectId(receiver),
      text: text.trim(),
      isRead: false,
      isImportant: isImportant || false
    });

    console.log(`✅ Message sent: ${newMessage._id} | Sender: ${sender} | Role: ${isAdmin ? "Admin" : "Teacher"}`);

    // ✅ Prepare limits response (only for teachers)
    let limits = null;
    if (!isAdmin) {
      const updatedDailyLimit = await checkDailyLimit(sender, false);
      limits = {
        daily: {
          used: updatedDailyLimit.used,
          remaining: updatedDailyLimit.remaining,
          limit: updatedDailyLimit.limit,
          isUnlimited: false
        },
        rate: {
          remaining: rateLimit.remaining,
          limit: MAX_MESSAGES_PER_MINUTE
        }
      };
    } else {
      limits = {
        daily: {
          used: 0,
          remaining: Infinity,
          limit: Infinity,
          isUnlimited: true
        },
        rate: {
          remaining: rateLimit.remaining,
          limit: MAX_MESSAGES_PER_MINUTE
        }
      };
    }

    return NextResponse.json({ 
      success: true, 
      data: newMessage,
      limits
    });

  } catch (error) {
    console.error("❌ POST /api/admin/messages Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}

// ================= PATCH REQUEST (Toggle Lock) =================
export async function PATCH(req) {
  await dbConnect();
  try {
    const { lockStatus } = await req.json();

    const updatedConfig = await SystemConfig.findOneAndUpdate(
      { key: "chat_lock" },
      { value: lockStatus },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      isLocked: updatedConfig.value 
    });

  } catch (error) {
    console.error("❌ PATCH /api/admin/messages Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// ================= GET STATS =================
export async function HEAD(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const isAdmin = searchParams.get("isAdmin") === "true";

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ 
        success: false, 
        error: "Valid User ID required" 
      }, { status: 400 });
    }

    const dailyLimit = await checkDailyLimit(userId, isAdmin);
    const rateLimit = checkRateLimit(userId);

    return NextResponse.json({ 
      success: true,
      limits: {
        daily: {
          limit: dailyLimit.limit,
          used: dailyLimit.used,
          remaining: dailyLimit.remaining,
          isUnlimited: isAdmin
        },
        rate: {
          limit: MAX_MESSAGES_PER_MINUTE,
          remaining: rateLimit.remaining
        },
        messageLength: {
          max: 2000
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