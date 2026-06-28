import mongoose from "mongoose";

const userschema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  name: {
    type: String,
  },

  channelname: {
    type: String,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
  },

  joinedon: {
    type: Date,
    default: Date.now,
  },

  // -------------------------
  // NEW FIELDS
  // -------------------------

  subscriptionPlan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },

  videoLimit: {
    type: Number,
    default: 10,
  },

  premium: {
    type: Boolean,
    default: false,
  },

  downloadCount: {
    type: Number,
    default: 0,
  },

  lastDownloadDate: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("user", userschema);