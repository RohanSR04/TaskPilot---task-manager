const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticateToken } = require("./auth"); 
const Invitation = require("../models/invitation");
const Task = require("../models/task");
const Team = require("../models/team");

// Team Activity Tracking
router.get("/teams/:teamId/activity", authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    const totalInvites = await Invitation.countDocuments({ teamId });
    const accepted = await Invitation.countDocuments({ teamId, status: "Accepted" });
    const rejected = await Invitation.countDocuments({ teamId, status: "Rejected" });
    const pending = await Invitation.countDocuments({ teamId, status: "Pending" });

    res.status(200).json({ totalInvites, accepted, rejected, pending });
  } catch (error) {
    console.error("Error fetching team activity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Member Participation
router.get("/teams/:teamId/participation", authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    const memberActivity = await Task.aggregate([
      { $match: { teamId: new mongoose.Types.ObjectId(teamId) } },
      { $group: { _id: "$completedBy", tasksCompleted: { $sum: 1 } } },
      { $sort: { tasksCompleted: -1 } },
    ]);

    res.status(200).json({ memberActivity });
  } catch (error) {
    console.error("Error fetching participation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Team Growth Stats
router.get("/teams/:teamId/growth", authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.params;

    const growthStats = await Team.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(teamId) } },
      { $unwind: "$members" },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({ growthStats });
  } catch (error) {
    console.error("Error fetching team growth stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
