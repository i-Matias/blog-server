import mysql, { Connection, QueryError } from "mysql2";
import { config } from "../config/config";
import { user, tag, post, post_tag, img } from "./table";

const connection: Connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

connection.connect((err: QueryError | null) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  }

  connection.query("USE blogdb", (err: QueryError | null) => {
    if (err) console.log("error using blogdb");
  });

  connection.query(user, (err: QueryError | null) => {
    if (err) console.error("error creating user table" + err.stack);
  });

  connection.query(tag, (err: QueryError | null) => {
    if (err) console.error("error creating tag table: " + err.stack);
  });

  connection.query(post, (err: QueryError | null) => {
    if (err) console.error("error creating post table: " + err.stack);
  });

  connection.query(post_tag, (err: QueryError | null) => {
    if (err) console.error("error creating post_tag table: " + err.stack);
  });

  connection.query(img, (err: QueryError | null) => {
    if (err) console.error("error creating img table: " + err.stack);
  });

  console.log("connected as id " + connection.threadId);
});

export default connection;
