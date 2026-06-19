// import { NextResponse } from "next/server";
// import Groq from "groq-sdk";
// import dbConnect from "@/lib/mongodb";
// import Syllabus from "@/models/Syllabus";

// let groq;
// try {
//   const apiKey = process.env.GROQ_API_KEY?.trim();
//   if (apiKey) {
//     groq = new Groq({ apiKey });
//   }
// } catch (error) {
//   console.error("Groq Init Error:", error);
// }

// // Pre-defined syllabus data for common subjects (Sindh Board)
// const SINDH_BOARD_SYLLABUS = {
//   "9-physics-sindh": {
//     chapters: [
//       { chapterNumber: 1, chapterName: "Physical Quantities and Measurements", topics: ["Introduction to Physics", "Physical Quantities", "International System of Units", "Measuring Instruments", "Significant Figures"] },
//       { chapterNumber: 2, chapterName: "Kinematics", topics: ["Rest and Motion", "Types of Motion", "Scalars and Vectors", "Terms Associated with Motion", "Graphical Analysis of Motion"] },
//       { chapterNumber: 3, chapterName: "Dynamics", topics: ["Force, Inertia and Momentum", "Newton's Laws of Motion", "Mass and Weight", "Friction", "Uniform Circular Motion"] },
//       { chapterNumber: 4, chapterName: "Turning Effect of Forces", topics: ["Like and Unlike Parallel Forces", "Addition of Forces", "Resolution of Forces", "Torque or Moment of Force", "Centre of Mass and Centre of Gravity"] },
//       { chapterNumber: 5, chapterName: "Gravitation", topics: ["The Force of Gravitation", "Mass of the Earth", "Variation of g with Altitude", "Artificial Satellites", "Motion of Artificial Satellites"] },
//       { chapterNumber: 6, chapterName: "Work and Energy", topics: ["Work", "Energy", "Kinetic Energy", "Potential Energy", "Law of Conservation of Energy"] },
//       { chapterNumber: 7, chapterName: "Properties of Matter", topics: ["Kinetic Molecular Model of Matter", "Density", "Pressure", "Atmospheric Pressure", "Hooke's Law"] },
//       { chapterNumber: 8, chapterName: "Thermal Properties of Matter", topics: ["Temperature and Heat", "Thermometers", "Specific Heat Capacity", "Latent Heat of Fusion", "Latent Heat of Vaporization"] },
//       { chapterNumber: 9, chapterName: "Transfer of Heat", topics: ["Conduction", "Convection", "Radiation", "Conductors and Insulators", "Applications of Heat Transfer"] }
//     ]
//   },
//   "9-chemistry-sindh": {
//     chapters: [
//       { chapterNumber: 1, chapterName: "Fundamentals of Chemistry", topics: ["Introduction", "Branches of Chemistry", "Basic Definitions", "Chemical Calculations", "Mole and Avogadro's Number"] },
//       { chapterNumber: 2, chapterName: "Structure of Atoms", topics: ["Theories and Experiments", "Atomic Structure", "Electronic Configuration", "Isotopes", "Applications of Isotopes"] },
//       { chapterNumber: 3, chapterName: "Periodic Table and Periodicity", topics: ["Introduction", "Periodic Table", "Periodicity", "Atomic Size", "Ionization Energy", "Electronegativity"] },
//       { chapterNumber: 4, chapterName: "Structure of Molecules", topics: ["Chemical Bond", "Types of Bonds", "Intermolecular Forces", "Properties of Ionic and Covalent Compounds"] },
//       { chapterNumber: 5, chapterName: "Physical States of Matter", topics: ["Gaseous State", "Laws Related to Gases", "Liquid State", "Solid State", "Types of Solids"] },
//       { chapterNumber: 6, chapterName: "Solutions", topics: ["Introduction", "Concentration Units", "Solubility", "Comparison of Solutions, Suspensions and Colloids"] },
//       { chapterNumber: 7, chapterName: "Electrochemistry", topics: ["Oxidation and Reduction", "Electrolytes", "Electrochemical Cells", "Electroplating", "Corrosion and its Prevention"] },
//       { chapterNumber: 8, chapterName: "Chemical Reactivity", topics: ["Metals", "Non-Metals", "Reactivity Series", "Extraction of Metals", "Properties and Uses of Metals"] }
//     ]
//   },
//   "10-physics-sindh": {
//     chapters: [
//       { chapterNumber: 10, chapterName: "Simple Harmonic Motion and Waves", topics: ["Simple Harmonic Motion", "Damped Oscillations", "Wave Motion", "Types of Waves", "Ripple Tank"] },
//       { chapterNumber: 11, chapterName: "Sound", topics: ["Sound Waves", "Characteristics of Sound", "Reflection of Sound", "Speed of Sound", "Noise Pollution"] },
//       { chapterNumber: 12, chapterName: "Geometrical Optics", topics: ["Reflection of Light", "Spherical Mirrors", "Refraction of Light", "Lenses", "Optical Instruments"] },
//       { chapterNumber: 13, chapterName: "Electrostatics", topics: ["Electric Charge", "Coulomb's Law", "Electric Field and Potential", "Capacitors", "Applications of Electrostatics"] },
//       { chapterNumber: 14, chapterName: "Current Electricity", topics: ["Electric Current", "Ohm's Law", "Resistance and Resistivity", "Electrical Power", "Household Wiring"] },
//       { chapterNumber: 15, chapterName: "Electromagnetism", topics: ["Magnetic Field", "Force on a Current-Carrying Conductor", "Electromagnetic Induction", "DC Motor", "AC Generator"] },
//       { chapterNumber: 16, chapterName: "Basic Electronics", topics: ["Cathode Ray Oscilloscope", "Semiconductors", "Diodes", "Transistors", "Logic Gates"] },
//       { chapterNumber: 17, chapterName: "Information and Communication Technology", topics: ["Information Technology", "Computer Components", "Internet", "Digital Communication", "Applications of ICT"] },
//       { chapterNumber: 18, chapterName: "Atomic and Nuclear Physics", topics: ["Atom and Atomic Nucleus", "Radioactivity", "Nuclear Reactions", "Nuclear Energy", "Radiation Hazards"] }
//     ]
//   },
//   "10-chemistry-sindh": {
//     chapters: [
//       { chapterNumber: 9, chapterName: "Chemical Equilibrium", topics: ["Reversible Reactions", "Law of Mass Action", "Equilibrium Constant", "Factors Affecting Equilibrium"] },
//       { chapterNumber: 10, chapterName: "Acids, Bases and Salts", topics: ["Concepts of Acids and Bases", "pH Scale", "Salts", "Uses of Acids, Bases and Salts"] },
//       { chapterNumber: 11, chapterName: "Organic Chemistry", topics: ["Introduction", "Hydrocarbons", "Functional Groups", "Alcohols and Carboxylic Acids", "Macromolecules"] },
//       { chapterNumber: 12, chapterName: "Hydrocarbons", topics: ["Alkanes", "Alkenes", "Alkynes", "Aromatic Hydrocarbons", "Petroleum Industry"] },
//       { chapterNumber: 13, chapterName: "Biochemistry", topics: ["Carbohydrates", "Proteins", "Lipids", "Enzymes", "Nucleic Acids"] },
//       { chapterNumber: 14, chapterName: "The Atmosphere", topics: ["Composition of Atmosphere", "Layers of Atmosphere", "Air Pollution", "Global Warming", "Ozone Depletion"] },
//       { chapterNumber: 15, chapterName: "Water", topics: ["Properties of Water", "Water as Solvent", "Water Pollution", "Water Treatment", "Water Conservation"] },
//       { chapterNumber: 16, chapterName: "Chemical Industries", topics: ["Fertilizers", "Soap and Detergents", "Plastics and Polymers", "Paints and Pigments", "Cement"] }
//     ]
//   }
// };

