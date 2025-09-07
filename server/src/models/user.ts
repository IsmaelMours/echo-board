import mongoose from 'mongoose';
import { Password } from '../utilities/password';
import { UserRoles } from '../../common/build/events/types/types';

interface UserAttrs {
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  role: UserRoles;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  avatar?: string;
  role: UserRoles;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRoles),
      default: UserRoles.User,
    },
  },
  {
    toJSON: {
      transform(ret, doc) {
        const { _id, __v, password, ...rest } = ret;
        return { id: _id, ...rest };
      },
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const password = this.get('password');
    if (typeof password === 'string') {
      const hashed = await Password.toHash(password);
      this.set('password', hashed);
    }
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserDoc };
