import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NfReceived } from "./NfReceived";

// TABLE ticket
// id_ticket
// id_nf
// ticket_value
// due_date
// date_now


@Entity()
export class Ticket{
    @PrimaryGeneratedColumn("uuid")
    id_ticket?: string
    @ManyToOne(() => NfReceived, (nf_received) => nf_received.ticket)
    nf_received?: NfReceived
    @Column()
    ticket_value?: number
    @Column()
    due_date?: string
    @Column("timestamp")
    date_now?: Date
}