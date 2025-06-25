import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "../config/db";
import userRoutes from "../routes/userRoutes";

dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/user", userRoutes);

//port
const PORT = process.env.PORT || 1234;

//routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the server</h1>");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
