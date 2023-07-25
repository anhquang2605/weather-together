import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Suspense, useEffect, useState} from 'react'
import Loading from './loading'
import NotificationCenter from './notifications/notification-center/NotificationCenter'
import { useSession } from 'next-auth/react'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {data:session} = useSession();
  const user = session?.user;
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
  // 
  return (
    <>
    <Head>
    
    </Head>

      <div className="flex flex-row relative bg-gradient-to-bl from-violet-800 from-10% via-indigo-800 to-indigo-950 to-9% h-screen text-white relative">
            { (!asPath.includes("login") && !asPath.includes("register")) &&<Navigation/>}
            <div className="remaining-estate flex w-full h-full z-10 relative">
              {children}
            </div>
            { (!asPath.includes("login") && !asPath.includes("register")) && user &&<NotificationCenter/>}
          {loading && <Loading/>}
      </div>
    </>
  )
}
