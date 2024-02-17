import app from "./app";
import router from "./route";
import { config } from "./config";
import connection from "./database";

app.use("/v1", router);

connection.on("connection", () => {
  console.log("Someone is connected");
});

app.listen(config.port, () => {
  console.log(`[server]: Server is running at http://localhost:${config.port}`);
});
