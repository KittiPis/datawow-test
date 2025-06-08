export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
  };
  comment_count: number;
  created_at: string;
  comments?: Comment[]; // 👈 เพิ่มตรงนี้
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
}
/**
 * ดึงโพสต์เดี่ยวจาก /api/posts/{id}
 */
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
  } catch (error) {
    console.error("Fetch post error:", error);
    return null;
  }
}
