import {Repository} from 'typeorm'
import { Supplier } from '../model/Supplier'
import { httpError } from '../errors/HttpError'
import { AppDataSource } from '../data-source'
import { Company } from '../model/Company'
import { Http2ServerRequest } from 'http2'


//  @PrimaryGeneratedColumn("uuid")
//     id_supplier?: string
//     @Column()
//     fantasy_name?: string
//     @Column()
//     reason_name?: string
//     @Column()
//     cnpj?: string
//     @Column()
//     state_registration?: string
//     @Column()
//     email?: string
//     @Column()
//     phone_number?: string
//     @Column("timestamp")
//     date_now?: Date
//     @ManyToOne(()=> Company, (company) => company.suplier)
//     company?: Company


export class SupplierService {
    private repository: Repository<Supplier>

    constructor(repository: Repository<Supplier>){
        this.repository = repository
    }


    async create(supplier: Supplier, id_company: string): Promise<Supplier>{
        if(!supplier.fantasy_name || !supplier.reason_name || !supplier.cnpj || !supplier.state_registration){
            throw new httpError(400, `O Nome Fantasia, Nome Razão, CNPJ e inscrição estadual são obrigatórios`)
        }


        const verifyReasonName = await this.existSupplierReasonName(supplier.reason_name)
        const verifyCnpj = await this.existSupplierCnpj(supplier.cnpj)
        const verifyStateRegistration = await this.existSupplierStateRegistration(supplier.state_registration)

        if(verifyReasonName) {
            throw new httpError(400, `Este Nome Razão já existe`)
        } else if(verifyCnpj){
            throw new httpError(400, `Este CNPJ já existe`)
        } else if(verifyStateRegistration) {
            throw new httpError(400, `Esta Inscrição Estadual já existe`)
        }

        const companyRepository = AppDataSource.getRepository(Company)
        const findCompany = await companyRepository.findOneBy({id_company: id_company})

  

        if(findCompany == null){
            throw new httpError(400, "Sua empresa não existe, erro nos seus dados. Contate o suporte.")
        } else {
            const newDate = new Date()
            supplier.company = findCompany
            supplier.date_now = newDate
            return await this.repository.save(supplier)
        }


    }

    async findSupplierByCompany(cnpj: string): Promise<Supplier[]> {
        const suppliers = await this.repository.createQueryBuilder('supplier').innerJoinAndSelect('supplier.company', 'company').where('company.cnpj = :cnpj', {cnpj}).getMany()

        return suppliers
    }








    async existEmail(email: string) {
        const emailExist = await this.repository.exist({
            where: {email: email}
        })

        const teste = emailExist == true ? email : emailExist

        return teste

    }


    async existSupplierCnpj(cnpj: string): Promise<Boolean> {
        const companyRepository = AppDataSource.getRepository(Supplier)

        return await companyRepository.exist({
                where: { cnpj: cnpj }
            })
    }

    async existSupplierStateRegistration(state_registration: string) {
        const companyRepository = AppDataSource.getRepository(Supplier)

        const existStateRegistration = await companyRepository.exist({ 
            where: { state_registration: state_registration }
        })

        const teste = existStateRegistration == true ? state_registration : existStateRegistration
        return teste
    }

    async existSupplierReasonName(reason_name: string) {
        const companyRepository = AppDataSource.getRepository(Supplier)

        const existReasonName = await companyRepository.exist({ 
            where: { reason_name: reason_name }
        })

        const teste = existReasonName == true ? reason_name : existReasonName

        return teste
    }


}