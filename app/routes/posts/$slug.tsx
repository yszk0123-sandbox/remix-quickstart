import { LoaderFunction, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");

  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData();

  return (
    <div>
      <h1>Title: {post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>
  );
}
