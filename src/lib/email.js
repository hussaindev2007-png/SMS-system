// import nodemailer from 'nodemailer';

// // Gmail configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendAttendanceEmail = async (email, studentName, status, time, date) => {
//   try {
//     let subject = '';
//     let emoji = '';
//     let color = '';
    
//     if (status === 'absent') {
//       subject = `⚠️ Attendance Alert: ${studentName} was ABSENT`;
//       emoji = '❌';
//       color = '#d32f2f';
//     } else if (status === 'late') {
//       subject = `⚠️ Attendance Alert: ${studentName} was LATE`;
//       emoji = '⏰';
//       color = '#ff9800';
//     } else {
//       subject = `✅ Attendance: ${studentName} was PRESENT`;
//       emoji = '✅';
//       color = '#4caf50';
//     }
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🏫 School Management System</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <div style="text-align: center; font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
//             <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span></p>
//             ${time ? `<p style="margin: 5px 0;"><strong>Check-in Time:</strong> ${time}</p>` : ''}
//             <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
//           </div>
          
//           <div style="background-color: ${color}10; padding: 12px; border-radius: 8px;">
//             <p style="margin: 0; font-size: 12px; color: #666;">
//               ${status === 'absent' ? '📢 Please ensure regular attendance for academic success.' : status === 'late' ? '⏰ School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.' : '✓ Thank you for maintaining regular attendance.'}
//             </p>
//           </div>
//         </div>
        
//         <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 11px; color: #888; border-radius: 0 0 10px 10px;">
//           This is an automated message from School Management System. Please do not reply.
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Attendance Alert
      
//       Student: ${studentName}
//       Status: ${status.toUpperCase()}
//       ${time ? `Time: ${time}` : ''}
//       Date: ${date}
      
//       ${status === 'absent' ? 'Please ensure regular attendance.' : status === 'late' ? 'School timing: 8:00 AM - 9:00 AM' : 'Thank you!'}
//     `;
    
//     await transporter.sendMail({
//       from: `"School Management" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: subject,
//       text: text,
//       html: html
//     });
    
//     console.log(`✅ Email sent to ${email} for ${studentName}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error('❌ Email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };





















// import nodemailer from 'nodemailer';

// // Gmail configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Verify transporter on startup
// const verifyTransporter = async () => {
//   try {
//     await transporter.verify();
   
//   } catch (error) {
//     console.error('❌ Gmail transporter error:', error.message);
//   }
// };
// verifyTransporter();

// // Send Attendance Email
// export const sendAttendanceEmail = async (email, studentName, status, time, date) => {
 
//   try {
//     let subject = '';
//     let emoji = '';
//     let color = '';
    
//     if (status === 'absent') {
//       subject = `⚠️ Attendance Alert: ${studentName} was ABSENT`;
//       emoji = '❌';
//       color = '#d32f2f';
//     } else if (status === 'late') {
//       subject = `⚠️ Attendance Alert: ${studentName} was LATE`;
//       emoji = '⏰';
//       color = '#ff9800';
//     } else {
//       subject = `✅ Attendance: ${studentName} was PRESENT`;
//       emoji = '✅';
//       color = '#4caf50';
//     }
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🏫 School Management System</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <div style="text-align: center; font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
//             <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span></p>
//             ${time ? `<p style="margin: 5px 0;"><strong>Check-in Time:</strong> ${time}</p>` : ''}
//             <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
//           </div>
          
//           <div style="background-color: ${color}10; padding: 12px; border-radius: 8px;">
//             <p style="margin: 0; font-size: 12px; color: #666;">
//               ${status === 'absent' ? '📢 Please ensure regular attendance for academic success.' : status === 'late' ? '⏰ School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.' : '✓ Thank you for maintaining regular attendance.'}
//             </p>
//           </div>
//         </div>
        
//         <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 11px; color: #888; border-radius: 0 0 10px 10px;">
//           This is an automated message from School Management System. Please do not reply.
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Attendance Alert
      
//       Student: ${studentName}
//       Status: ${status.toUpperCase()}
//       ${time ? `Time: ${time}` : ''}
//       Date: ${date}
      
//       ${status === 'absent' ? 'Please ensure regular attendance.' : status === 'late' ? 'School timing: 8:00 AM - 9:00 AM' : 'Thank you!'}
//     `;
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: subject,
//       text: text,
//       html: html
//     };
    
   
//     const info = await transporter.sendMail(mailOptions);
    
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ [ATTENDANCE] Email error:`, error.message);
//     console.error(`❌ [ATTENDANCE] Full error:`, error);
//     return { success: false, error: error.message };
//   }
// };

// // Send Login QR Code Email with Direct Link
// export const sendLoginQREmail = async (email, studentName, qrCodeDataUrl, qrLink) => {
  
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Your Login QR Code</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
//           <p>Use this QR code to login to your account <strong>without password</strong>.</p>
          
//           <div style="background: white; padding: 15px; display: inline-block; margin: 15px 0; border: 1px solid #ddd; border-radius: 10px;">
//             <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px;" alt="Login QR Code" />
//           </div>
          
//           <div style="margin: 20px 0;">
//             <a href="${qrLink}" style="background: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
//               🔗 Click Here to Login Directly
//             </a>
//             <p style="font-size: 12px; color: #666; margin-top: 10px;">
//               Or copy this link: <span style="color: #1e3c72; word-break: break-all;">${qrLink}</span>
//             </p>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
//             <p style="margin: 0 0 10px 0; font-weight: bold;">📱 How to use:</p>
//             <ol style="margin: 0; padding-left: 20px;">
//               <li><strong>Option A (Phone):</strong> Scan QR code with phone camera</li>
//               <li><strong>Option B (Computer):</strong> Click the blue button above</li>
//               <li>Enter <strong>OTP</strong> sent to your email</li>
//               <li>You're logged in! ✅</li>
//             </ol>
//           </div>
          
//           <hr style="margin: 20px 0;" />
          
//           <div style="background-color: #fff3e0; padding: 10px; border-radius: 5px;">
//             <p style="margin: 0; font-size: 12px; color: #e67e22;">
//               ⚠️ <strong>Security Note:</strong> This link is for your personal use only. 
//               Do not share it with anyone. If you didn't request this, please ignore.
//             </p>
//           </div>
          
//           <p style="font-size: 11px; color: #888; margin-top: 20px;">
//             This is an automated message from School Management System.
//           </p>
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Your Login QR Code
      
//       Dear ${studentName},
      
//       Use this QR code to login without password.
      
//       DIRECT LOGIN LINK (Click this): ${qrLink}
      
//       How to use:
//       1. Click the link above OR scan QR code with phone
//       2. Enter OTP sent to your email
//       3. You're logged in!
      
//       Security Note: This link is for your personal use only. Do not share it.
      
//       - School Management System
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Your Login QR Code - School Portal",
//       text: text,
//       html: html
//     };
    
    
//     const info = await transporter.sendMail(mailOptions);
    
//     return true;
    
//   } catch (error) {
//     console.error(`❌ [LOGIN QR] Email error:`, error.message);
//     console.error(`❌ [LOGIN QR] Full error:`, error);
//     return false;
//   }
// };

// // Send OTP Email for Login Verification
// export const sendOTPEmail = async (email, otp, studentName) => {
 
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Login Verification</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p>Dear <strong>${studentName}</strong>,</p>
//           <p>Your login OTP is:</p>
          
//           <div style="background: #f0f0f0; padding: 15px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold; border-radius: 8px;">
//             ${otp}
//           </div>
          
//           <p style="margin-top: 15px;">This OTP is valid for <strong>5 minutes</strong>.</p>
//           <p>If you didn't request this, please ignore this email.</p>
          
//           <hr style="margin: 20px 0;" />
//           <p style="font-size: 11px; color: #888;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Your Login OTP",
//       html: html
//     };
    
    
//     const info = await transporter.sendMail(mailOptions);
   
//     return true;
    
//   } catch (error) {
//     console.error(`❌ [OTP] Email error:`, error.message);
//     console.error(`❌ [OTP] Full error:`, error);
//     return false;
//   }
// };














// import nodemailer from 'nodemailer';

// // Gmail configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Verify transporter on startup
// const verifyTransporter = async () => {
//   try {
//     await transporter.verify();
//     console.log('✅ Email transporter ready');
//   } catch (error) {
//     console.error('❌ Gmail transporter error:', error.message);
//   }
// };
// verifyTransporter();

// // ==================== STUDENT ATTENDANCE EMAIL ====================
// export const sendAttendanceEmail = async (email, studentName, status, time, date) => {
//   try {
//     let subject = '';
//     let emoji = '';
//     let color = '';
    
//     if (status === 'absent') {
//       subject = `⚠️ Attendance Alert: ${studentName} was ABSENT`;
//       emoji = '❌';
//       color = '#d32f2f';
//     } else if (status === 'late') {
//       subject = `⚠️ Attendance Alert: ${studentName} was LATE`;
//       emoji = '⏰';
//       color = '#ff9800';
//     } else {
//       subject = `✅ Attendance: ${studentName} was PRESENT`;
//       emoji = '✅';
//       color = '#4caf50';
//     }
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🏫 School Management System</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <div style="text-align: center; font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
//             <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span></p>
//             ${time ? `<p style="margin: 5px 0;"><strong>Check-in Time:</strong> ${time}</p>` : ''}
//             <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
//           </div>
          
//           <div style="background-color: ${color}10; padding: 12px; border-radius: 8px;">
//             <p style="margin: 0; font-size: 12px; color: #666;">
//               ${status === 'absent' ? '📢 Please ensure regular attendance for academic success.' : status === 'late' ? '⏰ School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.' : '✓ Thank you for maintaining regular attendance.'}
//             </p>
//           </div>
//         </div>
        
//         <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 11px; color: #888; border-radius: 0 0 10px 10px;">
//           This is an automated message from School Management System. Please do not reply.
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Attendance Alert
      
//       Student: ${studentName}
//       Status: ${status.toUpperCase()}
//       ${time ? `Time: ${time}` : ''}
//       Date: ${date}
      
//       ${status === 'absent' ? 'Please ensure regular attendance.' : status === 'late' ? 'School timing: 8:00 AM - 9:00 AM' : 'Thank you!'}
//     `;
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: subject,
//       text: text,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Student attendance email sent to ${email}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Student attendance email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== LOGIN QR CODE EMAIL ====================
// export const sendLoginQREmail = async (email, studentName, qrCodeDataUrl, qrLink) => {
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Your Login QR Code</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
//           <p>Use this QR code to login to your account <strong>without password</strong>.</p>
          
