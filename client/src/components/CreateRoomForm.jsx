import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/roomService";
import Error from "./Error";

function CreateRoomForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    guestController: false,
  });
  const [error, setError] = useState(null);
  const { name, guestController } = formData;

  const onFormChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: boolean ?? e.target.value,
    }));
  };
  const onFormSubmission = async (e) => {
    e.preventDefault();
    const guestData = JSON.parse(localStorage.getItem("guest"));
    const data = await createRoom(name, guestController, guestData, setError);
    localStorage.setItem("recent_room", JSON.stringify(data));
    const temp = { ...guestData, room: data?.code, host: true };
    localStorage.setItem("guest", JSON.stringify(temp));
    navigate(`/room/${data?.code}`);
  };
  return (
    <>
      {error && <Error message={error} />}
      <div className="px-2 sm:px-6 lg:px-8 rounded-md">
        <div className="flex items-center justify-center ">
          <form className="form-group pt-12 pb-16" onSubmit={onFormSubmission}>
            <p className="mt-3 font-medium">Room Name:</p>
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
              value={name}
              name="name"
              required
              onChange={onFormChange}
            />
            <p className="font-medium mt-3">Guest Control Options:</p>
            <div className="flex justify-around">
              <div>
                <input
                  type="radio"
                  value={true}
                  name="guestController"
                  onChange={onFormChange}
                />
                <label htmlFor="true"> True</label>
              </div>
              <div>
                <input
                  type="radio"
                  value={false}
                  name="guestController"
                  onChange={onFormChange}
                  defaultChecked
                />
                <label htmlFor="false"> False</label>
              </div>
            </div>

            <div className="flex items-center justify-center my-2 mt-10 ">
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
                Create Room
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

export default CreateRoomForm;
