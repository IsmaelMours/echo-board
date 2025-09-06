import { FeedbackStatuses } from '../../common/build/events/types/types';
import mongoose from 'mongoose';
import { UserDoc } from './user';

// An interface that describes the properties
// that are requried to create a new Feedback


interface FeedbackAttrs {
  title: string;
  message: string;
  rating: number;
  status?: FeedbackStatuses;
  userId: string; // Add userId
  createdAt?: Date;
  updatedAt?: Date;
}

// An interface that describes the properties
// that a Feedback Model has
interface FeedbackModel extends mongoose.Model<FeedbackDoc> {
  build(attrs: FeedbackAttrs): FeedbackDoc;
}

// An interface that describes the properties
// that a Feedback Document has
interface FeedbackDoc extends mongoose.Document {
  title: string;
  message: string;
  rating: number;
  status: FeedbackStatuses;
  userId: string; // Add userId
  author: UserDoc; // Add populated author field
  createdAt: Date;
  updatedAt?: Date;
}

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FeedbackStatuses),
      default: FeedbackStatuses.Pending,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc: mongoose.Document, ret: Record<string, any>) {
        const { _id, __v, ...rest } = ret;
        return { id: _id, ...rest };
      },
      virtuals: true, // Ensure virtuals are included when converting to JSON
    },
    // Add populate option to always populate the author field
    toObject: { virtuals: true },
  }
);

feedbackSchema.virtual('author', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

feedbackSchema.virtual('id').get(function(this: mongoose.Document) {
  return this._id;
});

feedbackSchema.pre('find', function(this: mongoose.Query<any, FeedbackDoc>) {
  this.populate('author');
});

feedbackSchema.pre('findOne', function(this: mongoose.Query<any, FeedbackDoc>) {
  this.populate('author');
});

feedbackSchema.pre('save', function(this: FeedbackDoc, next: mongoose.CallbackWithoutResultAndOptionalError) {
  next();
});

feedbackSchema.statics.build = (attrs: FeedbackAttrs) => {
  return new Feedback(attrs);
};

const Feedback = mongoose.model<FeedbackDoc, FeedbackModel>('Feedback', feedbackSchema);

export { Feedback, FeedbackDoc };