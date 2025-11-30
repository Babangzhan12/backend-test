import { Router } from 'express';
import { authenticateJWT } from '../../middleware/jwt.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { RoleController } from '../../controller/role.controller';


const roleRoutes = Router();
const controller = new RoleController();
roleRoutes.use(authenticateJWT);
roleRoutes.use(authorizeRoles(['superadmin', 'admin', 'customer'])),

roleRoutes.get('/' , controller.getAll);
roleRoutes.get('/select' , controller.getBySelect);
roleRoutes.get('/paginated', controller.getAllPaginated);
roleRoutes.get('/:id', controller.getById);
roleRoutes.post('/', controller.create);
roleRoutes.put('/:id', controller.update);
roleRoutes.delete('/:id', controller.delete);

export default roleRoutes;