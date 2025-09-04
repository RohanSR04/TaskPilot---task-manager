import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line, Radar, Doughnut, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { RadarController, RadialLinearScale, Filler } from "chart.js";

ChartJS.register(RadarController, RadialLinearScale, Filler);


ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState(localStorage.getItem("teamId") || null);
  const [chartType, setChartType] = useState("bar");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchTeamTasks = async () => {
      if (!teamId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:1000/api/v3/teams/${teamId}/tasks`,
          { headers }
        );

        setTasks(res.data.tasks || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching team tasks:", err);
        setLoading(false);
      }
    };

    fetchTeamTasks();
  }, [teamId]);

  const low = tasks.filter((task) => task.priority === "Low").length;
  const medium = tasks.filter((task) => task.priority === "Medium").length;
  const high = tasks.filter((task) => task.priority === "High").length;

  const createdDates = tasks.map((task) => new Date(task.createdAt).toLocaleDateString());
  const dateCounts = createdDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
  const tasksPerDay = sortedDates.map((date) => dateCounts[date]);
  const overdueCount = tasks.filter(
    (task) => new Date(task.dueDate) < new Date() && task.status !== "Done"
  ).length;
  
  const notOverdueCount = tasks.length - overdueCount;

  const withAttachment = tasks.filter(task => task.attachment !== null && task.attachment !== "").length;
  const withoutAttachment = tasks.length - withAttachment;

  const completed = tasks.filter(task => task.complete === true).length;

const incomplete = tasks.length - completed;
const importantCount = tasks.filter(task => task.important === true).length;
const notImportantCount = tasks.length - importantCount;


 
const commentDates = tasks.flatMap(task =>
  (task.comments || []).map(comment => new Date(comment.createdAt).toLocaleDateString())
);

// Count comments per day
const commentMap = {};
commentDates.forEach(date => {
  commentMap[date] = (commentMap[date] || 0) + 1;
});


  const overdueChartData = {
    labels: ["Overdue", "Not Overdue"],
    datasets: [
      {
        label: "Tasks Overdue",
        data: [overdueCount, notOverdueCount],
        backgroundColor: ["#f87171", "#4ade80"],
      },
    ],
  };

  const priorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [low, medium, high],
        backgroundColor: ["#4ade80", "#facc15", "#f87171"],
        borderRadius: 5,
      },
    ],
  };

  const taskOverTimeData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Tasks Created",
        data: tasksPerDay,
        fill: false,
        borderColor: "#60a5fa",
        tension: 0.1,
      },
    ],
  };

  const lineCommentData = {
    labels: Object.keys(commentMap),
    datasets: [
      {
        type: "bar",
        label: "Comment Count",
        data: Object.values(commentMap),
        backgroundColor: "#60a5fa",
        borderRadius: 4,
        stack: "stack1",
      },
      {
        type: "line",
        label: "Comment Trend",
        data: Object.values(commentMap),
        borderColor: "#facc15",
        tension: 0.4,
        fill: false,
        stack: "stack1",
      },
    ],
  };
  

  const attachmentData = {
    datasets: [
      {
        label: "Attachments",
        data: [
          { x: 1, y: withAttachment },      
          { x: 2, y: withoutAttachment },
        ],
        backgroundColor: "#38bdf8",
        pointRadius: 6,
      },
    ],
  };
  
  

  const completionData = {
    labels: ["Completed", "Incompleted"],
    datasets: [
      {
        data: [completed, incomplete],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };

  const importantData = {
    labels: ["Important", "Not Important"],
    datasets: [
      {
        data: [importantCount, notImportantCount],
        backgroundColor: ["#facc15", "#94a3b8"], 
      },
    ],
  };

  {chartType === "completionData" && (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg flex justify-center">
      <div className="w-[300px] h-[300px]">
        <Pie data={completionData} />
      </div>
    </div>
  )}
  

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "white" } },
      title: {
        display: true,
        text: "Team Task Priority Analytics",
        color: "white",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#374151" },
      },
      y: {
        ticks: { color: "white", beginAtZero: true },
        grid: { color: "#374151" },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-4">📊 Team Analytics</h1>

      {!teamId ? (
        <p className="text-red-400 text-lg">⚠️ No team selected. Please select a team first.</p>
      ) : loading ? (
        <p className="text-white">Loading chart...</p>
      ) : tasks.length === 0 ? (
        <p className="text-white">No tasks found for this team.</p>
      ) : (
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          {/* Dropdown to switch chart */}
          <div className="mb-6">
            <select
              className="px-3 py-2 rounded bg-gray-700 text-white"
              onChange={(e) => setChartType(e.target.value)}
              value={chartType}
            >
              <option value="priority">Task Priority</option>
              <option value="taskOverTime">Tasks Over Time</option>
              <option value="overdueChart">Overdue Chart</option>
              <option value="lineCommentData">Comments Chart</option>
              <option value="attachmentData">Attachments Chart</option>
              <option value="completionData">Completion Chart</option>
              <option value="importantData">Important Chart</option>
            </select>
          </div>

          {/* Chart display based on selection */}
          {chartType === "priority" && <Bar data={priorityData} options={chartOptions} />}
          {chartType === "taskOverTime" && <Line data={taskOverTimeData} options={chartOptions} />}
          {chartType === "overdueChart" && <Line data={overdueChartData} options={chartOptions} />}
          {chartType === "lineCommentData" && (
  <Bar
    data={lineCommentData}
    options={{
      responsive: true,
      plugins: {
        legend: { labels: { color: "white" } },
      },
      scales: {
        x: { stacked: true, ticks: { color: "white" }, grid: { color: "#374151" } },
        y: { stacked: true, ticks: { color: "white" }, grid: { color: "#374151" } },
      },
    }}
  />
)}

{chartType === "attachmentData" && (
  <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
    <Scatter
      data={attachmentData}
      options={{
        responsive: true,
        plugins: {
          legend: { labels: { color: "white" } },
        },
        scales: {
          x: {
            title: { display: true, text: "Attachment Type", color: "white" },
            ticks: {
              callback: function (val) {
                return val === 1 ? "With Attachment" : "Without Attachment";
              },
              color: "white",
            },
            grid: { color: "#374151" },
            min: 0,
            max: 3,
          },
          y: {
            title: { display: true, text: "Task Count", color: "white" },
            ticks: { color: "white", beginAtZero: true },
            grid: { color: "#374151" },
          },
        },
      }}
    />
  </div>
)}


          {chartType === "completionData" && (
  <div className="flex justify-center items-center">
    <div className="w-[650px] h-[550px]">
      <Pie
        data={completionData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "white",
              },
            },
          },
        }}
      />
    </div>
  </div>
)}

{chartType === "importantData" && (
  <div className="flex justify-center items-center">
    <div className="w-[650px] h-[550px]">
      <Doughnut
        data={importantData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "white",
              },
            },
          },
        }}
      />
    </div>
  </div>
)}


        </div>
      )}
    </div>
  );
};

export default Analytics;
