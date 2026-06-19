// import { NextResponse } from 'next/server';
// import Groq from 'groq-sdk';
// import mongoose from 'mongoose';
// import crypto from 'crypto';

// // PDF.js - Bina worker setup ke
// import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Syllabus Schema
// const SyllabusSchema = new mongoose.Schema({
//   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
//   subjectName: { type: String, required: true },
//   targetClass: { type: String, required: true },
//   board: { type: String, required: true },
//   chapters: [
//     {
//       chapterNumber: { type: Number },
//       chapterName: { type: String, required: true },
//       topics: [{ type: String }]
//     }
//   ],
//   pdfOriginalName: { type: String },
//   pdfHash: { type: String, unique: true, sparse: true },
//   extractedByAI: { type: Boolean, default: true },
//   rawAIResponse: { type: String },
//   isVerified: { type: Boolean, default: false },
//   academicYear: { type: String, default: new Date().getFullYear().toString() },
//   totalChapters: { type: Number, default: 0 },
//   status: { type: String, enum: ["active", "inactive"], default: "active" }
// }, { timestamps: true });

// const Syllabus = mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);

// const connectDB = async () => {
//   if (mongoose.connection.readyState >= 1) return;
//   await mongoose.connect(process.env.MONGODB_URI);
//   console.log("✅ MongoDB connected");
// };

// function calculateHash(buffer) {
//   return crypto.createHash('sha256').update(buffer).digest('hex');
// }

// // PDF text extract function - Buffer ko Uint8Array mein convert kiya
// async function extractTextFromPDF(buffer) {
//   try {
//     // 👇 YAHAN CHANGE KIYA - Buffer se Uint8Array mein convert
//     const uint8Array = new Uint8Array(buffer);
    
//     const loadingTask = pdfjs.getDocument({
//       data: uint8Array,  // ✅ Ab Uint8Array use kar raha hai
//       useSystemFonts: true,
//       disableFontFace: true,
//     });
    
//     const pdfDocument = await loadingTask.promise;
//     let fullText = '';
    
//     for (let i = 1; i <= pdfDocument.numPages; i++) {
//       const page = await pdfDocument.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items.map(item => item.str).join(' ');
//       fullText += pageText + '\n';
//     }
    
//     return fullText;
//   } catch (error) {
//     console.error('PDF extraction error:', error);
//     throw error;
//   }
// }

// export async function POST(request) {
//   console.log("📥 Ingest API called");
  
//   try {
//     await connectDB();
    
//     const formData = await request.formData();
//     const pdfFile = formData.get('pdf');
//     const className = formData.get('class');
//     const subject = formData.get('subject');
//     const board = formData.get('board');
//     const academicYear = formData.get('academicYear') || new Date().getFullYear().toString();

//     if (!pdfFile || !className || !subject || !board) {
//       return NextResponse.json(
//         { error: 'Missing required fields: pdf, class, subject, board' },
//         { status: 400 }
//       );
//     }

//     console.log(`📚 Processing: Class ${className}, Subject ${subject}, Board ${board}`);

//     const bytes = await pdfFile.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Check for duplicate
//     const existingSyllabus = await Syllabus.findOne({
//       subjectName: subject.toLowerCase(),
//       targetClass: className,
//       board: board.toLowerCase(),
//       academicYear: academicYear
//     });

//     if (existingSyllabus) {
//       return NextResponse.json({
//         success: false,
//         error: 'Syllabus already exists',
//         data: existingSyllabus
//       }, { status: 409 });
//     }

//     // Extract text from PDF
//     let extractedText = '';
//     try {
//       console.log("📄 Extracting text from PDF...");
//       extractedText = await extractTextFromPDF(buffer);
//       console.log(`✅ Text extracted: ${extractedText.length} characters`);
//     } catch (pdfError) {
//       console.error('PDF extraction error:', pdfError);
//       return NextResponse.json(
//         { error: 'PDF se text extract nahi ho paaya. Kya ye valid PDF hai?', details: pdfError.message },
//         { status: 400 }
//       );
//     }

//     // Find syllabus section (Index/Contents)
//     const lines = extractedText.split('\n');
//     let syllabusText = '';
//     let foundIndex = false;
    
//     const keywords = ['index', 'contents', 'table of contents', 'syllabus', 'chapter 1', 'unit 1'];
    
