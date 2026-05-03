import fastify from "fastify";
import fastiJwt from "@fastify/jwt";
import cors from '@fastify/cors'
import type { DataSource } from "typeorm";
import 'dotenv/config';
import 'reflect-metadata';
import {  envSchema} from "../config";
import { appDataSourceForFastify } from "./db/data-source";

import fastifyEnv from "@fastify/env";
import {authRoutes} from "./modules/auth/auth.route";
import {meRoutes} from "./modules/me/me.route";
import {eventsRoutes} from "./modules/events/events.route";
import { registerSwagger } from "./swagger";

const app = fastify({ logger: true });
  app.register(fastifyEnv, {
    confKey: 'config',
    schema: envSchema,
    dotenv: true,
});
app.decorate('authenticate', async function authenticate(request, reply) {
    try {
        await request.jwtVerify()
    } catch (error) {
        reply.code(401).send({ message: 'Unauthorized'})
    }
})

const getDatabaseConnectionErrorMessage = (error: unknown) => {
    if (!(error instanceof Error)) {
        return 'Database connection failed';
    }

    const databaseError = error as Error & { code?: string };

    if (databaseError.code === '3D000') {
        return 'Database does not exist. Run: pnpm --filter @app/server db:create';
    }

    if (databaseError.code === '28P01') {
        return 'Invalid database username or password. Check DATABASE_URL.';
    }

    if ('code' in databaseError && ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(String(databaseError.code))) {
        return 'Cannot connect to database. Check that PostgreSQL is running and DATABASE_URL is correct.';
    }

    return 'Database connection failed';
}

const start = async () => {
    let dataSource: DataSource | undefined;

    try {


        await app.register(cors, {
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        })

        await app.register(fastiJwt, {
            secret: app.config.JWT_SECRET,
        });

        await registerSwagger(app);


        dataSource = appDataSourceForFastify(app)
        const db = await dataSource.initialize();
        app.log.info('Database connected')
        app.decorate('db', db);

        await app.register(authRoutes, { prefix: '/auth' })
        await app.register(meRoutes, { prefix: '/me' })
        await app.register(eventsRoutes, { prefix: '/events' })
        await app.listen({
            port: app.config.PORT,
            host: app.config.HOST,
        });
        app.log.info(`Server running on PORT http://${app.config.HOST}:${app.config.PORT}/docs`)
    } catch (error) {
        if (dataSource?.isInitialized) {
            await dataSource.destroy();
        }

        app.log.error({ err: error }, getDatabaseConnectionErrorMessage(error));
        process.exit(1)
    }
}

start()
