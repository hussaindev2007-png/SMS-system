// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { userId } = await req.json();

//     if (!userId) {
//       return NextResponse.json({ message: "User ID missing" }, { status: 400 });
//     }

//     // Exact "inactive" string update karein jo schema enum mein hai
//     const result = await User.findByIdAndUpdate(
//       userId,
//       { $set: { status: "inactive" } }, 
//       { new: true, runValidators: true } // runValidators enum check ko follow karega
//     );

//     if (!result) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Logged out", status: result.status }, { status: 200 });
//   } catch (error) {
//     console.error("Logout Error:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }


// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { userId } = await req.json();

//     if (!userId) {
//       return NextResponse.json({ message: "Identity ID required for termination" }, { status: 400 });
//     }

//     // 1. Search in User Model (Students/Teachers)
//     let account = await User.findById(userId);
    
//     if (account) {
//       // Status ko 'active' hi rakhna hai (taake login block na ho)
//       // Sirf isOnline ko false karna hai
//       account.isOnline = false; 
//       await account.save();
      
//       return NextResponse.json({ 
//         message: "Session Terminated: User Offline", 
//         role: account.role 
//       }, { status: 200 });
//     }

//     // 2. Search in Admin Model
//     account = await Admin.findById(userId);

//     if (account) {
//       // Admin ko bhi offline mark karenge
//       account.isOnline = false;
//       await account.save();
      
//       return NextResponse.json({ 
//         message: "Session Terminated: Admin Offline", 
//         role: "admin" 
//       }, { status: 200 });
//     }

//     // 3. Not Found
//     return NextResponse.json({ message: "Entity not found in secure records" }, { status: 404 });

//   } catch (error) {
//     console.error("Logout Protocol Error:", error);
//     return NextResponse.json({ message: "Internal System Failure during logout" }, { status: 500 });
//   }
// }




// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import Admin from "@/models/Admin";
// import Teacher from "@/models/Teacher"; // ✅ Teacher model lazmi import karein
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const { userId } = await req.json();

//     if (!userId) {
//       return NextResponse.json({ message: "ID required" }, { status: 400 });
//     }

//     // 1. Search in Admin Model
//     let account = await Admin.findById(userId);
//     if (account) {
//       account.isOnline = false;
//       await account.save();
//       return NextResponse.json({ message: "Admin Offline" }, { status: 200 });
//     }

//     // 2. Search in Teacher Model (Yeh missing tha!)
//     account = await Teacher.findById(userId);
//     if (account) {
//       account.isOnline = false;
//       account.lastSeen = new Date(); // Last seen bhi update kar dein
//       await account.save();
//       return NextResponse.json({ message: "Teacher Offline" }, { status: 200 });
//     }

//     // 3. Search in User Model (Students etc)
//     account = await User.findById(userId);
//     if (account) {
//       account.isOnline = false;
//       await account.save();
//       return NextResponse.json({ message: "User Offline" }, { status: 200 });
//     }

//     return NextResponse.json({ message: "Entity not found" }, { status: 404 });

//   } catch (error) {
//     console.error("Logout Error:", error);
//     return NextResponse.json({ message: "Server Failure" }, { status: 500 });
//   }
// }






import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import Teacher from "@/models/Teacher";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, role } = await req.json(); // Hum role bhi le rahe hain taake query fast ho

    if (!userId) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    let Model;
    
    // 1. Role ke mutabiq Model select karein (Fastest Way)
    if (role === "admin") Model = Admin;
    else if (role === "teacher") Model = Teacher;
    else if (role === "student") Model = User;

    // 2. Agar role nahi mila toh teeno mein bari bari check karein
    if (Model) {
      const updatedAccount = await Model.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date() // Manual logout ka time record karein
      });

      if (updatedAccount) {
        return NextResponse.json({ success: true, message: `${role} Offline` });
      }
    } else {
      // Fallback: Agar frontend se role nahi aaya toh manual search karein
      const providers = [Admin, Teacher, User];
      for (let TargetModel of providers) {
        const account = await TargetModel.findById(userId);
        if (account) {
          account.isOnline = false;
          account.lastSeen = new Date();
          await account.save();
          return NextResponse.json({ success: true, message: "Offline successful" });
        }
      }
    }

    return NextResponse.json({ message: "Entity not found" }, { status: 404 });

  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ message: "Server Failure" }, { status: 500 });
  }
}