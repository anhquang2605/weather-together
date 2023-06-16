import Link from "next/link"
import { useSelector } from "react-redux"
export default function UserMenu() {
    const user = useSelector((state: any) => state.user);
    return (
        <>
            <span>Small avatar</span>
            {user.data ?
                <>
                    <span>Good morning {user.data.username}</span>
                    <Link href="/authentication/logout">Log out</Link>
                    <Link href={"/userprofile/" + (user.data ? user.data.username : "")}>User profile</Link>
                </>
                :
                <>
                    <Link href="/authentication/login">Log in</Link>
                    <Link href="/authentication/register">Register</Link>
                </>
            }

        </>
    )
}