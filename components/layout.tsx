import { Inter } from 'next/font/google'
import Navigation from './navigation/navigation'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useEffect} from 'react'
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
      {user &&
      <div className="flex flex-row flex-wrap p-4 bg-gradient-to-bl from-purple-950 from-5% to-indigo-950 to-95% h-screen text-white">
        <Navigation/>
        {children}
      </div>}
    </>
  )
}
