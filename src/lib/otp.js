// // lib/otp.js
// import crypto from 'crypto';
// import { sendOTPEmail } from './email.js';  // 👈 IMPORT THIS

// // Store OTPs temporarily (in production use Redis)
// const otpStore = new Map();

// // Generate 6-digit OTP
// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Save OTP with expiry (5 minutes)
// export const saveOTP = (studentId, otp) => {
//   otpStore.set(studentId, {
//     otp,
//     expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
//     attempts: 0
//   });
  
//   // Auto cleanup after 5 minutes
//   setTimeout(() => {
//     if (otpStore.has(studentId)) {
//       otpStore.delete(studentId);
//     }
//   }, 5 * 60 * 1000);
// };

// // Verify OTP
// export const verifyOTP = (studentId, userOTP) => {
//   const record = otpStore.get(studentId);
  
//   if (!record) {
//     return { success: false, message: "OTP expired or not found" };
//   }
  
//   if (record.expiresAt < Date.now()) {
//     otpStore.delete(studentId);
//     return { success: false, message: "OTP has expired" };
//   }
  
//   if (record.attempts >= 3) {
//     otpStore.delete(studentId);
//     return { success: false, message: "Too many failed attempts" };
//   }
  
//   if (record.otp !== userOTP) {
//     record.attempts++;
//     return { success: false, message: "Invalid OTP", remainingAttempts: 3 - record.attempts };
//   }
  
//   // Success - delete OTP
//   otpStore.delete(studentId);
//   return { success: true, message: "OTP verified" };
// };

// // Send OTP via SMS (mock for now)
// export const sendOTPviaSMS = async (phone, otp, studentName) => {
//   const message = `${otp} is your login OTP for School Portal. Valid for 5 minutes.`;
  
 
  
//   return { success: true };
// };

// // ✅ FIXED: Send OTP via Email - ACTUAL EMAIL SENDING
// export const sendOTPviaEmail = async (email, otp, studentName) => {
 
  
//   try {
//     // Call the actual email sender from email.js
//     const result = await sendOTPEmail(email, otp, studentName);
    
//     if (result.success) {
     
//     } else {
//       console.error(`❌ [OTP] Email failed:`, result.error);
//     }
    
//     return result;
//   } catch (error) {
//     console.error(`❌ [OTP] Error sending email:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Get OTP store size (for debugging)
// export const getOTPStoreSize = () => {
//   return otpStore.size;
// };

// // Clear expired OTPs (for debugging)
// export const clearExpiredOTPs = () => {
//   const now = Date.now();
//   for (const [key, value] of otpStore.entries()) {
//     if (value.expiresAt < now) {
//       otpStore.delete(key);
//     }
//   }
// };












































































// // lib/otp.js
// import crypto from 'crypto';
// import { sendOTPEmail } from './email.js';

// // Store OTPs temporarily (in production use Redis)
// const otpStore = new Map();

// // Generate 6-digit OTP
// export const generateOTP = () => {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   return otp;
// };

// // Save OTP with expiry (10 minutes for testing)
// export const saveOTP = (studentId, otp) => {
//   const key = studentId.toString();
//   const expiryMinutes = 10; // Increased to 10 minutes for testing
//   const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  
  
//   otpStore.set(key, {
//     otp,
//     expiresAt: expiryTime,
//     attempts: 0,
//     createdAt: Date.now()
//   });
  
  
//   // Auto cleanup after expiry time
//   setTimeout(() => {
//     if (otpStore.has(key)) {
//       otpStore.delete(key);
//       }
//   }, expiryMinutes * 60 * 1000);
// };

// // Save 2FA OTPs (for future use)
// export const save2FAOTP = (studentId, emailOtp, smsOtp) => {
//   const key = studentId.toString();
//   const expiryTime = Date.now() + 10 * 60 * 1000;
  
  
//   otpStore.set(key, {
//     emailOtp,
//     smsOtp,
//     expiresAt: expiryTime,
//     attempts: 0,
//     createdAt: Date.now()
//   });
  
//   setTimeout(() => {
//     if (otpStore.has(key)) {
//       otpStore.delete(key);
//       }
//   }, 10 * 60 * 1000);
// };

// // Verify OTP (single)
// export const verifyOTP = (studentId, userOTP) => {
//   const key = studentId.toString();
  
//   const record = otpStore.get(key);
  
//   if (!record) {
//    return { success: false, message: "OTP expired or not found. Please request a new OTP." };
//   }
  
