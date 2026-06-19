
// import dbConnect from "@/lib/mongodb";
// import Complaint from "@/models/Complaint";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const totalComplaints = await Complaint.countDocuments({});

//     const complaints = await Complaint.find({})
//       .populate("studentId", "name rollNo")
//       .sort({ createdAt: -1 }) 
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({ 
//       success: true, 
//       data: complaints,
//       pagination: {
//         total: totalComplaints,
//         page: page,
//         pages: Math.ceil(totalComplaints / limit) || 1
//       }
//     }, { status: 200 });

//   } catch (error) {
    
//     return NextResponse.json({ 
//       success: false, 
//       message: "Database fetch operations failed.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { complaintId, status, adminRemark } = body;

//     const validStatuses = ["pending", "in-progress", "resolved"];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json({ success: false, message: "Invalid status format provided." }, { status: 400 });
//     }

//     const updated = await Complaint.findByIdAndUpdate(
//       complaintId,
//       { status, adminRemark },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ success: false, message: "Complaint record not found." }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updated }, { status: 200 });

//   } catch (error) {
    
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to update complaint record.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const body = await req.json().catch(() => ({}));
//     const subject = body.subject || "No Subject";
//     const message = body.message || "";

//     if (!message || !message.trim()) {
//       return NextResponse.json({ success: false, message: "Complaint message text is missing or empty." }, { status: 400 });
//     }

//     const apiKeyRaw = process.env.GROQ_API_KEY;
//     if (!apiKeyRaw) {
//       return NextResponse.json({ success: false, message: "Groq API key configuration is missing inside environment files." }, { status: 500 });
//     }
    
//     const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();

//     // Yahan prompt ko Roman Urdu se clear professional English mein change kar diya hye
//     const systemPrompt = `You are a highly professional, polite, and empathetic School Principal and Support Assistant. 
//     Analyze the parent's complaint and draft a beautifully structured, reassuring response in professional English.
//     The tone must be apologetic yet authoritative, assuring the parent that their concern is our highest priority and an investigation will be launched immediately.
//     Keep the answer direct and complete under 3-4 sentences. Do not include any extra introductory markdown or notes, just write the direct response message.`;

//     const userPrompt = `Complaint Subject: ${subject.trim()}\nComplaint Message: ${message.trim()}`;

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
//         temperature: 0.5,
//         max_tokens: 300
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
     
//       return NextResponse.json({ 
//         success: false, 
//         message: "Failed to communicate with AI engine.", 
//         error: errorData 
//       }, { status: response.status });
//     }

//     const aiData = await response.json();
//     const suggestedText = aiData.choices?.[0]?.message?.content || "We will look into this matter and take immediate action.";

//     return NextResponse.json({ success: true, suggestion: suggestedText }, { status: 200 });

//   } catch (error) {
    
//     return NextResponse.json({ 
//       success: false, 
//       message: "Internal processing error in AI component.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }





// import dbConnect from "@/lib/mongodb";
// import Complaint from "@/models/Complaint";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
    
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 10;
//     const skip = (page - 1) * limit;

//     const totalComplaints = await Complaint.countDocuments({});

//     const complaints = await Complaint.find({})
//       .populate("studentId", "name rollNo")
//       .sort({ createdAt: -1 }) 
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({ 
//       success: true, 
//       data: complaints,
//       pagination: {
//         total: totalComplaints,
//         page: page,
//         pages: Math.ceil(totalComplaints / limit) || 1
//       }
//     }, { status: 200 });

//   } catch (error) {
   
//     return NextResponse.json({ 
//       success: false, 
//       message: "Database fetch operations failed.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { complaintId, status, adminRemark } = body;

//     const validStatuses = ["pending", "in-progress", "resolved"];
//     if (!validStatuses.includes(status)) {
//       return NextResponse.json({ success: false, message: "Invalid status format provided." }, { status: 400 });
//     }

//     const updated = await Complaint.findByIdAndUpdate(
//       complaintId,
//       { status, adminRemark },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return NextResponse.json({ success: false, message: "Complaint record not found." }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updated }, { status: 200 });

//   } catch (error) {
    
//     return NextResponse.json({ 
//       success: false, 
//       message: "Failed to update complaint record.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const body = await req.json().catch(() => ({}));
//     const subject = body.subject || "No Subject";
//     const message = body.message || "";

//     if (!message || !message.trim()) {
//       return NextResponse.json({ success: false, message: "Complaint message text is missing or empty." }, { status: 400 });
//     }

//     const apiKeyRaw = process.env.GROQ_API_KEY;
//     if (!apiKeyRaw) {
//       return NextResponse.json({ success: false, message: "Groq API key configuration is missing inside environment files." }, { status: 500 });
//     }
    
//     const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();

//     // System prompt ko update kiya hye taake signature me direct 'Admin' likha aaye
//     const systemPrompt = `You are a highly professional, polite, and empathetic School Principal and Support Assistant. 
//     Analyze the parent's complaint and draft a beautifully structured, reassuring response in professional English.
//     The tone must be apologetic yet authoritative, assuring the parent that their concern is our highest priority and an investigation will be launched immediately.
//     Keep the answer direct and complete under 3-4 sentences. At the end of the message, sign off exactly as 'Sincerely,\nAdmin\nSchool Principal and Support Assistant'. Do not use placeholders like '[Your Name]'.`;

//     const userPrompt = `Complaint Subject: ${subject.trim()}\nComplaint Message: ${message.trim()}`;

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
//         temperature: 0.5,
//         max_tokens: 300
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
      
//       return NextResponse.json({ 
//         success: false, 
//         message: "Failed to communicate with AI engine.", 
//         error: errorData 
//       }, { status: response.status });
//     }

//     const aiData = await response.json();
//     const suggestedText = aiData.choices?.[0]?.message?.content || "We will look into this matter and take immediate action.";

//     return NextResponse.json({ success: true, suggestion: suggestedText }, { status: 200 });

//   } catch (error) {
   
//     return NextResponse.json({ 
//       success: false, 
//       message: "Internal processing error in AI component.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }













































import dbConnect from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const totalComplaints = await Complaint.countDocuments({});

    const complaints = await Complaint.find({})
      .populate({
        path: "studentId",
        model: User,
        select: "name rollNo"
      })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ 
      success: true, 
      data: complaints,
      pagination: {
        total: totalComplaints,
        page: page,
        pages: Math.ceil(totalComplaints / limit) || 1
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Database fetch operations failed.", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { complaintId, status, adminRemark } = body;

    const validStatuses = ["pending", "in-progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status format provided." }, { status: 400 });
    }

    const updated = await Complaint.findByIdAndUpdate(
      complaintId,
      { status, adminRemark },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Complaint record not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update complaint record.", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const subject = body.subject || "No Subject";
    const message = body.message || "";

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, message: "Complaint message text is missing or empty." }, { status: 400 });
    }

    const apiKeyRaw = process.env.GROQ_API_KEY;
    if (!apiKeyRaw) {
      return NextResponse.json({ success: false, message: "Groq API key configuration is missing inside environment files." }, { status: 500 });
    }
    
    const cleanApiKey = apiKeyRaw.replace(/["']/g, "").trim();

    const systemPrompt = `You are a highly professional, polite, and empathetic School Principal and Support Assistant. 
    Analyze the parent's complaint and draft a beautifully structured, reassuring response in professional English.
    The tone must be apologetic yet authoritative, assuring the parent that their concern is our highest priority and an investigation will be launched immediately.
    Keep the answer direct and complete under 3-4 sentences. At the end of the message, sign off exactly as 'Sincerely,\nAdmin\nSchool Principal and Support Assistant'. Do not use placeholders like '[Your Name]'.`;

    const userPrompt = `Complaint Subject: ${subject.trim()}\nComplaint Message: ${message.trim()}`;

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
        temperature: 0.5,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ 
        success: false, 
        message: "Failed to communicate with AI engine.", 
        error: errorData 
      }, { status: response.status });
    }

    const aiData = await response.json();
    const suggestedText = aiData.choices?.[0]?.message?.content || "We will look into this matter and take immediate action.";

    return NextResponse.json({ success: true, suggestion: suggestedText }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Internal processing error in AI component.", 
      error: error.message 
    }, { status: 500 });
  }
}