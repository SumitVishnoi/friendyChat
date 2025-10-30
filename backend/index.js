import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import cors from "cors";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const Port = process.env.PORT;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://friendychat.netlify.app"],
    credentials: true,
  })
);

app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res)=> {
  res.send("server started")
})

server.listen(Port, () => console.log("server running on Port", Port));
