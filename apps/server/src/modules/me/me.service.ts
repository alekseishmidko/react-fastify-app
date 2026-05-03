import type { DataSource } from "typeorm";

import { EventParticipant } from "../../db/entities/event-participant.entity";

export class MeService {
    private readonly participantsRepository;

    constructor(db: DataSource) {
        this.participantsRepository = db.getRepository(EventParticipant);
    }

    async listJoinedEvents(userId: string) {
        const participation = await this.participantsRepository.find({
            where: { userId },
            relations: ['event'],
            order: {
                joinedAt: 'DESC',
            },
        });

        return participation.map((participation) => ({
            joinedAt: participation.joinedAt,
            event: participation.event,
        }));
    }
}
