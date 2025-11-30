import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import expressBasicAuth from 'express-basic-auth';
import authRoutes from './route/auth.routes';
import userRoutes from './route/user.routes';
import roleRoutes from './route/role.routes';
import profileRoutes from './route/profile.routes';
import depositoTypeRoutes from './route/deposito_types.routes';
import accountRoutes from './route/account.routes';
import accountTransactionRoutes from './route/account_transactions.routes';


const router = Router();
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/swagger.json'), 'utf-8')
);

router.use(
    '/docs',   
    expressBasicAuth({
        users: { admin: 'secret123' },
        challenge: true
    }),
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument, {
    customJs: "/swagger-custom.js",
    swaggerOptions: {
      requestInterceptor: function (req : any) {
        if (req.url.endsWith("/api/auth/refresh-token")) {
          const refreshToken = localStorage.getItem("swagger_refresh_token");

          if (refreshToken) {
            req.body = JSON.stringify({ refreshToken });
          }

          req.headers["Content-Type"] = "application/json";
        }

        return req;
      }
    }
  })
);

router.get('/', (req, res) => {
    res.json({
        message: 'Server Is Running!'
    })
})

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/profile', profileRoutes);
router.use('/deposito-types', depositoTypeRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', accountTransactionRoutes);


export default router;
