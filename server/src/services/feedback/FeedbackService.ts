// Path: server/src/services/feedback/FeedbackService.ts

import { FeedbackRepository } from '../../repositories/FeedbackRepository';
import { FeedbackDoc } from '../../models/Feedback';
import { FeedbackStatuses } from '../../../common/build/index';
import { BadRequestError } from '../../errors/bad-request-error';

class FeedbackService {
    static async createFeedback(feedbackAttrs: any): Promise<FeedbackDoc> {
        return FeedbackRepository.create(feedbackAttrs);
    }

    static async getFeedbackById(id: string): Promise<FeedbackDoc | null> {
        return FeedbackRepository.findById(id);
    }

    static async getAllFeedback(): Promise<FeedbackDoc[]> {
        return FeedbackRepository.findAll();
    }

    static async updateFeedback(id: string, updates: any): Promise<FeedbackDoc | null> {
        // Get current feedback to validate status transitions
        const currentFeedback = await FeedbackRepository.findById(id);
        if (!currentFeedback) {
            return null;
        }

        // Validate status transitions
        if (updates.status) {
            const currentStatus = currentFeedback.status;
            const newStatus = updates.status;

            // If status is the same, no need to update
            if (currentStatus === newStatus) {
                // Return the current feedback without updating
                return currentFeedback;
            }

            // Rejected feedback cannot be approved - only deleted
            if (currentStatus === FeedbackStatuses.Rejected && newStatus === FeedbackStatuses.Approved) {
                throw new BadRequestError('Rejected feedback cannot be approved. It can only be deleted.');
            }

            // Approved feedback cannot be rejected - only deleted
            if (currentStatus === FeedbackStatuses.Approved && newStatus === FeedbackStatuses.Rejected) {
                throw new BadRequestError('Approved feedback cannot be rejected. It can only be deleted.');
            }
        }

        return FeedbackRepository.update(id, updates);
    }

    static async deleteFeedback(id: string): Promise<FeedbackDoc | null> {
        return FeedbackRepository.delete(id);
    }
}

export { FeedbackService };