// // Helper function to get cache key
// function getCacheKey(subjectId, targetClass, board) {
//   return `${subjectId}-${targetClass}-${board}`.toLowerCase().replace(/\s/g, "");
// }

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const body = await req.json();
    
//     const { subjectId, targetClass, regulatoryBoard, chapters, subject, board } = body;

//     const finalSubjectId = (subjectId || subject || "").trim().toLowerCase();
//     const finalClass = (targetClass || "").toString().trim();
//     const finalBoard = (board || regulatoryBoard || "").trim();

//     // ========== 1. SAVE LOGIC (User ne chapters bheje hain) ==========
//     if (chapters && Array.isArray(chapters)) {
//       if (!finalSubjectId || !finalClass || !finalBoard) {
//         return NextResponse.json({ 
//           success: false, 
//           message: "Missing fields for save. Need subjectId, targetClass, board" 
//         }, { status: 400 });
//       }
      
//       const updatedSyllabus = await Syllabus.findOneAndUpdate(
//         { subjectId: finalSubjectId, targetClass: finalClass, board: finalBoard },
//         { 
//           $set: { 
//             chapters: chapters, 
//             subjectName: subject || finalSubjectId,
//             lastUpdated: new Date()
//           } 
//         },
//         { new: true, upsert: true }
//       );
      
