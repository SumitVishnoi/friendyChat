import genToken from "../config/token.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const isUsernameAlreadyExist = await userModel.findOne({ username });

    if (isUsernameAlreadyExist) {
      return res.status(400).json({
        message: "user name already exist",
      });
    }

    const isEmailAlreadyExist = await userModel.findOne({ email });

    if (isEmailAlreadyExist) {
      return res.status(400).json({
        message: "email already exist",
      });
    }

    if (password < 6) {
      return res.status(400).json({
        message: "password must be atleast 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User sign-up successfully",
      user,
    });
  } catch (error) {
    return res.status.json({
      message: `signUp error ${error}`,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email and password",
      });
    }

    if (password < 6) {
      return res.status(400).json({
        message: "password must be atleast 6 characters",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email and password",
      });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User sign-in successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: `signIn error ${error}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `logout error ${error}`,
    });
  }
};
