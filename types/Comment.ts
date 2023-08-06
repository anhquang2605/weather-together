
import { ObjectId } from "mongodb";
import { Reaction } from "./Reaction";
export interface Comment {
    _id?: string | ObjectId;
    content: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    targetType: string; // posts, comments
    targetId: string | null; // the parent that the comment is associated with, if "", then the comment is a direct comment to a post
    postId: string; // the post that the comment is associated with
    level: number; // the level of the comment, 0 is a direct comment to a post, 1 is a comment to a comment, 2 is a comment to a comment to a comment, etc. max level is 2, at this level, cannot reply to this comment;
    pictureAttached: boolean;
}