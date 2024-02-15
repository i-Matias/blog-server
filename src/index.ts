import app from "./app";
import router from "./route";

// const connection: Connection = mysql.createConnection({
//   host: "localhost",
//   user: "dbuser",
//   password: "root",
//   database: "userdb",
// });

// connection.connect();

const port = process.env.PORT ?? 3000;

app.use("/v1", router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
