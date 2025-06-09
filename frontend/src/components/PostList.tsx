import type { Post } from "@/types/types";
import { PostCard } from "./PostCard";

export function PostList({
  posts,
  onUpdated,
}: {
  posts: Post[] | null;
  onUpdated: () => void;
}) {
  if (posts === null) {
    return (
      <div className="text-red-500 text-sm">
        Failed to load data. Please try again later.
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-gray-500 text-center">No posts yet</p>;
  }

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdated={onUpdated} />
      ))}
    </div>
  );
}