//           <div style="background: white; padding: 15px; display: inline-block; margin: 15px 0; border: 1px solid #ddd; border-radius: 10px;">
//             <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px;" alt="Login QR Code" />
//           </div>
          
//           <div style="margin: 20px 0;">
//             <a href="${qrLink}" style="background: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
//               🔗 Click Here to Login Directly
//             </a>
//             <p style="font-size: 12px; color: #666; margin-top: 10px;">
//               Or copy this link: <span style="color: #1e3c72; word-break: break-all;">${qrLink}</span>
//             </p>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
//             <p style="margin: 0 0 10px 0; font-weight: bold;">📱 How to use:</p>
//             <ol style="margin: 0; padding-left: 20px;">
//               <li><strong>Option A (Phone):</strong> Scan QR code with phone camera</li>
//               <li><strong>Option B (Computer):</strong> Click the blue button above</li>
//               <li>Enter <strong>OTP</strong> sent to your email</li>
//               <li>You're logged in! ✅</li>
//             </ol>
//           </div>
          
//           <hr style="margin: 20px 0;" />
          
//           <div style="background-color: #fff3e0; padding: 10px; border-radius: 5px;">
//             <p style="margin: 0; font-size: 12px; color: #e67e22;">
//               ⚠️ <strong>Security Note:</strong> This link is for your personal use only. 
//               Do not share it with anyone. If you didn't request this, please ignore.
//             </p>
//           </div>
          
//           <p style="font-size: 11px; color: #888; margin-top: 20px;">
//             This is an automated message from School Management System.
//           </p>
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Your Login QR Code
      
//       Dear ${studentName},
      
//       Use this QR code to login without password.
      
//       DIRECT LOGIN LINK (Click this): ${qrLink}
      
//       How to use:
//       1. Click the link above OR scan QR code with phone
//       2. Enter OTP sent to your email
//       3. You're logged in!
      
//       Security Note: This link is for your personal use only. Do not share it.
      
//       - School Management System
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Your Login QR Code - School Portal",
//       text: text,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Login QR email sent to ${email}`);
//     return true;
    
//   } catch (error) {
//     console.error(`❌ Login QR email error:`, error.message);
//     return false;
//   }
// };

// // ==================== OTP EMAIL ====================
// export const sendOTPEmail = async (email, otp, studentName) => {
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Login Verification</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p>Dear <strong>${studentName}</strong>,</p>
//           <p>Your login OTP is:</p>
          
//           <div style="background: #f0f0f0; padding: 15px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold; border-radius: 8px;">
//             ${otp}
//           </div>
          
//           <p style="margin-top: 15px;">This OTP is valid for <strong>5 minutes</strong>.</p>
//           <p>If you didn't request this, please ignore this email.</p>
          
