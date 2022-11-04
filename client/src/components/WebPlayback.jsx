import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(null);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = await new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });
      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player?.connect();
    };
    return () => player.disconnect();
  }, []);
  if (!is_active) {
    return (
      <>
        <div className=" grid place-items-center">
          <h2 className="font-bold">
            Instance not active. Transfer your playback using your Spotify app
          </h2>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          {current_track && (
            <div className="flex flex-col justify-center items-center mt-10 ">
              <div className="max-w-sm md:max-w-lg  ">
                <img
                  src={current_track?.album.images[0].url}
                  className="now-playing__cover"
                  alt=""
                />

                <div className="now-playing__side">
                  <div className="now-playing__name">{current_track?.name}</div>

                  <div className="now-playing__artist">
                    {current_track?.artists[0].name}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div
            className="border rounded-xl shadow-xl bottom_center_align w-full max-w-md md:max-w-xl lg:max-w-5xl mx-auto -bottom-12 lg:bottom-0  px-10 flex items-center justify-between
        h-20 bg-gray-800"
          >
            <button
              className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
              onClick={() => {
                player.previousTrack();
              }}
            >
              <BackwardIcon />
            </button>

            <button
              className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
              onClick={() => {
                console.log("toggle");
                player?.togglePlay();
              }}
            >
              {is_paused ? <PlayIcon /> : <PauseIcon />}
            </button>

            <button
              className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
              onClick={() => {
                player.nextTrack();
              }}
            >
              <ForwardIcon />
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;