//   if (record.expiresAt < Date.now()) {
//     otpStore.delete(key);
//     return { success: false, message: "OTP has expired. Please request a new OTP." };
//   }
  
//   if (record.attempts >= 3) {
//      otpStore.delete(key);
//     return { success: false, message: "Too many failed attempts. Please request a new OTP." };
//   }
  
//   if (record.otp !== userOTP) {
//     record.attempts++;
//      return { success: false, message: "Invalid OTP", remainingAttempts: 3 - record.attempts };
//   }
  
//  otpStore.delete(key);
//   return { success: true, message: "OTP verified" };
// };

// // Verify 2FA OTPs (for future use)
// export const verify2FAOTP = (studentId, emailOtp, smsOtp) => {
//   const key = studentId.toString();
  
//   const record = otpStore.get(key);
  
//   if (!record) {
//     return { success: false, message: "OTPs expired or not found" };
//   }
  
//   if (record.expiresAt < Date.now()) {
//      otpStore.delete(key);
//     return { success: false, message: "OTPs have expired" };
//   }
  
//   if (record.attempts >= 3) {
//    otpStore.delete(key);
//     return { success: false, message: "Too many failed attempts" };
//   }
  
//   if (record.emailOtp !== emailOtp) {
//     record.attempts++;
//     return { success: false, message: "Invalid email OTP", remainingAttempts: 3 - record.attempts };
//   }
  
//   if (record.smsOtp !== smsOtp) {
//     record.attempts++;
//     return { success: false, message: "Invalid SMS OTP", remainingAttempts: 3 - record.attempts };
//   }
  
//    otpStore.delete(key);
//   return { success: true, message: "Both OTPs verified" };
// };

// // Send OTP via Email - ACTUAL EMAIL SENDING
// export const sendOTPviaEmail = async (email, otp, studentName) => {
  
//   if (!email) {
//     return { success: false, error: "No email address" };
//   }
  
//   try {
//     const result = await sendOTPEmail(email, otp, studentName);
    
//     if (result.success) {
//  } else {
//      }
//     return result;
//   } catch (error) {
//    return { success: false, error: error.message };
//   }
// };

// // Get OTP store size (for debugging)
// export const getOTPStoreSize = () => {
//   const size = otpStore.size;
//   return size;
// };

// // Get OTP details for a student (for debugging)
// export const getOTPForStudent = (studentId) => {
//   const key = studentId.toString();
//   const record = otpStore.get(key);
//   if (record) {
//    return record;
//   }
//   return null;
// };

// // Clear expired OTPs (for debugging)
// export const clearExpiredOTPs = () => {
//   const now = Date.now();
//   let cleared = 0;
//   for (const [key, value] of otpStore.entries()) {
//     if (value.expiresAt < now) {
//       otpStore.delete(key);
//       cleared++;
//     }
//   }
 
//   return cleared;
// };

// // Clear all OTPs (for debugging)
// export const clearAllOTPs = () => {
//   const size = otpStore.size;
//   otpStore.clear();
 
//   return size;
// };






// lib/otp.js
import crypto from 'crypto';
import { sendOTPEmail } from './email.js';

// Store OTPs temporarily (in production use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`🔑 OTP generated: ${otp}`);
  return otp;
};

// Save OTP with expiry (10 minutes)
export const saveOTP = (studentId, otp) => {
  const key = studentId.toString();
  const expiryMinutes = 10;
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  
  console.log(`💾 Saving OTP for student ${studentId}: ${otp} (expires in ${expiryMinutes} min)`);
  
  otpStore.set(key, {
    otp,
    expiresAt: expiryTime,
    attempts: 0,
    createdAt: Date.now()
  });
  
  // Auto cleanup after expiry time
  setTimeout(() => {
    if (otpStore.has(key)) {
      otpStore.delete(key);
      console.log(`🧹 OTP auto-cleaned for student ${studentId}`);
    }
  }, expiryMinutes * 60 * 1000);
  
  // Log store size for debugging
  console.log(`📊 OTP Store size: ${otpStore.size}`);
};

// Save 2FA OTPs
export const save2FAOTP = (studentId, emailOtp, smsOtp) => {
  const key = studentId.toString();
  const expiryTime = Date.now() + 10 * 60 * 1000;
  
  console.log(`💾 Saving 2FA OTPs for student ${studentId}`);
  
  otpStore.set(key, {
    emailOtp,
    smsOtp,
    expiresAt: expiryTime,
    attempts: 0,
    createdAt: Date.now()
  });
  
  setTimeout(() => {
    if (otpStore.has(key)) {
      otpStore.delete(key);
      console.log(`🧹 2FA OTP auto-cleaned for student ${studentId}`);
    }
  }, 10 * 60 * 1000);
};