//     for (let i = 0; i < Math.min(lines.length, 200); i++) {
//       const line = lines[i].toLowerCase();
//       if (keywords.some(kw => line.includes(kw))) {
//         foundIndex = true;
//       }
//       if (foundIndex) {
//         syllabusText += lines[i] + '\n';
//         if (syllabusText.length > 8000) break;
//       }
//     }
    
//     if (!syllabusText || syllabusText.length < 100) {
//       syllabusText = extractedText.substring(0, 8000);
//       console.log("⚠️ No index found, using first 8000 chars");
//     }

//     console.log("🤖 Sending to Groq AI...");

//    // Groq API call - UPDATED MODEL
// const completion = await groq.chat.completions.create({
//   messages: [
//     { 
//       role: 'system', 
//       content: `You are a syllabus extractor. Extract chapters and topics exactly as they appear.
//         Return ONLY valid JSON. No extra text.
//         Format: {"chapters": [{"chapterNumber": 1, "chapterName": "Name", "topics": ["Topic1", "Topic2"]}]}`
//     },
//     { 
//       role: 'user', 
//       content: `Class: ${className}, Subject: ${subject}, Board: ${board}
        
//         Extract syllabus from this text:
//         ${syllabusText.substring(0, 10000)}`
//     }
//   ],
//   model: 'llama-3.3-70b-versatile',  // 👈 YAHAN CHANGE KIYA
//   temperature: 0.1,
// });
//     let syllabusData;
//     let rawResponse = completion.choices[0].message.content;
    
//     try {
//       let cleanJson = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//       syllabusData = JSON.parse(cleanJson);
//       if (!syllabusData.chapters) syllabusData.chapters = [];
//       console.log(`✅ Extracted ${syllabusData.chapters.length} chapters`);
//     } catch(e) {
//       console.error('JSON parse error:', e);
//       return NextResponse.json({
//         success: false,
//         error: 'AI response parse nahi ho paaya',
//         rawResponse: rawResponse
//       }, { status: 500 });
//     }

//     // Save to database
//     const syllabus = new Syllabus({
//       subjectId: null,
//       subjectName: subject.toLowerCase(),
//       targetClass: className,
//       board: board.toLowerCase(),
//       chapters: syllabusData.chapters,
//       pdfOriginalName: pdfFile.name,
//       pdfHash: calculateHash(buffer),
//       extractedByAI: true,
//       rawAIResponse: rawResponse,
//       isVerified: false,
//       academicYear: academicYear,
//       totalChapters: syllabusData.chapters.length,
//       status: 'active'
//     });

//     await syllabus.save();
//     console.log(`💾 Saved to DB with ID: ${syllabus._id}`);

//     return NextResponse.json({
//       success: true,
//       message: 'Syllabus extracted and saved successfully!',
//       data: syllabus,
//       summary: {
//         totalChapters: syllabus.chapters.length,
//         totalTopics: syllabus.chapters.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process PDF', details: error.message },
//       { status: 500 }
//     );
//   }
// }
































// import { NextResponse } from 'next/server';
// import Groq from 'groq-sdk';
// import mongoose from 'mongoose';
// import crypto from 'crypto';

// // PDF.js - Bina worker setup ke
// import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Syllabus Schema
// const SyllabusSchema = new mongoose.Schema({
//   subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
//   subjectName: { type: String, required: true },
//   targetClass: { type: String, required: true },
//   board: { type: String, required: true },
//   chapters: [
//     {
//       chapterNumber: { type: Number },
//       chapterName: { type: String, required: true },
//       topics: [{ type: String }]
//     }
//   ],
//   pdfOriginalName: { type: String },
//   pdfHash: { type: String, unique: true, sparse: true },
//   extractedByAI: { type: Boolean, default: true },
//   rawAIResponse: { type: String },
//   isVerified: { type: Boolean, default: false },
//   academicYear: { type: String, default: new Date().getFullYear().toString() },
//   totalChapters: { type: Number, default: 0 },
//   status: { type: String, enum: ["active", "inactive"], default: "active" }
// }, { timestamps: true });

// const Syllabus = mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);

// const connectDB = async () => {
//   if (mongoose.connection.readyState >= 1) return;
//   await mongoose.connect(process.env.MONGODB_URI);
//   console.log("✅ MongoDB connected");
// };

// function calculateHash(buffer) {
//   return crypto.createHash('sha256').update(buffer).digest('hex');
// }

