import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import SchoolConfig from "@/models/SchoolConfig";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    
    if (!className) {
      return NextResponse.json({ error: "Class name required" }, { status: 400 });
    }
    
    // ✅ Get configured sections from SchoolConfig
    const config = await SchoolConfig.findOne();
    let availableSections = ['A', 'B', 'C', 'D']; // Default
    
    if (config) {
      const classConfig = config.classConfigs.find(c => c.className === className);
      if (classConfig && classConfig.sections && classConfig.sections.length > 0) {
        availableSections = classConfig.sections;
      }
    }
    
    // Get section with least students from configured sections only
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
    const suggestedSection = sectionCounts[0].section;
    
    // Get max students per section from config
    let maxPerSection = 30;
    if (config) {
      const classConfig = config.classConfigs.find(c => c.className === className);
      if (classConfig && classConfig.maxStudentsPerSection) {
        maxPerSection = classConfig.maxStudentsPerSection;
      }
    }
    
    // Check if selected section is full
    const currentCount = sectionCounts.find(s => s.section === suggestedSection)?.count || 0;
    const isFull = currentCount >= maxPerSection;
    
    // Generate next roll number
    const lastStudent = await User.findOne({
      role: "student",
      className: className,
      section: suggestedSection
    }).sort({ rollNo: -1 });
    
    let nextNumber = 1;
    if (lastStudent && lastStudent.rollNo) {
      const match = lastStudent.rollNo.match(/\d+$/);
      if (match) {
        nextNumber = parseInt(match[0]) + 1;
      }
    }
    
    // Handle class name (might be non-numeric like "Pre-9")
    let classNum = className;
    if (!isNaN(parseInt(classNum))) {
      classNum = classNum.toString().padStart(2, '0');
    }
    
    const numberStr = nextNumber.toString().padStart(3, '0');
    const suggestedRollNo = `${classNum}${suggestedSection}${numberStr}`;
    
    return NextResponse.json({
      success: true,
      suggestedSection,
      suggestedRollNo,
      sectionStats: sectionCounts,
      maxPerSection,
      isFull,
      availableSections
    });
    
  } catch (error) {
    console.error("Suggest API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}