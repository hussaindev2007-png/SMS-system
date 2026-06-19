import dbConnect from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Params ko safely extract aur await karna (Next.js 14/15 standards)
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ success: false, message: "Complaint ID parameter is missing." }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const status = body.status || "resolved";
    const adminRemark = body.adminRemark ? body.adminRemark.trim() : "Resolved by Admin";

    // Allowed status ki validation checks
    const validStatuses = ["pending", "in-progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status state value provided." }, { status: 400 });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { 
        status: status, 
        adminRemark: adminRemark 
      },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ success: false, message: "Complaint record not found in data management system." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedComplaint }, { status: 200 });
  } catch (error) {
    console.error("COMPLAINT_ID_PUT_ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to update target complaint data.", 
      error: error.message 
    }, { status: 500 });
  }
}
