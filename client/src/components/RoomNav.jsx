import { Disclosure, Menu, Transition } from "@headlessui/react";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterIcon";
import React from "react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ToolTip from "./ToolTip";
import { leaveRoom } from "../services/roomService";
import SearchMusic from "./SearchMusic";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function RoomNav({
  setModalOpen,
  setOpenChat,
  setSearchActive,
  searchActive,
  deviceID,
  chatSocket,
  guest,
}) {
  const navigate = useNavigate();
  const room = JSON.parse(localStorage.getItem("recent_room"));
  const settings = () => {
    setModalOpen(true);
  };
  const onLeaveClick = async () => {
    const success = await leaveRoom();
    success ? navigate("/") : console.log("unable to leave room");
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <>
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between ">
            <div className="flex flex-1  items-stretch justify-start">
              <div className="">
                <h2 className="block text-lg text-white">
                  You're in: {room.name}
                </h2>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4"></div>
              </div>
            </div>
            <div className=" inset-y-0 right-0 static sm:inset-auto sm:ml-6 pr-0 ">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div className="flex justify-start items-center gap-4">
                  {deviceID && (
                    <ToolTip text={"search"}>
                      <button
                        className="flex rounded-full bg-gray-800 text-sm hover:bg-gray-400 p-1 z-10"
                        onClick={() => setSearchActive(!searchActive)}
                      >
                        <span className="sr-only">Search Music</span>
                        <MagnifyingGlassIcon className="text-white h-6 w-6" />
                      </button>
                    </ToolTip>
                  )}
                  <ToolTip text={"chat"}>
                    <button
                      className="flex rounded-full bg-gray-800 text-sm hover:bg-gray-400 p-1 z-10"
                      onClick={() => setOpenChat(true)}
                    >
                      <span className="sr-only">Open Chat</span>
                      <ChatBubbleBottomCenterIcon className="text-white h-6 w-6" />
                    </button>
                  </ToolTip>
                  <ToolTip text={"more"}>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm hover:bg-gray-400 -ml-1 z-10">
                      <span className="sr-only">Open user menu</span>
                      <EllipsisVerticalIcon className="text-white h-6 w-6" />
                    </Menu.Button>
                  </ToolTip>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={settings}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                          )}
                        >
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onLeaveClick}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                          )}
                        >
                          Leave Room
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className="flex justify-end items-center max-w-7xl px-2 sm:px-6 lg:px-8 relative ">
                {searchActive && (
                  <SearchMusic
                    guest_id={guest.guest_id}
                    chatSocket={chatSocket}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </Disclosure>
  );
}

export default RoomNav;
