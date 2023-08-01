export interface Feed {
    _id?: string;
    title: string;
    createdDate?: Date;
    username: string;//user who created the feed
    type: string;//type of feed, comment, react, post, friend becamecreate...
    activityId: string;//id of activity, comment, react, post...
    targetType: string;//type of target, post, comment...
    targetId: string;//id of target post, comment
    targetParentId?: string;//id of parent post if targetType is a comment, will be '', if targetType is a post

}