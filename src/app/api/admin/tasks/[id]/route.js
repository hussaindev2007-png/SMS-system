// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb"; 
// import Task from "@/models/Task"; 

// export async function DELETE(request, { params }) {
//   try {
//     await dbConnect();

//     // Next.js 15+ mein params ko await karna zaroori hai
//     const resolvedParams = await params; 
//     const id = resolvedParams.id;

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "ID parameter missing" },
//         { status: 400 }
//       );
//     }

//     // Task ko delete karna
//     const deletedTask = await Task.findByIdAndDelete(id);

//     if (!deletedTask) {
//       return NextResponse.json(
//         { success: false, message: "Task nahi mila" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, message: "Task successfully delete ho gaya bahi!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Delete Error:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }







































// AI


import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import Task from "@/models/Task"; 

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const resolvedParams = await params; 
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID parameter missing" },
        { status: 400 }
      );
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json(
        { success: false, message: "Task nahi mila" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task successfully delete ho gaya bahi!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}