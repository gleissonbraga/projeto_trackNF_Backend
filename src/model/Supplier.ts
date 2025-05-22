import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";
import { NfReceived } from "./NfReceived";


@Entity()
export class Supplier {
    @PrimaryGeneratedColumn("uuid")
    id_supplier?: string
    @Column()
    fantasy_name?: string
    @Column()
    reason_name?: string
    @Column()
    cnpj?: string
    @Column()
    state_registration?: string
    @Column()
    email?: string
    @Column()
    phone_number?: string
    @Column("timestamp")
    date_now?: Date
    @ManyToOne(()=> Company, (company) => company.supplier)
    company?: Company
    @OneToOne(()=> NfReceived, (nf_received) => nf_received.supplier)
    nf_received?: NfReceived
}