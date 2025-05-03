import { DataSource } from "typeorm";
import {Company} from './model/Company'

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
    entities: [Company],
    subscribers: [],
    migrations: [],
})
