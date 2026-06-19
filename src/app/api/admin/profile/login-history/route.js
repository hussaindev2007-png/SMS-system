import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

// GET: Fetch login history
export async function GET(req) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Return login history from admin model
    const history = admin.loginHistory || [];
    
    // Also include last login
    const formattedHistory = history.map(entry => ({
      date: entry.date || entry.timestamp,
      ip: entry.ip || entry.ipAddress || "Unknown",
      device: entry.device || entry.userAgent || "Unknown",
      status: entry.status || "success"
    })).slice(-20).reverse(); // Last 20 entries, newest first

    return NextResponse.json({
      success: true,
      history: formattedHistory,
      lastLogin: admin.lastLogin || null
    });

  } catch (error) {
    console.error("Login history error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}