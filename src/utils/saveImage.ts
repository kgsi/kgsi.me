import fs from 'fs'
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import { IMAGE_PATH } from '../constant/path'

type ResultResponse = ListBlockChildrenResponse['results'][0]

export const saveImageIfNeeded = async (result: ResultResponse) => {
  if (!fs.existsSync(IMAGE_PATH)) {
    fs.mkdirSync(IMAGE_PATH)
  }

  if (result.type === 'image' && result.image.type == 'file') {
    const blob = await getTemporaryImage(result.image.file.url)

    if (!blob) {
      return ''
    }

    const extension = blob.type.replace('image/', '')

    if (!isImageExist(result.id)) {
      const binary = (await blob.arrayBuffer()) as Uint8Array
      const buffer = Buffer.from(binary)
      saveImage(buffer, result.id)
    }
  }
}

/// 一時ファイルの画像をバイナリとして取得する。ここで画像のフォーマットがわかる
const getTemporaryImage = async (url: string) => {
  try {
    const blob = await fetch(url).then((r) => r.blob())
    return blob
  } catch (error) {
    console.log(error)
    return null
  }
}

const isImageExist = (keyName: string) => {
  return fs.existsSync(`${IMAGE_PATH}/${keyName}.png`)
}

const saveImage = (imageBinary: Uint8Array, keyName: string) => {
  fs.writeFile(`${IMAGE_PATH}/${keyName}.png`, imageBinary, (error) => {
    if (error) {
      console.log(error)
      throw error
    }
  })
}