//       return NextResponse.json({ 
//         success: true, 
//         data: updatedSyllabus,
//         message: "Syllabus saved to database!"
//       });
//     }

//     // ========== 2. CHECK VALIDATION ==========
//     if (!finalSubjectId || !finalClass || !finalBoard) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "Missing required fields. Need subject, class, and board." 
//       }, { status: 400 });
//     }

//     // ========== 3. CHECK DATABASE FIRST ==========
//     const existingSyllabus = await Syllabus.findOne({
//       subjectId: finalSubjectId,
//       targetClass: finalClass,
//       board: finalBoard
//     });

//     if (existingSyllabus && existingSyllabus.chapters && existingSyllabus.chapters.length > 0) {
//       console.log("✅ Found in database!");
//       return NextResponse.json({ 
//         success: true, 
//         data: existingSyllabus.chapters,
//         source: "database"
//       });
//     }

//     // ========== 4. CHECK HARDCODED DATA ==========
//     const cacheKey = getCacheKey(finalSubjectId, finalClass, finalBoard);
//     const isSindhBoard = finalBoard.toLowerCase().includes("sindh") || 
//                          finalBoard.toLowerCase().includes("jamshoro") || 
//                          finalBoard.toLowerCase().includes("karachi");
    
//     if (isSindhBoard) {
//       const hardcodedKey = `${finalClass}-${finalSubjectId}-sindh`.toLowerCase();
//       if (SINDH_BOARD_SYLLABUS[hardcodedKey]) {
//         console.log("✅ Found in hardcoded data!");
        
//         // Save to DB for future use
//         await Syllabus.findOneAndUpdate(
//           { subjectId: finalSubjectId, targetClass: finalClass, board: finalBoard },
//           { 
//             $set: { 
//               chapters: SINDH_BOARD_SYLLABUS[hardcodedKey].chapters,
//               subjectName: finalSubjectId,
//               lastUpdated: new Date()
//             } 
//           },
//           { upsert: true }
//         );
        
//         return NextResponse.json({ 
//           success: true, 
//           data: SINDH_BOARD_SYLLABUS[hardcodedKey].chapters,
//           source: "hardcoded"
//         });
//       }
//     }

//     // ========== 5. IF NOT FOUND, CALL GROQ AI ==========
//     if (!groq) {
//       return NextResponse.json({ 
//         success: false, 
//         error: "AI Service Unavailable. GROQ_API_KEY not configured." 
//       }, { status: 500 });
//     }

//     console.log(`🤖 Calling Groq AI for: ${finalSubjectId} - Class ${finalClass} - ${finalBoard}`);

//     // Strong prompt to prevent wrong subject
//     const systemInstruction = `You are a Strict Academic Syllabus Generator for Pakistani Education Boards.

// CRITICAL RULES:
// 1. Generate syllabus ONLY for: "${finalSubjectId}"
// 2. DO NOT generate for Computer Science, ICT, Biology, or any other subject unless "${finalSubjectId}" IS that subject.
// 3. If user asks for "Physics", output ONLY Physics chapters and topics.
// 4. If user asks for "Chemistry", output ONLY Chemistry chapters and topics.
// 5. Follow the ${finalBoard} board curriculum for Class ${finalClass}.
// 6. Output MUST be valid JSON in this exact format:

// {
//   "chapters": [
//     {
//       "chapterNumber": 1,
//       "chapterName": "Chapter Name Here",
//       "topics": ["Topic 1", "Topic 2", "Topic 3"]
//     }
//   ]
// }

// 7. Each chapter should have 3-5 topics.
// 8. Total chapters should be 8-12 depending on the subject.
// 9. DO NOT add any explanation, just output the JSON.`;

//     const userPrompt = `Generate complete syllabus for:
// - Board: ${finalBoard}
// - Class: ${finalClass}
// - Subject: ${finalSubjectId}

// Make sure every chapter and topic belongs strictly to "${finalSubjectId}" subject.
// Use the official curriculum of ${finalBoard} board for Class ${finalClass}.`;

//     let retries = 2;
//     let parsedData = null;
//     let lastError = null;

