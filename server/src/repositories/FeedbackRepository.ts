// Path: server/src/repositories/FeedbackRepository.ts

import { Feedback, FeedbackDoc } from '../models/Feedback';

class FeedbackRepository {
    
    static async create(feedbackAttrs: any): Promise<any> {
        const feedback = Feedback.build(feedbackAttrs);
        await feedback.save();
        await feedback.populate({ path: 'userId', select: '_id email name avatar' });
        
        // Convert to plain object to avoid circular references
        const feedbackObject = feedback.toObject();
        
        // Transform _id to id and ensure author is a plain object
        const { _id, userId, __v, author, ...rest } = feedbackObject;
        return {
            id: (_id as any).toString(),
            author: userId, // This is already a plain object from populate
            ...rest
        };
    }

    static async findById(id: string): Promise<any | null> {
        const feedback = await Feedback.findById(id).populate({ path: 'userId', select: '_id email name avatar' }).lean();
        if (!feedback) return null;
        
        // Transform _id to id and userId to author
        const { _id, userId, author, ...rest } = feedback;
        return {
            id: _id,
            author: userId,
            ...rest
        };
    }

    static async findAll(): Promise<any[]> {
        const feedbacks = await Feedback.find({}).populate({ path: 'userId', select: '_id email name avatar' }).lean();
        
        // Transform _id to id and userId to author for each feedback
        return feedbacks.map(feedback => {
            const { _id, userId, author, ...rest } = feedback;
            return {
                id: _id,
                author: userId,
                ...rest
            };
        });
    }

    static async update(id: string, updates: any): Promise<any | null> {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return null;
        }
        Object.assign(feedback, updates);
        feedback.updatedAt = new Date();
        await feedback.save();
        await feedback.populate({ path: 'userId', select: '_id email name avatar' });
        
        // Convert to plain object to avoid circular references
        const feedbackObject = feedback.toObject();
        
        // Transform _id to id and ensure author is a plain object
        const { _id, userId, __v, author, ...rest } = feedbackObject;
        return {
            id: (_id as any).toString(),
            author: userId, // This is already a plain object from populate
            ...rest
        };
    }

    static async delete(id: string): Promise<any | null> {
        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return null;
        }
        await feedback.populate({ path: 'userId', select: '_id email name avatar' });
        
        // Convert to plain object to avoid circular references
        const feedbackObject = feedback.toObject();
        
        // Transform _id to id and ensure author is a plain object
        const { _id, userId, __v, author, ...rest } = feedbackObject;
        return {
            id: (_id as any).toString(),
            author: userId, // This is already a plain object from populate
            ...rest
        };
    }
}

export { FeedbackRepository };