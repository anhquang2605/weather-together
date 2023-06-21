import Link from "next/link"
import UserMenu from "./usermenu/usermenu"
export default function Navigation() {
    return(
        <div className="bg-purple-500 p-4 shrink">
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