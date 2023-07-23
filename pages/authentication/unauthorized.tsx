
import Link from 'next/link'
import style from './unauthorized.module.css'
import {TbHandStop} from 'react-icons/tb'
export default function Unauthorized() {
    return (
        <div className={style['unauthorized'] + " glass w-full flex flex-col items-center justify-center"}>
             <TbHandStop className="w-20 h-20 stroke-1 mb-8 text-red-400"/>
            <h1 className="text-4xl mb-2 font-semibold">Unauthorized</h1>
            <p>You are not authorized to view this page.</p>
            <p>Please log in or register.</p>
            <div className={style['btn-group'] + " mt-8"}>
                <Link className="action-btn" href="/authentication/login">
                    Login
                </Link>
                <Link className={"secondary-action-btn"} href="/authentication/register">
                    Register
                </Link>
            </div>
        </div>
    )
}