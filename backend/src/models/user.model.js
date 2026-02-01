import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows either email or phone to be unique (not both required)
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Allow null or valid email
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ Allows multiple null values (OAuth users without phone)
      required: function () {
        return this.provider === "manual"; // only required for manual users
      },
      trim: true,
      validate: {
        validator: function (v) {
          // allow null/empty for OAuth users (they’ll verify later)
          if (!v && this.provider !== "manual") return true;
          return /^[0-9]{10}$/.test(v); // 10-digit phone validation
        },
        message: "Phone number must be 10 digits",
      },
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // exclude password by default in queries
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Hey there! I am using Techaurex",
      maxlength: [100, "Status cannot exceed 100 characters"],
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    settings: {
      notifications: { type: Boolean, default: true },
    },
    provider: {
      type: String,
      enum: ["manual", "google", "github"],
      default: "manual",
      required: true,
    },
    contacts: [
      { type: Schema.Types.ObjectId, ref: "Contact" }
    ]
    ,
    rooms: [
      {
        type: Schema.Types.ObjectId,ref: "Room"
      }
    ],
    oneToOne: [
      {
        withUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        createdAt: { type: Date, default: () => new Date() },
      },
    ],
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧠 Compare password during login.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update lastSeen and online status helper( real-time presence)
userSchema.methods.updatePresence = async function (onlineStatus) {
  this.isOnline = onlineStatus;
  this.lastSeen = new Date();
  await this.save({ validateBeforeSave: false });
};


//virtuals 
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });


userSchema.virtual("roomCount").get(function () {
  return this.rooms ? this.rooms.length : 0;
});


userSchema.virtual("oneToOneCount").get(function () {
  return this.oneToOne ? this.oneToOne.length : 0;
});


userSchema.virtual("hasAvatar").get(function () {
  return !!this.avatar;
});

// Instance method: find a 1:1 room with a specific user
userSchema.methods.findOneToOne = async function (otherUserId) {
  if (!otherUserId) return null;
  // Look in the user's oneToOne array
  const entry = this.oneToOne.find(
    (room) => room.withUser.toString() === otherUserId.toString()
  );

  if (!entry) return null;
  // Populate the room from Room collection
  const room = await mongoose.model("Room").findById(entry.roomId).exec();
  return room || null;
};



const User = mongoose.model("User", userSchema);
export default User;