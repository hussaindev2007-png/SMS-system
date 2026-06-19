// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   await dbConnect();
//   try {
//     // Next.js 15 fix: params ko await karna lazmi hai
//     const { id } = await params; 

//     if (!id || id === "undefined") {
//       return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
//     }

//     const student = await User.findById(id).select("name rollNo className section");
    
//     if (!student) {
//       return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       data: student
//     });
//   } catch (error) {
//     console.error("Card API Error:", error);
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }










































import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    // Next.js 15 fix: params dynamic resolution safely awaited
    const { id } = await params; 

    if (!id || id === "undefined") {
      return NextResponse.json({ success: false, message: "Invalid cluster node ID" }, { status: 400 });
    }

    // Role verification enforce kar di taake sirf student record hi optimize ho
    const student = await User.findOne({ _id: id, role: "student" }).select(
      "name rollNo className section isOnline"
    );
    
    if (!student) {
      return NextResponse.json({ success: false, message: "Student record node not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error("Card API Disruption:", error);
    return NextResponse.json({ success: false, message: "Internal record mapping error" }, { status: 500 });
  }
}