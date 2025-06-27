import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./User";
import { Supplier } from "./Supplier";
import { NfReceived } from "./NfReceived";


@Entity()
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id_company?: string
    @Column()
    fantasy_name?: string
    @Column()
    reason_name?: string
    @Column()
    cnpj?: string
    @Column()
    state_registration?: string
    @Column("timestamp")
    date_now?: Date
    @OneToMany(() => Users, (user) => user.company)
    users?: Users[]; 
    @OneToMany(() => Supplier, (supplier) => supplier.company)
    supplier?: Supplier[];
}