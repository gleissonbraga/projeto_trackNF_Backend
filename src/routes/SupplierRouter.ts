import { Router } from 'express';
import { SupplierController } from '../controller/SupplierController';


export const supplierRotas = (controller: SupplierController): Router => {
    const router = Router()

    router.post("/", controller.create)
    router.get("/", controller.findSupplierByCompany)
    router.put("/:id_supplier", controller.update)

    return router
}