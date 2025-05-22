import {Repository} from 'typeorm'
import { httpError } from '../errors/HttpError'
import { AppDataSource } from '../data-source'
import { Ticket } from '../model/Ticket'

// @Entity()
// export class Ticket{
//     @PrimaryGeneratedColumn("uuid")
//     id_ticket?: string
//     @ManyToOne(() => NfReceived, (nf_received) => nf_received.ticket)
//     nf_received?: NfReceived
//     @Column()
//     ticket_value?: number
//     @Column()
//     due_date?: string
//     @Column("timestamp")
//     date_now?: Date
// }

export class TicketService {
    private repository: Repository<Ticket>

    constructor(repository: Repository<Ticket>){
        this.repository = repository
    }


    async creatTicket(ticket: Ticket): Promise<Ticket>{
        
        const newDate = new Date()
        ticket.date_now = newDate
        return await this.repository.save(ticket)
    }
}