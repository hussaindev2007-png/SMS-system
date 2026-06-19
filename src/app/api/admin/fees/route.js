// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// // GET: Saari fees nikalne ke liye
// export async function GET() {
//   try {
//     await dbConnect();
//     const fees = await Fee.find({})
//       .populate("studentId", "name rollNo")
//       .sort({ createdAt: -1 });
//     return NextResponse.json(fees);
//   } catch (error) {
//     return NextResponse.json({ message: "Fetch Error", error: error.message }, { status: 500 });
//   }
// }

// // POST: Nayi fee record banane ke liye
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { rollNo, month, amount, status } = await req.json();

//     const student = await User.findOne({ rollNo, role: "student" });
//     if (!student) {
//       return NextResponse.json({ message: "Student nahi mila!" }, { status: 404 });
//     }

//     const existingFee = await Fee.findOne({ studentId: student._id, month });
//     if (existingFee) {
//       return NextResponse.json({ message: "Is mahine ki fee pehle hi jama hai!" }, { status: 400 });
//     }

//     const createdFee = await Fee.create({
//       studentId: student._id,
//       month,
//       amount,
//       status,
//       paymentDate: status === "paid" ? new Date() : null
//     });

//     const newFee = await Fee.findById(createdFee._id).populate("studentId", "name rollNo");

//     return NextResponse.json({ message: "Record ban gaya!", data: newFee }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }


























// th


// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { rollNo, month, amount, status } = await req.json();

//     // 1. Normalize Roll No
//     const cleanRollNo = rollNo.trim();

//     const student = await User.findOne({ rollNo: cleanRollNo, role: "student" });
//     if (!student) {
//       return NextResponse.json({ message: "Student record not found!" }, { status: 404 });
//     }

//     // 2. Duplicate Check
//     const existingFee = await Fee.findOne({ studentId: student._id, month });
//     if (existingFee) {
//       return NextResponse.json({ message: "Fee already exists for this month!" }, { status: 400 });
//     }

//     const createdFee = await Fee.create({
//       studentId: student._id,
//       month,
//       amount: Number(amount),
//       status,
//       paymentDate: status === "paid" ? new Date() : null
//     });

//     const populatedFee = await Fee.findById(createdFee._id).populate("studentId", "name rollNo");
//     return NextResponse.json({ message: "Success!", data: populatedFee }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }











// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { rollNo, month, amount, status } = await req.json();

//     const cleanRollNo = rollNo.trim();

//     // 1. Find Student (Sath mein className bhi mangwa li)
//     const student = await User.findOne({ rollNo: cleanRollNo, role: "student" });
//     if (!student) {
//       return NextResponse.json({ message: "Student record not found!" }, { status: 404 });
//     }

//     // 2. Duplicate Check
//     const existingFee = await Fee.findOne({ studentId: student._id, month });
//     if (existingFee) {
//       return NextResponse.json({ message: "Fee already exists for this month!" }, { status: 400 });
//     }

//     // 3. Create Fee with className
//     const createdFee = await Fee.create({
//       studentId: student._id,
//       className: student.className, // ✅ Auto-fill from student record
//       month,
//       amount: Number(amount),
//       status,
//       paymentDate: status === "paid" ? new Date() : null
//     });

//     const populatedFee = await Fee.findById(createdFee._id).populate("studentId", "name rollNo");
//     return NextResponse.json({ message: "Success!", data: populatedFee }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }











// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// // ✅ 1. GET Method: Sara data fetch karne ke liye
// export async function GET() {
//   try {
//     await dbConnect();

//     // Hum Fee fetch kar rahe hain aur studentId se student ka Name aur RollNo nikaal rahe hain
//     const fees = await Fee.find({})
//       .populate("studentId", "name rollNo") 
//       .sort({ createdAt: -1 }); // Naya data sabse upar

//     return NextResponse.json({ success: true, data: fees }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Fetch failed", error: error.message }, { status: 500 });
//   }
// }

// // ✅ 2. POST Method: Naya record create karne ke liye (Aapka existing code)
// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { rollNo, month, amount, status } = await req.json();

//     const cleanRollNo = rollNo.trim();

//     const student = await User.findOne({ rollNo: cleanRollNo, role: "student" });
//     if (!student) {
//       return NextResponse.json({ message: "Student record not found!" }, { status: 404 });
//     }

//     const existingFee = await Fee.findOne({ studentId: student._id, month });
//     if (existingFee) {
//       return NextResponse.json({ message: "Fee already exists for this month!" }, { status: 400 });
//     }

//     const createdFee = await Fee.create({
//       studentId: student._id,
//       className: student.className, 
//       month,
//       amount: Number(amount),
//       status,
//       paymentDate: status === "paid" ? new Date() : null
//     });

//     const populatedFee = await Fee.findById(createdFee._id).populate("studentId", "name rollNo");
//     return NextResponse.json({ message: "Success!", data: populatedFee }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }

// ---------------------------------------------------------------------------------------------------------------




// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();
//     const fees = await Fee.find({})
//       .populate("studentId", "name rollNo") 
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, data: fees }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Fetch failed", error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { rollNo, month, amount, status, feeType } = await req.json();

//     const student = await User.findOne({ rollNo: rollNo.trim(), role: "student" });
//     if (!student) {
//       return NextResponse.json({ message: "Student record not found!" }, { status: 404 });
//     }

//     const existingFee = await Fee.findOne({ studentId: student._id, month, feeType: feeType || "monthly" });
//     if (existingFee) {
//       return NextResponse.json({ message: "Fee already exists for this category/month!" }, { status: 400 });
//     }

