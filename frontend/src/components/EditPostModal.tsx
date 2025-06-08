"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MenuCategories } from "@/components/MenuCategories";
import type { Category, PostPre } from "@/types/types";
import { PATCHPost } from "@/lib/apiPosts";
import { useRouter } from "next/navigation";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostPre;
}

export function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    post.category
  );
  const [categoryId, setCategoryId] = useState<number>(post.category.id);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.summary); // ใช้ summary ชั่วคราว (ถ้าไม่มี content จริง)
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // อัปเดตค่าเริ่มต้นใหม่เมื่อ post เปลี่ยน (เช่น เปิด modal อันใหม่)
  useEffect(() => {
    setSelectedCategory(post.category);
    setCategoryId(post.category.id);
    setTitle(post.title);
    setContent(post.summary); // สมมติว่าไม่มี content จริง
    setError(null);
  }, [post]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryId(category.id);
    setError(null);
  };

  const handleSubmit = async () => {
    if (categoryId === 0) {
      setError("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("กรุณากรอกชื่อหัวข้อและเนื้อหา");
      return;
    }

    try {
      setLoading(true);
      await PATCHPost(post.id, categoryId, title, content);
      console.log("✅ Post updated");
      router.refresh(); //
      onClose();
    } catch (err) {
      console.error("❌ Failed to update post", err);
      setError("เกิดข้อผิดพลาดในการอัปเดตโพสต์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md md:max-w-xl rounded-md bg-white p-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold">
              Edit Post
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4">
            {/* หมวดหมู่ */}
            <MenuCategories
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />

            {/* หัวข้อ */}
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Title"
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:outline-none"
            />

            {/* เนื้อหา */}
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError(null);
              }}
              placeholder="What’s on your mind..."
              rows={5}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring focus:outline-none resize-none"
            />

            {error && (
              <div className="text-sm text-red-600 font-medium animate-fade-in">
                {error}
              </div>
            )}
          </div>

          {/* ปุ่ม */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
