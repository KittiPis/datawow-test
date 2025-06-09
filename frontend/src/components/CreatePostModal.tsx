"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MenuCategories } from "@/components/MenuCategories";
import type { Category } from "@/types/types";
import { createPost } from "@/lib/apiPosts";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 0,
    name: "Community",
    slug: "community",
  });

  const [categoryId, setCategoryId] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (categoryId === 0) {
      setError("Please select a category");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and content");
      return;
    }

    try {
      setLoading(true);
      await createPost(categoryId, title, content);

      setTitle("");
      setContent("");
      setCategoryId(0);
      setSelectedCategory({
        id: 0,
        name: "Community",
        slug: "community",
      });
      setError(null);
      onClose();
    } catch (err) {
      setError("Oops! Something went wrong while submitting your post." + err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryId(category.id);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md md:max-w-xl rounded-md bg-white p-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold">
              Create Post
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4">
            <MenuCategories
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />

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

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
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
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
