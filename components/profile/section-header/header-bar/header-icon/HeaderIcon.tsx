import React from 'react';
import style from './header-icon.module.css';
import { BsPerson, BsCardText } from "react-icons/bs";
import { MdOutlineLocalActivity } from 'react-icons/md';
interface HeaderIconProps {
    title: string;
}
interface HeaderIconTitleMap {
    [key: string]: JSX.Element
}
const TITLE_MAP: HeaderIconTitleMap = {
    'about_me': <BsPerson/>,
    'bio': <BsCardText/>,
    'activity': <MdOutlineLocalActivity/>
}
const HeaderIcon: React.FC<HeaderIconProps> = ({title}) => {
    return (
        <div className={style['header-icon']}>
            {TITLE_MAP[title]}
        </div>
    );
};

export default HeaderIcon;