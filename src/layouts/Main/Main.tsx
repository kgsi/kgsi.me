type Props = {
  children: React.ReactNode
}

export const Main: React.VFC<Props> = ({ children }) => {
  return <main className="max-w-[60ch] mx-auto p-4">{children}</main>
}
