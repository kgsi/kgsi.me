import type { NextPage, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getDatabase } from '../utils/notion'
import { Text } from '../components/Text'
import { Footer } from '../components/Footer'
import { Tag } from '../components/Tag'
import { Main } from '../layouts/Main'

export const databaseId = process.env.NOTION_DATABASE_ID || ''

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId)

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  }
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div>
      <Head>
        <title>kgsi.me</title>
        <meta name="description" content="プロダクトデザイナーkgsiのブログです。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <header className="my-10">
          <h1 className="text-3xl font-bold">kgsi.me</h1>
          <p className="mt-2">
            プロダクトデザイナー
            <Link href="https://twitter.com/kgsi">
              <a>@kgsi</a>
            </Link>
            の個人ブログです。
          </p>
        </header>
        <ul>
          {posts.results.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            const tag = post.properties.tags as any as Notion.Tag

            return (
              <li key={post.id} className="mt-10">
                <h2 className="font-bold text-xl">
                  {post.properties.page.type === 'title' && (
                    <Link href={`/articles/${post.id}`} passHref>
                      <a className="no-underline hover:underline hover:text-brand">
                        <Text text={post.properties.page.title} />
                      </a>
                    </Link>
                  )}
                </h2>
                <div className="mt-2">
                  <time className="text-gray-600">{date}</time>
                  {tag &&
                    tag.multi_select.map((tag, index) => {
                      return <Tag key={index} name={tag.name} />
                    })}
                </div>
              </li>
            )
          })}
        </ul>
        <Footer />
      </Main>
    </div>
  )
}

export default Home
