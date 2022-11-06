import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRoomInfo } from "../services/roomService";
import RoomInfo from "../components/RoomInfo";
import {
  authenticateSpotify,
  fetchCurrentPlaying,
  getSpotifyToken,
} from "../services/spotifyServices";
import RoomNav from "../components/RoomNav";
import SearchResult from "../components/SearchResult";
import SearchMusic from "../components/SearchMusic";
import { Dialog, Transition } from "@headlessui/react";
import WebPlayback from "../components/WebPlayback";
import { connect } from "../services/chatService";
import Chat from "../components/Chat";

function Room() {
  const { roomCode } = useParams();
  const guest = JSON.parse(localStorage.getItem("guest"));
  const [roomInfo, setRoomInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [chatSocket, setChatSocket] = useState(
    new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomCode}/`)
  );

  useEffect(() => {
    const fetchRoom = async () => {
      const data = fetchRoomInfo(roomCode);
      setRoomInfo(data);
    };
    const fetchToken = async () => {
      authenticateSpotify(setRoomInfo);
      const token = await getSpotifyToken();
      setRoomInfo((prevState) => ({
        ...prevState,
        access_token: token.access_token,
      }));
    };
    const roomData = JSON.parse(localStorage.getItem("recent_room"));
    roomData && roomData.code === roomCode
      ? setRoomInfo(roomData)
      : fetchRoom();

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
    <>
      <RoomNav setModalOpen={setModalOpen} setOpenChat={setOpenChat} />
      <RoomInfo modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Chat
        openChat={openChat}
        setOpenChat={setOpenChat}
        chatSocket={chatSocket}
      />
      <div>
        <SearchMusic
          setSearchResults={setSearchResults}
          setResultModalOpen={setResultModalOpen}
        />
        {resultModalOpen && (
          <Transition.Root show={resultModalOpen} as={Fragment}>
            <Dialog
              as="div"
              id="wrapper"
              onClose={() => setResultModalOpen(false)}
            >
              <div>
                <div className="flex items-end justify-center p-4 text-center  sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="fixed max-h-52 overflow-y-auto inset-0 transform mx-10 sm:mx-28 md:mx-40  lg:mx-52 my-5 rounded-lg bg-white text-left mt-52 shadow-xl transition-all ">
                      <div className="bg-white px-4 pb-4  sm:p- sm:pb-4">
                        {searchResults.map((result, index) => (
                          <SearchResult
                            key={index}
                            result={result}
                            setCurrentlyPlaying={setCurrentlyPlaying}
                            setResultModalOpen={setResultModalOpen}
                          />
                        ))}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        )}
      </div>
      {/* <div className="">
        <div className="border rounded-xl shadow-xl bottom_center_align w-full max-w-md md:max-w-xl lg:max-w-5xl mx-auto -bottom-12 lg:bottom-0"></div>
        {roomInfo?.access_token && (
          <WebPlayback token={roomInfo?.access_token} />
        )}
      </div> */}
    </>
  );
}

export default Room;
