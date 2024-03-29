import { EMOJIS } from "../../../../constants/emojis";
import { Feed } from "../../../../types/Feed";
import { UserBasic } from "../../../../types/User";
import UserMiniProfile from "../../../user/user-mini-profile/UserMiniProfile";
import { REACTION_ICON_MAP } from "../../reaction/reaction-icon-map";
import style from './feed-title.module.css';
import {subDays, formatDistance} from 'date-fns';
interface FeedTitleProps {
    feed: Feed,
    myUsername: string,
    usernameToBasicProfileMap: {[username: string]: UserBasic}
}
const FeedTitle = (props:FeedTitleProps) => {
    const {feed, myUsername, usernameToBasicProfileMap} = props;
    const username = feed.username;
    const relatedUser = feed.relatedUser || null;
    const relatedUsers = feed.relatedUsers || [];
    const user = usernameToBasicProfileMap[username];
    const user2 = usernameToBasicProfileMap[relatedUser || ""];
    const convertUserToMiniProfile = (user: UserBasic) => {
        return <UserMiniProfile key={user.username} user={user} sizeOfAvatar='small'/>
    }
    return (
        <div className={style['feed-title'] }>
            {
                username === myUsername ?
                <span className="font-bold">
                    You
                </span> 
                : 
                user && convertUserToMiniProfile(user )
            }
            <div className={style['feed-action']}>
                {
                    feed.type === "post_tag" && ' tagged '
                }
                {
                    feed.type === 'comments' &&     ' commented on '
                }
                
                {
                    feed.type === "reaction" && ` reacted ${
                        REACTION_ICON_MAP[feed.reactionType as string]

                    } to`
                }

                {
                    feed.type === 'posts' && ' released a thought'}
            </div>
            {
                (feed.type === "comments")  &&
                (                          
                    relatedUser === myUsername ?
                'your' :
                
                    relatedUser === username ?
                    "their" 
                    : 
                    <>
                        {user2 && convertUserToMiniProfile(user2)} { feed.type === 'comments' ? "'s" : " in a post"}
                    </>
                    
                
                ) 
            }
            {
                feed.type === 'post_tag' && relatedUsers && relatedUsers.length > 0 && 
                    relatedUsers.map((relatedUser, index) => {
                        return (
                            <span className="flex flex-row whitespace-pre-wrap" key={index}>
                                {
                                    relatedUser === myUsername ?
                                    'You' :
                                    convertUserToMiniProfile(usernameToBasicProfileMap[relatedUser])
                                }
                                {
                                    index < relatedUsers.length - 1 ?
                                    "  ":
                                    ""
                                }
                            </span>
                        )
                    })
            }
            {
                feed.targetType && feed.targetType.length > 0 && (
                ` ${feed.targetType}`)
            }
            {
                feed.type === 'buddy_made' && 
                <>
                    {` made buddies with `}
                    {
                        relatedUser === myUsername ? "You" : convertUserToMiniProfile(user2) 
                    }
                </>

            } 
            <span className={style['feed-date']}>
                {
                    formatDistance(new Date(feed.createdDate), new Date(), { addSuffix: true })
                }
            </span>
        </div>
    )
}
export default FeedTitle;