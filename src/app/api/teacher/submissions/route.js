// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import { NextResponse } from "next/server";

// // 1. Saari submissions mangwane ke liye
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const assignmentId = searchParams.get("assignmentId");

//     const query = assignmentId ? { assignmentId } : {};
//     const data = await Submission.find(query).sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
// // /api/admin/submissions/route.js

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     // Ab hum status (Approved/Rejected) aur feedback bhejenge
//     const { submissionId, feedback, status } = await req.json();

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { 
//         feedback, 
//         status: status || "reviewed", // Teacher toggle karegi: Approved ya Rejected
//       },
//       { new: true }
//     );

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }










// id




// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment"; // ✅ Assignment model import karein
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId"); // ✅ Teacher ki ID mangwaein
//     const assignmentId = searchParams.get("assignmentId");

//     let query = {};

//     // 1. Agar specific assignmentId hye toh seedha wahi uthao
//     if (assignmentId) {
//       query = { assignmentId };
//     } 
//     // 2. Agar assignmentId nahi hye lekin teacherId hye, toh filter lagao
//     else if (teacherId) {
//       // Pehle is teacher ke saare assignments ki IDs nikalon
//       const teacherAssignments = await Assignment.find({ teacherId }).select("_id");
//       const assignmentIds = teacherAssignments.map(asgn => asgn._id);
      
//       // Sirf wahi submissions jo is teacher ke assignments ki hain
//       query = { assignmentId: { $in: assignmentIds } };
//     }

//     const data = await Submission.find(query)
//       .populate("assignmentId", "title targetClass") // Detail ke liye populate karein
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { submissionId, feedback, status } = await req.json();

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { 
//         feedback, 
//         status: status || "reviewed", 
//       },
//       { new: true }
//     );

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
























// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; // ✅ Iska import hona zaroori hye
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const assignmentId = searchParams.get("assignmentId");

//     let query = {};

//     if (assignmentId) {
//       query = { assignmentId };
//     } 
//     else if (teacherId) {
//       const teacherAssignments = await Assignment.find({ teacherId }).select("_id");
//       const assignmentIds = teacherAssignments.map(asgn => asgn._id);
//       query = { assignmentId: { $in: assignmentIds } };
//     }

//     // ✅ Final Updated Query
//     const data = await Submission.find(query)
//       .populate("assignmentId", "title targetClass") 
//       .populate({
//         path: "studentId", 
//         model: "User", // ✅ Model ka naam string mein dein taake sync rahe
//         select: "rollNo className section name", 
//       })
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { submissionId, feedback, status } = await req.json();

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { 
//         feedback, 
//         status: status || "reviewed", 
//       },
//       { new: true }
//     ).populate({
//       path: "studentId",
//       model: "User",
//       select: "rollNo className name"
//     });

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }










// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const assignmentId = searchParams.get("assignmentId");
//     const isArchived = searchParams.get("archived") === "true";

//     // ✅ MONTH LOGIC: Is mahine ki pehli tareekh nikalna
//     const now = new Date();
//     const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     let query = {};

//     // 1. Teacher ya Assignment filter
//     if (assignmentId) {
//       query.assignmentId = assignmentId;
//     } 
//     else if (teacherId && teacherId !== "undefined") {
//       const teacherAssignments = await Assignment.find({ teacherId }).select("_id");
//       const assignmentIds = teacherAssignments.map(asgn => asgn._id);
//       query.assignmentId = { $in: assignmentIds };
//     } else {
//       return NextResponse.json({ success: true, data: [] });
//     }

//     // 2. ✅ MONTH BASED ARCHIVE FILTER
//     if (isArchived) {
//       // Jo is mahine se pehle ka data hye (Purane mahine)
//       query.createdAt = { $lt: startOfCurrentMonth };
//     } else {
//       // Jo is mahine ki 1st tareekh se ab tak ka data hye (Current Month)
//       query.createdAt = { $gte: startOfCurrentMonth };
//     }

//     const data = await Submission.find(query)
//       .populate("assignmentId", "title targetClass") 
//       .populate({
//         path: "studentId", 
//         model: "User", 
//         select: "rollNo className section name", 
//       })
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, count: data.length, data });
//   } catch (error) {
//     console.error("Submission GET Error:", error.message);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // PATCH function same rahe ga...
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { submissionId, feedback, status } = await req.json();
//     if (!submissionId) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { feedback, status: status || "reviewed" },
//       { new: true }
//     ).populate({ path: "studentId", model: "User", select: "rollNo className name" });

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
















