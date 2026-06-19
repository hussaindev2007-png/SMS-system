// import mongoose from "mongoose";

// const FeeSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", 
//     required: true,
//   },
//   month: {
//     type: String, 
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["paid", "unpaid", "pending"],
//     default: "unpaid",
//   },
//   paymentDate: {
//     type: Date,
//   },
//   transactionId: {
//     type: String, 
//   } ,
//    rollNo: { type: String, sparse: true, unique: true }
// }, { timestamps: true });

// export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);

















// import mongoose from "mongoose";

// const FeeSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", 
//     required: true,
//   },
//   // ✅ Class Name add kar di hye taake query fast ho
//   className: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   month: {
//     type: String, 
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ["paid", "unpaid", "pending"],
//     default: "unpaid",
//   },
//   paymentDate: {
//     type: Date,
//   },
//   transactionId: {
//     type: String, 
//   },
//   dueDate: { type: Date, required: true },
//    paymentDate: { type: Date },
//    feeType: { type: String, enum: ["admission", "monthly", "exam", "other"], default: "monthly" } ,
//  discount: { type: Number, default: 0 },
//    // Fee record ka apna rollNo rakhne ki zaroorat nahi hoti 
//   // kyunke wo User model se populate ho jata hye, 
//   // lekin agar aapne rakha hye to sparse rehne den.
//   rollNo: { type: String, sparse: true } 
// }, { timestamps: true });

// export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);









// import mongoose from "mongoose";

// const FeeSchema = new mongoose.Schema({
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", 
//     required: true,
//   },
//   rollNo: { 
//     type: String, 
//     required: true
//   },
//   className: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   month: {
//     type: String, 
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//   },
//   amountPaid: {
//     type: Number,
//     default: 0,
//   },
//   remainingAmount: {
//     type: Number,
//     default: 0,
//   },
//   status: {
//     type: String,
//     enum: ["paid", "unpaid", "partially-paid", "pending", "overdue"],
//     default: "unpaid",
//   },
//   paymentMethod: {
//     type: String,
//     enum: ["cash", "bank-transfer", "easypaisa", "jazzcash", "card", ""],
//     default: "",
//   },
//   collectedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", 
//   },
//   dueDate: { 
//     type: Date, 
//     required: true 
//   },
//   paymentDate: { 
//     type: Date 
//   },
//   feeType: { 
//     type: String, 
//     enum: ["admission", "monthly", "exam", "other"], 
//     default: "monthly" 
//   },
//   discount: { 
//     type: Number, 
//     default: 0 
//   },
  
//   // ========== QR CODE FIELDS (NEW) ==========
//   qrToken: {
//     type: String,
//     unique: true,
//     sparse: true,
//     index: true,
//   },
//   qrExpiry: {
//     type: Date,
//     default: function() {
//       const date = new Date();
//       date.setDate(date.getDate() + 30); // Valid for 30 days
//       return date;
//     }
//   },
//   qrCodeImage: {
//     type: String, // Base64 or URL
//     default: null,
//   },
//   qrLink: {
//     type: String,
//     default: null,
//   },
//   qrGeneratedAt: {
//     type: Date,
//     default: null,
//   },
//   qrScannedCount: {
//     type: Number,
//     default: 0,
//   },
//   qrLastScannedAt: {
//     type: Date,
//     default: null,
//   },
  
//   // ========== PAYMENT HISTORY (NEW) ==========
//   paymentHistory: [
//     {
//       amount: { type: Number, required: true },
//       date: { type: Date, default: Date.now },
//       method: { type: String, enum: ["cash", "bank-transfer", "easypaisa", "jazzcash", "card", "qr"] },
//       receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       remarks: { type: String },
//       remainingAfter: { type: Number }
//     }
//   ],
  
//   // ========== ADDITIONAL FIELDS ==========
//   lateFee: {
//     type: Number,
//     default: 0,
//   },
//   waiverAmount: {
//     type: Number,
//     default: 0,
//   },
//   remarks: {
//     type: String,
//     default: "",
//   },
//   receiptNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//   }

// }, { timestamps: true });