// Verify OTP (single)
export const verifyOTP = (studentId, userOTP) => {
  const key = studentId.toString();
  const record = otpStore.get(key);
  
  console.log(`🔍 Verifying OTP for student ${studentId}: ${userOTP}`);
  
  if (!record) {
    console.log(`❌ OTP not found for student ${studentId}`);
    return { success: false, message: "OTP expired or not found. Please request a new OTP." };
  }
  
  if (record.expiresAt < Date.now()) {
    otpStore.delete(key);
    console.log(`❌ OTP expired for student ${studentId}`);
    return { success: false, message: "OTP has expired. Please request a new OTP." };
  }
  
  if (record.attempts >= 3) {
    otpStore.delete(key);
    console.log(`❌ Too many failed attempts for student ${studentId}`);
    return { success: false, message: "Too many failed attempts. Please request a new OTP." };
  }
  
  if (record.otp !== userOTP) {
    record.attempts++;
    console.log(`❌ Invalid OTP for student ${studentId}. Attempt ${record.attempts}/3`);
    return { success: false, message: "Invalid OTP", remainingAttempts: 3 - record.attempts };
  }
  
  otpStore.delete(key);
  console.log(`✅ OTP verified successfully for student ${studentId}`);
  return { success: true, message: "OTP verified" };
};

// Verify 2FA OTPs
export const verify2FAOTP = (studentId, emailOtp, smsOtp) => {
  const key = studentId.toString();
  const record = otpStore.get(key);
  
  if (!record) {
    return { success: false, message: "OTPs expired or not found" };
  }
  
  if (record.expiresAt < Date.now()) {
    otpStore.delete(key);
    return { success: false, message: "OTPs have expired" };
  }
  
  if (record.attempts >= 3) {
    otpStore.delete(key);
    return { success: false, message: "Too many failed attempts" };
  }
  
  if (record.emailOtp !== emailOtp) {
    record.attempts++;
    return { success: false, message: "Invalid email OTP", remainingAttempts: 3 - record.attempts };
  }
  
  if (record.smsOtp !== smsOtp) {
    record.attempts++;
    return { success: false, message: "Invalid SMS OTP", remainingAttempts: 3 - record.attempts };
  }
  
  otpStore.delete(key);
  return { success: true, message: "Both OTPs verified" };
};

// ✅ FIXED: Send OTP via Email with proper logging
export const sendOTPviaEmail = async (email, otp, studentName) => {
  console.log(`📧 Sending OTP email to ${email} for ${studentName}`);
  console.log(`🔑 OTP: ${otp}`);
  
  if (!email) {
    console.error(`❌ No email address provided`);
    return { success: false, error: "No email address" };
  }
  
  try {
    console.log(`📤 Calling sendOTPEmail...`);
    const result = await sendOTPEmail(email, otp, studentName);
    
    if (result.success) {
      console.log(`✅ OTP email sent successfully to ${email}`);
      console.log(`📩 Message ID: ${result.messageId}`);
    } else {
      console.error(`❌ OTP email failed:`, result.error);
    }
    return result;
  } catch (error) {
    console.error(`❌ OTP email error:`, error.message);
    return { success: false, error: error.message };
  }
};

// Get OTP store size (for debugging)
export const getOTPStoreSize = () => {
  const size = otpStore.size;
  console.log(`📊 OTP Store size: ${size}`);
  return size;
};

// Get OTP details for a student (for debugging)
export const getOTPForStudent = (studentId) => {
  const key = studentId.toString();
  const record = otpStore.get(key);
  if (record) {
    console.log(`🔍 OTP record found for student ${studentId}:`, record);
    return record;
  }
  console.log(`🔍 No OTP record found for student ${studentId}`);
  return null;
};

// Clear expired OTPs (for debugging)
export const clearExpiredOTPs = () => {
  const now = Date.now();
  let cleared = 0;
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < now) {
      otpStore.delete(key);
      cleared++;
    }
  }
  console.log(`🧹 Cleared ${cleared} expired OTPs`);
  return cleared;
};

// Clear all OTPs (for debugging)
export const clearAllOTPs = () => {
  const size = otpStore.size;
  otpStore.clear();
  console.log(`🧹 Cleared all ${size} OTPs`);
  return size;
};