// sub
























// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const assignmentId = searchParams.get("assignmentId");
//     const isArchived = searchParams.get("archived") === "true";

//     const now = new Date();
//     const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     let query = {};

//     if (assignmentId) {
//       query.assignmentId = assignmentId;
//     } 
//     else if (teacherId && teacherId !== "undefined") {
//       const teacherAssignments = await Assignment.find({ teacherId }).select("_id");
//       const assignmentIds = teacherAssignments.map(asgn => asgn._id);
//       query.assignmentId = { $in: assignmentIds };
//     } else {
//       return NextResponse.json({ success: true, data: [] });
//     }

//     if (isArchived) {
//       query.createdAt = { $lt: startOfCurrentMonth };
//     } else {
//       query.createdAt = { $gte: startOfCurrentMonth };
//     }

//     const data = await Submission.find(query)
//       // ✅ FIX: "subject" field ko yahan add kiya hye taake Subject show ho
//       .populate("assignmentId", "title targetClass subject") 
//       .populate({
//         path: "studentId", 
//         model: "User", 
//         select: "rollNo className section name", 
//       })
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, count: data.length, data });
//   } catch (error) {
//     console.error("Submission GET Error:", error.message);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { submissionId, feedback, status } = await req.json();
//     if (!submissionId) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { feedback, status: status || "reviewed" },
//       { new: true }
//     )
//     // ✅ FIX: PATCH mein bhi assignment detail populate kar dein
//     .populate("assignmentId", "title subject")
//     .populate({ path: "studentId", model: "User", select: "rollNo className name" });

//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }













































// import dbConnect from "@/lib/mongodb";
// import Submission from "@/models/Submission";
// import Assignment from "@/models/Assignment";
// import User from "@/models/User"; 
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("teacherId");
//     const assignmentId = searchParams.get("assignmentId");
//     const isArchived = searchParams.get("archived") === "true";

//     const now = new Date();
//     const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//     let query = {};

//     if (assignmentId) {
//       query.assignmentId = assignmentId;
//     } 
//     else if (teacherId && teacherId !== "undefined") {
//       const teacherAssignments = await Assignment.find({ teacherId }).select("_id");
//       const assignmentIds = teacherAssignments.map(asgn => asgn._id);
//       query.assignmentId = { $in: assignmentIds };
//     } else {
//       return NextResponse.json({ success: true, data: [] });
//     }

//     if (isArchived) {
//       query.createdAt = { $lt: startOfCurrentMonth };
//     } else {
//       query.createdAt = { $gte: startOfCurrentMonth };
//     }

//     const data = await Submission.find(query)
//       .populate("assignmentId", "title targetClass subject subjectName") // 👈 Added subjectName
//       .populate({
//         path: "studentId", 
//         model: "User", 
//         select: "rollNo className section name", 
//       })
//       .sort({ createdAt: -1 });

//     // Process data to add subject name
//     const processedData = data.map(sub => {
//       let subjectDisplay = "Unknown";
//       if (sub.assignmentId) {
//         // Use subjectName if available, otherwise fallback to subject
//         subjectDisplay = sub.assignmentId.subjectName || sub.assignmentId.subject || "Unknown";
//       }
      
//       return {
//         ...sub.toObject(),
//         assignmentId: {
//           ...sub.assignmentId?.toObject(),
//           subjectDisplay: subjectDisplay
//         }
//       };
//     });

//     return NextResponse.json({ success: true, count: processedData.length, data: processedData });
//   } catch (error) {
//     console.error("Submission GET Error:", error.message);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { submissionId, feedback, status } = await req.json();
//     if (!submissionId) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { feedback, status: status || "reviewed" },
//       { new: true }
//     )
//     .populate("assignmentId", "title subject subjectName")
//     .populate({ path: "studentId", model: "User", select: "rollNo className name" });

//     // Process subject name
//     let subjectDisplay = "Unknown";
//     if (updated?.assignmentId) {
//       subjectDisplay = updated.assignmentId.subjectName || updated.assignmentId.subject || "Unknown";
//     }

