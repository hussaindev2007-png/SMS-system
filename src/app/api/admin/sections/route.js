import dbConnect from "@/lib/mongodb";
import SchoolConfig from "@/models/SchoolConfig";
import { NextResponse } from "next/server";

// GET: Fetch all section configurations
export async function GET() {
  try {
    await dbConnect();
    
    let config = await SchoolConfig.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      // Default configuration with empty classConfigs (admin will add classes)
      const defaultConfig = {
        academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        classConfigs: []  // Empty initially, admin will add classes
      };
      
      config = await SchoolConfig.create(defaultConfig);
    }
    
    return NextResponse.json({
      success: true,
      data: config
    });
    
  } catch (error) {
    console.error("GET sections error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create/Update full configuration
export async function POST(req) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { academicYear, classConfigs, updatedBy } = body;
    
    // Validate
    if (!classConfigs || !Array.isArray(classConfigs)) {
      return NextResponse.json({ error: "Invalid class configurations" }, { status: 400 });
    }
    
    // Update or create
    let config = await SchoolConfig.findOne();
    
    if (config) {
      // Update existing
      config.academicYear = academicYear || config.academicYear;
      config.classConfigs = classConfigs;
      config.updatedBy = updatedBy;
      await config.save();
    } else {
      // Create new
      config = await SchoolConfig.create({
        academicYear: academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        classConfigs: classConfigs,
        updatedBy: updatedBy
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Section configuration saved successfully",
      data: config
    });
    
  } catch (error) {
    console.error("POST sections error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update specific class section
export async function PUT(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const { sections, maxStudentsPerSection } = await req.json();
    
    if (!className) {
      return NextResponse.json({ error: "Class name required" }, { status: 400 });
    }
    
    let config = await SchoolConfig.findOne();
    
    if (!config) {
      config = await SchoolConfig.create({
        academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        classConfigs: []
      });
    }
    
    const classIndex = config.classConfigs.findIndex(c => c.className === className);
    
    if (classIndex !== -1) {
      // Update existing
      config.classConfigs[classIndex].sections = sections;
      if (maxStudentsPerSection) {
        config.classConfigs[classIndex].maxStudentsPerSection = maxStudentsPerSection;
      }
    } else {
      // Add new
      config.classConfigs.push({
        className,
        sections: sections || ["A"],
        maxStudentsPerSection: maxStudentsPerSection || 30
      });
    }
    
    await config.save();
    
    return NextResponse.json({
      success: true,
      message: `${className} sections updated successfully`,
      data: config
    });
    
  } catch (error) {
    console.error("PUT sections error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE: Remove a specific class configuration
export async function DELETE(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    
    if (!className) {
      return NextResponse.json({ error: "Class name required" }, { status: 400 });
    }
    
    let config = await SchoolConfig.findOne();
    
    if (!config) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
    }
    
    // Filter out the class to delete
    const updatedClassConfigs = config.classConfigs.filter(c => c.className !== className);
    
    if (updatedClassConfigs.length === config.classConfigs.length) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    
    config.classConfigs = updatedClassConfigs;
    await config.save();
    
    return NextResponse.json({
      success: true,
      message: `Class ${className} configuration deleted successfully`,
      data: config
    });
    
  } catch (error) {
    console.error("DELETE sections error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}