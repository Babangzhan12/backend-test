import { Router } from 'express';
import { login, me, refreshToken, register, setPin, verifyPin } from '../../controller/auth.controller';
import { authenticateJWT } from '../../middleware/jwt.middleware';

const authRoutes = Router();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/refresh-token', refreshToken);
authRoutes.post('/set-pin',authenticateJWT, setPin);
authRoutes.post('/verify-pin', authenticateJWT, verifyPin);
authRoutes.get('/me',authenticateJWT ,me);

export default authRoutes;