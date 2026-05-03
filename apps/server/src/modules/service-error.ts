import type { FastifyReply } from "fastify";

export class ServiceError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
    ) {
        super(message);
    }
}

export const toErrorResponse = (error: unknown) => {
    if (error instanceof ServiceError) {
        return {
            statusCode: error.statusCode,
            body: { message: error.message },
        };
    }

    throw error;
};

export const sendServiceError = (reply: FastifyReply, error: unknown) => {
    const { statusCode, body } = toErrorResponse(error);
    return reply.code(statusCode as any).send(body as any);
};
