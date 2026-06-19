// import mongoose from "mongoose";

// const AdminSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     lowercase: true,
//     trim: true 
//   },
//   password: { type: String, required: true },
//   role: { type: String, default: "admin" },
//   phone: { type: String },
  
//   // ✅ SECURITY FIELDS
//   // 2FA Settings
//   twoFactorEnabled: { type: Boolean, default: true },
//   twoFactorMethod: { type: String, enum: ["email", "sms", "authenticator"], default: "email" },
//   backupCodes: [{ type: String }],
  
//   // Login Security
//   loginAttempts: { type: Number, default: 0 },
//   accountLocked: { type: Boolean, default: false },
//   lockUntil: { type: Date, default: null },
  
//   // Last Login Tracking
//   lastLoginIP: { type: String, default: null },
//   lastLoginAt: { type: Date, default: null },
//   lastLoginDevice: { type: String, default: null },
  
//   // Session Management
//   activeSessions: [{
//     sessionId: { type: String },
//     deviceId: { type: String },
//     ipAddress: { type: String },
//     loginAt: { type: Date, default: Date.now },
//     expiresAt: { type: Date }
//   }],
  
//   // Super Admin Flag
//   isSuperAdmin: { type: Boolean, default: false },
  
//   // Status
//   status: { 
//     type: String, 
//     enum: ["active", "inactive", "suspended"], 
//     default: "active" 
//   },
  
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }

// }, { timestamps: true });

// // ==================== METHODS ====================

// // Record login attempt
// AdminSchema.methods.recordLoginAttempt = async function(success) {
//   if (success) {
//     this.loginAttempts = 0;
//     this.accountLocked = false;
//     this.lockUntil = null;
//   } else {
//     this.loginAttempts += 1;
//     if (this.loginAttempts >= 5) {
//       this.accountLocked = true;
//       this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
//     }
//   }
//   await this.save();
//   return true;
// };

// // Check if account is locked
// AdminSchema.methods.isAccountLocked = function() {
//   if (!this.accountLocked) return false;
//   if (this.lockUntil && this.lockUntil < new Date()) {
//     this.accountLocked = false;
//     this.loginAttempts = 0;
//     this.lockUntil = null;
//     this.save();
//     return false;
//   }
//   return true;
// };

// // Update last login info
// AdminSchema.methods.updateLastLogin = async function(ipAddress, deviceInfo) {
//   this.lastLoginIP = ipAddress;
//   this.lastLoginAt = new Date();
//   this.lastLoginDevice = deviceInfo;
//   this.isOnline = true;
//   await this.save();
//   return true;
// };

// // Generate backup codes for 2FA
// AdminSchema.methods.generateBackupCodes = function() {
//   const codes = [];
//   for (let i = 0; i < 8; i++) {
//     const code = Math.random().toString(36).substring(2, 10).toUpperCase();
//     codes.push(code);
//   }
//   this.backupCodes = codes;
//   return codes;
// };

// // Enable/Disable 2FA
// AdminSchema.methods.enable2FA = async function() {
//   this.twoFactorEnabled = true;
//   if (!this.backupCodes || this.backupCodes.length === 0) {
//     this.generateBackupCodes();
//   }
//   await this.save();
//   return true;
// };

// AdminSchema.methods.disable2FA = async function() {
//   this.twoFactorEnabled = false;
//   await this.save();
//   return true;
// };

// // Register active session
// AdminSchema.methods.registerSession = async function(sessionId, deviceId, ipAddress) {
//   this.activeSessions.push({
//     sessionId,
//     deviceId,
//     ipAddress,
//     loginAt: new Date(),
//     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
//   });
//   await this.save();
//   return true;
// };

// // Remove expired sessions
// AdminSchema.methods.cleanExpiredSessions = async function() {
//   this.activeSessions = this.activeSessions.filter(s => s.expiresAt > new Date());
//   await this.save();
//   return this.activeSessions.length;
// };

// // ==================== PRE-SAVE HOOK ====================
// AdminSchema.pre('save', function() {
//   this.updatedAt = new Date();
  
//   // Generate backup codes if 2FA enabled and no backup codes
//   if (this.twoFactorEnabled && (!this.backupCodes || this.backupCodes.length === 0) && this.isNew) {
//     const codes = [];
//     for (let i = 0; i < 8; i++) {
//       const code = Math.random().toString(36).substring(2, 10).toUpperCase();
//       codes.push(code);
//     }
//     this.backupCodes = codes;
//   }
  
  
// });

