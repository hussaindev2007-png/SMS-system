// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import User from "@/models/User"; // Zaroori hai populate ke liye
// import { NextResponse } from "next/server";

// // --- GET: Admin ke liye saare tasks fetch karna ---
// export async function GET() {
//   await dbConnect();
//   try {
//     const tasks = await Task.find({})
//       .populate("assignedTo", "name email") // Teacher ka naam aur email nikaalo
//       .populate("assignedBy", "name")       // Admin ka naam nikaalo
//       .sort({ createdAt: -1 });             // Newest tasks pehle dikhao

//     return NextResponse.json({ 
//       success: true, 
//       data: tasks 
//     });
//   } catch (error) {
//     console.error("GET_TASKS_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // --- POST: Naya task assign karna ---
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();

//     // Validation: Check karein ke zaroori cheezein hain
//     if (!body.title || !body.assignedTo || !body.assignedBy) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Title, Teacher ID, and Admin ID are required!" 
//       }, { status: 400 });
//     }

//     const newTask = await Task.create(body);
    
//     return NextResponse.json({ 
//       success: true, 
//       data: newTask 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("POST_TASK_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }








// subjectes









// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import Teacher from "@/models/Teacher"; // User ki jagah Teacher model import karein
// import { NextResponse } from "next/server";

// // --- GET: Admin ke liye saare tasks fetch karna ---
// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const subject = searchParams.get("subject");

//     // Filtering logic
//     let query = {};
//     if (teacherId) query.assignedTo = teacherId;
//     if (subject) query.subject = { $regex: subject, $options: "i" };

//     const tasks = await Task.find(query)
//       // CRITICAL UPDATE: 'assignedTo' ab Teacher model ko ref karega
//       .populate({
//         path: "assignedTo",
//         model: Teacher, // Explicitly model batana zaroori hai
//         select: "name email subject phone"
//       })
//       .populate("assignedBy", "name") // Admin User model mein hi hoga
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ 
//       success: true, 
//       data: tasks 
//     });
//   } catch (error) {
//     console.error("GET_TASKS_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // --- POST: Naya task assign karna ---
// export async function POST(req) {
//   try {
//     await dbConnect();
    
//     const body = await req.json();
//     const { title, assignedTo, assignedBy, subject, priority, deadline, description } = body;

//     // Validation
//     if (!title || !assignedTo || !assignedBy || !subject) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Title, Teacher, Admin, and Subject are required!" 
//       }, { status: 400 });
//     }

//     // Task creation
//     const newTask = await Task.create({
//       title,
//       description: description || "",
//       assignedTo, // Ye Teacher ki ID hogi
//       assignedBy, // Ye Admin ki ID hogi
//       subject,
//       priority: priority || "medium",
//       deadline: deadline || null,
//       status: "pending"
//     });
    
//     return NextResponse.json({ 
//       success: true, 
//       message: "Task assigned to teacher successfully",
//       data: newTask 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("POST_TASK_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



































// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const subject = searchParams.get("subject");

//     let query = {};
//     if (teacherId) query.assignedTo = teacherId;
//     if (subject) query.subject = subject;

//     const tasks = await Task.find(query)
//       .populate({
//         path: "assignedTo",
//         model: Teacher,
//         select: "name email subjects phone",
//         populate: {
//           path: "subjects",
//           model: Subject,
//           select: "name"
//         }
//       })
//       .populate({
//         path: "subject",
//         model: Subject,
//         select: "name"
//       })
//       .populate("assignedBy", "name")
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ 
//       success: true, 
//       data: tasks 
//     });
//   } catch (error) {
//     console.error("GET_TASKS_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();
    
//     const body = await req.json();
//     const { title, assignedTo, assignedBy, subject, priority, deadline, description } = body;

//     if (!title || !assignedTo || !assignedBy || !subject) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Title, Teacher, Admin, and Subject are required!" 
//       }, { status: 400 });
//     }

//     const newTask = await Task.create({
//       title,
//       description: description || "",
//       assignedTo,
//       assignedBy,
//       subject,
//       priority: priority || "medium",
//       deadline: deadline || null,
//       status: "pending"
//     });
    
//     return NextResponse.json({ 
//       success: true, 
//       message: "Task assigned to teacher successfully",
//       data: newTask 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("POST_TASK_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }































