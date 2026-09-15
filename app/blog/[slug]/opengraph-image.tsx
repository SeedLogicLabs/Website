import { getAllPosts, getPost } from "@/lib/content/blog";
import { formatDate } from "@/lib/content/schemas";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return renderOgImage({
    eyebrow: post ? `Blog · ${formatDate(post.meta.date)}` : "Blog",
    title: post?.meta.title ?? "Notes from the studio",
    subtitle: post?.meta.description,
  });
}
