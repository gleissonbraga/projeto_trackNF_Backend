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
        const company = req.user as JwtPayload
        const users = await this.service.findUsersByCompany(company.cnpj)
        res.json(users)
    }

    findByUserId = async (req: Request, res: Response): Promise<void> => {
        const user = req.user as JwtPayload
        const userParams = req.params.id_user
        const users = await this.service.findByUserId(userParams, user.cnpj)
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


    createUserCompany = async (req: Request, res: Response): Promise<void> => {
        const {name, cpf, email, password } = req.body
        const user = req.user as JwtPayload
        try {
            const newUser = await this.service.createUserCompany({name, cpf, email, password}, user.cnpj)
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
        const { fantasy_name, reason_name, name, cpf, email, password, status } = req.body
        try {
            const updateuser = await this.service.update(idCompany, idUser, {name, cpf, email, password, status}, {fantasy_name, reason_name,})
            res.status(201).json(updateuser)
        } catch (error) {
            if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    activeUsers = async (req: Request, res: Response): Promise<void> => {
        const user = req.params.id_user

        try {
            const active = await this.service.activeSupplier(user)
            res.status(200).json(active)
        } catch (error) {
                if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }


    inactiveSupplier = async (req: Request, res: Response): Promise<void> => {
        const user = req.params.id_user

        try {
            const active = await this.service.inactiveSupplier(user)
            res.status(200).json(active)
        } catch (error) {
             if(error instanceof httpError){
                res.status(error.status).json({ message: error.message})
            }
        }
    }

    findUsersActive = async (req: Request, res: Response): Promise<void> => {
        const company = req.user as JwtPayload
        const active = await this.service.findUsersActive(company.cnpj)
        res.status(200).json(active)
    }
    
    findUsersInactive = async (req: Request, res: Response): Promise<void> => {
        const company = req.user as JwtPayload
        
        const active = await this.service.findUsersInactive(company.cnpj)
        res.status(200).json(active)
    }

}