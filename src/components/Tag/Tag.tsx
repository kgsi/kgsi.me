type Props = {
  name: string
}

export const Tag: React.VFC<Props> = ({ name }) => {
  return (
    <span className="ml-2 px-4 py-1 text-xs border border-grey-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
      {name}
    </span>
  )
}
