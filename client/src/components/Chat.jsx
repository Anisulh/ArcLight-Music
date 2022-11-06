import React from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";

function Chat({ openChat, setOpenChat, chatSocket }) {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const [formData, setFormData] = useState({ message: "" });
  const [messages, setMessages] = useState([]);
  const { message } = formData;
  const onFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onFormSubmit = (e) => {
    e.preventDefault();

    chatSocket.send(
      JSON.stringify({
        guest_id: guest.guest_id,
        message,
      })
    );
    setFormData({ message: "" });
  };
  useEffect(() => {
    chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.message) {
        setMessages((prevState) => [...prevState, data.message]);
      }
      if (data.connection) {
        setMessages((prevState) => [...prevState, data.connection]);
      }
    };
  }, []);

  return (
    <Transition.Root show={openChat} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenChat}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 ">
          <div className="absolute inset-0 ">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md ">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpenChat(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col  bg-white py-6 shadow-xl ">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-xl font-medium text-gray-900">
                        Chat
                      </Dialog.Title>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6 flex flex-col ">
                      <div className="flex-1 border rounded-xl my-2 p-2 w-full overflow-y-auto">
                        {/* messages */}
                        {messages?.map((message) => {
                          if (message.guest) {
                            return (
                              <div
                                key={message.guest}
                                className="flex items-center justify-center text-gray-400 text-sm"
                              >
                                {message.guest} has joined the room
                              </div>
                            );
                          } else if (message.guest_id === guest.guest_id) {
                            return (
                              <div
                                key={message._id}
                                className="flex justify-end items-center gap-2 my-2"
                              >
                                <div className="p-2 bg-gray-300 rounded-xl w-fit max-w-xs">
                                  <p className="text-sm break-words">
                                    {message.message}
                                  </p>
                                </div>
                                <div className="flex items-center justify-center rounded-full bg-gray-300 w-8 h-8">
                                  {message.nickname[0]}
                                </div>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={message._id}
                                className="flex justify-start items-center gap-2 my-2"
                              >
                                <div className="flex items-center justify-center rounded-full bg-gray-300 w-8 h-8">
                                  {message.nickname[0]}
                                </div>
                                <div className="p-2 bg-gray-300 rounded-xl w-fit max-w-xs">
                                  <p className="text-sm break-words">
                                    {message.message}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      <div className=" my-2">
                        <form
                          className="flex items-center justify-between gap-2"
                          onSubmit={onFormSubmit}
                        >
                          <textarea
                            type="text"
                            className="border-2 rounded-lg h-10 w-full p-1"
                            name="message"
                            value={message}
                            onChange={onFormChange}
                          />
                          <button
                            type="submit"
                            className="
      h-10
      px-2
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded-lg
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-outborder-2 "
                          >
                            Submit
                          </button>
                        </form>
                      </div>

                      {/* <div className="flex flex-col px-4 sm:px-6 ">
                        <div
                          className="border rounded-xl border-gray-200  flex-1"
                          aria-hidden="true"
                        ></div>
                        <div className="flex absolute bottom-0 justify-between w-full">
                          <textarea
                            type="text"
                            className="border-2 rounded h-10 w-full"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="
      p-2
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
      ease-in-outborder-2 "
                          >
                            Submit
                          </button>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Chat;
