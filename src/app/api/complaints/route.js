import dbConnect from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { studentId, subject, message, category } = body;

    // 1. Basic Validation
    if (!studentId || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" }, 
        { status: 400 }
      );
    }

    // 2. Student ID Validation (ObjectId format check)
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Student ID format" }, 
        { status: 400 }
      );
    }

    // 3. Create Complaint
    const newComplaint = await Complaint.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      subject,
      message,
      category: category || "Other",
      status: "pending"
    });

    return NextResponse.json(
      { success: true, data: newComplaint }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();

   
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    
    
    if (studentId) {
      const isValid = mongoose.Types.ObjectId.isValid(studentId);
      console.log("Is MongoDB ID Valid?:", isValid); // Check karein format sahi hai ya nahi
    }
   
    if (!studentId) {
       return NextResponse.json({ success: false, message: "Student ID missing in URL" }, { status: 400 });
    }

    
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ success: false, message: "Invalid Student ID format" }, { status: 400 });
    }

   
    const complaints = await Complaint.find({ 
      studentId: new mongoose.Types.ObjectId(studentId) 
    }).sort({ createdAt: -1 });

    console.log(`Found ${complaints.length} complaints for this student.`);

    return NextResponse.json({ success: true, data: complaints });

  } catch (error) {
    console.error("BACKEND ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}