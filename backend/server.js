import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Terlalu banyak request, silakan coba lagi nanti'
});

app.use(limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Attendance System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes (TODO: Import these when implemented)
// import authRoutes from './routes/auth.js';
// import attendanceRoutes from './routes/attendance.js';
// import classRoutes from './routes/classes.js';
// import reportRoutes from './routes/reports.js';
// import adminRoutes from './routes/admin.js';
// import userRoutes from './routes/users.js';

// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/attendance', attendanceRoutes);
// app.use('/api/v1/classes', classRoutes);
// app.use('/api/v1/reports', reportRoutes);
// app.use('/api/v1/admin', adminRoutes);
// app.use('/api/v1/users', userRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Route tidak ditemukan',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  PROMKOM ATTENDANCE SYSTEM API         ║
║  Running on port ${PORT}                  ║
║  Environment: ${process.env.NODE_ENV || 'development'}         ║
╚════════════════════════════════════════╝
  `);
});

export default app;
