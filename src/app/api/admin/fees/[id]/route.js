// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
    
//     // Params ko await karna Next.js 14/15 mein lazmi hai
//     const { id } = await params;
//     const body = await req.json();

//     // 1. ID Check
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ message: "Ghalat ID format!" }, { status: 400 });
//     }

//     // 2. PUT Logic (Full update/Replacement)
//     const updatedFee = await Fee.findByIdAndUpdate(
//       id,
//       body, // Pure data ko replace karega
//       { new: true, runValidators: true, overwrite: true } // overwrite: true record ko replace karne ke liye hota hai
//     );

//     if (!updatedFee) {
//       return NextResponse.json({ message: "Fee record nahi mila!" }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Fee record successfully replaced/updated!", 
//       data: updatedFee 
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Update fail ho gaya", error: error.message }, { status: 500 });
//   }
// }

// // DELETE wala logic wahi rahega jo pehle tha
// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;

//     const deletedFee = await Fee.findByIdAndDelete(id);

//     if (!deletedFee) {
//       return NextResponse.json({ message: "Record pehle hi delete ho chuka hai!" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Fee record permanent delete ho gaya!" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Deletion error", error: error.message }, { status: 500 });
//   }
// }





























// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
//     const body = await req.json();

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ message: "Ghalat ID format!" }, { status: 400 });
//     }

//     // Naye schema ke mutabik data update
//     // Hum findByIdAndUpdate use kar rahe hain taake specific fields validate hon
//     const updatedFee = await Fee.findByIdAndUpdate(
//       id,
//       {
//         month: body.month,
//         amount: Number(body.amount),
//         status: body.status,
//         feeType: body.feeType || "monthly", // Default monthly
//         dueDate: body.dueDate || null,
//         className: body.className
//       },
//       { new: true, runValidators: true } 
//     );

//     if (!updatedFee) {
//       return NextResponse.json({ message: "Fee record nahi mila!" }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Fee record successfully updated!", 
//       data: updatedFee 
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Update fail ho gaya", error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
//     }

//     const deletedFee = await Fee.findByIdAndDelete(id);

//     if (!deletedFee) {
//       return NextResponse.json({ message: "Record pehle hi delete ho chuka hai!" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Fee record permanent delete ho gaya!" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Deletion error", error: error.message }, { status: 500 });
//   }
// }



































// import dbConnect from "@/lib/mongodb";
// import Fee from "@/models/Fee";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function PUT(req, { params }) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
//     const body = await req.json();

//     // Boss: Standard ID validation with English response
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ message: "Invalid ID format provided." }, { status: 400 });
//     }

//     // Update data according to the schema
//     const updatedFee = await Fee.findByIdAndUpdate(
//       id,
//       {
//         month: body.month,
//         amount: Number(body.amount),
//         status: body.status,
//         feeType: body.feeType || "monthly",
//         dueDate: body.dueDate || null,
//         className: body.className
//       },
//       { new: true, runValidators: true } 
//     );

//     if (!updatedFee) {
//       return NextResponse.json({ message: "Fee record not found." }, { status: 404 });
//     }

//     return NextResponse.json({ 
//       message: "Fee record has been successfully updated.", 
//       data: updatedFee 
//     }, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ 
//       message: "Failed to update the record.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ message: "The provided ID is invalid." }, { status: 400 });
//     }

//     const deletedFee = await Fee.findByIdAndDelete(id);

//     if (!deletedFee) {
//       return NextResponse.json({ message: "Record not found or already deleted." }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Fee record has been permanently deleted." }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ 
//       message: "An error occurred during deletion.", 
//       error: error.message 
//     }, { status: 500 });
//   }
// }










import dbConnect from "@/lib/mongodb";
import Fee from "@/models/Fee";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper function to check and update overdue status
const checkAndUpdateOverdue = async (feeId) => {
  const fee = await Fee.findById(feeId);
  if (!fee) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // If fee is unpaid/pending and due date has passed, mark as overdue
  if (fee.status !== "paid" && fee.dueDate && fee.dueDate < today) {
    fee.status = "overdue";
    await fee.save();
    return true;
  }
  return false;
};

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    const body = await req.json();

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid ID format provided." 
      }, { status: 400 });
    }

    // Build update object - only include fields that are provided
    const updateData = {};
    
    if (body.month !== undefined) updateData.month = body.month;
    if (body.amount !== undefined) updateData.amount = Number(body.amount);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.feeType !== undefined) updateData.feeType = body.feeType;
    if (body.className !== undefined) updateData.className = body.className;
    if (body.discount !== undefined) updateData.discount = Number(body.discount);
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.collectedBy !== undefined) updateData.collectedBy = body.collectedBy;
    if (body.rollNo !== undefined) updateData.rollNo = body.rollNo;
    
    // Handle amount paid (auto-calculate status if needed)
    if (body.amountPaid !== undefined) {
      updateData.amountPaid = Number(body.amountPaid);
      
      // Get current fee to check total amount
      const currentFee = await Fee.findById(id);
      if (currentFee) {
        const totalAmount = currentFee.amount - (currentFee.discount || 0);
        
        if (updateData.amountPaid >= totalAmount) {
          updateData.status = "paid";
          updateData.paymentDate = new Date();
        } else if (updateData.amountPaid > 0) {
          updateData.status = "partially-paid";
        }
      }
    }
    
    // Handle dates properly
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    
    if (body.paymentDate !== undefined) {
      updateData.paymentDate = body.paymentDate ? new Date(body.paymentDate) : null;
    }

    // Update fee record
    const updatedFee = await Fee.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('studentId', 'name rollNo className fatherName photoUrl');

    if (!updatedFee) {
      return NextResponse.json({ 
        success: false,
        message: "Fee record not found." 
      }, { status: 404 });
    }

    // Check if fee should be marked as overdue
    await checkAndUpdateOverdue(id);
    
    // Fetch again to get updated status
    const finalFee = await Fee.findById(id).populate('studentId', 'name rollNo className fatherName photoUrl');

    // Generate status message
    let statusMessage = "Fee record updated successfully!";
    if (finalFee.status === "overdue") {
      statusMessage = "Fee marked as overdue because due date has passed.";
    } else if (finalFee.status === "paid") {
      statusMessage = "Fee marked as paid! Payment recorded successfully.";
    } else if (finalFee.status === "partially-paid") {
      statusMessage = "Partial payment recorded. Remaining balance pending.";
    }

    return NextResponse.json({ 
      success: true,
      message: statusMessage, 
      data: finalFee 
    }, { status: 200 });

  } catch (error) {
    console.error("Fee update error:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to update fee record.", 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false,
        message: "Invalid ID provided." 
      }, { status: 400 });
    }

    // Check if fee exists before deleting
    const feeToDelete = await Fee.findById(id);
    
    if (!feeToDelete) {
      return NextResponse.json({ 
        success: false,
        message: "Record not found or already deleted." 
      }, { status: 404 });
    }

    // Store info for response message
    const studentName = feeToDelete.studentId?.name || "Student";
    const month = feeToDelete.month;

    const deletedFee = await Fee.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true,
      message: `Fee record for ${studentName} (${month}) deleted successfully!`,
      deleted: {
        studentName,
        month,
        amount: feeToDelete.amount
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Fee delete error:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to delete fee record.", 
      error: error.message 
    }, { status: 500 });
  }
}