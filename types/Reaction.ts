export interface Reaction {
    _id?: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    name: string;
    targetId: string; // Post or Comment ID
}