import path from "path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "/contents/posts");
const EXTENSION = ".mdx";

/**
 * Markdown のファイル一覧を取得する
 */
const listContentFiles = ({ fs }) => {
  const filenames = fs.readdirSync(DIR);
  return filenames.filter((filename) => path.parse(filename).ext === EXTENSION);
};

/**
 * Markdown のファイルの中身をパースして取得する
 */
const readContentFile = async ({ fs, slug, filename }: readContentFileObj) => {
  if (slug === undefined) {
    slug = path.parse(filename).name;
  }
  const raw = fs.readFileSync(path.join(DIR, `${slug}${EXTENSION}`), "utf8");
  const { content, data } = matter(raw);

  return {
    slug,
    date: data.date,
    title: data.title,
    content,
  };
};

/**
 * Markdown のファイルの中身を全件パースして取得する
 */
const readContentFiles = async ({ fs }) => {
  const promisses = listContentFiles({ fs }).map((filename) =>
    readContentFile({ fs, filename })
  );
  const contents = await Promise.all(promisses);
  return contents.sort(sortWithProp("date", true));
};

/**
 * Markdown の投稿をソートするためのヘルパー
 */
const sortWithProp = (name, reversed) => (a, b) => {
  if (reversed) {
    return a[name] < b[name] ? 1 : -1;
  } else {
    return a[name] < b[name] ? -1 : 1;
  }
};

export { listContentFiles, readContentFile, readContentFiles };
