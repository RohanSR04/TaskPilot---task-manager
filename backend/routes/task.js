const express = require("express");
const router = express.Router();
const Team = require("../models/team");
const User = require("../models/user");
const Task = require("../models/task"); 
const { authenticateToken } = require("./auth");
const sendEmail = require("../utils/email");

router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc, priority = "Medium", dueDate, dueTime, attachment } = req.body; // Removed assignedUsers from body
    const userId = req.user.id; // Get user ID from the authentication middleware

    // Create a new task with userId as assignedUser
    const newTask = new Task({ 
      title, 
      desc, 
      priority, 
      dueDate, 
      dueTime, 
      assignedUsers: [userId], // Assign logged-in user
      attachment
    });

    const saveTask = await newTask.save();

    // Add task reference to the user's tasks array
    await User.findByIdAndUpdate(userId, { $push: { tasks: saveTask._id } });

    res.status(200).json({ message: "Task Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.id;

    // Remove task from user's task list
    await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });

    // Find task before deleting to get details
    const task = await Task.findById(id).populate("teamId"); 
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    console.log(`✅ Task "${task.title}" deleted successfully.`);

    // If task is linked to a team the nsend email
    if (task.teamId) {
      const team = await Team.findById(task.teamId).populate("members", "email");
      if (team && team.members.length > 0) {
        const emails = team.members.map(member => member.email);

        console.log(`📧 Sending email to: ${emails}`);

        await sendEmail(
          emails,
          "Task Deleted",
          `Hello,\n\nThe task "${task.title}" has been deleted from your team "${team.name}".`
        );

        console.log("📨 Email sent successfully!");
      } else {
        console.log("⚠️ No team members found, skipping email notification.");
      }
    } else {
      console.log("⚠️ Task is not associated with any team.");
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("🚨 Error deleting task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





//get All Tasks sorted by priority
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { priority: -1, createdAt: -1 } },
    });
    res.status(200).json({ data: userData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

//update Task including priority
router.put("/update-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, priority, dueDate, dueTime, attachment } = req.body; 

    await Task.findByIdAndUpdate(id, { title, desc, priority, dueDate, dueTime, attachment }); 

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});


// get tasks by priority (low, medium, high)
router.get("/get-tasks-by-priority/:priority", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { priority } = req.params;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { priority },
      options: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: Data.tasks });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

//update-Important Task
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    const ImpTask = TaskData.important;
    await Task.findByIdAndUpdate(id, { important: !ImpTask });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

//update-Complete Task
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    const CompleteTask = TaskData.complete;
    await Task.findByIdAndUpdate(id, { complete: !CompleteTask });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

//get important tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });
    const ImpTaskData = Data.tasks;
    res.status(200).json({ data: ImpTaskData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});

//get completed tasks
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: true },
      options: { sort: { createdAt: -1 } },
    });
    const CompTaskData = Data.tasks;
    res.status(200).json({ data: CompTaskData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});


//get incompleted tasks
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: false },
      options: { sort: { createdAt: -1 } },
    });
    const CompTaskData = Data.tasks;
    res.status(200).json({ data: CompTaskData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal Server Error" });
  }
});


// Get overdue tasks for the current user
router.get("/get-overdue-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; 
    const currentDate = new Date().toISOString().split("T")[0]; 

    const userData = await User.findById(id).populate({
      path: "tasks",
      match: { 
        complete: false, 
        dueDate: { $lt: currentDate }, 
      },
      options: { sort: { dueDate: 1 } }, 
    });

    const overdueTasks = userData.tasks;
    res.status(200).json({ data: overdueTasks });
  } catch (error) {
    console.log("Error fetching overdue tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get overdue tasks for the current user
router.get("/get-overdue-tasks", authenticateToken, async (req, res) => {
  try {
    const currentDateTime = new Date();

    const overdueTasks = await Task.find({
      dueDate: { $lt: currentDateTime.toISOString().split("T")[0] }, // Check past due dates
      complete: false, // Exclude completed tasks
      assignedUsers: req.user.id, 
    });

    res.status(200).json({ data: overdueTasks });
  } catch (error) {
    console.error("Error fetching overdue tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = router;

// Route to get teams by user ID
router.get("/teams/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const teams = await Team.find({ members: userId }); 

    if (!teams.length) {
      return res.status(404).json({ message: "No teams found for this user" });
    }

    res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});










// Add Comment
router.post("/add-comment/:taskId", async (req, res) => {
  try {
    const { comment } = req.body;
    const userId = req.headers.id; 

    // Validate data
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Add comment
    task.comments.push({ userId, text: comment });
    await task.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Delete Comment
router.delete("/delete-comment/:taskId/:commentId", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    console.log("Before Deletion:", task.comments);

    task.comments = task.comments.filter(comment => 
  !(comment._id.toString() === req.params.commentId && comment.userId.toString() === req.headers.id)
);

    console.log("After Deletion:", task.comments);

    await task.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


router.get("/user", async (req, res) => {
  try {
    const userId = req.headers.id;
    const tasks = await Task.find({ assignedUsers: userId });
    res.json({ tasks }); 
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});





module.exports = router;
