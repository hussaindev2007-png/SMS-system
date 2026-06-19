// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; // Aapka DB connection helper
// import Student from "@/models/Student";

// export async function GET(req) {
//   await dbConnect();
//   const { searchParams } = new URL(req.url);
//   const search = searchParams.get("search") || "";
//   const page = parseInt(searchParams.get("page")) || 1;
//   const limit = parseInt(searchParams.get("limit")) || 5;

//   const query = search ? { rollNo: { $regex: search, $options: "i" } } : {};

//   try {
//     const students = await Student.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const total = await Student.countDocuments(query);

//     return NextResponse.json({
//       students,
//       pagination: { total, totalPages: Math.ceil(total / limit), page }
//     });
//   } catch (err) {
//     return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     // Check if Roll No already exists
//     const existing = await Student.findOne({ rollNo: body.rollNo });
//     if (existing) return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });

//     const newStudent = await Student.create(body);
//     return NextResponse.json(newStudent, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; 
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// // --- 1. POST: Create Student ---
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     const existing = await User.findOne({ rollNo: body.rollNo });
//     if (existing) {
//       return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     const newStudent = await User.create({
//       name: body.name,
//       rollNo: body.rollNo,
//       password: hashedPassword,
//       className: body.className || body.studentClass, 
//       section: body.section || "A",
//       role: "student"
//     });

//     return NextResponse.json(newStudent, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
//   }
// }

// // --- 2. GET: Fetch Students ---
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
    
//     const query = { role: "student" };
//     if (search) {
//       query.rollNo = { $regex: search, $options: "i" };
//     }

//     const students = await User.find(query).sort({ createdAt: -1 });
//     return NextResponse.json({ students });
//   } catch (err) {
//     return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
//   }
// }

// // --- 3. DELETE: Bulk Delete Logic ---
// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     // Hum sirf unhe delete kar rahe hain jinka role 'student' hai
//     // Taake Admin delete na ho jaye galti se
//     const result = await User.deleteMany({ role: "student" });

//     return NextResponse.json({ 
//       message: `${result.deletedCount} students deleted successfully!`,
//       count: result.deletedCount 
//     }, { status: 200 });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json({ message: "Failed to delete students" }, { status: 500 });
//   }
// }









// pa








// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; 
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// // --- 1. POST: Create Student ---
// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     const existing = await User.findOne({ rollNo: body.rollNo });
//     if (existing) {
//       return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     const newStudent = await User.create({
//       name: body.name,
//       rollNo: body.rollNo,
//       password: hashedPassword,
//       className: body.className || body.studentClass, 
//       section: body.section || "A",
//       role: "student"
//     });

//     return NextResponse.json(newStudent, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
//   }
// }

// // --- 2. GET: Fetch Students with Pagination ---
// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
    
//     // Pagination Parameters
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; // Default 5 students per page
    
//     const skip = (page - 1) * limit;

//     // Build Query
//     const query = { role: "student" };
//     if (search) {
//       // Search by Roll No OR Name
//       query.$or = [
//         { rollNo: { $regex: search, $options: "i" } },
//         { name: { $regex: search, $options: "i" } }
//       ];
//     }

//     // Get Total Count for Pagination Calculation
//     const totalStudents = await User.countDocuments(query);

//     // Fetch Data with Skip and Limit
//     const students = await User.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({ 
//       students,
//       pagination: {
//         total: totalStudents,
//         page: page,
//         totalPages: Math.ceil(totalStudents / limit),
//         hasMore: skip + students.length < totalStudents
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
//   }
// }

// // --- 3. DELETE: Bulk Delete Logic ---
// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     // Hum sirf unhe delete kar rahe hain jinka role 'student' hai
//     // Taake Admin delete na ho jaye galti se
//     const result = await User.deleteMany({ role: "student" });

//     return NextResponse.json({ 
//       message: `${result.deletedCount} students deleted successfully!`,
//       count: result.deletedCount 
//     }, { status: 200 });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json({ message: "Failed to delete students" }, { status: 500 });
//   }
// }














// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; 
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     const existing = await User.findOne({ rollNo: body.rollNo });
//     if (existing) {
//       return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     const newStudent = await User.create({
//       name: body.name,
//       rollNo: body.rollNo,
//       password: hashedPassword,
//       className: body.className || body.studentClass, 
//       section: body.section || "A",
//       role: "student"
//     });

//     return NextResponse.json(newStudent, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; 
//     const skip = (page - 1) * limit;

//     const query = { role: "student" };
//     if (search) {
//       query.$or = [
//         { rollNo: { $regex: search, $options: "i" } },
//         { name: { $regex: search, $options: "i" } }
//       ];
//     }

//     const [totalStudents, studentsRaw] = await Promise.all([
//       User.countDocuments(query),
//       User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
//     ]);

//     const activeOnlineStudents = Math.min(totalStudents, Math.round(totalStudents * 0.35 + Math.random()));

//     const aiEvaluatedStudents = studentsRaw.map((student) => {
//       const rawDoc = student.toObject();
      
//       const seed = parseInt(rawDoc.rollNo) || rawDoc.name.length || 7;
//       const attendanceFactor = 70 + (seed % 26);
      
//       let academicTier = "STABLE";
//       let statusInsight = "Maintains optimal course progression and behavioral alignment logs.";
      
//       if (attendanceFactor < 75) {
//         academicTier = "CRITICAL RISK";
//         statusInsight = "High risk pattern: Attendance dropped below terminal threshold. Auto-triggering warning vector.";
//       } else if (attendanceFactor > 92) {
//         academicTier = "ELITE PRODIGY";
//         statusInsight = "Exceptional performance metrics. Showing consistent mastery over course core structures.";
//       }

//       return {
//         ...rawDoc,
//         aiMetrics: {
//           attendancePercentage: `${attendanceFactor}%`,
//           academicTier,
//           behavioralInsight: statusInsight,
//           engagementScore: `${Math.min(100, Math.round(attendanceFactor + 4))}%`
//         }
//       };
//     });

//     const anomaliesDetected = aiEvaluatedStudents.filter(s => s.aiMetrics.academicTier === "CRITICAL RISK").length;
    
//     const operationalAlerts = [];
//     if (anomaliesDetected > 0) {
//       operationalAlerts.push(`RISK LAYER ALERT: ${anomaliesDetected} active student records flagged with high risk burnout anomalies.`);
//     } else {
//       operationalAlerts.push("All monitored student trajectories executing on stable parameters.");
//     }

//     const aiGlobalInsights = {
//       globalEngagementIndex: `${totalStudents > 0 ? Math.round(82 + (Math.random() * 5)) : 100}%`,
//       liveAnomaliesCount: anomaliesDetected,
//       structuralTriggers: operationalAlerts,
//       activePortalUsers: activeOnlineStudents
//     };

//     return NextResponse.json({ 
//       students: aiEvaluatedStudents,
//       aiGlobalInsights,
//       pagination: {
//         total: totalStudents,
//         page: page,
//         totalPages: Math.ceil(totalStudents / limit),
//         hasMore: skip + aiEvaluatedStudents.length < totalStudents
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     const result = await User.deleteMany({ role: "student" });
//     return NextResponse.json({ 
//       message: `${result.deletedCount} students deleted successfully!`,
//       count: result.deletedCount 
//     }, { status: 200 });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json({ message: "Failed to delete students" }, { status: 500 });
//   }
// }



















































































































// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; 
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     const existing = await User.findOne({ rollNo: body.rollNo });
//     if (existing) {
//       return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     const newStudent = await User.create({
//       name: body.name,
//       rollNo: body.rollNo,
//       password: hashedPassword,
//       className: body.className || body.studentClass, 
//       section: body.section || "A",
//       role: "student"
//     });

//     return NextResponse.json(newStudent, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; 
//     const skip = (page - 1) * limit;

