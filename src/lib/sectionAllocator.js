import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import SchoolConfig from "@/models/SchoolConfig";

// Get all configured classes from database
export async function getAllConfiguredClasses() {
  await dbConnect();
  
  const config = await SchoolConfig.findOne();
  
  if (!config || !config.classConfigs || config.classConfigs.length === 0) {
    return [];
  }
  
  return config.classConfigs.map(c => c.className);
}

// Get available sections for a class from config
async function getClassSections(className) {
  await dbConnect();
  
  const config = await SchoolConfig.findOne();
  
  if (!config) {
    // Default sections if no config
    return { sections: ["A"], maxPerSection: 30 };
  }
  
  const classConfig = config.classConfigs.find(c => c.className === className);
  
  if (!classConfig) {
    // If class not configured, return default
    return { sections: ["A"], maxPerSection: 30 };
  }
  
  return {
    sections: classConfig.sections,
    maxPerSection: classConfig.maxStudentsPerSection || 30
  };
}

// Get section with least students (only from configured sections)
export async function getAvailableSection(className) {
  await dbConnect();
  
  const { sections, maxPerSection } = await getClassSections(className);
  
  if (!sections || sections.length === 0) {
    return "A"; // Default fallback
  }
  
  let sectionCounts = [];
  
  for (const section of sections) {
    const count = await User.countDocuments({
      role: "student",
      className: className,
      section: section,
      status: "active"
    });
    
    sectionCounts.push({ section, count, isFull: count >= maxPerSection });
  }
  
  // Filter out full sections
  const availableSections = sectionCounts.filter(s => !s.isFull);
  
  if (availableSections.length === 0) {
    // All sections are full
    return { error: "All sections are full", sections: sectionCounts };
  }
  
  // Sort by count (least students first)
  availableSections.sort((a, b) => a.count - b.count);
  
  return availableSections[0].section;
}

// Get section stats for display
export async function getSectionStats(className) {
  await dbConnect();
  
  const { sections, maxPerSection } = await getClassSections(className);
  
  let stats = [];
  
  for (const section of sections) {
    const count = await User.countDocuments({
      role: "student",
      className: className,
      section: section,
      status: "active"
    });
    
    stats.push({
      section,
      currentCount: count,
      maxCount: maxPerSection,
      available: maxPerSection - count,
      isFull: count >= maxPerSection
    });
  }
  
  return stats;
}

// Get next roll number (works with any class name)
export async function getNextRollNumber(className, section) {
  await dbConnect();
  
  const lastStudent = await User.findOne({
    role: "student",
    className: className,
    section: section
  }).sort({ rollNo: -1 });
  
  let nextNumber = 1;
  
  if (lastStudent && lastStudent.rollNo) {
    const match = lastStudent.rollNo.match(/\d+$/);
    if (match) {
      nextNumber = parseInt(match[0]) + 1;
    }
  }
  
  // Handle class name that might not be numeric (e.g., "Pre-9", "Nursery")
  let classNum = className;
  // If className is numeric, pad with leading zeros
  if (!isNaN(parseInt(classNum))) {
    classNum = classNum.toString().padStart(2, '0');
  }
  
  const numberStr = nextNumber.toString().padStart(3, '0');
  
  return `${classNum}${section}${numberStr}`;
}

export { getClassSections };