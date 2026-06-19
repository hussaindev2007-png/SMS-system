// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb.js"; // Ensure path is correct (lib/dbConnect or lib/mongodb)
// import Student from "@/models/Student";

// // UPDATE Student
// export async function PUT(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params; 
//     const body = await req.json();

//     const updated = await Student.findByIdAndUpdate(id, body, { new: true });
    
//     if (!updated) {
//       return NextResponse.json({ message: "Student not found" }, { status: 404 });
//     }
    
//     return NextResponse.json(updated);
//   } catch (err) {
//     console.error("Update Error:", err);
//     return NextResponse.json({ message: "Update failed" }, { status: 500 });
//   }
// }

// // DELETE Student
// export async function DELETE(req, { params }) {
//   await dbConnect();
//   try {
//     const { id } = await params; // Next.js 15+ needs await for params

//     const deleted = await Student.findByIdAndDelete(id);
    
//     if (!deleted) {
//       return NextResponse.json({ message: "Student not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Student deleted" });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json({ message: "Delete failed" }, { status: 500 });
//   }
// }













import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import User from "@/models/User";
import bcrypt from "bcryptjs";

// UPDATE Student
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await req.json();

    // 1. Mapping as per your Schema (className is the correct field)
    const updateData = {
      name: body.name,
      rollNo: body.rollNo,
      // FIX: body se studentClass ya className jo bhi aaye, usay 'className' mein map karein
      className: body.className || body.studentClass, 
      section: body.section || "A",
    };

    // 2. Password hashing (Security)
    if (body.password && body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    // 3. Update in User collection
    const updated = await User.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });
    
    if (!updated) {
      return NextResponse.json({ message: "Student record not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    if (err.code === 11000) {
      return NextResponse.json({ message: "Roll Number duplicate error!" }, { status: 400 });
    }
    return NextResponse.json({ message: err.message || "Update failed" }, { status: 500 });
  }
}

// DELETE Student
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;

    // Direct id se delete
    const deleted = await User.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}