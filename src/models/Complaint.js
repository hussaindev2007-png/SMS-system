import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    category: {
      type: String,
      // Frontend se match karne ke liye enum update kar diya
      enum: ["Bug", "Idea", "Other", "Fee Issues", "Technical", "Academic"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    adminRemark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);