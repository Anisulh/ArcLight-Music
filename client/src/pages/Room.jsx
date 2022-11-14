import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRoomInfo } from "../services/roomService";
import RoomInfo from "../components/RoomInfo";
import {
  authenticateSpotify,
  getSpotifyToken,
} from "../services/spotifyServices";
import RoomNav from "../components/RoomNav";
import SearchMusic from "../components/SearchMusic";
import Chat from "../components/Chat";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import WebPlayback from "../components/WebPlayback";

function Room() {
  const { roomCode } = useParams();
  const guest = JSON.parse(localStorage.getItem("guest"));
  const [roomInfo, setRoomInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatSocket, setChatSocket] = useState(
    new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomCode}/`)
  );

  useEffect(() => {
    const fetchRoom = async () => {
      const data = fetchRoomInfo(roomCode);
      setRoomInfo(data);
    };
    const fetchToken = async () => {
      authenticateSpotify(setRoomInfo, guest.guest_id);
      const token = await getSpotifyToken();
      setRoomInfo((prevState) => ({
        ...prevState,
        access_token: token.access_token,
      }));
    };
    fetchRoom();
    fetchToken();
  }, []);

  useEffect(() => {
    chatSocket.onopen = (e) => {
      chatSocket.send(
        JSON.stringify({
          connection: { guest_id: guest.guest_id },
        })
      );
      console.log("Successfully connected to the WebSocket.");
    };
  }, []);

  return (
    <div>
      <RoomNav
        setModalOpen={setModalOpen}
        setOpenChat={setOpenChat}
        setSearchActive={setSearchActive}
        searchActive={searchActive}
      />
      <RoomInfo modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Chat
        openChat={openChat}
        setOpenChat={setOpenChat}
        chatSocket={chatSocket}
      />
      <div className="flex justify-end items-center max-w-7xl px-2 sm:px-6 lg:px-8 relative">
        {searchActive && <SearchMusic />}
      </div>
      <div className="mx-auto max-w-7xl flex ">
        <div className="relative p-2 sm:px-6 lg:px-8 ">
          <h2 className="text-lg w-auto">Room Code: {roomCode}</h2>
          <button
            className="absolute right-0 top-0 hover:bg-gray-200 rounded-xl p-1"
            onClick={() => {
              navigator.clipboard.writeText(roomCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <ClipboardDocumentIcon className="h-4 w-4 text-gray-500 " />
          </button>
          {copied && (
            <p className="bg-gray-800 text-white rounded-xl shadow-md text-xs px-2 py-1 w-fit absolute top-1 -right-24">
              {" "}
              Code copied!
            </p>
          )}
        </div>
      </div>
      <div>
        <div className="border rounded-xl shadow-xl bottom_center_align w-full max-w-md md:max-w-xl lg:max-w-5xl mx-auto -bottom-12 lg:bottom-0"></div>
        {roomInfo?.access_token && (
          <WebPlayback
            token={roomInfo?.access_token}
            chatSocket={chatSocket}
            roomCode={roomCode}
            id={guest.guest_id}
          />
        )}
      </div>
    </div>
  );
}

export default Room;
