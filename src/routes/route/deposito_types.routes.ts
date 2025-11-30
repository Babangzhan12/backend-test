import { Router } from 'express';
import { authenticateJWT } from '../../middleware/jwt.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { DepositoTypesController } from '../../controller/deposito_types.controller';


const depositoTypeRoutes = Router();
const controller = new DepositoTypesController();
depositoTypeRoutes.use(authenticateJWT);
depositoTypeRoutes.use(authorizeRoles(['superadmin', 'admin', 'customer'])),

depositoTypeRoutes.get('/' , controller.getAll);
depositoTypeRoutes.get('/select' , controller.getBySelect);
depositoTypeRoutes.get('/paginated', controller.getAllPaginated);
depositoTypeRoutes.get('/:id', controller.getById);
depositoTypeRoutes.post('/', controller.create);
depositoTypeRoutes.put('/:id', controller.update);
depositoTypeRoutes.delete('/:id', controller.delete);

export default depositoTypeRoutes;