//           <hr style="margin: 20px 0;" />
//           <p style="font-size: 11px; color: #888;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Your Login OTP",
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent to ${email}`);
//     return true;
    
//   } catch (error) {
//     console.error(`❌ OTP email error:`, error.message);
//     return false;
//   }
// };

// // ==================== TEACHER ATTENDANCE EMAILS ====================

// // Send teacher late notification email
// export const sendTeacherLateEmail = async (email, teacherName, time, date) => {
//   console.log(`📧 Sending teacher late email for: ${teacherName}`);
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="background-color: #e67e22; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">⚠️ Teacher Late Arrival Alert</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Admin,</p>
//           <p>Teacher <strong>${teacherName}</strong> arrived late today.</p>
          
//           <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Check-in Time:</strong> ${time}</p>
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>Expected Time:</strong> 7:00 AM - 8:00 AM</p>
//           </div>
          
//           <p>Please take necessary action.</p>
//           <hr/>
//           <p style="font-size: 12px; color: #666;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const targetEmail = process.env.ADMIN_EMAIL || email;
    
//     const mailOptions = {
//       from: `"Attendance Alert" <${process.env.EMAIL_USER}>`,
//       to: targetEmail,
//       subject: `⚠️ Teacher Late: ${teacherName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Teacher late email sent to ${targetEmail}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Teacher late email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Send teacher absent notification email
// export const sendTeacherAbsentEmail = async (email, teacherName, date) => {
//   console.log(`📧 Sending teacher absent email for: ${teacherName}`);
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">❌ Teacher Absent Alert</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Admin,</p>
//           <p>Teacher <strong>${teacherName}</strong> was absent today.</p>
          
//           <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>No check-in recorded</strong></p>
//           </div>
          
//           <p>Please follow up with the teacher.</p>
//           <hr/>
//           <p style="font-size: 12px; color: #666;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const targetEmail = process.env.ADMIN_EMAIL || email;
    
//     const mailOptions = {
//       from: `"Attendance Alert" <${process.env.EMAIL_USER}>`,
//       to: targetEmail,
//       subject: `❌ Teacher Absent: ${teacherName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Teacher absent email sent to ${targetEmail}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Teacher absent email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== EXPORTS ====================
// export { 
//   sendAttendanceEmail, 
//   sendLoginQREmail, 
//   sendOTPEmail,
//   sendTeacherLateEmail,
//   sendTeacherAbsentEmail 
// };
















// import nodemailer from 'nodemailer';

// // Gmail configuration
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Verify transporter on startup
// const verifyTransporter = async () => {
//   try {
//     await transporter.verify();
//     console.log('✅ Email transporter ready');
//   } catch (error) {
//     console.error('❌ Gmail transporter error:', error.message);
//   }
// };
// verifyTransporter();

// // ==================== STUDENT ATTENDANCE EMAIL ====================
// export const sendAttendanceEmail = async (email, studentName, status, time, date) => {
//   try {
//     let subject = '';
//     let emoji = '';
//     let color = '';
    
//     if (status === 'absent') {
//       subject = `⚠️ Attendance Alert: ${studentName} was ABSENT`;
//       emoji = '❌';
//       color = '#d32f2f';
//     } else if (status === 'late') {
//       subject = `⚠️ Attendance Alert: ${studentName} was LATE`;
//       emoji = '⏰';
//       color = '#ff9800';
//     } else if (status === 'fee_paid') {
//       subject = `✅ Fee Payment Confirmation: ${studentName}`;
//       emoji = '💰';
//       color = '#4caf50';
//     } else {
//       subject = `✅ Attendance: ${studentName} was PRESENT`;
//       emoji = '✅';
//       color = '#4caf50';
//     }
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🏫 School Management System</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <div style="text-align: center; font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
//             <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span></p>
//             ${time ? `<p style="margin: 5px 0;"><strong>Check-in Time:</strong> ${time}</p>` : ''}
//             <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
//           </div>
          
//           <div style="background-color: ${color}10; padding: 12px; border-radius: 8px;">
//             <p style="margin: 0; font-size: 12px; color: #666;">
//               ${status === 'absent' ? '📢 Please ensure regular attendance for academic success.' : status === 'late' ? '⏰ School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.' : status === 'fee_paid' ? '💰 Thank you for your timely payment.' : '✓ Thank you for maintaining regular attendance.'}
//             </p>
//           </div>
//         </div>
        
//         <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 11px; color: #888; border-radius: 0 0 10px 10px;">
//           This is an automated message from School Management System. Please do not reply.
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Attendance Alert
      
//       Student: ${studentName}
//       Status: ${status.toUpperCase()}
//       ${time ? `Time: ${time}` : ''}
//       Date: ${date}
      
//       ${status === 'absent' ? 'Please ensure regular attendance.' : status === 'late' ? 'School timing: 8:00 AM - 9:00 AM' : status === 'fee_paid' ? 'Thank you for payment!' : 'Thank you!'}
//     `;
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: subject,
//       text: text,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Student attendance email sent to ${email}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Student attendance email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== FEE QR CODE EMAIL (WITH ATTACHMENT) ====================
// export const sendFeeQREmail = async (email, studentName, rollNo, month, amount, dueDate, qrCodeImage, qrLink) => {
//   try {
//     const html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       </head>
//       <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
//         <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 25px; text-align: center;">
//             <h1 style="margin: 0; font-size: 24px;">🏫 School Management System</h1>
//             <p style="margin: 10px 0 0; opacity: 0.9;">Fee Payment QR Code</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 25px;">
//             <p style="font-size: 16px; margin-top: 0;">Dear Parent,</p>
            
//             <p style="font-size: 14px;">Your child's fee payment QR code is attached with this email. Please save it to your phone.</p>
            
//             <!-- Student Details Table -->
//             <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 8px 0;"><strong>Student Name:</strong></td>
//                   <td style="padding: 8px 0;">${studentName}</td>
//                 </tr>
//                 <tr style="background-color: #f0f0f0;">
//                   <td style="padding: 8px 0;"><strong>Roll Number:</strong></td>
//                   <td style="padding: 8px 0;">${rollNo}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0;"><strong>Month:</strong></td>
//                   <td style="padding: 8px 0;">${month}</td>
//                 </tr>
//                 <tr style="background-color: #f0f0f0;">
//                   <td style="padding: 8px 0;"><strong>Amount:</strong></td>
//                   <td style="padding: 8px 0; color: #dc3545; font-weight: bold;">PKR ${amount?.toLocaleString() || 0}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
//                   <td style="padding: 8px 0; color: #ff9800;">${new Date(dueDate).toLocaleDateString()}</td>
//                 </tr>
//               </table>
//             </div>
            
//             <!-- Instructions -->
//             <div style="background-color: #e3f2fd; border-radius: 8px; padding: 15px; margin: 20px 0;">
//               <p style="font-weight: bold; margin: 0 0 10px 0; color: #1e3c72;">📖 How to Use:</p>
//               <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #555;">
//                 <li><strong>Save the attached QR code image</strong> to your phone</li>
//                 <li>Show this QR code at school fee counter</li>
//                 <li>Counter person will scan it</li>
//                 <li>Pay the amount and get receipt</li>
//               </ol>
//             </div>
            
//             <!-- Backup Link (Optional) -->
//             <div style="background-color: #f0f0f0; border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center;">
//               <p style="margin: 0; font-size: 12px; color: #666;">
//                 🔗 <strong>Backup Link (if QR not working):</strong><br>
//                 <a href="${qrLink}" style="color: #1e3c72; word-break: break-all;">${qrLink}</a>
//               </p>
//             </div>
            
//             <!-- Note Box -->
//             <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 13px;">
//               <p style="margin: 0; color: #856404;">
//                 <strong>💡 Note:</strong> This QR code is valid for 30 days. 
//                 If expired, please contact school for new QR.
//               </p>
//             </div>
            
//             <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            
//             <p style="font-size: 12px; color: #888; text-align: center;">
//               This is an automated message from School Management System.<br>
//               For any queries, please contact school administration.
//             </p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
    
//     const text = `
//       School Management System - Fee Payment QR Code
      
//       Dear Parent,
      
//       Student: ${studentName}
//       Roll No: ${rollNo}
//       Month: ${month}
//       Amount: PKR ${amount?.toLocaleString() || 0}
//       Due Date: ${new Date(dueDate).toLocaleDateString()}
      
//       How to use:
//       1. Save the attached QR code image to your phone
//       2. Show this QR code at school fee counter
//       3. Pay the amount
      
//       Backup Link (if QR not working): ${qrLink}
      
//       This QR code is valid for 30 days.
      
//       Thank you,
//       School Management System
//     `;
    
//     // ✅ ATTACH QR CODE IMAGE
//     const attachments = [];
//     if (qrCodeImage) {
//       let base64Data = qrCodeImage;
//       // Remove data:image/png;base64, prefix if exists
//       if (base64Data.includes('base64,')) {
//         base64Data = base64Data.split('base64,')[1];
//       }
      
//       attachments.push({
//         filename: `QR_Code_${studentName.replace(/\s/g, '_')}_${month.replace(/\s/g, '_')}.png`,
//         content: base64Data,
//         encoding: 'base64',
//         cid: 'qrCodeImage'
//       });
//     }
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `📱 Fee Payment QR Code - ${month} (${studentName})`,
//       text: text,
//       html: html,
//       attachments: attachments  // ✅ QR CODE ATTACHED
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Fee QR email sent to ${email} for ${studentName} with QR attachment`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Fee QR email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== FEE PAYMENT CONFIRMATION EMAIL ====================
// export const sendFeePaymentConfirmation = async (email, studentName, rollNo, month, amountPaid, remainingAmount, isFullyPaid) => {
//   try {
//     const statusText = isFullyPaid ? 'FULLY PAID' : 'PARTIALLY PAID';
//     const statusColor = isFullyPaid ? '#28a745' : '#ff9800';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">💰 Fee Payment Confirmation</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Parent,</p>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Student:</strong> ${studentName}</p>
//             <p><strong>Roll No:</strong> ${rollNo}</p>
//             <p><strong>Month:</strong> ${month}</p>
//             <p><strong>Amount Paid:</strong> PKR ${amountPaid?.toLocaleString()}</p>
//             <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
//             ${!isFullyPaid ? `<p><strong>Remaining:</strong> PKR ${remainingAmount?.toLocaleString()}</p>` : ''}
//           </div>
          
//           ${!isFullyPaid ? `
//             <div style="background-color: #fff3cd; padding: 12px; border-radius: 8px;">
//               <p style="margin: 0; font-size: 13px;">⚠️ Please clear the remaining amount by due date.</p>
//             </div>
//           ` : `
//             <div style="background-color: #d4edda; padding: 12px; border-radius: 8px;">
//               <p style="margin: 0; font-size: 13px;">✅ Thank you for completing your fee payment!</p>
//             </div>
//           `}
          
//           <hr style="margin: 20px 0;">
//           <p style="font-size: 12px; color: #888;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `${isFullyPaid ? '✅' : '💰'} Fee Payment ${isFullyPaid ? 'Confirmation' : 'Update'} - ${studentName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Fee payment confirmation email sent to ${email}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Fee payment confirmation error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== LOGIN QR CODE EMAIL ====================
// export const sendLoginQREmail = async (email, studentName, qrCodeDataUrl, qrLink) => {
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Your Login QR Code</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
//           <p>Use this QR code to login to your account <strong>without password</strong>.</p>
          
//           <div style="background: white; padding: 15px; display: inline-block; margin: 15px 0; border: 1px solid #ddd; border-radius: 10px;">
//             <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px;" alt="Login QR Code" />
//           </div>
          
//           <div style="margin: 20px 0;">
//             <a href="${qrLink}" style="background: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
//               🔗 Click Here to Login Directly
//             </a>
//             <p style="font-size: 12px; color: #666; margin-top: 10px;">
//               Or copy this link: <span style="color: #1e3c72; word-break: break-all;">${qrLink}</span>
//             </p>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
//             <p style="margin: 0 0 10px 0; font-weight: bold;">📱 How to use:</p>
//             <ol style="margin: 0; padding-left: 20px;">
//               <li><strong>Option A (Phone):</strong> Scan QR code with phone camera</li>
//               <li><strong>Option B (Computer):</strong> Click the blue button above</li>
//               <li>Enter <strong>OTP</strong> sent to your email</li>
//               <li>You're logged in! ✅</li>
//             </ol>
//           </div>
          
//           <hr style="margin: 20px 0;" />
          
//           <div style="background-color: #fff3e0; padding: 10px; border-radius: 5px;">
//             <p style="margin: 0; font-size: 12px; color: #e67e22;">
//               ⚠️ <strong>Security Note:</strong> This link is for your personal use only. 
//               Do not share it with anyone. If you didn't request this, please ignore.
//             </p>
//           </div>
          
//           <p style="font-size: 11px; color: #888; margin-top: 20px;">
//             This is an automated message from School Management System.
//           </p>
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Your Login QR Code
      
//       Dear ${studentName},
      
//       Use this QR code to login without password.
      
//       DIRECT LOGIN LINK (Click this): ${qrLink}
      
//       How to use:
//       1. Click the link above OR scan QR code with phone
//       2. Enter OTP sent to your email
//       3. You're logged in!
      
//       Security Note: This link is for your personal use only. Do not share it.
      
//       - School Management System
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Your Login QR Code - School Portal",
//       text: text,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Login QR email sent to ${email}`);
//     return true;
    
//   } catch (error) {
//     console.error(`❌ Login QR email error:`, error.message);
//     return false;
//   }
// };

// // ==================== OTP EMAIL ====================
// export const sendOTPEmail = async (email, otp, studentName) => {
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Login Verification</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p>Dear <strong>${studentName}</strong>,</p>
//           <p>Your login OTP is:</p>
          
//           <div style="background: #f0f0f0; padding: 15px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold; border-radius: 8px;">
//             ${otp}
//           </div>
          
//           <p style="margin-top: 15px;">This OTP is valid for <strong>5 minutes</strong>.</p>
//           <p>If you didn't request this, please ignore this email.</p>
          
//           <hr style="margin: 20px 0;" />
//           <p style="font-size: 11px; color: #888;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔐 Your Login OTP",
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent to ${email}`);
//     return true;
    
//   } catch (error) {
//     console.error(`❌ OTP email error:`, error.message);
//     return false;
//   }
// };

// // ==================== TEACHER ATTENDANCE EMAILS ====================

// export const sendTeacherLateEmail = async (email, teacherName, time, date) => {
//   console.log(`📧 Sending teacher late email for: ${teacherName}`);
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="background-color: #e67e22; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">⚠️ Teacher Late Arrival Alert</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Admin,</p>
//           <p>Teacher <strong>${teacherName}</strong> arrived late today.</p>
          
//           <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Check-in Time:</strong> ${time}</p>
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>Expected Time:</strong> 7:00 AM - 8:00 AM</p>
//           </div>
          
//           <p>Please take necessary action.</p>
//           <hr/>
//           <p style="font-size: 12px; color: #666;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const targetEmail = process.env.ADMIN_EMAIL || email;
    
//     const mailOptions = {
//       from: `"Attendance Alert" <${process.env.EMAIL_USER}>`,
//       to: targetEmail,
//       subject: `⚠️ Teacher Late: ${teacherName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Teacher late email sent to ${targetEmail}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Teacher late email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// export const sendTeacherAbsentEmail = async (email, teacherName, date) => {
//   console.log(`📧 Sending teacher absent email for: ${teacherName}`);
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">❌ Teacher Absent Alert</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Admin,</p>
//           <p>Teacher <strong>${teacherName}</strong> was absent today.</p>
          
//           <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>No check-in recorded</strong></p>
//           </div>
          
//           <p>Please follow up with the teacher.</p>
//           <hr/>
//           <p style="font-size: 12px; color: #666;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const targetEmail = process.env.ADMIN_EMAIL || email;
    
//     const mailOptions = {
//       from: `"Attendance Alert" <${process.env.EMAIL_USER}>`,
//       to: targetEmail,
//       subject: `❌ Teacher Absent: ${teacherName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Teacher absent email sent to ${targetEmail}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Teacher absent email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== EXPORTS ====================
// export { 
//   sendAttendanceEmail, 
//   sendLoginQREmail, 
//   sendOTPEmail,
//   sendTeacherLateEmail,
//   sendTeacherAbsentEmail,
//   sendFeeQREmail,
//   sendFeePaymentConfirmation
// };





// // lib/email.js - Brevo SMTP Version

// import nodemailer from 'nodemailer';

// // ==================== BREVO SMTP CONFIGURATION ====================
// const transporter = nodemailer.createTransport({
//   host: process.env.BREVO_SMTP_SERVER || 'smtp-relay.brevo.com',
//   port: parseInt(process.env.BREVO_SMTP_PORT) || 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.BREVO_USER,
//     pass: process.env.BREVO_SMTP_KEY
//   }
// });

// // Verify transporter on startup
// const verifyTransporter = async () => {
//   try {
//     await transporter.verify();
//     console.log('✅ Brevo email transporter ready');
//   } catch (error) {
//     console.error('❌ Brevo transporter error:', error.message);
//   }
// };
// verifyTransporter();

// // ==================== STUDENT ATTENDANCE EMAIL ====================
// export const sendAttendanceEmail = async (email, studentName, status, time, date) => {
//   try {
//     let subject = '';
//     let emoji = '';
//     let color = '';
    
//     if (status === 'absent') {
//       subject = `⚠️ Attendance Alert: ${studentName} was ABSENT`;
//       emoji = '❌';
//       color = '#d32f2f';
//     } else if (status === 'late') {
//       subject = `⚠️ Attendance Alert: ${studentName} was LATE`;
//       emoji = '⏰';
//       color = '#ff9800';
//     } else if (status === 'fee_paid') {
//       subject = `✅ Fee Payment Confirmation: ${studentName}`;
//       emoji = '💰';
//       color = '#4caf50';
//     } else {
//       subject = `✅ Attendance: ${studentName} was PRESENT`;
//       emoji = '✅';
//       color = '#4caf50';
//     }
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🏫 School Management System</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <div style="text-align: center; font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
//             <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span></p>
//             ${time ? `<p style="margin: 5px 0;"><strong>Check-in Time:</strong> ${time}</p>` : ''}
//             <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
//           </div>
          
//           <div style="background-color: ${color}10; padding: 12px; border-radius: 8px;">
//             <p style="margin: 0; font-size: 12px; color: #666;">
//               ${status === 'absent' ? '📢 Please ensure regular attendance for academic success.' : status === 'late' ? '⏰ School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.' : status === 'fee_paid' ? '💰 Thank you for your timely payment.' : '✓ Thank you for maintaining regular attendance.'}
//             </p>
//           </div>
//         </div>
        
//         <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 11px; color: #888; border-radius: 0 0 10px 10px;">
//           This is an automated message from School Management System. Please do not reply.
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Attendance Alert
      
//       Student: ${studentName}
//       Status: ${status.toUpperCase()}
//       ${time ? `Time: ${time}` : ''}
//       Date: ${date}
      
//       ${status === 'absent' ? 'Please ensure regular attendance.' : status === 'late' ? 'School timing: 8:00 AM - 9:00 AM' : status === 'fee_paid' ? 'Thank you for payment!' : 'Thank you!'}
//     `;
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: email,
//       subject: subject,
//       text: text,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Student attendance email sent to ${email}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Student attendance email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== FEE QR CODE EMAIL (WITH ATTACHMENT) ====================
// export const sendFeeQREmail = async (email, studentName, rollNo, month, amount, dueDate, qrCodeImage, qrLink) => {
//   try {
//     const html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       </head>
//       <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
//         <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 25px; text-align: center;">
//             <h1 style="margin: 0; font-size: 24px;">🏫 School Management System</h1>
//             <p style="margin: 10px 0 0; opacity: 0.9;">Fee Payment QR Code</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 25px;">
//             <p style="font-size: 16px; margin-top: 0;">Dear Parent,</p>
            
//             <p style="font-size: 14px;">Your child's fee payment QR code is attached with this email. Please save it to your phone.</p>
            
//             <!-- Student Details Table -->
//             <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
//               <table style="width: 100%; border-collapse: collapse;">
//                 <tr>
//                   <td style="padding: 8px 0;"><strong>Student Name:</strong></td>
//                   <td style="padding: 8px 0;">${studentName}</td>
//                 </tr>
//                 <tr style="background-color: #f0f0f0;">
//                   <td style="padding: 8px 0;"><strong>Roll Number:</strong></td>
//                   <td style="padding: 8px 0;">${rollNo}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0;"><strong>Month:</strong></td>
//                   <td style="padding: 8px 0;">${month}</td>
//                 </tr>
//                 <tr style="background-color: #f0f0f0;">
//                   <td style="padding: 8px 0;"><strong>Amount:</strong></td>
//                   <td style="padding: 8px 0; color: #dc3545; font-weight: bold;">PKR ${amount?.toLocaleString() || 0}</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
//                   <td style="padding: 8px 0; color: #ff9800;">${new Date(dueDate).toLocaleDateString()}</td>
//                 </tr>
//               </table>
//             </div>
            
//             <!-- Instructions -->
//             <div style="background-color: #e3f2fd; border-radius: 8px; padding: 15px; margin: 20px 0;">
//               <p style="font-weight: bold; margin: 0 0 10px 0; color: #1e3c72;">📖 How to Use:</p>
//               <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #555;">
//                 <li><strong>Save the attached QR code image</strong> to your phone</li>
//                 <li>Show this QR code at school fee counter</li>
//                 <li>Counter person will scan it</li>
//                 <li>Pay the amount and get receipt</li>
//               </ol>
//             </div>
            
//             <!-- Backup Link (Optional) -->
//             <div style="background-color: #f0f0f0; border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center;">
//               <p style="margin: 0; font-size: 12px; color: #666;">
//                 🔗 <strong>Backup Link (if QR not working):</strong><br>
//                 <a href="${qrLink}" style="color: #1e3c72; word-break: break-all;">${qrLink}</a>
//               </p>
//             </div>
            
//             <!-- Note Box -->
//             <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 13px;">
//               <p style="margin: 0; color: #856404;">
//                 <strong>💡 Note:</strong> This QR code is valid for 30 days. 
//                 If expired, please contact school for new QR.
//               </p>
//             </div>
            
//             <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            
//             <p style="font-size: 12px; color: #888; text-align: center;">
//               This is an automated message from School Management System.<br>
//               For any queries, please contact school administration.
//             </p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
    
//     const text = `
//       School Management System - Fee Payment QR Code
      
//       Dear Parent,
      
//       Student: ${studentName}
//       Roll No: ${rollNo}
//       Month: ${month}
//       Amount: PKR ${amount?.toLocaleString() || 0}
//       Due Date: ${new Date(dueDate).toLocaleDateString()}
      
//       How to use:
//       1. Save the attached QR code image to your phone
//       2. Show this QR code at school fee counter
//       3. Pay the amount
      
//       Backup Link (if QR not working): ${qrLink}
      
//       This QR code is valid for 30 days.
      
//       Thank you,
//       School Management System
//     `;
    
//     // ✅ ATTACH QR CODE IMAGE
//     const attachments = [];
//     if (qrCodeImage) {
//       let base64Data = qrCodeImage;
//       if (base64Data.includes('base64,')) {
//         base64Data = base64Data.split('base64,')[1];
//       }
      
//       attachments.push({
//         filename: `QR_Code_${studentName.replace(/\s/g, '_')}_${month.replace(/\s/g, '_')}.png`,
//         content: base64Data,
//         encoding: 'base64',
//         cid: 'qrCodeImage'
//       });
//     }
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: email,
//       subject: `📱 Fee Payment QR Code - ${month} (${studentName})`,
//       text: text,
//       html: html,
//       attachments: attachments
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Fee QR email sent to ${email} for ${studentName} with QR attachment`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Fee QR email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== FEE PAYMENT CONFIRMATION EMAIL ====================
// export const sendFeePaymentConfirmation = async (email, studentName, rollNo, month, amountPaid, remainingAmount, isFullyPaid) => {
//   try {
//     const statusText = isFullyPaid ? 'FULLY PAID' : 'PARTIALLY PAID';
//     const statusColor = isFullyPaid ? '#28a745' : '#ff9800';
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">💰 Fee Payment Confirmation</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Parent,</p>
          
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Student:</strong> ${studentName}</p>
//             <p><strong>Roll No:</strong> ${rollNo}</p>
//             <p><strong>Month:</strong> ${month}</p>
//             <p><strong>Amount Paid:</strong> PKR ${amountPaid?.toLocaleString()}</p>
//             <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
//             ${!isFullyPaid ? `<p><strong>Remaining:</strong> PKR ${remainingAmount?.toLocaleString()}</p>` : ''}
//           </div>
          
//           ${!isFullyPaid ? `
//             <div style="background-color: #fff3cd; padding: 12px; border-radius: 8px;">
//               <p style="margin: 0; font-size: 13px;">⚠️ Please clear the remaining amount by due date.</p>
//             </div>
//           ` : `
//             <div style="background-color: #d4edda; padding: 12px; border-radius: 8px;">
//               <p style="margin: 0; font-size: 13px;">✅ Thank you for completing your fee payment!</p>
//             </div>
//           `}
          
//           <hr style="margin: 20px 0;">
//           <p style="font-size: 12px; color: #888;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const mailOptions = {
//       from: `"School Management" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: email,
//       subject: `${isFullyPaid ? '✅' : '💰'} Fee Payment ${isFullyPaid ? 'Confirmation' : 'Update'} - ${studentName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Fee payment confirmation email sent to ${email}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Fee payment confirmation error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== LOGIN QR CODE EMAIL ====================
// export const sendLoginQREmail = async (email, studentName, qrCodeDataUrl, qrLink) => {
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Your Login QR Code</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
//           <p>Use this QR code to login to your account <strong>without password</strong>.</p>
          
//           <div style="background: white; padding: 15px; display: inline-block; margin: 15px 0; border: 1px solid #ddd; border-radius: 10px;">
//             <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px;" alt="Login QR Code" />
//           </div>
          
//           <div style="margin: 20px 0;">
//             <a href="${qrLink}" style="background: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
//               🔗 Click Here to Login Directly
//             </a>
//             <p style="font-size: 12px; color: #666; margin-top: 10px;">
//               Or copy this link: <span style="color: #1e3c72; word-break: break-all;">${qrLink}</span>
//             </p>
//           </div>
          
//           <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
//             <p style="margin: 0 0 10px 0; font-weight: bold;">📱 How to use:</p>
//             <ol style="margin: 0; padding-left: 20px;">
//               <li><strong>Option A (Phone):</strong> Scan QR code with phone camera</li>
//               <li><strong>Option B (Computer):</strong> Click the blue button above</li>
//               <li>Enter <strong>OTP</strong> sent to your email</li>
//               <li>You're logged in! ✅</li>
//             </ol>
//           </div>
          
//           <hr style="margin: 20px 0;" />
          
//           <div style="background-color: #fff3e0; padding: 10px; border-radius: 5px;">
//             <p style="margin: 0; font-size: 12px; color: #e67e22;">
//               ⚠️ <strong>Security Note:</strong> This link is for your personal use only. 
//               Do not share it with anyone. If you didn't request this, please ignore.
//             </p>
//           </div>
          
//           <p style="font-size: 11px; color: #888; margin-top: 20px;">
//             This is an automated message from School Management System.
//           </p>
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Your Login QR Code
      
//       Dear ${studentName},
      
//       Use this QR code to login without password.
      
//       DIRECT LOGIN LINK (Click this): ${qrLink}
      
//       How to use:
//       1. Click the link above OR scan QR code with phone
//       2. Enter OTP sent to your email
//       3. You're logged in!
      
//       Security Note: This link is for your personal use only. Do not share it.
      
//       - School Management System
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: email,
//       subject: "🔐 Your Login QR Code - School Portal",
//       text: text,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Login QR email sent to ${email}`);
//     return true;
    
//   } catch (error) {
//     console.error(`❌ Login QR email error:`, error.message);
//     return false;
//   }
// };

// // ==================== OTP EMAIL ====================
// export const sendOTPEmail = async (email, otp, studentName) => {
//   try {
//     console.log(`📧 Preparing OTP email for ${email} (${studentName})`);
//     console.log(`🔑 OTP: ${otp}`);
    
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//         <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">🔐 Login Verification</h2>
//         </div>
        
//         <div style="padding: 20px; text-align: center;">
//           <p>Dear <strong>${studentName}</strong>,</p>
//           <p>Your login OTP is:</p>
          
//           <div style="background: #f0f0f0; padding: 15px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold; border-radius: 8px;">
//             ${otp}
//           </div>
          
//           <p style="margin-top: 15px;">This OTP is valid for <strong>10 minutes</strong>.</p>
//           <p>If you didn't request this, please ignore this email.</p>
          
//           <hr style="margin: 20px 0;" />
//           <p style="font-size: 11px; color: #888;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const text = `
//       School Management System - Login Verification
      
//       Dear ${studentName},
      
//       Your login OTP is: ${otp}
      
//       This OTP is valid for 10 minutes.
      
//       If you didn't request this, please ignore this email.
      
//       - School Management System
//     `;
    
//     const mailOptions = {
//       from: `"School Portal" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: email,
//       subject: "🔐 Your Login OTP - School Management System",
//       text: text,
//       html: html
//     };
    
//     console.log(`📤 Sending email via Brevo transporter to ${email}...`);
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent to ${email}`, info.messageId);
//     return { success: true, messageId: info.messageId };
    
//   } catch (error) {
//     console.error(`❌ OTP email error to ${email}:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== TEACHER ATTENDANCE EMAILS ====================

// export const sendTeacherLateEmail = async (email, teacherName, time, date) => {
//   console.log(`📧 Sending teacher late email for: ${teacherName}`);
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="background-color: #e67e22; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">⚠️ Teacher Late Arrival Alert</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Admin,</p>
//           <p>Teacher <strong>${teacherName}</strong> arrived late today.</p>
          
//           <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Check-in Time:</strong> ${time}</p>
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>Expected Time:</strong> 7:00 AM - 8:00 AM</p>
//           </div>
          
//           <p>Please take necessary action.</p>
//           <hr/>
//           <p style="font-size: 12px; color: #666;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const targetEmail = process.env.ADMIN_EMAIL || email;
    
//     const mailOptions = {
//       from: `"Attendance Alert" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: targetEmail,
//       subject: `⚠️ Teacher Late: ${teacherName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Teacher late email sent to ${targetEmail}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Teacher late email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// export const sendTeacherAbsentEmail = async (email, teacherName, date) => {
//   console.log(`📧 Sending teacher absent email for: ${teacherName}`);
  
//   try {
//     const html = `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//         <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="margin: 0;">❌ Teacher Absent Alert</h2>
//         </div>
        
//         <div style="padding: 20px;">
//           <p>Dear Admin,</p>
//           <p>Teacher <strong>${teacherName}</strong> was absent today.</p>
          
//           <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>No check-in recorded</strong></p>
//           </div>
          
//           <p>Please follow up with the teacher.</p>
//           <hr/>
//           <p style="font-size: 12px; color: #666;">School Management System</p>
//         </div>
//       </div>
//     `;
    
//     const targetEmail = process.env.ADMIN_EMAIL || email;
    
//     const mailOptions = {
//       from: `"Attendance Alert" <${process.env.FROM_EMAIL || process.env.BREVO_USER}>`,
//       to: targetEmail,
//       subject: `❌ Teacher Absent: ${teacherName}`,
//       html: html
//     };
    
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Teacher absent email sent to ${targetEmail}`);
//     return { success: true };
    
//   } catch (error) {
//     console.error(`❌ Teacher absent email error:`, error.message);
//     return { success: false, error: error.message };
//   }
// };

// // ==================== EXPORTS ====================
// export { 
//   sendAttendanceEmail, 
//   sendLoginQREmail, 
//   sendOTPEmail,
//   sendTeacherLateEmail,
//   sendTeacherAbsentEmail,
//   sendFeeQREmail,
//   sendFeePaymentConfirmation
// };


























// api





// lib/email.js - Brevo API Version

import axios from 'axios';

// ==================== BREVO API CONFIGURATION ====================
const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';
const FROM_EMAIL = process.env.FROM_EMAIL || 'hussaindev2007@gmail.com';

// ==================== SEND EMAIL VIA BREVO API ====================
const sendBrevoEmail = async (to, subject, htmlContent, textContent, attachments = []) => {
  try {
    const payload = {
      sender: { 
        email: FROM_EMAIL,
        name: 'School Portal'
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent || htmlContent.replace(/<[^>]*>/g, '')
    };

    if (attachments.length > 0) {
      payload.attachment = attachments;
    }

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      payload,
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log(`✅ Email sent successfully to ${to}`);
    return { success: true, messageId: response.data.messageId };
    
  } catch (error) {
    console.error(`❌ Brevo API error:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ==================== OTP EMAIL ====================
export const sendOTPEmail = async (email, otp, studentName) => {
  try {
    console.log(`📧 Preparing OTP email for ${email} (${studentName})`);
    console.log(`🔑 OTP: ${otp}`);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">🔐 Login Verification</h2>
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your login OTP is:</p>
          
          <div style="background: #f0f0f0; padding: 15px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold; border-radius: 8px;">
            ${otp}
          </div>
          
          <p style="margin-top: 15px;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <hr style="margin: 20px 0;" />
          <p style="font-size: 11px; color: #888;">School Management System</p>
        </div>
      </div>
    `;
    
    const text = `
      School Management System - Login Verification
      
      Dear ${studentName},
      
      Your login OTP is: ${otp}
      
      This OTP is valid for 10 minutes.
      
      If you didn't request this, please ignore this email.
      
      - School Management System
    `;
    
    return await sendBrevoEmail(email, "🔐 Your Login OTP - School Management System", html, text);
    
  } catch (error) {
    console.error(`❌ OTP email error to ${email}:`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== STUDENT ATTENDANCE EMAIL ====================
export const sendAttendanceEmail = async (email, studentName, status, time, date) => {
  try {
    let subject = '';
    let emoji = '';
    let color = '';
    
    if (status === 'absent') {
      subject = `⚠️ Attendance Alert: ${studentName} was ABSENT`;
      emoji = '❌';
      color = '#d32f2f';
    } else if (status === 'late') {
      subject = `⚠️ Attendance Alert: ${studentName} was LATE`;
      emoji = '⏰';
      color = '#ff9800';
    } else if (status === 'fee_paid') {
      subject = `✅ Fee Payment Confirmation: ${studentName}`;
      emoji = '💰';
      color = '#4caf50';
    } else {
      subject = `✅ Attendance: ${studentName} was PRESENT`;
      emoji = '✅';
      color = '#4caf50';
    }
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">🏫 School Management System</h2>
        </div>
        
        <div style="padding: 20px;">
          <div style="text-align: center; font-size: 48px; margin-bottom: 10px;">${emoji}</div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${color}; font-weight: bold;">${status.toUpperCase()}</span></p>
            ${time ? `<p style="margin: 5px 0;"><strong>Check-in Time:</strong> ${time}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
          </div>
          
          <div style="background-color: ${color}10; padding: 12px; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${status === 'absent' ? '📢 Please ensure regular attendance for academic success.' : status === 'late' ? '⏰ School timing is 8:00 AM - 9:00 AM. Please ensure punctuality.' : status === 'fee_paid' ? '💰 Thank you for your timely payment.' : '✓ Thank you for maintaining regular attendance.'}
            </p>
          </div>
        </div>
        
        <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 11px; color: #888; border-radius: 0 0 10px 10px;">
          This is an automated message from School Management System. Please do not reply.
        </div>
      </div>
    `;
    
    const text = `
      School Management System - Attendance Alert
      
      Student: ${studentName}
      Status: ${status.toUpperCase()}
      ${time ? `Time: ${time}` : ''}
      Date: ${date}
      
      ${status === 'absent' ? 'Please ensure regular attendance.' : status === 'late' ? 'School timing: 8:00 AM - 9:00 AM' : status === 'fee_paid' ? 'Thank you for payment!' : 'Thank you!'}
    `;
    
    return await sendBrevoEmail(email, subject, html, text);
    
  } catch (error) {
    console.error(`❌ Student attendance email error:`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== FEE QR CODE EMAIL (WITH ATTACHMENT) ====================
export const sendFeeQREmail = async (email, studentName, rollNo, month, amount, dueDate, qrCodeImage, qrLink) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 25px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏫 School Management System</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Fee Payment QR Code</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 25px;">
            <p style="font-size: 16px; margin-top: 0;">Dear Parent,</p>
            
            <p style="font-size: 14px;">Your child's fee payment QR code is attached with this email. Please save it to your phone.</p>
            
            <!-- Student Details Table -->
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Student Name:</strong></td>
                  <td style="padding: 8px 0;">${studentName}</td>
                </tr>
                <tr style="background-color: #f0f0f0;">
                  <td style="padding: 8px 0;"><strong>Roll Number:</strong></td>
                  <td style="padding: 8px 0;">${rollNo}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Month:</strong></td>
                  <td style="padding: 8px 0;">${month}</td>
                </tr>
                <tr style="background-color: #f0f0f0;">
                  <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; color: #dc3545; font-weight: bold;">PKR ${amount?.toLocaleString() || 0}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
                  <td style="padding: 8px 0; color: #ff9800;">${new Date(dueDate).toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
            
            <!-- Instructions -->
            <div style="background-color: #e3f2fd; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="font-weight: bold; margin: 0 0 10px 0; color: #1e3c72;">📖 How to Use:</p>
              <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #555;">
                <li><strong>Save the attached QR code image</strong> to your phone</li>
                <li>Show this QR code at school fee counter</li>
                <li>Counter person will scan it</li>
                <li>Pay the amount and get receipt</li>
              </ol>
            </div>
            
            <!-- Backup Link (Optional) -->
            <div style="background-color: #f0f0f0; border-radius: 8px; padding: 12px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666;">
                🔗 <strong>Backup Link (if QR not working):</strong><br>
                <a href="${qrLink}" style="color: #1e3c72; word-break: break-all;">${qrLink}</a>
              </p>
            </div>
            
            <!-- Note Box -->
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; font-size: 13px;">
              <p style="margin: 0; color: #856404;">
                <strong>💡 Note:</strong> This QR code is valid for 30 days. 
                If expired, please contact school for new QR.
              </p>
            </div>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            
            <p style="font-size: 12px; color: #888; text-align: center;">
              This is an automated message from School Management System.<br>
              For any queries, please contact school administration.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const text = `
      School Management System - Fee Payment QR Code
      
      Dear Parent,
      
      Student: ${studentName}
      Roll No: ${rollNo}
      Month: ${month}
      Amount: PKR ${amount?.toLocaleString() || 0}
      Due Date: ${new Date(dueDate).toLocaleDateString()}
      
      How to use:
      1. Save the attached QR code image to your phone
      2. Show this QR code at school fee counter
      3. Pay the amount
      
      Backup Link (if QR not working): ${qrLink}
      
      This QR code is valid for 30 days.
      
      Thank you,
      School Management System
    `;
    
    // ✅ ATTACH QR CODE IMAGE
    const attachments = [];
    if (qrCodeImage) {
      let base64Data = qrCodeImage;
      if (base64Data.includes('base64,')) {
        base64Data = base64Data.split('base64,')[1];
      }
      
      attachments.push({
        name: `QR_Code_${studentName.replace(/\s/g, '_')}_${month.replace(/\s/g, '_')}.png`,
        content: base64Data
      });
    }
    
    return await sendBrevoEmail(email, `📱 Fee Payment QR Code - ${month} (${studentName})`, html, text, attachments);
    
  } catch (error) {
    console.error(`❌ Fee QR email error:`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== FEE PAYMENT CONFIRMATION EMAIL ====================
export const sendFeePaymentConfirmation = async (email, studentName, rollNo, month, amountPaid, remainingAmount, isFullyPaid) => {
  try {
    const statusText = isFullyPaid ? 'FULLY PAID' : 'PARTIALLY PAID';
    const statusColor = isFullyPaid ? '#28a745' : '#ff9800';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">💰 Fee Payment Confirmation</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear Parent,</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Student:</strong> ${studentName}</p>
            <p><strong>Roll No:</strong> ${rollNo}</p>
            <p><strong>Month:</strong> ${month}</p>
            <p><strong>Amount Paid:</strong> PKR ${amountPaid?.toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
            ${!isFullyPaid ? `<p><strong>Remaining:</strong> PKR ${remainingAmount?.toLocaleString()}</p>` : ''}
          </div>
          
          ${!isFullyPaid ? `
            <div style="background-color: #fff3cd; padding: 12px; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px;">⚠️ Please clear the remaining amount by due date.</p>
            </div>
          ` : `
            <div style="background-color: #d4edda; padding: 12px; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px;">✅ Thank you for completing your fee payment!</p>
            </div>
          `}
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">School Management System</p>
        </div>
      </div>
    `;
    
    const text = `
      School Management System - Fee Payment Confirmation
      
      Dear Parent,
      
      Student: ${studentName}
      Roll No: ${rollNo}
      Month: ${month}
      Amount Paid: PKR ${amountPaid?.toLocaleString()}
      Status: ${statusText}
      ${!isFullyPaid ? `Remaining: PKR ${remainingAmount?.toLocaleString()}` : ''}
    `;
    
    return await sendBrevoEmail(email, `${isFullyPaid ? '✅' : '💰'} Fee Payment ${isFullyPaid ? 'Confirmation' : 'Update'} - ${studentName}`, html, text);
    
  } catch (error) {
    console.error(`❌ Fee payment confirmation error:`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== LOGIN QR CODE EMAIL ====================
export const sendLoginQREmail = async (email, studentName, qrCodeDataUrl, qrLink) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background-color: #1e3c72; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">🔐 Your Login QR Code</h2>
        </div>
        
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
          <p>Use this QR code to login to your account <strong>without password</strong>.</p>
          
          <div style="background: white; padding: 15px; display: inline-block; margin: 15px 0; border: 1px solid #ddd; border-radius: 10px;">
            <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px;" alt="Login QR Code" />
          </div>
          
          <div style="margin: 20px 0;">
            <a href="${qrLink}" style="background: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
              🔗 Click Here to Login Directly
            </a>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Or copy this link: <span style="color: #1e3c72; word-break: break-all;">${qrLink}</span>
            </p>
          </div>
          
          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">📱 How to use:</p>
            <ol style="margin: 0; padding-left: 20px;">
              <li><strong>Option A (Phone):</strong> Scan QR code with phone camera</li>
              <li><strong>Option B (Computer):</strong> Click the blue button above</li>
              <li>Enter <strong>OTP</strong> sent to your email</li>
              <li>You're logged in! ✅</li>
            </ol>
          </div>
          
          <hr style="margin: 20px 0;" />
          
          <div style="background-color: #fff3e0; padding: 10px; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #e67e22;">
              ⚠️ <strong>Security Note:</strong> This link is for your personal use only. 
              Do not share it with anyone. If you didn't request this, please ignore.
            </p>
          </div>
          
          <p style="font-size: 11px; color: #888; margin-top: 20px;">
            This is an automated message from School Management System.
          </p>
        </div>
      </div>
    `;
    
    const text = `
      School Management System - Your Login QR Code
      
      Dear ${studentName},
      
      Use this QR code to login without password.
      
      DIRECT LOGIN LINK (Click this): ${qrLink}
      
      How to use:
      1. Click the link above OR scan QR code with phone
      2. Enter OTP sent to your email
      3. You're logged in!
      
      Security Note: This link is for your personal use only. Do not share it.
      
      - School Management System
    `;
    
    return await sendBrevoEmail(email, "🔐 Your Login QR Code - School Portal", html, text);
    
  } catch (error) {
    console.error(`❌ Login QR email error:`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== TEACHER ATTENDANCE EMAILS ====================

export const sendTeacherLateEmail = async (email, teacherName, time, date) => {
  console.log(`📧 Sending teacher late email for: ${teacherName}`);
  
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background-color: #e67e22; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">⚠️ Teacher Late Arrival Alert</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear Admin,</p>
          <p>Teacher <strong>${teacherName}</strong> arrived late today.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Check-in Time:</strong> ${time}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Expected Time:</strong> 7:00 AM - 8:00 AM</p>
          </div>
          
          <p>Please take necessary action.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">School Management System</p>
        </div>
      </div>
    `;
    
    const text = `Teacher Late Alert: ${teacherName} arrived late at ${time} on ${date}`;
    const targetEmail = process.env.ADMIN_EMAIL || email;
    
    return await sendBrevoEmail(targetEmail, `⚠️ Teacher Late: ${teacherName}`, html, text);
    
  } catch (error) {
    console.error(`❌ Teacher late email error:`, error.message);
    return { success: false, error: error.message };
  }
};

export const sendTeacherAbsentEmail = async (email, teacherName, date) => {
  console.log(`📧 Sending teacher absent email for: ${teacherName}`);
  
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="background-color: #e74c3c; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">❌ Teacher Absent Alert</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear Admin,</p>
          <p>Teacher <strong>${teacherName}</strong> was absent today.</p>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>No check-in recorded</strong></p>
          </div>
          
          <p>Please follow up with the teacher.</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">School Management System</p>
        </div>
      </div>
    `;
    
    const text = `Teacher Absent Alert: ${teacherName} was absent on ${date}`;
    const targetEmail = process.env.ADMIN_EMAIL || email;
    
    return await sendBrevoEmail(targetEmail, `❌ Teacher Absent: ${teacherName}`, html, text);
    
  } catch (error) {
    console.error(`❌ Teacher absent email error:`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== EXPORTS ====================
export { 
  sendAttendanceEmail, 
  sendLoginQREmail, 
  sendOTPEmail,
  sendTeacherLateEmail,
  sendTeacherAbsentEmail,
  sendFeeQREmail,
  sendFeePaymentConfirmation
};