import express, { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
import cors from "cors";
import authRoutes from "./routes/auth";
import propertiesRoutes from "./routes/properties";
import messagesRoutes from "./routes/messages";
import favoritesRoutes from "./routes/favorites";
import contactRoutes from "./routes/contact";
import mailerRoutes from "./routes/mailer";
import { authenticateToken, AuthRequest } from "./middleware/auth";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();
const port = process.env.PORT || 3000;

// allow frontend dev/preview to access the api
const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) || []),
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:4173",
  "https://eldi.deployer3000.halvooo.com",
];

const corsOptions: cors.CorsOptions = {
  // reflect the requesting origin; still list known hosts for docs
  origin: (origin, callback) => callback(null, true),
  credentials: true,
};

app.use(cors(corsOptions));
// Use a RegExp for preflight handling to avoid path-to-regexp string parsing issues
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req: Request, res: Response) =>
  res.json(swaggerSpec)
);

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

// Messages routes
app.use("/messages", messagesRoutes);

// Favorites routes
app.use("/favorites", favoritesRoutes);
// Contact routes
app.use("/contact", contactRoutes);
// Mailer routes
app.use("/mailer", mailerRoutes);
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
  .then(async () => {
    console.log("📦 Data Source has been initialized!");

    // Run migrations
    console.log("🔄 Running migrations...");
    await AppDataSource.runMigrations();
    console.log("✅ Migrations completed!");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
