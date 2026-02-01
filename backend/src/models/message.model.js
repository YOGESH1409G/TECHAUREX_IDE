import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "sticker"],
      default: "text",
    },
    mediaUrl: {
      type: String,
      default: null, // for media messages.
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index for faster chat history loading
messageSchema.index({ room: 1, createdAt: -1 });

// Virtual field: quick message preview (for UI optimization)
messageSchema.virtual("preview").get(function () {
  if (this.type === "text") return this.content.slice(0, 50);
  return `[${this.type.toUpperCase()}]`;
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
