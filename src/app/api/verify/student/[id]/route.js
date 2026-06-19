import dbConnect from "@/lib/mongodb";
import StudentIDCard from "@/models/StudentIDCard";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET: /api/verify/student/[id]
export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;  // Yeh studentId hai
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Student ID required" 
      }, { status: 400 });
    }

    // Check if student exists
    const studentExists = await User.findById(id);
    
    if (!studentExists) {
      return NextResponse.json({ 
        success: false, 
        error: "Student not found in database" 
      }, { status: 404 });
    }

    // Find ID card
    const card = await StudentIDCard.findOne({ studentId: id })
      .populate('studentId', 'name fatherName cnic rollNo className section photoUrl email phone');
    
    if (!card) {
      return NextResponse.json({ 
        success: false, 
        error: "ID Card not found. Please contact admin." 
      }, { status: 404 });
    }

    // Check if card is expired
    const isExpired = new Date(card.expiryDate) < new Date();

    // Return verification data
    return NextResponse.json({
      success: true,
      verified: true,
      verifiedAt: new Date().toISOString(),
      data: {
        _id: studentExists._id,
        name: studentExists.name,
        rollNo: studentExists.rollNo,
        className: studentExists.className,
        section: studentExists.section,
        fatherName: studentExists.fatherName,
        email: studentExists.email,
        phone: studentExists.phone,
        photoUrl: studentExists.photoUrl || null,
        cardNumber: card.cardNumber,
        issueDate: card.issueDate,
        expiryDate: card.expiryDate,
        isExpired: isExpired,
        status: card.status
      }
    });
    
  } catch (error) {
    console.error("❌ [VERIFY API] Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}