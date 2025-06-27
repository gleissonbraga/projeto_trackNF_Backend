import { Router } from 'express';
import {TicketsController} from '../controller/TicketsController';


export const ticketsRotas = (controller: TicketsController): Router => {
    const router = Router()
    
    router.get("/", controller.showTicketsPending)
    return router
}