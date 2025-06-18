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
    const [initialLoad, setInitialLoad] = React.useState<boolean>(false);
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
    useEffect(() => {
        if (fetchingStatus === 'success' || fetchingStatus === 'error') {
            setInitialLoad(true);
        }
    }, [fetchingStatus]);
    /**
     * Feedlist debug log
     * Issue: feedgroups is set to empty array when no feed is available, we want to show that we are fetching feeds, not empty. 
     * Suggestion: only after fetching is done, we set feedGroups to null.
     * Approach: has initialLoad state to determine if we are still fetching feeds, if so, we show loading indicator.
     */
    if (!initialLoad ) {
        return (
            <div className={style['feed-list']}>
                <div className={style['loading'] + " h-vh"}>
                    <div>
                        Working on it, please wait...
                    </div>
                    <LoadingIndicator fluid={true}/>
                </div> 
            </div>
        )
    } else {
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
                <span className={style['no-feed-text']}>No feed yet, post something or make some buddies to see feeds!</span>
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
    } 


    
};

export default FeedList;