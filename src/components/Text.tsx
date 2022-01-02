// import styles from './post.module.css'

type Props = {
  text: any
}

export const Text: React.VFC<Props> = ({ text }) => {
  if (!text) {
    return null
  }
  return text.map((value: any, index: number) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value
    return (
      <span
        key={index}
        className={[
          bold ? 'font-bold	' : '',
          code ? 'code' : '',
          italic ? 'italic' : '',
          strikethrough ? 'line-through' : '',
          underline ? 'underline' : '',
        ].join(' ')}
        style={color !== 'default' ? { color } : {}}
      >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
    )
  })
}