// AI


// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import Teacher from "@/models/Teacher";
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const subject = searchParams.get("subject");

//     let query = {};
//     if (teacherId) query.assignedTo = teacherId;
//     if (subject) query.subject = subject;

//     const tasks = await Task.find(query)
//       .populate({
//         path: "assignedTo",
//         model: Teacher,
//         select: "name email subjects phone",
//         populate: {
//           path: "subjects",
//           model: Subject,
//           select: "name"
//         }
//       })
//       .populate({
//         path: "subject",
//         model: Subject,
//         select: "name"
//       })
//       .populate("assignedBy", "name")
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ 
//       success: true, 
//       data: tasks 
//     });
//   } catch (error) {
//     console.error("GET_TASKS_ERROR:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }






// export async function POST(req) {
//   console.log("=================== [AI TASK PROCESSOR START] ===================");
//   try {
//     await dbConnect();
    
//     const body = await req.json();
//     console.log("📥 RECEIVED BODY DATA:", JSON.stringify(body, null, 2));

//     const { title, assignedTo, assignedBy, subject, priority, deadline, description } = body;

//     if (!title || !assignedTo || !assignedBy || !subject) {
//       console.error("❌ VALIDATION FAILED: Missing required fields");
//       return NextResponse.json({ 
//         success: false, 
//         error: "Title, Teacher, Admin, and Subject are required!" 
//       }, { status: 400 });
//     }

//     const apiKeyRaw = process.env.GROQ_API_KEY;
//     if (!apiKeyRaw) {
//       console.error("❌ CONFIGURATION ERROR: GROQ_API_KEY env variable missing!");
//       return NextResponse.json({ success: false, error: "Groq API key configuration is missing inside environment files." }, { status: 500 });
//     }
//     const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();
//     console.log("🔑 API KEY LOADED CHECK (First 5 chars):", cleanApiKey.substring(0, 5) + "...");

//     const systemPrompt = `You are an advanced academic project manager and educational coordinator assistant.
//     Analyze the provided academic task title and short context.
//     Your job is to return a strict JSON object containing two fields:
//     1. "enhancedDescription": A professional, 2-3 sentence expanded instruction manual/description for the teacher if the provided context is short, otherwise polish the text.
//     2. "subTasks": An array of exactly 3 to 4 logical, direct, clear milestone titles (strings) required to achieve this task successfully.
    
//     Return ONLY raw JSON block matching this structure, no conversational markdown or notes outside JSON:
//     {
//       "enhancedDescription": "string",
//       "subTasks": ["string", "string", "string"]
//     }`;

//     const userPrompt = `Task Title: ${title}\nAdmin Context Note: ${description || "No description provided"}`;

//     console.log("🚀 SENDING REQUEST TO GROQ API...");
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${cleanApiKey}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "llama-3.1-8b-instant",
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt }
//         ],
//         temperature: 0.3,
//         response_format: { type: "json_object" }
//       })
//     });

//     console.log("🛰️ GROQ RESPONSE STATUS:", response.status, response.statusText);

//     let finalDescription = description || "No detailed description loaded.";
//     let generatedSubTasks = [];

//     if (response.ok) {
//       const aiData = await response.json();
//       console.log("📦 AI RAW DATA RECEIVED:", JSON.stringify(aiData, null, 2));
      
//       try {
//         const rawContent = aiData.choices?.[0]?.message?.content || "{}";
//         console.log("🧩 EXTRACTED CONTENT STRING:", rawContent);

//         const parsedJson = JSON.parse(rawContent);
        
//         if (parsedJson.enhancedDescription) {
//           finalDescription = parsedJson.enhancedDescription;
//           console.log("✅ ENHANCED DESCRIPTION GENERATED:", finalDescription);
//         }
//         if (Array.isArray(parsedJson.subTasks)) {
//           generatedSubTasks = parsedJson.subTasks.map(taskText => ({
//             text: taskText,
//             isCompleted: false
//           }));
//           console.log(`✅ SUBTASKS GENERATED (${generatedSubTasks.length} items):`, parsedJson.subTasks);
//         }
//       } catch (parseErr) {
//         console.error("❌ AI_JSON_PARSE_FAILED: Response text JSON parseable nahi tha.", parseErr);
//       }
//     } else {
//       const errorText = await response.text();
//       console.error("❌ GROQ API CALL FAILED:", errorText);
//     }

