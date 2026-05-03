export const errorResponseSchema = {
    type: "object",
    properties: {
        message: { type: "string" },
    },
    required: ["message"],
} as const;

export const validationErrorResponseSchema = {
    type: "object",
    properties: {
        message: { type: "string" },
        errors: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    path: { type: "string" },
                    message: { type: "string" },
                },
                required: ["path", "message"],
            },
        },
    },
    required: ["message", "errors"],
} as const;

export const userPublicSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        email: { type: "string", format: "email" },
        name: { type: "string" },
    },
    required: ["id", "email", "name"],
} as const;

export const userSchema = {
    type: "object",
    properties: {
        ...userPublicSchema.properties,
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "email", "name", "createdAt", "updatedAt"],
} as const;

export const authResponseSchema = {
    type: "object",
    properties: {
        token: { type: "string" },
        user: userPublicSchema,
    },
    required: ["token", "user"],
} as const;

export const eventSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        title: { type: "string" },
        description: { type: "string" },
        capacity: { type: "integer", minimum: 1 },
        address: { type: "string" },
        startedAt: { type: "string", format: "date-time" },
        ownerId: { type: "string", format: "uuid" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "title", "description", "capacity", "address", "startedAt", "ownerId", "createdAt", "updatedAt"],
} as const;

export const eventParticipantSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
        eventId: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        joinedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "eventId", "userId", "joinedAt"],
} as const;

export const eventParamsSchema = {
    type: "object",
    properties: {
        id: { type: "string", format: "uuid" },
    },
    required: ["id"],
} as const;

export const createEventBodySchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 1, maxLength: 200 },
        description: { type: "string", minLength: 1 },
        capacity: { type: "integer", minimum: 1 },
        address: { type: "string", minLength: 1, maxLength: 255 },
        startedAt: { type: "string", format: "date-time" },
    },
    required: ["title", "description", "capacity", "address", "startedAt"],
} as const;

export const updateEventBodySchema = {
    type: "object",
    properties: createEventBodySchema.properties,
    minProperties: 1,
} as const;
