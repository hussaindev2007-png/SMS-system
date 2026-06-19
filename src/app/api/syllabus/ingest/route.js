import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Subject from '@/models/Subject';

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

// ✅ FIXED: PDF text extract function with dynamic import
async function extractTextFromPDF(buffer) {
  try {
    // ✅ Dynamic import - build time par nahi chalta
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // ✅ Worker setup
    const workerUrl = new URL('pdfjs-dist/legacy/build/pdf.worker.mjs', import.meta.url);
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl.href;
    
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
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

export async function POST(request) {
  console.log("📥 Ingest API called");
  
  try {
    await connectDB();
    
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');
    const className = formData.get('class');
    const subjectInput = formData.get('subject');
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
    
    // Find subject from database
    let subject;
    if (mongoose.Types.ObjectId.isValid(subjectInput)) {
      subject = await Subject.findById(subjectInput);
    } else {
      subject = await Subject.findOne({ 
        name: { $regex: new RegExp(`^${subjectInput}$`, 'i') } 
      });
    }
    
    if (!subject) {
      return NextResponse.json({
        success: false,
        error: 'Subject not found in database. Please add the subject first.',
        subjectInput: subjectInput
      }, { status: 404 });
    }
    
    console.log(`✅ Subject verified: ${subject.name} (ID: ${subject._id})`);
    
    // Check for duplicate
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

    // Take more text for better extraction
    const lines = extractedText.split('\n');
    let syllabusText = '';
    for (let i = 0; i < Math.min(lines.length, 600); i++) {
      syllabusText += lines[i] + '\n';
      if (syllabusText.length > 45000) break;
    }
    
    console.log(`📖 Syllabus text length: ${syllabusText.length} chars`);
    console.log("🤖 Sending to Groq AI for full syllabus extraction...");

    // AI extraction
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
   - topics (ALL sub-topics, concepts, and key terms)

3. Return ONLY valid JSON. NO extra text.
4. Format MUST be:
   {
     "chapters": [
       {"chapterNumber": 1, "chapterName": "Chapter Name", "topics": ["Topic 1", "Topic 2"]}
     ]
   }`
        },
        { 
          role: 'user', 
          content: `Class: ${className}, Subject: ${subject.name}, Board: ${board}
          
Extract COMPLETE syllabus for ALL chapters.

Here is the textbook content:

${syllabusText.substring(0, 40000)}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
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

    // Default topics fallback
    const defaultTopicsByChapter = {
      1: ["Introduction", "Basic Concepts", "Measurements", "Units"],
      2: ["Motion", "Speed", "Velocity", "Acceleration"],
      3: ["Force", "Momentum", "Friction", "Gravity"],
      4: ["Work", "Energy", "Power", "Efficiency"],
      5: ["Pressure", "Density", "Buoyancy"],
      6: ["Waves", "Sound", "Light"],
      7: ["Electricity", "Circuits", "Magnetism"],
      8: ["Atoms", "Molecules", "Chemical Reactions"],
      9: ["Environment", "Ecosystem", "Pollution"]
    };

    // Fill in missing topics
    for (let i = 0; i < syllabusData.chapters.length; i++) {
      const chapter = syllabusData.chapters[i];
      if (!chapter.topics || chapter.topics.length === 0) {
        const defaultTopics = defaultTopicsByChapter[chapter.chapterNumber];
        if (defaultTopics) {
          chapter.topics = defaultTopics;
        } else {
          chapter.topics = [`Chapter ${chapter.chapterNumber}: ${chapter.chapterName}`];
        }
      }
    }

    // Ensure chapter numbers are sequential
    syllabusData.chapters = syllabusData.chapters
      .filter(ch => ch.chapterNumber && ch.chapterName)
      .sort((a, b) => a.chapterNumber - b.chapterNumber);

    // Save to database
    const syllabus = new Syllabus({
      subjectId: subject._id,
      subjectName: subject.name.toLowerCase(),
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
