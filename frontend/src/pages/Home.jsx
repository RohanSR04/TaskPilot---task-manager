import React from "react";
import Sidebar from "../components/Home/Sidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-4">
  <div className="w-none lg:w-1/6 border border-gray-500 rounded-xl p-4 flex flex-col h-[98vh]">
  <Sidebar />
</div>

  <div className="w-full lg:w-5/6 border border-gray-500 rounded-xl p-4 overflow-y-auto max-h-screen">
    <Outlet />
  </div>
</div>

  );
};

export default Home;
