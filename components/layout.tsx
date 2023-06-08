import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation/>
      {children}
    </>
  )
}
