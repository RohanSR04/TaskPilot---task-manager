import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoAddCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Cards from "../components/Home/Cards";
import TeamInputData from "../components/Home/TeamInputData";
import Loader from "../components/Home/Loader";

const TeamTasks = ({ teamId }) => {
  const [InputDiv, setInputDiv] = useState("hidden");
  const [Data, setData] = useState([]);
  const [FilteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const [UpdatedData, setUpdatedData] = useState({
    id: "",
    title: "",
    desc: "",
  });
  const [TeamName, setTeamName] = useState("");
  const [TeamMembers, setTeamMembers] = useState([]);
  const [ShowMembers, setShowMembers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const deleteTeam = async (teamId) => {
    try {
      const response = await axios.delete(`http://localhost:1000/api/v3/teams/${teamId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(response.data.message);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team");
    }
  };

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:1000/api/v3/teams/fetch/${teamId}`, { headers });
      setTeamName(response.data.teamName);
      setTeamMembers(response.data.members);
      console.log("Fetched team details:", response.data);
    } catch (error) {
      console.error("Error fetching team details:", error);
    }
  };

  const leaveTeam = async () => {
    try {
      const response = await axios.delete(`http://localhost:1000/api/v3/teams/leave/${teamId}`, { headers });
      alert(response.data.message);
      window.location.reload(); 
    } catch (error) {
      console.error("Error leaving team:", error);
      alert("Failed to leave the team");
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail) {
      alert("Please enter an email address");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("User not logged in");
      return;
    }
  
    try {
      // Get current user ID from backend
      const userRes = await axios.get("http://localhost:1000/api/v1/auth/me", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
  
      const currentUserId = userRes.data.user._id; // etract user ID
  
      const response = await axios.post(
        `http://localhost:1000/api/v4/create-team/invite`,
        {
          teamId: teamId, 
          userId: currentUserId,
          members: [inviteEmail],
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert(response.data.message);
      setInviteEmail(""); 
      fetchTeamDetails(); 
    } catch (error) {
      console.error("Error inviting member:", error);
      alert(error.response?.data?.message || "Failed to invite member");
    }
  };
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v3/teams/${teamId}/tasks`, { headers });
        setData(response.data.tasks);
      } catch (error) {
        console.error("Error fetching team tasks:", error);
      }
    };

    if (localStorage.getItem("id") && localStorage.getItem("token") && teamId) {
      fetchTasks();
      fetchTeamDetails();
    }
  }, [teamId]);
  
  useEffect(() => {
    if (filter === "completed") {
      setFilteredData(Data.filter(task => task.complete)); 
    } else if (filter === "incomplete") {
      setFilteredData(Data.filter(task => !task.complete));
    } else if (filter === "important") {
      setFilteredData(Data.filter(task => task.important)); 
    } else if (filter === "overdue") {
      const now = new Date();
      setFilteredData(Data.filter(task => task.dueDate && new Date(task.dueDate) < now && !task.complete));
    } else {
      setFilteredData(Data);
    }
  }, [filter, Data]);
  

  return (
    <div className="relative flex w-full min-h-[91vh]">
      {/* Sidebar for Team Members */}
{ShowMembers && (
  <div className="w-[250px] bg-gray-800 text-white p-4">
    <h2 className="text-lg font-semibold mb-2">Team Members</h2>
    <ul className="space-y-2">
      {Array.isArray(TeamMembers) && TeamMembers.length > 0 ? (
        TeamMembers.map((member, index) => (
          <li key={index} className="bg-gray-700 p-2 rounded">
            {member.username ? member.username : member.email} 
          </li>
        ))
      ) : (
        <p>No members in this team</p>
      )}
    </ul>
    <div className="mt-4">
  <input
    type="email"
    placeholder="Enter member email"
    value={inviteEmail}
    onChange={(e) => setInviteEmail(e.target.value)}
    className="w-full p-2 rounded bg-gray-700 text-white"
  />
  <button
    onClick={inviteMember}
    className="w-full bg-green-500 text-white p-2 rounded mt-2"
  >
    Invite Member
  </button>
</div>


  </div>
)}


      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-start items-center w-full">
        {/* Header */}
        <div className="w-[90%] max-w-[1200px] flex justify-between items-center px-4 py-2">
          <h1 className="text-xl py-4 text-gray-300 font-semibold">{TeamName || "Team"} - Tasks</h1>
          
          <div className="flex space-x-4">
            <button onClick={() => setShowMembers(!ShowMembers)} className="bg-blue-500 text-white px-4 py-2 rounded">
              {ShowMembers ? "Hide Members" : "Show Members"}
            </button>
            <button onClick={() => deleteTeam(teamId)} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete Team
            </button>
            <button onClick={leaveTeam} className="bg-yellow-500 text-white px-4 py-2 rounded">
  Leave Team
</button>
  
          </div>
        </div>

{/* Filter Buttons */}
<div className="flex space-x-4 mb-4">
        <button onClick={() => setFilter("all")} className="px-4 py-2 underline text-white rounded">All</button>
        <button onClick={() => setFilter("completed")} className="px-4 py-2 underline text-white rounded">Completed</button>
        <button onClick={() => setFilter("incomplete")} className="px-4 py-2 underline text-white rounded">Incomplete</button>
        <button onClick={() => setFilter("important")} className="px-4 py-2 underline text-white rounded">Important</button>
        <button onClick={() => setFilter("overdue")} className="px-4 py-2 underline text-white rounded">Overdue</button>
      </div>
        {/* Add Task Button */}
        <div className="w-[90%] max-w-[1200px] flex justify-end px-4 py-2">
          <button onClick={() => setInputDiv("fixed")}>
            <IoAddCircleSharp className="text-4xl text-gray-400 hover:text-gray-100 transition-all duration-300" />
          </button>
        </div>

        {/* Tasks List */}
        {Data.length > 0 ? (
          <Cards home={"true"} setInputDiv={setInputDiv} data={FilteredData} setUpdatedData={setUpdatedData} />

        ) : Data.length === 0 ? (
          <div className="flex items-center justify-center h-[100%] text-gray-400 text-lg">
            No tasks for this team
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100%]">
            <Loader />
          </div>
        )}

        {/* Input Modal */}
        <TeamInputData InputDiv={InputDiv} setInputDiv={setInputDiv} UpdatedData={UpdatedData} setUpdatedData={setUpdatedData} teamId={teamId} />

        {/* Footer with Analytics Link */}
        <footer className="absolute bottom-4 right-4">
        <Link
  to="/analytics"
  className="text-blue-400 hover:underline"
  onClick={() => localStorage.setItem("teamId", teamId)}
>
  View Analytics
</Link>

        </footer>
      </div>
    </div>
  );
};

export default TeamTasks;
