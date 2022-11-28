import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../services/roomService";
import Error from "./Error";

function JoinRoomForm() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const onFormSubmission = async (e) => {
    e.preventDefault();
    const response = await joinRoom(code);

    if (response.code) {
      let temp;

      //check if the user's host_id for last room is the session id for the joining room; if it is then they were the host
      if (
        JSON.parse(localStorage.getItem("guest")).guest_id === response.host_id
      ) {
        temp = { ...response, host: true };
      } else {
        temp = { ...response, host: false };
      }
      if (localStorage.getItem("recent_room")) {
        localStorage.removeItem("recent_room");
      }
      localStorage.setItem("recent_room", JSON.stringify(temp));
      navigate(`/room/${code}`);
    } else {
      setError("room not found");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <>
      {error && <Error message={error} />}
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
    </>
  );
}

export default JoinRoomForm;
