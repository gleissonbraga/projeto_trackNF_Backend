import { Request, Response } from "express";
import { SupplierService } from "../service/SupplierService";
import { httpError } from "../errors/HttpError";
import { JwtPayload } from "jsonwebtoken";


export class SupplierController {
    private service: SupplierService

    constructor(service: SupplierService){
        this.service = service
    }


    create = async (req: Request, res: Response): Promise<void> => {
        const { fantasy_name, reason_name, cnpj, state_registration, email, phone_number } = req.body
        const company = req.user as JwtPayload
        try {
            const newSupplier = await this.service.create({fantasy_name, reason_name, cnpj, state_registration, email, phone_number}, company.cnpj)
            res.status(201).json(newSupplier)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const { fantasy_name, reason_name, cnpj, state_registration, email, phone_number, status } = req.body
        const id = req.params.id_supplier

        try {
            const updateSupplier = await this.service.update({fantasy_name, reason_name, cnpj, state_registration, email, phone_number, status}, id)
            res.json(updateSupplier)
        } catch (error) {
           if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            } 
        }
    }

    findSupplierByCompany = async (req: Request, res: Response): Promise<void> => {
        const company = req.user as JwtPayload
        const supplier = await this.service.findSupplierByCompany(company.cnpj)
        res.json(supplier)
    }

    activeSupplier = async (req: Request, res: Response): Promise<void> => {
        const supplier = req.params.id_supplier

        try {
            const active = await this.service.activeSupplier(supplier)
            res.status(200).json(active)
        } catch (error) {
             if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }


    inactiveSupplier = async (req: Request, res: Response): Promise<void> => {
        const supplier = req.params.id_supplier

        try {
            const active = await this.service.inactiveSupplier(supplier)
            res.status(200).json(active)
        } catch (error) {
             if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    findSupplierActive = async (req: Request, res: Response): Promise<void> => {
        const company = req.user as JwtPayload
        const active = await this.service.findSupplierActive(company.cnpj)
        res.status(200).json(active)
    }
    
    findSupplierInactive = async (req: Request, res: Response): Promise<void> => {
        const company = req.user as JwtPayload
        
        const active = await this.service.findSupplierInactive(company.cnpj)
        res.status(200).json(active)
    }
}