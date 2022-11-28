import React, { useEffect, useRef, useState } from "react";
import { BsSpotify, BsPlayFill } from "react-icons/bs";
import { FaRegHandshake } from "react-icons/fa";
import { VscWorkspaceUnknown } from "react-icons/vsc";
import { MdDashboardCustomize } from "react-icons/md";
import NickNameModal from "../components/NickNameModal";
import ActiveRoomModal from "../components/ActiveRoomModal";
import Picture from "../assets/landingPicture.png";
import PictureMobile from "../assets/landingMobile.png";
import DisclaimerModal from "../components/DisclaimerModal";

function Home({ homeRef, featureRef }) {
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState(false);
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("recent_room")) {
      setOpen(true);
      setRoom(JSON.parse(localStorage.getItem("recent_room")));
    }
  }, []);

  return (
    <div>
      <div
        ref={homeRef}
        id="Home"
        className="px-4 py-16 sm:px-8 lg:px-10 bg-gray-800 "
      >
        <div className="md:mx-20 xl:mx-80 max-w-3xl">
          <h1 className="text-slate-300 font-medium text-xl py-2">
            ArcLight Music
          </h1>
          <h2 className="text-white font-bold text-5xl">Share music </h2>
          <h2 className="text-blue-400 font-bold text-5xl">in a better way</h2>
          <p className="text-gray-400 text-md py-4 max-w-40">
            Listening on the go has never been as easy or as simple. Create or
            join an existing room and share music with friends or family to stay
            connected. Just choose your song and find your muse!
          </p>

          <div className=" flex items-center w-fit my-3">
            <button
              className="flex justify-evenly items-center text-white bg-blue-400 hover:bg-blue-500 hover:text-white px-3 py-2 mr-5 rounded-md text-sm font-medium"
              onClick={() => setDisclaimerOpen(true)}
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
      </div>
      <div className="landingPicture p-4 sm:p-10">
        <img
          src={Picture}
          alt="Preview"
          width="1000"
          className=" hidden sm:block shadow-lg mx-auto rounded-lg "
        />
        <img
          src={PictureMobile}
          alt="Preview"
          width="500"
          className=" sm:hidden block shadow-lg mx-auto rounded-lg "
        />
      </div>
      <div
        ref={featureRef}
        id="Features"
        className="py-16 px-4 sm:px-8 lg:px-10"
      >
        <div className="md:mx-20 xl:mx-80 py-20">
          <h2 className="text-2xl font-semibold ">Listening Made Easier</h2>
          <p className="text-gray-600">
            ArcLight Music strives to provide our users with the best possible
            listening and sharing experience.
          </p>

          <div className="grid grid-col-1 sm:grid-cols-3 gap-10 mt-10 ">
            <div className="flex flex-col items-center text-center gap-1 border bg-gray-300 rounded-xl p-5 ">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <BsSpotify className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mt-5 ">
                Powered by Spotify
              </h3>
              <p>
                Having Spotify powering your session means you can pick up where
                you left off without worry
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1 border bg-gray-300 rounded-xl p-5  ">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <FaRegHandshake className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mt-5">Stay in Touch</h3>
              <p>
                All in one application, listen to one another and share
                thoughts. There's no need to message them on one app while
                listening to music on another.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1 border bg-gray-300 rounded-xl p-5  ">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <MdDashboardCustomize className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mt-5">Customization</h3>
              <p>
                Choose the name you feel right for both your room and your own.
              </p>
            </div>
          </div>
          <div className="grid grid-col-1 sm:grid-cols-2 gap-10 justify-center  max-w-3xl mx-auto mt-10">
            <div className="flex flex-col items-center text-center gap-1 border bg-gray-300 rounded-xl p-5  ">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <BsPlayFill className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mt-5">Stay in Control</h3>
              <p>
                You hold the power. Do you want your guests to be able to
                control the music? What song would you like to share? It's
                entirely up to you.
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-1 border bg-gray-300 rounded-xl p-5">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <VscWorkspaceUnknown className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mt-5">Anonymous</h3>
              <p>
                Listen with confidence because you know we don't keep any
                personal information about you because we don't ask for it
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 h-24"></footer>

      <div>
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
        <DisclaimerModal setNicknameOpen={setNicknameOpen} disclaimerOpen={disclaimerOpen} setDisclaimerOpen={setDisclaimerOpen}/>
      </div>
    </div>
  );
}

export default Home;
