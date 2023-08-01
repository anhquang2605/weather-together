export interface Reaction {
    _id?: string;
    username: string;
    createdDate: Date;
    updatedDate: Date;
    type: string;
    icon: string;
    targetId: string; // Post or Comment ID
}