import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
export default function Navigation() {
    return(
        <div className="bg-indigo-800 grow-0 drop-shadow-lg rounded p-4 shrink">
            <div>
                <span>Icon</span>
            </div>
            <ul>
                <li><Link href={`/`}>Home </Link></li>
                <li>
                    <UserMenu />
                </li>
            </ul>
            <div>


            </div>
        </div>
    )
}