// lib/qr-generator.js
import QRCode from 'qrcode';

/**
 * Generate QR code for fee payment
 * @param {Object} data - Fee payment data
 * @returns {Promise<String>} QR code as dataURL
 */
export async function generateQRCode(data) {
  try {
    // Convert data to string
    const qrData = JSON.stringify(data);
    
    // Generate QR code as dataURL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
}

/**
 * Generate QR token (unique ID)
 * @param {String} studentId - Student ID
 * @param {String} feeId - Fee ID
 * @returns {String} Unique token
 */
export function generateQRToken(studentId, feeId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return Buffer.from(`${studentId}-${feeId}-${timestamp}-${random}`).toString('base64').replace(/[/+=]/g, '');
}

/**
 * Verify QR token
 * @param {String} token - QR token
 * @param {Object} fee - Fee record
 * @returns {Object} Verification result
 */
export function verifyQRToken(token, fee) {
  if (!fee || !fee.qrToken) {
    return { valid: false, reason: 'INVALID_TOKEN' };
  }
  
  if (fee.qrToken !== token) {
    return { valid: false, reason: 'TOKEN_MISMATCH' };
  }
  
  const now = new Date();
  const expiryDate = new Date(fee.qrExpiry);
  
  if (now > expiryDate) {
    return { valid: false, reason: 'EXPIRED' };
  }
  
  if (fee.status === 'paid') {
    return { valid: false, reason: 'ALREADY_PAID' };
  }
  
  return { valid: true, reason: 'OK' };
}

export default { generateQRCode, generateQRToken, verifyQRToken };