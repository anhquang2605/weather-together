import { Feed } from "../../../../types/Feed";
import { UserBasic } from "../../../../types/User";
import UserMiniProfile from "../../../user/user-mini-profile/UserMiniProfile";
import style from './feed-title.module.css';
interface FeedTitleProps {
    feed: Feed,
    username: string,
    relatedUser: string,
    myUsername: string,
    usernameToBasicProfileMap: {[username: string]: UserBasic}
}
const FeedTitle = (props:FeedTitleProps) => {
    const {feed, username, relatedUser, myUsername, usernameToBasicProfileMap} = props;
    const user = usernameToBasicProfileMap[username];
    const user2 = usernameToBasicProfileMap[relatedUser];
    const convertUserToMiniProfile = (user: UserBasic) => {
        return <UserMiniProfile user={user} sizeOfAvatar='small'/>
    }
    return (
        <div className={style['feed-title'] + " glass rounded-lg border border-slate-400 border-b-0"}>
        {
            username === myUsername ? 
            'You' : 
            user && convertUserToMiniProfile(user )
        }

        {
            feed.type === 'comments' &&     ' commented on '
        }

        {
            feed.type === 'posts' && ' released a '}

        {
            feed.type === "comments" &&
            (                          
                relatedUser === myUsername ?
            'your ' :
             
                user2.username === user.username ?
                "their " 
                : convertUserToMiniProfile(user2) 
             
            ) 
        }
        {
            feed.targetType && feed.targetType.length > 0 && (
            feed.targetType)
        } 
         
        </div>
    )
}
export default FeedTitle;