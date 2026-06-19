import dbConnect from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

// --- PUT: Update Subject ---
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Boss: Next.js 15 requires awaiting params
    const { id } = await params; 
    
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required." }, { status: 400 });
    }

    const normalizedName = name.trim().toUpperCase();

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name: normalizedName },
      { new: true }
    );

    if (!updatedSubject) {
      return NextResponse.json({ message: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", subject: updatedSubject });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// --- DELETE: Purge Subject ---
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    // Boss: Awaiting params here to fix the "Sync Dynamic API" error
    const { id } = await params; 

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return NextResponse.json({ message: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Purged successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}