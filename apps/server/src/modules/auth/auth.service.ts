import argon2 from "argon2";
import type { DataSource } from "typeorm";

import { User } from "../../db/entities/user.entity";
import type { LoginInput, RegisterInput } from "./auth.schema";
import { ServiceError } from "../service-error";

export class AuthService {
    private readonly userRepository;

    constructor(db: DataSource) {
        this.userRepository = db.getRepository(User);
    }

    async register(input: RegisterInput) {
        const existingUser = await this.userRepository.findOne({ where: { email: input.email } });

        if (existingUser) {
            throw new ServiceError(409, 'Пользователь с таким email уже есть');
        }

        const passwordHash = await argon2.hash(input.password);
        const user = this.userRepository.create({
            email: input.email,
            passwordHash,
            name: input.name,
        });

        const savedUser = await this.userRepository.save(user);

        return {
            id: savedUser.id,
            email: savedUser.email,
            name: savedUser.name,
        };
    }

    async login(input: LoginInput) {
        const user = await this.userRepository.findOne({ where: { email: input.email } });

        if (!user) {
            throw new ServiceError(401, 'Неверные логин или пароль');
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, input.password);

        if (!isPasswordValid) {
            throw new ServiceError(401, 'Неверные логин или пароль');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new ServiceError(404, 'Пользователь не найден');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