// // PDF text extract function
// async function extractTextFromPDF(buffer) {
//   try {
//     const uint8Array = new Uint8Array(buffer);
    
//     const loadingTask = pdfjs.getDocument({
//       data: uint8Array,
//       useSystemFonts: true,
//       disableFontFace: true,
//     });
    
//     const pdfDocument = await loadingTask.promise;
//     let fullText = '';
    
//     for (let i = 1; i <= pdfDocument.numPages; i++) {
//       const page = await pdfDocument.getPage(i);
//       const textContent = await page.getTextContent();
//       const pageText = textContent.items.map(item => item.str).join(' ');
//       fullText += pageText + '\n';
//     }
    
//     return fullText;
//   } catch (error) {
//     console.error('PDF extraction error:', error);
//     throw error;
//   }
// }

// export async function POST(request) {
//   console.log("📥 Ingest API called");
  
//   try {
//     await connectDB();
    
//     const formData = await request.formData();
//     const pdfFile = formData.get('pdf');
//     const className = formData.get('class');
//     const subject = formData.get('subject');
//     const board = formData.get('board');
//     const academicYear = formData.get('academicYear') || new Date().getFullYear().toString();

//     if (!pdfFile || !className || !subject || !board) {
//       return NextResponse.json(
//         { error: 'Missing required fields: pdf, class, subject, board' },
//         { status: 400 }
//       );
//     }

//     console.log(`📚 Processing: Class ${className}, Subject ${subject}, Board ${board}`);

//     const bytes = await pdfFile.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Check for duplicate
//     const existingSyllabus = await Syllabus.findOne({
//       subjectName: subject.toLowerCase(),
//       targetClass: className,
//       board: board.toLowerCase(),
//       academicYear: academicYear
//     });

//     if (existingSyllabus) {
//       return NextResponse.json({
//         success: false,
//         error: 'Syllabus already exists',
//         data: existingSyllabus
//       }, { status: 409 });
//     }

//     // Extract text from PDF
//     let extractedText = '';
//     try {
//       console.log("📄 Extracting text from PDF...");
//       extractedText = await extractTextFromPDF(buffer);
//       console.log(`✅ Text extracted: ${extractedText.length} characters`);
//     } catch (pdfError) {
//       console.error('PDF extraction error:', pdfError);
//       return NextResponse.json(
//         { error: 'PDF se text extract nahi ho paaya', details: pdfError.message },
//         { status: 400 }
//       );
//     }

//     // Take more text for better extraction (entire book)
//     const lines = extractedText.split('\n');
//     let syllabusText = '';
    
//     // Take first 600 lines (approximately full book content)
//     for (let i = 0; i < Math.min(lines.length, 600); i++) {
//       syllabusText += lines[i] + '\n';
//       if (syllabusText.length > 45000) break;
//     }
    
//     console.log(`📖 Syllabus text length: ${syllabusText.length} chars`);

//     console.log("🤖 Sending to Groq AI for full syllabus extraction...");

//     // UPDATED PROMPT - Force AI to extract topics for EVERY chapter
//     const completion = await groq.chat.completions.create({
//       messages: [
//         { 
//           role: 'system', 
//           content: `You are a syllabus extractor for Sindh Textbook Board. Extract COMPLETE syllabus with ALL topics for EVERY chapter.

// CRITICAL RULES:
// 1. Find EVERY chapter from Chapter 1 to Chapter 9
// 2. For EACH chapter, you MUST extract:
//    - chapterNumber (1, 2, 3, etc.)
//    - chapterName (exact name from book)
//    - topics (ALL sub-topics, concepts, and key terms from that chapter)

// 3. HOW TO FIND TOPICS:
//    - Look for bullet points (•, -, *, or numbered lists)
//    - Look for bold or capitalized phrases
//    - Look for section headings within the chapter like "1.1", "1.2", etc.
//    - Extract the MAIN CONCEPTS from each chapter, not every sentence
//    - For each chapter, aim for 5-15 topics

// 4. EXAMPLES OF GOOD TOPICS:
//    Chapter 1 topics: "Introduction to Physics", "Branches of Physics", "Measuring Instruments", "Prefixes", "Scientific Notation", "Density", "Significant Figures"
   
//    Chapter 2 topics: "Rest and Motion", "Types of Motion", "Distance and Displacement", "Speed and Velocity", "Acceleration", "Scalars and Vectors", "Graphical Analysis", "Equations of Motion"

