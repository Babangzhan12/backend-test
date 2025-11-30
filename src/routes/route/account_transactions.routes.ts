import { Router } from 'express';
import { authenticateJWT } from '../../middleware/jwt.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { AccountTransactionsController } from '../../controller/account_transactions.controller';


const accountTransactionRoutes = Router();
const controller = new AccountTransactionsController();
accountTransactionRoutes.use(authenticateJWT);
accountTransactionRoutes.use(authorizeRoles(['superadmin', 'admin', 'customer'])),

accountTransactionRoutes.get('/' , controller.getAll);
accountTransactionRoutes.get('/select' , controller.getBySelect);
accountTransactionRoutes.get('/paginated', controller.getAllPaginated);
accountTransactionRoutes.get('/:id', controller.getById);
accountTransactionRoutes.post('/', controller.create);
accountTransactionRoutes.post('/:id/deposit', controller.deposit);
accountTransactionRoutes.post('/:id/withdraw', controller.withdraw);
accountTransactionRoutes.put('/:id', controller.update);
accountTransactionRoutes.delete('/:id', controller.delete);

export default accountTransactionRoutes;