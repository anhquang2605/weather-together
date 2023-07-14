import { Comment } from './Comment';
import { Reaction } from './Reaction';
export interface Post {
    _id: string;
    title: string;
    content: string;
    username: string;
    dateCteated: string;
    dateUpdated: string;
    comments: Comment[];
    reactions: Reaction[];
}
