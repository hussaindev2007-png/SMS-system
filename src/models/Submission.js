// import mongoose from "mongoose";


// const SubmissionSchema = new mongoose.Schema({
//   assignmentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Assignment', // Ye zaroori hye taake hum .populate() kar saken
//     required: true 
//   },
//   studentId: { type: String, required: true },
//   studentName: { type: String, required: true },
//   solutionUrl: { type: String, required: true },
//   notes: { type: String },
//   status: { 
//     type: String, 
//     enum: ['pending', 'reviewed', 'rejected',`approved`], 
//     default: 'pending' 
//   },
  
//   feedback: { type: String, default: "" }
// }, { timestamps: true });



// export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);












// name










// import mongoose from "mongoose";

// const SubmissionSchema = new mongoose.Schema({
//   assignmentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Assignment', 
//     required: true 
//   },
//   // ✅ FIX: String ki jagah ObjectId karein aur ref 'User' dein
//   studentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   studentName: { type: String, required: true },
//   solutionUrl: { type: String, required: true },
//   notes: { type: String },
//   status: { 
//     type: String, 
//     enum: ['pending', 'reviewed', 'rejected', 'approved'], 
//     default: 'pending' 
//   },
//   feedback: { type: String, default: "" }
// }, { timestamps: true });

// export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);














// cloude



// import mongoose from "mongoose";

// const SubmissionSchema = new mongoose.Schema({
//   assignmentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Assignment', 
//     required: true 
//   },
//   studentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     required: true 
//   },
//   studentName: { type: String, required: true },
  
//   // ✅ UPDATE: Cloudinary Data ko handle karne ke liye
//   solutionUrl: { type: String, required: true }, // File ka link (e.g. https://res.cloudinary.com/...)
  
//   cloudinaryId: { type: String }, // Cloudinary ki 'public_id' (File delete karne ke kaam aati hye)
  
//   fileType: { type: String, enum: ['pdf', 'link'], default: 'link' }, // Taake pata chale ye PDF hye ya GitHub link
  
//   notes: { type: String },
//   status: { 
//     type: String, 
//     enum: ['pending', 'reviewed', 'rejected', 'approved'], 
//     default: 'pending' 
//   },
//   feedback: { type: String, default: "" }
// }, { timestamps: true });

// export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);






















import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment', 
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  studentName: { type: String, required: true },
  
  solutionUrl: { type: String, required: true },
  cloudinaryId: { type: String },
  fileType: { type: String, enum: ['pdf', 'link'], default: 'link' },
  notes: { type: String },
  
  // ✅ FIX: Add 'approved' to enum
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'rejected', 'approved'], 
    default: 'pending' 
  },
  feedback: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);