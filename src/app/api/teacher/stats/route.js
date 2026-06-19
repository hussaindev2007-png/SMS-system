import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User"; // Teacher details ke liye
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");

    if (!teacherId) {
      return NextResponse.json({ success: false, error: "Teacher ID missing" }, { status: 400 });
    }

    // 1. Stats nikalna
    const [total, pending, completed] = await Promise.all([
      Task.countDocuments({ assignedTo: teacherId }),
      Task.countDocuments({ assignedTo: teacherId, status: "pending" }),
      Task.countDocuments({ assignedTo: teacherId, status: "completed" })
    ]);

    // 2. Teacher ki details nikalna (Subject ke sath)
    // Hum User model se subject utha rahe hain jaisa humne pehle discuss kiya tha
    const teacherInfo = await User.findById(teacherId).select("name subject email");

    return NextResponse.json({ 
      success: true, 
      stats: { 
        total, 
        pending, 
        completed,
        // Yahan subject aur details include kar di hain
        teacherName: teacherInfo?.name,
        teacherSubject: teacherInfo?.subject || ["GENERAL"],
        teacherEmail: teacherInfo?.email
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}