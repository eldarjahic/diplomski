import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "diplomski",
  synchronize: false,
  logging: true,
  entities: [__dirname + "/entity/*.ts"],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});
