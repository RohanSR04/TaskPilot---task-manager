import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [inviteEmails, setInviteEmails] = useState([]); 
  const [emailInput, setEmailInput] = useState(""); 
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  const addEmailToInviteList = () => {
    if (emailInput.trim() && !inviteEmails.includes(emailInput.trim())) {
      setInviteEmails([...inviteEmails, emailInput.trim()]);
      setEmailInput("");
    }
  };

  const removeEmail = (email) => {
    setInviteEmails(inviteEmails.filter((e) => e !== email));
  };

  const createTeam = async () => {
    if (!teamName) {
      alert("Please enter a team name");
      return;
    }
  
    const token = localStorage.getItem("token"); // get the JWT token
  
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:1000/api/v4/create-team/inv",
        {
          name: teamName,
          userId,
          members: inviteEmails, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // innclude JWT token
          },
        }
      );
  
      alert("Team created and invitations sent!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error creating team:", error);
      alert(error.response?.data?.message || "Failed to create team");
    }
  };
  

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 text-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a Team</h2>

      <input
        type="text"
        placeholder="Enter team name"
        className="w-full p-2 mb-4 text-black rounded"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      {/* Invite by Email */}
      <h3 className="text-lg font-semibold mt-4">Invite via Email</h3>
      <div className="flex mb-2">
        <input
          type="email"
          placeholder="Enter email"
          className="flex-1 p-2 text-black rounded"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <button onClick={addEmailToInviteList} className="ml-2 p-2 bg-green-500 rounded">
          Add
        </button>
      </div>

      <div className="mb-3">
        {inviteEmails.map((email, index) => (
          <div key={index} className="flex justify-between bg-gray-700 p-2 mb-1 rounded">
            <span>{email}</span>
            <button onClick={() => removeEmail(email)} className="text-red-400">Remove</button>
          </div>
        ))}
      </div>

      <button
        onClick={createTeam}
        className="bg-blue-500 w-full p-2 rounded hover:bg-blue-600 transition-all"
      >
        Create Team & Send Invites
      </button>
    </div>
  );
};

export default JoinTeam;
