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
import ToolTip from "../components/ToolTip";

function Room() {
  const { roomCode } = useParams();
  const guest = JSON.parse(localStorage.getItem("guest"));
  const [roomInfo, setRoomInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deviceID, setDeviceID] = useState(null);
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
        deviceID={deviceID}
      />
      <RoomInfo modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Chat
        openChat={openChat}
        setOpenChat={setOpenChat}
        chatSocket={chatSocket}
      />
      <div className="flex justify-end items-center max-w-7xl px-2 sm:px-6 lg:px-8 relative">
        {searchActive && (
          <SearchMusic
            token={roomInfo?.access_token}
            guest_id={guest.guest_id}
          />
        )}
      </div>
      <div className="mx-auto max-w-7xl flex ">
        <div className="relative p-2 sm:px-6 lg:px-8 flex">
          <h2 className="block lg:hidden text-lg  w-auto">
            Room Code: {roomCode}
          </h2>

          <h2 className="hidden lg:block text-lg  w-auto">
            Room Code: {roomCode}
          </h2>
          <ToolTip text={"copy"}>
            <button
              className="hover:bg-gray-200 rounded-xl p-1"
              onClick={() => {
                navigator.clipboard.writeText(roomCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <ClipboardDocumentIcon className="h-4 w-4 text-gray-500 " />
            </button>
          </ToolTip>

          {copied && (
            <p className="bg-gray-800 text-white rounded-xl shadow-md text-xs px-2 py-1 w-fit absolute top-1 -right-24">
              {" "}
              Code copied!
            </p>
          )}
        </div>
      </div>
      <div>
        {roomInfo?.access_token && (
          <WebPlayback
            token={roomInfo?.access_token}
            chatSocket={chatSocket}
            roomCode={roomCode}
            id={guest.guest_id}
            deviceID={deviceID}
            setDeviceID={setDeviceID}
          />
        )}
      </div>
    </div>
  );
}

export default Room;