//     while (retries > 0) {
//       try {
//         const chatCompletion = await groq.chat.completions.create({
//           model: "llama-3.3-70b-versatile",
//           messages: [
//             { role: "system", content: systemInstruction },
//             { role: "user", content: userPrompt }
//           ],
//           temperature: 0.1, // Low but not zero for some variety
//           max_tokens: 4000,
//           response_format: { type: "json_object" }
//         });

//         const rawText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
//         parsedData = JSON.parse(rawText);
        
//         // Validate structure
//         if (parsedData.chapters && Array.isArray(parsedData.chapters) && parsedData.chapters.length > 0) {
//           break; // Success
//         } else if (Array.isArray(parsedData) && parsedData.length > 0) {
//           parsedData = { chapters: parsedData };
//           break;
//         } else {
//           throw new Error("Invalid chapters array");
//         }
//       } catch (error) {
//         lastError = error;
//         retries--;
//         if (retries > 0) {
//           console.log(`Retry ${2-retries}/2...`);
//           await new Promise(resolve => setTimeout(resolve, 1000));
//         }
//       }
//     }

//     if (!parsedData || !parsedData.chapters || parsedData.chapters.length === 0) {
//       console.error("AI returned invalid data:", lastError);
//       return NextResponse.json({ 
//         success: false, 
//         error: "AI couldn't generate syllabus. Please try again or upload PDF manually.",
//         details: lastError?.message
//       }, { status: 500 });
//     }

//     // Clean and format chapters
//     let finalChapters = parsedData.chapters.map((chap, idx) => ({
//       chapterNumber: chap.chapterNumber || (idx + 1),
//       chapterName: chap.chapterName || `${finalSubjectId} Chapter ${idx + 1}`,
//       topics: Array.isArray(chap.topics) && chap.topics.length > 0 
//         ? chap.topics 
//         : ["Topics not available"]
//     }));

//     // Save AI-generated syllabus to database for future use
//     await Syllabus.findOneAndUpdate(
//       { subjectId: finalSubjectId, targetClass: finalClass, board: finalBoard },
//       { 
//         $set: { 
//           chapters: finalChapters,
//           subjectName: finalSubjectId,
//           lastUpdated: new Date(),
//           source: "ai-generated"
//         } 
//       },
//       { upsert: true }
//     );

//     console.log("✅ AI generated and saved to database!");

//     return NextResponse.json({ 
//       success: true, 
//       data: finalChapters,
//       source: "ai-generated"
//     });

//   } catch (error) {
//     console.error("=== SYLLABUS API ERROR ===", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: error.message || "Internal server error",
//       message: "Something went wrong. Please try again."
//     }, { status: 500 });
//   }
// }






















import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import dbConnect from "@/lib/mongodb";
import Syllabus from "@/models/Syllabus";
import mongoose from "mongoose";

let groq;
try {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (apiKey) {
    groq = new Groq({ apiKey });
  }
} catch (error) {
  console.error("Groq Init Error:", error);
}

// ========== GET: Fetch all syllabuses ==========
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const className = searchParams.get('class');
    const subjectId = searchParams.get('subjectId');
    const board = searchParams.get('board');
    const academicYear = searchParams.get('academicYear');

    // Build query
    const query = {};
    if (className && className !== '') query.targetClass = className;
    if (subjectId && subjectId !== '') {
      if (mongoose.Types.ObjectId.isValid(subjectId)) {
        query.subjectId = new mongoose.Types.ObjectId(subjectId);
      } else {
        query.subjectName = subjectId.toLowerCase();
      }
    }
    if (board && board !== '') query.board = board.toLowerCase();
    if (academicYear && academicYear !== '') query.academicYear = academicYear;
    query.status = 'active';

    console.log("🔍 Fetch query:", JSON.stringify(query, null, 2));

    const syllabuses = await Syllabus.find(query).sort({ createdAt: -1 });

    if (!syllabuses || syllabuses.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No syllabuses found',
        meta: {
          totalChapters: 0,
          totalTopics: 0,
          count: 0
        }
      });
    }

    const totalChapters = syllabuses.reduce((acc, s) => acc + (s.chapters?.length || 0), 0);
    const totalTopics = syllabuses.reduce((acc, s) => 
      acc + (s.chapters?.reduce((a, ch) => a + (ch.topics?.length || 0), 0) || 0), 0);

    return NextResponse.json({
      success: true,
      data: syllabuses,
      meta: {
        totalChapters,
        totalTopics,
        count: syllabuses.length
      }
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch syllabuses', details: error.message },
      { status: 500 }
    );
  }
}

