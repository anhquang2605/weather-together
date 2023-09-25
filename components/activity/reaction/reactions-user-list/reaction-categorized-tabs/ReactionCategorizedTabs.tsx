import React from 'react';
import style from './reaction-categorized-tabs.module.css';
import { ReactionGroup } from '../../../../../types/Reaction';
import { REACTION_ICON_MAP } from '../../reaction-icon-map';
interface ReactionCategorizedTabsProps {
    reactionsGroups: ReactionGroup[];
    setCurrentTab: (tab: string) => void;
    currentTab: string;
}
const ReactionTab = ({name, count, setCurrentTab, currentTab}: {name: string, count: number, setCurrentTab: (tab: string) => void, currentTab: string}) => {
    return (
        <span onClick={()=>{
            setCurrentTab(name);
        }} className={`${style['reaction-tab']} ${currentTab === name && style['active'] }`}>
            <span className={style['tab__icon']}>{name !== "all" && REACTION_ICON_MAP[name]}</span>
            {name === 'all' && <span className={style['tab__name']}>{name}</span>}
            <span className={style['tab__count']}>{count}</span>
        </span>
    )
}
const ReactionCategorizedTabs: React.FC<ReactionCategorizedTabsProps> = ({
    reactionsGroups, setCurrentTab, currentTab
}) => {
    
    return (
        <div className={style['reaction-categorized-tabs']}>
            <ReactionTab 
                key = {'all'} 
                name= {'all'} 
                currentTab={currentTab}
                count={reactionsGroups.reduce((acc, curr) => {
                    return acc + curr.count;
                }
                , 0)} 
                setCurrentTab={setCurrentTab}/>
            {
                reactionsGroups.map((reactionGroup) => {
                    return(
                        <ReactionTab key={reactionGroup.name} name={reactionGroup.name} count={reactionGroup.count} currentTab={currentTab} setCurrentTab={setCurrentTab}/>
                    )
                })
            }
        </div>
    );
};

export default ReactionCategorizedTabs;