import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  editProfile,
  getCurrentUser,
  getOtherUser,
  search,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/other", isAuth, getOtherUser);
userRouter.put("/profile", isAuth, upload.single("image"), editProfile);
userRouter.get("/search", isAuth, search);

export default userRouter;
