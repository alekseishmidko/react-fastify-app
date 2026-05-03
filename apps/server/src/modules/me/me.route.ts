import { FastifyPluginAsync } from "fastify";

import { errorResponseSchema, eventSchema } from "../swagger/docs.schemas";
import { MeService } from "./me.service";

export const meRoutes: FastifyPluginAsync = async (app) => {
    const meService = new MeService(app.db);

    app.get('/events/joined',
        {
            preHandler: [app.authenticate],
            schema: {
                tags: ['Me'],
                summary: 'List joined events',
                security: [{ bearerAuth: [] }],
                response: {
                    200: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                joinedAt: { type: 'string', format: 'date-time' },
                                event: eventSchema,
                            },
                            required: ['joinedAt', 'event'],
                        },
                    },
                    401: errorResponseSchema,
                },
            },
        },
        async (request) => {
            return meService.listJoinedEvents(request.user.sub);
        }
    )
}
