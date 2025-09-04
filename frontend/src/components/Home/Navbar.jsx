import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 py-4 px-6 flex justify-between items-center transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900 bg-opacity-80 shadow-lg backdrop-blur-md"
          : "bg-gray-900"
      }`}
    >
      {/* Left Side - App Name & Navigation Links */}
      <div className="flex items-center space-x-6">
        <Link to="/frontpage" className="hover:text-blue-400">
          <h1 className="text-2xl font-bold text-blue-400">TaskPilot</h1>
        </Link>
        <Link to="/frontpage" className="hover:text-blue-400">Home</Link>
        <Link to="/contactform" className="hover:text-blue-400">Contact Us</Link>
        <a href="#features" className="hover:text-blue-400">Features</a>
      </div>

      {/* Right Side - Auth Links */}
      <div className="space-x-4">
        <Link to="/signup" className="hover:text-blue-400">Signup</Link>
        <Link to="/login" className="hover:text-blue-400">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
