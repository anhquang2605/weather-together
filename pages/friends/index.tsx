import React from 'react'
import style from './friends.module.css'
import Tabs from '../../components/plugins/tabs/Tabs'
export default function Friends(){
    const tabLabels = [
        "Friend lists",
        "Find friends",
        "Friend requests"
    ]
    const [activeTab, setActiveTab] = React.useState(tabLabels[0])
    const tabs = tabLabels.map((label, index) => {
        return {
            label: label,
            content: 
            <div>
                {label}
            </div>
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
                tabsContainerClassName={style["tabs-container"]}
            />
        </div>
    )
}