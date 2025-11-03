import express, { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
import cors from "cors";
import authRoutes from "./routes/auth";
import propertiesRoutes from "./routes/properties";
import { authenticateToken, AuthRequest } from "./middleware/auth";

const app = express();
const port = process.env.PORT || 3000;

// allow localhost:3000 to access the api
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    id: Number(userId),
  });

  res.send({ user: user });
});

// Authentication routes
app.use("/auth", authRoutes);

// Properties routes
app.use("/properties", propertiesRoutes);

// Example protected route (requires authentication)
app.get("/profile", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.userId;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id: userId! });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  res.send({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
});

// Start server after database initialization
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Data Source has been initialized!");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
