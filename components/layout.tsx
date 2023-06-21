import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useSelector((state: any) => state.user)
  const router = useRouter();
  useLayoutEffect(() => {
      if(!user.data){
          router.push("/authentication/login");
      }
  },[])
  return (
    <>
    <Head>
    
    </Head>
      {user &&
      <div className="flex flex-row flex-wrap p-4">
        <Navigation/>
        {children}
      </div>}
    </>
  )
}
