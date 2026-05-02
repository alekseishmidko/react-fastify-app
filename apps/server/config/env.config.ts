export const envSchema = {
    type: 'object',
    required: ['DATABASE_URL', 'JWT_SECRET'],
    properties: {
        NODE_ENV: {
            type: 'string',
            default: 'development',
        },
        HOST: {
            type: 'string',
            default: '0.0.0.0',
        },
        PORT: {
            type: 'number',
            default: 3000,
        },
        DATABASE_URL: {
            type: 'string',
            minLength: 1,
        },
        JWT_SECRET: {
            type: 'string',
            minLength: 1,
        },
    },
} as const;