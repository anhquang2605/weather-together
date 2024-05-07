import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
import {FaNewspaper} from "react-icons/fa"
import {IoCloudyNight, IoMenu, IoArrowBack} from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {useSession} from "next-auth/react"
import { UserInSession } from "../../types/User"
import {signOut} from "next-auth/react";
import UserCard from "./user-card/UserCard"
import Username from "../../pages/userprofile/edit/[username]"
import BottomNavigation from "./bottom-navigation/BottomNavigation"
import { closeWSConnection } from "../../utils/websocket-service"
import WeatherBar from "../weather-widgets/weather-bar/WeatherBar"
import { WeatherBarContextProvider } from "../weather-widgets/weather-bar/useWeatherBarContext"
export default function Navigation() {
    const {data: session} = useSession();
    const user = session?.user as UserInSession;
    const [navMenuStatus, setNavMenuStatus] = useState("");
    const {asPath,pathname} = useRouter();
    const withUser = [
        {label: "My Hub", pageTitle: "weather hub", linkhref: `userprofile/${user?.username}`},
        {label: "Home", pageTitle: "home", linkhref: ""},
        {label: "Buddies", pageTitle: "buddies", linkhref: "buddies"},
        {label: "Settings", pageTitle: "settings", linkhref: "settings"}
    ]
    const toggleNavMenu = () => {
        if(navMenuStatus === ""){
            setNavMenuStatus("nav-menu-nonactive");
        }else{
            setNavMenuStatus("");
        }
    }
    const handleSignOut = async() => {
        if(user && user.username){
            await closeWSConnection(user.username);
            await signOut();
        }
    }
    useEffect(()=>{

    },[])
    return(
        user &&
        <>
            <div className={"nav-bar side-nav order-first relative " + navMenuStatus}>
                <div className="flex flex-row items-center pb-4 nav-header">
                    <button className="hidden md:block ml-auto" onClick={()=>{toggleNavMenu()}}>
                        {navMenuStatus === "" ? <IoArrowBack className="w-8 h-8 ml-4"></IoArrowBack> : <IoMenu className="w-8 h-8 ml-4"/> }
                    </button>
                </div>
                <div>
                    <WeatherBarContextProvider>
                        <WeatherBar isExpanded={
                            navMenuStatus == ""
                        }/>
                    </WeatherBarContextProvider>
                </div>
                {user && <UserCard user={user} variant={navMenuStatus !== "" ? "compact" : "expanded"}/>
    }
                <ul className="flex flex-col grow">
                    
                        {<UserMenu handleSignOut={handleSignOut} user={user} withUser={withUser} />}
                        
                </ul>

            </div>
            <div className={"nav-bar bottom-nav relative"}>
                <BottomNavigation user={user} className={'bottom-nav'} navigationItems={user ? withUser : []}></BottomNavigation>
            </div>
            
        </>
        
    )
}