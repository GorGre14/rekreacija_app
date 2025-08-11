import './globals.css'

export const metadata = {
  title: 'Recreation Finder',
  description: 'Find and create recreational activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}