import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Home/Navbar";
import Loader from "../components/Home/Loader";
import Footer from "../components/Home/Footer";

const Signup = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn) {
    navigate("/");
  }

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:1000/api/v1/sign-in", formData);
      setFormData({ username: "", email: "", password: "" });
      setLoading(false);
      setMessage(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center p-6 pt-20">
        {loading ? (
          <Loader />
        ) : message ? (
          <div className="text-yellow-600 text-lg bg-white shadow-md p-4 rounded-lg">{message}</div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
            <p className="text-gray-600 text-sm text-center mt-4">
              Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Signup;