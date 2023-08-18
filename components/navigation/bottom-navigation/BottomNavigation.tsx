import React from 'react';
import style from './bottom-navigation.module.scss';
import {FaNewspaper} from "react-icons/fa"
import { UserInSession } from '../../../types/User';
import {FaHouseUser} from "react-icons/fa";
import { IoPersonCircle  ,IoPeople, IoSettings } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MiniAvatar from '../../activity/mini-avatar/MiniAvatar';
interface NavItem {
    label: string,
    linkhref: string,
    pageTitle: string
}
interface BottomNavigationProps {
    className?: string;
    navigationItems?: NavItem[];
    user: UserInSession | null | undefined;
}
interface LabelToIconMap {[label:string] : JSX.Element};
const BottomNavigation: React.FC<BottomNavigationProps> = ({user,className, navigationItems = []}) => {
    const count = 70;
    const {asPath} = useRouter();
    const labelToIcon:LabelToIconMap = {
        "Friends": <IoPeople></IoPeople>,
        "Home": <FaNewspaper/>,
        "Settings": <IoSettings/>,
        "My Hub":  <MiniAvatar size="small" className={style.bottomNavAvatar} profilePicturePath={user?.profilePicturePath || ""} username={user?.username}/>,
    }
	const JSX = () => {
		let arr = [];
		for(let i = 0; i < count; i += 1){
			arr.push(<div key={i} className={style.pilar}></div>);
		}
		return arr;
	}
    const navItems = (items: NavItem[]) => {
        return items.map(({label,linkhref, pageTitle}) => {
            return (
                <Link key={label} href={"/" + linkhref} className={`${style.navItem} ${(asPath === ("/" + linkhref)) && style.active}`}>
                    <div className={style.filler}>
        
                    </div>
                    <div className={style.nice}>
                        
                        {JSX()}
                        
                        <div className={style.circle + " " + (label === "My Hub" && style.noCircle) }>{labelToIcon[label]}</div>
                        <span className={style.navTitle}>
                            <span className={style.navTitleText}>{label}</span>
                        </span>
                    </div>
                    <div className={style.filler}>
        
                    </div>
                </Link>
            )
        })
    }
	return( 
	<>
		{navItems(navigationItems)}
       
	</>
	)
};

export default BottomNavigation;
/* 
		@for $i from 1 through $elements {
        $fraction_from_center: abs($i - $elements / 2) / ($elements / 2); // Range: [0, 1]
        $power_function: math.pow($fraction_from_center, $roundness); // Cubic function for sharp dip in the center
        
        $angle: 3.14 * ($i - 1) / ($elements - 1);
        $scale: 1 - $depth * math.sin($angle) * (1 - $power_function); // Reducing the depth based on distance from center
        
			#{$childClass}:nth-child(#{$i}) {
            transform: scaleY($scale);
            transform-origin: bottom;
        }
*/