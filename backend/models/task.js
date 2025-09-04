const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      unique: true,
    },
    important: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"], // Allow only these values
      default: "Medium",
    },
    dueDate: { 
      type: String 
    },
    dueTime: { 
      type: String 
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null 
    },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    overdueNotified: { 
      type: Boolean, default: false 
    },
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    attachment: {
      type: String,
      default: null
    },
  },
  
  
  { timestamps: true }
);

module.exports = mongoose.model("task", TaskSchema);
