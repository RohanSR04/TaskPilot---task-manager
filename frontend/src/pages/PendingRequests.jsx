import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const PendingTasks = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    }),
    []
  );

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
        setError("Failed to fetch pending invitations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (headers.id && headers.authorization) {
      fetchPendingRequests();
    }
  }, [headers]);

  const handleResponse = async (inviteId, response) => {
    try {
        const token = localStorage.getItem("token");  

        if (!token) {
            console.error("No token found!");
            return;
        }

        const res = await axios.post(
            `http://localhost:1000/api/v4/invitations/${inviteId}/respond`,
            { response },  
            {
                headers: {
                    Authorization: `Bearer ${token}`,  
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Invitation response successful:", res.data);
        window.location.reload();
    } catch (error) {
        console.error("Error accepting invitation:", error);
    }
};

  

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Invitations</h2>

      {loading ? (
        <p className="text-gray-600">Loading pending invitations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pendingRequests.length === 0 ? (
        <p className="text-white">No pending invitations found.</p>
      ) : (
        <ul className="bg-gray-800 shadow-md rounded-lg p-4">
          {pendingRequests.map((invitation) => (
            <li key={invitation._id} className="border-b py-3 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-white">
                  Team: {invitation.teamId?.name || "Unknown Team"}
                </p>
                <p className="text-sm text-white">
                  Invited by: {invitation.invitedBy?.email || "Unknown"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(invitation._id, "Accepted")}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(invitation._id, "Rejected")}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingTasks;
