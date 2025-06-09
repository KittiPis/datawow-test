import type { Post } from "@/types/types";

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
}
export async function getPostsDetail(id: number): Promise<Post | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const res = await fetch(`${baseUrl}/api/posts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch post with id ${id}`);
    }

    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
