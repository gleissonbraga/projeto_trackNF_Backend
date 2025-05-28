import {Repository} from 'typeorm'
import { Ticket } from '../model/Ticket'

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