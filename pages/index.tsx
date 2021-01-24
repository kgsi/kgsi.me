import fs from "fs";
import Link from "next/link";
import Layout from "../components/Layouts";
import { readContentFiles } from "../libs/content-loader";

export default function Home(props) {
  const posts = props.posts;
  return (
    <Layout title="kgsi.me">
      <hr />
      <ul>
        {posts.map((post) => (
          <li key={post.slug} className="font-size-3xl pb-1 text-lg">
            <Link href="/posts/[id]" as={`/posts/${post.slug}`}>
              <a>
                <time>{post.date}</time>
                <span>{post.title}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const MAX_COUNT = 5;
  const posts = await readContentFiles({ fs });
  return {
    props: {
      posts: posts.slice(0, MAX_COUNT),
    },
  };
}
