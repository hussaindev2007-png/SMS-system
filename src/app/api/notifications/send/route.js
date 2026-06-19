import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(request) {
  try {
    const { email, studentName, status, time } = await request.json();
    
    await transporter.sendMail({
      from: `"School Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `⚠️ Late Arrival Alert - ${studentName}`,
      html: `
        <h3>Late Arrival Notification</h3>
        <p>Dear Parent,</p>
        <p>Your child <strong>${studentName}</strong> arrived late at school today.</p>
        <p>Check-in Time: <strong>${time}</strong></p>
        <p>School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.</p>
      `
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}