import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaEdit, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import axios from "axios";
import AllTasks from "../../pages/AllTasks";

const Cards = ({ home, setInputDiv, data, setUpdatedData }) => {
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({}); 
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleCompleteTask = async (id) => {
    try {
      await axios.put(
        `http://localhost:1000/api/v2/update-complete-task/${id}`,
        {},
        { headers }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleImportant = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:1000/api/v2/update-imp-task/${id}`,
        {},
        { headers }
      );
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = (id, title, desc, priority, dueDate, dueTime) => {
    setInputDiv("fixed");
    setUpdatedData({ id, title, desc, priority, dueDate, dueTime });
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:1000/api/v2/delete-task/${id}`,
        { headers }
      );
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddComment = async (taskId) => {
    const commentText = commentInput[taskId]?.trim();
    const userId = localStorage.getItem("id");

    if (!commentText) {
      alert("Comment cannot be empty!");
      return;
    }
    if (!userId) {
      alert("User not found! Please log in again.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:1000/api/v2/add-comment/${taskId}`,
        { comment: commentText },
        { headers: { id: userId, authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Comment added successfully");
      window.location.reload();
    } catch (error) {
      alert("Error adding comment:", error.response?.data || error.message);
    }
  };

  const handleDeleteComment = async (taskId, commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      await axios.delete(`http://localhost:1000/api/v2/delete-comment/${taskId}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: localStorage.getItem("id"),
        },
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
      {data &&
        data.map((items, i) => (
          <div
            className="flex flex-col justify-between bg-gray-800 rounded-lg p-6 shadow-lg w-full"
            key={i}
          >
            <div>
              <h3 className="text-2xl font-semibold text-white">{items.title}</h3>
              <p className="text-gray-300 my-3">{items.desc}</p>
              <p className="text-gray-400 text-sm">Due Date: {items.dueDate || "Not Set"}</p>
              <p className="text-gray-400 text-sm">Due Time: {items.dueTime || "Not Set"}</p>
              {items.attachment && (
  <div className="mt-3">
    <a
      href={items.attachment}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline"
    >
      View Attachment
    </a>
  </div>
)}

            </div>

            <div className="mt-4">
              <span
                className={`text-sm font-semibold text-black px-3 py-1 rounded ${getPriorityColor(items.priority)}`}
              >
                {items.priority} Priority
              </span>
            </div>

            {/* 🔹 View Comments Button */}
            <button
              onClick={() => setShowComments((prev) => ({ ...prev, [items._id]: !prev[items._id] }))}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              {showComments[items._id] ? "Hide Comments" : "View Comments"}
            </button>

            {/* Comments Section */}
            {showComments[items._id] && (
              <div className="mt-4">
                <h4 className="text-gray-300 text-lg">Comments:</h4>
                <div className="max-h-32 overflow-y-auto bg-gray-700 p-2 rounded">
                  {items.comments?.map((comment) => (
                    <div key={comment._id} className="flex justify-between items-center bg-gray-600 p-2 rounded my-1">
                      <span className="text-gray-200">{comment.text}</span>
                      {comment.userId === localStorage.getItem("id") && (
                        <button onClick={() => handleDeleteComment(items._id, comment._id)}>
                          <MdDelete className="text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-700 text-gray-300 rounded"
                    placeholder="Add a comment..."
                    value={commentInput[items._id] || ""}
                    onChange={(e) =>
                      setCommentInput((prev) => ({ ...prev, [items._id]: e.target.value }))
                    }
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleAddComment(items._id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-6 w-full flex items-center">
              <button
                className={`${
                  items.complete ? "bg-green-700" : "bg-red-400"
                } p-3 rounded w-3/6 text-white font-semibold`}
                onClick={() => handleCompleteTask(items._id)}
              >
                {items.complete ? "Completed" : "Incomplete"}
              </button>
              <div className="text-white p-2 w-3/6 text-2xl font-semibold flex justify-around">
                <button onClick={() => handleImportant(items._id)}>
                  {items.important ? <FaHeart className="text-red-500" /> : <CiHeart />}
                </button>
                {home !== "false" && (
                  <button onClick={() => handleUpdate(items._id, items.title, items.desc, items.priority, items.dueDate, items.dueTime)}>
                    <FaEdit />
                  </button>
                )}
                <button onClick={() => deleteTask(items._id)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Cards;
