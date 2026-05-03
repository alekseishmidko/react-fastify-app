import type { DataSource } from "typeorm";

import { Event as EventEntity } from "../../db/entities/event.entity";
import { EventParticipant } from "../../db/entities/event-participant.entity";
import type { CreateEventInput, UpdateEventInput } from "./events.schema";
import { ServiceError } from "../service-error";

export class EventsService {
    private readonly eventRepository;
    private readonly participantsRepository;

    constructor(db: DataSource) {
        this.eventRepository = db.getRepository(EventEntity);
        this.participantsRepository = db.getRepository(EventParticipant);
    }

    async createEvent(input: CreateEventInput, ownerId: string) {
        const event = this.eventRepository.create({
            ...input,
            ownerId,
        });

        return this.eventRepository.save(event);
    }

    async listEvents() {
        return this.eventRepository.find({
            order: { startedAt: 'ASC' },
        });
    }

    async getEventById(id: string) {
        const event = await this.eventRepository.findOne({ where: { id } });

        if (!event) {
            throw new ServiceError(404, 'Событие не найдо');
        }

        return event;
    }

    async updateEvent(id: string, userId: string, input: UpdateEventInput) {
        const event = await this.getEventById(id);

        if (event.ownerId !== userId) {
            throw new ServiceError(403, 'Только владелец может редактировать');
        }

        Object.assign(event, input);

        return this.eventRepository.save(event);
    }

    async deleteEvent(id: string, userId: string) {
        const event = await this.getEventById(id);

        if (event.ownerId !== userId) {
            throw new ServiceError(403, 'Только владелец может удалить свое событие');
        }

        await this.eventRepository.delete({ id: event.id });
    }

    async joinEvent(id: string, userId: string) {
        const event = await this.getEventById(id);

        if (event.ownerId === userId) {
            throw new ServiceError(400, 'Нельзя присоединиться к своему событию');
        }

        const existingParticipation = await this.participantsRepository.findOne({
            where: { eventId: event.id, userId },
        });

        if (existingParticipation) {
            throw new ServiceError(409, 'Вы уже присоединились к событию');
        }

        const participationCount = await this.participantsRepository.count({
            where: { eventId: event.id },
        });

        if (participationCount >= event.capacity) {
            throw new ServiceError(409, 'Свободных мест нету');
        }

        const participation = this.participantsRepository.create({
            eventId: event.id,
            userId,
        });

        return this.participantsRepository.save(participation);
    }

    async leaveEvent(id: string, userId: string) {
        const event = await this.getEventById(id);
        const existingParticipation = await this.participantsRepository.findOne({
            where: { eventId: event.id, userId },
        });

        if (!existingParticipation) {
            throw new ServiceError(409, 'Вы уже присоединились к событию');
        }

        await this.participantsRepository.delete({
            id: existingParticipation.id,
        });
    }
}
