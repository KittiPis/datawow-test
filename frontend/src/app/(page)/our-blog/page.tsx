"use client";

import { useEffect, useState } from "react";
import { getMyPosts, getPostsSelect } from "@/lib/apiPosts";
import { PostList } from "@/components/PostList";
import { useCategory } from "@/context/CategoryContext";
import type { Post } from "@/types/types";
import { useSearch } from "@/context/SearchContext";

export default function MyPostsPage() {
  const { selectedCategory } = useCategory();
  const [posts, setPosts] = useState<Post[]>([]);
  const { searchTerm } = useSearch();

  const filteredPosts =
    searchTerm.length >= 2
      ? posts.filter((post) => {
          const search = searchTerm.toLowerCase();
          return (
            (post.title?.toLowerCase() ?? "").includes(search) ||
            (post.summary?.toLowerCase() ?? "").includes(search) ||
            (post.content?.toLowerCase() ?? "").includes(search) ||
            (post.author?.username?.toLowerCase() ?? "").includes(search) ||
            (post.category?.name?.toLowerCase() ?? "").includes(search)
          );
        })
      : posts;

  useEffect(() => {
    const fetchInitialPosts = async () => {
      const allPosts = await getMyPosts();
      setPosts(allPosts ?? []);
    };
    fetchInitialPosts();
  }, []);

  const reloadPosts = async () => {
    if (selectedCategory?.id !== undefined) {
      const result = await getPostsSelect(selectedCategory.id);
      setPosts(result ?? []);
    } else {
      const allPosts = await getMyPosts();
      setPosts(allPosts ?? []);
    }
  };

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
        <PostList posts={filteredPosts} onUpdated={reloadPosts} />
      </div>
    </div>
  );
}
