// import dbConnect from "@/lib/mongodb";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function PATCH(req) {
//   await dbConnect();
//   try {
//     const { userId, status } = await req.json(); // status: true or false

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { 
//         isOnline: status, 
//         lastSeen: new Date() 
//       },
//       { new: true }
//     );

//     return NextResponse.json({ success: true, isOnline: updatedUser.isOnline });
//   } catch (error) {
//     return NextResponse.json({ message: "Status update failed" }, { status: 500 });
//   }

// }






import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  await dbConnect();
  try {
    const { userId, status } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        isOnline: status, 
        lastSeen: new Date() 
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User node not found in network" }, { status: 404 });
    }

    // ========================================================================
    // 🔥 REAL-TIME AI SESSION TRACKING & ANALYTICS INTERACTION
    // ========================================================================
    
    let activityInsight = "User session altered tracking state successfully.";
    let operationalRiskFlag = false;

    if (status === true) {
      activityInsight = `${updatedUser.role.toUpperCase()} initialized live portal access loop. Synchronization pathways stable.`;
    } else {
      // Offline transition analyzer simulation
      activityInsight = `${updatedUser.role.toUpperCase()} terminated active interface session. Last seen sequence logged.`;
      
      // Verification rules integration: Agar teacher abruptly offline jaye to monitoring warning
      if (updatedUser.role === "teacher") {
        operationalRiskFlag = true;
      }
    }

    return NextResponse.json({ 
      success: true, 
      isOnline: updatedUser.isOnline,
      aiSessionUpdate: {
        nodeId: updatedUser._id,
        role: updatedUser.role,
        statusLogged: status ? "ACTIVE_STREAM" : "OFFLINE_DORMANT",
        activityInsight,
        requiresRosterSync: operationalRiskFlag
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      message: "Status update failed", 
      error: error.message 
    }, { status: 500 });
  }
}