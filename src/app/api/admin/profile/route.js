import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Helper: Get admin ID from token
async function getAdminFromToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return null;
    
    await dbConnect();
    const admin = await Admin.findById(decoded.id).select("-password");
    return admin;
  } catch {
    return null;
  }
}

// GET: Fetch admin profile
export async function GET(req) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get basic stats
    const User = (await import("@/models/User")).default;
    const Teacher = (await import("@/models/Teacher")).default;
    const Fee = (await import("@/models/Fee")).default;
    
    const [totalStudents, totalTeachers, fees] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Teacher.countDocuments({ status: "approved" }),
      Fee.find({ status: "paid" }).select("amount")
    ]);

    const totalFeesCollected = fees.reduce((sum, f) => sum + (f.amount || 0), 0);

    return NextResponse.json({
      success: true,
      profile: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
        photoUrl: admin.photoUrl || null,
        twoFactorEnabled: admin.twoFactorEnabled || false,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin || null
      },
      stats: {
        totalTeachers,
        totalStudents,
        totalFeesCollected
      }
    });

  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: Update profile
export async function PUT(req) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, photoUrl, twoFactorEnabled } = body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (twoFactorEnabled !== undefined) updateData.twoFactorEnabled = twoFactorEnabled;

    // Check email uniqueness
    if (email && email !== admin.email) {
      const existing = await Admin.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json({ message: "Email already in use" }, { status: 400 });
      }
    }

    const updated = await Admin.findByIdAndUpdate(
      admin._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      profile: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        role: "admin",
        photoUrl: updated.photoUrl || null,
        twoFactorEnabled: updated.twoFactorEnabled || false,
        createdAt: updated.createdAt,
        lastLogin: updated.lastLogin || null
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}