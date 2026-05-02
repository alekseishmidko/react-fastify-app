import 'dotenv/config';
import { DataSource } from "typeorm";
import type { FastifyInstance } from "fastify";

import { EventParticipant } from "./entities/event-participant.entity";
import { Event } from "./entities/event.entity";
import { User } from "./entities/user.entity";

export const createAppDataSource = (databaseUrl: string) => {
    return new DataSource({
        type: 'postgres',
        url: databaseUrl,
        synchronize: true,
        logging: true,
        migrationsRun: true,
        entities: [User, EventParticipant, Event],
        migrations: ['src/db/migrations/**/*.ts'],
        subscribers: []
    })
}

export const AppDataSource = createAppDataSource(process.env.DATABASE_URL ?? '');

export const appDataSourceForFastify = (app: FastifyInstance) => createAppDataSource(app.config.DATABASE_URL);
