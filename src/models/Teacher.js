// import mongoose from "mongoose";

// const TeacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     unique: true, 
//     required: true,
//     lowercase: true,
//     trim: true 
//   },
//   password: { type: String, required: true },
//   role: { type: String, default: "teacher" },
  
//   // Teachers ke liye sirf subjects honge
//   subject: { 
//     type: [String], 
//     default: [] 
//   },
//   phone: { type: String },
  
//   status: { 
//     type: String, 
//     enum: ["active", "inactive"], 
//     default: "active" 
//   },

//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: Date.now },

// }, { timestamps: true });





// // Check karein ke model pehle se register na ho
// const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
// export default Teacher;


// ------------------------------------------------------------------------------




// import mongoose from "mongoose";

// const TeacherSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     unique: true, 
//     required: true,
//     lowercase: true,
//     trim: true 
//   },
//   password: { type: String, required: true },
//   role: { type: String, default: "teacher" },
  
//   // Boss: Array of ObjectIds use kar rahe hain taake Subjects model se link ho sake
//   subjects: [{ 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Subject" 
//   }],
  
//   phone: { type: String },
  
//   // Boss: Default status 'pending' rakha hai approval system ke liye
//   status: { 
//     type: String, 
//     enum: ["pending", "approved", "rejected", "active", "inactive"], 
//     default: "pending" 
//   },

//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: Date.now },

// }, { timestamps: true });

// // Model check logic
// const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
// export default Teacher;





// =-----------------------------------------------------------------------

import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true 
  },
  password: { type: String, required: true },
  role: { type: String, default: "teacher" },
  
  // Subjects array to link with Subject model
  subjects: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Subject" 
  }],
  
  phone: { type: String },
  
  // Status for approval system
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected", "active", "inactive"], 
    default: "pending" 
  },

  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },

  // TEACHER ID CARD FIELDS
  teacherId: { 
    type: String, 
    unique: true,
    sparse: true 
  },
  
  
  qualification: { 
    type: String,
    default: ""
  },
  
  joiningDate: { 
    type: Date, 
    default: Date.now 
  },
  
  photoUrl: { 
    type: String,
    default: null 
  },
  
  photoPublicId: { 
    type: String,
    default: null 
  },
  
  teacherCode: { 
    type: String,
    unique: true,
    sparse: true 
  },
  
  cardNumber: { 
    type: String,
    unique: true,
    sparse: true 
  },

  // DEVICE SECURITY FIELDS
  registeredDevices: [{
    deviceId: { type: String, required: true },
    deviceName: { type: String, default: "Unknown Device" },
    lastUsed: { type: Date, default: Date.now },
    ipAddress: { type: String },
    isActive: { type: Boolean, default: true }
  }],
  
  maxDevices: { type: Number, default: 2 },
  
  // ✅ 2FA SETTINGS
  twoFactorEnabled: { type: Boolean, default: true },
  twoFactorMethod: { type: String, enum: ["email", "sms", "authenticator"], default: "email" },
  backupCodes: [{ type: String }],
  
  // Login security
  loginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  lockUntil: { type: Date, default: null },
  preferences: {
  language: { type: String, enum: ["english", "urdu"], default: "english" },
  theme: { type: String, enum: ["dark", "light"], default: "dark" },
  dashboardLayout: { type: String, enum: ["compact", "comfortable"], default: "comfortable" },
  dateFormat: { type: String, enum: ["DD/MM/YYYY", "MM/DD/YYYY"], default: "DD/MM/YYYY" },
  timeZone: { type: String, default: "Asia/Karachi" }
},
  
  // Session management
  activeSessions: [{
    sessionId: { type: String },
    deviceId: { type: String },
    loginAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  }]

}, { timestamps: true });

// Generate teacher code before saving
TeacherSchema.pre('save', async function() {
  if (!this.teacherCode && this.isNew) {
    const year = new Date().getFullYear();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.teacherCode = `TCH${year}${randomStr}`;
  }
  
  if (!this.teacherId && this.isNew) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.teacherId = `TID${year}${randomNum}`;
  }
  
  if (!this.cardNumber && this.isNew) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    this.cardNumber = `TCRD${year}${randomNum}`;
  }
  
  // Generate backup codes if 2FA enabled and no backup codes
  if (this.twoFactorEnabled && (!this.backupCodes || this.backupCodes.length === 0) && this.isNew) {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    this.backupCodes = codes;
  }
  
  
});

// Method to register a new device
TeacherSchema.methods.registerDevice = async function(deviceId, deviceName, ipAddress) {
  const existingDevice = this.registeredDevices.find(d => d.deviceId === deviceId);
  
  if (existingDevice) {
    existingDevice.lastUsed = new Date();
    existingDevice.ipAddress = ipAddress;
    existingDevice.isActive = true;
  } else {
    if (this.registeredDevices.length >= this.maxDevices) {
      throw new Error(`Maximum ${this.maxDevices} devices allowed. Please remove an old device first.`);
    }
    this.registeredDevices.push({
      deviceId,
      deviceName,
      ipAddress,
      lastUsed: new Date(),
      isActive: true
    });
  }
  
  await this.save();
  return true;
};

// Method to remove a device
TeacherSchema.methods.removeDevice = async function(deviceId) {
  this.registeredDevices = this.registeredDevices.filter(d => d.deviceId !== deviceId);
  await this.save();
  return true;
};

// Method to check if device is authorized
TeacherSchema.methods.isDeviceAuthorized = function(deviceId) {
  const device = this.registeredDevices.find(d => d.deviceId === deviceId && d.isActive);
  return !!device;
};

// Method to record login attempt
TeacherSchema.methods.recordLoginAttempt = async function(success) {
  if (success) {
    this.loginAttempts = 0;
    this.accountLocked = false;
    this.lockUntil = null;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5) {
      this.accountLocked = true;
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
    }
  }
  await this.save();
};

// Method to check if account is locked
TeacherSchema.methods.isAccountLocked = function() {
  if (!this.accountLocked) return false;
  if (this.lockUntil && this.lockUntil < new Date()) {
    this.accountLocked = false;
    this.loginAttempts = 0;
    this.lockUntil = null;
    this.save();
    return false;
  }
  return true;
};

// Method to generate new backup codes
TeacherSchema.methods.generateBackupCodes = function() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  this.backupCodes = codes;
  return codes;
};

// Method to disable 2FA
TeacherSchema.methods.disable2FA = async function() {
  this.twoFactorEnabled = false;
  this.backupCodes = [];
  await this.save();
  return true;
};

// Method to enable 2FA
TeacherSchema.methods.enable2FA = async function() {
  this.twoFactorEnabled = true;
  if (!this.backupCodes || this.backupCodes.length === 0) {
    this.generateBackupCodes();
  }
  await this.save();
  return true;
};

// Model check logic
const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
export default Teacher;