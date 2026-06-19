import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, // Duplicate entry rokne ke liye
    uppercase: true, // Hamesha capital save hoga
    trim: true 
  },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin" // Record ke liye ke kis admin ne add kiya
  }
}, { timestamps: true });

const Subject = mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
export default Subject;