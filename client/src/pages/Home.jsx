import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NickNameModal from "../components/NickNameModal";
import ActiveRoomModal from "../components/ActiveRoomModal";

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState(false);
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    if (localStorage.getItem("recent_room")) {
      setOpen(true);
      setRoom(JSON.parse(localStorage.getItem("recent_room")));
    }
  }, []);

  return (
    <div>
      <div className="mx-auto px-4 py-16 sm:px-8 lg:px-10 bg-gray-800">
        <div className="flex items-center justify-evenly">
          <div className="max-w-3xl ">
            <h1 className="text-slate-300 font-medium text-xl py-3">
              ArcLight Music
            </h1>
            <h2 className="text-white font-bold text-5xl">Share music </h2>
            <h2 className="text-blue-400 font-bold text-5xl">
              in a better way
            </h2>
            <p className="text-gray-400 text-md py-4 max-w-40">
              Listening on the go has never been as easy or as simple. Create or
              join an existing room and share music with friends or family to
              stay connected. Just choose your song and find your muse!
            </p>

            <div className=" flex items-center w-fit my-3">
              <button
                className="flex justify-evenly items-center text-white bg-blue-400 hover:bg-blue-500 hover:text-white px-3 py-2 mr-5 rounded-md text-sm font-medium"
                onClick={() => {
                  if (!localStorage.getItem("guest")) {
                    setNicknameOpen(true);
                  } else {
                    navigate("/room");
                  }
                }}
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <ActiveRoomModal
        open={open}
        setOpen={setOpen}
        room={room}
        cancelButtonRef={cancelButtonRef}
      />
      <NickNameModal
        setNicknameOpen={setNicknameOpen}
        cancelButtonRef={cancelButtonRef}
        nicknameOpen={nicknameOpen}
      />
    </div>
  );
}

export default Home;
