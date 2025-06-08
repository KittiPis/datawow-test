"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { MenuCategories } from "@/components/MenuCategories";
import { CreatePostModal } from "@/components/CreatePostModal";
import { useCategory } from "@/context/CategoryContext";
import type { Category } from "@/types/types";
import { fetchUser } from "@/lib/apilogin";
import { LoginToast } from "@/components/LoginToast";

export function TopBarActions() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);

  async function handleAddCommentClick() {
    const userData = await fetchUser();
    if (!userData) {
      setShowLoginToast(true); // หรือเปิด Modal login
    } else {
      setIsModalOpen(true); // แสดงฟอร์มเขียนคอมเมนต์
    }
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="flex justify-center items-center gap-6 px-4 py-4 bg-gray-200 rounded-md">
        {/* 🔍 Search box */}
        <div className="flex flex-1 max-w-md items-center rounded-md border border-gray-300 bg-gray-200 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent outline-none placeholder-gray-600 text-sm"
          />
        </div>

        {/* ⬇️ Dropdown */}
        <div className="relative">
          <MenuCategories
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        {/* ➕ Create Button */}
        <button
          //onClick={() => setIsModalOpen(true)}
          onClick={handleAddCommentClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition"
        >
          Create +
        </button>

        <LoginToast
          show={showLoginToast}
          onClose={() => setShowLoginToast(false)}
        />
      </div>

      {/* 🧾 Modal */}
      {/* <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={[selectedCategory]} // เปลี่ยนเป็น allCategories ถ้ามี
        onSubmit={(data) => {
          console.log("📤 ส่งโพสต์:", data);
          setIsModalOpen(false);
          // 🔥 call API post ได้ที่นี่
        }}
      /> */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={[selectedCategory]} // ✅ เปลี่ยนตรงนี้
      />
    </>
  );
}
