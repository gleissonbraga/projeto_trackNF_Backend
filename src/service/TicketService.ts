import {Repository} from 'typeorm'
import { Ticket } from '../model/Ticket'
import { toZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'

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

    async ticketsPending(cnpj: string) {
        const today = new Date()
        const fuso = 'America/Sao_Paulo';
        const zonedDate = toZonedTime(today, fuso);
        const todayFormarted = format(zonedDate, "yyyy-MM-dd 00:00:00.000")

        const status = 'PENDENTE'

        const tickets = await this.repository
            .createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.nf_received', 'nf')
            .leftJoinAndSelect('nf.supplier', 'supplier')
            .leftJoinAndSelect('nf.users', 'users')
            .leftJoinAndSelect('supplier.company', 'company')
            .where('company.cnpj = :cnpj', { cnpj: cnpj })
            .andWhere('ticket.status = :status', {status: status})
            .andWhere('ticket.due_date >= :todayFormarted', { todayFormarted })
            .orderBy('ticket.due_date', 'ASC')
            .getMany()
        
        return tickets
    }




}