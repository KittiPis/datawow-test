"use client";

import { useEffect, useState } from "react";
import { getAllPosts, getPostsSelect } from "@/lib/apiPosts";
import { PostList } from "@/components/PostList";
import { useCategory } from "@/context/CategoryContext";
import type { PostPre } from "@/types/types";

export default function HomePage() {
  const { selectedCategory } = useCategory();
  const [posts, setPosts] = useState<PostPre[]>([]);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      const allPosts = await getAllPosts(); // ✅ โหลดครั้งแรก
      setPosts(allPosts ?? []);
    };
    fetchInitialPosts();
  }, []);

  useEffect(() => {
    const fetchByCategory = async () => {
      if (selectedCategory?.id !== undefined) {
        const result = await getPostsSelect(selectedCategory.id);
        setPosts(result ?? []);
      }
    };

    fetchByCategory();
  }, [selectedCategory?.id]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-4">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
