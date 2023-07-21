import React from 'react'
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
    const [activeTab, setActiveTab] = React.useState(tabLabels[0])
    const tabs = tabLabels.map((label, index) => {
        return {
            label: label,
            content: 
            <>
                {tabIcons[label]}{label} 
            </>
        }
    })

    return (
        <div className={"glass " + style["friends-page"]}>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabClassName={style["tab"]} 
                activeTabClassName={style["active-friend-tab"]}
                tabsContainerClassName={style["tabs-container"] + " text-indigo-900"}
            />
            {activeTab === "Find friends" && <FindFriends/>}
        </div>
    )
}

export default withAuth(Friends);