import { Router } from 'express';
import { SupplierController } from '../controller/SupplierController';


export const supplierRotas = (controller: SupplierController): Router => {
    const router = Router()

    router.post("/:id_company", controller.create)
    router.get("/:company_cnpj", controller.findSupplierByCompany)
    // router.put("/:id", controller.updateCompany)

    return router
}