//     const query = { role: "student" };
//     if (search) {
//       query.$or = [
//         { rollNo: { $regex: search, $options: "i" } },
//         { name: { $regex: search, $options: "i" } }
//       ];
//     }

//     const [totalStudents, studentsRaw] = await Promise.all([
//       User.countDocuments(query),
//       User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
//     ]);

//     const activeOnlineStudents = Math.min(totalStudents, Math.round(totalStudents * 0.35 + Math.random()));

//     const aiEvaluatedStudents = studentsRaw.map((student) => {
//       const rawDoc = student.toObject();
      
//       const seed = parseInt(rawDoc.rollNo) || rawDoc.name.length || 7;
//       const attendanceFactor = 70 + (seed % 26);
      
//       let academicTier = "STABLE";
//       let statusInsight = "Maintains optimal course progression and behavioral alignment logs.";
      
//       if (attendanceFactor < 75) {
//         academicTier = "CRITICAL RISK";
//         statusInsight = "High risk pattern: Attendance dropped below terminal threshold. Auto-triggering warning vector.";
//       } else if (attendanceFactor > 92) {
//         academicTier = "ELITE PRODIGY";
//         statusInsight = "Exceptional performance metrics. Showing consistent mastery over course core structures.";
//       }

//       return {
//         ...rawDoc,
//         aiMetrics: {
//           attendancePercentage: `${attendanceFactor}%`,
//           academicTier,
//           behavioralInsight: statusInsight,
//           engagementScore: `${Math.min(100, Math.round(attendanceFactor + 4))}%`
//         }
//       };
//     });

//     const anomaliesDetected = aiEvaluatedStudents.filter(s => s.aiMetrics.academicTier === "CRITICAL RISK").length;
    
//     const operationalAlerts = [];
//     if (anomaliesDetected > 0) {
//       operationalAlerts.push(`RISK LAYER ALERT: ${anomaliesDetected} active student records flagged with high risk burnout anomalies.`);
//     } else {
//       operationalAlerts.push("All monitored student trajectories executing on stable parameters.");
//     }

//     const aiGlobalInsights = {
//       globalEngagementIndex: `${totalStudents > 0 ? Math.round(82 + (Math.random() * 5)) : 100}%`,
//       liveAnomaliesCount: anomaliesDetected,
//       structuralTriggers: operationalAlerts,
//       activePortalUsers: activeOnlineStudents
//     };

//     return NextResponse.json({ 
//       students: aiEvaluatedStudents,
//       aiGlobalInsights,
//       pagination: {
//         total: totalStudents,
//         page: page,
//         totalPages: Math.ceil(totalStudents / limit),
//         hasMore: skip + aiEvaluatedStudents.length < totalStudents
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     const result = await User.deleteMany({ role: "student" });
//     return NextResponse.json({ 
//       message: `${result.deletedCount} students deleted successfully!`,
//       count: result.deletedCount 
//     }, { status: 200 });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json({ message: "Failed to delete students" }, { status: 500 });
//   }
// }
































// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; 
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   await dbConnect();
//   try {
//     const body = await req.json();
    
//     const existing = await User.findOne({ rollNo: body.rollNo });
//     if (existing) {
//       return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(body.password, salt);

//     const newStudent = await User.create({
//       name: body.name,
//       rollNo: body.rollNo,
//       password: hashedPassword,
//       className: body.className || body.studentClass, 
//       section: body.section || "A",
//       role: "student"
//     });

//     return NextResponse.json(newStudent, { status: 201 });
//   } catch (err) {
//     return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
//   }
// }

// export async function GET(req) {
//   await dbConnect();
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 5; 
//     const skip = (page - 1) * limit;

//     const query = { role: "student" };
//     if (search) {
//       query.$or = [
//         { rollNo: { $regex: search, $options: "i" } },
//         { name: { $regex: search, $options: "i" } }
//       ];
//     }

//     const [totalStudents, studentsRaw] = await Promise.all([
//       User.countDocuments(query),
//       User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
//     ]);

