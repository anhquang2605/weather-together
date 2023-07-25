export interface Post {
    _id?: string;
    content: string;
    username: string;
    dateCreated: Date;
    dateUpdated: Date;
    pictureAttached: boolean;
    taggedUsernames: string[];
    visibility: string;
}
//64c0070f04bf25a93c066cba 