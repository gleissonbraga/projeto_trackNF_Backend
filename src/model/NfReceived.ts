import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./Ticket";
import { Supplier } from "./Supplier";
import { Users } from "./User";

// TABLE nf_received
// id_nf_received
// id_nf
// id_supplier (name)
// nf_value
// id_ticket
// type_nf (BONIFICAÇÃO | VENDA | TROCA)
// id_user
// status (RECEBIDA | RETIDA | DEVOLVIDA) 
// date_now

export enum TypeNF {
  BONIFICACAO = "BONIFICAÇÃO",
  VENDA = "VENDA",
  TROCA = "TROCA",
  DESPESA = "DESPESA"
}

export enum StatusNF {
  RECEBIDA = "RECEBIDA",
  RETIDA = "RETIDA",
  DEVOLVIDA = "DEVOLVIDA",
}

@Entity()
export class NfReceived {
    @PrimaryGeneratedColumn("uuid")
    id_nf_received?: string
    @Column()
    id_nf?: number
    @OneToOne(() => Supplier, (supplier) => supplier.nf_received)
    supplier?: Supplier
    @Column()
    nf_value?: number
    @OneToMany(() => Ticket, (ticket) => ticket.nf_received)
    ticket?: Ticket[]
    @Column({type: "enum", enum: TypeNF})
    type_nf?: TypeNF
    @OneToOne(() => Users, (users) => users.nf_received)
    users?: Users
    @Column({type: "enum", enum: StatusNF})
    status?: StatusNF
    @Column("timestamp")
    date_now?: Date
}