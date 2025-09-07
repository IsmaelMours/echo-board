// Path: server/src/services/users/UserService.ts

import { UserRepository } from '../../repositories/UserRepository';
import { Password } from '../../utilities/password';
import { UserDoc } from '../../models/user';

class UserService {
    static async signup(email: string, password?: string, name?: string, avatar?: string, role?: string): Promise<UserDoc> {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email in use');
        }
        const user = await UserRepository.create({ email, password, name, avatar, role });
        return user;
    }

    static async signin(email: string, password: string): Promise<UserDoc> {
        const existingUser = await UserRepository.findByEmail(email);
        if (!existingUser || !existingUser.password) {
            throw new Error('Invalid credentials');
        }
        if (existingUser.password === undefined) {
            throw new Error('Invalid credentials');
        }
        const passwordsMatch = await Password.compare(existingUser.password, password as string);
        if (!passwordsMatch) {
            throw new Error('Invalid credentials');
        }
        return existingUser;
    }

    static async signout() {
        // Signout logic (e.g., clear session/cookie)
    }

    static async getCurrentUser(id: string): Promise<UserDoc | null> {
        return UserRepository.findById(id);
    }
}

export { UserService };