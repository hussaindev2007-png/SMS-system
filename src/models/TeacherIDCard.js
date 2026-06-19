import mongoose from "mongoose";

const TeacherIDCardSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    unique: true
  },
  cardNumber: { type: String, required: true, unique: true },
  teacherCode: { type: String, required: true, unique: true },  // For login
  qrCodeData: { type: String },  // Base64 QR code
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  photoUrl: { type: String }
}, { timestamps: true });

export default mongoose.models.TeacherIDCard || mongoose.model("TeacherIDCard", TeacherIDCardSchema);