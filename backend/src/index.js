import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import { connectMongoDB } from "./appLib/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Your application is runnning on port ${PORT}`);
});
