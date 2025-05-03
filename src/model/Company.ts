import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./User";


@Entity()
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id_company?: number
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
    // @OneToMany(() => User, (user) => user.company)
    // users?: User[]; 
}