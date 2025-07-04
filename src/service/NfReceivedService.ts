import {Repository} from 'typeorm'
import { NfReceived } from '../model/NfReceived'
import { httpError } from '../errors/HttpError'
import { AppDataSource } from '../data-source'
import { Users } from '../model/User'
import { Supplier } from '../model/Supplier'
import { toZonedTime, format } from 'date-fns-tz';




export class NfReceivedService {
    private repository: Repository<NfReceived>

    constructor(repository: Repository<NfReceived>) {
        this.repository = repository
    }


    async insert(nf: NfReceived, id_supplier: string, id_user: string) {
        if (!nf.nf_value || !nf.type_nf || !nf.status) {
            throw new httpError(400, 'Todos os campos obrigatórios da nota fiscal devem ser preenchidos, incluindo ao menos um ticket.')
        }

        const supplierRepository = AppDataSource.getRepository(Supplier)
        const userRepository = AppDataSource.getRepository(Users)


        const user = await userRepository.findOneBy({id_user: id_user})
        const supplier = await supplierRepository.findOneBy({id_supplier: id_supplier})

        if(!user || user == null){
            throw new httpError(400, `Usuário não encontrado`)
        }

        if(!supplier || supplier == null){
            throw new httpError(400, `Fornecedor não encontrado`)
        }

        const newDate = new Date()

        nf.supplier = supplier
        nf.users = user
        nf.date_now = newDate
        
        if(nf.tickets == null){
            return null
        } else {
            nf.tickets = nf.tickets.map(ticket => {
            ticket.date_now = newDate
            ticket.status = ticket.status
            return ticket
            })
        }
        return await this.repository.save(nf)
    }

    async update(nf: NfReceived, id_nf_received: string, id_supplier: string, id_user: string): Promise<NfReceived> {
        if (!nf.nf_value || !nf.type_nf || !nf.status) {
            throw new httpError(400, 'Todos os campos obrigatórios da nota fiscal devem ser preenchidos, incluindo ao menos um ticket.')
        }

        
        const supplierRepository = AppDataSource.getRepository(Supplier)
        const userRepository = AppDataSource.getRepository(Users)

        const nfUpdate = await this.repository.findOneBy({id_nf_received: id_nf_received})
        const user = await userRepository.findOneBy({id_user: id_user})
        const supplier = await supplierRepository.findOneBy({id_supplier: id_supplier})

        
        if(!user || user == null){
            throw new httpError(400, `Usuário não encontrado`)
        }

        if(!supplier || supplier == null){
            throw new httpError(400, `Fornecedor não encontrado`)
        }

        if(nfUpdate == null) {
            throw new httpError(400, "Nota fiscal não encontrada")
        }



        nfUpdate.id_nf = nf.id_nf
        nfUpdate.nf_value = nf.nf_value
        nfUpdate.status = nf.status
        nfUpdate.type_nf = nf.type_nf
        nfUpdate.users = user
        nfUpdate.supplier = supplier

        if(nf.tickets == null){
            return this.repository.save(nfUpdate)
        } else {
            nfUpdate.tickets = nf.tickets.map(ticket => {
            ticket.date_now = new Date()
            ticket.status = ticket.status
            return ticket
            })
            return this.repository.save(nfUpdate)
        }

    }

    async showNfsByCompanyCnpj(cnpj: string): Promise<any[]> {
        const nfs = await this.repository
            .createQueryBuilder('nf')
            .leftJoinAndSelect('nf.tickets', 'tickets')
            .leftJoinAndSelect('nf.supplier', 'supplier')
            .leftJoinAndSelect('nf.users', 'users')
            .leftJoinAndSelect('supplier.company', 'company')
            .where('company.cnpj = :cnpj', { cnpj })
            .orderBy('nf.date_now', 'ASC')
            .getMany();

        const refactor = nfs.map(nf => ({
            id_nf_received: nf.id_nf_received,
            date_now: nf.date_now,
            id_nf: nf.id_nf,
            supplier: nf.supplier?.fantasy_name,
            nf_value: nf.nf_value,
            type_nf: nf.type_nf,
            status: nf.status,
            tickets: nf.tickets?.map(ticket => ({
                ticket_value: ticket.ticket_value,
                due_date: ticket.due_date,
                status: ticket.status
            })),
            receivedBy: nf.users?.name
        }))

        return refactor;
    }

