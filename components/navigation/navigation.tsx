import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
import {FaNewspaper} from "react-icons/fa"
import {IoCloudyNight, IoMenu, IoArrowBack} from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {useSession} from "next-auth/react"
export default function Navigation() {
    const {data: session} = useSession();
    const user = session?.user ;
    const [navMenuStatus, setNavMenuStatus] = useState("");
    const {asPath,pathname} = useRouter();
    const withUser = [
        {label: "Friends", linkhref: "friends"},
        {label: "My page", linkhref: `userprofile/${user?.username}`}
    ]
    const withoutUser = [
        {label: "Log in", linkhref: "authentication/login"},
        {label: "Register", linkhref: "authentication/register"}
    ]
    const toggleNavMenu = () => {
        if(navMenuStatus === ""){
            setNavMenuStatus("nav-menu-nonactive");
        }else{
            setNavMenuStatus("");
        }
    }
    return(
        <div className={"transition-all shrink-0 p-4 shrink flex flex-col nav-bar relative " + navMenuStatus}>
            <div className="flex flex-row items-center border-b border-slate-500 pb-4">
                <IoCloudyNight className="w-6 h-6 mr-2 non-active"></IoCloudyNight>
                <h3 className="font-semibold mr-4 non-active">Weather Together</h3>
                <button onClick={()=>{toggleNavMenu()}}>
                    {navMenuStatus === "" ? <IoArrowBack className="w-8 h-8 ml-4"></IoArrowBack> : <IoMenu className="w-8 h-8 ml-4"/> }
                </button>
            </div>

            <ul className="flex flex-col grow">
                <li><Link className={"nav-item "+ (asPath === "/" && 'active') } href={`/`}> 
                        <div className="tooltip">
                            <div className="relative">
                                 Home
                            </div>
                        </div>
                        <FaNewspaper/>
                        <span>Home</span> 
                    </Link>
                </li>
                    {<UserMenu user={user} withUser={withUser} withoutUser={withoutUser} />}
            </ul>
            <div>


            </div>
        </div>
        
    )
}