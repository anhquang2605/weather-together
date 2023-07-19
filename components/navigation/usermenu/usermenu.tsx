import Link from "next/link"
import { useSelector } from "react-redux"
import {BsPersonVcardFill} from "react-icons/bs"
import {IoEnter, IoExit, IoPersonAdd, IoPeople} from "react-icons/io5"
import { useRouter } from "next/router";
import { User } from "../../../types/User";
interface NavItem {
    label: string,
    linkhref: string
}
interface UserMenuProps{
    withUser: NavItem[],
    withoutUser: NavItem[],
    user: User
}
interface LabelToIconMap {[label:string] : JSX.Element};
export default function UserMenu({withUser, withoutUser, user}: UserMenuProps) {
    const {asPath} = useRouter();
    const labelToIcon:LabelToIconMap = {
        "Friends": <IoPeople></IoPeople>,
        "My page": <BsPersonVcardFill></BsPersonVcardFill>,
        "Log in": <IoEnter></IoEnter>,
        "Register": <IoPersonAdd></IoPersonAdd>,
    }
    const getJSX = (navItems: NavItem[]) => {
        return navItems.map(({label,linkhref}) => {
            return (
                <Link className={"nav-item "+ (asPath.includes(label.toLowerCase()) && 'active') } href={"/" + linkhref} key={label}>
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
            {user ?
                <>
                    {getJSX(withUser)}
                    <Link className={"mt-auto flex flex-row items-center footer-btn"} href="/authentication/logout"><IoExit className="w-8 h-8"></IoExit><span className="ml-2">Log out</span></Link>
                </>
                :
                <>
                   {getJSX(withoutUser)}
                </>
            }

        </div>
    )
}