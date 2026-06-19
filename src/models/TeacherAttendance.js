import mongoose from "mongoose";

const TeacherAttendanceSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent", "late"], default: "present" },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  source: { type: String, enum: ["QR", "Manual"], default: "QR" },
  verifiedBy: { type: String, default: "QR Scan" }
}, { timestamps: true });

// One attendance per teacher per day
TeacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

export default mongoose.models.TeacherAttendance || mongoose.model("TeacherAttendance", TeacherAttendanceSchema);