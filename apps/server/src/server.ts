import fastify from "fastify";
import fastiJwt from "@fastify/jwt";
import cors from '@fastify/cors'
import 'dotenv/config';
import 'reflect-metadata';
import {  envSchema} from "../config";
import { appDataSourceForFastify } from "./db/data-source";

import fastifyEnv from "@fastify/env";
import {authRoutes} from "./modules/auth/auth.route";
import {meRoutes} from "./modules/me/me.route";
import {eventsRoutes} from "./modules/events/events.route";

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

const start = async () => {
    try {


        await app.register(cors, {
            origin: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        })

        await app.register(fastiJwt, {
            secret: app.config.JWT_SECRET,
        });




        const dataSource = appDataSourceForFastify(app)
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
        app.log.info(`Server running on PORT ${app.config.PORT}`)
    } catch (error) {
        // if (AppDataSource.isInitialized){
        //     await AppDataSource.destroy()
        // }
        app.log.error(error);
        process.exit(1)
    }
}

start()
