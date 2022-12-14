import BackwardIcon from "@heroicons/react/24/outline/BackwardIcon";
import ForwardIcon from "@heroicons/react/24/outline/ForwardIcon";
import PauseIcon from "@heroicons/react/24/outline/PauseIcon";
import PlayIcon from "@heroicons/react/24/outline/PlayIcon";
import React, { useEffect, useState } from "react";
import {
  onChatMessage,
  sendSocketPlayPause,
  sendSocketTrackChange,
} from "../services/chatService";
import {
  onNextSong,
  onPause,
  onPlay,
  onPreviousSong,
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

function WebPlayback({
  token,
  chatSocket,
  roomCode,
  guest_id,
  deviceID,
  setDeviceID,
  setMessages,
}) {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const room = JSON.parse(localStorage.getItem("recent_room"));
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [currentTrack, setTrack] = useState(track);
  const [currentPosition, setPosition] = useState(null);
  const [currentUri, setCurrentUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "ArcLight Music",
        getOAuthToken: async (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        setDeviceID(device_id);
        setLoading(false);
      });

      player.addListener("not_ready", ({ device_id }) => {
        setError("Device ID has gone offline", device_id);
        setTimeout(() => setError(null), 5000);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        setPosition(state.position);
        setCurrentUri(state.context.metadata.current_item?.uri);
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        state && setActive(true);
        state && setLoading(false);
      });

      player.connect();
    };
    onChatMessage(
      chatSocket,
      setMessages,
      roomCode,
      guest_id,
      currentUri,
      setError
    );
  }, []);

  useEffect(() => {
    sendSocketTrackChange(chatSocket, false, currentUri);
  }, [currentTrack.uri]);

  if (loading) {
    return <Spinner />;
  }

  if (!is_active && !loading) {
    return (
      <>
        {error && <Error message={error} />}
        <div className=" flex flex-col justify-center items-center h-screen -mt-20 gap-2 px-4">
          <h2 className="font-bold">
            Instance not active. Transfer your playback using your Spotify app
          </h2>
          <button
            className="rounded-lg p-2 text-lg font-medium bg-blue-600 text-white"
            onClick={() => transferPlayback(token, deviceID, setError)}
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
        {error && <Error message={error} />}
        <div>
          {currentTrack && (
            <div className="absolute left-0 right-0 bottom-0 top-0 m-auto w-fit h-fit">
              <img
                src={currentTrack?.album.images[0].url}
                className="md:w-96 rounded-lg "
                alt="album image"
              />

              <div>
                <div className="text-lg">{currentTrack?.name}</div>
                <div className="text-sm">{currentTrack?.artists[0].name}</div>
              </div>
            </div>
          )}
          <div
            className="border rounded-xl shadow-xl bottom_center_align w-full max-w-md md:max-w-xl lg:max-w-5xl mx-auto -bottom-12 lg:bottom-5  px-10 flex items-center justify-between
        h-20 bg-gray-800 mb-10 "
          >
            {room?.guest_controller || guest.host ? (
              <>
                <button
                  disabled={!guest.host && true}
                  className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
                  onClick={() => {
                    onPreviousSong(roomCode, guest_id, setError);
                  }}
                >
                  <BackwardIcon />
                </button>

                {is_paused && player ? (
                  <button
                    disabled={!guest.host && true}
                    className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
                    onClick={() => {
                      onPlay(roomCode, guest_id, setError);
                      sendSocketPlayPause(
                        chatSocket,
                        false,
                        currentUri,
                        currentPosition
                      );
                    }}
                  >
                    <PlayIcon />
                  </button>
                ) : (
                  <button
                    disabled={!guest.host && true}
                    className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
                    onClick={() => {
                      onPause(roomCode, guest_id, setError);
                      sendSocketPlayPause(
                        chatSocket,
                        true,
                        currentUri,
                        currentPosition
                      );
                    }}
                  >
                    <PauseIcon />
                  </button>
                )}

                <button
                  disabled={!guest.host && true}
                  className="cursor-pointer rounded-lg m-2 h-8 w-8 hover:bg-white hover:text-gray-800 text-white"
                  onClick={() => {
                    onNextSong(roomCode, guest_id, setError);
                  }}
                >
                  <ForwardIcon />
                </button>
              </>
            ) : (
              <p className="text-white text-lg">
                Guests do not have control over player
              </p>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;
