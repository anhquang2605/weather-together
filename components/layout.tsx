import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <Head>
    
    </Head>
      <Navigation/>
      {children}
    </>
  )
}
