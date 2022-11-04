import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../services/roomService";

function JoinRoomForm() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const onFormSubmission = async (e) => {
    e.preventDefault();
    const data = await joinRoom(code);
    const temp = { ...data };
    delete temp.host_session_id;
    //check if the user's host_session_id for last room is the session id for the joining room; if it is then they were the host
    if (localStorage.getItem("host_session_id") === data.host_session_id) {
      temp.host = true;
    } else {
      temp.host = false;
    }

    if (localStorage.getItem("recent_room")) {
      localStorage.removeItem("recent_room");
    }
    localStorage.setItem("recent_room", JSON.stringify(temp));
    if (response.ok) {
      navigate(`/room/${code}`);
    } else {
      console.log("room not found");
    }
  };

  return (
    <div className="max-w-xl px-2 sm:px-6 lg:px-8 mx-auto rounded-md">
      <div className="flex items-center justify-center ">
        <form className="form-group pt-12 pb-16" onSubmit={onFormSubmission}>
          <p className=" font-medium">Enter Room Code:</p>
          <input
            className="w-full
        px-3
        py-1.5
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="text"
            value={code}
            name="code"
            required
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="flex items-center justify-center my-2 mt-3 ">
            <button
              className="px-6
      py-3
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
              type="submit"
            >
              Join Room
            </button>
          </div>
          <div className="flex items-center justify-center my-2 -mb-5">
            <button
              className="px-6
      py-2
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
              onClick={() => navigate("/")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinRoomForm;
