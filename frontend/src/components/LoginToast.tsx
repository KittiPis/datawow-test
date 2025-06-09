"use client";

import { Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

type Props = {
  show: boolean;
  onClose: () => void;
};

export function LoginToast({ show, onClose }: Props) {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 translate-y-2 sm:translate-x-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
            <div className="p-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-yellow-500"
                  />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-gray-900">
                    Please login
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    You must log in before you can post a comment.
                  </p>
                  <div className="mt-3 flex space-x-4">
                    <button
                      onClick={() => (window.location.href = "/login")}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={onClose}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="ml-4 flex shrink-0">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
