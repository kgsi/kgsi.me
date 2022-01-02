import type { NextPage, InferGetStaticPropsType, GetStaticPropsContext, GetStaticPaths } from 'next'
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import { Fragment } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import { getDatabase, getPage, getBlocks } from '../../utils/notion'
import { Text } from '../../components/Text'
import { Footer } from '../../components/Footer'
import { saveImageIfNeeded } from '../../utils/saveImage'
import Link from 'next/link'

const databaseId = process.env.NOTION_DATABASE_ID || ''

type Unpacked<T> = T extends (infer U)[] ? U : T
type Props = InferGetStaticPropsType<typeof getStaticProps>
type ResultProps = Unpacked<ListBlockChildrenResponse['results']>
type BlockType = Unpacked<ResultProps['type']>

const renderBlock = (block: ResultProps) => {
  const { type, id } = block

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text text={block.paragraph.text} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <Text text={block.heading_1.text} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <Text text={block.heading_2.text} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <Text text={block.heading_3.text} />
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li>
          <Text text={block.bulleted_list_item.text} />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <Text text={block.numbered_list_item.text} />
        </li>
      )
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={block.to_do.checked} /> <Text text={block.to_do.text} />
          </label>
        </div>
      )
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={block.toggle.text} />
          </summary>
          {block.toggle.text?.map((block: any) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      )
    case 'child_page':
      return <p>{block.child_page.title}</p>
    case 'image':
      const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url
      const caption = block.image.caption && block.image.caption[0] ? block.image.caption[0].plain_text : ''

      return src ? (
        <figure style={{ width: '100px', height: '100px', position: 'relative' }}>
          <Image src={src} alt={caption} layout="fill" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      ) : (
        <p>Not src...</p>
      )
    case 'divider':
      return <hr key={id} />
    case 'quote':
      return <blockquote key={id}>{block.quote.text[0].plain_text}</blockquote>
    default:
      return <p>`❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`</p>
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const database = await getDatabase(databaseId)
  return {
    paths: database.results.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  }
}

export const getStaticProps = async (context: GetStaticPropsContext<{ id: string }>) => {
  const params = context.params!
  const id = params.id
  const page = await getPage(id)
  const blocks = await getBlocks(id)

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks.results
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        }
      }),
  )

  const blocksWithChildren = blocks.results.map((block) => {
    // Add child blocks if the block should contain children but none exists

    // if (block.has_children && !block[block.type].children) {
    //   block[block.type]['children'] = childBlocks.find((x) => x.id === block.id)?.children
    // }

    return block
  })

  const convertBlocks: ListBlockChildrenResponse = {
    ...blocks,
    // @ts-ignore: Unreachable code error
    results: (() => {
      return blocks.results.map((block) => {
        if (block.type === 'image') {
          saveImageIfNeeded(block)
          return {
            ...block,
            image: {
              ...block.image,
              external: {
                url: `/blogImages/${block.id}.png`,
              },
              file: {
                url: `/blogImages/${block.id}.png`,
              },
            },
          }
        } else {
          return block
        }
      })
    })(),
  }
  console.log(convertBlocks)

  return {
    props: {
      page,
      blocks: convertBlocks,
    },
    revalidate: 1,
  }
}

const Post: NextPage<Props> = ({ page, blocks }) => {
  if (!page || !blocks) {
    return <div />
  }
  console.log()
  return (
    <div>
      <Head>
        {/* <title>{page.properties.Name.title[0].plain_text}</title> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-[40rem] mx-auto">
        <header className="my-10">
          <div>
            <Link href="/">
              <a>kgsi.me</a>
            </Link>
          </div>
        </header>
        <article>
          <h1 className="font-bold text-xl">{page.properties.page.title[0].plain_text}</h1>
          <section className="mt-10">
            {blocks.results.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))}
            <div className="mt-6">
              <Link href="/">
                <a>← 記事一覧へ戻る</a>
              </Link>
            </div>
          </section>
        </article>
        <Footer />
      </main>
    </div>
  )
}

export default Post