// const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
// export default Admin;
































import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  phone: { type: String },
  photoUrl: { type: String, default: null },
  
  // ✅ SECURITY FIELDS
  // 2FA Settings
  twoFactorEnabled: { type: Boolean, default: true },
  twoFactorMethod: { type: String, enum: ["email", "sms", "authenticator"], default: "email" },
  backupCodes: [{ type: String }],
  
  // Login Security
  loginAttempts: { type: Number, default: 0 },
  accountLocked: { type: Boolean, default: false },
  lockUntil: { type: Date, default: null },
  
  // Last Login Tracking
  lastLoginIP: { type: String, default: null },
  lastLoginAt: { type: Date, default: null },
  lastLoginDevice: { type: String, default: null },
  
  // ✅ LOGIN HISTORY - Added
  loginHistory: [
    {
      date: { type: Date, default: Date.now },
      ip: { type: String },
      device: { type: String },
      status: { type: String, enum: ["success", "failed"], default: "success" }
    }
  ],
  
  // Online Status
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date },
  
  // Session Management
  activeSessions: [{
    sessionId: { type: String },
    deviceId: { type: String },
    ipAddress: { type: String },
    loginAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
  }],
  
  // Super Admin Flag
  isSuperAdmin: { type: Boolean, default: false },
  
  // Status
  status: { 
    type: String, 
    enum: ["active", "inactive", "suspended"], 
    default: "active" 
  },

}, { timestamps: true });

// ==================== METHODS ====================

// Record login attempt
AdminSchema.methods.recordLoginAttempt = async function(success) {
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
  return true;
};

// Check if account is locked
AdminSchema.methods.isAccountLocked = function() {
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

// ✅ UPDATE: Update last login info + save to history
AdminSchema.methods.updateLastLogin = async function(ipAddress, deviceInfo) {
  const loginEntry = {
    date: new Date(),
    ip: ipAddress || "unknown",
    device: deviceInfo || "unknown",
    status: "success"
  };
  
  // Add to login history
  if (!this.loginHistory) this.loginHistory = [];
  this.loginHistory.push(loginEntry);
  
  // Keep only last 50 entries
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  
  // Update last login info
  this.lastLoginIP = ipAddress;
  this.lastLoginAt = new Date();
  this.lastLoginDevice = deviceInfo;
  this.isOnline = true;
  this.lastSeen = new Date();
  
  await this.save();
  return true;
};

// ✅ ADD: Record failed login in history
AdminSchema.methods.recordFailedLogin = async function(ipAddress, deviceInfo) {
  const loginEntry = {
    date: new Date(),
    ip: ipAddress || "unknown",
    device: deviceInfo || "unknown",
    status: "failed"
  };
  
  if (!this.loginHistory) this.loginHistory = [];
  this.loginHistory.push(loginEntry);
  
  if (this.loginHistory.length > 50) {
    this.loginHistory = this.loginHistory.slice(-50);
  }
  
  await this.save();
  return true;
};

// Generate backup codes for 2FA
AdminSchema.methods.generateBackupCodes = function() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  this.backupCodes = codes;
  return codes;
};

// Enable/Disable 2FA
AdminSchema.methods.enable2FA = async function() {
  this.twoFactorEnabled = true;
  if (!this.backupCodes || this.backupCodes.length === 0) {
    this.generateBackupCodes();
  }
  await this.save();
  return true;
};

AdminSchema.methods.disable2FA = async function() {
  this.twoFactorEnabled = false;
  await this.save();
  return true;
};

// Register active session
AdminSchema.methods.registerSession = async function(sessionId, deviceId, ipAddress) {
  this.activeSessions.push({
    sessionId,
    deviceId,
    ipAddress,
    loginAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  await this.save();
  return true;
};

// Remove expired sessions
AdminSchema.methods.cleanExpiredSessions = async function() {
  this.activeSessions = this.activeSessions.filter(s => s.expiresAt > new Date());
  await this.save();
  return this.activeSessions.length;
};

// ==================== PRE-SAVE HOOK ====================
AdminSchema.pre('save', function() {
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

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;