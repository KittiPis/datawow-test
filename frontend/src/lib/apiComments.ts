
export async function postComment(post_id: number, content: string) {
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id, content }),
    });

    if (!res.ok) {
      throw new Error(`POST comments failed: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}
