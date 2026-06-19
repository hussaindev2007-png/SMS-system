// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import { NextResponse } from "next/server";

// // GET: Teacher apne tasks dekhega
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("id");

//     if (!teacherId) {
//       return NextResponse.json({ success: false, error: "Teacher ID missing" }, { status: 400 });
//     }

//     // Sirf us teacher ke tasks nikalna aur Admin ka naam populate karna
//     const tasks = await Task.find({ assignedTo: teacherId })
//       .populate("assignedBy", "name")
//       .sort({ deadline: 1 }); // Jo deadline pehle hai wo upar aaye

//     return NextResponse.json({ success: true, data: tasks });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // PATCH: Teacher task ko 'completed' mark karega
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { taskId, status } = await req.json();

//     if (!taskId || !status) {
//       return NextResponse.json({ success: false, error: "ID or Status missing" }, { status: 400 });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       taskId,
//       { status },
//       { new: true }
//     );

//     return NextResponse.json({ success: true, data: updatedTask });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }










// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import { NextResponse } from "next/server";

// // GET: Teacher apne tasks dekhega (With Subject)
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("id");

//     if (!teacherId) {
//       return NextResponse.json({ success: false, error: "Teacher ID missing" }, { status: 400 });
//     }

//     // 1. assignedBy se Admin ka naam nikalna
//     // 2. assignedTo se Teacher ka naam aur SUBJECT nikalna (agar subject teacher model me hye)
//     const tasks = await Task.find({ assignedTo: teacherId })
//       .populate("assignedBy", "name") 
//       .populate("assignedTo", "name subject") // Teacher ka subject yahan se aye ga
//       .sort({ deadline: 1 });

//     return NextResponse.json({ success: true, data: tasks });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // PATCH: Status update (Baqi logic same hye)
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { taskId, status } = await req.json();

//     if (!taskId || !status) {
//       return NextResponse.json({ success: false, error: "ID or Status missing" }, { status: 400 });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       taskId,
//       { status },
//       { new: true }
//     ).populate("assignedTo", "subject"); // Update ke baad bhi subject mil jaye ga

//     return NextResponse.json({ success: true, data: updatedTask });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

















// import dbConnect from "@/lib/mongodb";
// import Task from "@/models/Task";
// import { NextResponse } from "next/server";

// // GET: Teacher apne tasks dekhega (With Subject)
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const teacherId = searchParams.get("id");

//     if (!teacherId) {
//       return NextResponse.json({ success: false, error: "Teacher ID missing" }, { status: 400 });
//     }

//     // 1. assignedBy se Admin ka naam nikalna
//     // 2. assignedTo se Teacher ka naam aur SUBJECT nikalna (agar subject teacher model me hye)
//     const tasks = await Task.find({ assignedTo: teacherId })
//       .populate("assignedBy", "name") 
//       .populate("assignedTo", "name subject") // Teacher ka subject yahan se aye ga
//       .sort({ deadline: 1 });

//     return NextResponse.json({ success: true, data: tasks });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

// // PATCH: Status update (Baqi logic same hye)
// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { taskId, status } = await req.json();

//     if (!taskId || !status) {
//       return NextResponse.json({ success: false, error: "ID or Status missing" }, { status: 400 });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       taskId,
//       { status },
//       { new: true }
//     ).populate("assignedTo", "subject"); // Update ke baad bhi subject mil jaye ga

//     return NextResponse.json({ success: true, data: updatedTask });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }






































































import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");

    if (!teacherId) {
      return NextResponse.json({ success: false, error: "Teacher ID missing" }, { status: 400 });
    }

    const tasks = await Task.find({ assignedTo: teacherId })
      .populate("assignedBy", "name") 
      .populate({
        path: "subject",
        model: Subject,
        select: "name"
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  await dbConnect();
  try {
    const { taskId, status, subTasks } = await req.json();

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Task ID missing" }, { status: 400 });
    }

    let updateFields = {};
    if (status) updateFields.status = status;
    if (subTasks) updateFields.subTasks = subTasks;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateFields,
      { new: true }
    ).populate({
      path: "subject",
      model: Subject,
      select: "name"
    });

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}