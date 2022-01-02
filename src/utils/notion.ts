// import { Client } from '@notionhq/client'
// import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
// import { saveImageIfNeeded } from './saveImage'

// export type PostIndex = {
//   id: string
//   ymd: string
//   year: string
//   month: string
//   date: string
// }

// export type Content =
//   | {
//       type: 'paragraph'
//       text: string | null
//       link: string | null
//     }
//   | {
//       type: 'quote'
//       text: string | null
//       link: string | null
//     }
//   | {
//       type: 'heading_1'
//       text: string | null
//       link: string | null
//     }
//   | {
//       type: 'heading_2'
//       text: string | null
//       link: string | null
//     }
//   | {
//       type: 'heading_3'
//       text: string | null
//       link: string | null
//     }
//   | {
//       type: 'bulleted_list_item' | 'numbered_list_item'
//       text: string | null
//       link: string | null
//     }
//   | {
//       type: 'code'
//       text: string | null
//       link: string | null
//       language: string | null
//     }
//   | {
//       type: 'image'
//       url: string | null
//       caption: string | null
//     }

// export type Post = {
//   id: string
//   // title: string
//   date: string
//   ymd: string
//   createdTs: string
//   lastEditedTs: string
//   contents: Content[]
// }

// const notion = new Client({
//   auth: process.env.NOTION_SECRET,
// })

// export const getDatabaseData = async () =>
//   // startCursor?: string, pageSize?: number
//   {
//     return notion.databases.query({
//       database_id: process.env.NOTION_DATABASE_ID || '',
//       filter: {
//         or: [
//           {
//             property: 'published',
//             checkbox: {
//               equals: true,
//             },
//           },
//         ],
//       },
//       sorts: [
//         {
//           property: 'date',
//           direction: 'descending',
//         },
//       ],
//       // start_cursor: startCursor,
//       // page_size: pageSize
//     })
//   }

// export const getPosts = async (databaseResponse: QueryDatabaseResponse, ids?: string[]) => {
//   const postContentPromises = []
//   if (ids) {
//     ids.forEach((id) => {
//       postContentPromises.push(notion.blocks.children.list({ block_id: id }))
//     })
//   } else {
//     for (const result of databaseResponse.results) {
//       postContentPromises.push(notion.blocks.children.list({ block_id: result.id }))
//     }
//   }
//   const postContents = await Promise.all(postContentPromises)
//   const posts: Post[] = postContents.map((postContent, i) => {
//     // console.log(postContent)
//     const page = ids ? databaseResponse.results.find((result) => result.id === ids[i]) : databaseResponse.results[i]
//     // @ts-ignore
//     const date: string = page.properties.date.date.start
//     const post: Post = {
//       id: page?.id || '',
//       date,
//       ymd: date.replace(/-/g, ''),
//       createdTs: page?.created_time || '',
//       lastEditedTs: page?.last_edited_time || '',
//       contents: [],
//     }
//     postContent.results.forEach((result) => {
//       console.log(result)
//       switch (result.type) {
//         case 'bulleted_list_item':
//           post.contents.push({
//             type: result.type,
//             text: result['bulleted_list_item'].text[0]?.plain_text || null,
//             link: result['bulleted_list_item'].text[0]?.href || null,
//           })
//           break
//         case 'heading_2':
//           post.contents.push({
//             type: result.type,
//             text: result['heading_2'].text[0]?.plain_text || null,
//             link: result['heading_2'].text[0]?.href || null,
//           })
//           break
//         case 'paragraph':
//           post.contents.push({
//             type: result.type,
//             text: result['paragraph'].text[0]?.plain_text || null,
//             link: result['paragraph'].text[0]?.href || null,
//           })
//           break
//         case 'image':
//           saveImageIfNeeded(result)
//           post.contents.push({
//             type: result.type,
//             url: `/blogImages/${result.id}.png` || null,
//             caption: result['image'].caption[0].plain_text || null,
//           })
//           break
//         case 'quote':
//           post.contents.push({
//             type: result.type,
//             text: result['quote'].text[0]?.plain_text || null,
//             link: result['quote'].text[0]?.href || null,
//           })
//           break
//         case 'code':
//           post.contents.push({
//             type: result.type,
//             text: result['code'].text[0]?.plain_text || null,
//             link: result['code'].text[0]?.href || null,
//             language: result['code'].language || null,
//           })
//           break
//       }
//     })
//     return post
//   })
//   return posts
// }

import { Client } from '@notionhq/client'
import { ListBlockChildrenResponse, QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_SECRET,
})

export const getDatabase = async (databaseId: string): Promise<QueryDatabaseResponse> => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: 'published',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  })
  return response
}

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

export const getBlocks = async (blockId: string): Promise<ListBlockChildrenResponse> => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  })
  return response
}
