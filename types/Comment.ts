import { Reaction } from "./Reaction";
export interface Comment {
    _id?: string;
    content: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    targetType: string; // posts, comments
    targetId: string | null; // the parent that the comment is associated with, if "", then the comment is a direct comment to a post
    postId: string; // the post that the comment is associated with
}