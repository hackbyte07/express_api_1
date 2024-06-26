import express from "express";
import signup from "./routes/auth_routes/signup";
import mongoose from "mongoose";
import login from "./routes/auth_routes/login";
import notesRouter from "./routes/notes_routes/notesRoute";
import { configDotenv } from "dotenv";
import { createServer } from "http";
import { Stream } from "stream";
import { ReadableStream } from "node:stream/web";

const app = express();
const server = createServer(app);
configDotenv();
const port = process.env.PORT;
//middleware
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).send("api is  working");
});

//routes
app.use(login);
app.use(signup);
app.use(notesRouter);

/****************/
(async () => {
  try {
    await mongoose.connect(`${process.env.mongoUrl}`);
    server.listen(port, () => {
      console.log(`server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

