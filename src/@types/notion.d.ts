declare module Notion {
  export type Tag = {
    id: string
    multi_select: Array<{
      color: string
      id: string
      name: string
    }>
    type: string
  }
}
