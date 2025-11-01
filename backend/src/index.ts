import express, { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/user";

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
