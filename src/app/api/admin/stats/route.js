// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();

//     // Hum Promise.all use kar rahe hain taake saari queries ek saath fast chalein
//     const [
//       totalTeachers, 
//       totalStudents, 
//       onlineTeachers, 
//       onlineStudents, 
//       latestTeachers
//     ] = await Promise.all([
//       // 1. Total Counts
//       User.countDocuments({ role: "teacher" }),
//       User.countDocuments({ role: "student" }),

//       // 2. Online Counts (isOnline: true ke mutabik)
//       User.countDocuments({ role: "teacher", isOnline: true }),
//       User.countDocuments({ role: "student", isOnline: true }),

//       // 3. Latest 5 Teachers
//       User.find({ role: "teacher" })
//         .select("-password")
//         .sort({ createdAt: -1 })
//         .limit(5)
//     ]);

//     return NextResponse.json({
//       success: true,
//       summary: { 
//         totalTeachers, 
//         totalStudents,
//         onlineTeachers, // Dashboard par "Live Teachers" card ke liye
//         onlineStudents  // Dashboard par "Live Students" card ke liye
//       },
//       latestTeachers,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("STATS_ERROR:", error);
//     return NextResponse.json({ success: false, message: "Error loading data" }, { status: 500 });
//   }
// }








// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Teacher from "@/models/Teacher"; // Teacher Model
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();

//     // Promise.all se hum dono collections (Student aur Teacher) se data mangwayein ge
//     const [
//       totalTeachers, 
//       totalStudents, 
//       onlineTeachers, 
//       onlineStudents, 
//       latestTeachers
//     ] = await Promise.all([
//       // 1. Total Counts (Dono alag models se)
//       Teacher.countDocuments({}), 
//       User.countDocuments({ role: "student" }),

//       // 2. Online Counts (Dono models mein isOnline check karenge)
//       Teacher.countDocuments({ isOnline: true }),
//      User.countDocuments({ role: "student", isOnline: true }),
//       // 3. Latest 5 Teachers (Teacher model se)
//       Teacher.find({})
//         .select("-password")
//         .sort({ createdAt: -1 })
//         .limit(5)
//     ]);

//     return NextResponse.json({
//       success: true,
//       summary: { 
//         totalTeachers, 
//         totalStudents,
//         onlineTeachers, 
//         onlineStudents 
//       },
//       latestTeachers,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("STATS_ERROR:", error);
//     return NextResponse.json({ 
//         success: false, 
//         message: "Error loading data" 
//     }, { status: 500 });
//   }
// }






























// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Teacher from "@/models/Teacher"; 
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();

//     // Safety Check: Ensure models are connected properly if using Mongoose strictly
//     // Note: If you are using standard Mongoose models, this should work fine.

//     const [
//       totalTeachers, 
//       totalStudents, 
//       onlineTeachers, 
//       onlineStudents, 
//       latestTeachers
//     ] = await Promise.all([
//       // 1. Total Counts
//       Teacher.countDocuments({}).catch(() => 0), 
//       User.countDocuments({ role: "student" }).catch(() => 0),

//       // 2. Online Counts
//       Teacher.countDocuments({ isOnline: true }).catch(() => 0),
//       User.countDocuments({ role: "student", isOnline: true }).catch(() => 0),

//       // 3. Latest 5 Teachers
//       Teacher.find({})
//         .select("-password") // Password hide karna zaroori hai
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .lean() // lean() use karein taake plain JavaScript object mile (performance ke liye)
//     ]);

//     return NextResponse.json({
//       success: true,
//       summary: { 
//         totalTeachers, 
//         totalStudents,
//         onlineTeachers, 
//         onlineStudents 
//       },
//       latestTeachers,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("STATS_ERROR:", error);
//     return NextResponse.json({ 
//         success: false, 
//         message: "Error loading data",
//         error: error.message 
//     }, { status: 500 });
//   }
// }












































// AI


import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Teacher from "@/models/Teacher"; 
import { NextResponse } from "next/server";

export async function GET() {
 
  try {
    await dbConnect();

    // 1. Database se saara core data fetch karna Parallelly
    const [
      totalTeachers, 
      totalStudents, 
      onlineTeachers, 
      onlineStudents, 
      latestTeachers
    ] = await Promise.all([
      Teacher.countDocuments({}).catch(() => 0), 
      User.countDocuments({ role: "student" }).catch(() => 0),
      Teacher.countDocuments({ isOnline: true }).catch(() => 0),
      User.countDocuments({ role: "student", isOnline: true }).catch(() => 0),
      Teacher.find({})
        .select("-password") 
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

   

    // 2. Groq AI Configuration and Key Cleaning
    const apiKeyRaw = process.env.GROQ_API_KEY;
    if (!apiKeyRaw) {
      
      return NextResponse.json({ success: false, error: "Groq API key missing in environment files." }, { status: 500 });
    }
    const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();

    // 3. System Prompt for Dashboard Analytics
    const systemPrompt = `You are an elite AI School Management Auditor & Executive Assistant.
    Analyze the raw portal stats provided by the admin dashboard.
    Your job is to generate data-driven executive insights and status flags.
    
    You must return a strict JSON object with exactly these fields:
    1. "systemStatus": A string that must be either "EXCELLENT", "STABLE", "WARNING", or "CRITICAL".
    2. "aiInsight": A 2-sentence sharp professional analytics summary about the student-to-teacher ratio or online engagement.
    3. "alerts": An array of strings containing actionable management alerts or recommendations based on data anomalies (e.g., Low teacher presence, high student load).
    
    Return ONLY a raw JSON block, no markdown, no notes outside the JSON:
    {
      "systemStatus": "STABLE",
      "aiInsight": "string",
      "alerts": ["string", "string"]
    }`;

    // 4. Current Dashboard Stats Context for AI
    const userPrompt = `Current Portal Analytics for Audit:
    - Total Enrolled Teachers: ${totalTeachers}
    - Currently Online Teachers: ${onlineTeachers}
    - Total Active Students: ${totalStudents}
    - Currently Online Students: ${onlineStudents}
    - Active Teacher Attendance Rate: ${totalTeachers > 0 ? Math.round((onlineTeachers / totalTeachers) * 100) : 0}%
    - Student-to-Teacher Ratio: ${totalTeachers > 0 ? (totalStudents / totalTeachers).toFixed(1) : totalStudents}:1`;

   
    
    const aiResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cleanApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2, // Temperature low rakha hye taake strict business analytics mile
        response_format: { type: "json_object" }
      })
    });

    // Default AI response schema agar api down ho ya fail ho jaye
    let aiAnalytics = {
      systemStatus: "STABLE",
      aiInsight: "Dashboard diagnostics loaded successfully. Systems are tracking normal parameters.",
      alerts: ["Routine check: Keep monitoring peak-hour student logins."]
    };

    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      try {
        const rawContent = aiData.choices?.[0]?.message?.content || "{}";
        
        aiAnalytics = JSON.parse(rawContent);
       
      } catch (parseErr) {
        
      }
    } 



    // 5. Final Response Return containing default stats + AI insights
    return NextResponse.json({
      success: true,
      summary: { 
        totalTeachers, 
        totalStudents,
        onlineTeachers, 
        onlineStudents 
      },
      aiAnalytics, // Frontend par is object ko map karke badhiya glow cards bana sakte hain
      latestTeachers,
    }, { status: 200 });

  } catch (error) {
    console.error("💥 CRITICAL STATS_ERROR:", error);
    return NextResponse.json({ 
        success: false, 
        message: "Error loading dashboard metrics",
        error: error.message 
    }, { status: 500 });
  }
}