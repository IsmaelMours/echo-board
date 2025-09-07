// Path: server/src/controllers/UserController.ts

import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { UserService } from '../services/users/UserService';
import { UserRoles } from '../../common/build/index';
import { QueueService } from '../services/queue/QueueService';
import jwt from 'jsonwebtoken';

class UserController {
    static async signup(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }

        const { email, password, name, avatar, role } = req.body;
        try {
            const user = await UserService.signup(email, password, name, avatar, role || UserRoles.User);
            
            // Generate JWT
            const userJwt = jwt.sign(
                {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_KEY!,
            );
            
            req.session = { jwt: userJwt };
            
            // Queue welcome email
            try {
                const queueService = QueueService.getInstance();
                await queueService.sendWelcomeEmail(user.email, user.name);
            } catch (emailError) {
                console.error("Failed to queue welcome email:", emailError);
                // Don't fail the request if email queuing fails
            }
            
            // Return clean user data without Mongoose metadata
            const cleanUser = {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar
            };
            
            res.status(201).send({
                message: 'User created successfully',
                user: cleanUser,
                redirectToLogin: true
            });
        } catch (err: any) {
            throw new BadRequestError(err.message);
        }
    }

    static async signin(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new BadRequestError(errors.array()[0].msg);
        }

        const { email, password } = req.body;
        if (typeof password !== 'string') {
            throw new BadRequestError('Password must be a string');
        }
        try {
            const user = await UserService.signin(email, password);
            
            // Generate JWT
            const userJwt = jwt.sign(
                {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                },
                process.env.JWT_KEY!,
            );
            
            req.session = { jwt: userJwt };
            
            // Return clean user data without Mongoose metadata
            const cleanUser = {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar
            };
            
            res.status(200).send({
                message: 'Login successful',
                user: cleanUser,
                redirectToLogin: false
            });
        } catch (err: any) {
            throw new BadRequestError(err.message);
        }
    }

    static signout(req: Request, res: Response) {
        req.session = null;
        res.send({});
    }

    static async currentUser(req: Request, res: Response) {
        if (!req.session?.jwt) {
            return res.send({ currentUser: null });
        }
        try {
            const user = await UserService.getCurrentUser(req.session.jwt);
            res.send({ currentUser: user });
        } catch (err) {
            res.send({ currentUser: null });
        }
    }
}

export { UserController };