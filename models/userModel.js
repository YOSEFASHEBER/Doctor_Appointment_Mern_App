import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDoctor: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    seenNotifications: {
      type: Array,
      default: [],
    },
    unSeenNotifications: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
export default userModel;
