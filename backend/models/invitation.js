const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
  invitedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
});

const Invitation = mongoose.model("Invitation", invitationSchema); // 

module.exports = Invitation; // 