// 5. Return ONLY valid JSON. NO extra text.
// 6. Format MUST be:
//    {
//      "chapters": [
//        {"chapterNumber": 1, "chapterName": "Physical Quantities and Measurement", "topics": ["Topic 1", "Topic 2", "Topic 3"]},
//        {"chapterNumber": 2, "chapterName": "Kinematics", "topics": ["Topic 1", "Topic 2", "Topic 3"]}
//      ]
//    }

// 7. If you cannot find topics for a chapter, generate topics based on the chapter's content
// 8. DO NOT leave any chapter with empty topics array`
//         },
//         { 
//           role: 'user', 
//           content: `Class: ${className}, Subject: ${subject}, Board: ${board}
          
// Extract COMPLETE syllabus for ALL chapters from Chapter 1 to Chapter 9.
// For EACH chapter, extract 5-15 topics based on the content.

// Here is the textbook content:

// ${syllabusText.substring(0, 40000)}`
//         }
//       ],
//       model: 'llama-3.3-70b-versatile',
//       temperature: 0.2,  // Slightly higher for better topic extraction
//     });

//     let syllabusData;
//     let rawResponse = completion.choices[0].message.content;
    
//     try {
//       let cleanJson = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//       syllabusData = JSON.parse(cleanJson);
//       if (!syllabusData.chapters) syllabusData.chapters = [];
//       console.log(`✅ Extracted ${syllabusData.chapters.length} chapters`);
//     } catch(e) {
//       console.error('JSON parse error:', e);
//       return NextResponse.json({
//         success: false,
//         error: 'AI response parse nahi ho paaya',
//         rawResponse: rawResponse
//       }, { status: 500 });
//     }

//     // 🔥 NEW: Fill in missing topics for chapters that have empty topics
//     const defaultTopicsByChapter = {
//       1: ["Introduction to Physics", "Branches of Physics", "Measuring Instruments", "Prefixes", "Scientific Notation", "Density and Volume", "Significant Figures"],
//       2: ["Rest and Motion", "Types of Motion", "Distance and Displacement", "Speed and Velocity", "Acceleration", "Scalars and Vectors", "Graphical Analysis of Motion", "Equations of Motion", "Motion due to Gravity"],
//       3: ["Momentum", "Law of Conservation of Momentum", "Newton's First Law of Motion", "Newton's Second Law of Motion", "Newton's Third Law of Motion", "Mass and Weight", "Uniform Circular Motion", "Centripetal Force", "Centrifugal Force", "Friction"],
//       4: ["Like and Unlike Parallel Forces", "Addition of Forces", "Resolution of Forces", "Torque or Moment of Force", "Principle of Moments", "Center of Mass and Gravity", "Couple", "Equilibrium", "Stability"],
//       5: ["Forces on Solids", "Stretching Springs", "Hooke's Law", "Pressure", "Pressure in Fluids", "Pascal's Law", "Hydraulic Machines"],
//       6: ["Newton's Law of Gravitation", "Gravitational Field", "Weight", "Mass of Earth", "Artificial Satellites", "Motion of Satellites", "Critical Velocity"],
//       7: ["States of Matter", "Kinetic Molecular Model", "Brownian Motion", "Forces and Kinetic Theory", "Behavior of Gases", "Boyle's Law"],
//       8: ["Work", "Kinetic Energy", "Potential Energy", "Fossil Fuel Energy", "Hydroelectric Energy", "Solar Energy", "Nuclear Energy", "Geothermal Energy", "Wind Energy", "Biomass Energy", "Tidal Energy", "Renewable Energy", "Non-Renewable Energy", "Efficiency", "Power"],
//       9: ["Heat and Temperature", "Thermometer and Scales", "Heat Capacity", "Specific Heat Capacity", "Heat of Fusion", "Heat of Vaporization", "Evaporation", "Evaporation Causes Cooling", "Factors Affecting Evaporation", "Thermal Expansion", "Linear Expansion", "Volumetric Expansion"]
//     };

