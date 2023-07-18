import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useState} from 'react'
import Loading from './loading'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useSelector((state: any) => state.user)
  const router = useRouter();
  const asPath = router.asPath;
  const [loading, setLoading] = useState<boolean>(false);
  const routeChangeHandler = () => {
    setLoading(true);
  }
  const routeChangeCompleteHandler = () => {
    setLoading(false);
  }
  useEffect(() => {
    router.events.on('routeChangeStart', routeChangeHandler)
    router.events.on('routeChangeComplete', routeChangeCompleteHandler)
    return () => {
      router.events.off('routeChangeStart', routeChangeHandler)
      router.events.off('routeChangeComplete',  routeChangeCompleteHandler)
    }
  },[])
  return (
    <>
    <Head>
    
    </Head>
      {user &&
      <div className="flex flex-row relative bg-gradient-to-bl from-violet-800 from-5% via-indigo-800 to-indigo-950 to-70% h-screen text-white">
          { (!asPath.includes("login") && !asPath.includes("register")) &&<Navigation/>}
          {children}  
          {loading && <Loading/>}
      </div>}
    </>
  )
}
