// Path: server/src/routes/index.ts

import express from 'express';
import { UserController } from '../controllers/UserController';
import { FeedbackController } from '../controllers/FeedbackController';
import { HealthController } from '../controllers/HealthController';
import { body, param } from 'express-validator';
import { requireAdmin } from '../middlewares/require-admin';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

// Health Check Routes
router.get('/api/health', HealthController.getHealthStatus);

// User Routes
router.post('/api/users/signup', 
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
    body('name').not().isEmpty().withMessage('Name is required'),
    UserController.signup
);
router.post('/api/users/signin',
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    UserController.signin
);
router.post('/api/users/signout', UserController.signout);
router.get('/api/users/currentuser', UserController.currentUser);

// Feedback Routes
router.post('/api/feedback',
    currentUser,
    requireAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('message').not().isEmpty().withMessage('Message is required'),
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    FeedbackController.createFeedback
);
router.get('/api/feedback/:id',
    param('id').isMongoId().withMessage('Invalid Feedback ID'),
    FeedbackController.getFeedbackById
);
router.get('/api/feedback',
    currentUser,
    requireAuth,
    FeedbackController.getAllFeedback
);
router.put('/api/feedback/:id',
    currentUser,
    requireAuth,
    requireAdmin,
    param('id').isMongoId().withMessage('Invalid Feedback ID'),
    body('title').optional().not().isEmpty().withMessage('Title cannot be empty'),
    body('message').optional().not().isEmpty().withMessage('Message cannot be empty'),
    body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('status').optional().isIn(['pending', 'approved', 'rejected', 'archived']).withMessage('Status must be pending, approved, rejected, or archived'),
    FeedbackController.updateFeedback
);
router.delete('/api/feedback/:id',
    requireAdmin,
    param('id').isMongoId().withMessage('Invalid Feedback ID'),
    FeedbackController.deleteFeedback
);

export { router as indexRouter };