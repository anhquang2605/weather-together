import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {  use, useEffect, useState} from 'react'
import Loading from './loading'
import NotificationCenter from './notifications/notification-center/NotificationCenter'
import { useSession } from 'next-auth/react'
import style from './layout.module.css'
import { redirect } from 'react-router-dom'
import { useWeatherContext } from '../pages/weatherContext'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {data:session, status} = useSession();
  const {getWeatherData} = useWeatherContext();
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
    router.events.on('routeChangeComplete', routeChangeCompleteHandler);
    return () => {
      router.events.off('routeChangeStart', routeChangeHandler)
      router.events.off('routeChangeComplete',  routeChangeCompleteHandler)
    }
  },[])
  useEffect(()=>{
    if(status === 'unauthenticated'){
      router.push('/authentication/login');
    }
  },[status]);
  useEffect(()=>{
    if(user){
      getWeatherData(user.location?.city ?? "");
    }
  },[user])
  return (
    <>


      <div className={style["layout"]}>
            
            { (!asPath.includes("login") && !asPath.includes("register")) &&<Navigation/>}
            { (!asPath.includes("login") && !asPath.includes("register")) && user &&<NotificationCenter/>}
            <div className="remaining-estate overflow-y-hidden flex w-full h-full">
              {children}
            </div>
            
          {loading && <Loading/>}
      </div>
    </>
  )
}