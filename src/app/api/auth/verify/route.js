// app/api/auth/verify/route.js
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        role: null,
        message: 'No token provided'
      });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return NextResponse.json({
      authenticated: true,
      role: decoded.role || 'user',
      userId: decoded.id,
      name: decoded.name,
      email: decoded.email
    });
    
  } catch (error) {
    console.error("Auth verify error:", error);
    return NextResponse.json({ 
      authenticated: false, 
      role: null,
      error: error.message
    });
  }
}