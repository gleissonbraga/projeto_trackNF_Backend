import express from 'express';
import { AppDataSource } from './data-source';
import { Company } from './model/Company';
import { CompanyService } from './service/CompanyService';
import { CompanyController } from './controller/CompanyController';
import { companyRotas } from './routes/CompanyRouter';
import { userRotas } from './routes/UserRouter'
import { Users } from './model/User';
import { UserService } from './service/UserService';
import { UserController } from './controller/UserController';
import { Supplier } from './model/Supplier';
import { SupplierService } from './service/SupplierService';
import { SupplierController } from './controller/SupplierController';
import { supplierRotas } from './routes/SupplierRouter';
import { NfReceived } from './model/NfReceived';
import { NfReceivedService } from './service/NfReceivedService';
import { NfReceivedController } from './controller/NfReceivedController';
import { nfReceivedRotas } from './routes/NfReceivedRouter';
import { LoginService } from './service/LoginService';
import { LoginController } from './controller/LoginController';
import { TokenMiddleware } from './middleware/AuthMiddleware';


AppDataSource.initialize().then(async => {
  const app = express();
  app.use(express.json());

  // Initialize dependencies 
  //Company
  const companyRepository = AppDataSource.getRepository(Company);
  const companyService = new CompanyService(companyRepository);
  const companyController = new CompanyController(companyService);

  //users
  const userRepository = AppDataSource.getRepository(Users);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  //supplier
  const supplierRepository = AppDataSource.getRepository(Supplier);
  const supplierService = new SupplierService(supplierRepository);
  const supplierController = new SupplierController(supplierService);

  //NF Received
  const nfRepository = AppDataSource.getRepository(NfReceived);
  const nfService = new NfReceivedService(nfRepository);
  const nfController = new NfReceivedController(nfService);

    //Login
  const loginService = new LoginService(userRepository);
  const loginController = new LoginController(loginService);

  //Midleware TokenMiddleware
  const tokenMiddleware = new TokenMiddleware(loginService)

  // Routes
  app.post('/api/login', loginController.login);
  app.use(tokenMiddleware.verifyAcces.bind(tokenMiddleware));
  // Routes
  app.use('/api/empresas', companyRotas(companyController));
  app.use('/api/usuarios', userRotas(userController));
  app.use('/api/fornecedores', supplierRotas(supplierController));
  app.use('/api/notasfiscais', nfReceivedRotas(nfController));

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});