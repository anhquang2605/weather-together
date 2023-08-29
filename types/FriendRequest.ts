import { ObjectId } from "mongodb";

export interface FriendRequest {
    _id?: string | ObjectId;
    username: string;
    createdDate: Date;
    targetUsername: string;
    updatedDate: Date;
    status: string; //pending, accepted, declined
}