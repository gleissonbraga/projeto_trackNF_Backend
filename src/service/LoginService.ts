import { Repository } from "typeorm";
import { Users } from "../model/User";
import { sign, verify } from "jsonwebtoken"
import bcrypt from "bcrypt"
import { httpError } from "../errors/HttpError";
import dotenv from "dotenv"
dotenv.config()


export class LoginService{
    public repository: Repository<Users>

    constructor(repository: Repository<Users>){
        this.repository = repository
    }


    async login(email: string, password: string): Promise<String>{

        let user = await this.repository.findOne({
            where: {email: email},
            relations: ["company"]
        })
        
        if(!user?.password){
            throw new httpError(400, "Email incorreto")
        } 
        
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if(!isValidPassword ){
            throw new httpError(400, "Senha incorreta" )
        }

        const payload = {id_user: user.id_user, nome: user.name, empresa: user?.company?.fantasy_name, cnpj: user?.company?.cnpj, id_company: user?.company?.id_company}

        if(!process.env.JWT_KEY) throw new httpError(404, "JWT_KEY não definida nas variáveis de ambiente")
        let token = sign(payload, process.env.JWT_KEY, { expiresIn: '1d'})

        console.log(payload)
        return token
    }

    async validationToken(token: string) {
          try{
            if(!process.env.JWT_KEY) throw new httpError(404, "JWT_KEY não definida nas variáveis de ambiente")
            const payload = verify(token, process.env.JWT_KEY);

            if(!payload){
                throw ({id: 401, msg: "Token Invalido"});    
            }
            return payload
        } catch (err) {
            console.log(err)
            throw ({id: 401, msg: "Token Invalido"});    
        }
    }
}