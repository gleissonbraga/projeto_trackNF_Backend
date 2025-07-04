import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NfReceived } from "./NfReceived";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id_ticket?: string;
  @ManyToOne(() => NfReceived, (nf_received) => nf_received.tickets, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "nf_received_id" })
  nf_received?: NfReceived;
  @Column()
  ticket_value?: number;
  @Column()
  due_date?: string;
  @Column({ type: "varchar", nullable: true })
  status?: string;
  @Column("timestamp")
  date_now?: Date;
}
