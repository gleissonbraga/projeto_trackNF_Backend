import { Request, Response } from "express";
import { SupplierService } from "../service/SupplierService";
import { httpError } from "../errors/HttpError";


export class SupplierController {
    private service: SupplierService

    constructor(service: SupplierService){
        this.service = service
    }


    create = async (req: Request, res: Response): Promise<void> => {
        const { fantasy_name, reason_name, cnpj, state_registration, email, phone_number } = req.body
        const id = req.params.id_company
        try {
            const newSupplier = await this.service.create({fantasy_name, reason_name, cnpj, state_registration, email, phone_number}, id)
            res.status(201).json(newSupplier)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const { fantasy_name, reason_name, cnpj, state_registration, email, phone_number } = req.body
        const id = req.params.id_supplier

        try {
            const updateSupplier = await this.service.update({fantasy_name, reason_name, cnpj, state_registration, email, phone_number}, id)
            res.json(updateSupplier)
        } catch (error) {
           if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            } 
        }
    }

    findSupplierByCompany = async (req: Request, res: Response): Promise<void> => {
        const cnpj = req.params.company_cnpj
        const supplier = await this.service.findSupplierByCompany(cnpj)
        res.json(supplier)
    }

}