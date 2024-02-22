import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./midleware/error";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(cors());
app.use(errorHandler);

export default app;
