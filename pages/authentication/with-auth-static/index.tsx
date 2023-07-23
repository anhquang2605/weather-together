import {useSession} from 'next-auth/react'
import Unauthorized from '../unauthorized'
import {FC} from 'react'
export default function withAuthStatic(PageComponent: FC<any>) {
    return function AuthComponent(props:any){
        const {data: session, status} = useSession()
        if(!session){
            return (
                <Unauthorized/>
            )
        } else {
            return <PageComponent {...props}/>
        }
    }
        
}