//     console.log("💾 SAVING TASK INTO MONGODB...");
//     const newTask = await Task.create({
//       title,
//       description: finalDescription,
//       assignedTo,
//       assignedBy,
//       subject,
//       priority: priority || "medium",
//       deadline: deadline || null,
//       status: "pending",
//       subTasks: generatedSubTasks 
//     });
    
//     console.log("🎉 DATABASE SAVE SUCCESSFUL! Task ID:", newTask._id);
//     console.log("=================== [AI TASK PROCESSOR END] ===================");

//     return NextResponse.json({ 
//       success: true, 
//       message: "Task processed by AI and assigned successfully",
//       data: newTask 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("💥 CRITICAL POST_TASK_ERROR:", error);
//     console.log("=================== [AI TASK PROCESSOR CRASHED] ===================");
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const subject = searchParams.get("subject");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (teacherId) query.assignedTo = teacherId;
    if (subject) query.subject = subject;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate({
          path: "assignedTo",
          model: Teacher,
          select: "name email subjects phone",
        })
        .populate({
          path: "subject",
          model: Subject,
          select: "name"
        })
        .populate("assignedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("GET_TASKS_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  console.log("=================== [AI TASK PROCESSOR START] ===================");
  try {
    await dbConnect();
    
    const body = await req.json();
    console.log("📥 RECEIVED BODY DATA:", JSON.stringify(body, null, 2));

    // 👇 FIX: Support both single teacher and multiple teachers
    let { title, assignedTo, teacherIds, assignedBy, subject, priority, deadline, description } = body;
    
    // If teacherIds array is provided, use first one (or handle bulk separately)
    // For now, take first teacher if array is provided
    if (teacherIds && Array.isArray(teacherIds) && teacherIds.length > 0) {
      assignedTo = teacherIds[0];
    }

    if (!title || !assignedTo || !assignedBy || !subject) {
      console.error("❌ VALIDATION FAILED:", { title, assignedTo, assignedBy, subject });
      return NextResponse.json({ 
        success: false, 
        error: "Title, Teacher, Admin, and Subject are required!" 
      }, { status: 400 });
    }

    // AI Enhancement (optional)
    const apiKeyRaw = process.env.GROQ_API_KEY;
    let finalDescription = description || "No detailed description loaded.";
    let generatedSubTasks = [];

    if (apiKeyRaw) {
      const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();
      
      const systemPrompt = `You are an advanced academic project manager and educational coordinator assistant.
      Analyze the provided academic task title and short context.
      Your job is to return a strict JSON object containing two fields:
      1. "enhancedDescription": A professional, 2-3 sentence expanded instruction manual/description.
      2. "subTasks": An array of exactly 3 to 4 logical, clear milestone titles.
      
      Return ONLY raw JSON block:
      {
        "enhancedDescription": "string",
        "subTasks": ["string", "string", "string"]
      }`;

      const userPrompt = `Task Title: ${title}\nAdmin Context: ${description || "No description provided"}`;

      try {
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
            temperature: 0.3,
            response_format: { type: "json_object" }
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const parsedJson = JSON.parse(aiData.choices?.[0]?.message?.content || "{}");
          if (parsedJson.enhancedDescription) finalDescription = parsedJson.enhancedDescription;
          if (Array.isArray(parsedJson.subTasks)) {
            generatedSubTasks = parsedJson.subTasks.map(taskText => ({
              text: taskText,
              isCompleted: false
            }));
          }
        }
      } catch (aiError) {
        console.error("AI Error:", aiError);
      }
    }

    // Create task
    const newTask = await Task.create({
      title,
      description: finalDescription,
      assignedTo,
      assignedBy,
      subject,
      priority: priority || "medium",
      deadline: deadline || null,
      status: "pending",
      subTasks: generatedSubTasks
    });
    
    console.log("🎉 Task created successfully! ID:", newTask._id);
    console.log("=================== [AI TASK PROCESSOR END] ===================");

    return NextResponse.json({ 
      success: true, 
      message: "Task assigned successfully",
      data: newTask 
    }, { status: 201 });

  } catch (error) {
    console.error("💥 POST_TASK_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}