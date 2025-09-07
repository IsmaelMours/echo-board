// Path: server/src/repositories/UserRepository.ts

import { User, UserDoc } from '../models/user';

class UserRepository {
    static async create(userAttrs: any): Promise<UserDoc> {
        const user = User.build(userAttrs);
        await user.save();
        return user;
    }

    static async findByEmail(email: string): Promise<UserDoc | null> {
        return User.findOne({ email });
    }

    static async findById(id: string): Promise<UserDoc | null> {
        return User.findById(id);
    }
}

export { UserRepository };