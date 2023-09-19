export interface Relationship {
    _id?: string,
    username: string,
    relatedUsername: string,
    closeness: number,//defautl to 0 when friend request is accepted
    since: Date,
    lastUpdated: Date,
}

/* SCORES
    0: no relationship
    1: reacted to any content
    2: commented on user2's content
    3: tagging each other
    5: two way interaction on same content
    10: 5+ interactions
    20: 10+ interactions
    50: 20+ interactions
    100: 50+ interactions
*/