// import dbConnect from "@/lib/mongodb";
// import Assignment from "@/models/Assignment";
// import { NextResponse } from "next/server";

// // ✅ UPDATE Assignment
// export async function PUT(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params; // Next.js 15+ mein await zaroori hye
//     const body = await req.json();

//     let cleanClass = body.targetClass;
//     if (cleanClass) {
//       cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
//     }

//     const updatedAssignment = await Assignment.findByIdAndUpdate(
//       id,
//       { ...body, targetClass: cleanClass },
//       { new: true }
//     );

//     if (!updatedAssignment) {
//       return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updatedAssignment });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }


import dbConnect from "@/lib/mongodb";
import Assignment from "@/models/Assignment";
import { NextResponse } from "next/server";

// ✅ UPDATE Assignment
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params; 
    const body = await req.json();

    // 1. Target Class cleaning logic
    let cleanClass = body.targetClass;
    if (cleanClass) {
      cleanClass = cleanClass.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();
    }

    // 2. Status Reset Logic: Agar date extend ho rahi hye to status update karein
    if (body.dueDate) {
      const now = new Date();
      const newDueDate = new Date(body.dueDate);

      if (newDueDate > now) {
        body.status = "active"; // Nayi date future ki hye toh status active kar do
      } else {
        body.status = "expired"; // Agar abhi bhi purani date hye toh expired hi rakho
      }
    }

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { ...body, targetClass: cleanClass },
      { new: true, runValidators: true }
    );

    if (!updatedAssignment) {
      return NextResponse.json({ success: false, error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedAssignment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// ✅ DELETE Assignment
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;

    const deletedAssignment = await Assignment.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return NextResponse.json({ success: false, error: "Assignment already deleted or not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

















// // ✅ DELETE Assignment
// export async function DELETE(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params;

//     const deletedAssignment = await Assignment.findByIdAndDelete(id);

//     if (!deletedAssignment) {
//       return NextResponse.json({ success: false, error: "Assignment already deleted or not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: "Assignment deleted successfully" });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message });
//   }
// }