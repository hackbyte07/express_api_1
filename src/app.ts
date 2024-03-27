import express from "express";
import { configDotenv } from "dotenv";
import signup from "./routes/auth_routes/signup";
import mongoose from "mongoose";
import login from "./routes/auth_routes/login";
import notesRouter from "./routes/notes_routes/notesRoute";

const app = express();
configDotenv();
const port = process.env.PORT;
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("api is working");
});

app.use(login);
app.use(signup);
app.use(notesRouter);

/****************/
(async () => {
  try {
    await mongoose.connect(`${process.env.mongoUrl}`);
    app.listen(port, () => {
      console.log(`server is running at https://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
