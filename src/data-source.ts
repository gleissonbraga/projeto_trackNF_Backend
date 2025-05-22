import { DataSource } from "typeorm";
import {Company} from './model/Company'
import { Users } from "./model/User";
import { Supplier } from "./model/Supplier";
import { NfReceived } from "./model/NfReceived";
import { Ticket } from "./model/Ticket";

export const AppDataSource = new DataSource({
    type: "postgres",    
    host: "localhost",
    port: 5050,
    username: "postgres",
    password: "postgres",
    database: "trackNF",
    synchronize: true,
    logging: true,
    // dropSchema: true, //adicionar se quiser limpar o banco
    entities: [Company, Users, Supplier, NfReceived, Ticket],
    subscribers: [],
    migrations: [],
})
