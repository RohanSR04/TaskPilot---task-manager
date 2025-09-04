const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const User = require("../models/user");
const Task = require("../models/task"); 
const { authenticateToken } = require("./auth");
const sendEmail = require("../utils/email");
const Invitation = require("../models/invitation")
const mongoose = require("mongoose");

// Create a new team (only creator is added initially)
router.post("/create-team", async (req, res) => {
  try {
    const { name, userId, members = [] } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: "Team name and user ID are required" });
    }

    // Create a new team with only the creator
    const newTeam = new Team({
      name,
      members: [userId],  // Only the creator is added initially
      createdBy: userId, 
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



router.get("/teams/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // validate ObjectI dformat
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const teams = await Team.find({ members: new mongoose.Types.ObjectId(userId) });

    if (!teams.length) {
      return res.status(404).json({ message: "No teams found for this user" });
    }

    res.status(200).json({ teams });
  } catch (error) {
    console.error("🚨 Error fetching teams:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get a specific team by ID
router.get("/teams/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all users except the current user
router.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ _id: { $ne: userId } });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all tasks for a team
router.get("/teams/:teamId/tasks", async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const tasks = await Task.find({ teamId });

    
    return res.status(200).json({ tasks: tasks.length > 0 ? tasks : [] });
  } catch (error) {
    console.error("Error fetching team tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/teams/:teamId/add-task", async (req, res) => {
  try {
    console.log("✅ Received Request:", req.body);

    // Validate Team ID
    const { teamId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid team ID format" });
    }

    // Fetch team and populate members
    const team = await Team.findById(teamId).populate("members", "_id email name");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    console.log("🔍 Team Found:", team);
    console.log("👥 Team Members:", team.members);

    // Validate members
    if (!team.members || team.members.length === 0) {
      return res.status(400).json({ message: "No members found in this team" });
    }

    const { title, desc, priority = "Medium", dueDate, dueTime, attachment } = req.body;

    if (!title || !desc || !dueDate || !dueTime) {
      return res.status(400).json({ message: "Title, description, due date, and due time are required" });
    }

    // Assign task to all team members
    const assignedUsers = team.members.map((member) => member._id);
    console.log("✅ Assigned Users:", assignedUsers);

    if (assignedUsers.length === 0) {
      return res.status(400).json({ message: "No users assigned to this task" });
    }

    const newTask = new Task({
      title,
      desc,
      priority,
      dueDate,
      dueTime,
      teamId,
      assignedUsers,
      attachment
    });

    await newTask.save();

    // email
    const emails = team.members.map((member) => member.email);
    if (emails.length > 0) {
      await sendEmail(
        emails,
        `New Task Assigned: ${title}`,
        `Hello Team,\n\nA new task "${title}" has been added to your team "${team.name}". Please check it out.`
      );
    }

    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("🚨 Server error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});




router.delete("/teams/:teamId/tasks/:taskId", authenticateToken, async (req, res) => {
  try {
    const { teamId, taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    await Task.findByIdAndDelete(taskId);
    console.log(`✅ Task "${task.title}" deleted successfully.`); 

    
    const team = await Team.findById(teamId).populate("members", "email");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const emails = team.members.map(member => member.email);
    console.log(`📧 Sending email to: ${emails}`); 

    // Send email 
    if (emails.length > 0) {
      await sendEmail(
        emails,
        "Task Deleted",
        `Hello,\n\nThe task "${task.title}" has been deleted from your team "${team.name}".`
      );
      console.log("📨 Email sent successfully!");
    } else {
      console.log("⚠️ No emails found, skipping email notification.");
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete a team and notify members
router.delete("/teams/:teamId", authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.id;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID is required" });
    }

    // Fetch team with createdBy
    const team = await Team.findById(teamId).populate("members", "email name");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Allow only creator to delete
    if (team.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the team creator can delete this team" });
    }

    // Collect emails before deletion
    const emails = team.members.map(member => member.email);

    // Delete team
    await Team.findByIdAndDelete(teamId);

    // Notify members
    if (emails.length > 0) {
      await sendEmail(
        emails,
        "Team Deleted",
        `Hello,\n\nThe team "${team.name}" has been deleted by the creator.`
      );
    }

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("🚨 Error deleting team:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





// Update an existing task in a team
router.put("/teams/:teamId/tasks/:taskId", authenticateToken, async (req, res) => {
  try {
    const { teamId, taskId } = req.params;
    const { title, desc, priority, dueDate, dueTime } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, desc, priority, dueDate, dueTime },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    const team = await Team.findById(teamId).populate("members", "email");
    const emails = team.members.map(member => member.email);
    if (emails.length > 0) {
      sendEmail(
        emails,
        "Task Updated",
        `Hello,\n\nThe task "${updatedTask.title}" in your team "${team.name}" has been updated. Please review the changes.`
      );
    }
    res.status(200).json({ message: "Team task updated successfully" });
  } catch (error) {
    console.error("Error updating team task:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

// Get team details including name and members
router.get("/teams/fetch/:teamId", authenticateToken, async (req, res) => {
  try {
    const { teamId } = req.params;

   
    const team = await Team.findById(teamId).populate("members", "username email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      teamName: team.name,
      members: team.members, 
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Leave Team API
router.delete("/teams/leave/:teamId", authenticateToken, async (req, res) => {
  try {
    console.log("Request received: ", req.params.teamId); 
    console.log("User ID: ", req.user.id); // 

    const userId = req.user.id;
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid Team ID" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: "You are not a member of this team" });
    }

    team.members = team.members.filter((member) => member.toString() !== userId);
    await team.save();

    res.json({ message: "You have left the team successfully" });
  } catch (error) {
    console.error("Error leaving team:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;