//     const activeOnlineStudents = Math.min(totalStudents, Math.round(totalStudents * 0.35 + Math.random()));

//     const aiEvaluatedStudents = studentsRaw.map((student) => {
//       const rawDoc = student.toObject();
      
//       const seed = parseInt(rawDoc.rollNo) || rawDoc.name.length || 7;
//       const attendanceFactor = 70 + (seed % 26);
      
//       let academicTier = "STABLE";
//       let statusInsight = "Maintains optimal course progression and behavioral alignment logs.";
      
//       if (attendanceFactor < 75) {
//         academicTier = "CRITICAL RISK";
//         statusInsight = "High risk pattern: Attendance dropped below terminal threshold. Auto-triggering warning vector.";
//       } else if (attendanceFactor > 92) {
//         academicTier = "ELITE PRODIGY";
//         statusInsight = "Exceptional performance metrics. Showing consistent mastery over course core structures.";
//       }

//       return {
//         _id: rawDoc._id,
//         name: rawDoc.name,
//         fatherName: rawDoc.fatherName,
//         motherName: rawDoc.motherName,
//         email: rawDoc.email,
//         phone: rawDoc.phone,
//         cnic: rawDoc.cnic,
//         address: rawDoc.address,
//         city: rawDoc.city,
//         rollNo: rawDoc.rollNo,
//         className: rawDoc.className,
//         section: rawDoc.section,
//         targetCourse: rawDoc.targetCourse,
//         photoUrl: rawDoc.photoUrl || null,  // ✅ Include photo URL
//         photoPublicId: rawDoc.photoPublicId || null,
//         status: rawDoc.status,
//         admissionDate: rawDoc.admissionDate,
//         isOnline: rawDoc.isOnline,
//         lastSeen: rawDoc.lastSeen,
//         aiMetrics: {
//           attendancePercentage: `${attendanceFactor}%`,
//           academicTier,
//           behavioralInsight: statusInsight,
//           engagementScore: `${Math.min(100, Math.round(attendanceFactor + 4))}%`
//         }
//       };
//     });

//     const anomaliesDetected = aiEvaluatedStudents.filter(s => s.aiMetrics.academicTier === "CRITICAL RISK").length;
    
//     const operationalAlerts = [];
//     if (anomaliesDetected > 0) {
//       operationalAlerts.push(`RISK LAYER ALERT: ${anomaliesDetected} active student records flagged with high risk burnout anomalies.`);
//     } else {
//       operationalAlerts.push("All monitored student trajectories executing on stable parameters.");
//     }

//     const aiGlobalInsights = {
//       globalEngagementIndex: `${totalStudents > 0 ? Math.round(82 + (Math.random() * 5)) : 100}%`,
//       liveAnomaliesCount: anomaliesDetected,
//       structuralTriggers: operationalAlerts,
//       activePortalUsers: activeOnlineStudents
//     };

//     return NextResponse.json({ 
//       students: aiEvaluatedStudents,
//       aiGlobalInsights,
//       pagination: {
//         total: totalStudents,
//         page: page,
//         totalPages: Math.ceil(totalStudents / limit),
//         hasMore: skip + aiEvaluatedStudents.length < totalStudents
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   await dbConnect();
//   try {
//     const result = await User.deleteMany({ role: "student" });
//     return NextResponse.json({ 
//       message: `${result.deletedCount} students deleted successfully!`,
//       count: result.deletedCount 
//     }, { status: 200 });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json({ message: "Failed to delete students" }, { status: 500 });
//   }
// }








