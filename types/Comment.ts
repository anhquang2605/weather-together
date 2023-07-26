import { Reaction } from "./Reaction";
export interface Comment {
    _id?: string;
    content: string;
    username: string;
    dateCreated: Date;
    dateUpdated: Date;
    targetType: string; // posts, comments
    targetId: string | null; // the parent that the comment is associated with, if null, then the comment is a direct comment to a post
    postId: string; // the post that the comment is associated with
}