import jwt from "jsonwebtoken";
import crypto from "crypto";

// JWT secret key - in production, use environment variable
const RAW_SECRET =
  process.env.JWT_SECRET || "your_super_secret_key_change_in_production";

// Function to hash the secret key for JWT
const hashSecret = (secret: string): string => {
  return crypto.createHash("sha256").update(secret).digest("hex");
};

// Hashed JWT secret for enhanced security
export const JWT_SECRET = hashSecret(RAW_SECRET);

// Interface for JWT payload
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Generate JWT token
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

// Verify JWT token
export const verifyToken = (token: string): Promise<JWTPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JWTPayload);
      }
    });
  });
};

// Export the hash function if needed elsewhere
export { hashSecret };
