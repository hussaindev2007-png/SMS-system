

// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true 
//   },
//   email: { 
//     type: String, 
//     unique: true, 
//     sparse: true, 
//     },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   role: { 
//     type: String, 
//     enum: [ "teacher", "student"], 
//     default: "student" 
//   },
 
//   subject: { type: String },
//   phone: { type: String },
//   className: { type: String }, 
 

  
//   rollNo: { type: String, sparse: true, unique: true }, // Unique constraint
  
  
//   section: { type: String, default: "A" },
//  status: { 
//     type: String, 
//     enum: ["active", "inactive"], 
//     default: "inactive" 
//   },
// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model("User", UserSchema);
















// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, sparse: true },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["teacher", "student"], 
//     default: "student" 
//   },
//   subject: { type: String },
//   phone: { type: String },
//   className: { type: String }, 
//   rollNo: { type: String, default: null }, 
  
//   section: { 
//     type: String, 
//     uppercase: true, 
//     default: "PENDING" 
//   },
  
//   // 🔒 ADMISSION LOCK: Isay logout par touch nahi karna
//   status: { 
//     type: String, 
//     enum: ["active", "inactive"], 
//     default: "inactive" 
//   },

//   // 🟢 ONLINE STATUS: Isay login/logout par change karein
//   isOnline: { 
//     type: Boolean, 
//     default: false 
//   },

//   lastSeen: { type: Date, default: Date.now }

// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model("User", UserSchema);























// updated

// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, sparse: true },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["teacher", "student", "admin"], // Admin bhi add kar diya safety ke liye
//     default: "student" 
//   },
//   subject: { type: String },
//   phone: { type: String },
//   className: { type: String }, 
//   rollNo: { type: String, unique: true, sparse: true, default: null }, // Unique zaroori hai
  
//   section: { 
//     type: String, 
//     uppercase: true, 
//     default: "A" // PENDING ki jagah default "A" behtar hai reports ke liye
//   },
  
//   status: { 
//     type: String, 
//     enum: ["active", "inactive"], 
//     default: "active" // Card generate karne ke liye active hona chahiye
//   },

//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: Date.now },
//   subject: { 
//   type: [String], // Ab ye array ban gaya hai
//   default: [] 
// }

// }, { timestamps: true });

// export default mongoose.models.User || mongoose.model("User", UserSchema);






















// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     unique: true, 
//     sparse: true,
//     lowercase: true,
//     trim: true 
//   },
//   password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["student"], 
//     default: "student" 
//   },
//   // Subject ko sahi tarah array define kiya
  
//   phone: { type: String },
//   className: { type: String }, 
  
//   // RollNo fix: unique tabhi kaam karega jab value null na ho
//  rollNo: { 
//   type: String, 
//   unique: true, 
//   sparse: true,
//   default: undefined // null ki jagah undefined
// },
//   section: { 
//     type: String, 
//     uppercase: true, 
//     default: "A" 
//   },
  
//   status: { 
//     type: String, 
//     enum: ["active", "inactive"], 
//     default: "active" 
//   },

//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: Date.now },

// }, { timestamps: true });

// // Export sirf ek baar hona chahiye
// const User = mongoose.models.User || mongoose.model("User", UserSchema);
// export default User;



// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   fatherName: { type: String },
//   email: { 
//     type: String, 
//     unique: true, 
//     sparse: true,
//     lowercase: true,
//     trim: true 
//   },
//   // password: { type: String, required: true },
//   role: { 
//     type: String, 
//     enum: ["student", "teacher", "admin"], 
//     default: "student" 
//   },
  
//   phone: { type: String },
//   className: { type: String }, 
  
//   rollNo: { 
//     type: String, 
//     unique: true, 
//     sparse: true,
//     default: undefined
//   },
//   section: { 
//     type: String, 
//     uppercase: true, 
//     default: "A" 
//   },
  
