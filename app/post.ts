import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  html: string;
};

export type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return (
    attributes !== null &&
    typeof attributes === "object" &&
    typeof attributes.title === "string"
  );
}

export async function getPosts() {
  const dir = await fs.readdir(postsPath);

  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter(file.toString());

      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data`
      );

      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, `${slug}.md`);
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());

  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );

  const html = marked(body);

  return { slug, html, title: attributes.title };
}

export async function createPost(post: NewPost): Promise<Post> {
  const md = [
    `---`,
    `title: ${post.title}`,
    `---`,
    ``,
    `${post.markdown}`,
  ].join("\n");
  const filepath = path.join(postsPath, `${post.slug}.md`);

  await fs.writeFile(filepath, md);

  return getPost(post.slug);
}
