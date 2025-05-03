import { Router } from 'express';
import { CompanyController } from '../controller/CompanyController';


export const companyRotas = (controller: CompanyController): Router => {
    const router = Router()

    router.post("/", controller.create)
    router.get("/", controller.showAllCompanies)

    return router

}