const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
require("./taskscheduler");

const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");
const TeamAPI = require("./routes/team");
const { authRouter } = require("./routes/auth");
const InvitationAPI = require("./routes/invitation");
const AnalyticsAPI = require("./routes/analytics");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", UserAPI);
app.use("/api/v1", authRouter);
app.use("/api/v2", TaskAPI);
app.use("/api/v3", TeamAPI); 
app.use("/api/v4", InvitationAPI);
app.use("/api/v5", AnalyticsAPI);


const PORT = process.env.PORT || 1000;

app.listen(PORT, () => {
  console.log("Server started");
});


