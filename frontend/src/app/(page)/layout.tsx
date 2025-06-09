"use client";

import { useState, useEffect } from "react";
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
import { SVGProps, ComponentType } from "react";
import { TopBarActions } from "@/components/TopBarActions";
import { usePathname } from "next/navigation";
import { CategoryProvider } from "@/context/CategoryContext";
import { fetchUser } from "@/lib/apilogin";
import { LoginToast } from "@/components/LoginToast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { User } from "@/types/types";
import Link from "next/link";
import { SearchProvider } from "@/context/SearchContext";
import Image from "next/image";

type NavItem = {
  name: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  current?: boolean;
};

type UserNavItem = {
  name: string;
  href: string;
};

const rawNavigation: NavItem[] = [
  { name: "Home", href: "/home", icon: HomeIcon },
  { name: "Our Blog", href: "/our-blog", icon: PencilSquareIcon },
];

const userNavigation: UserNavItem[] = [{ name: "Sign out", href: "#" }];

function classNames(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, decodedRole } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isDetailPage = /^\/(posts|our-blog)\/\d+/.test(pathname);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigation = rawNavigation.map((item) => ({
    ...item,
    current: pathname === item.href,
  }));

  async function handleNavigationClick(item: NavItem) {
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      if (item.href === "/our-blog") {
        const user = await fetchUser();
        if (!user) {
          setShowLoginToast(true);
          return;
        }
      }

      router.push(item.href);
    } finally {
      setIsNavigating(false);
    }
  }

  useEffect(() => {
    const handleUser = async () => {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
      }
    };

    handleUser();
  }, []);

  return (
    <>
      <LoginToast
        show={showLoginToast}
        onClose={() => setShowLoginToast(false)}
      />
      <CategoryProvider>
        <SearchProvider>
          <div className="sr-only">Login Layout</div>
          <div className="h-screen flex flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-[#315045] text-white px-4 shadow sm:px-6 lg:px-8">
              <span className="italic text-lg font-semibold">a Board</span>
              <div className="flex items-center gap-4">
                <div className="grid flex-1 grid-cols-1"></div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {user ? (
                    <Menu as="div" className="relative">
                      <MenuButton className="-m-1.5 flex items-center p-1.5 focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <span className="lg:flex lg:items-center">
                          <span
                            aria-hidden="true"
                            className="mr-4 text-sm/6 font-semibold text-white"
                          >
                            {decodedRole || ""}
                          </span>
                        </span>
                        <Image
                          src="/user.png"
                          alt="User avatar"
                          width={32}
                          height={32}
                          className="rounded-full bg-gray-50"
                        />
                      </MenuButton>
                      <MenuItems
                        transition
                        className="absolute  bg-white right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md  py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        {userNavigation.map((item) => (
                          <MenuItem key={item.name}>
                            {item.name === "Sign out" ? (
                              <button
                                onClick={logout}
                                className="w-full text-left px-3 py-1 text-sm/6 text-gray-900 hover:bg-gray-50"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <a
                                href={item.href}
                                className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                              >
                                {item.name}
                              </a>
                            )}
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition"
                    >
                      Sign In
                    </Link>
                  )}
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
            </header>

            <div className="flex flex-1 overflow-hidden">
              <aside className="hidden lg:flex lg:w-64 flex-col border-r border-gray-200  pt-4 overflow-y-auto">
                <nav className="flex flex-1 flex-col pt-2">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1 p-2">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <button
                              onClick={() => handleNavigationClick(item)}
                              className={classNames(
                                pathname.startsWith(item.href)
                                  ? " text-green-500"
                                  : "text-gray-700 hover:text-green-500",
                                "w-full text-left group flex gap-x-3 rounded-md p-1 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  pathname.startsWith(item.href)
                                    ? "text-green-700"
                                    : "text-gray-700 group-hover:text-green-500",
                                  "size-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </aside>

              <main className="flex-1 overflow-y-auto  py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {!isDetailPage && (
                    <div className="mb-6">
                      <TopBarActions />
                    </div>
                  )}
                  <div>{children}</div>
                </div>
              </main>
            </div>

            <Dialog
              open={sidebarOpen}
              onClose={setSidebarOpen}
              className="relative z-50 lg:hidden"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/40 " />
              <div className="fixed inset-0 flex justify-end">
                <DialogPanel
                  transition
                  className="relative bg-white ml-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:translate-x-full"
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

                  <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4">
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1 mt-5">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <button
                                  onClick={() => handleNavigationClick(item)}
                                  className={classNames(
                                    pathname.startsWith(item.href)
                                      ? "bg-gray-50 text-green-700"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-green-500",
                                    "w-full text-left group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                      pathname.startsWith(item.href)
                                        ? "text-green-700"
                                        : "text-gray-400 group-hover:text-green-500",
                                      "size-6 shrink-0"
                                    )}
                                  />
                                  {item.name}
                                </button>
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
          </div>
        </SearchProvider>
      </CategoryProvider>
    </>
  );
}
