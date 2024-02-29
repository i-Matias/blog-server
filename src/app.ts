import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./midleware/error";

dotenv.config();

const app: Express = express();
app.use("/files/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(cors());
app.use(errorHandler);

process.on("uncaughtException", (e) => {
  console.log(e);
  process.exit(1);
});

export default app;
