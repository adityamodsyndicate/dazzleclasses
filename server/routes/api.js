import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get database path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../data/db.json');

// Helper functions to read/write JSON file
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { courses: [], inquiries: [], doubts: [] };
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
};

/* ==========================================================================
   COURSES ENDPOINTS
   ========================================================================== */

// Get all courses
router.get('/courses', (req, res) => {
  const db = readDatabase();
  res.json(db.courses);
});

// Add a new course
router.post('/courses', (req, res) => {
  const db = readDatabase();
  const newCourse = req.body;

  if (!newCourse.title || !newCourse.duration || !newCourse.category) {
    return res.status(400).json({ message: 'Title, duration, and category are required' });
  }

  // Generate ID if not provided
  if (!newCourse.id) {
    newCourse.id = newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Check duplicate
  if (db.courses.some(c => c.id === newCourse.id)) {
    newCourse.id = `${newCourse.id}-${Date.now().toString().slice(-4)}`;
  }

  // Ensure default arrays
  newCourse.benefits = newCourse.benefits || [];
  if (typeof newCourse.benefits === 'string') {
    newCourse.benefits = newCourse.benefits.split(',').map(b => b.trim()).filter(Boolean);
  }

  db.courses.push(newCourse);
  writeDatabase(db);

  res.status(201).json({ message: 'Course added successfully', course: newCourse });
});

// Update a course
router.put('/courses/:id', (req, res) => {
  const db = readDatabase();
  const courseId = req.params.id;
  const courseIndex = db.courses.findIndex(c => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const updatedData = req.body;
  
  if (typeof updatedData.benefits === 'string') {
    updatedData.benefits = updatedData.benefits.split(',').map(b => b.trim()).filter(Boolean);
  }

  db.courses[courseIndex] = {
    ...db.courses[courseIndex],
    ...updatedData,
    id: courseId // Do not allow ID change
  };

  writeDatabase(db);
  res.json({ message: 'Course updated successfully', course: db.courses[courseIndex] });
});

// Delete a course
router.delete('/courses/:id', (req, res) => {
  const db = readDatabase();
  const courseId = req.params.id;
  const filteredCourses = db.courses.filter(c => c.id !== courseId);

  if (db.courses.length === filteredCourses.length) {
    return res.status(404).json({ message: 'Course not found' });
  }

  db.courses = filteredCourses;
  writeDatabase(db);
  res.json({ message: 'Course deleted successfully' });
});

/* ==========================================================================
   INQUIRIES ENDPOINTS
   ========================================================================== */

// Get all inquiries
router.get('/inquiries', (req, res) => {
  const db = readDatabase();
  res.json(db.inquiries);
});

// Post a new inquiry
router.post('/inquiries', (req, res) => {
  const db = readDatabase();
  const { name, email, phone, courseId, notes } = req.body;

  if (!name || !phone || !courseId) {
    return res.status(400).json({ message: 'Name, phone number, and selected course are required.' });
  }

  const newInquiry = {
    id: `inq-${Date.now()}`,
    name,
    email: email || '',
    phone,
    courseId,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    notes: notes || ''
  };

  db.inquiries.unshift(newInquiry); // Add to the top
  writeDatabase(db);

  res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
});

// Update inquiry status
router.put('/inquiries/:id', (req, res) => {
  const db = readDatabase();
  const inquiryId = req.params.id;
  const inqIndex = db.inquiries.findIndex(i => i.id === inquiryId);

  if (inqIndex === -1) {
    return res.status(404).json({ message: 'Inquiry not found' });
  }

  const { status, notes } = req.body;
  if (status) db.inquiries[inqIndex].status = status;
  if (notes !== undefined) db.inquiries[inqIndex].notes = notes;

  writeDatabase(db);
  res.json({ message: 'Inquiry status updated', inquiry: db.inquiries[inqIndex] });
});

/* ==========================================================================
   DOUBTS / QUESTIONS ENDPOINTS
   ========================================================================== */

// Get all doubts
router.get('/doubts', (req, res) => {
  const db = readDatabase();
  res.json(db.doubts || []);
});

// Submit a new doubt
router.post('/doubts', (req, res) => {
  const db = readDatabase();
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and doubt message are required.' });
  }

  const newDoubt = {
    id: `dbt-${Date.now()}`,
    name,
    email,
    message,
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    reply: ''
  };

  if (!db.doubts) db.doubts = [];
  db.doubts.unshift(newDoubt);
  writeDatabase(db);

  res.status(201).json({ message: 'Your doubt has been submitted. Our team will email you soon!', doubt: newDoubt });
});

// Answer a doubt
router.put('/doubts/:id', (req, res) => {
  const db = readDatabase();
  const doubtId = req.params.id;
  
  if (!db.doubts) db.doubts = [];
  const index = db.doubts.findIndex(d => d.id === doubtId);

  if (index === -1) {
    return res.status(404).json({ message: 'Doubt not found' });
  }

  const { reply } = req.body;
  if (!reply) {
    return res.status(400).json({ message: 'Reply content cannot be empty' });
  }

  db.doubts[index].reply = reply;
  db.doubts[index].status = 'Answered';

  writeDatabase(db);
  res.json({ message: 'Doubt answered successfully', doubt: db.doubts[index] });
});

/* ==========================================================================
   ANALYTICS ENDPOINTS
   ========================================================================== */

router.get('/analytics', (req, res) => {
  const db = readDatabase();
  const inquiries = db.inquiries || [];
  const courses = db.courses || [];
  const doubts = db.doubts || [];

  // Core metrics
  const totalInquiries = inquiries.length;
  const enrolledStudents = inquiries.filter(i => i.status === 'Enrolled').length;
  const contactedStudents = inquiries.filter(i => i.status === 'Contacted').length;
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;

  // Course distribution
  const courseCountMap = {};
  inquiries.forEach(inq => {
    courseCountMap[inq.courseId] = (courseCountMap[inq.courseId] || 0) + 1;
  });

  const courseBreakdown = Object.keys(courseCountMap).map(courseId => {
    const course = courses.find(c => c.id === courseId);
    return {
      courseId,
      title: course ? course.title : courseId,
      count: courseCountMap[courseId]
    };
  }).sort((a, b) => b.count - a.count);

  // Status distributions
  const statusCounts = {
    Pending: pendingInquiries,
    Contacted: contactedStudents,
    Enrolled: enrolledStudents,
    Rejected: inquiries.filter(i => i.status === 'Rejected').length
  };

  // Recent inquiries (last 5)
  const recent = inquiries.slice(0, 5).map(inq => {
    const course = courses.find(c => c.id === inq.courseId);
    return {
      ...inq,
      courseTitle: course ? course.title : inq.courseId
    };
  });

  // Doubts count
  const totalDoubts = doubts.length;
  const pendingDoubts = doubts.filter(d => d.status === 'Pending').length;

  res.json({
    totalInquiries,
    enrolledStudents,
    contactedStudents,
    pendingInquiries,
    statusCounts,
    courseBreakdown,
    recentInquiries: recent,
    pendingDoubts,
    totalDoubts
  });
});

/* ==========================================================================
   ADMIN LOGIN
   ========================================================================== */
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Super secure demo credentials
  if (username === 'admin' && password === 'dazzle@admin123') {
    res.json({
      success: true,
      token: 'dazzle_token_secret_' + Math.random().toString(36).substring(7),
      user: { name: 'Nisha Harit', role: 'CEO & Founder' }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Admin credentials' });
  }
});

export default router;
