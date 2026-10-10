
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true,
      trim: true
    },
    channels: {
      type: [String],
      required: true,
      enum: ["email", "push", "inapp"]
    },
    status: {
      email: {
        type: String,
        enum: ["queued", "processing", "sent", "failed"],
        default: "queued"
      },
      push: {
        type: String,
        enum: ["queued", "processing", "sent", "failed"],
        default: "queued"
      },
      inapp: {
        type: String,
        enum: ["queued", "processing", "sent", "failed"],
        default: "queued"
      }
    },
    scheduledAt: {
      type: Date,
      default: null
    },
    attempts: {
      type: Number,
      default: 0
    },
    error: {
      type: String,
      default: null
    },
    source: {
      type: String,
      enum: ["dashboard", "api", "agent"],
      default: "api"
    }
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
