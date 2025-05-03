import {Repository} from 'typeorm'
import { Company } from '../model/Company'
import { httpError } from '../errors/HttpError'

export class CompanyService {
    private repository: Repository<Company>

    constructor(repository: Repository<Company>){
        this.repository = repository
    }

    async create(company: Company): Promise <Company> {
        if(!company.fantasy_name || !company.reason_name || !company.cnpj || !company.state_registration){
            throw new httpError(400, "Todos os dados são obrigatórios")
        }
        const newDate = new Date()
        company.date_now = newDate
        return await this.repository.save(company)
    }

    async showAllCompanies(): Promise<Company[]> {
        return await this.repository.find()
    }
}