import { Router } from 'express';
import { UserController } from '../../controller/user.controller';
import { authenticateJWT } from '../../middleware/jwt.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';


const userRoutes = Router();
const controller = new UserController();
userRoutes.use(authenticateJWT);
userRoutes.use(authorizeRoles(['superadmin', 'admin', 'customer'])),

userRoutes.get('/' , controller.getAll);
userRoutes.get('/select' , controller.getBySelect);
userRoutes.get('/paginated', controller.getAllPaginated);
userRoutes.get('/:id', controller.getById);
userRoutes.post('/', controller.create);
userRoutes.put('/:id', controller.update);
userRoutes.delete('/:id', controller.delete);

export default userRoutes;