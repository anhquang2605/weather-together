
import Link from 'next/link'
import style from './unauthorized.module.css'
export default function Unauthorized() {
    return (
        <div className={style['unauthorized']}>
            <h1 className="text-xl">Unauthorized</h1>
            <p>You are not authorized to view this page.</p>
            <p>Please log in or sign up.</p>
            <div className={style['btn-group']}>
                <Link href="/authentication/login">
                    Login
                </Link>
                <Link href="/authentication/signup">
                    Sign up
                </Link>
            </div>
        </div>
    )
}