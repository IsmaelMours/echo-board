import express from 'express';
import 'express-async-errors';
import { json } from 'express';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

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

// Middleware setup
app.use(json());

// Response time middleware
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Logging middleware
app.use(pinoHttp());

// Security middleware
app.use(helmet());

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
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// Error handling middleware
app.use(errorHandler);

export { app };