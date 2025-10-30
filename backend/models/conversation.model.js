import mongoose from "mongoose";

const converstionSchema = new mongoose.Schema(
  {
    participant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("Conversation", converstionSchema);

export default conversationModel;
