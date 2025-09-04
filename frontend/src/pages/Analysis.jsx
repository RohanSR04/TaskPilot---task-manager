import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line, Doughnut, Scatter } from "react-chartjs-2";
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
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Analysis = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("priority");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const res = await axios.get("http://localhost:1000/api/v2/user", { headers });
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, []);

  // ---- Analytics Calculations ----
  const low = tasks.filter((t) => t.priority === "Low").length;
  const medium = tasks.filter((t) => t.priority === "Medium").length;
  const high = tasks.filter((t) => t.priority === "High").length;

  const completed = tasks.filter((t) => t.complete).length;
  const incomplete = tasks.length - completed;

  const important = tasks.filter((t) => t.important).length;
  const notImportant = tasks.length - important;

  const withAttachment = tasks.filter((t) => t.attachment).length;
  const withoutAttachment = tasks.length - withAttachment;

  const commentDates = tasks.flatMap((task) =>
    (task.comments || []).map((c) => new Date(c.createdAt).toLocaleDateString())
  );
  const commentMap = {};
  commentDates.forEach((date) => {
    commentMap[date] = (commentMap[date] || 0) + 1;
  });

  // ---- Chart Data Configs ----
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

  const completionData = {
    labels: ["Completed", "Incomplete"],
    datasets: [
      {
        data: [completed, incomplete],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };

  const importanceData = {
    labels: ["Important", "Not Important"],
    datasets: [
      {
        data: [important, notImportant],
        backgroundColor: ["#facc15", "#94a3b8"],
      },
    ],
  };

  const attachmentData = {
    datasets: [
      {
        label: "Tasks",
        data: [{ x: withAttachment, y: withoutAttachment }],
        backgroundColor: "#38bdf8",
      },
    ],
  };

  const commentData = {
    labels: Object.keys(commentMap),
    datasets: [
      {
        label: "Comments Over Time",
        data: Object.values(commentMap),
        borderColor: "#60a5fa",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  // ---- Chart Options ----
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "white" } },
      title: {
        display: true,
        text: "User Task Analytics",
        color: "white",
        font: { size: 18 },
      },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "#374151" } },
      y: { ticks: { color: "white" }, grid: { color: "#374151" } },
    },
  };

  // ---- Component JSX ----
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-6">📊 User Analytics</h1>

      {loading ? (
        <p className="text-white">Loading chart...</p>
      ) : tasks.length === 0 ? (
        <p className="text-white">No tasks found.</p>
      ) : (
        <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
          {/* Chart Switcher */}
          <div className="mb-6">
            <select
              className="px-4 py-2 rounded bg-gray-700 text-white"
              onChange={(e) => setChartType(e.target.value)}
              value={chartType}
            >
              <option value="priority">📌 Task Priority</option>
              <option value="completion">✅ Completion Status</option>
              <option value="importance">⭐ Importance</option>
              <option value="attachments">📎 Attachments</option>
              <option value="comments">💬 Comments Over Time</option>
            </select>
          </div>

          {/* Chart Display */}
          {chartType === "priority" && <Bar data={priorityData} options={chartOptions} />}
          {chartType === "completion" && (
            <div className="flex justify-center">
              <div className="w-[650px] h-[550px]">
                <Pie data={completionData} options={chartOptions} />
              </div>
            </div>
          )}
          {chartType === "importance" && (
            <div className="flex justify-center">
              <div className="w-[650px] h-[550px]">
                <Doughnut data={importanceData} options={chartOptions} />
              </div>
            </div>
          )}
          {chartType === "attachments" && <Scatter data={attachmentData} options={chartOptions} />}
          {chartType === "comments" && <Line data={commentData} options={chartOptions} />}
        </div>
      )}
    </div>
  );
};

export default Analysis;
