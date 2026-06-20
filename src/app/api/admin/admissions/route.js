
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Admission from "@/models/Admission";
import Fee from "@/models/Fee";
import StudentIDCard from "@/models/StudentIDCard";
import SchoolConfig from "@/models/SchoolConfig";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

// ========== HELPER FUNCTIONS ==========

// Get next roll number automatically
async function getNextRollNumber(className, section) {
  const lastStudent = await User.findOne({
    role: "student",
    className: className,
    section: section.toUpperCase()
  }).sort({ rollNo: -1 });
  
  let nextNumber = 1;
  
  if (lastStudent && lastStudent.rollNo) {
    const match = lastStudent.rollNo.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }
  
  let classNum = className;
  if (!isNaN(parseInt(classNum))) {
    classNum = classNum.toString().padStart(2, '0');
  }
  
  const sectionLetter = section.toUpperCase();
  const numberStr = nextNumber.toString().padStart(3, '0');
  
  return `${classNum}${sectionLetter}${numberStr}`;
}

// Get available section with least students from SchoolConfig
async function getAvailableSection(className) {
  const config = await SchoolConfig.findOne();
  let availableSections = ['A', 'B', 'C', 'D'];
  
  if (config) {
    const classConfig = config.classConfigs.find(c => c.className === className);
    if (classConfig && classConfig.sections && classConfig.sections.length > 0) {
      availableSections = classConfig.sections;
    }
  }
  
  let sectionCounts = [];
  
  for (const section of availableSections) {
    const count = await User.countDocuments({
      role: "student",
      className: className,
      section: section,
      status: "active"
    });
    sectionCounts.push({ section, count });
  }
  
  sectionCounts.sort((a, b) => a.count - b.count);
  return sectionCounts[0].section;
}

// Get max students per section from config
async function getMaxStudentsPerSection(className) {
  const config = await SchoolConfig.findOne();
  if (config) {
    const classConfig = config.classConfigs.find(c => c.className === className);
    if (classConfig && classConfig.maxStudentsPerSection) {
      return classConfig.maxStudentsPerSection;
    }
  }
  return 30;
}

// Generate unique card number
async function generateCardNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const cardNumber = `SID-${year}-${random}`;
  
  const existing = await StudentIDCard.findOne({ cardNumber });
  if (existing) {
    return generateCardNumber();
  }
  return cardNumber;
}

