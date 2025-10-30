import uploadOnCloudinary from "../config/cloudinary.js";
import userModel from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: `getCurrentUser error ${error}`,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let user = await userModel.findByIdAndUpdate(req.userId, {
      name,
      image,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json(
      {
        message: "Edit profile successfully",
        user,
      },
      { new: true }
    );
  } catch (error) {
    return res.status(500).json({
      message: `editProfile error ${error}`,
    });
  }
};

export const getOtherUser = async (req, res) => {
  try {
    const users = await userModel
      .find({
        _id: { $ne: req.userId },
      })
      .select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: `getOther user error ${error}`,
    });
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "search again",
      });
    }

    const users = await userModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: `search user error ${error}`,
    });
  }
};
