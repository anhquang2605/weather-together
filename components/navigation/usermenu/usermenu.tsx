import Link from "next/link"
import { useSelector } from "react-redux"
import {BsPersonVcardFill} from "react-icons/bs"
import {IoEnter, IoExit, IoPersonAdd} from "react-icons/io5"
export default function UserMenu() {
    const user = useSelector((state: any) => state.user);
    return (
        <div className="flex flex-col">
            {user.data ?
                <>
                    <Link className="nav-item" href="/authentication/logout"><IoExit></IoExit><span>Log out</span></Link>
                    <Link className="nav-item" href={"/userprofile/" + (user.data ? user.data.username : "")}><BsPersonVcardFill></BsPersonVcardFill><span>User profile</span></Link>
                </>
                :
                <>
                    <Link className="nav-item" href="/authentication/login"><IoEnter></IoEnter><span>Log in</span></Link>
                    <Link className="nav-item" href="/authentication/register"><IoPersonAdd></IoPersonAdd><span>Register</span></Link>
                </>
            }

        </div>
    )
}