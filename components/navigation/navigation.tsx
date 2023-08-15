import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
import {FaNewspaper} from "react-icons/fa"
import {IoCloudyNight, IoMenu, IoArrowBack} from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {useSession} from "next-auth/react"
import { UserInSession } from "../../types/User"
import UserCard from "./user-card/UserCard"
import Username from "../../pages/userprofile/edit/[username]"
export default function Navigation() {
    const {data: session} = useSession();
    const user = session?.user as UserInSession;
    const [navMenuStatus, setNavMenuStatus] = useState("");
    const {asPath,pathname} = useRouter();
    const withUser = [
        {label: "Home", pageTitle: "home", linkhref: ""},
        {label: "Friends", pageTitle: "friends", linkhref: "friends"},

        {label: "Notifications", pageTitle: "notifications", linkhref: "notifications"}
    ]
    const withoutUser = [
        {label: "Log in", pageTitle:"log in", linkhref: "authentication/login"},
        {label: "Register", pageTitle:"register", linkhref: "authentication/register"}
    ]
    const toggleNavMenu = () => {
        if(navMenuStatus === ""){
            setNavMenuStatus("nav-menu-nonactive");
        }else{
            setNavMenuStatus("");
        }
    }
    const fetchUserInformation = async(username: string) => {

    }
    useEffect(()=>{

    },[])
    return(
        <div className={"transition-all shrink-0 p-8 shrink flex flex-col nav-bar relative " + navMenuStatus}>
            <div className="flex flex-row items-center border-b border-slate-500 pb-4">
                <IoCloudyNight className="w-6 h-6 mr-2 non-active"></IoCloudyNight>
                <h3 className="font-semibold mr-4 non-active">Weather Together</h3>
                <button onClick={()=>{toggleNavMenu()}}>
                    {navMenuStatus === "" ? <IoArrowBack className="w-8 h-8 ml-4"></IoArrowBack> : <IoMenu className="w-8 h-8 ml-4"/> }
                </button>
            </div>
            {navMenuStatus === "" && user && <UserCard user={user} />
}
            <ul className="flex flex-col grow">
                
                    {<UserMenu user={user} withUser={withUser} withoutUser={withoutUser} />}
            </ul>
            <div>


            </div>
        </div>
        
    )
}