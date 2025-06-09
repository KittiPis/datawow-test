import type { Post, PatchPostResponse ,DeletePostResponse } from "@/types/types";

export async function getAllPosts(): Promise<Post[] | null> {
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
  } catch {
    return null;
  }
}

export async function getMyPosts(): Promise<Post[] | null> {
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
  } catch {
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
  } catch {
    return null;
  }
}

export async function createPost(
  categoryId: number,
  title: string,
  content: string
): Promise<PatchPostResponse> {
  try {
    const res = await fetch("/api/posts", {
      method: "POST",
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
        throw e;
      }
      throw new Error(errorDetail || `POST /api/posts failed: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function PATCHPost(
  postId: number,
  categoryId: number,
  title: string,
  content: string
): Promise<PatchPostResponse> {
  try {
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
        throw e;
      }

      throw new Error(errorDetail || `PATCH /api/posts/${postId} failed`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function DELETEPost(postId: number): Promise<DeletePostResponse> {
  try {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {},
    });

    if (!res.ok) {
      let errorDetail = await res.text();
      try {
        const jsonErr = JSON.parse(errorDetail);
        errorDetail = jsonErr.message?.[0] ?? jsonErr.error ?? errorDetail;
      } catch (e) {
        throw e;
      }

      throw new Error(errorDetail || `DELETE /api/posts/${postId} failed`);
    }

    const data = await res.json().catch(() => null);
    return data ?? { success: true };
  } catch (err) {
    throw err;
  }
}
