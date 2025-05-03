import express from 'express';
import { AppDataSource } from './data-source';
import { Company } from './model/Company';
import { CompanyService } from './service/CompanyService';
import { CompanyController } from './controller/CompanyController';
import { companyRotas } from './routes/CompanyRouter';


AppDataSource.initialize().then(async => {
  const app = express();
  app.use(express.json());

  // Initialize dependencies 
  //Company
  const companyRepository = AppDataSource.getRepository(Company);
  const companyService = new CompanyService(companyRepository);
  const companyController = new CompanyController(companyService);



  // Routes
  app.use('/api/empresas', companyRotas(companyController));

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});