import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reference",
}

export default function ReferenceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
