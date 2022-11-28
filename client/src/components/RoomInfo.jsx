import React, { useRef } from "react";
import { useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { saveRoomInfo } from "../services/roomService";
import Error from "./Error";

function RoomInfo({ modalOpen, setModalOpen }) {
  const { roomCode } = useParams();
  const roomInfo = JSON.parse(localStorage.getItem("recent_room"));
  const guest = JSON.parse(localStorage.getItem("guest"));
  const [roomSettings, setRoomSettings] = useState({ ...roomInfo });
  const { name, host_id, guest_controller } = roomSettings;

  const [edit, setEdit] = useState(false);
  const [error, setError] = useState(
    !guest.host && edit ? "You are not authorized to update settings" : null
  );
  const cancelButtonRef = useRef(null);

  const onFormChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    setRoomSettings((prevState) => ({
      ...prevState,
      [e.target.name]: boolean ?? e.target.value,
    }));
  };
  const onFormSubmission = async (e) => {
    e.preventDefault();
    const response = await saveRoomInfo(
      host_id,
      name,
      guest_controller,
      roomCode,
      setError
    );
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      localStorage.setItem("recent_room", JSON.stringify(data));
      roomInfo = JSON.parse(localStorage.getItem("recent_room"));
      setRoomSettings({ ...roomInfo });
      setEdit(false);
      setModalOpen(false);
    } else {
      setError("Unable to update room settings.");
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        id="wrapper"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed left-0 right-0  top-1/4">
          <div className="m-auto flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-800 rounded-md">
                  <h3 className="text-lg font-medium leading-6 text-white">
                    You're in:{" "}
                    {edit ? (
                      <input
                        type="text"
                        name="name"
                        className="rounded-md text-black font-normal pl-2"
                        value={name}
                        required
                        onChange={onFormChange}
                      />
                    ) : (
                      roomInfo && roomInfo.name
                    )}
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm text-slate-300">
                    Room details and settings
                  </p>
                </div>
                <form onSubmit={onFormSubmission}>
                  <div className=" border-gray-200 rounded-md">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Room Code:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {roomInfo ? roomInfo.code : roomCode}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Guest Control:
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {edit ? (
                            <>
                              <input
                                type="radio"
                                name="guest_controller"
                                value={true}
                                defaultChecked={guest_controller ? true : false}
                                onChange={onFormChange}
                              />
                              <label htmlFor="true"> True </label>
                              <input
                                type="radio"
                                name="guest_controller"
                                value={false}
                                onChange={onFormChange}
                              />
                              <label htmlFor="false"> False</label>
                            </>
                          ) : roomInfo && roomInfo.guest_controller ? (
                            "Enabled"
                          ) : (
                            "Disabled"
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  {error && <Error message={error} />}
                  {edit ? (
                    <>
                      <div className="flex items-center justify-center my-2 mt-3 ">
                        <button
                          type="submit"
                          className="px-6
      py-3
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                        >
                          Save
                        </button>
                      </div>
                      <div className="flex items-center justify-center  mb-5">
                        <button
                          type="button"
                          className="px-6
      py-2
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                          onClick={() => setEdit(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : guest.host ? (
                    <div className="flex items-center justify-center my-5 ">
                      <button
                        type="button"
                        className="px-6
                    py-3
                    bg-blue-600
                    text-white
                    font-medium
                    text-xs
                    leading-tight
                    uppercase
                    rounded
                    shadow-md
                    hover:bg-blue-700 hover:shadow-lg
                    focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
                    active:bg-blue-800 active:shadow-lg
                    transition
                    duration-150
                    ease-in-out"
                        onClick={() => setEdit(true)}
                      >
                        Edit
                      </button>
                    </div>
                  ) : null}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default RoomInfo;
