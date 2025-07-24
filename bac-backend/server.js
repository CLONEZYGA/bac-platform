const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Network configuration
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces for physical device testing

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS

// Rate limiting
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const status = {
      server: 'running',
      database: dbState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date()
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// MongoDB connection string
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bacapp';

// Improved MongoDB connection with retry logic
const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      // Wait 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

connectDB().catch(err => {
  console.error('Failed to connect to MongoDB after all retries:', err);
  process.exit(1);
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  initials: String,
  group: { type: String, default: 'NEW' },
  notifications: { type: Array, default: [] },
  classes: { type: Array, default: [] },
  lessons: { type: Array, default: [] },
});
const User = mongoose.model('User', userSchema);

// --- Application Schema ---
const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: String,
  email: String,
  status: { type: String, enum: ['pending', 'in_review', 'approved', 'rejected'], default: 'pending' },
  submittedDate: String,
  documents: { type: Array, default: [] },
});
const Application = mongoose.model('Application', applicationSchema);

// Mock data for Thuto and Amy
const users = {
  thuto: {
    id: 'thuto',
    name: 'Thuto Moleps',
    initials: 'TM',
    program: 'BSc (Hons) Computer Systems Engineering',
    group: 'CSE-2',
    notifications: [
      { id: '1', title: 'Welcome Thuto!', description: 'Your semester starts soon.', date: '2024-07-01' },
      { id: '2', title: 'Exam Reminder', description: 'Maths exam on 2024-07-10.', date: '2024-07-05' },
    ],
    classes: [
      { id: '1', subject: 'DM-Discrete Mathematics', instructor: 'Dr. Smith', time: 'Mon 10:00-12:00' },
      { id: '2', subject: 'CS-Computer Science', instructor: 'Prof. Lee', time: 'Wed 14:00-16:00' },
    ],
    lessons: [
      { id: '1', name: 'DM-Discrete Mathematics', week: 'Week 1' },
      { id: '2', name: 'CS-Computer Science', week: 'Week 2' },
    ],
  },
  amy: {
    id: 'amy',
    name: 'Amy Mosdada',
    initials: 'AM',
    program: 'BSc (Hons) Information Technology',
    group: 'IT-1',
    notifications: [
      { id: '1', title: 'Welcome Amy!', description: 'Orientation is on 2024-07-02.', date: '2024-07-01' },
      { id: '2', title: 'Assignment Due', description: 'Submit your project by 2024-07-15.', date: '2024-07-10' },
    ],
    classes: [
      { id: '1', subject: 'IT Fundamentals', instructor: 'Dr. Adams', time: 'Tue 09:00-11:00' },
      { id: '2', subject: 'Web Development', instructor: 'Ms. Green', time: 'Thu 13:00-15:00' },
    ],
    lessons: [
      { id: '1', name: 'IT Fundamentals', week: 'Week 1' },
      { id: '2', name: 'Web Development', week: 'Week 2' },
    ],
  }
};

// Middleware to verify JWT and attach user to req
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to require admin role
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
}

