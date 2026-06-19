import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const type = searchParams.get("type") || "full";

    // First fetch the report data
    const reportResponse = await fetch(
      `${process.env.NEXTAUTH_URL}/api/student/report?studentId=${studentId}&type=${type}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    const reportData = await reportResponse.json();
    
    if (!reportData.success) {
      throw new Error("Failed to fetch report data");
    }

    // For now, return JSON - you can later integrate PDF generation library like jsPDF or puppeteer
    return NextResponse.json({
      success: true,
      message: "PDF download endpoint ready. Install pdf generation library for actual PDF download.",
      data: reportData.data
    });

  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}