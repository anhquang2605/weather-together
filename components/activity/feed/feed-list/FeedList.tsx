import React, {useEffect} from 'react';
import style from './feed-list.module.css';
import { useFeedContext } from '../FeedsContext';
import FeedGroupComponent from '../feed-group-component/FeedGroupComponent';
import LoadingIndicator from '../../../loading-indicator/LoadingIndicator';
import { IoSadOutline } from "react-icons/io5";
interface FeedListProps {
    setIsEndOfList: React.Dispatch<React.SetStateAction<boolean>>;
    onRendered: React.Dispatch<React.SetStateAction<boolean>>;
}

const FeedList: React.FC<FeedListProps> = ({ setIsEndOfList, onRendered}) => {
    const {fetchingStatus, feedGroups} = useFeedContext();
    useEffect(()=>{
        if(feedGroups){
            const option = {
                root: null,
            }
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if(entry.isIntersecting){
                        setIsEndOfList(true);
                    }
                })
            }, option);

            const target = document.querySelector(`.${style['lazy-target']}`);
            if(target){
                observer.observe(target);
            }
            return () => {
                if(target){
                    observer.unobserve(target);
                }
            }
        }
    },[feedGroups])
    useEffect(()=>{
        onRendered(feedGroups && feedGroups.length > 0);
    },[
    ]);
    return (
        <div className={style['feed-list']}>
            { 
                feedGroups && feedGroups.length > 0 ?
                <>
                    {feedGroups.sort((a,b) => {
                        return new Date(b.lastestCreatedDate).getTime() - new Date(a.lastestCreatedDate).getTime();
                    }).map((feedGroup, index) => {
                        return(
                            <FeedGroupComponent 
                                key={index}
                                feedGroup={feedGroup}
                            />
                        )
                    })}
                </> 
                : 
                <div className={style['no-feed'] + " glass-lighter"}>
                    <IoSadOutline size={40} />
                    <span className={style['no-feed-text']}>No feeds yet, make some buddies to see their feeds!</span>
                </div>
            }
            {fetchingStatus === 'loading' &&
                <div className={style['loading'] + " h-vh"}>
                    <LoadingIndicator fluid={true}/>
                </div> 
                
            }
            {fetchingStatus === 'error' && <div>Failed to load, please reload and try again.</div>}
            <div className={style['lazy-target']}>
                      
            </div>
        </div>
    );
};

export default FeedList;