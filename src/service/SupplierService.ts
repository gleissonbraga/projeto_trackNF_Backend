import { Repository } from "typeorm";
import { Supplier, TypeStatus } from "../model/Supplier";
import { httpError } from "../errors/HttpError";
import { AppDataSource } from "../data-source";
import { Company } from "../model/Company";

export class SupplierService {
  private repository: Repository<Supplier>;

  constructor(repository: Repository<Supplier>) {
    this.repository = repository;
  }

  async create(supplier: Supplier, cnpj: string): Promise<Supplier> {
    if (
      !supplier.fantasy_name ||
      !supplier.reason_name ||
      !supplier.cnpj ||
      !supplier.state_registration
    ) {
      throw new httpError(400, `Preencha todos os dados`);
    }

    const verifyReasonName = await this.existSupplierReasonName(
      supplier.reason_name, cnpj
    );
    const verifyCnpj = await this.existSupplierCnpj(supplier.cnpj, cnpj);
    const verifyStateRegistration = await this.existSupplierStateRegistration(
      supplier.state_registration, cnpj
    );

    if (verifyReasonName) {
      throw new httpError(400, `Este Nome Razão já existe`);
    } else if (verifyCnpj) {
      throw new httpError(400, `Este CNPJ já existe`);
    } else if (verifyStateRegistration) {
      throw new httpError(400, `Esta Inscrição Estadual já existe`);
    }

    const companyRepository = AppDataSource.getRepository(Company);
    const findCompany = await companyRepository.findOneBy({ cnpj: cnpj });

    if (findCompany == null) {
      throw new httpError(
        400,
        "Sua empresa não existe, erro nos seus dados. Contate o suporte."
      );
    } else {
      const actieDefault = TypeStatus.ATIVO;
      const newDate = new Date();
      supplier.company = findCompany;
      supplier.date_now = newDate;
      supplier.status = actieDefault;
      return await this.repository.save(supplier);
    }
  }

  async update(
    supplier: Omit<Supplier, "company" | "date_now">,
    id_supplier: string
  ) {
    if (
      !supplier.fantasy_name ||
      !supplier.reason_name ||
      !supplier.cnpj ||
      !supplier.state_registration
    ) {
      throw new httpError(400, `Preencha todos os dados`);
    }

  const findSupplier = await this.repository.findOneBy({
      id_supplier: id_supplier,
    });

    if(!findSupplier?.cnpj || findSupplier == null){
        throw new httpError(400, "Fornecedor não encontrado");
    }

    const verifyReasonName = await this.existSupplierReasonName(
      supplier.reason_name, findSupplier.cnpj
    );
    const verifyCnpj = await this.existSupplierCnpj(supplier.cnpj, findSupplier.cnpj);
    const verifyStateRegistration = await this.existSupplierStateRegistration(
      supplier.state_registration, findSupplier.cnpj
    );

  
    if (
      verifyReasonName &&
      supplier.reason_name !== findSupplier?.reason_name
    ) {
      throw new httpError(400, `Este Nome Razão já existe`);
    } else if (verifyCnpj && supplier.cnpj !== findSupplier?.cnpj) {
      throw new httpError(400, `Este CNPJ já existe`);
    } else if (
      verifyStateRegistration &&
      supplier.state_registration !== findSupplier?.state_registration
    ) {
      throw new httpError(400, `Esta Inscrição Estadual já existe`);
    }

    if (!findSupplier || findSupplier == null) {
      throw new httpError(400, "Fornecedor não encontrado");
    } else {
      findSupplier.reason_name = supplier.reason_name;
      findSupplier.cnpj = supplier.cnpj;
      findSupplier.email = supplier.email;
      findSupplier.fantasy_name = supplier.fantasy_name;
      findSupplier.phone_number = supplier.phone_number;
      findSupplier.state_registration = supplier.state_registration;
      findSupplier.status = supplier.status;

      return await this.repository.save(findSupplier);
    }
  }

  async findSupplierByCompany(cnpj: string): Promise<Supplier[]> {
    const ativo = TypeStatus.ATIVO
    const suppliers = await this.repository
      .createQueryBuilder("supplier")
      .innerJoinAndSelect("supplier.company", "company")
      .where("company.cnpj = :cnpj", { cnpj })
      .andWhere("supplier.status = :status", {status: ativo})
      .orderBy("supplier.fantasy_name", "ASC")
      .getMany();

    return suppliers;
  }

  async existEmail(email: string, cnpjCompany: string): Promise<Boolean> {
    const emailExist = await this.repository.findOne({
      where: { email: email,
        company: {
            cnpj: cnpjCompany
        }
       },
      relations: ["company"],
    });

    if (emailExist) {
      return true;
    } else {
      return false;
    }
  }

  async existSupplierCnpj(cnpj: string, cnpjCompany: string): Promise<Boolean> {
    const cnpjExist = await this.repository.findOne({
      where: { cnpj: cnpj,
                company: {
            cnpj: cnpjCompany
        }
       },
      relations: ["company"],
    });

    if (cnpjExist) {
      return true;
    } else {
      return false;
    }
  }

  async existSupplierStateRegistration(state_registration: string, cnpjCompany: string) {
    const companyRepository = AppDataSource.getRepository(Supplier);

    const existStateRegistration = await companyRepository.findOne({
      where: {
        state_registration: state_registration,
        company: {cnpj: cnpjCompany}
      },
      relations: ["company"],
    });

    if (existStateRegistration) {
      return true;
    } else {
      return false;
    }
  }

  async existSupplierReasonName(reason_name: string, cnpjCompany: string): Promise<Boolean> {
    const reason_nameExist = await this.repository.findOne({
      where: { reason_name: reason_name,
        company: {
            cnpj: cnpjCompany
        }
       },
      relations: ["company"],
    });

    if (reason_nameExist) {
      return true;
    } else {
      return false;
    }
  }

  async activeSupplier(id_supplier: string) {
    const findSupplier = await this.repository.findOneBy({
      id_supplier: id_supplier,
    });

    if (!findSupplier) {
      throw new httpError(401, "Fornecedor não encontrado");
    }

    const active = TypeStatus.ATIVO;

    findSupplier.status = active;
  }

  async inactiveSupplier(id_supplier: string) {
    const findSupplier = await this.repository.findOneBy({
      id_supplier: id_supplier,
    });

    if (!findSupplier) {
      throw new httpError(401, "Fornecedor não encontrado");
    }

    const active = TypeStatus.INATIVO;

    findSupplier.status = active;
  }

  async findSupplierActive(cnpj: string): Promise<Supplier[]> {
    const ativo = TypeStatus.ATIVO;
    const findSuppliers = await this.repository.find({
      where: {
        status: ativo,
        company: {
          cnpj: cnpj,
        },
      },
      relations: ["company"],
    });

    return findSuppliers;
  }

  async findSupplierInactive(cnpj: string): Promise<Supplier[]> {
    const inactive = TypeStatus.INATIVO;
    const findSuppliers = await this.repository.find({
      where: {
        status: inactive,
        company: {
          cnpj: cnpj,
        },
      },
      relations: ["company"],
    });

    return findSuppliers;
  }
}
