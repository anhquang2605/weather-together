import Link from "next/link"
import { useSelector } from "react-redux"
import {BsPersonVcardFill} from "react-icons/bs"
import {IoEnter, IoExit, IoPersonAdd, IoPeople, IoNotifications} from "react-icons/io5"
import { useRouter } from "next/router";
import { UserInSession } from "../../../types/User";
import {signOut} from "next-auth/react";
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
        "My page": <BsPersonVcardFill></BsPersonVcardFill>,
        "Log in": <IoEnter></IoEnter>,
        "Register": <IoPersonAdd></IoPersonAdd>,
        "Notifications": <IoNotifications></IoNotifications> 
    }
    const getJSX = (navItems: NavItem[]) => {
        return navItems.map(({label,linkhref, pageTitle}) => {
            return (
                <Link className={"nav-item "+ (asPath.includes(pageTitle?.toLowerCase()) && 'active') } href={"/" + linkhref} key={label}>
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