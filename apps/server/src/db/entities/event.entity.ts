import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { EventParticipant } from "./event-participant.entity";

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'varchar', length: 200 })
    title!: string

    @Column({ type: 'text'})
    description!: string

    @Column({ type: 'int'})
    capacity!: number

    @Column({ type: 'varchar', length: 255 })
    address!: string

    @Column({ type: 'timestamptz'})
    startedAt!: Date

    @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId'})
    owner!: User

    @Column({ type: "uuid"})
    ownerId!: string

    @OneToMany(() => EventParticipant, (participant) => participant.event)
    participants!: EventParticipant[]

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date

    @CreateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date
}