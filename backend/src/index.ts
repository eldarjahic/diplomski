import express, { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/user";
import bcrypt from "bcrypt";
import cors from "cors";

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

const app = express();
const port = process.env.PORT || 3000;

// allow localhost:3000 to access the api
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

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

app.post("/register", async (req: Request, res: Response) => {
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

  res.send({ id: dbUser.id });
});
