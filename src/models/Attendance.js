// import mongoose from "mongoose";
// const AttendanceSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   // YE DO FIELDS ADD KAREIN
//   studentName: { type: String, required: true }, 
//   rollNo: { type: String, required: true },
//   date: { type: Date, required: true },
//   status: { type: String, enum: ["present", "absent", "late", "leave"], default: "present" },
//   markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   className: { type: String, required: true },
//   section: { type: String, required: true }
// }, { timestamps: true });
// // Ek student ki ek din mein sirf ek hi attendance ho sakti hai
// AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);













// updated
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  // Yeh link hai User model ki _id se
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  studentName: { type: String, required: true }, 
  rollNo: { type: String, required: true },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["present", "absent", "late", "leave"], 
    default: "present" 
  },
  markedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  className: { type: String, required: true },
  section: { type: String, required: true },
  // 👇 ADD THESE FIELDS
  checkInTime: { 
    type: String, 
    default: null 
  },
  verifiedBy: { 
    type: String, 
    default: "QR Scan" 
  }
}, { timestamps: true });

// Ek student ki ek din mein ek hi attendance
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);