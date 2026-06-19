import dbConnect from "./mongodb";
import Fee from "@/models/Fee";
import User from "@/models/User";

// Try to import GROQ if API key exists
let Groq;
try {
  if (process.env.GROQ_API_KEY) {
    const groqModule = await import("groq-sdk");
    Groq = groqModule.default;
  }
} catch (error) {
  console.log("GROQ SDK not installed. Install with: npm install groq-sdk");
}

// AI Analysis Engine (Basic)
export const analyzeFeesData = async () => {
  await dbConnect();
  
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  
  // Get all fees data
  const allFees = await Fee.find().populate("studentId", "name className rollNo");
  const students = await User.find({ role: "student" });
  
  // 1. Calculate collection rate
  const totalFees = allFees.length;
  const paidFees = allFees.filter(f => f.status === "paid").length;
  const overdueFees = allFees.filter(f => f.status === "overdue").length;
  const unpaidFees = allFees.filter(f => f.status === "unpaid").length;
  
  const collectionRate = totalFees > 0 ? ((paidFees / totalFees) * 100).toFixed(1) : 0;
  
  // 2. Per class performance
  const classPerformance = {};
  for (const fee of allFees) {
    const className = fee.className || "Unknown";
    if (!classPerformance[className]) {
      classPerformance[className] = { total: 0, paid: 0, overdue: 0, amount: 0 };
    }
    classPerformance[className].total++;
    classPerformance[className].amount += fee.amount;
    if (fee.status === "paid") classPerformance[className].paid++;
    if (fee.status === "overdue") classPerformance[className].overdue++;
  }
  
  // Calculate class-wise collection rate
  for (const className in classPerformance) {
    const perf = classPerformance[className];
    perf.collectionRate = perf.total > 0 ? ((perf.paid / perf.total) * 100).toFixed(1) : 0;
  }
  
  // Sort classes by collection rate
  const sortedClasses = Object.entries(classPerformance)
    .sort((a, b) => b[1].collectionRate - a[1].collectionRate)
    .map(([name, data]) => ({ name, ...data }));
  
  // 3. Identify at-risk students (2+ months pending)
  const studentPaymentHistory = {};
  for (const fee of allFees) {
    const studentId = fee.studentId?._id?.toString();
    if (!studentId) continue;
    
    if (!studentPaymentHistory[studentId]) {
      studentPaymentHistory[studentId] = {
        name: fee.studentId?.name,
        rollNo: fee.rollNo,
        className: fee.className,
        unpaidMonths: [],
        overdueMonths: [],
        totalPending: 0
      };
    }
    
    if (fee.status === "unpaid") {
      studentPaymentHistory[studentId].unpaidMonths.push(fee.month);
      studentPaymentHistory[studentId].totalPending += fee.amount;
    } else if (fee.status === "overdue") {
      studentPaymentHistory[studentId].overdueMonths.push(fee.month);
      studentPaymentHistory[studentId].totalPending += fee.amount;
    }
  }
  
  const atRiskStudents = Object.values(studentPaymentHistory)
    .filter(s => s.unpaidMonths.length >= 2 || s.overdueMonths.length >= 1)
    .sort((a, b) => b.totalPending - a.totalPending);
  
  // 4. Calculate total amounts
  const totalDueAmount = allFees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaidAmount = allFees.filter(f => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const totalOverdueAmount = allFees.filter(f => f.status === "overdue").reduce((sum, f) => sum + f.amount, 0);
  const totalUnpaidAmount = allFees.filter(f => f.status === "unpaid").reduce((sum, f) => sum + f.amount, 0);
  
  // 5. Trend analysis (last 6 months)
  const monthlyTrend = {};
  for (const fee of allFees) {
    const month = fee.month;
    if (!monthlyTrend[month]) {
      monthlyTrend[month] = { total: 0, paid: 0, overdue: 0, amount: 0 };
    }
    monthlyTrend[month].total++;
    monthlyTrend[month].amount += fee.amount;
    if (fee.status === "paid") monthlyTrend[month].paid++;
    if (fee.status === "overdue") monthlyTrend[month].overdue++;
  }
  
  // 6. Predict next month collection
  const lastThreeMonths = Object.entries(monthlyTrend).slice(-3);
  const avgCollectionRate = lastThreeMonths.reduce((sum, [_, data]) => 
    sum + (data.total > 0 ? (data.paid / data.total) * 100 : 0), 0) / (lastThreeMonths.length || 1);
  
  const totalStudents = students.length;
  const avgFeePerStudent = totalStudents > 0 ? totalDueAmount / totalStudents : 0;
  const predictedCollection = (avgFeePerStudent * totalStudents * (avgCollectionRate / 100)).toFixed(0);
  
  // 7. Recommendations
  const recommendations = [];
  
  if (collectionRate < 70) {
    recommendations.push("📢 Collection rate is below 70%. Send payment reminders to all pending parents.");
  }
  
  const worstClass = sortedClasses[sortedClasses.length - 1];
  if (worstClass && worstClass.collectionRate < 50) {
    recommendations.push(`⚠️ ${worstClass.name} has only ${worstClass.collectionRate}% collection rate. Schedule parent-teacher meeting.`);
  }
  
  if (atRiskStudents.length > 0) {
    recommendations.push(`🔴 ${atRiskStudents.length} students at risk of default. Contact their parents immediately.`);
  }
  
  if (overdueFees > 10) {
    recommendations.push(`💰 ${overdueFees} overdue fees totaling PKR ${totalOverdueAmount.toLocaleString()}. Send legal notice warnings.`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push("✅ All metrics are good! Keep up the excellent work.");
  }
  
  return {
    summary: {
      totalFees,
      paidFees,
      overdueFees,
      unpaidFees,
      collectionRate: parseFloat(collectionRate),
      totalDueAmount,
      totalPaidAmount,
      totalOverdueAmount,
      totalUnpaidAmount
    },
    classPerformance: sortedClasses,
    atRiskStudents: atRiskStudents.slice(0, 10),
    monthlyTrend: Object.entries(monthlyTrend).slice(-6).map(([month, data]) => ({
      month,
      ...data,
      collectionRate: data.total > 0 ? ((data.paid / data.total) * 100).toFixed(1) : 0
    })),
    prediction: {
      nextMonthCollection: parseInt(predictedCollection),
      confidence: Math.min(95, Math.max(60, Math.round(avgCollectionRate))),
      trend: avgCollectionRate > 75 ? "improving" : avgCollectionRate > 50 ? "stable" : "declining"
    },
    recommendations,
    generatedAt: new Date().toISOString(),
    aiModel: "basic-analysis"
  };
};

// Enhanced AI Analysis with GROQ
export const analyzeFeesDataWithGROQ = async () => {
  // First get basic analysis
  const basicAnalysis = await analyzeFeesData();
  
  // Check if GROQ is available
  if (!Groq || !process.env.GROQ_API_KEY) {
    console.log("⚠️ GROQ API key not configured. Install groq-sdk and add GROQ_API_KEY to .env.local");
    return {
      ...basicAnalysis,
      aiModel: "basic-analysis-only",
      groqInsights: null,
      error: "GROQ API not configured"
    };
  }
  
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Prepare data for GROQ
    const prompt = `
      Analyze this school fee collection data and provide insights:
      
      📊 METRICS:
      - Total Fees: ${basicAnalysis.summary.totalFees}
      - Collection Rate: ${basicAnalysis.summary.collectionRate}%
      - Total Collected: PKR ${basicAnalysis.summary.totalPaidAmount.toLocaleString()}
      - Total Overdue: PKR ${basicAnalysis.summary.totalOverdueAmount.toLocaleString()}
      - Overdue Fees Count: ${basicAnalysis.summary.overdueFees}
      - Unpaid Fees Count: ${basicAnalysis.summary.unpaidFees}
      
      🏫 CLASS PERFORMANCE:
      Top Class: ${basicAnalysis.classPerformance[0]?.name || 'N/A'} - ${basicAnalysis.classPerformance[0]?.collectionRate || 0}%
      Bottom Class: ${basicAnalysis.classPerformance[basicAnalysis.classPerformance.length - 1]?.name || 'N/A'} - ${basicAnalysis.classPerformance[basicAnalysis.classPerformance.length - 1]?.collectionRate || 0}%
      
      ⚠️ AT-RISK STUDENTS: ${basicAnalysis.atRiskStudents.length}
      
      Based on this data, provide:
      1. Three key observations (be specific)
      2. Two actionable recommendations
      3. A prediction for next month's collection
      
      Keep response concise and actionable.
    `;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a financial analyst for a school management system. Provide data-driven insights and actionable recommendations for fee collection."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const groqInsights = completion.choices[0]?.message?.content;
    
    return {
      ...basicAnalysis,
      aiModel: "groq-enhanced",
      groqInsights: groqInsights,
      groqAnalysis: {
        observations: extractObservations(groqInsights),
        recommendations: extractRecommendations(groqInsights),
        prediction: extractPrediction(groqInsights)
      },
      groqUsed: true
    };
    
  } catch (error) {
    console.error("❌ GROQ API Error:", error);
    return {
      ...basicAnalysis,
      aiModel: "basic-analysis",
      groqInsights: null,
      groqError: error.message,
      groqUsed: false
    };
  }
};

// Helper functions to parse GROQ response
function extractObservations(insights) {
  if (!insights) return [];
  const observations = [];
  const lines = insights.split('\n');
  for (let line of lines) {
    if (line.match(/^\d+\.|observation|insight/i)) {
      observations.push(line.replace(/^\d+\.\s*/, '').trim());
    }
  }
  return observations.slice(0, 3);
}

function extractRecommendations(insights) {
  if (!insights) return [];
  const recommendations = [];
  const lines = insights.split('\n');
  for (let line of lines) {
    if (line.match(/recommend|should|must|need to|action/i)) {
      recommendations.push(line.trim());
    }
  }
  return recommendations.slice(0, 2);
}

function extractPrediction(insights) {
  if (!insights) return "Prediction based on current trends";
  const lines = insights.split('\n');
  for (let line of lines) {
    if (line.match(/predict|forecast|expect/i)) {
      return line.trim();
    }
  }
  return "Next month collection expected to follow current trend";
}

// Generate AI Report
export const generateAIReport = async () => {
  const analysis = await analyzeFeesData();
  
  return {
    title: "📊 AI Fee Collection Report",
    generatedAt: new Date().toLocaleString(),
    summary: `
      Total Fees: ${analysis.summary.totalFees}
      Collection Rate: ${analysis.summary.collectionRate}%
      Total Collected: PKR ${analysis.summary.totalPaidAmount.toLocaleString()}
      Total Overdue: PKR ${analysis.summary.totalOverdueAmount.toLocaleString()}
    `,
    topPerformingClass: analysis.classPerformance[0],
    worstPerformingClass: analysis.classPerformance[analysis.classPerformance.length - 1],
    atRiskCount: analysis.atRiskStudents.length,
    prediction: analysis.prediction,
    recommendations: analysis.recommendations,
    fullData: analysis
  };
};