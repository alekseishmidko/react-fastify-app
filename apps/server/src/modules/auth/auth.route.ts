import { FastifyPluginAsync } from "fastify";

import {
    authResponseSchema,
    errorResponseSchema,
    userSchema,
    validationErrorResponseSchema,
} from "../swagger/docs.schemas";
import { sendServiceError } from "../service-error";
import { AuthService } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.schema";

export const authRoutes: FastifyPluginAsync = async (app) => {
    const authService = new AuthService(app.db);

    app.post('/register', {
        schema: {
            tags: ['Auth'],
            summary: 'Register a user',
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    name: { type: 'string', minLength: 2, maxLength: 100 },
                },
                required: ['email', 'password', 'name'],
            },
            response: {
                201: authResponseSchema,
                400: validationErrorResponseSchema,
                409: errorResponseSchema,
            },
        },
    }, async (request, reply) => {
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

        try {
            const user = await authService.register(parseBody.data);
            const token = await reply.jwtSign({ sub: user.id, email: user.email });

            return reply.code(201).send({ token, user });
        } catch (error) {
            return sendServiceError(reply, error);
        }
    })

    app.post('/login', {
        schema: {
            tags: ['Auth'],
            summary: 'Login',
            body: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 1 },
                },
                required: ['email', 'password'],
            },
            response: {
                200: authResponseSchema,
                400: validationErrorResponseSchema,
                401: errorResponseSchema,
            },
        },
    }, async (request, reply) => {
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

        try {
            const user = await authService.login(parseBody.data);
            const token = await reply.jwtSign({ sub: user.id, email: user.email });

            return reply.send({ token, user });
        } catch (error) {
            return sendServiceError(reply, error);
        }
    })

    app.get('/me', {
        preHandler: [app.authenticate],
        schema: {
            tags: ['Auth'],
            summary: 'Get current user',
            security: [{ bearerAuth: [] }],
            response: {
                200: userSchema,
                401: errorResponseSchema,
                404: errorResponseSchema,
            },
        },
    }, async (request, reply) => {
        try {
            const user = await authService.getCurrentUser(request.user.sub);
            return reply.send(user);
        } catch (error) {
            return sendServiceError(reply, error);
        }
    })
}
