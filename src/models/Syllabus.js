// import mongoose from "mongoose";

// const SyllabusSchema = new mongoose.Schema({
//   // Existing fields - keep them
//   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
//   subjectName: { type: String, required: true },
//   targetClass: { type: String, required: true },
//   board: { type: String, required: true },
  
//   chapters: [
//     {
//       chapterNumber: { type: Number, required: true },
//       chapterName: { type: String, required: true },
//       topics: [{ type: String }],
//       // Optional: Add subtopics if needed
//       subTopics: [{ type: String }],
//       // Optional: Add page numbers from book
//       pageNumbers: { start: Number, end: Number }
//     }
//   ],
  
//   // 👇 Naye fields add kar (Extras for better tracking)
  
//   // PDF original filename store karne ke liye (optional)
//   pdfOriginalName: { type: String },
  
//   // PDF ka hash (duplicate upload rokne ke liye)
//   pdfHash: { type: String, unique: true, sparse: true },
  
//   // AI se extract kab hua
//   extractedByAI: { type: Boolean, default: true },
  
//   // AI ka response raw save karna (debugging ke liye)
//   rawAIResponse: { type: String },
  
//   // Manually verified hua ya nahi
//   isVerified: { type: Boolean, default: false },
  
//   // Year of syllabus (e.g., 2024, 2025)
//   academicYear: { type: String, default: new Date().getFullYear().toString() },
  
//   // Book edition
//   edition: { type: String, default: "1st" },
  
//   // Total chapters count (for quick access)
//   totalChapters: { type: Number, default: 0 },

//   // Status (active/inactive)
//   status: { type: String, enum: ["active", "inactive"], default: "active" }

// }, { timestamps: true });

// // Compound index for uniqueness (same class, subject, board, academicYear)
// SyllabusSchema.index(
//   { subjectId: 1, targetClass: 1, board: 1, academicYear: 1 }, 
//   { unique: true }
// );

// // Index for quick search queries
// SyllabusSchema.index({ subjectName: 1, targetClass: 1, board: 1 });

// // Pre-save middleware to auto-calculate totalChapters
// SyllabusSchema.pre('save', function(next) {
//   this.totalChapters = this.chapters.length;
//   next();
// });

// // Helper method to get chapter by number
// SyllabusSchema.methods.getChapterByNumber = function(chapterNumber) {
//   return this.chapters.find(ch => ch.chapterNumber === chapterNumber);
// };

// // Static method to find by class, subject, board
// SyllabusSchema.statics.findByClassSubjectBoard = function(targetClass, subjectName, board) {
//   return this.findOne({ targetClass, subjectName, board, status: "active" });
// };

// export default mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);


























































// import mongoose from "mongoose";

// const SyllabusSchema = new mongoose.Schema({
//   // Optional subjectId (no required)
//   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  
//   subjectName: { type: String, required: true },
//   targetClass: { type: String, required: true },
//   board: { type: String, required: true },
  
//   chapters: [
//     {
//       chapterNumber: { type: Number, required: true },
//       chapterName: { type: String, required: true },
//       topics: [{ type: String }],
//       subTopics: [{ type: String }],
//       pageNumbers: { start: Number, end: Number }
//     }
//   ],
  
//   pdfOriginalName: { type: String },
//   pdfHash: { type: String, unique: true, sparse: true },
//   extractedByAI: { type: Boolean, default: true },
//   rawAIResponse: { type: String },
//   isVerified: { type: Boolean, default: false },
//   academicYear: { type: String, default: new Date().getFullYear().toString() },
//   edition: { type: String, default: "1st" },
//   totalChapters: { type: Number, default: 0 },
//   status: { type: String, enum: ["active", "inactive"], default: "active" }

// }, { timestamps: true });

// // 👇 UPDATED UNIQUE INDEX: subjectId hata diya, subjectName add kar diya
// SyllabusSchema.index(
//   { subjectName: 1, targetClass: 1, board: 1, academicYear: 1 }, 
//   { unique: true }
// );

// // Index for quick search
// SyllabusSchema.index({ subjectName: 1, targetClass: 1, board: 1 });
// SyllabusSchema.index({ academicYear: 1 });

// // Pre-save middleware
// SyllabusSchema.pre('save', function(next) {
//   this.totalChapters = this.chapters.length;
//   return next();
// });

// // Helper methods
// SyllabusSchema.methods.getChapterByNumber = function(chapterNumber) {
//   return this.chapters.find(ch => ch.chapterNumber === chapterNumber);
// };

// SyllabusSchema.statics.findByClassSubjectBoard = function(targetClass, subjectName, board) {
//   return this.findOne({ targetClass, subjectName, board, status: "active" });
// };

// SyllabusSchema.statics.findLatestByClassSubjectBoard = function(targetClass, subjectName, board) {
//   return this.findOne({ targetClass, subjectName, board, status: "active" })
//     .sort({ academicYear: -1 });
// };

// export default mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);

























import mongoose from "mongoose";

const SyllabusSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  subjectName: { type: String, required: true },
  targetClass: { type: String, required: true },
  board: { type: String, required: true },
  
  chapters: [
    {
      chapterNumber: { type: Number },
      chapterName: { type: String, required: true },
      topics: [{ type: String }]
    }
  ],
  
  pdfOriginalName: { type: String },
  pdfHash: { type: String, unique: true, sparse: true },
  extractedByAI: { type: Boolean, default: true },
  rawAIResponse: { type: String },
  isVerified: { type: Boolean, default: false },
  academicYear: { type: String, default: new Date().getFullYear().toString() },
  totalChapters: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

// Unique index on subjectId, targetClass, board, academicYear
SyllabusSchema.index(
  { subjectId: 1, targetClass: 1, board: 1, academicYear: 1 }, 
  { unique: true }
);

// Index for quick search
SyllabusSchema.index({ subjectName: 1, targetClass: 1, board: 1 });

// Helper methods
SyllabusSchema.methods.getChapterByNumber = function(chapterNumber) {
  return this.chapters.find(ch => ch.chapterNumber === chapterNumber);
};

SyllabusSchema.statics.findByClassSubjectBoard = function(targetClass, subjectName, board) {
  return this.findOne({ targetClass, subjectName, board, status: "active" });
};

SyllabusSchema.statics.findLatestByClassSubjectBoard = function(targetClass, subjectName, board) {
  return this.findOne({ targetClass, subjectName, board, status: "active" })
    .sort({ academicYear: -1 });
};

export default mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);