import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import Teacher from "@/models/Teacher"; 
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("id");

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return NextResponse.json({ success: false, error: "Invalid ID Format" }, { status: 400 });
    }

    // CRITICAL: ID ko ObjectId mein convert karna zaroori hai
    const queryId = new mongoose.Types.ObjectId(teacherId);

    // Stats nikalna (Task schema ke statuses ke mutabiq)
    const [total, pending, completed, teacherInfo] = await Promise.all([
      Task.countDocuments({ assignedTo: queryId }),
      // Pending aur In-progress dono ko "In Progress" mein count kar rahe hain
      Task.countDocuments({ assignedTo: queryId, status: { $in: ["pending", "in-progress"] } }),
      Task.countDocuments({ assignedTo: queryId, status: "completed" }),
      Teacher.findById(queryId).select("name subject email")
    ]);

    return NextResponse.json({ 
      success: true, 
      stats: { 
        total, 
        pending, 
        completed,
        teacherName: teacherInfo?.name,
        teacherSubject: teacherInfo?.subject,
      } 
    });
  } catch (error) {
    console.error("STATS_API_ERROR:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}