    async findByIdNf(id_nf: string, cnpj: string): Promise<NfReceived>{

        const nf = await this.repository
            .createQueryBuilder('nf')
            .leftJoinAndSelect('nf.tickets', 'tickets')
            .leftJoinAndSelect('nf.supplier', 'supplier')
            .leftJoinAndSelect('nf.users', 'users')
            .leftJoinAndSelect('supplier.company', 'company')
            .where('nf.id_nf = :id_nf', { id_nf })
            .andWhere('company.cnpj = :cnpj', {cnpj})
            .getOne();

        if(!nf){
            throw new httpError(400, "Nota não encontrada")
        }
        return nf
    }

     async showNfsByCompanyCnpjAndDateToday(cnpj: string): Promise<any[]> {
        const today = new Date()
        const fuso = 'America/Sao_Paulo';

        
        const zonedDate = toZonedTime(today, fuso);
        const startOfDay = format(zonedDate, 'yyyy-MM-dd 00:00:00.000');
        const endOfDay = format(zonedDate, 'yyyy-MM-dd 23:59:59');


        const nfs = await this.repository
            .createQueryBuilder('nf')
            .leftJoinAndSelect('nf.tickets', 'tickets')
            .leftJoinAndSelect('nf.supplier', 'supplier')
            .leftJoinAndSelect('nf.users', 'users')
            .leftJoinAndSelect('supplier.company', 'company')
            .where('company.cnpj = :cnpj', { cnpj })
            .andWhere('nf.date_now BETWEEN :start AND :end', {start: startOfDay, end: endOfDay})
            .getMany();

        const refactor = nfs.map(nf => ({
            id_nf_received: nf.id_nf_received,
            date: nf.date_now,
            id_nf: nf.id_nf,
            supplier: nf.supplier?.fantasy_name,
            nf_value: nf.nf_value,
            tickets: nf.tickets?.map(ticket => ({
                ticket_value: ticket.ticket_value,
                due_date: ticket.due_date,
                status: ticket.status
            })),
            receivedBy: nf.users?.name
        }))

        return refactor;
    }


        async showNfsByCompanyCnpjAndRetained(cnpj: string): Promise<any[]> {

        const output = "RETIDA"

        const nfs = await this.repository
            .createQueryBuilder('nf')
            .leftJoinAndSelect('nf.tickets', 'tickets')
            .leftJoinAndSelect('nf.supplier', 'supplier')
            .leftJoinAndSelect('nf.users', 'users')
            .leftJoinAndSelect('supplier.company', 'company')
            .where('company.cnpj = :cnpj', { cnpj })
            .andWhere('nf.status = :output', {output})
            .getMany();

        const refactor = nfs.map(nf => ({
            id_nf_received: nf.id_nf_received,
            date: nf.date_now,
            id_nf: nf.id_nf,
            fantasyNameSupplier: nf.supplier?.fantasy_name,
            reasonNameSupplier: nf.supplier?.fantasy_name,
            cnpjSupplier: nf.supplier?.cnpj,
            stateRegistrationSupplier: nf.supplier?.state_registration,
            emailSupplier: nf.supplier?.email,
            phoneNumberSupplier: nf.supplier?.phone_number,
            nf_value: nf.nf_value,
            status: nf.status,
            tickets: nf.tickets?.map(ticket => ({
                ticket_value: ticket.ticket_value,
                due_date: ticket.due_date,
                status: ticket.status
            })),
            receivedBy: nf.users?.name
        }))

        return refactor;
    }

}