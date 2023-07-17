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
