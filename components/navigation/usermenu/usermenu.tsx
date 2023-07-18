import Link from "next/link"
import { useSelector } from "react-redux"
import {BsPersonVcardFill} from "react-icons/bs"
import {IoEnter, IoExit, IoPersonAdd, IoPeople} from "react-icons/io5"
import { useRouter } from "next/router";
export default function UserMenu() {
    const user = useSelector((state: any) => state.user);
    const {asPath} = useRouter();
    return (
        <div className="flex flex-col grow">
            {user.data ?
                <>
                    <Link className={"nav-item "+ (asPath.includes("login") && 'active') } href="/authentication/login"><IoPeople></IoPeople><span>Friends</span></Link>
                    <Link className={"nav-item "+ (asPath.includes("userprofile") && 'active') } href={"/userprofile/" + (user.data ? user.data.username : "")}><BsPersonVcardFill></BsPersonVcardFill><span>My page</span></Link>
                    <Link className={"mt-auto flex flex-row items-center footer-btn"} href="/authentication/logout"><IoExit className="w-8 h-8"></IoExit><span className="ml-2">Log out</span></Link>
                </>
                :
                <>
                    <Link className={"nav-item "+ (asPath.includes("login") && 'active') } href="/authentication/login"><IoEnter></IoEnter><span>Log in</span></Link>
                    <Link className={"nav-item "+ (asPath.includes("register") && 'active') } href="/authentication/register"><IoPersonAdd></IoPersonAdd><span>Register</span></Link>
                </>
            }

        </div>
    )
}