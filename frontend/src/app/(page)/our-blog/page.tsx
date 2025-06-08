"use client";

import { useEffect, useState } from "react";
import { getMyPosts, getPostsSelect } from "@/lib/apiPosts";
import { PostList } from "@/components/PostList";
import { useCategory } from "@/context/CategoryContext";
import type { PostPre } from "@/types/types";

export default function MyPostsPage() {
  const { selectedCategory } = useCategory();
  const [posts, setPosts] = useState<PostPre[]>([]);

  useEffect(() => {
    const fetchInitialPosts = async () => {
      const allPosts = await getMyPosts(); // ✅ โหลดครั้งแรก
      setPosts(allPosts ?? []);
    };
    fetchInitialPosts();
  }, []);

  // ✅ โหลดใหม่เมื่อมีการแก้ไข
  const reloadPosts = async () => {
    const result = await getMyPosts(); // หรือ getAllPosts ตามต้องการ
    setPosts(result ?? []);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-4">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
