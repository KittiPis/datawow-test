"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MenuCategories } from "@/components/MenuCategories";
import { CreatePostModal } from "@/components/CreatePostModal";
import { useCategory } from "@/context/CategoryContext";
import type { Category } from "@/types/types";
import { fetchUser } from "@/lib/apilogin";
import { LoginToast } from "@/components/LoginToast";
import { useSearch } from "@/context/SearchContext";

export function TopBarActions() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();

  async function handleAddCommentClick() {
    const userData = await fetchUser();
    if (!userData) {
      setShowLoginToast(true);
    } else {
      setIsModalOpen(true);
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-center md:items-center items-end gap-4 md:gap-6 px-4 py-4 bg-gray-200 rounded-md">
        {/* Search Box */}
        <div className="flex w-full md:w-auto max-w-md items-center rounded-md border border-gray-300 bg-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent outline-none placeholder-gray-600 text-sm"
          />
        </div>

        <div className="relative w-full md:w-auto self-end md:self-auto">
          <MenuCategories
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        <button
          onClick={handleAddCommentClick}
          className="w-full md:w-auto self-end md:self-auto bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition"
        >
          Create +
        </button>

        <LoginToast
          show={showLoginToast}
          onClose={() => setShowLoginToast(false)}
        />
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
