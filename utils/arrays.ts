import { Buddy } from "../types/User";
export const mergeAndSortArrays = (unsorted: Buddy[], sorted: Buddy[]) => {
    let newArray = [...unsorted,...sorted];
    newArray.sort((a,b) => {
        return new Date(b.since).getTime() - new Date(a.since).getTime();
    })
    return newArray;
}