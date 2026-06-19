import mongoose from "mongoose";

const StudentIDCardSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cardNumber: { type: String, unique: true },
  rollNumber: { type: String, required: true },
  course: { type: String, required: true },
  batch: { type: String },
  issueDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  qrCodeData: { type: String },
  photoUrl: { type: String },
  status: { type: String, enum: ['active', 'expired', 'blocked'], default: 'active' }
}, { timestamps: true });

export default mongoose.models.StudentIDCard || mongoose.model("StudentIDCard", StudentIDCardSchema);