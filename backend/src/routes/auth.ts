import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Register endpoint
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Registered user and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400: { description: Validation error }
 */
router.post("/register", async (req: Request, res: Response) => {
  const { email, firstName, lastName, username, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).send({ error: "Username is required" });
  }

  const normalizedUsername = username.trim();

  if (normalizedUsername.length < 3) {
    return res
      .status(400)
      .send({ error: "Username must be at least 3 characters long" });
  }

  const userRepository = AppDataSource.getRepository(User);

  const emailUser = await userRepository.findOneBy({ email });
  if (emailUser) {
    return res.status(400).send({ error: "User already exists" });
  }

  const usernameUser = await userRepository
    .createQueryBuilder("user")
    .where("LOWER(user.username) = LOWER(:username)", {
      username: normalizedUsername,
    })
    .getOne();

  if (usernameUser) {
    return res.status(400).send({ error: "Username already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = userRepository.create({
    email,
    firstName,
    lastName,
    username: normalizedUsername,
    password: hashedPassword,
    role: "user",
  });

  try {
    const dbUser = await userRepository.save(newUser);

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
        username: dbUser.username,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
      },
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      return res
        .status(400)
        .send({ error: "Username already taken. Please choose another." });
    }

    console.error("Error creating user:", error);
    res.status(500).send({ error: "Failed to create user" });
  }
});

// Login endpoint
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and obtain JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: JWT and user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401: { description: Invalid credentials }
 */
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();

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
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

/**
 * @openapi
 * /auth/profile:
 *   patch:
 *     tags: [Auth]
 *     summary: Update current user profile
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       404: { description: User not found }
 */
router.patch(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, currentPassword, newPassword } =
        req.body || {};
      const userId = (req as AuthRequest).user?.userId;

      if (!userId) {
        return res.status(401).send({ error: "Unauthorized" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.id = :id", { id: userId })
        .getOne();

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      if (
        typeof email === "string" &&
        email.trim().toLowerCase() !== user.email.toLowerCase()
      ) {
        const existingEmail = await userRepository.findOneBy({
          email: email.trim(),
        });
        if (existingEmail && existingEmail.id !== user.id) {
          return res.status(400).send({ error: "Email is already in use" });
        }
        user.email = email.trim();
      }

      if (typeof firstName === "string" && firstName.trim()) {
        user.firstName = firstName.trim();
      }

      if (typeof lastName === "string" && lastName.trim()) {
        user.lastName = lastName.trim();
      }

      if (newPassword) {
        if (!currentPassword) {
          return res
            .status(400)
            .send({
              error: "Current password is required to set a new password",
            });
        }

        const isCurrentValid = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!isCurrentValid) {
          return res
            .status(400)
            .send({ error: "Current password is incorrect" });
        }

        if (typeof newPassword !== "string" || newPassword.trim().length < 6) {
          return res
            .status(400)
            .send({ error: "New password must be at least 6 characters" });
        }

        user.password = await bcrypt.hash(newPassword.trim(), 10);
      }

      const savedUser = await userRepository.save(user);

      res.send({
        user: {
          id: savedUser.id,
          email: savedUser.email,
          username: savedUser.username,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
        },
      });
    } catch (error) {
      console.error("Error updating profile", error);
      res.status(500).send({ error: "Failed to update profile" });
    }
  }
);

export default router;
