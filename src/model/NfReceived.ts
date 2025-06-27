import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./Ticket";
import { Supplier } from "./Supplier";
import { Users } from "./User";

export enum TypeNF {
  BONIFICACAO = "BONIFICAÇÃO",
  VENDA = "VENDA",
  TROCA = "TROCA",
  DESPESA = "DESPESA",
  PIX = "PIX"
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
    id_nf?: string
    @ManyToOne(() => Supplier, (supplier) => supplier.nf_received)
    supplier?: Supplier
    @Column()
    nf_value?: number
    @OneToMany(() => Ticket, (ticket) => ticket.nf_received, { cascade: true })
    tickets?: Ticket[];
    @Column({type: "enum", enum: TypeNF})
    type_nf?: TypeNF
    @ManyToOne(() => Users, (users) => users.nf_received)
    users?: Users
    @Column({type: "enum", enum: StatusNF})
    status?: StatusNF
    @Column("timestamp")
    date_now?: Date
}