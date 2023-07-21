import {useSession} from 'next-auth/react'
import Unauthorized from '../unauthorized'

export default function withAuth(Component: React.ComponentType) {
    return function AuthComponent(props: any){
        const {data: session, status} = useSession()
        if(!session){
            return (
                <Unauthorized/>
            )
        }
        return <Component {...props}/>
    }
}