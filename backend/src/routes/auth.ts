import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

const router = Router();

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;
  
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email });
  
  if (user) {
    return res.status(400).send({ error: "User already exists" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = userRepository.create({
    email,
    firstName,
    lastName,
    password: hashedPassword,
    role: "user",
  });
  
  const dbUser = await userRepository.save(newUser);

  // Generate JWT token after registration
  const token = generateToken({
    userId: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
  });

  res.send({
    token,
    user: {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role,
    },
  });
});

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email });

  if (!user) {
    return res.status(401).send({ error: "Invalid email or password" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ error: "Invalid email or password" });
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.send({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

export default router;

