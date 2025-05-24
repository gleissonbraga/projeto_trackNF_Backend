import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NfReceived } from "./NfReceived";

@Entity()
export class Ticket{
    @PrimaryGeneratedColumn("uuid")
    id_ticket?: string
    @ManyToOne(() => NfReceived, (nf_received) => nf_received.tickets)
    nf_received?: NfReceived
    @Column()
    ticket_value?: number
    @Column()
    due_date?: string
    @Column("timestamp")
    date_now?: Date
}