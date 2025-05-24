import { Request, Response } from "express";
import { LoginService } from "../service/LoginService";
import { httpError } from "../errors/HttpError";

export class LoginController {
    private service: LoginService;
  
    constructor(service: LoginService) {
      this.service = service;
    }
  
    login = async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;
      try{ 
          const token = await this.service.login(email, password);
          res.status(201).json({token: token});
      }
      catch(error) {
        if(error instanceof httpError){
            res.status(error.status).json({ message: error.message})
        }
      }
    };
}