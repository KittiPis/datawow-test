// src/app/(page)/our-blog/[id]/PostDetailClient.tsx
"use client";

import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import { CommentForm } from "@/components/CommentForm";
import { postComment } from "@/lib/apiComments";
import { Post, Comment } from "@/types/types";
import { LoginToast } from "@/components/LoginToast";
//import { isLoggedIn } from "@/utils/authUtils";
//import { useAuth } from "@/components/AuthProvider";
import { fetchUser } from "@/lib/apilogin";

export function PostDetailClient({ post }: { post: any }) {
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [showForm, setShowForm] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  //const { user, isFetching, login, reloadUser } = useAuth(); // ✅ เช็กว่ากำลังโหลด context หรือเปล่า

  async function handleSubmit(content: string) {
    try {
      const newComment = await postComment(post.id, content);
      setComments((prev) => [newComment, ...prev]);
      setShowForm(false);
    } catch (e) {
      alert("ส่งคอมเมนต์ไม่สำเร็จ");
    }
  }

  async function handleAddCommentClick() {
    const userData = await fetchUser();
    if (!userData) {
      setShowLoginToast(true); // หรือเปิด Modal login
    } else {
      setShowForm(true); // แสดงฟอร์มเขียนคอมเมนต์
    }
  }

  return (
    <div className="bg-white px-4 py-3 sm:px-6 md:px-8 rounded-md shadow-xl">
      {/* 🔙 Back Icon Button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* 👤 Author Block */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src="/olivia-rhye.jpg"
          alt={post.author.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {post.author.username}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* 🏷️ Category badge */}
      <div className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 font-medium mb-2">
        {post.category.name}
      </div>

      {/* 📝 Title & Content */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
        {post.title}
      </h1>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>

      {/* 💬 Comment Count */}
      <div className="mt-6 flex items-center text-sm text-gray-500 gap-1">
        <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
        <span>{comments.length} Comments</span>
      </div>

      {/* ➕ Add Comment Button */}
      {!showForm && (
        <button
          onClick={handleAddCommentClick}
          className="mt-4 mb-6 border border-green-500 text-green-600 px-4 py-1.5 rounded hover:bg-green-50 text-sm font-medium"
        >
          Add Comments
        </button>
      )}

      {/* {!showForm && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 mb-6 border border-green-500 text-green-600 px-4 py-1.5 rounded hover:bg-green-50 text-sm font-medium"
        >
          Add Comments
        </button>
      )} */}

      {showForm && (
        <CommentForm
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <LoginToast
        show={showLoginToast}
        onClose={() => setShowLoginToast(false)}
      />

      {/* 💬 Comment List */}
      <div className="pl-4 sm:pl-6">
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <img
                  alt=""
                  src="/user.png"
                  className="size-8 rounded-full bg-gray-50"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {comment.user.username}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    {new Date(comment.created_at).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">ยังไม่มีความคิดเห็น</p>
          )}
        </div>
      </div>
    </div>
  );
}
