import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company";

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
  }