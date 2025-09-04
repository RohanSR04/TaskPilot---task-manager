const cron = require("node-cron");
const sendEmail = require("./utils/email");
const Task = require("./models/task");
const User = require("./models/user");
const moment = require("moment-timezone"); 

cron.schedule("* * * * *", async () => {
  console.log("🔍 Checking for overdue tasks...");

  try {
    const now = moment().tz("Asia/Kolkata"); //IST

    // Fetch only overdue tasks (not complete & not notified)
    const overdueTasks = await Task.find({ complete: false, overdueNotified: false });

    console.log(`Found ${overdueTasks.length} pending tasks.`);

    for (let task of overdueTasks) {
      if (!task.dueDate || !task.dueTime) {
        console.warn(`⚠️ Task "${task.title}" missing dueDate/dueTime. Skipping...`);
        continue;
      }

      //  Convert `dueDate` & `dueTime` to a Date object for comparison
      const taskDue = moment(`${task.dueDate} ${task.dueTime}`, "YYYY-MM-DD HH:mm").tz("Asia/Kolkata");

      if (now.isAfter(taskDue)) {
        console.log(`⏰ Task "${task.title}" is overdue! Sending notification...`);

        try {
          if (!task.assignedUsers || task.assignedUsers.length === 0) {
            console.error(`🚨 Task "${task.title}" has no assigned users. Skipping...`);
            continue;
          }

          
          const users = await User.find({ _id: { $in: task.assignedUsers } });
          const emails = users.map(user => user.email).filter(email => email);

          if (emails.length === 0) {
            console.error(`🚨 No valid emails found for task "${task.title}". Skipping...`);
            continue;
          }

          // Send email notifications to all assigned users
          for (const email of emails) {
            await sendEmail(
              email,
              `Task Overdue: ${task.title}`,
              `Your task "${task.title}" is overdue! Please complete it ASAP.`
            );
            console.log(`✅ Email sent to ${email} for task: ${task.title}`);
          }

          // Mark task as notified
          task.overdueNotified = true;
          await task.save();
        } catch (emailError) {
          console.error(`🚨 Failed to send email for task "${task.title}":`, emailError);
        }
      }
    }

    console.log("✅ Overdue task check completed.");
  } catch (error) {
    console.error("🚨 Error in overdue task cron:", error);
  }
});
