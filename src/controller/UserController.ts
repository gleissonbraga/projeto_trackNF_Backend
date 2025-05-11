import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { httpError } from "../errors/HttpError";




export class UserController {
    private service: UserService

    constructor(service: UserService){
        this.service = service
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const { fantasy_name, reason_name, cnpj, state_registration, name, cpf, email, password } = req.body
        try {
            const newUser = await this.service.create({name, cpf, email, password}, {fantasy_name, reason_name, cnpj, state_registration})
            res.status(201).json(newUser)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const idUser = req.params.idUser
        const idCompany = req.params.idCompany
        const { fantasy_name, reason_name, name, cpf, email, password } = req.body
        try {
            const updateuser = await this.service.update(idCompany, idUser, {name, cpf, email, password}, {fantasy_name, reason_name})
            res.status(201).json(updateuser)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

}