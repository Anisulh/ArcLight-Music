import { Fragment, useRef, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import NickNameModal from "./NickNameModal";
import { SiAzurefunctions } from "react-icons/si";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavBar({ homeRef, featureRef }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [nicknameOpen, setNicknameOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [navigation, setNavigation] = useState([
    {
      name: "Home",
      current: location.pathname !== "/" ? false : true,
      ref: homeRef,
    },
    { name: "Features", current: false, ref: featureRef },
  ]);
  const guest = JSON.parse(localStorage.getItem("guest"));
  const onNavClick = () => {
    let newArr = [...navigation];
    const updatedArr = newArr.map((item) => {
      item.current = !item.current;
      return item;
    });
    setNavigation(updatedArr);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div
                  className="flex flex-shrink-0 items-center cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <SiAzurefunctions className="block h-8 w-auto lg:hidden text-blue-400" />
                  <SiAzurefunctions className="hidden h-8 w-auto lg:block text-blue-400" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          location.pathname !== "/"
                            ? navigate("/")
                            : item.ref.current?.scrollIntoView();

                          console.log(item.ref.current);
                          onNavClick();
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3 z-20">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-300 text-lg focus:outline-none hover:bg-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 px-2">
                      <span className="sr-only">Open user menu</span>
                      {guest && guest.nickname ? guest.nickname[0] : null}
                    </Menu.Button>
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              setNicknameOpen(true);
                            }}
                            className={classNames(
                              active ? "bg-gray-100 " : "",
                              "block px-4 py-2 text-sm text-gray-700 w-full text-left "
                            )}
                          >
                            Change Nickname
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                            )}
                          >
                            Leave Session
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
          <NickNameModal
            setNicknameOpen={setNicknameOpen}
            cancelButtonRef={cancelButtonRef}
            nicknameOpen={nicknameOpen}
          />
        </>
      )}
    </Disclosure>
  );
}
