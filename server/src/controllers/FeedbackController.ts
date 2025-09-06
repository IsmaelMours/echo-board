// Path: server/src/controllers/FeedbackController.ts

import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { FeedbackService } from '../services/feedback/FeedbackService';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { QueueService } from '../services/queue/QueueService';
import { UserService } from '../services/users/UserService';
import { FeedbackDoc } from '../models/Feedback';

class FeedbackController {
    // Create a new feedback
    
    static async createFeedback(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError('Validation failed', errors.array().map(error => ({
                message: error.msg,
                field: (error.type === 'field') ? error.path : undefined
            })));
        }

        const { title, message, rating } = req.body;
        if (!req.currentUser) {
            throw new NotAuthorizedError();
        }
        const userId = req.currentUser.id;
        
        try {
            const feedback: FeedbackDoc = await FeedbackService.createFeedback({ title, message, rating, userId });
            
            // Queue email notification (non-blocking)
            setImmediate(async () => {
                try {
                    const queueService = QueueService.getInstance();
                    const user = await UserService.getCurrentUser(userId);
                    if (user) {
                        await queueService.sendFeedbackCreatedEmail(
                            user.email,
                            user.name,
                            {
                                id: feedback.id,
                                title,
                                message,
                                rating
                            }
                        );
                    }
                } catch (emailError) {
                    console.error("Failed to queue email notification:", emailError);
                    // Email queuing failure is logged but doesn't affect the response
                }
            });
            
            res.status(201).send(feedback);
        } catch (err: any) {
            console.error("Error in createFeedback:", err);
            throw new BadRequestError(err.message || "Failed to create feedback");
        }
    }

    static async getFeedbackById(req: Request, res: Response) {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }

        const { id } = req.params;
        const feedback = await FeedbackService.getFeedbackById(id);
        if (!feedback) {
            throw new NotFoundError();
        }
        res.send(feedback);
    }

    static async getAllFeedback(req: Request, res: Response) {
        const feedback = await FeedbackService.getAllFeedback();
        res.send(feedback);
    }

    static async updateFeedback(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }

        const { id } = req.params;
        const updates = req.body;
        
        // Get the current feedback before updating to check for status changes
        const currentFeedback = await FeedbackService.getFeedbackById(id);
        if (!currentFeedback) {
            throw new NotFoundError();
        }

        const feedback = await FeedbackService.updateFeedback(id, updates);
        if (!feedback) {
            throw new NotFoundError();
        }

        // Send email notification if status changed to approved or rejected
        if (updates.status && updates.status !== currentFeedback.status) {
            setImmediate(async () => {
                try {
                    const queueService = QueueService.getInstance();
                    const user = await UserService.getCurrentUser(feedback.userId);
                    
                    if (user) {
                        const feedbackData = {
                            id: feedback.id,
                            title: feedback.title,
                            message: feedback.message,
                            rating: feedback.rating
                        };

                        if (updates.status === 'approved') {
                            await queueService.sendFeedbackApprovedEmail(user.email, user.name, feedbackData);
                        } else if (updates.status === 'rejected') {
                            await queueService.sendFeedbackRejectedEmail(user.email, user.name, feedbackData);
                        }
                    }
                } catch (emailError) {
                    console.error("Failed to queue status change email:", emailError);
                    // Email queuing failure is logged but doesn't affect the response
                }
            });
        }

        res.send(feedback);
    }

    static async deleteFeedback(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }

        const { id } = req.params;
        const feedback = await FeedbackService.deleteFeedback(id);
        if (!feedback) {
            throw new NotFoundError();
        }
        res.status(204).send();
    }
}

export { FeedbackController };