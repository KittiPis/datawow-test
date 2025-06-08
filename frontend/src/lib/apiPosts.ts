import type { Post, PostPre } from "@/types/types";
// export interface PostPre {
//   id: number;
//   title: string;
//   summary: string;
//   author: string;
//   category: {
//     id: number;
//     name: string;
//     slug: string;
//   };
//   comment_count: number;
//   created_at: string;
// }

export async function getAllPosts(): Promise<PostPre[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const res = await fetch(`${baseUrl}/api/posts/summary?limit=100&offset=0`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch posts error:", error);
    return null;
  }
}

export async function getMyPosts(): Promise<PostPre[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const res = await fetch(
      `${baseUrl}/api/posts/my-posts?limit=100&offset=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch posts error:", error);
    return null;
  }
}

export async function getPostsSelect(
  category_id: number
): Promise<Post[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const res = await fetch(
      `${baseUrl}/api/posts/summary?limit=100&offset=0&category_id=${category_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch posts");

    const data: Post[] = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch posts error:", error);
    return null;
  }
}

export async function createPost(
  categoryId: number,
  title: string,
  content: string
): Promise<any> {
  try {
    // ✅ log ช่วย debug
    console.log("🚀 createPost sending:", { categoryId, title, content });

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_id: categoryId, // ✅ key ต้องใช้ชื่อว่า category_id ตรงตาม API ภายนอก
        title,
        content,
      }),
    });

    // ❌ ตรวจสอบสถานะตอบกลับ
    if (!res.ok) {
      let errorDetail = await res.text();
      try {
        const jsonErr = JSON.parse(errorDetail);
        errorDetail = jsonErr.message?.[0] ?? jsonErr.error ?? errorDetail;
      } catch (e) {
        // fallback เผื่อ response ไม่ใช่ JSON
      }

      console.error(
        "❌ Failed to create post : content must be at least 10 characters +",
        errorDetail
      );
      throw new Error(errorDetail || `POST /api/posts failed: ${res.status}`);
    }

    // ✅ ได้ผลลัพธ์จาก API
    const data = await res.json();
    console.log("✅ Post created:", data);
    return data;
  } catch (err) {
    console.error("❌ Error creating post:", err);
    throw err;
  }
}

export async function PATCHPost(
  postId: number,
  categoryId: number,
  title: string,
  content: string
): Promise<any> {
  try {
    console.log("🚀 PATCHPost sending:", {
      postId,
      categoryId,
      title,
      content,
    });

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category_id: categoryId,
        title,
        content,
      }),
    });

    if (!res.ok) {
      let errorDetail = await res.text();
      try {
        const jsonErr = JSON.parse(errorDetail);
        errorDetail = jsonErr.message?.[0] ?? jsonErr.error ?? errorDetail;
      } catch (e) {
        // fallback เผื่อ response ไม่ใช่ JSON
      }

      console.error("❌ Failed to update post:", errorDetail || res.statusText);
      throw new Error(errorDetail || `PATCH /api/posts/${postId} failed`);
    }

    const data = await res.json();
    console.log("✅ Post updated:", data);
    return data;
  } catch (err) {
    console.error("❌ Error updating post:", err);
    throw err;
  }
}
