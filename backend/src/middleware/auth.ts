import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

// Middleware to verify JWT token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Expects "Bearer <token>"

    if (!token) {
      return res.status(401).send({ error: "Access denied. No token provided." });
    }

    const decoded = await verifyToken(token);
    (req as AuthRequest).user = decoded;
    next();
  } catch (error: any) {
    return res.status(403).send({ error: "Invalid or expired token." });
  }
};

