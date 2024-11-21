import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// routes
import authRouters from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import matchesRoutes from "./routes/matchesRoutes.js";
import messagesRoutes from "./routes/messages.js";
import { connectDB } from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// SET THE MIDDLEWARE
// JSON TYPE WILL BE ACCPETABLE
app.use(express.json());
app.use(cookieParser());
// APP.USE ROUTES
app.use("/api/auth", authRouters);
app.use("/api/users", usersRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/messages", messagesRoutes);

app.listen(PORT, () => {
  console.log(`Server is Running in ${PORT}`);
  connectDB();
});
