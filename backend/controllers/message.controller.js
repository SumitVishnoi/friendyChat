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

    if (!sender || !receiver || (!message && !req.file)) {
      return res
        .status(400)
        .json({ message: "Sender, receiver or message missing" });
    }

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await conversationModel.findOne({
      participant: { $all: [sender, receiver] },
    });

    let newMessage = await messageModel.create({
      sender,
      receiver,
      message,
      image,
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
