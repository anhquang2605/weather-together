import { fetchFromGetAPI } from "./api-interactions";

export async function fetchReactionByGroups (targetId: string, ){
    const params ={
        targetId
    }
    const reactions = await fetchFromGetAPI("reactions/get-reactions-by-groups", params);
    return reactions;
}