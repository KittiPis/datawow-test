// 📁 src/lib/apiCategories.ts
type Comment = {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
};

export async function postComment(post_id: number, content: string) {

    console.log("post_id : ",post_id,content)
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id, content }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to post comment:", errorText);
      throw new Error(`POST /api/comments failed: ${res.status}`);
    }

    const data = await res.json();
    return data; // ✅ data = { id, content, created_at, user }
  } catch (err) {
    console.error("Error posting comment:", err);
    throw err;
  }
}
