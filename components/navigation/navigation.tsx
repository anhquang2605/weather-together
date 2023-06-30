import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
import {FaNewspaper} from "react-icons/fa"
import {IoCloudyNight} from "react-icons/io5"
export default function Navigation() {
    return(
        <div className="transition bg-violet-950 grow-0 drop-shadow-lg rounded p-4 shrink">
            <div className="flex flex-row items-center border-b border-slate-500 pb-4">
                <IoCloudyNight className="w-6 h-6 mr-4"></IoCloudyNight>
                <h3 className="font-semibold">Weather Together</h3>
            </div>

            <ul>
                <li><Link className="nav-item" href={`/`}> <FaNewspaper/> <span>Home</span> </Link></li>
                <li>
                    <UserMenu />
                </li>
            </ul>
            <div>


            </div>
        </div>
    )
}