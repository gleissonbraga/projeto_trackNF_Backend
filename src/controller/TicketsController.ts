import { Request, Response } from "express";
import { TicketService } from "../service/TicketService";
import { httpError } from "../errors/HttpError";
import { JwtPayload } from "jsonwebtoken";


export class TicketsController {
    private service: TicketService

    constructor(service: TicketService){
        this.service = service
    }

    
    showTicketsPending = async (req: Request, res: Response): Promise<void> => {
        const ticketCompany = req.user as JwtPayload
        const companies = await this.service.ticketsPending(ticketCompany.cnpj)
        res.json(companies)
    }
}
