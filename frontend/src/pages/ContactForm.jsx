import { useState } from "react";
import React from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        alert("Email sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Error: " + data.error);
      }
      window.location.reload();
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to send email");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
  <Navbar />

  {/* Contact Form Section */}
  <div className="flex flex-col items-center justify-center flex-grow text-center bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 pt-20">
    <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
      Get in Touch
    </h2>
    <p className="text-lg md:text-xl mb-6">
      We'd love to hear from you! Fill out the form below.
    </p>

    {/* Form Container */}
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-gray-800"
    >
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="5"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700 font-semibold transition"
      >
        Send Message
      </button>
    </form>
  </div>

  <Footer />
</div>

  );
};

export default ContactForm;
