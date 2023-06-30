import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
import {FaNewspaper} from "react-icons/fa"
import {IoCloudyNight, IoMenu, IoArrowBack} from "react-icons/io5"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
export default function Navigation() {
    const [navMenuStatus, setNavMenuStatus] = useState("");
    const {asPath,pathname} = useRouter();
    const toggleNavMenu = () => {
        if(navMenuStatus === ""){
            setNavMenuStatus("nav-menu-nonactive");
        }else{
            setNavMenuStatus("");
        }
    }
    return(
        <div className={"transition-all mr-4 bg-violet-950 grow-0 drop-shadow-lg rounded p-4 shrink " + navMenuStatus}>
            <div className="flex flex-row items-center border-b border-slate-500 pb-4">
                <IoCloudyNight className="w-6 h-6 mr-2 non-active"></IoCloudyNight>
                <h3 className="font-semibold mr-4 non-active">Weather Together</h3>
                <button onClick={()=>{toggleNavMenu()}}>
                    {navMenuStatus === "" ? <IoArrowBack className="w-8 h-8 ml-4"></IoArrowBack> : <IoMenu className="w-8 h-8 ml-4"/> }
                </button>
            </div>

            <ul>
                <li><Link className={"nav-item "+ (asPath === "/" && 'active') } href={`/`}> <FaNewspaper/> <span>Home</span> </Link></li>
                <li>
                    <UserMenu />
                </li>
            </ul>
            <div>


            </div>
        </div>
    )
}