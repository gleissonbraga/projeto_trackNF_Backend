import { Router } from 'express';
import { SupplierController } from '../controller/SupplierController';


export const supplierRotas = (controller: SupplierController): Router => {
    const router = Router()

    router.post("/", controller.create)
    router.put("/:id_supplier", controller.update)
    router.get("/", controller.findSupplierByCompany)
    router.get("/ativos", controller.findSupplierActive)
    router.get("/inativos", controller.findSupplierInactive)
    router.patch("/inativar/:id_supplier", controller.inactiveSupplier)
    router.patch("/ativar/:id_supplier", controller.activeSupplier)

    return router
}