import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import {
  onNextSong,
  onPause,
  onPlay,
  onPreviousSong,
  sendSong,
  transferPlayback,
} from "../services/spotifyServices";
import Spinner from "./Spinner";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback({ token, chatSocket, roomCode, guest_id, deviceID, setDeviceID }) {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [currentTrack, setTrack] = useState(track);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "ArcLight Music",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        setDeviceID(device_id);
        setLoading(false)
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        chatSocket.send(
          JSON.stringify({
            player: {
              uri: state.context.metadata.current_item.uri,
              position: state.position,
            },
          })
        );

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        state && setActive(true);
        state && setLoading(false);
      });

      player.connect();
    };
    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.spotify && !guest.host) {
        sendSong(token, data.spotify);
      }
    };
  }, []);

  if(loading){
    return <Spinner/>
  }

  if (!is_active && !loading) {
    return (
      <>
        <div className=" flex flex-col justify-center items-center h-screen -mt-20 gap-2">
          <h2 className="font-bold">
            Instance not active. Transfer your playback using your Spotify app
          </h2>
          <button
            className="rounded-lg p-2 text-lg font-medium bg-blue-600 text-white"
            onClick={() => transferPlayback(token, deviceID)}
          >
            Activate
          </button>
          <p>Not working? </p>
          <a href="/learn-more" target="_blank" className="-mt-3">
            Learn More
          </a>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          {currentTrack && (
            <div className="flex flex-col justify-center items-center mt-10 ">
              <div className="max-w-sm md:max-w-lg">
                <img
                  src={currentTrack?.album.images[0].url}
                  className="now-playing__cover"
                  alt=""
                />

                <div>
                  <div>{currentTrack?.name}</div>
                  <div>{currentTrack?.artists[0].name}</div>
                </div>
              </div>
            </div>
          )}
          <div
            className="border rounded-xl shadow-xl bottom_center_align w-full max-w-md md:max-w-xl lg:max-w-5xl mx-auto -bottom-12 lg:bottom-5  px-10 flex items-center justify-between
        h-20 bg-gray-800"
          >
            <button
              className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
              onClick={() => {
                onPreviousSong(roomCode, guest_id);
              }}
            >
              <BackwardIcon />
            </button>

            {is_paused && player ? (
              <button
                className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
                onClick={() => {
                  onPlay(roomCode, guest_id);
                }}
              >
                <PlayIcon />
              </button>
            ) : (
              <button
                className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
                onClick={() => {
                  onPause(roomCode, guest_id);
                }}
              >
                <PauseIcon />
              </button>
            )}

            <button
              className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
              onClick={() => {
                onNextSong(roomCode, guest_id);
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
