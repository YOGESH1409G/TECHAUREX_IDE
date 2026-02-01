import mongoose from "mongoose";

const { Schema } = mongoose;

const LastMessageSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Message" },
    text: { type: String },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date },
  },
  { _id: false }
);

export default LastMessageSchema;
