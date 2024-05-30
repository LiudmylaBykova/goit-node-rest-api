import express from "express";
import path from "node:path";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { DB_URI, PORT = 3000 } = process.env;
mongoose
  .connect(DB_URI)
  .then(() => app.listen(PORT), console.log("Database connection successful"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
