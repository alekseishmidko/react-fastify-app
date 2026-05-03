import { FastifyPluginAsync } from "fastify";

import {
    createEventBodySchema,
    errorResponseSchema,
    eventParamsSchema,
    eventParticipantSchema,
    eventSchema,
    updateEventBodySchema,
    validationErrorResponseSchema,
} from "../swagger/docs.schemas";
import { sendServiceError } from "../service-error";
import { createEventSchema, updateEventSchema } from "./events.schema";
import { EventsService } from "./events.service";

type EventParams = { id: string }

export const eventsRoutes: FastifyPluginAsync = async (app) => {
    const eventsService = new EventsService(app.db);

    app.post('/', {
        preHandler: [app.authenticate],
        schema: {
            tags: ['Events'],
            summary: 'Create an event',
            security: [{ bearerAuth: [] }],
            body: createEventBodySchema,
            response: {
                201: eventSchema,
                400: validationErrorResponseSchema,
                401: errorResponseSchema,
            },
        },
    } , async (request, reply) => {
        const parsedBody = createEventSchema.safeParse(request.body);

        if (!parsedBody.success) {
            return reply.code(400).send({
                message: 'Validation Error',
                errors: parsedBody.error.issues.map(issue => ({
                    path: issue.path.join("."),
                    message: issue.message
                }))
            })
        }

        const event = await eventsService.createEvent(parsedBody.data, request.user.sub);
        return reply.code(201).send(event);
    })

    app.get('/', {
        preHandler: [app.authenticate],
        schema: {
            tags: ['Events'],
            summary: 'List events',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    type: 'array',
                    items: eventSchema,
                },
                401: errorResponseSchema,
            },
        },
    }, async () => {
        return eventsService.listEvents();
    })

    app.get<{ Params: EventParams }>('/:id',
        {
            preHandler: [app.authenticate],
            schema: {
                tags: ['Events'],
                summary: 'Get an event',
                security: [{ bearerAuth: [] }],
                params: eventParamsSchema,
                response: {
                    200: eventSchema,
                    401: errorResponseSchema,
                    404: errorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const event = await eventsService.getEventById(request.params.id);
                return reply.send(event);
            } catch (error) {
                return sendServiceError(reply, error);
            }
        })

    app.patch<{ Params: EventParams }>(
        '/:id',
        {
            preHandler: [app.authenticate],
            schema: {
                tags: ['Events'],
                summary: 'Update an event',
                security: [{ bearerAuth: [] }],
                params: eventParamsSchema,
                body: updateEventBodySchema,
                response: {
                    200: eventSchema,
                    400: validationErrorResponseSchema,
                    401: errorResponseSchema,
                    403: errorResponseSchema,
                    404: errorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            const parsedBody = updateEventSchema.safeParse(request.body);

            if(!parsedBody.success) {
                return reply.code(400).send({
                    message: 'Validation error',
                    errors: parsedBody.error.issues.map(issue => ({
                        path: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }

            try {
                const event = await eventsService.updateEvent(request.params.id, request.user.sub, parsedBody.data);
                return reply.send(event);
            } catch (error) {
                return sendServiceError(reply, error);
            }
        })

    app.delete<{ Params: EventParams }>(
        '/:id',
        {
            preHandler: [app.authenticate],
            schema: {
                tags: ['Events'],
                summary: 'Delete an event',
                security: [{ bearerAuth: [] }],
                params: eventParamsSchema,
                response: {
                    204: {
                        type: 'null',
                        description: 'Event deleted',
                    },
                    401: errorResponseSchema,
                    403: errorResponseSchema,
                    404: errorResponseSchema,
                },
            },
        }, async (request, reply) => {
            try {
                await eventsService.deleteEvent(request.params.id, request.user.sub);
                return reply.code(204).send();
            } catch (error) {
                return sendServiceError(reply, error);
            }
        })

    app.post<{ Params: EventParams }>(
        '/:id/join',
        {
            preHandler: [app.authenticate],
            schema: {
                tags: ['Events'],
                summary: 'Join an event',
                security: [{ bearerAuth: [] }],
                params: eventParamsSchema,
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            participation: eventParticipantSchema,
                        },
                        required: ['message', 'participation'],
                    },
                    400: errorResponseSchema,
                    401: errorResponseSchema,
                    404: errorResponseSchema,
                    409: errorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const participation = await eventsService.joinEvent(request.params.id, request.user.sub);
                return reply.code(201).send({
                    message: "Вы присоединились к событию",
                    participation,
                })
            } catch (error) {
                return sendServiceError(reply, error);
            }
        }
    )

    app.delete<{ Params: EventParams }>(
        '/:id/join',
        {
            preHandler: [app.authenticate],
            schema: {
                tags: ['Events'],
                summary: 'Leave an event',
                security: [{ bearerAuth: [] }],
                params: eventParamsSchema,
                response: {
                    204: {
                        type: 'null',
                        description: 'Participation deleted',
                    },
                    401: errorResponseSchema,
                    404: errorResponseSchema,
                    409: errorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                await eventsService.leaveEvent(request.params.id, request.user.sub);
                return reply.code(204).send();
            } catch (error) {
                return sendServiceError(reply, error);
            }
        }
    )
}
