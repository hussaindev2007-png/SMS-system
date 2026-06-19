import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipientClass: { type: String, required: true }, // Kis class ke liye hai
  message: { type: String, required: true },
  type: { type: String, default: "assignment" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);