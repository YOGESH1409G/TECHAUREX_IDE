import mongoose from "mongoose";

const { Schema } = mongoose;

const ParticipantSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    username: { type: String, trim: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    joinedAt: { type: Date, default: () => new Date() },
    joinStatus: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "approved" // direct join for public rooms
    },
  },
  { _id: false }
);

export default ParticipantSchema;