//     const processedUpdated = {
//       ...updated.toObject(),
//       assignmentId: {
//         ...updated.assignmentId?.toObject(),
//         subjectDisplay: subjectDisplay
//       }
//     };

//     return NextResponse.json({ success: true, data: processedUpdated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }


















import dbConnect from "@/lib/mongodb";
import Submission from "@/models/Submission";
import Assignment from "@/models/Assignment";
import User from "@/models/User"; 
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const assignmentId = searchParams.get("assignmentId");
    const isArchived = searchParams.get("archived") === "true";

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let query = {};

    if (assignmentId) {
      query.assignmentId = assignmentId;
    } 
    else if (teacherId && teacherId !== "undefined") {
      const teacherAssignments = await Assignment.find({ teacherId }).select("_id");
      const assignmentIds = teacherAssignments.map(asgn => asgn._id);
      query.assignmentId = { $in: assignmentIds };
    } else {
      return NextResponse.json({ success: true, data: [] });
    }

    if (isArchived) {
      query.createdAt = { $lt: startOfCurrentMonth };
    } else {
      query.createdAt = { $gte: startOfCurrentMonth };
    }

    const data = await Submission.find(query)
      .populate("assignmentId", "title targetClass subject subjectName")
      .populate({
        path: "studentId", 
        model: "User", 
        select: "rollNo className section name", 
      })
      .sort({ createdAt: -1 });

    // Process data to add subject name and include notes
    const processedData = data.map(sub => {
      let subjectDisplay = "Unknown";
      if (sub.assignmentId) {
        subjectDisplay = sub.assignmentId.subjectName || sub.assignmentId.subject || "Unknown";
      }
      
      return {
        ...sub.toObject(),
        assignmentId: {
          ...sub.assignmentId?.toObject(),
          subjectDisplay: subjectDisplay
        },
        notes: sub.notes || "",  // 👈 Ensure notes are included
        feedback: sub.feedback || ""  // 👈 Ensure feedback is included
      };
    });

    return NextResponse.json({ success: true, count: processedData.length, data: processedData });
  } catch (error) {
    console.error("Submission GET Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { submissionId, feedback, status } = await req.json();
//     if (!submissionId) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

//     const updated = await Submission.findByIdAndUpdate(
//       submissionId,
//       { feedback, status: status || "reviewed" },
//       { new: true }
//     )
//     .populate("assignmentId", "title subject subjectName")
//     .populate({ path: "studentId", model: "User", select: "rollNo className name" });

//     // Process subject name
//     let subjectDisplay = "Unknown";
//     if (updated?.assignmentId) {
//       subjectDisplay = updated.assignmentId.subjectName || updated.assignmentId.subject || "Unknown";
//     }

//     const processedUpdated = {
//       ...updated.toObject(),
//       assignmentId: {
//         ...updated.assignmentId?.toObject(),
//         subjectDisplay: subjectDisplay
//       },
//       notes: updated?.notes || "",  // 👈 Include notes
//       feedback: updated?.feedback || ""  // 👈 Include feedback
//     };

//     return NextResponse.json({ success: true, data: processedUpdated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }













export async function PATCH(req) {
  await dbConnect();
  try {
    const { submissionId, feedback, status } = await req.json();
    if (!submissionId) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    // ✅ Map 'reviewed' to 'approved' if needed
    let finalStatus = status;
    if (status === "reviewed") {
      finalStatus = "approved";
    }

    const updated = await Submission.findByIdAndUpdate(
      submissionId,
      { feedback, status: finalStatus },
      { new: true }
    )
    .populate("assignmentId", "title subject subjectName")
    .populate({ path: "studentId", model: "User", select: "rollNo className name" });

    // Process subject name
    let subjectDisplay = "Unknown";
    if (updated?.assignmentId) {
      subjectDisplay = updated.assignmentId.subjectName || updated.assignmentId.subject || "Unknown";
    }

    const processedUpdated = {
      ...updated.toObject(),
      assignmentId: {
        ...updated.assignmentId?.toObject(),
        subjectDisplay: subjectDisplay
      },
      notes: updated?.notes || "",
      feedback: updated?.feedback || ""
    };

    return NextResponse.json({ success: true, data: processedUpdated });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}