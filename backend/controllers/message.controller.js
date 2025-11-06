import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import conversationModel from "../models/conversation.model.js";
import messageModel from "../models/message.model.js";
import { getRecevierSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    let { receiver } = req.params;
    let { message } = req.body;

    let imageUrl = null;
    let videoUrl = null;

    if (!sender || !receiver || (!message && !req.files)) {
      return res
        .status(400)
        .json({ message: "Sender, receiver or message missing" });
    }

    //upload image
    if (req.files?.image && req.files.image[0]) {
      const result = await uploadOnCloudinary(req.files.image[0].buffer);
      imageUrl = result.secure_url;
    }

    //upload video
    if (req.files?.video && req.files.video[0]) {
      const result = await uploadOnCloudinary(req.files.video[0].buffer);
      videoUrl = result.secure_url;
    }
    console.log(videoUrl);

    let conversation = await conversationModel.findOne({
      participant: { $all: [sender, receiver] },
    });

    let newMessage = await messageModel.create({
      sender,
      receiver,
      message,
      // image:image?.secure_url || image?.url || "",
      image: imageUrl,
      video: videoUrl,
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participant: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getRecevierSocketId(receiver);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({
      message: `send Message error ${error}`,
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const sender = req.userId;
    let { receiver } = req.params;
    let conversation = await conversationModel
      .findOne({
        participant: { $all: [sender, receiver] },
      })
      .populate("messages");

    if (!conversation) {
      return res.status(400).json({
        message: "conversation not found",
      });
    }
    return res.status(200).json(conversation?.messages);
  } catch (error) {
    return res.status(500).json({
      message: `get Message error ${error}`,
    });
  }
};
