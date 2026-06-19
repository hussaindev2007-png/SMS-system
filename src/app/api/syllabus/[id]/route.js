import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Syllabus from '@/models/Syllabus';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

// GET: Fetch specific syllabus by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid syllabus ID' },
        { status: 400 }
      );
    }

    const syllabus = await Syllabus.findById(id);
    
    if (!syllabus) {
      return NextResponse.json(
        { error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: syllabus
    });

  } catch (error) {
    console.error('GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch syllabus', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete syllabus by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid syllabus ID' },
        { status: 400 }
      );
    }

    const deletedSyllabus = await Syllabus.findByIdAndDelete(id);
    
    if (!deletedSyllabus) {
      return NextResponse.json(
        { error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Syllabus deleted successfully',
      deletedId: id
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete syllabus', details: error.message },
      { status: 500 }
    );
  }
}

// PUT/PATCH: Update syllabus by ID (optional but useful)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid syllabus ID' },
        { status: 400 }
      );
    }

    const updatedSyllabus = await Syllabus.findByIdAndUpdate(
      id,
      { 
        ...body,
        isVerified: false // Reset verification if modified
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedSyllabus) {
      return NextResponse.json(
        { error: 'Syllabus not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Syllabus updated successfully',
      data: updatedSyllabus
    });

  } catch (error) {
    console.error('UPDATE error:', error);
    return NextResponse.json(
      { error: 'Failed to update syllabus', details: error.message },
      { status: 500 }
    );
  }
}