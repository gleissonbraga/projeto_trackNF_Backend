import { Router } from 'express';
import { NfReceivedController } from '../controller/NfReceivedController';


export const nfReceivedRotas = (controller: NfReceivedController): Router => {
    const router = Router()

    router.post("/", controller.create)
    router.get("/", controller.showNfs)
    router.put("/:id_nf", controller.update)

    return router
}