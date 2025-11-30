import { Router } from 'express';
import { authenticateJWT } from '../../middleware/jwt.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { AccountController } from '../../controller/account.controller';


const accountRoutes = Router();
const controller = new AccountController();
accountRoutes.use(authenticateJWT);
accountRoutes.use(authorizeRoles(['superadmin', 'admin', 'customer'])),

accountRoutes.get('/' , controller.getAll);
accountRoutes.get('/select' , controller.getBySelect);
accountRoutes.get('/paginated', controller.getAllPaginated);
accountRoutes.get('/:id', controller.getById);
accountRoutes.post('/', controller.create);
accountRoutes.put('/:id', controller.update);
accountRoutes.delete('/:id', controller.delete);

export default accountRoutes;