import Link from "next/link"
import {IoEnter, IoExit, IoPersonAdd, IoPeople, IoNotifications} from "react-icons/io5"
import {useEffect} from "react"
import { useRouter } from "next/router";
import { UserInSession } from "../../../types/User";
import {signOut} from "next-auth/react";
import MiniAvatar from "../../activity/mini-avatar/MiniAvatar";
import { FaNewspaper } from "react-icons/fa";
interface NavItem {
    label: string,
    linkhref: string,
    pageTitle: string
}
interface UserMenuProps{
    withUser: NavItem[],
    withoutUser: NavItem[],
    user: UserInSession | null | undefined
}
interface LabelToIconMap {[label:string] : JSX.Element};
export default function UserMenu({withUser, withoutUser, user}: UserMenuProps) {
    const {asPath} = useRouter();
    const labelToIcon:LabelToIconMap = {
        "Friends": <IoPeople></IoPeople>,
        "Log in": <IoEnter></IoEnter>,
        "Register": <IoPersonAdd></IoPersonAdd>,
        "Notifications": <IoNotifications></IoNotifications> ,
        "Home": <FaNewspaper/>
    }
    const getJSX = (navItems: NavItem[]) => {
        return navItems.map(({label,linkhref, pageTitle}) => {
            return (
                <Link className={"nav-item "+ ((asPath === ("/" + linkhref)) && 'active') } href={ "/" + linkhref} key={label}>
                    <div className="tooltip">
                        <div className="relative">
                            {label}
                        </div>
                    </div>
                    {labelToIcon[label]}
                    <span>{label}</span>
                </Link>
            )
        })
    }

    return (
        <div className="flex flex-col grow">
            {user && user.username ?
                <>
                    {getJSX(withUser)}

                    <button className={"mt-auto flex flex-row items-center footer-btn"} onClick={()=>{signOut()}} ><IoExit className="w-8 h-8"></IoExit><span className="ml-2">Log out</span></button>
                </>
                :
                <>
                   {getJSX(withoutUser)}
                </>
            }

        </div>
    )
}