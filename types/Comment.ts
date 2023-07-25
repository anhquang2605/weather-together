import { Reaction } from "./Reaction";
export interface Comment {
    _id?: string;
    content: string;
    username: string;
    dateCreated: Date;
    dateUpdated: Date;
    targetType: string; // posts, comments
    targetId: string; // Postid
}