export async function GET() {
  try {
    await dbConnect();
    const pendingRequests = await Admission.find({ status: "pending" }).sort({ createdAt: -1 });
    return NextResponse.json(pendingRequests, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ message: "Failed to fetch admission data" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    console.log("=".repeat(50));
    console.log("🚀 [ADMISSION] PUT request received");
    
    await dbConnect();
    console.log("✅ [ADMISSION] Database connected");
    
    const body = await req.json();
    console.log("📦 [ADMISSION] Request body:", JSON.stringify(body, null, 2));
    
    const { requestId, action, admissionFee } = body;
    let { rollNumber, section } = body;

    if (!requestId) {
      console.log("❌ [ADMISSION] Request ID missing");
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    if (action === "approve") {
      console.log("✅ [ADMISSION] Action: APPROVE");
      console.log("🔍 [ADMISSION] Finding admission request:", requestId);
      
      const requestData = await Admission.findById(requestId);
      if (!requestData) {
        console.log("❌ [ADMISSION] Admission request not found:", requestId);
        return NextResponse.json({ message: "Admission request not found" }, { status: 404 });
      }
      console.log("✅ [ADMISSION] Admission request found:", requestData.name);

      // ========== AUTO SECTION ASSIGNMENT ==========
      if (!section) {
        console.log("🔄 [ADMISSION] Auto-assigning section...");
        section = await getAvailableSection(requestData.className);
        console.log(`✅ [ADMISSION] Section auto-assigned: ${section}`);
      } else {
        console.log(`📝 [ADMISSION] Section provided manually: ${section}`);
      }

      // ========== AUTO ROLL NUMBER GENERATION ==========
      if (!rollNumber) {
        console.log("🔄 [ADMISSION] Auto-generating roll number...");
        rollNumber = await getNextRollNumber(requestData.className, section);
        console.log(`✅ [ADMISSION] Roll number auto-generated: ${rollNumber}`);
      } else {
        console.log(`📝 [ADMISSION] Roll number provided manually: ${rollNumber}`);
      }

      // Check for duplicate Roll Number
      console.log("🔍 [ADMISSION] Checking duplicate roll number:", rollNumber);
      const duplicateRoll = await User.findOne({ rollNo: rollNumber, role: "student" });
      if (duplicateRoll) {
        console.log("❌ [ADMISSION] Duplicate roll number found:", rollNumber);
        return NextResponse.json({ message: "This Roll Number is already assigned" }, { status: 400 });
      }
      console.log("✅ [ADMISSION] Roll number is unique");

      // Check if section is full
      const maxPerSection = await getMaxStudentsPerSection(requestData.className);
      const currentSectionCount = await User.countDocuments({
        role: "student",
        className: requestData.className,
        section: section.toUpperCase(),
        status: "active"
      });
      
      if (currentSectionCount >= maxPerSection) {
        console.log("⚠️ [ADMISSION] Section is full!");
        return NextResponse.json({ 
          message: `Section ${section} is full (max ${maxPerSection} students). Please choose another section or increase capacity in settings.` 
        }, { status: 400 });
      }

      // 1. Create New Student record
      console.log("📝 [ADMISSION] Creating new student...");
      console.log("   Name:", requestData.name);
      console.log("   Roll No:", rollNumber);
      console.log("   Class:", requestData.className);
      console.log("   Section:", section.toUpperCase());
      
      let newStudent = null;
      
      try {
        newStudent = await User.create({
          name: requestData.name,
          fatherName: requestData.fatherName,
          motherName: requestData.motherName || "",
          email: requestData.email,
          phone: requestData.phone || "",
          cnic: requestData.cnic || "",
          address: requestData.address || "",
          city: requestData.city || "",
          rollNo: rollNumber,
          className: requestData.className,
          section: section.toUpperCase(),
          targetCourse: requestData.targetCourse || requestData.course || "General",
          role: "student",
          status: "active",
          admissionDate: new Date(),
          photoUrl: requestData.photoUrl || null,
          photoPublicId: requestData.photoPublicId || null
        });
        
        console.log("✅ [ADMISSION] Student created successfully!");
        console.log("   Student ID:", newStudent._id);
        console.log("   Student Name:", newStudent.name);
        console.log("   Student Roll No:", newStudent.rollNo);
      } catch (createError) {
        console.log("❌ [ADMISSION] Student creation FAILED!");
        console.log("   Error:", createError.message);
        return NextResponse.json({ 
          message: "Student creation failed: " + createError.message 
        }, { status: 500 });
      }

      if (!newStudent) {
        console.log("❌ [ADMISSION] newStudent is null or undefined!");
        return NextResponse.json({ 
          message: "Student creation failed - no student returned" 
        }, { status: 500 });
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      
      const verifyStudent = await User.findById(newStudent._id);
      console.log("🔍 [ADMISSION] Student verification in DB:", verifyStudent ? "FOUND" : "NOT FOUND");
      if (verifyStudent) {
        console.log("   Student name in DB:", verifyStudent.name);
        console.log("   Student rollNo in DB:", verifyStudent.rollNo);
      } else {
        console.log("❌ [ADMISSION] CRITICAL: Student not found in DB after creation!");
        await User.findByIdAndDelete(newStudent._id);
        return NextResponse.json({ 
          message: "Student not found in database after creation" 
        }, { status: 500 });
      }

      // 2. Generate Initial Fee record
      console.log("💰 [ADMISSION] Creating fee record...");
      const date = new Date();
      const currentMonth = date.toLocaleString('en-US', { month: 'long' }) + " " + date.getFullYear();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      try {
        const feeRecord = await Fee.create({
          studentId: newStudent._id,
          className: newStudent.className,
          month: currentMonth,
          amount: Number(admissionFee) || 5000,
          status: "unpaid",
          dueDate: dueDate,
          feeType: "admission",
          rollNo: rollNumber,
          discount: 0
        });
        console.log("✅ [ADMISSION] Fee record created:", feeRecord._id);
      } catch (feeError) {
        console.log("❌ [ADMISSION] Fee creation FAILED!");
        console.log("   Error:", feeError.message);
        await User.findByIdAndDelete(newStudent._id);
        console.log("🗑️ [ADMISSION] Student rolled back (deleted)");
        return NextResponse.json({ message: "Process failed at fee generation: " + feeError.message }, { status: 500 });
      }

      // ========== ✅ FIXED: Generate ID Card with Clean URL ==========
      console.log("🪪 [ADMISSION] Generating ID Card...");
      let idCard = null;
      try {
        const cardNumber = await generateCardNumber();
        
        // ✅ FIX: Use production URL, NO encoding
        const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://sms-system-3.onrender.com';
        const cleanStudentId = newStudent._id.toString().trim();
        const qrData = `${FRONTEND_URL}/verify/${cleanStudentId}`;
        
        console.log("🔍 [ADMISSION] QR Data URL:", qrData);
        console.log("🔍 [ADMISSION] Frontend URL used:", FRONTEND_URL);
        
        // ✅ FIX: Generate QR with clean URL
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        
        console.log("✅ [ADMISSION] QR Code generated successfully");
        
        idCard = await StudentIDCard.create({
          studentId: newStudent._id,
          cardNumber: cardNumber,
          rollNumber: rollNumber,
          course: requestData.targetCourse || requestData.course || "Matric",
          batch: new Date().getFullYear().toString(),
          issueDate: new Date(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
          qrCodeData: qrCodeDataUrl,
          photoUrl: requestData.photoUrl || null,
          status: 'active'
        });
        
        console.log(`✅ [ADMISSION] ID Card generated successfully!`);
        console.log(`   Card Number: ${cardNumber}`);
        console.log(`   Student ID: ${newStudent._id}`);
        console.log(`   QR Code URL: ${qrData}`);
      } catch (cardError) {
        console.log("❌ [ADMISSION] ID Card generation FAILED!");
        console.log("   Error:", cardError.message);
      }

      // 4. Delete the pending request
      console.log("🗑️ [ADMISSION] Deleting admission request...");
      await Admission.findByIdAndDelete(requestId);
      console.log("✅ [ADMISSION] Admission request deleted");
      
      console.log("=".repeat(50));
      console.log("🎉 [ADMISSION] Process completed successfully!");
      console.log(`   Student: ${newStudent.name}`);
      console.log(`   Student ID: ${newStudent._id}`);
      console.log(`   Roll No: ${rollNumber}`);
      console.log(`   Section: ${section}`);
      console.log("=".repeat(50));
      
      return NextResponse.json({ 
        message: `${newStudent.name} has been enrolled successfully!`,
        student: {
          id: newStudent._id,
          name: newStudent.name,
          fatherName: newStudent.fatherName,
          rollNo: rollNumber,
          className: newStudent.className,
          section: section,
          photoUrl: requestData.photoUrl || null
        },
        idCard: idCard ? {
          cardNumber: idCard.cardNumber,
          status: idCard.status
        } : null
      }, { status: 200 });
    }

    if (action === "reject") {
      console.log("❌ [ADMISSION] Action: REJECT");
      const deletedRequest = await Admission.findByIdAndDelete(requestId);
      if (!deletedRequest) {
        return NextResponse.json({ message: "Request already processed or not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Admission request has been rejected" }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action type provided" }, { status: 400 });

  } catch (error) {
    console.log("=".repeat(50));
    console.log("💥 [ADMISSION] UNHANDLED ERROR!");
    console.log("   Error message:", error.message);
    console.log("   Error stack:", error.stack);
    console.log("=".repeat(50));
    return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
