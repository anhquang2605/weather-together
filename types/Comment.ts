import { Reaction } from "./Reaction";
export interface Comment {
    _id?: string;
    content: string;
    username: string;
    dateCreated: string;
    dateUpdated: string;
    reactions: Reaction[];
    targetId: string; // Postid
}