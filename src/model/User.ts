// import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Company } from "./Company";

// @Entity()
// export class User {
//     @PrimaryGeneratedColumn("uuid")
//     id_user?: number
//     @Column()
//     name?: string
//     @Column()
//     cpf?: string
//     @Column()
//     email?: string
//     @Column()
//     password?: string
//     @ManyToOne(()=> Company, (company) => company.users)
//     company?: Company
//     @CreateDateColumn({name: 'date_now'})
//     date_now?: Date
//   }