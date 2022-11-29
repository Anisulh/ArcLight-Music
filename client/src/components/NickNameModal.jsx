import { useState } from "react";
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";
import { saveNickName } from "../services/guestService";

function NickNameModal({ nicknameOpen, cancelButtonRef, setNicknameOpen }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(null);
  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!nickname) {
      return setError("No nickname provided");
    }
    const response = await saveNickName(nickname, setError);
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("guest", JSON.stringify(data));
      navigate("/room");
      setNicknameOpen(false);
    } else {
      setError("Unable to set Nickname.");
    }
  };
  return (
    <>
      {error && <Error message={error} />}
      <Transition.Root show={nicknameOpen} as={Fragment}>
        <Dialog
          as="div"
          id="wrapper"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => setNicknameOpen(false)}
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

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 bg- sm:mx-0 sm:h-10 sm:w-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-8 h-6 text-emerald-800"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          Add a Nickname
                        </Dialog.Title>
                        <div className="mt-2">
                          <form id="nicknameForm" onSubmit={onFormSubmit}>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              required
                              value={nickname}
                              onChange={(e) => setNickname(e.target.value)}
                            ></input>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      form="nicknameForm"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Set Nickname
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setNicknameOpen(false);
                      }}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default NickNameModal;
