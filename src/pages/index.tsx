import type { NextPage, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getDatabase } from '../utils/notion'
import { Text } from '../components/Text'
import { Footer } from '../components/Footer'

export const databaseId = process.env.NOTION_DATABASE_ID || ''

type Props = InferGetStaticPropsType<typeof getStaticProps>
type Tag = {
  id: string
  multi_select: Array<{
    color: string
    id: string
    name: string
  }>
  type: string
}

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
        <title>kgsi blog</title>
        <meta name="description" content="プロダクトデザイナーkgsiのブログです。" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-[40rem] mx-auto">
        <header className="my-10">
          <h1 className="text-3xl font-bold underline">kgsi blog</h1>
          <p>
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
            const tag = post.properties.tags as any as Tag

            return (
              <li key={post.id} className="mt-10">
                <h2 className="font-bold text-xl">
                  {post.properties.page.type === 'title' && (
                    <Link href={`/articles/${post.id}`} passHref>
                      <a className="no-underline hover:underline">
                        <Text text={post.properties.page.title} />
                      </a>
                    </Link>
                  )}
                </h2>
                <div className="mt-2">
                  <time>{date}</time>
                  {tag &&
                    tag.multi_select.map((tag, index) => {
                      return (
                        <span
                          className="ml-2 px-4 py-1 text-xs border border-grey-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                          key={index}
                        >
                          {tag.name}
                        </span>
                      )
                    })}
                </div>
              </li>
            )
          })}
        </ul>
        <Footer />
      </main>
    </div>
  )
}

export default Home