// Middleware to require student or admin (for endpoints with :id)
function requireSelfOrAdmin(req, res, next) {
  if (req.user.role === 'admin' || req.user.userId === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Not your resource' });
}

// In-memory activity log (for demo; use a DB in production)
let adminActivityLog = [];
// Helper to log admin actions
function logAdminActivity(type, message) {
  adminActivityLog.unshift({
    id: Date.now().toString(),
    type,
    message,
    date: new Date().toISOString().slice(0, 10),
  });
  adminActivityLog = adminActivityLog.slice(0, 20);
}
// Count of notifications sent (for demo; use a DB in production)
let notificationsSentCount = 0;

// --- API Endpoints ---
app.get('/api/users/:id', authenticateJWT, requireSelfOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id/notifications', authenticateJWT, requireSelfOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.notifications || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id/classes', authenticateJWT, requireSelfOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.classes || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id/lessons', authenticateJWT, requireSelfOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.lessons || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/applications', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const applications = await Application.find().lean();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id/application-status', authenticateJWT, requireSelfOrAdmin, async (req, res) => {
  try {
    const app = await Application.findOne({ studentId: req.params.id }).lean();
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json({ status: app.status, lastUpdated: app.submittedDate, documents: app.documents });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id/documents', authenticateJWT, requireSelfOrAdmin, async (req, res) => {
  try {
    const app = await Application.findOne({ studentId: req.params.id }).lean();
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app.documents);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  console.log('Registration request received:', { ...req.body, password: '[REDACTED]' });
  
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    console.warn('Registration failed: Missing fields');
    return res.status(400).json({ 
      success: false, 
      message: 'Missing fields', 
      details: {
        email: !email ? 'Email is required' : null,
        name: !name ? 'Name is required' : null,
        password: !password ? 'Password is required' : null
      }
    });
  }

  try {
    // Validate email format
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      console.warn('Registration failed: Invalid email format');
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn('Registration failed: Email already registered');
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    // Create user object
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      initials,
      group: 'NEW',
      notifications: [],
      classes: [],
      lessons: []
    });

    // Save user to database
    console.log('Attempting to save user to database...');
    await user.save();
    console.log('User saved successfully:', { userId: user._id, email: user.email });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    
    // Send success response
    res.json({ 
      success: true, 
      userId: user._id, 
      role: user.role, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.initials
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error', 
        details: Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {})
      });
    }

    // Handle other errors
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // Issue JWT
    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ success: true, userId: user._id, role: user.role, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update approve application endpoint
app.post('/api/applications/:id/approve', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    app.status = 'approved';
    await app.save();
    io.to(app.studentId.toString()).emit('applicationStatusUpdated', {
      status: 'approved',
      lastUpdated: app.submittedDate,
      documents: app.documents,
    });
    io.to(app.studentId.toString()).emit('notification', {
      title: 'Your application was approved',
      date: new Date().toISOString(),
    });
    logAdminActivity('application', `Approved application for ${app.studentName}`);
    notificationsSentCount++;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update reject application endpoint
app.post('/api/applications/:id/reject', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'Application not found' });
    app.status = 'rejected';
    await app.save();
    io.to(app.studentId.toString()).emit('applicationStatusUpdated', {
      status: 'rejected',
      lastUpdated: app.submittedDate,
      documents: app.documents,
    });
    io.to(app.studentId.toString()).emit('notification', {
      title: 'Your application was rejected',
      date: new Date().toISOString(),
    });
    logAdminActivity('application', `Rejected application for ${app.studentName}`);
    notificationsSentCount++;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Student submits a new application
app.post('/api/applications', authenticateJWT, async (req, res) => {
  try {
    const { studentName, email, documents } = req.body;
    const studentId = req.user.userId;
    // Log the application submission
    console.log(`[NEW APPLICATION] studentName: ${studentName}, email: ${email}, studentId: ${studentId}`);
    // Prevent duplicate applications for the same student
    const existing = await Application.findOne({ studentId });
    if (existing) {
      return res.status(409).json({ error: 'Application already exists for this student.' });
    }
    const app = new Application({
      studentId,
      studentName,
      email,
      status: 'pending',
      submittedDate: new Date().toISOString().slice(0, 10),
      documents: documents || [],
    });
    await app.save();
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin activity endpoint
app.get('/api/admin/activity', authenticateJWT, requireAdmin, (req, res) => {
  res.json(adminActivityLog);
});
// Admin notifications count endpoint
app.get('/api/admin/notifications/count', authenticateJWT, requireAdmin, (req, res) => {
  res.json({ count: notificationsSentCount });
});

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: '*' } });

// Socket.io: user joins their own room by userId
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}/api (with Socket.io)`);
  console.log('Available on your network at:');
  console.log(`http://10.2.0.2:${PORT}/api`);
});