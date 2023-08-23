import React, { useEffect } from 'react'
import style from './friends.module.css'
import Tabs from '../../components/plugins/tabs/Tabs'
import {CgUserList, CgUserAdd, CgPlayListSearch} from 'react-icons/cg'
import FindFriends from '../../components/friends-tab-content/find-friends';
import withAuth from '../authentication/with-auth';
import { getCitiesFromLongLat } from '../../libs/geodb';
import { useSession } from 'next-auth/react';
import { subscribe, unSubcribe } from '../../utils/websocket-service';
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
    const [friendUsernames, setFriendUsernames] = React.useState<Set<string>>(new Set());
    const {data: session} = useSession();
    const user = session?.user;
    const tabs = tabLabels.map((label, index) => {
        return {
            label: label,
            content: 
            <>
                {tabIcons[label]}{label} 
            </>
        }
    })
    const handleFetchFriendUsernames = async (username: string) => {
        try{
            const response = await fetch(`/api/users?username=${username}&fetchFriends=true`,{
                method: 'GET'
            });
            if(response.status === 200){
                const data = await response.json();
                setFriendUsernames(new Set(data.data));
            }
        }catch(e){
            console.log(e);
        }
    }
    const handleWebSocketMessage = (message: MessageEvent) => {
        const payload = JSON.parse(message.data);
        if(payload.type === 'friends-changestream'){
            const {operationType, friendUsername} = payload;
            if(operationType === 'insert'){
                setFriendUsernames(prev => {
                    const newSet = new Set(prev);
                    newSet.add(friendUsername);
                    return newSet;
                })
            }else{
                setFriendUsernames(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(friendUsername);
                    return newSet;
                })
            }
        }
    }
    useEffect(()=>{
        const movingBox = document.getElementsByClassName(style['moving-box'])[0] as HTMLElement;
        if(user && user.username){
            subscribe('friends-changestream', user.username, handleWebSocketMessage);
        }
        if(movingBox){

            movingBox.addEventListener('transitionend',()=>{
                movingBox.classList.remove(style['blur']);
            })
        }
        return () => {
            unSubcribe('friends-changestream');
            movingBox.removeEventListener('transitionend',()=>{
                movingBox.classList.remove(style['blur']);
            })
        }
    },[])
    useEffect(()=>{
        if(user && user.username){
            
            handleFetchFriendUsernames(user.username);
        }
    },[user])
    useEffect(()=>{
        const movingBox = document.getElementsByClassName(style['moving-box'])[0] as HTMLElement;
        if(movingBox){
            movingBox.classList.add(style['blur']);
            const movingBoxRect = movingBox.getBoundingClientRect();
            movingBox.style.left = (100/tabLabels.length) * activeTab + "%";
        }
    },[activeTab])
    useEffect(()=>{
        console.log(friendUsernames);
    },[friendUsernames])
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