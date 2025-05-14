import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";


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
    @ManyToOne(()=> Company, (company) => company.suplier)
    company?: Company
}


// TABLE supplier
// id_supplier
// fantasy_name
// name_reason
// state_registration
// email
// phone_number
// date_now