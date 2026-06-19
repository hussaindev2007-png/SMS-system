// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const { teacherIds, title, description, deadline, priority, assignedBy } = await req.json();

//     if (!teacherIds || !Array.isArray(teacherIds) || teacherIds.length === 0) {
//       return NextResponse.json({ success: false, error: "No teachers selected!" }, { status: 400 });
//     }

//     // Har teacher ke liye alag task create hoga
//     const tasksToCreate = teacherIds.map((id) => ({
//       title,
//       description,
//       deadline,
//       priority,
//       assignedBy,
//       assignedTo: id,
//     }));

//     await Task.insertMany(tasksToCreate);

//     return NextResponse.json({ success: true, message: `${tasksToCreate.length} tasks assigned!` });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }















// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import Teacher from "@/models/Teacher"; // Model confirmation ke liye
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
    
//     // Destructuring with extra safety
//     const body = await req.json();
//     const { teacherIds, title, description, deadline, priority, assignedBy, subject } = body;

//     // --- 1. VALIDATIONS ---
//     if (!teacherIds || !Array.isArray(teacherIds) || teacherIds.length === 0) {
//       return NextResponse.json({ success: false, error: "Please select at least one teacher!" }, { status: 400 });
//     }

//     if (!title || !subject || !assignedBy) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Title, Subject, and Admin ID are mandatory!" 
//       }, { status: 400 });
//     }

//     // --- 2. DATA PREPARATION ---
//     // Har teacher ke liye naya task object create karna
//     const tasksToCreate = teacherIds.map((id) => ({
//       title,
//       description: description || "",
//       deadline: deadline || null,
//       priority: priority || "medium",
//       assignedBy, // Admin ID
//       assignedTo: id, // Teacher ID (from Teacher Model)
//       subject, 
//       status: "pending"
//     }));

//     // --- 3. DATABASE OPERATION ---
//     // insertMany use karna best practice hye jab multiple records save karne hon
//     const createdTasks = await Task.insertMany(tasksToCreate);

//     return NextResponse.json({ 
//       success: true, 
//       message: `Successfully assigned tasks to ${createdTasks.length} teachers!`,
//       count: createdTasks.length
//     }, { status: 201 });

//   } catch (error) {
//     console.error("BULK_TASK_ERROR:", error);
    
//     // Agar validation fail ho (jaise invalid ID format)
//     if (error.name === "ValidationError") {
//       return NextResponse.json({ success: false, error: "Data validation failed. Check IDs or Fields." }, { status: 400 });
//     }

//     return NextResponse.json({ 
//       success: false, 
//       error: "Failed to create bulk tasks",
//       details: error.message 
//     }, { status: 500 });
//   }
// }
















// AI

import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Teacher from "@/models/Teacher"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { teacherIds, title, description, deadline, priority, assignedBy, subject } = body;

    // --- 1. VALIDATIONS ---
    if (!teacherIds || !Array.isArray(teacherIds) || teacherIds.length === 0) {
      return NextResponse.json({ success: false, error: "Please select at least one teacher!" }, { status: 400 });
    }

    if (!title || !subject || !assignedBy) {
      return NextResponse.json({ 
        success: false, 
        error: "Title, Subject, and Admin ID are mandatory!" 
      }, { status: 400 });
    }

    // --- 2. AI INTEGRATION (GROQ) ---
    const apiKeyRaw = process.env.GROQ_API_KEY;
    if (!apiKeyRaw) {
      return NextResponse.json({ success: false, error: "Groq API key configuration is missing inside environment files." }, { status: 500 });
    }
    const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();

    const systemPrompt = `You are an advanced academic project manager and educational coordinator assistant.
    Analyze the provided academic task title and short context.
    Your job is to return a strict JSON object containing two fields:
    1. "enhancedDescription": A professional, 2-3 sentence expanded instruction manual/description for the teacher if the provided context is short, otherwise polish the text.
    2. "subTasks": An array of exactly 3 to 4 logical, direct, clear milestone titles (strings) required to achieve this task successfully.
    
    Return ONLY raw JSON block matching this structure, no conversational markdown or notes outside JSON:
    {
      "enhancedDescription": "string",
      "subTasks": ["string", "string", "string"]
    }`;

    const userPrompt = `Task Title: ${title}\nAdmin Context Note: ${description || "No description provided"}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    let finalDescription = description || "No detailed description loaded.";
    let generatedSubTasks = [];

    if (response.ok) {
      const aiData = await response.json();
      try {
        const parsedJson = JSON.parse(aiData.choices?.[0]?.message?.content || "{}");
        if (parsedJson.enhancedDescription) {
          finalDescription = parsedJson.enhancedDescription;
        }
        if (Array.isArray(parsedJson.subTasks)) {
          generatedSubTasks = parsedJson.subTasks.map(taskText => ({
            text: taskText,
            isCompleted: false
          }));
        }
      } catch (parseErr) {
        console.error("AI_JSON_PARSE_FAILED_IN_BULK:", parseErr);
      }
    }

    // --- 3. DATA PREPARATION ---
    // AI ka generated data ab har single teacher ke document me save hoga
    const tasksToCreate = teacherIds.map((id) => ({
      title,
      description: finalDescription,
      deadline: deadline || null,
      priority: priority || "medium",
      assignedBy, 
      assignedTo: id, 
      subject, 
      status: "pending",
      subTasks: generatedSubTasks
    }));

    // --- 4. DATABASE OPERATION ---
    const createdTasks = await Task.insertMany(tasksToCreate);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully assigned AI-enhanced tasks to ${createdTasks.length} teachers!`,
      count: createdTasks.length
    }, { status: 201 });

  } catch (error) {
    console.error("BULK_TASK_ERROR:", error);
    
    if (error.name === "ValidationError") {
      return NextResponse.json({ success: false, error: "Data validation failed. Check IDs or Fields." }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Failed to create bulk tasks",
      details: error.message 
    }, { status: 500 });
  }
}