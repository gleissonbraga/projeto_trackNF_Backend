import { Request, Response } from "express";
import { CompanyService } from "../service/CompanyService";
import { httpError } from "../errors/HttpError";


export class CompanyController {
    private service: CompanyService

    constructor(service: CompanyService){
        this.service = service
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const { fantasy_name, reason_name, cnpj, state_registration } = req.body
        try {
            const newCompany = await this.service.create({fantasy_name, reason_name, cnpj, state_registration})
            res.status(201).json(newCompany)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }  
    
    showAllCompanies = async (req: Request, res: Response): Promise<void> => {
        const companies = await this.service.showAllCompanies()
        res.json(companies)
    }
}