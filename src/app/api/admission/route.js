// import dbConnect from "@/lib/mongodb";
// import Admission from "@/models/Admission.js"; // User ki jagah Admission model
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { name, email, password, phone, className, section } = body;

//     // 1. Check karein ke is email se pehle hi admission request toh nahi aayi
//     const existingRequest = await Admission.findOne({ email });
//     if (existingRequest) {
//       return NextResponse.json({ message: "Admission request already pending with this email!" }, { status: 400 });
//     }

//     // 2. Password ko hash karein
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 3. Data ko Admission (Pending) model mein save karein
//     // Yahan hum rollNo nahi dal rahe kyunke wo Admin dega
//     const newAdmissionRequest = await Admission.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       className,
//       section: section || "A",
//       status: "pending", // Direct "pending" status
//     });

//     return NextResponse.json({ 
//       message: "Admission request submitted! Please wait for Admin to approve and assign a Roll Number.",
//       requestId: newAdmissionRequest._id 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Admission Error:", error);
//     return NextResponse.json({ message: "Server error during admission" }, { status: 500 });
//   }
// }




// validation error











// import dbConnect from "@/lib/mongodb";
// import Admission from "@/models/Admission.js";
// import User from "@/models/User.js"; // User model ko import kiya
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { name, email, password, phone, className, section } = body;

//     // 1. Check in Admission Collection
//     const existingAdmission = await Admission.findOne({
//       $or: [{ email }, { phone }]
//     });

//     // 2. Check in User Collection (Jo log pehle se register hain)
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phone }]
//     });

//     // Validation Logic
//     if (existingAdmission || existingUser) {
//       const entry = existingAdmission || existingUser;
      
//       if (entry.email === email) {
//         return NextResponse.json({ message: "This email is already registered in our system!" }, { status: 400 });
//       }
//       if (entry.phone === phone) {
//         return NextResponse.json({ message: "This Phone No is already in use!" }, { status: 400 });
//       }
//     }

//     // 3. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Create Admission Request
//     const newAdmissionRequest = await Admission.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       className,
//       section: section || "A",
//       status: "pending",
//     });

//     return NextResponse.json({ 
//       message: "Admission request submitted! Pending Admin approval.",
//       requestId: newAdmissionRequest._id 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Admission Error:", error);
//     return NextResponse.json({ message: "Server error during admission" }, { status: 500 });
//   }
// }







// class






// import dbConnect from "@/lib/mongodb";
// import Admission from "@/models/Admission.js";
// import User from "@/models/User.js";
// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { name, email, password, phone, className, section } = body;

//     // 1. Basic Validation (Backend safety net)
//     if (!name || !email || !password || !phone || !className) {
//       return NextResponse.json({ message: "All mandatory fields must be filled!" }, { status: 400 });
//     }

//     // 2. Data Cleaning: Class name se "th", "st", "nd" hatana
//     // Agar user "10th" likhega, to hum sirf "10" save karenge
//     const cleanClassName = className.toString().toLowerCase().replace(/(st|nd|rd|th)/g, "").trim();

//     // 3. Parallel Check: Check in both Admission and User collection simultaneously
//     const [existingAdmission, existingUser] = await Promise.all([
//       Admission.findOne({ $or: [{ email }, { phone }] }),
//       User.findOne({ $or: [{ email }, { phone }] })
//     ]);

//     if (existingAdmission || existingUser) {
//       const entry = existingAdmission || existingUser;
//       if (entry.email === email) {
//         return NextResponse.json({ message: "This email is already registered!" }, { status: 400 });
//       }
//       if (entry.phone === phone) {
//         return NextResponse.json({ message: "This Phone Number is already in use!" }, { status: 400 });
//       }
//     }

//     // 4. Password Hashing
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 5. Create Admission Request with Normalized Data
//     const newAdmissionRequest = await Admission.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       className: cleanClassName, // Saved as "10" instead of "10th"
//       section: section ? section.toUpperCase() : "A", // Hamesha Capital "A"
//       status: "pending",
//     });

//     return NextResponse.json({ 
//       message: "Admission request submitted! Waiting for Admin approval.",
//       requestId: newAdmissionRequest._id 
//     }, { status: 201 });

//   } catch (error) {
//     console.error("Admission Error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }




import dbConnect from "@/lib/mongodb";
import Admission from "@/models/Admission.js";
import User from "@/models/User.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Max file size: 4MB
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();
    
    // Extract form fields
    const name = formData.get("name");
    const fatherName = formData.get("fatherName");
    const motherName = formData.get("motherName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const cnic = formData.get("cnic");
    const address = formData.get("address");
    const city = formData.get("city");
    const className = formData.get("className");
    const targetCourse = formData.get("targetCourse");
    const photoFile = formData.get("photo");

    // 1. Basic Validation
    if (!name || !fatherName || !email || !className || !targetCourse) {
      return NextResponse.json({ message: "All mandatory fields must be filled!" }, { status: 400 });
    }

    // 2. Validate Photo Size (if provided)
    if (photoFile && photoFile.size > 0) {
      if (photoFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ 
          message: `Photo size should be less than 4MB. Current size: ${(photoFile.size / (1024 * 1024)).toFixed(2)}MB` 
        }, { status: 400 });
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(photoFile.type)) {
        return NextResponse.json({ 
          message: "Only JPEG, PNG, WEBP, and GIF images are allowed" 
        }, { status: 400 });
      }
    }

    // 3. Data Cleaning
    const cleanClassName = className.toString().trim();

    // 4. Check for duplicates
    const [existingAdmission, existingUser] = await Promise.all([
      Admission.findOne({ $or: [{ email }, { phone }] }),
      User.findOne({ $or: [{ email }, { phone }] })
    ]);

    if (existingAdmission || existingUser) {
      const entry = existingAdmission || existingUser;
      if (entry.email === email) {
        return NextResponse.json({ message: "This email is already registered!" }, { status: 400 });
      }
      if (entry.phone === phone) {
        return NextResponse.json({ message: "This Phone Number is already in use!" }, { status: 400 });
      }
    }

    // 5. Upload Photo to Cloudinary (if provided)
    let photoUrl = null;
    let photoPublicId = null;
    
    if (photoFile && photoFile.size > 0) {
      try {
        const bytes = await photoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              folder: "admission_photos",
              width: 500,
              height: 500,
              crop: "fill",
              quality: "auto:good"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        
        photoUrl = uploadResponse.secure_url;
        photoPublicId = uploadResponse.public_id;
      } catch (uploadError) {
        console.error("Photo upload error:", uploadError);
        // Continue without photo
      }
    }

    // 6. Create Admission Request
    const newAdmissionRequest = await Admission.create({
      name,
      fatherName,
      motherName: motherName || "",
      email,
      phone: phone || "",
      cnic: cnic || "",
      address: address || "",
      city: city || "",
      className: cleanClassName,
      targetCourse: targetCourse,
      photoUrl,
      photoPublicId,
      status: "pending",
    });

    return NextResponse.json({ 
      message: "Admission request submitted! Waiting for Admin approval.",
      requestId: newAdmissionRequest._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Admission Error:", error);
    return NextResponse.json({ message: "Internal Server Error: " + error.message }, { status: 500 });
  }
}