//     // Fill in missing topics
//     for (let i = 0; i < syllabusData.chapters.length; i++) {
//       const chapter = syllabusData.chapters[i];
//       if (!chapter.topics || chapter.topics.length === 0) {
//         const defaultTopics = defaultTopicsByChapter[chapter.chapterNumber];
//         if (defaultTopics) {
//           chapter.topics = defaultTopics;
//           console.log(`📝 Added default topics for Chapter ${chapter.chapterNumber}`);
//         } else {
//           chapter.topics = [`Chapter ${chapter.chapterNumber}: ${chapter.chapterName}`];
//         }
//       }
//     }

//     // Ensure chapter numbers are sequential
//     syllabusData.chapters = syllabusData.chapters
//       .filter(ch => ch.chapterNumber && ch.chapterName)
//       .sort((a, b) => a.chapterNumber - b.chapterNumber);

//     // Save to database
//     const syllabus = new Syllabus({
//       subjectId: null,
//       subjectName: subject.toLowerCase(),
//       targetClass: className,
//       board: board.toLowerCase(),
//       chapters: syllabusData.chapters,
//       pdfOriginalName: pdfFile.name,
//       pdfHash: calculateHash(buffer),
//       extractedByAI: true,
//       rawAIResponse: rawResponse,
//       isVerified: false,
//       academicYear: academicYear,
//       totalChapters: syllabusData.chapters.length,
//       status: 'active'
//     });

//     await syllabus.save();
//     console.log(`💾 Saved to DB with ID: ${syllabus._id}`);
//     console.log(`📊 Total chapters saved: ${syllabus.totalChapters}`);

//     // Log topic counts
//     syllabus.chapters.forEach(ch => {
//       console.log(`   Chapter ${ch.chapterNumber}: ${ch.topics?.length || 0} topics`);
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Syllabus extracted and saved successfully!',
//       data: syllabus,
//       summary: {
//         totalChapters: syllabus.chapters.length,
//         totalTopics: syllabus.chapters.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0)
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process PDF', details: error.message },
//       { status: 500 }
//     );
//   }
// }






























































































import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mongoose from 'mongoose';
import crypto from 'crypto';

// PDF.js - Bina worker setup ke
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import Subject from '@/models/Subject';  // 👈 Subject model import karo

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Syllabus Schema
const SyllabusSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  subjectName: { type: String, required: true },
  targetClass: { type: String, required: true },
  board: { type: String, required: true },
  chapters: [
    {
      chapterNumber: { type: Number },
      chapterName: { type: String, required: true },
      topics: [{ type: String }]
    }
  ],
  pdfOriginalName: { type: String },
  pdfHash: { type: String, unique: true, sparse: true },
  extractedByAI: { type: Boolean, default: true },
  rawAIResponse: { type: String },
  isVerified: { type: Boolean, default: false },
  academicYear: { type: String, default: new Date().getFullYear().toString() },
  totalChapters: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

const Syllabus = mongoose.models.Syllabus || mongoose.model("Syllabus", SyllabusSchema);

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
};

