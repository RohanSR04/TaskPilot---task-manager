import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/user", {
          headers,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:1000/api/v1/update-user", user, {
        headers,
      });
      alert("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error.message);
      alert("Failed to update profile: " + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-96">
        <h2 className="text-xl mb-4">Update Profile</h2>
        <label className="block">Username:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700"
        />
        <label className="block">Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700"
        />
        <label className="block">New Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700"
        />
        <button type="submit" className="w-full bg-blue-500 p-2 rounded mt-2">Update</button>
      </form>
    </div>
  );
};

export default Profile;
