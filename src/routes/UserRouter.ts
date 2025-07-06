import { Router } from 'express';
import { UserController } from '../controller/UserController';


export const userRotas = (controller: UserController): Router => {
    const router = Router()

    router.post("/empresa", controller.createUserCompany)
    router.put("/:idUser", controller.update)
    router.get("/", controller.findUsersByCompany)
    router.get("/inativos", controller.findUsersInactive)
    router.get("/ativos", controller.findUsersActive)
    router.get("/usuario", controller.findByUserId)

    return router
}