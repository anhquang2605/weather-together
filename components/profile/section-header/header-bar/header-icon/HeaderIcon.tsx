import React from 'react';
import style from './header-icon.module.css';
import { BsPerson, BsCardText } from "react-icons/bs";
import { MdOutlineLocalActivity } from 'react-icons/md';
import { BiVerticalBottom } from "react-icons/bi";
import { FaImages } from "react-icons/fa6";
interface HeaderIconProps {
    title: string;
    isCurrent: boolean;
}
interface HeaderIconTitleMap {
    [key: string]: JSX.Element
}
const TITLE_MAP: HeaderIconTitleMap = {
    'about_me': <BsPerson/>,
    'bio': <BsCardText/>,
    'activities': <MdOutlineLocalActivity/>,
    'gallery': <FaImages />,
    'end': <BiVerticalBottom />
}
const HeaderIcon: React.FC<HeaderIconProps> = ({title, isCurrent}) => {
    return (
        <div className={style['header-icon'] + (isCurrent ? ' ' + style['current'] : '')}>
            {TITLE_MAP[title]}
        </div>
    );
};

export default HeaderIcon;