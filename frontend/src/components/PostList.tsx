import type { PostPre } from "@/types/types";
import { PostCard } from './PostCard';

interface PostListProps {
  posts: PostPre[] | null; // ✅ รับได้ทั้ง array หรือ null
}

export function PostList({ posts }: PostListProps) {
  if (posts === null) {
    return (
      <div className="text-red-500 text-sm">
        🚨 โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่ภายหลัง
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="text-gray-500">ยังไม่มีกระทู้</p>;
  }

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
