import {useEffect} from 'react'
import style from './tabs.module.css'
interface Tab {
    label: string;
    content?: JSX.Element;
}
interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabsContainerClassName?: string;
    tabClassName?: string;
    activeTabClassName?: string;
}
export default function Tabs(props: TabsProps) {
    const {tabs, activeTab, setActiveTab, tabsContainerClassName, tabClassName, activeTabClassName } = props;
    return (
        <div className={style['tabs'] + " " + tabsContainerClassName}>
            {
                tabs.map((tab, index) => {
                    return(
                        <div key={index} className={style['tab'] + " " + tabClassName + " " + (activeTab === tab.label ? (!activeTabClassName ? style['active']:activeTabClassName) : "")} onClick={() => setActiveTab(tab.label)}>
                            {
                                tab.content ? 
                                    tab.content
                                :
                                tab.label
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}