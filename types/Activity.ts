import { ObjectId } from "mongodb";

export interface Activity {
    _id: string | ObjectId;
    username: string;
    relatedUsername: string;//username of the user who is related to the activity, friendId, someone's comment, someone's post or 
    type: string;//reaction, comment, post, profileUpdate, buddyAccepted
    referenceId: string;//postId, commentId, reactionId, friendId, '' when profileUpdate, username when buddyAccepted
    targetId: string;
    targetType: string;//post, comment
    createdDate: Date;

}