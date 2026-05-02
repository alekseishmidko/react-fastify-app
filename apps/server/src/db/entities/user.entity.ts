import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";
import { EventParticipant } from "./event-participant.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email!:string

    @Column({ type: 'varchar', length: 255 })
    passwordHash!: string

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @OneToMany(() => Event, (event) => event.owner)
    events!: Event

    @OneToMany(() => EventParticipant, (participant) => participant.user)
    eventParticipations!: EventParticipant[]

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date

    @CreateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date
}