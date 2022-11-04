import React, { useState } from "react";
import CreateRoomForm from "../components/CreateRoomForm";
import JoinRoomForm from "../components/JoinRoomForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RoomEntry() {
  const [navigation, setNavigation] = useState([
    { name: "Create Room", current: true },
    { name: "Join Room", current: false },
  ]);
  const [modalOpen, setModalOpen] = useState(true);

  const onNavClick = () => {
    let newArr = [...navigation];
    const updatedArr = newArr.map((item) => {
      item.current = !item.current;
      return item;
    });
    setNavigation(updatedArr);
  };
  return (
    <div className="flex h-screen px-4 -my-16">
      <div className="m-auto w-full max-w-lg shadow-md">
        <div className=" bg-gray-800 rounded-t-md ">
          <div className="flex h-16">
            <div className="flex flex-1 items-center justify-center ">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavClick();
                      setModalOpen(!modalOpen);
                    }}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "px-3 py-2 rounded-md text-sm font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {modalOpen ? <CreateRoomForm /> : <JoinRoomForm />}
      </div>
    </div>
  );
}
