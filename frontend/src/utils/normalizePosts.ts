import type { Post, PostPre } from "@/types/types";

export function normalizePostPreList(preList: PostPre[]): Post[] {
  return preList.map((p): Post => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    content: "", // fallback
    created_at: p.created_at,
    category: p.category,
    author: {
      id: 0, // unknown
      username: p.author,
    },
    comment_count: p.comment_count,
    comments: [],
  }));
}
