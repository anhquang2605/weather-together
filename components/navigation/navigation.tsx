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
    const [navMenuStatus, setNavMenuStatus] = useState("nav-menu-nonactive");
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
        <div className={"nav-bar order-last md:order-first relative " + navMenuStatus}>
            <div className="flex flex-row items-center pb-4 nav-header">
                <IoCloudyNight className="w-8 h-8 mr-1 non-active"></IoCloudyNight>
                <h3 className="font-semibold mr-4 non-active">Weather Together</h3>
                <button className="hidden md:block" onClick={()=>{toggleNavMenu()}}>
                    {navMenuStatus === "" ? <IoArrowBack className="w-8 h-8 ml-4"></IoArrowBack> : <IoMenu className="w-8 h-8 ml-4"/> }
                </button>
            </div>
            {user && <UserCard user={user} variant={navMenuStatus !== "" ? "compact" : "expanded"}/>
}
            <ul className="flex flex-col grow">
                
                    {<UserMenu user={user} withUser={withUser} withoutUser={withoutUser} />}
            </ul>
            <div>


            </div>
        </div>
        
    )
}