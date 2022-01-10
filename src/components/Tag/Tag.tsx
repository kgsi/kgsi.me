type Props = {
  name: string
}

export const Tag: React.VFC<Props> = ({ name }) => {
  return <span className="ml-2 px-4 py-1 text-xs border border-grey-200">{name}</span>
}
