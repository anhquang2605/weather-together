import Link from "next/link"
import {IoEnter, IoExit, IoPersonAdd, IoPeople, IoNotifications, IoSettings} from "react-icons/io5"
import {useEffect} from "react"
import { useRouter } from "next/router";
import { UserInSession } from "../../../types/User";

import MiniAvatar from "../../user/mini-avatar/MiniAvatar";
import { FaNewspaper } from "react-icons/fa";
interface NavItem {
    label: string,
    linkhref: string,
    pageTitle: string
}
interface UserMenuProps{
    withUser: NavItem[],
    user: UserInSession | null | undefined,
    handleSignOut: () => void;
}
interface LabelToIconMap {[label:string] : JSX.Element};
export default function UserMenu({withUser, user, handleSignOut}: UserMenuProps) {
    const {asPath} = useRouter();
    const labelToIcon:LabelToIconMap = {
        "Buddies": <IoPeople></IoPeople>,
        "Home": <FaNewspaper/>,
        "Settings": <IoSettings/>,
        "My Hub": <MiniAvatar size="compacted-nav" username={user?.username} profilePicturePath={user?.profilePicturePath ?? ""} />,
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
        <div className="flex flex-row md:flex-col md:grow">
            {user && user.username &&
                <>
                    {getJSX(withUser)}

                    <button className={"mt-auto flex flex-row items-center footer-btn"} onClick={()=>{handleSignOut()}} ><IoExit className="w-8 h-8"></IoExit><span className="ml-2">Log out</span></button>
                </>
              
            }

        </div>
    )
}