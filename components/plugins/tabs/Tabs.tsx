import {useEffect} from 'react'
import style from './tabs.module.css'
interface Tab {
    label: string;
    content?: JSX.Element;
}
interface TabsProps {
    tabs: Tab[];
    activeTab: number;
    setActiveTab: (index: number) => void;
    tabsContainerClassName?: string;
    tabClassName?: string;
    activeTabClassName?: string;
    movingBoxClassName?: string;
}
export default function Tabs(props: TabsProps) {
    const {tabs, activeTab, setActiveTab, movingBoxClassName = "", tabsContainerClassName = "", tabClassName = "", activeTabClassName = "" } = props;
    return (
        <div className={tabsContainerClassName ?? style['tabs']}>
            <div className={movingBoxClassName}>
                <div className={style['highlighter']}>

                </div>
            </div>
            {
                tabs.map((tab, index) => {
                    return(
                        <div key={index} className={style['tab'] + " " + tabClassName + " " + (activeTab === index ? (!activeTabClassName ? style['active']:activeTabClassName) : "")} onClick={() => setActiveTab(index)}>
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