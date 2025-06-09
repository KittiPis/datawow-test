import { getPostsDetail } from "@/lib/apiPostsDetail";
import { notFound } from "next/navigation";
import { PostDetailClient } from "@/components/PostDetailClient";

export default async function PostDetailPage(props: {
  params: { id: string };
}) {
  const params = await Promise.resolve(props.params);

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return notFound();

  const post = await getPostsDetail(id);
  if (!post) return notFound();

  return <PostDetailClient post={post} />;
}
