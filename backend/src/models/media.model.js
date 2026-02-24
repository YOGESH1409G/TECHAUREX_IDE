import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import logger from "../config/logger.js";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video", "audio", "file"],
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    size: {
      type: Number,
      required: true,
    },
    publicId: {
      type: String,
      default: null, // Used for Cloudinary deletion
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// 🧹 Middleware: auto delete file from Cloudinary when media is removed.
mediaSchema.pre("remove", async function (next) {
  try {
    if (this.publicId) {
      await cloudinary.uploader.destroy(this.publicId);
      logger.info(`🧹 Deleted Cloudinary file: ${this.publicId}`);
    }
    next();
  } catch (error) {
    logger.error("Error deleting Cloudinary file", { error: error.message });
    next(error);
  }
});

export const Media = mongoose.model("Media", mediaSchema);