import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import Submission from "@/models/Submission";
import Assignment from "@/models/Assignment";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    
    const existing = await User.findOne({ rollNo: body.rollNo });
    if (existing) {
      return NextResponse.json({ message: "Roll Number already exists!" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newStudent = await User.create({
      name: body.name,
      rollNo: body.rollNo,
      password: hashedPassword,
      className: body.className || body.studentClass, 
      section: body.section || "A",
      role: "student"
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5; 
    const skip = (page - 1) * limit;

    const query = { role: "student" };
    if (search) {
      query.$or = [
        { rollNo: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } }
      ];
    }

    const [totalStudents, studentsRaw] = await Promise.all([
      User.countDocuments(query),
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ]);

    // Get all assignments count for engagement calculation
    const totalAssignments = await Assignment.countDocuments({});
    
    // Calculate real AI metrics for each student
    const aiEvaluatedStudents = await Promise.all(studentsRaw.map(async (student) => {
      const rawDoc = student.toObject();
      const studentId = student._id;
      
      // ========== REAL ATTENDANCE DATA ==========
      const attendanceRecords = await Attendance.find({ 
        studentId: studentId 
      }).sort({ date: -1 });
      
      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter(r => r.status === "present").length;
      const lateDays = attendanceRecords.filter(r => r.status === "late").length;
      
      let attendancePercentage = 0;
      if (totalDays > 0) {
        // Present and late count as present for percentage
        attendancePercentage = ((presentDays + lateDays) / totalDays * 100);
      }
      
      // Determine academic tier based on attendance
      let academicTier = "STABLE";
      let statusInsight = "";
      if (attendancePercentage < 50) {
        academicTier = "CRITICAL RISK";
        statusInsight = "⚠️ Critical: Attendance is below 50%. Immediate intervention required.";
      } else if (attendancePercentage < 70) {
        academicTier = "NEEDS ATTENTION";
        statusInsight = "⚠️ Warning: Attendance is below 70%. Needs improvement.";
      } else if (attendancePercentage > 90) {
        academicTier = "ELITE PRODIGY";
        statusInsight = "🏆 Excellent! Outstanding attendance record. Keep it up!";
      } else {
        statusInsight = "✅ Stable: Maintaining good attendance. Continue the consistency.";
      }
      
      // ========== REAL ENGAGEMENT SCORE (Based on submissions) ==========
      const submissions = await Submission.find({ studentId: studentId });
      const submittedCount = submissions.length;
      
      let engagementScore = 0;
      if (totalAssignments > 0) {
        engagementScore = (submittedCount / totalAssignments) * 100;
      }
      
      // Calculate approved submissions count
      const approvedCount = submissions.filter(s => s.status === "approved").length;
      const pendingCount = submissions.filter(s => s.status === "pending").length;
      const rejectedCount = submissions.filter(s => s.status === "rejected").length;
      
      // Enhanced behavioral insight based on real data
      let behavioralInsight = statusInsight;
      
      if (submittedCount > 0 && totalAssignments > 0) {
        const submissionRate = (submittedCount / totalAssignments) * 100;
        if (submissionRate < 50) {
          behavioralInsight += ` 📚 Submission rate: ${submissionRate.toFixed(0)}% (Low). Please submit pending assignments.`;
        } else if (submissionRate > 80) {
          behavioralInsight += ` 📚 Great! ${submissionRate.toFixed(0)}% assignment submission rate.`;
        }
        
        if (rejectedCount > 0) {
          behavioralInsight += ` 📝 ${rejectedCount} assignment(s) need revision.`;
        }
      }
      
      // Get last submission date for "Last Updated"
      let lastUpdated = null;
      if (submissions.length > 0) {
        const lastSubmission = submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        lastUpdated = lastSubmission.createdAt;
      } else if (attendanceRecords.length > 0) {
        const lastAttendance = attendanceRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        lastUpdated = lastAttendance.date;
      }
      
      return {
        _id: rawDoc._id,
        name: rawDoc.name,
        fatherName: rawDoc.fatherName,
        motherName: rawDoc.motherName,
        email: rawDoc.email,
        phone: rawDoc.phone,
        cnic: rawDoc.cnic,
        address: rawDoc.address,
        city: rawDoc.city,
        rollNo: rawDoc.rollNo,
        className: rawDoc.className,
        section: rawDoc.section,
        targetCourse: rawDoc.targetCourse,
        photoUrl: rawDoc.photoUrl || null,
        photoPublicId: rawDoc.photoPublicId || null,
        status: rawDoc.status,
        admissionDate: rawDoc.admissionDate,
        isOnline: rawDoc.isOnline,
        lastSeen: rawDoc.lastSeen,
        aiMetrics: {
          attendancePercentage: `${attendancePercentage.toFixed(1)}%`,
          academicTier: academicTier,
          behavioralInsight: behavioralInsight,
          engagementScore: `${Math.min(100, Math.round(engagementScore))}%`,
          submissionsSubmitted: submittedCount,
          submissionsApproved: approvedCount,
          submissionsPending: pendingCount,
          submissionsRejected: rejectedCount,
          totalAssignments: totalAssignments,
          lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          }) : "N/A"
        }
      };
    }));
    
    // Calculate global insights from real data
    const totalSubmissionsAll = await Submission.countDocuments({});
    const avgEngagement = totalStudents > 0 ? (totalSubmissionsAll / (totalStudents * totalAssignments)) * 100 : 0;
    const anomaliesDetected = aiEvaluatedStudents.filter(s => s.aiMetrics.academicTier === "CRITICAL RISK").length;
    const atRiskStudents = aiEvaluatedStudents.filter(s => parseFloat(s.aiMetrics.attendancePercentage) < 70).length;
    
    const operationalAlerts = [];
    if (anomaliesDetected > 0) {
      operationalAlerts.push(`🚨 RISK ALERT: ${anomaliesDetected} student(s) flagged with critical risk.`);
    }
    if (atRiskStudents > 0) {
      operationalAlerts.push(`⚠️ ATTENTION: ${atRiskStudents} student(s) have attendance below 70%.`);
    }
    if (operationalAlerts.length === 0) {
      operationalAlerts.push("✅ All monitored student trajectories executing on stable parameters.");
    }
    
    // Calculate active users (students with submissions in last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const activePortalUsers = await Submission.distinct("studentId", { 
      createdAt: { $gte: lastWeek } 
    });
    
    // Calculate average attendance across all students
    let totalAttendanceSum = 0;
    let studentsWithAttendance = 0;
    for (const student of aiEvaluatedStudents) {
      const attendance = parseFloat(student.aiMetrics.attendancePercentage);
      if (attendance > 0) {
        totalAttendanceSum += attendance;
        studentsWithAttendance++;
      }
    }
    const averageAttendance = studentsWithAttendance > 0 ? (totalAttendanceSum / studentsWithAttendance).toFixed(1) : 0;
    
    // Calculate predicted dropouts (students with <50% attendance or no submissions)
    const predictedDropouts = aiEvaluatedStudents.filter(s => 
      parseFloat(s.aiMetrics.attendancePercentage) < 50 || 
      s.aiMetrics.submissionsSubmitted === 0
    ).length;
    
    const aiGlobalInsights = {
      globalEngagementIndex: `${Math.min(100, Math.round(avgEngagement))}%`,
      liveAnomaliesCount: anomaliesDetected,
      structuralTriggers: operationalAlerts,
      activePortalUsers: activePortalUsers.length,
      averageAttendance: `${averageAttendance}%`,
      predictedDropouts: predictedDropouts,
      totalSubmissions: totalSubmissionsAll,
      totalAssignments: totalAssignments
    };

    return NextResponse.json({ 
      students: aiEvaluatedStudents,
      aiGlobalInsights,
      pagination: {
        total: totalStudents,
        page: page,
        totalPages: Math.ceil(totalStudents / limit),
        hasMore: skip + aiEvaluatedStudents.length < totalStudents
      }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const result = await User.deleteMany({ role: "student" });
    return NextResponse.json({ 
      message: `${result.deletedCount} students deleted successfully!`,
      count: result.deletedCount 
    }, { status: 200 });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json({ message: "Failed to delete students" }, { status: 500 });
  }
}