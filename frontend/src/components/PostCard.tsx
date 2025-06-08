"use client";

import type { PostPre } from "@/types/types";
import Link from "next/link";
import {
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { EditPostModal } from "@/components/EditPostModal"; // ✅ import modal

interface Props {
  post: PostPre;
}

export function PostCard({ post }: Props) {
  const pathname = usePathname();
  const isMyPostsPage = pathname === "/our-blog";

  const [showEditModal, setShowEditModal] = useState(false);
  

  return (
    <>
      {/* ✅ modal */}
      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />

      <Link href={`/our-blog/${post.id}`} className="block">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:bg-gray-50 transition space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={"/olivia-rhye.jpg"}
                alt={post.author}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-gray-900">
                {post.author}
              </span>
            </div>

            {isMyPostsPage && (
              <div className="flex gap-2 text-right">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEditModal(true); // ✅ เปิด modal
                  }}
                  className="text-gray-500 hover:text-green-600"
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("🗑️ Delete", post.id);
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

          <p className="text-sm text-gray-600 line-clamp-2">{post.summary}</p>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span>{post.comment_count} Comments</span>
          </div>
        </div>
      </Link>
    </>
  );
}
