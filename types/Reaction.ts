export interface Reaction {
    _id: string;
    username: string;
    dateCreated: string;
    dateUpdated: string;
    type: string;
    icon: string;
    targetId: string; // Post or Comment ID
}