//   // 👇 PHOTO FIELDS (ADD THESE)
//   photoUrl: { type: String, default: null },
//   photoPublicId: { type: String, default: null },
  
//   status: { 
//     type: String, 
//     enum: ["active", "inactive"], 
//     default: "active" 
//   },

//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: Date.now },

// }, { timestamps: true });

// // Export
// const User = mongoose.models.User || mongoose.model("User", UserSchema);
// export default User;












import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, default: "" },
  motherName: { type: String, default: "" },
  email: { 
    type: String, 
    unique: true, 
    sparse: true,
    lowercase: true,
    trim: true 
  },
  phone: { type: String, default: "" },
  cnic: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  
  role: { 
    type: String, 
    enum: ["student", "teacher", "admin", "staff"], 
    default: "student" 
  },
  
  // Student Specific Fields
  rollNo: { 
    type: String, 
    unique: true, 
    sparse: true,
    default: undefined
  },
  className: { type: String, default: "" },
  section: { 
    type: String, 
    uppercase: true, 
    default: "A" 
  },
  targetCourse: { type: String, default: "" },
  
  // Teacher Specific Fields
  teacherId: { type: String, default: "" },
  qualification: { type: String, default: "" },
  specialization: { type: String, default: "" },
  joiningDate: { type: Date, default: null },
  
  // Photo Fields
  photoUrl: { type: String, default: null },
  photoPublicId: { type: String, default: null },
  
  // Status Fields
  status: { 
    type: String, 
    enum: ["active", "inactive", "graduated", "transferred"], 
    default: "active" 
  },
  admissionDate: { type: Date, default: Date.now },
  graduationDate: { type: Date, default: null },
  
  // Online Status
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },

}, { timestamps: true });

// ========== INDEXES FOR REPORT QUERIES ==========
UserSchema.index({ rollNo: 1 });
UserSchema.index({ className: 1, section: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ admissionDate: -1 });
UserSchema.index({ name: 1 });

// ========== VIRTUAL FIELDS ==========
UserSchema.virtual('fullName').get(function() {
  return this.name;
});

UserSchema.virtual('fullAddress').get(function() {
  return `${this.address}, ${this.city}`;
});

UserSchema.virtual('studentId').get(function() {
  return this.rollNo ? `STU-${this.rollNo}` : null;
});

// ========== INSTANCE METHODS ==========
UserSchema.methods.getReportData = function() {
  return {
    id: this._id,
    name: this.name,
    fatherName: this.fatherName,
    motherName: this.motherName,
    rollNo: this.rollNo,
    className: this.className,
    section: this.section,
    course: this.targetCourse,
    email: this.email,
    phone: this.phone,
    cnic: this.cnic,
    address: this.address,
    city: this.city,
    photoUrl: this.photoUrl,
    admissionDate: this.admissionDate,
    status: this.status,
    createdAt: this.createdAt
  };
};

// ========== STATIC METHODS ==========
UserSchema.statics.getStudentReport = async function(studentId) {
  return await this.findById(studentId).select(
    "name fatherName motherName email phone cnic address city rollNo className section targetCourse photoUrl admissionDate status createdAt"
  ).lean();
};

UserSchema.statics.getAllStudentsByClass = async function(className, section) {
  const query = { role: "student", status: "active" };
  if (className) query.className = className;
  if (section) query.section = section;
  
  return await this.find(query)
    .select("name rollNo className section fatherName email phone photoUrl")
    .sort({ rollNo: 1 })
    .lean();
};

UserSchema.statics.getClassWiseReport = async function() {
  return await this.aggregate([
    { $match: { role: "student", status: "active" } },
    { $group: {
      _id: { className: "$className", section: "$section" },
      count: { $sum: 1 },
      students: { $push: {
        name: "$name",
        rollNo: "$rollNo",
        fatherName: "$fatherName",
        email: "$email",
        phone: "$phone"
      }}
    }},
    { $sort: { "_id.className": 1, "_id.section": 1 } }
  ]);
};

// Export
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;