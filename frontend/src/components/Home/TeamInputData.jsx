import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const TeamInputData = ({ InputDiv, setInputDiv, UpdatedData, setUpdatedData, teamId }) => {
  const [Data, setData] = useState({
    title: "",
    desc: "",
    priority: "Medium", // Default priority
    dueDate: "",
    dueTime: "", 
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    setData({
      title: UpdatedData.title,
      desc: UpdatedData.desc,
      priority: UpdatedData.priority || "Medium",
      dueDate: UpdatedData.dueDate || "",
      dueTime: UpdatedData.dueTime || "",
    });
  }, [UpdatedData]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const uploadToCloudinary = async () => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "RohanRawat"); // preset
    formData.append("cloud_name", "dvipccprb"); // Cloudinary name
  
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvipccprb/upload", //namee
        formData
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary Upload Failed", err);
      alert("Failed to upload file");
      return null;
    }
  };

  const submitData = async () => {
    console.log("teamId being sent:", teamId);
    console.log("Data being sent:", Data);

    if (!Data.title || !Data.desc || !Data.priority || !Data.dueDate || !Data.dueTime) {
      alert("All fields are required");
      return;
    }
    const attachmentUrl = await uploadToCloudinary();
  
    try {
      axios.post(`http://localhost:1000/api/v3/teams/${teamId}/add-task`, 
        { ...Data, assignedUsers: Data.assignedUsers || [], attachment: attachmentUrl }, 
        { headers }
      );
      setData({ title: "", desc: "", priority: "Medium", dueDate: "", dueTime: "" });
      setInputDiv("hidden");
      window.location.reload();
    } catch (error) {
      console.error("Error creating team task:", error.response ? error.response.data : error);
    }
  };

  const UpdateTask = async () => {
    console.log("UpdateTask function triggered!");

    if (!Data.title || !Data.desc || !Data.priority || !Data.dueDate || !Data.dueTime) {
      alert("All fields are required");
      return;
    }

    const attachmentUrl = await uploadToCloudinary();
  
    try {
      await axios.put(`http://localhost:1000/api/v2/update-task/${UpdatedData.id}`, 
        { ...Data, assignedUsers: Data.assignedUsers || [], attachment: attachmentUrl }, 
        { headers }
      );

      console.log("Update successful!");

      setUpdatedData({ id: "", title: "", desc: "", priority: "Medium", dueDate: "", dueTime: "" });
      setData({ title: "", desc: "", priority: "Medium", dueDate: "", dueTime: "" });
      setInputDiv("hidden");
      window.location.reload();
    } catch (error) {
      console.error("Error updating team task:", error);
    }
  };

  return (
    <>
      <div className={`${InputDiv} top-0 left-0 bg-gray-800 opacity-80 h-screen w-full`}></div>
      <div className={`${InputDiv} top-0 left-0 flex items-center justify-center h-screen w-full`}>
        <div className="w-2/6 bg-gray-900 p-4 rounded">
          <div className="flex justify-end">
            <button
              className="text-2xl"
              onClick={() => {
                setInputDiv("hidden");
                setData({ title: "", desc: "", priority: "Medium", dueDate: "", dueTime: "" });
                setUpdatedData({ id: "", title: "", desc: "", priority: "Medium", dueDate: "", dueTime: "" });
              }}
            >
              <RxCross2 />
            </button>
          </div>

          <label className="text-white">Title:</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.title}
            onChange={change}
          />

          <label className="text-white">Description:</label>
          <textarea
            name="desc"
            cols="30"
            rows="5"
            placeholder="Description.."
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.desc}
            onChange={change}
          ></textarea>

          {/* Priority Selection */}
          <label className="text-white">Priority:</label>
          <select
            name="priority"
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.priority}
            onChange={change}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          {/* Due Date Input */}
          <label className="text-white">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.dueDate}
            onChange={change}
          />

          {/* Due Time Input */}
          <label className="text-white">Due Time:</label>
          <input
            type="time"
            name="dueTime"
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.dueTime}
            onChange={change}
          />

{/* Cloudinary */}
<label className="text-white">Attachment:</label>
<input
  type="file"
  className="w-full bg-gray-700 text-white p-2 rounded my-3"
  onChange={(e) => setFile(e.target.files[0])}
/>

          {UpdatedData.id === "" ? (
            <button className="px-3 py-2 bg-blue-400 rounded text-black text-xl font-semibold" onClick={submitData}>
              Submit
            </button>
          ) : (
            <button className="px-3 py-2 bg-blue-400 rounded text-black text-xl font-semibold" onClick={UpdateTask}>
              Update
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamInputData;
