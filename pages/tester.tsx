import { useEffect, useState } from "react"
import { MockContext } from "../context/MockContext"
import { faker } from "@faker-js/faker"
import { getPostByUsernamesString } from "../libs/posts"
import Loading from "../components/loading"
import FeedList from "../components/activity/feed/feed-list/FeedList"


export default function Tester(userJSON:any) {
    //const user:User = JSON.parse(userJSON);
    //const posts = generateRandomPosts(10);
    const [posts, setPosts] = useState([]);
    const [startUpdate, setStartUpdate] = useState(false);
    const profilePicturePaths = {
        'anhquang2605': faker.image.avatar(),
        'chuquang2605': faker.image.avatar(),
    }
    const interval = 5000;
    const mockTimeEvent = (interval: number) => {
        const theinterval = setInterval(() => {
            setStartUpdate((prev) => !prev);
        }, interval);

    }
        useEffect(()=>{

            getPostByUsernamesString('anhquang2605').then((posts) => {
                    setPosts(posts)
            })
            mockTimeEvent(interval);
        },[])
    useEffect(() => {
        console.log("startUpdate", startUpdate);
    },[startUpdate])
    return (
        <MockContext.Provider value={{profilePicturePaths}}>
        <div className="w-full h-full overflow-y-scroll">
            <h1>Tester</h1>
            <FeedList setIsEndOfList={setStartUpdate} onRendered={(isRendered) => {}}/>
        <div>

        </div>


        </div>

        </MockContext.Provider>
    )
}