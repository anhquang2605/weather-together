export interface Friend {//become friend when friend request is accepted, can use trigger
    _id?: string;
    username: string;
    friendUsername: string;
    since: Date;
}