export interface FriendRequest {
    _id?: string;
    username: string;
    createdDate: Date;
    targetUsername: string;
    updatedDate: Date;
    status: string; //pending, accepted, declined
}