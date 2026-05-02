import { FastifyPluginAsync } from "fastify";

import { EventParticipant } from "../../db/entities";


export const meRoutes: FastifyPluginAsync = async (app) => {
    const participantsRepository = app.db.getRepository(EventParticipant)

    app.get('/events/joined',
        { preHandler: [app.authenticate]} ,
        async (request, reply) => {
            const participation = await participantsRepository.find({
                where: { userId: request.user.sub },
                relations: ['event'],
                order: {
                    joinedAt: 'DESC'
                }
            })

            return participation.map(participation => ({
                joinedAt: participation.joinedAt,
                event: participation.event
            }))
        }
    )
}