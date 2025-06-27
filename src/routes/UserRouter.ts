import { Router } from 'express';
import { UserController } from '../controller/UserController';


export const userRotas = (controller: UserController): Router => {
    const router = Router()

    // router.post("/", controller.create)
    router.put("/:idUser", controller.update)
    router.get("/", controller.findUsersByCompany)
    router.get("/:id_user", controller.findByUserId)

    return router
}