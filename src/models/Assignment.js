// import mongoose from "mongoose";

// const AssignmentSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   subject: { type: String, required: true },
  
//   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
//   teacherName: { type: String, required: true }, 

//   targetClass: { type: String, required: true }, 
//   dueDate: { type: Date, required: true },
  
//   // --- Nayi Fields ---
//   maxMarks: { type: Number, default: 100 }, // Grading ke liye
//   totalSubmissions: { type: Number, default: 0 }, // Dashboard par dikhane ke liye
//   isLocked: { type: Boolean, default: false }, // Deadline ke baad manually lock karne ke liye
//   // -------------------

//   status: { 
//     type: String, 
//     enum: ['active', 'expired', 'completed'], 
//     default: 'active' 
//   },
//   attachments: { type: String }, 
// }, { timestamps: true });

// export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);







// import mongoose from "mongoose";

// const AssignmentSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }, // 👈 Changed to ObjectId
//   subjectName: { type: String }, // 👈 Add this for quick display
  
//   teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
//   teacherName: { type: String, required: true }, 

//   targetClass: { type: String, required: true }, 
//   dueDate: { type: Date, required: true },
  
//   maxMarks: { type: Number, default: 100 },
//   totalSubmissions: { type: Number, default: 0 },
//   isLocked: { type: Boolean, default: false },

//   status: { 
//     type: String, 
//     enum: ['active', 'expired', 'completed'], 
//     default: 'active' 
//   },
//   attachments: { type: String }, 
// }, { timestamps: true });

// export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);












// import mongoose from "mongoose";

// const TaskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, default: "" },
  
//   // Assigned to (Teacher)
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  
//   // Assigned by (Admin)
//   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  
//   // Subject
//   subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  
//   // Priority
//   priority: { 
//     type: String, 
//     enum: ["low", "medium", "high"], 
//     default: "medium" 
//   },
  
//   // Deadline
//   deadline: { type: Date, default: null },
  
//   // Status
//   status: { 
//     type: String, 
//     enum: ["pending", "in-progress", "completed"], 
//     default: "pending" 
//   },
  
//   // ✅ ADD THIS - Sub-tasks field
//   subTasks: [{
//     text: { type: String, required: true },
//     title: { type: String },  // Alternative field name
//     isCompleted: { type: Boolean, default: false },
//     completed: { type: Boolean, default: false }  // Alternative field name
//   }],
  
//   // Progress percentage (optional, can be calculated)
//   progress: { type: Number, default: 0 },
  
// }, { timestamps: true });

// // Pre-save middleware to update progress based on sub-tasks
// TaskSchema.pre('save', function(next) {
//   if (this.subTasks && this.subTasks.length > 0) {
//     const completedCount = this.subTasks.filter(st => st.isCompleted || st.completed).length;
//     this.progress = Math.round((completedCount / this.subTasks.length) * 100);
    
//     // Auto-update status if all sub-tasks completed
//     if (completedCount === this.subTasks.length && this.status !== "completed") {
//       this.status = "completed";
//     }
//   }
//   next();
// });

// export default mongoose.models.Task || mongoose.model("Task", TaskSchema);























import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  
  // Subject
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  subjectName: { type: String },
  
  // Teacher info
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teacherName: { type: String, required: true },
  
  // Class info
  targetClass: { type: String, required: true },
  
  // Dates
  dueDate: { type: Date, required: true },
  
  // Marks
  maxMarks: { type: Number, default: 100 },
  totalSubmissions: { type: Number, default: 0 },
  
  // Lock status
  isLocked: { type: Boolean, default: false },
  
  // Chapter reference (for AI generated)
  chapterReference: { type: Number },
  chapterName: { type: String },
  
  // ✅ FIX: Status enum with correct values
  status: { 
    type: String, 
    enum: ["active", "expired", "draft"], 
    default: "active" 
  },
  
  attachments: { type: String },
  
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);