// // ========== INDEXES FOR FASTER QUERIES ==========
// FeeSchema.index({ studentId: 1, month: 1, feeType: 1 });
// FeeSchema.index({ className: 1 });
// FeeSchema.index({ rollNo: 1 });
// FeeSchema.index({ status: 1 });
// FeeSchema.index({ dueDate: 1 });
// FeeSchema.index({ status: 1, dueDate: 1 });
// FeeSchema.index({ qrToken: 1 }); // For QR code lookups
// FeeSchema.index({ receiptNumber: 1 }); // For receipt lookups
// FeeSchema.index({ paymentDate: -1 }); // For date sorting

// // ========== PRE-SAVE MIDDLEWARE ==========
// FeeSchema.pre('save', function() {
//   // Auto-calculate remaining amount
//   if (this.amount && this.amountPaid !== undefined) {
//     this.remainingAmount = Math.max(0, this.amount - this.amountPaid - (this.discount || 0));
    
//     // Auto-update status based on remaining amount
//     if (this.remainingAmount === 0) {
//       this.status = "paid";
//     } else if (this.amountPaid > 0 && this.remainingAmount > 0) {
//       this.status = "partially-paid";
//     }
//   }
  
//   // Auto-generate receipt number if not present and status is paid
//   if (this.status === "paid" && !this.receiptNumber) {
//     const year = new Date().getFullYear();
//     const random = Math.floor(Math.random() * 10000);
//     this.receiptNumber = `RCP-${year}-${random}`;
//   }
  
  
// });

// // ========== VIRTUAL FIELDS ==========
// FeeSchema.virtual('isExpired').get(function() {
//   return this.qrExpiry && new Date() > new Date(this.qrExpiry);
// });

// FeeSchema.virtual('isValidQR').get(function() {
//   return this.qrToken && this.qrExpiry && new Date() < new Date(this.qrExpiry) && this.status !== "paid";
// });

// FeeSchema.virtual('paymentProgress').get(function() {
//   if (this.amount === 0) return 100;
//   return Math.round(((this.amountPaid || 0) / this.amount) * 100);
// });

// // ========== INSTANCE METHODS ==========
// FeeSchema.methods.updateQR = async function() {
//   const QRCode = await import('qrcode');
//   const crypto = await import('crypto');
  
//   // Generate new token
//   const token = crypto.randomBytes(32).toString('base64').replace(/[/+=]/g, '');
//   this.qrToken = token;
  
//   // Set expiry (30 days from now)
//   const expiry = new Date();
//   expiry.setDate(expiry.getDate() + 30);
//   this.qrExpiry = expiry;
  
//   // Generate QR code data
//   const qrData = {
//     token: token,
//     feeId: this._id,
//     studentId: this.studentId,
//     amount: this.remainingAmount || this.amount,
//     month: this.month
//   };
  
//   // Generate QR code image
//   const qrImage = await QRCode.toDataURL(JSON.stringify(qrData), {
//     width: 300,
//     margin: 2
//   });
  
//   this.qrCodeImage = qrImage;
//   this.qrGeneratedAt = new Date();
  
//   return {
//     token: this.qrToken,
//     image: this.qrCodeImage,
//     expiry: this.qrExpiry
//   };
// };

// FeeSchema.methods.recordPayment = async function(amount, method, receivedBy, remarks = "") {
//   const currentPaid = this.amountPaid || 0;
//   const newPaid = currentPaid + amount;
//   const remaining = this.amount - newPaid - (this.discount || 0);
  
//   // Add to payment history
//   this.paymentHistory.push({
//     amount: amount,
//     date: new Date(),
//     method: method,
//     receivedBy: receivedBy,
//     remarks: remarks,
//     remainingAfter: Math.max(0, remaining)
//   });
  
//   // Update amounts
//   this.amountPaid = newPaid;
//   this.remainingAmount = Math.max(0, remaining);
  
//   // Update status
//   if (remaining <= 0) {
//     this.status = "paid";
//     this.paymentDate = new Date();
//   } else if (newPaid > 0) {
//     this.status = "partially-paid";
//   }
  
//   this.paymentMethod = method;
  
//   await this.save();
  
//   return {
//     amountPaid: amount,
//     totalPaid: this.amountPaid,
//     remaining: this.remainingAmount,
//     status: this.status
//   };
// };

