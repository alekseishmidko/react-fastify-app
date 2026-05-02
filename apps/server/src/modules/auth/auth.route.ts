import { FastifyPluginAsync } from "fastify";

import { User } from "../../db/entities";
import { loginSchema, registerSchema } from "./auth.schema";
import argon2 from "argon2";

export const authRoutes: FastifyPluginAsync = async (app) => {
    const userRepository = app.db.getRepository(User);

    app.post('/register', async (request, reply) => {
        const parseBody = registerSchema.safeParse(request.body);

        if (!parseBody.success) {
            return reply.code(400).send({
                message: 'Validation error',
                errors: parseBody.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }

        const { email, password, name} = parseBody.data;
        const existingUser = await userRepository.findOne({ where: { email } })

        if (existingUser) {
            return reply.code(409).send({ message: 'Пользователь с таким email уже есть' })
        }

        const passwordHash = await argon2.hash(password);
        const user = userRepository.create({
            email,
            passwordHash,
            name
        })

        const saveduser = await userRepository.save(user);
        const token = await reply.jwtSign({ sub: saveduser.id, email: saveduser.email})

        return reply.code(201).send({
            token,
            user: {
                id: saveduser.id,
                email: saveduser.email,
                name: saveduser.name
            }
        })
    })

    app.post('/login', async (request, reply) => {
        const parseBody = loginSchema.safeParse(request.body);

        if (!parseBody.success) {
            return reply.code(400).send({
                message: 'Validation errror',
                errors: parseBody.error.issues.map(issue => ({
                    path: issue.path.join('.'),
                    message: issue.message
                }))
            })
        }

        const { email, password } = parseBody.data
        const user = await userRepository.findOne({ where: { email} })

        if (!user) {
            return reply.code(401).send({ message: 'Неверные логин или пароль'})
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, password)

        if (!isPasswordValid) {
            return reply.code(401).send({ message: 'Неверные логин или пароль'})
        }

        const token = await reply.jwtSign({ sub: user.id, email: user.email});

        return reply.send({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        })
    })

    app.get('/me', { preHandler: [app.authenticate] } , async (request, reply) => {
        const userId = request.user.sub
        const user = await userRepository.findOne({  where: { id: userId }})

        if (!user) {
            return reply.code(404).send({ message: 'Пользователь не найден'})
        }

        return reply.send({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    })

}