"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  // { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
  { name: "Home", href: "#", icon: HomeIcon },
  { name: "Our Blog", href: "#", icon: PencilSquareIcon },
];

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function NavigationBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex justify-end">
            {" "}
            {/* ✅ align right */}
            <DialogPanel
              transition
              className="relative ml-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 right-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar content */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1 mt-5">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.current
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "size-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="">
          <div className="sticky top-0  flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-[#315045] text-white px-4 shadow-2xl sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Separator */}
            {/* <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-200 lg:hidden"
            /> */}
            <span className="italic text-lg">a Board</span>
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="grid flex-1 grid-cols-1"></div>

              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <span className="lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="mr-4 text-sm/6 font-semibold text-white"
                      >
                        Tom Cook
                      </span>
                    </span>
                    <img
                      alt=""
                      src="user.png"
                      className="size-8 rounded-full bg-gray-50"
                    />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
                {/* Separator */}
                {/* <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                /> */}
                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="h-6 w-px bg-gray-200 lg:hidden"
                />
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="-m-2.5 p-2.5 text-amber-50 lg:hidden"
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
              </div>
            </div>
          </div>

          <main className="py-3">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            </div>
          </main>
        </div>
        {/* Static sidebar for desktop */}
        <div className="hidden   lg:z-50 lg:flex lg:w-72 lg:flex-col ">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto  bg-white px-6 pb-4 ">
            {/* <div className="flex h-7 shrink-0 items-center"></div> */}
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-green-500"
                              : "text-gray-700 hover:bg-gray-50 hover:text-green-500",
                            "group flex gap-x-3 rounded-md p-1 text-sm/6 font-semibold"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              item.current
                                ? "text-indigo-600"
                                : "text-gray-700 group-hover:text-green-500",
                              "size-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
