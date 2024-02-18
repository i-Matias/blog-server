import app from "./app";
import router from "./route/route";
import { config } from "./config/config";
import connection from "./database/database";

app.use("/v1", router);

connection.on("connection", () => {
  console.log("Someone is connected");
});

app.listen(config.port, () => {
  console.log(`[server]: Server is running at http://localhost:${config.port}`);
});
