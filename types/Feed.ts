import { ObjectId } from "mongodb";

export interface Feed {
    _id: string | ObjectId;
    title?: string;
    createdDate: Date;
    username: string;//user who created the feed
    relatedUser?: string;//user who is related to the feed, for example, the user who is tagged in a post
    type: string;//type of feed, comment, react, post, friend becamecreate...
    reactionType?: string;
    activityId: string;//id of activity, comment, react, post...
    targetType?: string;//type of target, post, comment...
    targetId?: string;//id of target post, comment
    targetParentId?: string;//id of parent post if targetType is a comment, will be '', if targetType is a post or picture

    relatedUsers?: string[];//users who are related to the feed, for example, the users who are tagged in a post, only found in post_tag feed
    hiddenBy: string[];
}
export interface FeedGroup{
    targetContentId: string;
    feeds: Feed[];
    lastestCreatedDate: Date;
    lastestActivityId: string; //refer to the comments id specifically
    latestIndex: number;
}

/* Here are few activities that you could include in a user's activity feed:

When a user creates a post.

When a user comments on someone else's post.

When a user likes/reacts to someone else's post.

When a user is tagged in a post.

When a user's post is commented on or reacted to.

When a user adds a new friend. */