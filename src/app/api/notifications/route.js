import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification"; 
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");

    if (!className) {
      return NextResponse.json({ success: false, message: "Class missing" }, { status: 400 });
    }

    // ✅ Aapke model mein 'recipientClass' hye, is liye wahi use karein
    const notifications = await Notification.find({ recipientClass: className })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}