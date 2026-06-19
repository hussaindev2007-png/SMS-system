// import dbConnect from "@/lib/mongodb";
// import StudentIDCard from "@/models/StudentIDCard";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
//     const className = searchParams.get("class");
    
//     let query = {};
//     if (className) query.className = className;
    
//     const cards = await StudentIDCard.find(query)
//       .populate('studentId', 'name fatherName rollNo className section photoUrl')
//       .sort({ createdAt: -1 });
    
//     return NextResponse.json({
//       success: true,
//       count: cards.length,
//       data: cards
//     });
//   } catch (error) {
//     console.error("ID Cards fetch error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }







import dbConnect from "@/lib/mongodb";
import StudentIDCard from "@/models/StudentIDCard";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("class");
    
    let query = {};
    if (className) query.className = className;
    
    const cards = await StudentIDCard.find(query)
      .populate('studentId', 'name fatherName rollNo className section photoUrl')
      .sort({ createdAt: -1 });
    
    // Fetch unique classes from Users (students)
    const classes = await User.distinct("className", { role: "student" });
    
    return NextResponse.json({
      success: true,
      count: cards.length,
      data: cards,
      classes: classes.filter(Boolean).sort() // Remove null/empty and sort alphabetically
    });
  } catch (error) {
    console.error("ID Cards fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}