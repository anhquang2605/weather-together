import React, { useEffect } from 'react'
import style from './friends.module.css'
import Tabs from '../../components/plugins/tabs/Tabs'
import {CgUserList, CgUserAdd, CgPlayListSearch} from 'react-icons/cg'
import FindFriends from '../../components/friends-tab-content/find-friends';
import withAuth from '../authentication/with-auth';
interface TabIconsMap {
    [key: string]: JSX.Element;
}
function Friends(){
    const tabLabels = [
        "Friend lists",
        "Find friends",
        "Friend requests"
    ]
    const tabIcons:TabIconsMap = {
        "Friend lists": <CgUserList/>,
        "Find friends":  <CgPlayListSearch/>,
        "Friend requests": <CgUserAdd/>
    }
    const [activeTab, setActiveTab] = React.useState(0);

    const tabs = tabLabels.map((label, index) => {
        return {
            label: label,
            content: 
            <>
                {tabIcons[label]}{label} 
            </>
        }
    })
    useEffect(()=>{
        const movingBox = document.getElementsByClassName(style['moving-box'])[0] as HTMLElement;
        if(movingBox){

            movingBox.addEventListener('transitionend',()=>{
                movingBox.classList.remove(style['blur']);
            })
        }
        return () => {
            movingBox.removeEventListener('transitionend',()=>{
                movingBox.classList.remove(style['blur']);
            })
        }
    },[])
    useEffect(()=>{
        const movingBox = document.getElementsByClassName(style['moving-box'])[0] as HTMLElement;
        if(movingBox){
            movingBox.classList.add(style['blur']);
            const movingBoxRect = movingBox.getBoundingClientRect();
            movingBox.style.left = (100/tabLabels.length) * activeTab + "%";
        }
    },[activeTab])
    return (
        <div className={"glass " + style["friends-page"]}>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabClassName={style["tab"]} 
                activeTabClassName={style["active-friend-tab"]}
                tabsContainerClassName={style["tabs-container"]}
                movingBoxClassName={style['moving-box']}
            />
            {activeTab === 1 && <FindFriends/>}
        </div>
    )
}

export default withAuth(Friends);