//     // Default Due Date: Is mahine ki 10 tareekh
//     const dueDate = new Date();
//     dueDate.setDate(10);

//     const createdFee = await Fee.create({
//       studentId: student._id,
//       rollNo: student.rollNo,
//       className: student.className, 
//       month,
//       amount: Number(amount),
//       status: status || "unpaid",
//       feeType: feeType || "monthly",
//       dueDate: dueDate,
//       paymentDate: status === "paid" ? new Date() : null,
//       discount: 0
//     });

//     const populatedFee = await Fee.findById(createdFee._id).populate("studentId", "name rollNo");
//     return NextResponse.json({ message: "Fee record created!", data: populatedFee }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
//   }
// }















































import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import User from "@/models/User";
import { NextResponse } from "next/server";

// Helper function to calculate due date (10th of month)
const calculateDueDate = (monthStr) => {
  try {
    const [monthName, year] = monthStr.trim().split(' ');
    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
    const dueDate = new Date(parseInt(year), monthIndex, 10, 23, 59, 59);
    return dueDate;
  } catch (error) {
    const defaultDate = new Date();
    defaultDate.setDate(10);
    if (defaultDate < new Date()) {
      defaultDate.setMonth(defaultDate.getMonth() + 1);
    }
    return defaultDate;
  }
};

// Helper function to check and update overdue fees
const updateOverdueFees = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result = await Fee.updateMany(
    {
      status: { $in: ["unpaid", "pending"] },
      dueDate: { $lt: today }
    },
    {
      $set: { status: "overdue" }
    }
  );
  
  return result.modifiedCount;
};

export async function GET(req) {
  try {
    await dbConnect();
    
    // Auto-update overdue fees before fetching
    await updateOverdueFees();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const className = searchParams.get("class") || "";
    const month = searchParams.get("month") || "";
    
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (status && status !== "all") {
      query.status = status;
    }
    
    if (className) {
      query.className = { $regex: new RegExp(className, "i") };
    }
    
    if (month) {
      query.month = { $regex: new RegExp(month, "i") };
    }

    // Get total count for pagination
    const totalFees = await Fee.countDocuments(query);

    // Fetch fees with pagination
    let fees = await Fee.find(query)
      .populate("studentId", "name rollNo className fatherName photoUrl") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If search term provided, filter after populate (for student name)
    if (search) {
      const searchLower = search.toLowerCase();
      fees = fees.filter(fee => 
        fee.studentId?.name?.toLowerCase().includes(searchLower) ||
        fee.rollNo?.toLowerCase().includes(searchLower) ||
        fee.className?.toLowerCase().includes(searchLower)
      );
    }

    // Get counts for dashboard stats
    const totalDue = await Fee.aggregate([
      { $match: { status: { $in: ["unpaid", "pending", "overdue"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const totalCollected = await Fee.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const overdueCount = await Fee.countDocuments({ status: "overdue" });
    const unpaidCount = await Fee.countDocuments({ status: "unpaid" });
    const paidCount = await Fee.countDocuments({ status: "paid" });

    return NextResponse.json({ 
      success: true, 
      data: fees,
      pagination: {
        total: totalFees,
        page: page,
        totalPages: Math.ceil(totalFees / limit),
        hasMore: skip + fees.length < totalFees
      },
      stats: {
        totalDue: totalDue[0]?.total || 0,
        totalCollected: totalCollected[0]?.total || 0,
        overdueCount,
        unpaidCount,
        paidCount
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Fee fetch error:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to fetch fees.", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { rollNo, month, amount, status, feeType, dueDate, discount } = await req.json();

    // Find student by roll number
    const student = await User.findOne({ 
      rollNo: { $regex: new RegExp(`^${rollNo.trim()}$`, "i") }, 
      role: "student" 
    });
    
    if (!student) {
      return NextResponse.json({ 
        success: false,
        message: "Student not found with this roll number." 
      }, { status: 404 });
    }

    // Check if fee already exists
    const existingFee = await Fee.findOne({ 
      studentId: student._id, 
      month, 
      feeType: feeType || "monthly" 
    });
    
    if (existingFee) {
      return NextResponse.json({ 
        success: false,
        message: "Fee already exists for this student for the selected month and type." 
      }, { status: 400 });
    }

    // Calculate due date (10th of the month from month string)
    let feeDueDate;
    if (dueDate) {
      feeDueDate = new Date(dueDate);
    } else {
      feeDueDate = calculateDueDate(month);
    }

    // Determine final status
    let finalStatus = status || "unpaid";
    let amountPaid = 0;
    let paymentDate = null;
    
    if (status === "paid") {
      amountPaid = Number(amount);
      paymentDate = new Date();
    }

    const createdFee = await Fee.create({
      studentId: student._id,
      rollNo: student.rollNo,
      className: student.className || "Not Assigned", 
      month,
      amount: Number(amount),
      amountPaid: amountPaid,
      status: finalStatus,
      feeType: feeType || "monthly",
      dueDate: feeDueDate,
      paymentDate: paymentDate,
      discount: discount || 0
    });

    const populatedFee = await Fee.findById(createdFee._id)
      .populate("studentId", "name rollNo className fatherName photoUrl");

    return NextResponse.json({ 
      success: true,
      message: "Fee record created successfully!", 
      data: populatedFee 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Fee creation error:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to create fee record.", 
      error: error.message 
    }, { status: 500 });
  }
}
