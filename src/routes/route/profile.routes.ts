import { Router } from 'express';
import { authenticateJWT } from '../../middleware/jwt.middleware';
import { authorizeRoles } from '../../middleware/role.middleware';
import { ProfileController } from '../../controller/profile.controller';


const profileRoutes = Router();
const controller = new ProfileController();
profileRoutes.use(authenticateJWT);
profileRoutes.use(authorizeRoles(['superadmin', 'admin', 'customer'])),

profileRoutes.get('/' , controller.getAll);
profileRoutes.get('/select' , controller.getBySelect);
profileRoutes.get('/paginated', controller.getAllPaginated);
profileRoutes.get('/:id', controller.getById);
// profileRoutes.get('/me', controller.me);
profileRoutes.post('/', controller.create);
profileRoutes.put('/:id', controller.update);
profileRoutes.delete('/:id', controller.delete);


export default profileRoutes;