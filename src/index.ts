import app from "./app";
import router from "./route/route";
import { config } from "./config/config";

app.use("/v1", router);

app.listen(config.port, () => {
  console.log(`[server]: Server is running at http://localhost:${config.port}`);
});
