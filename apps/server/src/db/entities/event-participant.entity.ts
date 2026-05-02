import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";
import { User } from "./user.entity";



@Entity('event_participants')
@Index('UQ_EVENT_PARTICIPANTS_EVENT_USER', ['eventId', 'userId'], { unique: true})
export class EventParticipant {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ManyToOne(() => Event, (event) => event.participants, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'eventId'})
    event!: Event

    @Column({ type: 'uuid'})
    eventId!: string

    @ManyToOne(() => User, (user) => user.eventParticipations, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'userId'})
    user!: User

    @Column({ type: 'uuid'})
    userId!: string

    @CreateDateColumn({ type: 'timestamptz'})
    joinedAt!: Date
}