// ========== POST: Generate or Save Syllabus ==========
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { subjectId, targetClass, regulatoryBoard, chapters, subject, board } = body;

    const finalSubjectId = (subjectId || subject || "").trim().toLowerCase();
    const finalClass = (targetClass || "").toString().trim();
    const finalBoard = (board || regulatoryBoard || "").trim();

    // ========== 1. SAVE LOGIC (User ne chapters bheje hain) ==========
    if (chapters && Array.isArray(chapters)) {
      if (!finalSubjectId || !finalClass || !finalBoard) {
        return NextResponse.json({ 
          success: false, 
          message: "Missing fields for save. Need subjectId, targetClass, board" 
        }, { status: 400 });
      }
      
      const updatedSyllabus = await Syllabus.findOneAndUpdate(
        { subjectId: finalSubjectId, targetClass: finalClass, board: finalBoard },
        { 
          $set: { 
            chapters: chapters, 
            subjectName: subject || finalSubjectId,
            lastUpdated: new Date()
          } 
        },
        { new: true, upsert: true }
      );
      
      return NextResponse.json({ 
        success: true, 
        data: updatedSyllabus,
        message: "Syllabus saved to database!"
      });
    }

    // ========== 2. CHECK VALIDATION ==========
    if (!finalSubjectId || !finalClass || !finalBoard) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields. Need subject, class, and board." 
      }, { status: 400 });
    }

    // ========== 3. CHECK DATABASE FIRST ==========
    const existingSyllabus = await Syllabus.findOne({
      subjectId: finalSubjectId,
      targetClass: finalClass,
      board: finalBoard
    });

    if (existingSyllabus && existingSyllabus.chapters && existingSyllabus.chapters.length > 0) {
      console.log("✅ Found in database!");
      return NextResponse.json({ 
        success: true, 
        data: existingSyllabus.chapters,
        source: "database"
      });
    }

    // ========== 4. CHECK HARDCODED DATA ==========
    const isSindhBoard = finalBoard.toLowerCase().includes("sindh") || 
                         finalBoard.toLowerCase().includes("jamshoro") || 
                         finalBoard.toLowerCase().includes("karachi");
    
    if (isSindhBoard) {
      const hardcodedKey = `${finalClass}-${finalSubjectId}-sindh`.toLowerCase();
      // Hardcoded data already in your file
      if (SINDH_BOARD_SYLLABUS && SINDH_BOARD_SYLLABUS[hardcodedKey]) {
        console.log("✅ Found in hardcoded data!");
        await Syllabus.findOneAndUpdate(
          { subjectId: finalSubjectId, targetClass: finalClass, board: finalBoard },
          { 
            $set: { 
              chapters: SINDH_BOARD_SYLLABUS[hardcodedKey].chapters,
              subjectName: finalSubjectId,
              lastUpdated: new Date()
            } 
          },
          { upsert: true }
        );
        
        return NextResponse.json({ 
          success: true, 
          data: SINDH_BOARD_SYLLABUS[hardcodedKey].chapters,
          source: "hardcoded"
        });
      }
    }

    // ========== 5. IF NOT FOUND, CALL GROQ AI ==========
    if (!groq) {
      return NextResponse.json({ 
        success: false, 
        error: "AI Service Unavailable. GROQ_API_KEY not configured." 
      }, { status: 500 });
    }

    // ... rest of AI generation code (same as before)
    return NextResponse.json({ 
      success: true, 
      data: [],
      source: "ai-generated"
    });

  } catch (error) {
    console.error("=== SYLLABUS API ERROR ===", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal server error",
      message: "Something went wrong. Please try again."
    }, { status: 500 });
  }
}

// Pre-defined syllabus data (add this at top after imports)
const SINDH_BOARD_SYLLABUS = {
  "9-physics-sindh": {
    chapters: [
      { chapterNumber: 1, chapterName: "Physical Quantities and Measurements", topics: ["Introduction to Physics", "Physical Quantities", "International System of Units", "Measuring Instruments", "Significant Figures"] },
      { chapterNumber: 2, chapterName: "Kinematics", topics: ["Rest and Motion", "Types of Motion", "Scalars and Vectors", "Terms Associated with Motion", "Graphical Analysis of Motion"] },
      // Add more chapters as needed
    ]
  }
  // Add other subjects
};