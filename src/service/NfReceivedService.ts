import {Repository} from 'typeorm'
import { NfReceived } from '../model/NfReceived'
import { Ticket } from '../model/Ticket'
import { httpError } from '../errors/HttpError'
import { AppDataSource } from '../data-source'
import { Users } from '../model/User'
import { Supplier } from '../model/Supplier'




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

        if(!user || !supplier){
            const verify = user === null ? "Usuário" : "Fornecedor"
            throw new httpError(400, `${verify} não encontrado`)
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
            return ticket
            })
        }
        return await this.repository.save(nf)
    }

    async showNfsByCompanyCnpj(cnpj: string): Promise<any[]> {
    const nfs = await this.repository
        .createQueryBuilder('nf')
        .leftJoinAndSelect('nf.tickets', 'tickets')
        .leftJoinAndSelect('nf.supplier', 'supplier')
        .leftJoinAndSelect('nf.users', 'users')
        .leftJoinAndSelect('supplier.company', 'company')
        .where('company.cnpj = :cnpj', { cnpj })
        .getMany();

        const refactor = nfs.map(nf => ({
            id_nf_received: nf.id_nf_received,
            date: nf.date_now,
            id_nf: nf.id_nf,
            supplier: nf.supplier?.fantasy_name,
            nf_value: nf.nf_value,
            tickets: nf.tickets?.map(ticket => ({
                ticket_value: ticket.ticket_value,
                due_dat: ticket.due_date
            })),
            receivedBy: nf.users?.name
        }))

        return refactor;
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

        
        if(!user || !supplier){
            const verify = user === null ? "Usuário" : "Fornecedor"
            throw new httpError(400, `${verify} não encontrado`)
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
            return ticket
            })
            return this.repository.save(nfUpdate)
        }

    }

}