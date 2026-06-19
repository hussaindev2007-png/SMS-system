import dbConnect from "@/lib/mongodb";
import StudentIDCard from "@/models/StudentIDCard";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    
    
    if (!studentId) {
       return NextResponse.json({ error: "Student ID required" }, { status: 400 });
    }

    // Check if studentId is valid MongoDB ObjectId
    const isValidObjectId = studentId.match(/^[0-9a-fA-F]{24}$/);
    
    // First, check if student exists in User collection
    const studentExists = await User.findById(studentId);
   
    if (!studentExists) {
      
      return NextResponse.json({ 
        success: false, 
        error: "Student not found in database" 
      }, { status: 404 });
    }

    // Find ID card with photo
    const card = await StudentIDCard.findOne({ studentId }).populate('studentId', 'name fatherName cnic rollNo className section photoUrl');
    
    

    if (!card) {
      
      return NextResponse.json({ 
        success: false, 
        error: "ID Card not found. Please contact admin." 
      }, { status: 404 });
    }

    
    return NextResponse.json({
      success: true,
      data: {
        _id: card._id,
        cardNumber: card.cardNumber,
        rollNumber: card.rollNumber,
        course: card.course,
        batch: card.batch,
        issueDate: card.issueDate,
        expiryDate: card.expiryDate,
        qrCodeData: card.qrCodeData,
        status: card.status,
        student: {
          name: card.studentId?.name,
          fatherName: card.studentId?.fatherName,
          cnic: card.studentId?.cnic,
          rollNo: card.studentId?.rollNo,
          className: card.studentId?.className,
          section: card.studentId?.section,
          photoUrl: card.studentId?.photoUrl || null  // 👈 ADD PHOTO
        }
      }
    });
  } catch (error) {
    console.error("❌ [ID CARD API] Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}