const express = require("express");
const router = express.Router();
const mongoose = require("mongoose"); // ✅ Ensure mongoose is imported
const Team = require("../models/team");
const User = require("../models/user"); // ✅ Import the User model
const Invitation = require("../models/invitation");
const { authenticateToken } = require("./auth");
const sendEmail = require("../utils/email"); // ✅ Correct


router.post("/create-team/inv", async (req, res) => {
  try {
    const { name, userId, members = [] } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: "Team name and user ID are required" });
    }

    // Create a new team with only the creator
    const newTeam = new Team({
      name,
      members: [userId],
      createdBy: userId, // Only the creator is added initially
    });

    await newTeam.save();

    // Send invitations to other members
    if (members.length > 0) {
      const memberUsers = await User.find({ email: { $in: members } });

      if (memberUsers.length !== members.length) {
        return res.status(400).json({ message: "One or more users not found" });
      }

      const memberIds = memberUsers.map(user => user._id.toString());

      // Create invitations (but don't add them to the team yet)
      const invitations = memberIds.map((memberId) => ({
        teamId: newTeam._id,
        invitedUser: memberId,
        invitedBy: userId,
        status: "Pending",
      }));

      await Invitation.insertMany(invitations);

      // Send email notifications
      const emails = memberUsers.map(user => user.email);
      if (emails.length > 0) {
        sendEmail(
          emails,
          "You've been invited to a new team!",
          `Hello,\n\nYou have been invited to join the team "${name}". Please accept the invitation to join.`
        );
      }
    }

    res.status(201).json({ message: "Team created successfully, invitations sent", team: newTeam });

  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Server error", error });
  }
});






// Get all invitations for a user
router.get("/users/:userId/invitations", authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch pending invitations
      const invitations = await Invitation.find({ invitedUser: userId, status: "Pending" })
        .populate("teamId", "name") 
        .populate("invitedBy", "email");
  
      res.status(200).json({ invitations });
    } catch (error) {
      console.error("Error fetching invitations:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  
// Accept or reject invitation
router.post("/invitations/:inviteId/respond", authenticateToken, async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { response } = req.body; // "Accepted" or "Rejected"
    const userId = req.user.id;

    console.log("API Request - Invite ID:", inviteId);
    console.log("Authenticated User ID:", userId);

    const invitation = await Invitation.findById(inviteId);
    if (!invitation) {
      console.log("Invitation not found");
      return res.status(404).json({ message: "Invitation not found" });
    }

    console.log("Invitation belongs to:", invitation.invitedUser.toString());

    if (invitation.invitedUser.toString() !== userId) {
      console.log("Unauthorized Access: User does not match invitation's invitedUser");
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Fetch team details to get creator's ID
    const team = await Team.findById(invitation.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const creatorId = team.members[0]; // First member is always the creator
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Team creator not found" });
    }

    // Get member's name for email
    const member = await User.findById(userId);

    if (response === "Accepted") {
      await Team.findByIdAndUpdate(invitation.teamId, { $push: { members: userId } });
    }

    invitation.status = response;
    await invitation.save();

    // Send email to team creator about the response
    sendEmail(
      creator.email,
      `Team Invitation ${response}!`,
      `Hello ${creator.username},\n\n${member.username} has ${response.toLowerCase()} your invitation to join the team "${team.name}".\n\nBest regards,\nTeam Management`
    );

    res.status(200).json({ message: `Invitation ${response.toLowerCase()} successfully` });
  } catch (error) {
    console.error("Error responding to invitation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

  
  
  //Count pending invitations
  router.get("/users/:userId/invitations/count", authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Count pending invitations
      const pendingCount = await Invitation.countDocuments({ invitedUser: userId, status: "Pending" });
  
      res.status(200).json({ pendingCount });
    } catch (error) {
      console.error("Error fetching invitation count:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


  // Invite Member API
router.post("/teams/invite/:teamId", authenticateToken, async (req, res) => {
  try {
    const { teamId, userId, members = [] } = req.body;

    if (!teamId || !userId) {
      return res.status(400).json({ message: "Team ID and user ID are required" });
    }

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Convert emails in members array to ObjectIds
    const memberUsers = await User.find({ email: { $in: members } });

    if (memberUsers.length !== members.length) {
      return res.status(400).json({ message: "One or more users not found" });
    }

    // Extract ObjectIds from fetched users
    const memberIds = memberUsers.map(user => user._id.toString());

    // Ensure unique members, excluding already existing ones
    const newMembers = memberIds.filter(id => !team.members.includes(id));

    if (newMembers.length === 0) {
      return res.status(400).json({ message: "Users are already in the team" });
    }

    

    // Create invitations
    const invitations = newMembers.map((memberId) => ({
      teamId: team._id,
      invitedUser: memberId,
      invitedBy: userId,
      status: "Pending",
    }));

    await Invitation.insertMany(invitations);

    // Send emails
    const emails = memberUsers.map(user => user.email);
    if (emails.length > 0) {
      sendEmail(
        emails,
        "You've been invited to a team!",
        `Hello,\n\nYou have been added to the team "${team.name}". Check it out!`
      );
    }

    res.status(200).json({ message: "Members invited successfully", team });

  } catch (error) {
    console.error("Error inviting members:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



// Invite a User to a Team
router.post("/create-team/invite", authenticateToken, async (req, res) => {
  try {
    const { teamId, members = [] } = req.body;
    const userId = req.user.id; // ✅ Get user ID from token

    if (!teamId) return res.status(400).json({ message: "Team ID is required" });
    if (!members || members.length === 0) return res.status(400).json({ message: "At least one member email is required" });

    // Convert emails in members array to ObjectIds
    const memberUsers = await User.find({ email: { $in: members } });
    if (memberUsers.length !== members.length) return res.status(400).json({ message: "One or more users not found" });

    const memberIds = memberUsers.map(user => user._id.toString());

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    // Ensure user sending the request is part of the team
    if (!team.members.includes(userId)) return res.status(403).json({ message: "You are not authorized to invite members" });

    // Remove users who are already in the team
    const filteredMemberIds = memberIds.filter(memberId => !team.members.includes(memberId));
    if (filteredMemberIds.length === 0) return res.status(400).json({ message: "All users are already in the team" });

    // Add invitations 
    const invitations = filteredMemberIds.map((memberId) => ({
      teamId: teamId,
      invitedUser: memberId,
      invitedBy: userId,
      status: "Pending",
    }));

    await Invitation.insertMany(invitations); 

    // Send emails
    const emails = memberUsers.map(user => user.email);
    if (emails.length > 0) {
      sendEmail(
        emails,
        "You've been invited to a team!",
        `Hello,\n\nYou have been added to the team "${team.name}". Check it out!`
      );
    }

    res.status(201).json({ message: "Invitations sent successfully", invitations });
  } catch (error) {
    console.error("Error inviting member:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

