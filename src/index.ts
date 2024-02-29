import app from "./app";
import router from "./route/route";
import { config } from "./config/config";
import usersRoute from "./route/users.route"
import postRoute from "./route/posts.route"
import { authToken } from "./midleware/auth";

// app.use("/v1", router);
app.use("/v1/users", usersRoute);
app.use("/v1/posts", authToken, postRoute);
app.listen(config.port, () => {
  console.log(`[server]: Server is running at http://localhost:${config.port}`);
});
