import { Request, Response } from "express";
import { NfReceivedService } from "../service/NfReceivedService";
import { httpError } from "../errors/HttpError";
import { JwtPayload } from "jsonwebtoken";


export class NfReceivedController {
    private service: NfReceivedService

    constructor(service: NfReceivedService){
        this.service = service
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const { id_nf, nf_value, type_nf, status, tickets, id_supplier, id_user  } = req.body

        try {
            const nf = await this.service.insert({ id_nf, nf_value, type_nf, status, tickets}, id_supplier, id_user)
            res.json(nf)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    showNfs = async (req: Request, res: Response): Promise<void> => {
        const user = req.user as JwtPayload
        const cnpj = user.cnpj
        console.log(cnpj)
        const nfs = await this.service.showNfsByCompanyCnpj(cnpj)
        res.json(nfs)
    }

    showNfsAndDateToday = async (req: Request, res: Response): Promise<void> => {
        const user = req.user as JwtPayload
        const cnpj = user.cnpj
        console.log(cnpj)
        const nfs = await this.service.showNfsByCompanyCnpjAndDateToday(cnpj)
        res.json(nfs)
    }

    showNfsAndRetained = async (req: Request, res: Response): Promise<void> => {
        const user = req.user as JwtPayload
        const cnpj = user.cnpj
        console.log(cnpj)
        const nfs = await this.service.showNfsByCompanyCnpjAndRetained(cnpj)
        res.json(nfs)
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const {id_nf, nf_value, type_nf, status, tickets, id_supplier, id_user  } = req.body
        const id = req.params.id_nf

        try {
            const nf = await this.service.update({ id_nf, nf_value, type_nf, status, tickets}, id, id_supplier, id_user)
            res.json(nf)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    
    findByIdNf = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id_nf
        const user = req.user as JwtPayload
        try {
            const nf = await this.service.findByIdNf(id, user.cnpj)
            res.status(200).json(nf)
        } catch (error) {
             if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }
}