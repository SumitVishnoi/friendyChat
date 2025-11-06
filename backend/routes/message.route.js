import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiver",
  isAuth,
  upload.fields([
    { name: "image", maxCount: "1" },
    { name: "video", maxCount: "1" },
  ]),
  sendMessage
);
messageRouter.get("/get/:receiver", isAuth, getMessage);

export default messageRouter;
