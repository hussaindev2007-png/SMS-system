import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

async function getAdminFromToken(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return null;
    
    await dbConnect();
    const admin = await Admin.findById(decoded.id);
    return admin;
  } catch {
    return null;
  }
}

// PUT: Change password
export async function PUT(req) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword, confirmPassword } = await req.json();

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    if (oldPassword === newPassword) {
      return NextResponse.json({ message: "New password must be different from old password" }, { status: 400 });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully!"
    });

  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}