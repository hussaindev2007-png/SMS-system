import mongoose from "mongoose";

const ClassSectionSchema = new mongoose.Schema({
  className: { 
    type: String, 
    required: true,
    unique: true,
    // ✅ NO validation - any string allowed
    // Can be: "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Pre-9", "Nursery", etc.
  },
  sections: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(s => ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(s));
      },
      message: "Sections must be A, B, C, D, E, F, or G"
    }
  },
  maxStudentsPerSection: {
    type: Number,
    default: 30,
    min: 1,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const SchoolConfigSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    required: true,
    default: () => {
      const year = new Date().getFullYear();
      return `${year}-${year + 1}`;
    }
  },
  classConfigs: [ClassSectionSchema],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

// Add compound index to ensure unique class names within a config
SchoolConfigSchema.index({ 'classConfigs.className': 1 });

export default mongoose.models.SchoolConfig || mongoose.model("SchoolConfig", SchoolConfigSchema);