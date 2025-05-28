import { Request, Response } from "express";
import { UserService } from "../service/UserService";
import { httpError } from "../errors/HttpError";
import { JwtPayload } from "jsonwebtoken";




export class UserController {
    private service: UserService

    constructor(service: UserService){
        this.service = service
    }

    findUsersByCompany = async (req: Request, res: Response): Promise<void> => {
        const cnpj = req.params.users_cnpj
        const users = await this.service.findUsersByCompany(cnpj)
        res.json(users)
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
        const user = req.user as JwtPayload
        const idCompany = user.id_company
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