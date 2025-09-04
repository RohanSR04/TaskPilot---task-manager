import React, { useEffect, useState, useMemo } from "react";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { TbNotebookOff, TbAlarmOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoMdAnalytics } from "react-icons/io";


const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [MobileNav, setMobileNav] = useState("hidden");
  const [Data, setData] = useState();
  const [teams, setTeams] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const data = [
    { title: "All Tasks", icon: <CgNotes />, link: "/" },
    { title: "Important Tasks", icon: <MdLabelImportant />, link: "/importantTasks" },
    { title: "Completed Tasks", icon: <FaCheckDouble />, link: "/completedTasks" },
    { title: "Incompleted Tasks", icon: <TbNotebookOff />, link: "/incompletedTasks" },
    { title: "Overdue Tasks", icon: <TbAlarmOff />, link: "/overdueTasks" },
    { title: "Analysis", icon: <IoMdAnalytics />, link: "/analysis" },
  ];

  // Memoizing headers
  const headers = useMemo(() => ({
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  }), [localStorage.getItem("id"), localStorage.getItem("token")]);

  // Logout function
  const logout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    history("/signup");
  };

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v2/get-all-tasks", { headers });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (headers.id && headers.authorization) {
      fetchTasks();
    }
  }, [headers]);

  // Fetch user's teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v3/teams/user/${headers.id}`,
          { headers }
        );
        setTeams(response.data.teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    if (headers.id && headers.authorization) {
      fetchTeams();
    }
  }, [headers]);

  // Fetch pending team requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v4/users/${headers.id}/invitations`,
          { headers }
        );
        setPendingRequests(response.data.invitations || []);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    if (headers.id && headers.authorization) {
      fetchPendingRequests();
    }
  }, [headers]);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        
        <div className="mb-6 text-2xl font-bold text-blue-400">
          <Link to="/">TaskPilot</Link>
        </div>
  
        {Data && (
          <div className="mb-4">
            <Link to="/profile" className="text-xl font-semibold hover:underline cursor-pointer">
              {Data.username}
            </Link>
            <h4 className="text-gray-400">{Data.email}</h4>
            <hr />
          </div>
        )}
  
  
        {/* Mobile Navigation Toggle */}
        <div className="my-4 text-white md:hidden flex items-center justify-end">
          <button
            className="text-2xl"
            onClick={() => setMobileNav(MobileNav === "hidden" ? "block" : "hidden")}
          >
            {MobileNav === "hidden" ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </button>
        </div>
  
        {/* Sidebar Navigation */}
        <div className={`${MobileNav} md:block`}>
          {data.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="my-2 flex items-center hover:bg-gray-600 p-2 rounded transition-all duration-300"
            >
              {item.icon}&nbsp; {item.title}
            </Link>
          ))}
        </div>
  
        {/* 🆕 Add space before Teams */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Teams</h3>
  
          {teams.length > 0 ? (
            <>
              {teams.map((team) => (
                <Link
                  key={team._id}
                  to={`/team/${team._id}`}
                  className="block my-2 hover:bg-gray-600 p-2 rounded transition-all duration-300"
                >
                  {team.name}
                </Link>
              ))}
  
              <button
                onClick={() => history("/join-team")}
                className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all"
              >
                + Create New Team
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => history("/join-team")}
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all"
              >
                Join a Team
              </button>
  
              <button
                onClick={() => history("/join-team")}
                className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all"
              >
                + Create a Team
              </button>
            </>
          )}
        </div>
  
        {pendingRequests.length > 0 && (
          <Link to="/PendingRequests" className="relative flex items-center my-4 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-all">
            <span>Pending Requests</span>
            <span className="absolute right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingRequests.length}
            </span>
          </Link>
        )}
      </div>
  
      {/* Logout fixed at bottom */}
      <div className="mt-4">
        <button className="bg-gray-600 w-full p-2 rounded" onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
  
};

export default Sidebar;
