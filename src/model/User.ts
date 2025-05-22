import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";
import { NfReceived } from "./NfReceived";

@Entity()
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id_user?: string
    @Column()
    name?: string
    @Column()
    cpf?: string
    @Column()
    email?: string
    @Column()
    password?: string
    @Column("timestamp")
    date_now?: Date
    @ManyToOne(()=> Company, (company) => company.users)
    company?: Company
    @OneToOne(() => NfReceived, (nf_received) => nf_received.users)
    nf_received?: NfReceived
  }