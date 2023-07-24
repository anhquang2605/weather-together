export interface FriendRequest {
    _id?: string;
    username: string;
    dateCreated: Date;
    targetUsername: string;
    dateUpdated: Date;
    status: string; //pending, accepted, declined
}