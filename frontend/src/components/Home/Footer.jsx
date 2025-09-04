import React from "react";
import { FaInstagram, FaLinkedin, FaPinterest, FaTwitter, FaDribbble, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0c1318] text-white py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
        
        {/* Subtitle */}
        <p className="text-gray-400 mb-6">
        Got feedback, ideas, or need help? Let’s make productivity better together — reach out to us anytime!
        </p>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" className="bg-[#F4E2C7] p-2 rounded"><FaInstagram className="text-black" /></a>
          <a href="#" className="bg-[#F4E2C7] p-2 rounded"><FaLinkedin className="text-black" /></a>
          <a href="#" className="bg-[#F4E2C7] p-2 rounded"><FaPinterest className="text-black" /></a>
          <a href="#" className="bg-[#F4E2C7] p-2 rounded"><FaTwitter className="text-black" /></a>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center items-center">
          <div className="relative bg-[#11181E] p-6 rounded-lg text-center">
            <FaDribbble className="text-[#F4E2C7] text-3xl mx-auto mb-2" />
            <a href="#" className="text-white text-lg font-semibold">localhost:3000</a>
          </div>
          
          <div className="relative bg-[#11181E] p-6 rounded-lg text-center">
            <FaEnvelope className="text-[#F4E2C7] text-3xl mx-auto mb-2" />
            <a href="#" className="text-white text-lg font-semibold">rawatrohan82@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
