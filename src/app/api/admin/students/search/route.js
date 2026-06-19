import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    
    let query = { role: "student" };
    
    if (q) {
      query = {
        role: "student",
        $or: [
          { name: { $regex: q, $options: "i" } },
          { rollNo: { $regex: q, $options: "i" } },
          { className: { $regex: q, $options: "i" } }
        ]
      };
    }
    
    const students = await User.find(query)
      .select("name rollNo className section email")
      .limit(50);
    
    return NextResponse.json({ success: true, students });
    
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}