import '@fastify/jwt'
import 'fastify'
import { FastifyReply, FastifyRequest } from 'fastify'
import type { DataSource } from 'typeorm'
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
        // modules
        db: DataSource
        config: {
            NODE_ENV: string;
            HOST: string;
            PORT: number;
            DATABASE_URL: string;
            JWT_SECRET: string;
        }


    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { sub: string; email: string};
        user: { sub: string; email: string}
    }
}