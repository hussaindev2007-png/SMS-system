
// const TaskSchema = new mongoose.Schema({
  //   title: { type: String, required: true },
  //   description: { type: String },
  //   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher ki ID
  //   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin ki ID
  //   deadline: { type: Date },
  //   priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  //   status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  //   createdAt: { type: Date, default: Date.now },
  // });
  
  
  
  
  
  
  
  
  // import mongoose from "mongoose";




// const TaskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   subject: { type: String, required: true }, // Naya field: Task kis subject ka hai
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   deadline: { type: Date },
//   priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
//   status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });


// models/Task.js

// const TaskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   subject: { type: String, required: true },
//   // YAHAN CHANGE HAI: ref ko "Teacher" kar dein
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
//   assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   deadline: { type: Date },
//   priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
//   // Note: Aapke dashboard mein "pending" aur "completed" status use ho rahe hain
//   status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });
// export default mongoose.models.Task || mongoose.model("Task", TaskSchema);















// AI

import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  subject: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Subject", 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Teacher", 
    required: true 
  },
  assignedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  deadline: { 
    type: Date 
  },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"], 
    default: "pending" 
  },
  subTasks: [
    {
      text: { type: String, required: true },
      isCompleted: { type: Boolean, default: false }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);