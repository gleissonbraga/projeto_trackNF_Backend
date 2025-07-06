import { NextFunction, Request, Response } from "express";
import { LoginService } from "../service/LoginService";

export class TokenMiddleware{
    private service: LoginService;

    constructor(service: LoginService) {
        this.service = service;
    }

    async verifyAcces(req: Request, res: Response, next: NextFunction){
        const authHeader = req.get("Authorization");
        const token = authHeader?.split(" ")[1];
        if(!token) {
            res.status(401).json({error: "Nenhum token informado!"});
        } else {
            try{
                const infoUser = await this.service.validationToken(token);
                req.user = infoUser
                next();        
            }
            catch(err:any) {
                res.status(err.id).json({ error: err.msg });
            }
        }
    }
}