import React, { useState, useEffect } from "react";
import Cards from "../components/Home/Cards";
import axios from "axios";
import { IoAddCircleSharp } from "react-icons/io5";
import InputData from "../components/Home/InputData";
import Loader from "../components/Home/Loader";

const AllTasks = () => {
  const [InputDiv, setInputDiv] = useState("hidden");
  const [Data, setData] = useState([]);
  const [UpdatedData, setUpdatedData] = useState({
    id: "",
    title: "",
    desc: "",
  });
  const [filterPriority, setFilterPriority] = useState("");
  const [sortType, setSortType] = useState("");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v2/get-all-tasks",
        { headers }
      );
      setData(response.data.data.tasks);
    };
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      fetch();
    }
  }, []);

  const filteredData = Data.filter(task =>
    filterPriority ? task.priority === filterPriority : true
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortType === "createdAtNew") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortType === "createdAtOld") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortType === "dueDateNew") {
      return new Date(b.dueDate) - new Date(a.dueDate);
    } else if (sortType === "dueDateOld") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  return (
    <>
      {!Data.length && (
        <div className="flex items-center justify-center h-[100%]">
          <Loader />
        </div>
      )}
      <div>
        <div className="w-full flex justify-between px-4 py-2">
          <div>
            <select
              className="px-3 py-2 rounded bg-gray-700 text-white"
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              className="px-3 py-2 rounded bg-gray-700 text-white ml-2"
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="createdAtNew">Created At (New to Old)</option>
              <option value="createdAtOld">Created At (Old to New)</option>
              <option value="dueDateNew">Due Date (New to Old)</option>
              <option value="dueDateOld">Due Date (Old to New)</option>
            </select>
          </div>
          <button onClick={() => setInputDiv("fixed")}> 
            <IoAddCircleSharp className="text-4xl text-gray-400 hover:text-gray-100 transition-all duration-300" />
          </button>
        </div>
        {Data.length > 0 && (
          <Cards
            home={"true"}
            setInputDiv={setInputDiv}
            data={sortedData}
            setUpdatedData={setUpdatedData}
          />
        )}
      </div>
      <InputData
        InputDiv={InputDiv}
        setInputDiv={setInputDiv}
        UpdatedData={UpdatedData}
        setUpdatedData={setUpdatedData}
      />
    </>
  );
};

export default AllTasks;
