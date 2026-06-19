// import dbConnect from "@/lib/mongodb";
// import Subject from "@/models/Subject";
// import { NextResponse } from "next/server";

// // --- GET: Saare subjects fetch karne ke liye (Dropdowns ke liye) ---
// export async function GET() {
//   try {
//     await dbConnect();
//     const subjects = await Subject.find({}).sort({ name: 1 }); // A to Z sort
//     return NextResponse.json(subjects, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Subjects fetch nahi ho sakye", error: error.message }, { status: 500 });
//   }
// }

// // --- POST: Naya subject add karne ke liye (Admin Dashboard se) ---
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { name } = await req.json();

//     if (!name) {
//       return NextResponse.json({ message: "Subject name zaroori hye!" }, { status: 400 });
//     }

//     const normalizedName = name.trim().toUpperCase();

//     // Check duplicate
//     const exists = await Subject.findOne({ name: normalizedName });
//     if (exists) {
//       return NextResponse.json({ message: "Ye subject pehle se maujood hye!" }, { status: 400 });
//     }

//     const newSubject = await Subject.create({ name: normalizedName });
//     return NextResponse.json({ message: "Subject add ho gaya!", subject: newSubject }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }




















import dbConnect from "@/lib/mongodb";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

// --- GET: Fetch all subjects (For Dropdowns) ---
export async function GET() {
  try {
    await dbConnect();
    // Fetching subjects and sorting them alphabetically (A to Z)
    const subjects = await Subject.find({}).sort({ name: 1 }); 
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      message: "Failed to fetch subjects. Please try again later.", 
      error: error.message 
    }, { status: 500 });
  }
}

// --- POST: Add new subject (From Admin Dashboard) ---
export async function POST(req) {
  try {
    await dbConnect();
    const { name } = await req.json();

    // Validation for subject name
    if (!name) {
      return NextResponse.json({ message: "Subject name is required." }, { status: 400 });
    }

    const normalizedName = name.trim().toUpperCase();

    // Check if the subject already exists to avoid duplicates
    const exists = await Subject.findOne({ name: normalizedName });
    if (exists) {
      return NextResponse.json({ message: "This subject already exists in the database." }, { status: 400 });
    }

    const newSubject = await Subject.create({ name: normalizedName });
    
    return NextResponse.json({ 
      message: "New subject added successfully!", 
      subject: newSubject 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      message: "Internal Server Error occurred while adding the subject.", 
      error: error.message 
    }, { status: 500 });
  }
}