import React from "react";
import { useState } from "react";
import { sendSocketTrackChange } from "../services/chatService";
import { sendSong } from "../services/spotifyServices";
import Error from "./Error";

function SearchResult({ result, setResultModalOpen, guest_id, chatSocket }) {
  const [error, setError] = useState(null);
  const onResultClick = async (result) => {
    const guest = JSON.parse(localStorage.getItem("guest"));
    const room = localStorage.getItem("room");
    const uri = result.uri;
    const position = 0;
    const songInfo = { uri, position };

    if (guest.host || room.guestController) {
      sendSocketTrackChange(chatSocket, false, uri);
      sendSong(guest_id, songInfo);
    } else {
      setError("You do not have permisson to change the track");
      setTimeout(() => setError(null), 5000);
    }
    setResultModalOpen(false);
  };
  
  return (
    <>
      {error && <Error message={error} />}
      <div
        className="h-16 border rounded-lg flex items-center cursor-pointer px-3"
        onClick={() => onResultClick(result)}
      >
        <img
          src={result.image ? result.image[0].url : result.album.images[0].url}
          className="w-12 h-12 mr-4"
        />
        <div>
          <p className="text-black  text-sm md:text-base">{result.name}</p>
          <div className="flex text-xs md:text-sm">
            {result.artists &&
              result.artists.map((artist) => (
                <p key={artist.name}>{artist.name}</p>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchResult;
