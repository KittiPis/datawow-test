"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Fragment } from "react";
import {
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import type { Post } from "@/types/types";
import { EditPostModal } from "@/components/EditPostModal";
import { DELETEPost } from "@/lib/apiPosts";
import Image from "next/image";

export function PostCard({
  post,
  onUpdated,
}: {
  post: Post;
  onUpdated: () => void;
}) {
  const pathname = usePathname();
  const isMyPostsPage = pathname === "/our-blog";

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      await DELETEPost(post.id);
      onUpdated();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
        onUpdated={onUpdated}
      />

      <Transition show={showDeleteModal} as={Fragment}>
        <Dialog
          onClose={() => setShowDeleteModal(false)}
          className="relative z-50"
        >
          <TransitionChild
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center">
            <TransitionChild
              as={Fragment}
              enter="transition duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition duration-150 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-sm rounded-md bg-white p-6 text-center shadow-md">
                <DialogTitle className="font-semibold text-lg text-gray-900">
                  Please confirm if you wish to delete the post
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to delete the post?
                  <br />
                  Once deleted, it cannot be recovered.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loadingDelete}
                    className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loadingDelete}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    {loadingDelete ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <Link href={`/our-blog/${post.id}`} className="block">
        <div className=" bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:bg-gray-50 transition space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/olivia-rhye.jpg"
                alt={post.author.username}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />

              <span className="text-sm font-semibold text-gray-900">
                {post.author.username}
              </span>
            </div>

            {isMyPostsPage && (
              <div className="flex gap-2 text-right">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEditModal(true);
                  }}
                  className="text-gray-500 hover:text-green-600"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDeleteModal(true);
                  }}
                  className="text-gray-500 hover:text-red-600"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-gray-100 px-1 py-1 text-xs font-medium text-gray-700">
              {post.category.name}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>

          <p className="text-sm text-gray-700 break-words max-w-full overflow-hidden">
            {post.summary}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>{post.comment_count} Comments</span>
          </div>
        </div>
      </Link>
    </>
  );
}
