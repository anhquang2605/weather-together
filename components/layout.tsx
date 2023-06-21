import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useSelector((state: any) => state.user)
  const router = useRouter();
  useEffect(() => {
      if(!user.data){
          router.push("/authentication/login");
      }
  },[])
  return (
    <>
    <Head>
    
    </Head>
      <Navigation/>
      {children}
    </>
  )
}
