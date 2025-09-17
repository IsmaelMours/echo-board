import express from 'express';
import 'express-async-errors';
import { json } from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import cors from 'cors';
import path from 'path';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      startTime?: number;
    }
  }
}

import { currentUser } from './middlewares/current-user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

// Initialize Express app
const app = express();

// Trust proxy when behind ingress-nginx
app.set('trust proxy', true);

// CORS middleware - allow requests from Vercel domains
app.use(cors({
  origin: [
    'https://echo-board-beta.vercel.app',
    'https://echo-board-git-dev-ismaels-projects-85a49b0a.vercel.app',
    'https://echo-board-git-main-ismaels-projects-85a49b0a.vercel.app',
    'https://echo-board-39999fyg0-ismaels-projects-85a49b0a.vercel.app',
    'http://localhost:3000', // For local development
    'http://localhost:5173'  // For Vite dev server
  ],
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Configure static file serving
const staticOptions = {
  setHeaders: (res: any, path: string) => {
    // Set proper MIME type for JavaScript modules
    if (path.endsWith('.mjs') || path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
};

// Middleware setup
app.use(json());
app.use(express.static(path.join(__dirname, '../../client/dist'), staticOptions));

// Response time middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Logging middleware
app.use(pinoHttp());

// Security middleware with CSP configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// @ts-ignore: Express middleware compatibility
app.use(limiter);

// Session middleware
const sessionOptions = {
  name: 'session',
  keys: [process.env.COOKIE_SECRET || 'secret'],
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// @ts-ignore: Express middleware compatibility
app.use(cookieSession(sessionOptions));

// Current user middleware
app.use(currentUser);

import { UserController } from './controllers/UserController';
import { FeedbackController } from './controllers/FeedbackController';

import { indexRouter } from './routes';

// Routes
app.use(indexRouter);

// Catch all for not found routes
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  }
  next(new NotFoundError());
});

// Error handling middleware
app.use(errorHandler);

export { app };