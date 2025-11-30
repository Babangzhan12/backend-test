import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Account, Profile, Role, User } from '../model/index.model';
import { AuthRequest, AuthUser, generateRefreshToken, generateToken, verifyRefreshToken } from '../middleware/jwt.middleware';
import { RequestWithUser } from '../base/base.controller';
import { jsonBadRequest, jsonSuccess } from '../utils/responses';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ 
      where: { username },
      include: [{
        model: Role,
        foreignKey: 'roleId', 
        as: 'role'
      }]
    });

    if (!user) {
       res.status(401).json({ message: 'Invalid credentials' });
       return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
       res.status(401).json({ message: 'username or password invalid' });
       return;
    }

    const token = generateToken({
      userId: user.userId || "",
      role: user.role?.name || "",
      username: user.username || "",
    })

    const refreshToken = generateRefreshToken({
      userId: user.userId || "",
      role: user.role?.name || "",
      username: user.username || "",
    })

    return void res.json({
        token,
        refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
     res.status(500).json({ message: 'Internal server error' });
  }
};

export const me = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const { userId } = req.user!;

    const user = await User.findByPk(userId, {
      attributes: ["userId", "username", "roleId", "pin"],
      include: [
        { model: Role, attributes: ["name"], as: "role" },
        { model: Profile, as: "profile" },
        { model: Account, as: "accounts" }
      ]
    });
    console.log("me",user)

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      userId: user.userId,
      username: user.username,
      role: user.role?.name || null,
      hasProfile: !!user.profile,
      profile: user.profile || null,
      hasPin: !!user.pin,
      accounts: user.accounts || [],
      message: "User information retrieved successfully"
    });

  } catch (err) {
    console.error("ME endpoint error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password} = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
       res.status(409).json({ message: 'Username already exists' });
       return;
    }

    const defaultRole = await Role.findOne({ where: { name: 'customer' } });
    if (!defaultRole) {
      res.status(500).json({ message: 'Default role customer not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      roleId: defaultRole.roleId,
    });

     res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error: any) {
    console.error('Register error:', error);
     res.status(400).json({ message: error.message || 'Registration failed' });
  }

};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
       res.status(400).json({ message: 'Refresh token is required' });
       return;
    }
    
    const checkrefreshToken = verifyRefreshToken(refreshToken);
  
    const token = generateToken({
      userId: checkrefreshToken?.userId || "",
      role: checkrefreshToken?.role || "",
      username: checkrefreshToken?.username || "",
    })

    const newRefreshToken = generateRefreshToken({
      userId: checkrefreshToken?.userId || "",
      role: checkrefreshToken?.role || "",
      username: checkrefreshToken?.username || "",
    })

    res.json({ token,refreshToken: newRefreshToken });
  } catch (error:any) {
    if (error instanceof jwt.JsonWebTokenError) {
      if (res) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
        return
      }
    } 
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
   res.json({ message: 'Logout successful' });
}

export const setPin = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const { pin } = req.body;
         const { userId } = req.user!;
         console.log("userUId",userId)
         console.log("pin",pin)
    
        if (!/^\d{6}$/.test(pin)) {
          res.status(400).json({ message: "PIN harus 6 digit angka" });
          return;
        }
        const saltRounds = 12; 
        const pinHash = await bcrypt.hash(pin, saltRounds)
    
        await User.update(
          { pin: pinHash },       
          { where: { userId: userId } }
        );
    
        res.json({ message: "PIN berhasil disimpan" });
    } catch (error) {
         console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyPin = async (req: RequestWithUser, res: Response) => {
   try {
    const { pin } = req.body;
    const { userId } = req.user!;

    if (!/^\d{6}$/.test(pin)) {
      return jsonBadRequest(res, "Pin Invalid");
    }

    const user = await User.findByPk(userId);

    if (!user || !user.pin) {
      return jsonBadRequest(res, "Pin Belum di Set");
    }

    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return jsonBadRequest(res, "Pin Salah");
    }

    jsonSuccess(res,true);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}