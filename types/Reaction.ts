export interface Reaction {
    _id?: string;
    username: string;
    dateCreated: Date;
    dateUpdated: Date;
    type: string;
    icon: string;
    targetId: string; // Post or Comment ID
}