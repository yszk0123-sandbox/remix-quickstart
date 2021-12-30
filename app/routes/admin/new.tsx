import { ActionFunction, Form, redirect } from "remix";
import { createPost } from "~/post";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
};

export default function NewPost() {
  return (
    <Form method="post">
      <p>
        <label>
          Title: <input type="text" name="title" />
        </label>
      </p>
      <p>
        <label>
          Slug: <input type="text" name="slug" />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        <br />
        <textarea id="markdown" rows={20} name="markdown" />
      </p>
      <p>
        <button type="submit">Create</button>
      </p>
    </Form>
  );
}
