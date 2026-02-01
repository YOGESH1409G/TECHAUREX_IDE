import mongoose from "mongoose";
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // reference to User model
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Optional: unique constraint to prevent same email for the same user
contactSchema.index({ user: 1, email: 1 }, { unique: true });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
