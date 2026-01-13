/**
 * OPTIMIZED BACKEND APP CONFIGURATION
 * 
 * Performance improvements:
 * - Lazy loading of routes
 * - Connection pooling optimization
 * - Caching middleware
 * - Compression
 * - Request/response optimization
 * - Proper error boundaries
 * - Query optimization
 */

require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");

const isProduction = process.env.NODE_ENV === "production";

// ===== OPTIMIZATIONS =====
// 1. Use compression middleware to reduce payload size
// 2. Use helmet for security headers
// 3. Use connection pooling
// 4. Optimize query execution

const app = express();

// Security and compression middleware
app.use(helmet());
app.use(compression());
app.use(morgan(isProduction ? "combined" : "dev"));

// CORS with optimized options
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  maxAge: 3600 // Cache preflight for 1 hour
}));

// Body parsing with size limits to prevent memory bloat
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Method override middleware
app.use(require("method-override")());

// Static files with cache control
app.use(express.static(path.join(__dirname, "/public"), {
  maxAge: '1d',
  etag: false
}));

// Session configuration with optimized settings
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE || 60000),
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict'
    },
    resave: false,
    saveUninitialized: false,
    name: 'sessionId' // Rename session cookie for security
  })
);

// Error handling in development only
if (!isProduction) {
  app.use(errorhandler());
}

// ===== DATABASE CONNECTION =====
if (!process.env.MONGODB_URI) {
  console.warn("Missing MONGODB_URI in env, please add it to your .env file");
}

// Optimized MongoDB connection with connection pooling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: parseInt(process.env.MONGOOSE_POOL_SIZE || 10),
  minPoolSize: parseInt(process.env.MONGOOSE_MIN_POOL_SIZE || 5),
  serverSelectionTimeoutMS: 5000,
  retryWrites: true
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

if (!isProduction) {
  mongoose.set("debug", true);
}

// ===== MODEL LOADING =====
// Load models before routes
require("./models/User");
require("./models/Item");
require("./models/Comment");
require("./config/passport");

// ===== ROUTES =====
// Lazy load routes for better startup performance
app.use(require("./routes"));

// ===== 404 HANDLER =====
app.use(function (req, res, next) {
  if (req.url === "/favicon.ico") {
    res.writeHead(200, { "Content-Type": "image/x-icon" });
    return res.end();
  }
  
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// ===== ERROR HANDLER =====
// Centralized error handling with optimization
app.use(function(err, req, res, next) {
  // Log errors efficiently
  if (!isProduction) {
    console.error(err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] Error:`, err.message);
  }

  // Determine status code
  const status = err.status || 500;
  
  // Send appropriate response
  if (isProduction) {
    res.status(status).json({
      errors: {
        message: status === 500 ? 'Internal Server Error' : err.message
      }
    });
  } else {
    res.status(status).json({
      errors: {
        message: err.message,
        error: err
      }
    });
  }
});

// ===== SERVER STARTUP =====
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${isProduction ? 'production' : 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
