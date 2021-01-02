import fs from "fs";
import path from "path";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import Layout from "../../components/Layouts";
import { readContentFile, listContentFiles } from "../../libs/content-loader";

export default function Post(params) {
  const content = hydrate(params.soruce);
  return (
    <Layout title={params.title}>
      <div className="post-meta">
        <span>{params.date}</span>
      </div>
      <div className="post-body">{content}</div>
    </Layout>
  );
}
/**
 * ページコンポーネントで使用する値を用意する
 */
export async function getStaticProps({ params }) {
  const soruces = await readContentFile({ fs, slug: params.slug });
  const mdxSource = await renderToString(soruces.content);
  return {
    props: {
      title: soruces.title,
      date: soruces.date,
      soruce: mdxSource,
    },
  };
}
/**
 * 有効な URL パラメータを全件返す
 */
export async function getStaticPaths() {
  const paths = listContentFiles({ fs }).map((filename: string) => ({
    params: {
      slug: path.parse(filename).name,
    },
  }));
  return { paths, fallback: false };
}