// // ========== STATIC METHODS ==========
// FeeSchema.statics.findByQRToken = function(token) {
//   return this.findOne({ qrToken: token }).populate('studentId');
// };

// FeeSchema.statics.getPendingFees = function() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   return this.find({
//     status: { $in: ["unpaid", "pending", "partially-paid"] },
//     dueDate: { $lt: today }
//   }).populate('studentId');
// };

// FeeSchema.statics.getCollectionStats = async function(startDate, endDate) {
//   const match = {};
//   if (startDate) match.paymentDate = { $gte: startDate };
//   if (endDate) match.paymentDate = { ...match.paymentDate, $lte: endDate };
//   match.status = "paid";
  
//   const stats = await this.aggregate([
//     { $match: match },
//     { $group: {
//       _id: null,
//       totalCollected: { $sum: "$amountPaid" },
//       totalTransactions: { $sum: 1 },
//       avgAmount: { $avg: "$amountPaid" }
//     }}
//   ]);
  
//   return stats[0] || { totalCollected: 0, totalTransactions: 0, avgAmount: 0 };
// };

// // ========== EXPORT MODEL ==========
// export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);




























































import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  rollNo: { 
    type: String, 
    required: true
  },
  className: {
    type: String,
    required: true,
    trim: true
  },
  month: {
    type: String, 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["paid", "unpaid", "partially-paid", "pending", "overdue"],
    default: "unpaid",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank-transfer", "easypaisa", "jazzcash", "card", "qr", ""],
    default: "",
  },
  
  // ✅ FIXED: Change collectedBy to String
  collectedBy: {
    type: String,
    default: "",
    trim: true
  },
  
  // ✅ ADD THESE NEW FIELDS for staff tracking
  collectedByName: {
    type: String,
    default: "",
    trim: true
  },
  collectedByPin: {
    type: String,
    default: ""
  },
  collectedByRole: {
    type: String,
    enum: ["admin", "staff", ""],
    default: ""
  },
  paymentRemarks: {
    type: String,
    default: ""
  },
  
  dueDate: { 
    type: Date, 
    required: true 
  },
  paymentDate: { 
    type: Date 
  },
  feeType: { 
    type: String, 
    enum: ["admission", "monthly", "exam", "other"], 
    default: "monthly" 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  
  // ========== QR CODE FIELDS ==========
  qrToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  qrExpiry: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  },
  qrCodeImage: {
    type: String,
    default: null,
  },
  qrLink: {
    type: String,
    default: null,
  },
  qrGeneratedAt: {
    type: Date,
    default: null,
  },
  qrScannedCount: {
    type: Number,
    default: 0,
  },
  qrLastScannedAt: {
    type: Date,
    default: null,
  },
  
  // ========== PAYMENT HISTORY (UPDATED) ==========
  paymentHistory: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      method: { type: String, enum: ["cash", "bank-transfer", "easypaisa", "jazzcash", "card", "qr"] },
      // ✅ Changed to String
      receivedBy: { type: String, default: "" },
      receivedByName: { type: String, default: "" },
      staffPin: { type: String, default: "" },
      remarks: { type: String, default: "" },
      remainingAfter: { type: Number, default: 0 }
    }
  ],
  
  // ========== ADDITIONAL FIELDS ==========
  lateFee: {
    type: Number,
    default: 0,
  },
  waiverAmount: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: "",
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true,
  }

}, { timestamps: true });

// ========== INDEXES ==========
FeeSchema.index({ studentId: 1, month: 1, feeType: 1 });
FeeSchema.index({ className: 1 });
FeeSchema.index({ rollNo: 1 });
FeeSchema.index({ status: 1 });
FeeSchema.index({ dueDate: 1 });
FeeSchema.index({ status: 1, dueDate: 1 });
FeeSchema.index({ qrToken: 1 });
FeeSchema.index({ receiptNumber: 1 });
FeeSchema.index({ paymentDate: -1 });
FeeSchema.index({ collectedByName: 1 });

