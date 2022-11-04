import React, { useState } from "react";
import {
  onNextSong,
  onPause,
  onPlay,
  onPreviousSong,
} from "../services/spotifyServices";

function MusicPlayer({ currentlyPlaying, roomCode }) {
  const [value, setValue] = useState(10);
  const guest_id = JSON.parse(localStorage.getItem("guest")).guest_id;

  return (
    <div className=" bottom_center_align w-96 max-w-lg md:w-full ">
      <div className=" bg-white border rounded-3xl shadow-md">
        <div className="grid place-items-center -mb-5 px-5">
          <input
            type="range"
            value={currentlyPlaying.time}
            max={currentlyPlaying.duration}
            className="mb-6 w-full h-1"
            readOnly
          />
        </div>
        <div className="flex h-16">
          <div className="flex flex-1 items-center justify-center ">
            <div className="flex space-x-4">
              <button
                onClick={() => onPreviousSong(roomCode, guest_id)}
                className="px-4
      py-2
      leading-tight
      rounded-xl
      hover:shadow-sm
      active:shadow-lg 
      transition
      duration-150
      ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                  />
                </svg>
              </button>

              {currentlyPlaying.is_playing ? (
                <button
                  onClick={() => onPause(roomCode, guest_id)}
                  className="px-4
      py-2
      leading-tight
      rounded-xl
      hover:shadow-sm
      active:shadow-lg 
      transition
      duration-150
      ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => onPlay(roomCode, guest_id)}
                  className="px-4
      py-2
      leading-tight
      rounded-xl
      hover:shadow-sm
      active:shadow-lg 
      transition
      duration-150
      ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onNextSong(roomCode, guest_id)}
                className="px-4
      py-2
      leading-tight
      rounded-xl
      hover:shadow-sm
      active:shadow-lg 
      transition
      duration-150
      ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="grid place-items-center px-5">
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mb-6 w-full h-1.5"
          ></input>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
