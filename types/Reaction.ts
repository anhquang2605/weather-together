export interface Reaction {
    _id?: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    name: string;
    targetId: string; // Post or Comment ID
    expireAt?: Date; //countdown time for reactoin
}
export interface ReactionWithUser {
    targetId: string;
    username: string;
    profilePicture: string;
    name: string;
    createdDate: Date;
    status: string;
    fullName: string;
}
export interface ReactionGroup{
    name: string;
    count: number;
    usernames: string[];
}