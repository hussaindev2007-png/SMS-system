



















import dbConnect from "@/lib/mongodb";
import Teacher from "@/models/Teacher";
import TeacherIDCard from "@/models/TeacherIDCard";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

// ==================== GET: Fetch Teacher ID Cards ====================
export async function GET(req) {
 
  try {
    await dbConnect();
    
    
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const teacherId = searchParams.get("teacherId");
    
    // If teacherId provided, fetch single teacher's ID card
    if (teacherId) {
       
      const card = await TeacherIDCard.findOne({ teacherId })
        .populate('teacherId', 'name email phone department qualification photoUrl joiningDate status')
        .lean();
      
      if (!card) {
         return NextResponse.json({
          success: false,
          message: "ID Card not found for this teacher. Please generate first.",
          hasCard: false
        }, { status: 404 });
      }
      
      
      return NextResponse.json({
        success: true,
        data: card,
        teacher: card.teacherId,
        hasCard: true
      });
    }
    
    // Build query for all cards
    let query = {};
    if (department) query.department = department;
    
    
    // Fetch all teacher ID cards with populated teacher data
    const cards = await TeacherIDCard.find(query)
      .populate('teacherId', 'name email phone department qualification photoUrl joiningDate status')
      .sort({ createdAt: -1 })
      .lean();
    
    // Get all approved teachers and mark which have cards
    const allTeachers = await Teacher.find({ status: "approved" })
      .select('name email phone department qualification photoUrl joiningDate status')
      .lean();
    
    const teacherIdsWithCards = new Set(cards.map(c => c.teacherId?._id?.toString()));
    
    // Combine teachers with card status
    const teachersWithStatus = allTeachers.map(teacher => ({
      ...teacher,
      idCardGenerated: teacherIdsWithCards.has(teacher._id.toString()),
      idCard: cards.find(c => c.teacherId?._id?.toString() === teacher._id.toString())
    }));
    
    // Transform data for response
    const formattedCards = teachersWithStatus.filter(t => t.idCardGenerated).map(teacher => ({
      _id: teacher.idCard?._id,
      cardNumber: teacher.idCard?.cardNumber,
      teacherCode: teacher.idCard?.teacherCode,
      issueDate: teacher.idCard?.issueDate,
      expiryDate: teacher.idCard?.expiryDate,
      status: teacher.idCard?.status,
      qrCodeData: teacher.idCard?.qrCodeData,
      photoUrl: teacher.idCard?.photoUrl,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        department: teacher.department,
        qualification: teacher.qualification,
        photoUrl: teacher.photoUrl,
        joiningDate: teacher.joiningDate,
        status: teacher.status,
        idCardGenerated: true
      },
      createdAt: teacher.idCard?.createdAt,
      updatedAt: teacher.idCard?.updatedAt
    }));
    
    // Fetch unique departments
    const departments = await Teacher.distinct("department", { status: "approved" });
    
   
    return NextResponse.json({
      success: true,
      count: cards.length,
      data: formattedCards,
      teachers: teachersWithStatus,
      departments: departments.filter(Boolean).sort()
    });
    
  } catch (error) {
    console.error("❌ Teacher ID Cards fetch error:", error);
    
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// ==================== POST: Generate/Regenerate Teacher ID Card ====================
export async function POST(req) {
  
  try {
    await dbConnect();
   
    const { teacherId } = await req.json();
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    // Find teacher
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher not found" 
      }, { status: 404 });
    }
    
    
    if (teacher.status !== "approved" && teacher.status !== "active") {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher must be approved first" 
      }, { status: 400 });
    }
    
    // Check if card already exists
    let existingCard = await TeacherIDCard.findOne({ teacherId });
    
    // Generate unique teacher code and card number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const teacherCode = `TCH${year}${randomStr}`;
    const cardNumber = existingCard ? existingCard.cardNumber : `TCRD${year}${randomNum}`;
    
    
    // Generate QR code
    const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const qrData = `${FRONTEND_URL}/verify/teacher/${teacherCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    
   let savedCard;
    
    if (existingCard) {
      // Update existing card
      existingCard.teacherCode = teacherCode;
      existingCard.qrCodeData = qrCodeDataUrl;
      existingCard.issueDate = new Date();
      existingCard.expiryDate = new Date();
      existingCard.expiryDate.setFullYear(existingCard.expiryDate.getFullYear() + 2);
      existingCard.status = "active";
      existingCard.photoUrl = teacher.photoUrl || null;
      savedCard = await existingCard.save();
      } else {
      // Create new card
      savedCard = await TeacherIDCard.create({
        teacherId: teacher._id,
        cardNumber: cardNumber,
        teacherCode: teacherCode,
        qrCodeData: qrCodeDataUrl,
        issueDate: new Date(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        status: "active",
        photoUrl: teacher.photoUrl || null
      });
     }
    
    // Populate teacher data for response
    const populatedCard = await TeacherIDCard.findById(savedCard._id)
      .populate('teacherId', 'name email phone department qualification photoUrl joiningDate status')
      .lean();
    
  
    return NextResponse.json({
      success: true,
      message: existingCard ? "Teacher ID card regenerated successfully" : "Teacher ID card generated successfully",
      card: {
        _id: populatedCard._id,
        cardNumber: populatedCard.cardNumber,
        teacherCode: populatedCard.teacherCode,
        issueDate: populatedCard.issueDate,
        expiryDate: populatedCard.expiryDate,
        status: populatedCard.status,
        qrCodeData: populatedCard.qrCodeData,
        photoUrl: populatedCard.photoUrl
      },
      teacher: populatedCard.teacherId ? {
        _id: populatedCard.teacherId._id,
        name: populatedCard.teacherId.name,
        email: populatedCard.teacherId.email,
        phone: populatedCard.teacherId.phone,
        department: populatedCard.teacherId.department,
        qualification: populatedCard.teacherId.qualification,
        photoUrl: populatedCard.teacherId.photoUrl,
        joiningDate: populatedCard.teacherId.joiningDate,
        status: populatedCard.teacherId.status
      } : {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        department: teacher.department
      }
    });
    
  } catch (error) {
    console.error("❌ Error generating teacher ID card:", error);
   
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// ==================== DELETE: Remove Teacher ID Card ====================
export async function DELETE(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    
    if (!teacherId) {
      return NextResponse.json({ 
        success: false, 
        message: "Teacher ID required" 
      }, { status: 400 });
    }
    
    const deleted = await TeacherIDCard.findOneAndDelete({ teacherId });
    
    if (!deleted) {
      return NextResponse.json({ 
        success: false, 
        message: "ID Card not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Teacher ID card deleted successfully"
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}