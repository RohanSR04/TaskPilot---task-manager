import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { FaTasks, FaClock, FaCheckCircle } from "react-icons/fa";
import mainImage from "../assets/main.png";
import feature0 from "../assets/feature0.png"
import feature1 from "../assets/feature1.jpg"
import feature2 from "../assets/feature2.jpg"
import feature3 from "../assets/feature3.jpg"
import feature4 from "../assets/feature4.jpg"
import feature5 from "../assets/feature5.jpg"
import feature6 from "../assets/feature6.jpg"
import feature7 from "../assets/feature7.jpg"

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row items-center flex-grow text-center md:text-left bg-gradient-to-r from-blue-500 to-blue-700 text-white p-10 md:p-20">
        {/* Left Text Section */}
        <div className="md:w-1/2 space-y-6 z-10">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
            Stay Organized, Stay Productive
          </h1>
          <p className="text-lg md:text-xl">
            Manage your tasks efficiently with TaskPilot.<br></br> Plan, track, and complete tasks effortlessly.
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 font-semibold transition"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 h-full flex justify-end">
          <img 
            src={mainImage} 
            alt="Task Management" 
            className="w-full  object-cover"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center relative">
        <h2 className="text-4xl font-bold mb-2">FEATURES</h2>
        <p className="text-lg mb-12">Overview of our key features that makes us your next <span className="bg-yellow-300 text-black px-2 rounded-md">Task Management</span> partner.</p>

        <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-10 max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">OUR FEATURES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <FaTasks className="text-blue-600 text-4xl mb-4" />
              <h4 className="text-lg font-semibold">Task Management</h4>
              <p className="text-gray-600 text-sm text-center">Organize and prioritize your tasks with ease.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaClock className="text-blue-600 text-4xl mb-4" />
              <h4 className="text-lg font-semibold">Notifications & Deadlines</h4>
              <p className="text-gray-600 text-sm text-center">Never miss a task with built-in notifications.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-blue-600 text-4xl mb-4" />
              <h4 className="text-lg font-semibold">Easy Tracking</h4>
              <p className="text-gray-600 text-sm text-center">Track your progress and stay productive.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white text-black text-center" id="features">
  <div className="max-w-6xl mx-auto space-y-16">
    {/* Feature 0 - Task Management */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
      <img src={feature0} alt="Task Management" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Task Management</h3>
        <p className="text-lg text-gray-700 mt-2">Create tasks with title, description, priority, due date, time, and optional file attachments.</p>
        <p className="text-lg text-gray-700 mt-2">Mark tasks as complete or important easily.</p>
        <p className="text-lg text-gray-700 mt-2">Sort and filter tasks based on priority and due dates.</p>
        <p className="text-lg text-gray-700 mt-2">Update or delete tasks anytime with a simple UI.</p>
      </div>
    </div>

    {/* Feature 1 - Comments and Attachments */}
    <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-10">
      <img src={feature1} alt="Reminders" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Comments & Attachments</h3>
        <p className="text-lg text-gray-700 mt-2">Add comments to tasks with timestamped feedback and notes.</p>
        <p className="text-lg text-gray-700 mt-2">Attach documents or media files to relevant tasks.</p>
        <p className="text-lg text-gray-700 mt-2">Comment activity is tracked and shown in visual analytics.</p>
      </div>
    </div>

    {/* Feature 2 - Analytics Dashboard */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
      <img src={feature2} alt="Tracking" className="w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Analytics Dashboard</h3>
        <p className="text-lg text-gray-700 mt-2">Visualize task stats with bar, pie, line, doughnut, and scatter charts.</p>
        <p className="text-lg text-gray-700 mt-2">Analyze task priorities, completion status, importance, and more.</p>
        <p className="text-lg text-gray-700 mt-2">Track your productivity and activity over time.</p>
      </div>
    </div>

    {/* Feature 3 - Email Notifications */}
    <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-10">
      <img src={feature3} alt="Email Notification" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Email Notifications</h3>
        <p className="text-lg text-gray-700 mt-2">Get notified instantly via email when a task is assigned, updated, or completed.</p>
        <p className="text-lg text-gray-700 mt-2">Stay in the loop with real-time alerts to your inbox.</p>
        <p className="text-lg text-gray-700 mt-2">Reduce missed deadlines and boost task accountability.</p>
      </div>
    </div>

    {/* Feature 4 - Sorting & Filtering */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
      <img src={feature4} alt="Sort and Filter" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Smart Sorting & Filtering</h3>
        <p className="text-lg text-gray-700 mt-2">Filter tasks based on priority (High, Medium, Low) and due date.</p>
        <p className="text-lg text-gray-700 mt-2">Sort tasks by creation date or approaching deadlines for better focus.</p>
        <p className="text-lg text-gray-700 mt-2">Easily view what's urgent and what can wait.</p>
      </div>
    </div>

    {/* Feature 5 - Team Collaboration */}
    <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-10">
      <img src={feature5} alt="Teams and Collaboration" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Team Collaboration</h3>
        <p className="text-lg text-gray-700 mt-2">Invite teammates to workspaces and assign tasks collaboratively.</p>
        <p className="text-lg text-gray-700 mt-2">Track who is working on what and improve team productivity.</p>
        <p className="text-lg text-gray-700 mt-2">Manage tasks and assign users with secure invites.</p>
      </div>
    </div>

    {/* Feature 6 - Secure Authentication */}
    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
      <img src={feature6} alt="Authentication" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Secure User Authentication</h3>
        <p className="text-lg text-gray-700 mt-2">Protect your data with token-based login and password hashing.</p>
        <p className="text-lg text-gray-700 mt-2">Only authorized users can create, view, or manage tasks.</p>
        <p className="text-lg text-gray-700 mt-2">User sessions are secure and managed with JWT tokens.</p>
      </div>
    </div>

    {/* Feature 7 - Mobile Responsive Design */}
    <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-10">
      <img src={feature7} alt="Mobile Responsive" className="h-60 w-80 rounded-lg shadow-lg" />
      <div className="text-left">
        <h3 className="text-4xl md:text-6xl font-bold">Mobile Responsive</h3>
        <p className="text-lg text-gray-700 mt-2">Enjoy a smooth and responsive experience across all devices.</p>
        <p className="text-lg text-gray-700 mt-2">Optimized for desktops, tablets, and mobile screens using Tailwind CSS.</p>
        <p className="text-lg text-gray-700 mt-2">Manage your tasks on the go with mobile-friendly views.</p>
      </div>
    </div>

  </div>
</div>

      <Footer />
    </div>
  );
};

export default FrontPage;
