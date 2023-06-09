import Link from "next/link"
export default function Navigation() {
    return(
        <div>
            <div>
                <span>Icon</span>
            </div>
            <ul>
                <li><Link href={`/`}>Home</Link></li>
                <li><Link href={`/userprofile/64828aaf8aaf4d950fc61fae`}>Profile</Link></li>
            </ul>
            <div>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
                <Link href="/logout">Log out</Link>
            </div>
        </div>
    )
}