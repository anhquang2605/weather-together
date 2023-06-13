import Link from "next/link"
export default function UserMenu() {
    return (
        <>
            <span>Small avatar</span>
            <span>User Name</span>
            <Link href="/authentication/login">log in</Link>
            <Link href="/authentication/register">register</Link>
            <Link href="/authentication/logout">log out</Link>
            <Link href="/userprofile">user profile</Link>
        </>
    )
}