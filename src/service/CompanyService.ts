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

    async updateCompany(id: string, company: Company): Promise<Company> {
        if(!company.cnpj || !company.fantasy_name || !company.reason_name || !company.state_registration){
            throw new httpError(400, "Todos os dados são obrigatórios")
        }

        let idCompany = await this.repository.findOneBy({id_company: id})
        if(!idCompany || idCompany == null){
            throw new httpError(404, "Empresa não encontrado")
        } else {
            idCompany.cnpj = company.cnpj
            idCompany.fantasy_name = company.fantasy_name
            idCompany.reason_name = company.reason_name
            idCompany.state_registration = company.state_registration
            return await this.repository.save(idCompany)
        }
    }
}