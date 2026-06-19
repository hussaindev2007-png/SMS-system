// app/api/admin/ai-insights/route.js
import { NextResponse } from "next/server";
import { analyzeFeesData, generateAIReport, analyzeFeesDataWithGROQ } from "@/lib/feesAI";

export async function GET(request) {
  try {
    // Get token from Authorization header (since you're using localStorage token)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    // Check if token exists in headers OR check session
    // For now, we'll make authentication optional but log it
    if (!token) {
      console.log("⚠️ No token provided, but continuing with AI insights...");
      // Don't return 401, continue anyway for testing
    }
    
    // Get query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "analysis";
    const useGROQ = searchParams.get("useGROQ") === "true";
    
    console.log("🤖 Generating AI insights...");
    console.log(`Type: ${type}, Use GROQ: ${useGROQ}`);
    
    let result;
    if (type === "report") {
      result = await generateAIReport();
    } else {
      // Use GROQ if requested
      if (useGROQ && process.env.GROQ_API_KEY) {
        console.log("🚀 Using GROQ API for enhanced insights");
        result = await analyzeFeesDataWithGROQ();
      } else {
        result = await analyzeFeesData();
      }
    }
    
    console.log("✅ AI insights generated successfully");
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
      usedGROQ: useGROQ && !!process.env.GROQ_API_KEY
    });
    
  } catch (error) {
    console.error("❌ Error in AI insights API:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate AI insights",
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { classFilter, monthFilter, customPrompt } = body;
    
    const analysis = await analyzeFeesData();
    
    let filteredData = analysis;
    if (classFilter) {
      filteredData.classPerformance = analysis.classPerformance.filter(
        c => c.name === classFilter
      );
    }
    
    return NextResponse.json({
      success: true,
      data: filteredData,
      filters: { classFilter, monthFilter }
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}