// ========== PRE-SAVE MIDDLEWARE ==========
FeeSchema.pre('save', function() {
  // Auto-calculate remaining amount
  if (this.amount && this.amountPaid !== undefined) {
    this.remainingAmount = Math.max(0, this.amount - this.amountPaid - (this.discount || 0));
    
    // Auto-update status
    if (this.remainingAmount === 0) {
      this.status = "paid";
    } else if (this.amountPaid > 0 && this.remainingAmount > 0) {
      this.status = "partially-paid";
    }
  }
  
  // Auto-generate receipt number
  if (this.status === "paid" && !this.receiptNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000);
    const month = new Date().getMonth() + 1;
    this.receiptNumber = `RCP-${year}${month}-${random.toString().padStart(4, '0')}`;
  }
  
  // Sync collected fields
  if (this.collectedByName && !this.collectedBy) {
    this.collectedBy = this.collectedByName;
  }
  
  
});

// ========== VIRTUAL FIELDS ==========
FeeSchema.virtual('isExpired').get(function() {
  return this.qrExpiry && new Date() > new Date(this.qrExpiry);
});

FeeSchema.virtual('isValidQR').get(function() {
  return this.qrToken && this.qrExpiry && new Date() < new Date(this.qrExpiry) && this.status !== "paid";
});

FeeSchema.virtual('paymentProgress').get(function() {
  if (this.amount === 0) return 100;
  return Math.round(((this.amountPaid || 0) / this.amount) * 100);
});

FeeSchema.virtual('collectorInfo').get(function() {
  return {
    name: this.collectedByName || this.collectedBy,
    pin: this.collectedByPin,
    role: this.collectedByRole
  };
});

// ========== INSTANCE METHODS ==========
FeeSchema.methods.updateQR = async function() {
  const QRCode = await import('qrcode');
  const crypto = await import('crypto');
  
  const token = crypto.randomBytes(32).toString('base64').replace(/[/+=]/g, '');
  this.qrToken = token;
  
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  this.qrExpiry = expiry;
  
  // ✅ Store only token in QR
  const qrData = token;
  
  const qrImage = await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'H'
  });
  
  this.qrCodeImage = qrImage;
  this.qrGeneratedAt = new Date();
  
  await this.save();
  
  return {
    token: this.qrToken,
    image: this.qrCodeImage,
    expiry: this.qrExpiry
  };
};

FeeSchema.methods.recordPayment = async function(amount, method, staffName, staffPin, remarks = "") {
  const currentPaid = this.amountPaid || 0;
  const newPaid = currentPaid + amount;
  const remaining = this.amount - newPaid - (this.discount || 0);
  
  this.paymentHistory.push({
    amount: amount,
    date: new Date(),
    method: method,
    receivedBy: staffName,
    receivedByName: staffName,
    staffPin: staffPin,
    remarks: remarks,
    remainingAfter: Math.max(0, remaining)
  });
  
  this.amountPaid = newPaid;
  this.remainingAmount = Math.max(0, remaining);
  
  this.collectedByName = staffName;
  this.collectedByPin = staffPin;
  this.paymentRemarks = remarks;
  
  if (remaining <= 0) {
    this.status = "paid";
    this.paymentDate = new Date();
  } else if (newPaid > 0) {
    this.status = "partially-paid";
  }
  
  this.paymentMethod = method;
  
  await this.save();
  
  return {
    amountPaid: amount,
    totalPaid: this.amountPaid,
    remaining: this.remainingAmount,
    status: this.status,
    collectedBy: staffName
  };
};

// ========== STATIC METHODS ==========
FeeSchema.statics.findByQRToken = function(token) {
  return this.findOne({ qrToken: token }).populate('studentId');
};

FeeSchema.statics.getPendingFees = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    status: { $in: ["unpaid", "pending", "partially-paid"] },
    dueDate: { $lt: today }
  }).populate('studentId');
};

FeeSchema.statics.getCollectionStats = async function(startDate, endDate) {
  const match = {};
  if (startDate) match.paymentDate = { $gte: startDate };
  if (endDate) match.paymentDate = { ...match.paymentDate, $lte: endDate };
  match.status = "paid";
  
  const stats = await this.aggregate([
    { $match: match },
    { $group: {
      _id: null,
      totalCollected: { $sum: "$amountPaid" },
      totalTransactions: { $sum: 1 },
      avgAmount: { $avg: "$amountPaid" }
    }}
  ]);
  
  return stats[0] || { totalCollected: 0, totalTransactions: 0, avgAmount: 0 };
};

// ========== EXPORT MODEL ==========
export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);