function calculateHash(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

// PDF text extract function
async function extractTextFromPDF(buffer) {
  try {
    const uint8Array = new Uint8Array(buffer);
    
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw error;
  }
}

export async function POST(request) {
  console.log("📥 Ingest API called");
  
  try {
    await connectDB();
    
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');
    const className = formData.get('class');
    const subjectInput = formData.get('subject');  // 👈 Name change kiya
    const board = formData.get('board');
    const academicYear = formData.get('academicYear') || new Date().getFullYear().toString();

    if (!pdfFile || !className || !subjectInput || !board) {
      return NextResponse.json(
        { error: 'Missing required fields: pdf, class, subject, board' },
        { status: 400 }
      );
    }

    console.log(`📚 Processing: Class ${className}, Subject Input: ${subjectInput}, Board ${board}`);

    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 👇 FIND SUBJECT FROM DATABASE
    let subject;
    if (mongoose.Types.ObjectId.isValid(subjectInput)) {
      subject = await Subject.findById(subjectInput);
      console.log("🔍 Searching by ID:", subjectInput);
    } else {
      subject = await Subject.findOne({ 
        name: { $regex: new RegExp(`^${subjectInput}$`, 'i') } 
      });
      console.log("🔍 Searching by Name:", subjectInput);
    }
    
    if (!subject) {
      return NextResponse.json({
        success: false,
        error: 'Subject not found in database. Please add the subject first in Subject Management.',
        subjectInput: subjectInput
      }, { status: 404 });
    }
    
    console.log(`✅ Subject verified: ${subject.name} (ID: ${subject._id})`);
    
    // Check for duplicate using subjectId
    const existingSyllabus = await Syllabus.findOne({
      subjectId: subject._id,
      targetClass: className,
      board: board.toLowerCase(),
      academicYear: academicYear
    });

    if (existingSyllabus) {
      return NextResponse.json({
        success: false,
        error: 'Syllabus already exists',
        data: existingSyllabus
      }, { status: 409 });
    }

    // Extract text from PDF
    let extractedText = '';
    try {
      console.log("📄 Extracting text from PDF...");
      extractedText = await extractTextFromPDF(buffer);
      console.log(`✅ Text extracted: ${extractedText.length} characters`);
    } catch (pdfError) {
      console.error('PDF extraction error:', pdfError);
      return NextResponse.json(
        { error: 'PDF se text extract nahi ho paaya', details: pdfError.message },
        { status: 400 }
      );
    }

    // Take more text for better extraction (entire book)
    const lines = extractedText.split('\n');
    let syllabusText = '';
    
    // Take first 600 lines (approximately full book content)
    for (let i = 0; i < Math.min(lines.length, 600); i++) {
      syllabusText += lines[i] + '\n';
      if (syllabusText.length > 45000) break;
    }
    
    console.log(`📖 Syllabus text length: ${syllabusText.length} chars`);

    console.log("🤖 Sending to Groq AI for full syllabus extraction...");

    // UPDATED PROMPT - Force AI to extract topics for EVERY chapter
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are a syllabus extractor for Sindh Textbook Board. Extract COMPLETE syllabus with ALL topics for EVERY chapter.

CRITICAL RULES:
1. Find EVERY chapter from Chapter 1 to Chapter 9
2. For EACH chapter, you MUST extract:
   - chapterNumber (1, 2, 3, etc.)
   - chapterName (exact name from book)
   - topics (ALL sub-topics, concepts, and key terms from that chapter)

3. HOW TO FIND TOPICS:
   - Look for bullet points (•, -, *, or numbered lists)
   - Look for bold or capitalized phrases
   - Look for section headings within the chapter like "1.1", "1.2", etc.
   - Extract the MAIN CONCEPTS from each chapter, not every sentence
   - For each chapter, aim for 5-15 topics

4. EXAMPLES OF GOOD TOPICS:
   Chapter 1 topics: "Introduction to Physics", "Branches of Physics", "Measuring Instruments", "Prefixes", "Scientific Notation", "Density", "Significant Figures"
   
   Chapter 2 topics: "Rest and Motion", "Types of Motion", "Distance and Displacement", "Speed and Velocity", "Acceleration", "Scalars and Vectors", "Graphical Analysis", "Equations of Motion"

5. Return ONLY valid JSON. NO extra text.
6. Format MUST be:
   {
     "chapters": [
       {"chapterNumber": 1, "chapterName": "Physical Quantities and Measurement", "topics": ["Topic 1", "Topic 2", "Topic 3"]},
       {"chapterNumber": 2, "chapterName": "Kinematics", "topics": ["Topic 1", "Topic 2", "Topic 3"]}
     ]
   }

7. If you cannot find topics for a chapter, generate topics based on the chapter's content
8. DO NOT leave any chapter with empty topics array`
        },
        { 
          role: 'user', 
          content: `Class: ${className}, Subject: ${subject.name}, Board: ${board}
          
Extract COMPLETE syllabus for ALL chapters from Chapter 1 to Chapter 9.
For EACH chapter, extract 5-15 topics based on the content.

Here is the textbook content:

${syllabusText.substring(0, 40000)}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,  // Slightly higher for better topic extraction
    });

    let syllabusData;
    let rawResponse = completion.choices[0].message.content;
    
    try {
      let cleanJson = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      syllabusData = JSON.parse(cleanJson);
      if (!syllabusData.chapters) syllabusData.chapters = [];
      console.log(`✅ Extracted ${syllabusData.chapters.length} chapters`);
    } catch(e) {
      console.error('JSON parse error:', e);
      return NextResponse.json({
        success: false,
        error: 'AI response parse nahi ho paaya',
        rawResponse: rawResponse
      }, { status: 500 });
    }

    // 🔥 NEW: Fill in missing topics for chapters that have empty topics
    const defaultTopicsByChapter = {
      1: ["Introduction to Physics", "Branches of Physics", "Measuring Instruments", "Prefixes", "Scientific Notation", "Density and Volume", "Significant Figures"],
      2: ["Rest and Motion", "Types of Motion", "Distance and Displacement", "Speed and Velocity", "Acceleration", "Scalars and Vectors", "Graphical Analysis of Motion", "Equations of Motion", "Motion due to Gravity"],
      3: ["Momentum", "Law of Conservation of Momentum", "Newton's First Law of Motion", "Newton's Second Law of Motion", "Newton's Third Law of Motion", "Mass and Weight", "Uniform Circular Motion", "Centripetal Force", "Centrifugal Force", "Friction"],
      4: ["Like and Unlike Parallel Forces", "Addition of Forces", "Resolution of Forces", "Torque or Moment of Force", "Principle of Moments", "Center of Mass and Gravity", "Couple", "Equilibrium", "Stability"],
      5: ["Forces on Solids", "Stretching Springs", "Hooke's Law", "Pressure", "Pressure in Fluids", "Pascal's Law", "Hydraulic Machines"],
      6: ["Newton's Law of Gravitation", "Gravitational Field", "Weight", "Mass of Earth", "Artificial Satellites", "Motion of Satellites", "Critical Velocity"],
      7: ["States of Matter", "Kinetic Molecular Model", "Brownian Motion", "Forces and Kinetic Theory", "Behavior of Gases", "Boyle's Law"],
      8: ["Work", "Kinetic Energy", "Potential Energy", "Fossil Fuel Energy", "Hydroelectric Energy", "Solar Energy", "Nuclear Energy", "Geothermal Energy", "Wind Energy", "Biomass Energy", "Tidal Energy", "Renewable Energy", "Non-Renewable Energy", "Efficiency", "Power"],
      9: ["Heat and Temperature", "Thermometer and Scales", "Heat Capacity", "Specific Heat Capacity", "Heat of Fusion", "Heat of Vaporization", "Evaporation", "Evaporation Causes Cooling", "Factors Affecting Evaporation", "Thermal Expansion", "Linear Expansion", "Volumetric Expansion"]
    };

    // Fill in missing topics
    for (let i = 0; i < syllabusData.chapters.length; i++) {
      const chapter = syllabusData.chapters[i];
      if (!chapter.topics || chapter.topics.length === 0) {
        const defaultTopics = defaultTopicsByChapter[chapter.chapterNumber];
        if (defaultTopics) {
          chapter.topics = defaultTopics;
          console.log(`📝 Added default topics for Chapter ${chapter.chapterNumber}`);
        } else {
          chapter.topics = [`Chapter ${chapter.chapterNumber}: ${chapter.chapterName}`];
        }
      }
    }

    // Ensure chapter numbers are sequential
    syllabusData.chapters = syllabusData.chapters
      .filter(ch => ch.chapterNumber && ch.chapterName)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    // 👇 SAVE TO DATABASE - FIXED (subjectId null nahi, subject ki actual ID)
    const syllabus = new Syllabus({
      subjectId: subject._id,                    // ✅ Subject ki actual ID
      subjectName: subject.name.toLowerCase(),  // ✅ Subject ka actual name
      targetClass: className,
      board: board.toLowerCase(),
      chapters: syllabusData.chapters,
      pdfOriginalName: pdfFile.name,
      pdfHash: calculateHash(buffer),
      extractedByAI: true,
      rawAIResponse: rawResponse,
      isVerified: false,
      academicYear: academicYear,
      totalChapters: syllabusData.chapters.length,
      status: 'active'
    });

    await syllabus.save();
    console.log(`💾 Saved to DB with ID: ${syllabus._id}`);
    console.log(`   Subject: ${syllabus.subjectName} (ID: ${syllabus.subjectId})`);
    console.log(`📊 Total chapters saved: ${syllabus.totalChapters}`);

    // Log topic counts
    syllabus.chapters.forEach(ch => {
      console.log(`   Chapter ${ch.chapterNumber}: ${ch.topics?.length || 0} topics`);
    });

    return NextResponse.json({
      success: true,
      message: 'Syllabus extracted and saved successfully!',
      data: syllabus,
      summary: {
        totalChapters: syllabus.chapters.length,
        totalTopics: syllabus.chapters.reduce((acc, ch) => acc + (ch.topics?.length || 0), 0)
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF', details: error.message },
      { status: 500 }
    );
  }
}