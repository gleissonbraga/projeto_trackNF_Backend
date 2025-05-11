import {Repository} from 'typeorm'
import { Users } from '../model/User'
import { httpError } from '../errors/HttpError'
import { Company } from '../model/Company'
import bcrypt from 'bcrypt'
import { AppDataSource } from '../data-source'


export class UserService {
    private repository: Repository<Users>

    constructor(repository: Repository<Users>){
        this.repository = repository
    }
    
    async create(user: Users, company: Company): Promise<Users> {
        //  Verifica se os dados estão sendo populados no JSON
        if(!user.name || !user.cpf || !user.email || !user.password){
            throw new httpError(400, "Todos os dados são obrigatórios")
        }
        //  Verifica se os dados estão sendo populados no JSON
        if(!company.fantasy_name || !company.reason_name || !company.cnpj || !company.state_registration){
            throw new httpError(400, "Todos os dados são obrigatórios")
        }

        const newDate = new Date()
        company.date_now = newDate

        const companyRepository = AppDataSource.getRepository(Company)

        // Verifica na coluna CNPJ se já existe este valor
        const verifyCnpj = await this.existCompanyCnpj(company.cnpj)
        const verifyReasonName = await this.existCompanyReasonName(company.reason_name)
        const verifyCpf = await this.existCpf(user.cpf)
        const verifyEmail = await this.existEmail(user.email)

        // Gera os erros caso já exista algum dos dados nas colunas referentes
        if(verifyCpf){
            throw new httpError(400, `Este CPF já existe`)
        } else if (verifyEmail) {
            throw new httpError(400, `Este Email já existe`)
        } else if(verifyReasonName) {
            throw new httpError(400, `Este Nome Razão já existe`)
        } else if(verifyCnpj) {
            throw new httpError(400, `Este CNPJ já existe`)
        }

        // Cria a empresa
        const newCompany = await companyRepository.save(company)

        // Crio o hash da senha para maior segurança
        const saltRounds = 10
        const passwordHash = bcrypt.hashSync(user.password, saltRounds)

        // Populando os dados criados na entidade usuário para ser inserido na tabela
        user.password = passwordHash
        user.company = newCompany
        user.date_now = newDate

        // Crio o Usuário
        return await this.repository.save(user)
    }

    async update(id_company: string, id_user: string , user: Users, company: Omit<Company, "cnpj" | "state_registration">): Promise<Users> {
        
        //  Verifica se os dados estão sendo populados no JSON
        if(!user.name || !user.cpf || !user.email || !user.password){
            throw new httpError(400, "Todos os dados são obrigatórios")
        }
        //  Verifica se os dados estão sendo populados no JSON
        if(!company.fantasy_name || !company.reason_name){
            throw new httpError(400, "Todos os dados são obrigatórios")
        }

        const companyRepository = AppDataSource.getRepository(Company)

        const verifyCpf = await this.existCpf(user.cpf)
        const verifyEmail = await this.existEmail(user.email)
        const verifyReasonName = await this.existCompanyReasonName(company.reason_name)

        const findUser = await this.repository.findOneBy({id_user: id_user})
        const findCompany = await companyRepository.findOneBy({id_company: id_company})

        if(verifyCpf && user.cpf !== findUser?.cpf){
            throw new httpError(400, `Este CPF já existe`)
        } else if (verifyEmail && user.email !== findUser?.email) {
            throw new httpError(400, `Este Email já existe`)
        } else if(verifyReasonName && company.reason_name !== findCompany?.reason_name) {
            throw new httpError(400, `Este Nome Razão já existe`)
        }



        if(!findCompany || findCompany == null){
            throw new httpError(400, "Empresa não encontrado")
        } else {

            findCompany.fantasy_name = company.fantasy_name
            findCompany.reason_name = company.reason_name

            await companyRepository.save(findCompany)
        }

        if(!findUser || findUser == null){
            throw new httpError(400, "Usuário não encontrado")
        } else {
            // Crio o hash da senha para maior segurança
            const saltRounds = 10
            const passwordHash = bcrypt.hashSync(user.password, saltRounds)

            findUser.name = user.name
            findUser.cpf = user.cpf
            findUser.email = user.email
            findUser.password = passwordHash
            return await this.repository.save(findUser)
        }


    }
    
    async existEmail(email: string) {
        await this.repository.exist({
            where: {email: email}
        })

        return email
    }

    async existCpf(cpf: string) {
        await this.repository.exist({
            where: {cpf: cpf}
        })

        return cpf
    }

    async existCompanyCnpj(cnpj: string): Promise<Boolean> {
        const companyRepository = AppDataSource.getRepository(Company)

        return await companyRepository.exist({
             where: { cnpj: cnpj }
            })
    }

    async existCompanyStateRegistration(state_registration: string): Promise<Boolean> {
        const companyRepository = AppDataSource.getRepository(Company)

        return await companyRepository.exist({ 
            where: { state_registration: state_registration }
        })
    }

    async existCompanyReasonName(reason_name: string) {
        const companyRepository = AppDataSource.getRepository(Company)

        await companyRepository.exist({ 
            where: { reason_name: reason_name }
        })

        return reason_name
    }

}