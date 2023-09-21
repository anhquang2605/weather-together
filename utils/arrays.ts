/**
 * This function will merge two array of objects, remove duplicate based on the property extractor and sort the result, the property here is asumed to be quantifiable not string for string 
 * @param unsorted 
 * @param sorted 
 * @param comparefunction 
 * @param propertyExtractor 
 * @returns 
 */

export function mergeAndSortUniqueArrays <T> (unsorted: Set<T>, sorted: T[], comparefunction:(a:T, b:T) => number, propertyExtractor: (item: T) => any) {
    //merge if there is duplicate
    const merged = [];
    let i = 0;
    let j = 0;
    const unsortedArr = [...unsorted];
    const sortedArr = [...sorted];
    const sortedArr2 = unsortedArr.sort(comparefunction)
    const sorted1Len = sortedArr.length;
    const sorted2Len = sortedArr2.length;
    while(i < sorted1Len && j < sorted2Len){
        const prop1 = propertyExtractor(sortedArr[i]);
        const prop2 = propertyExtractor(sortedArr2[j]);
        if(prop1 > prop2){
            merged.push(sortedArr[i]);
            i++;
        }else if (prop1 === prop2){
            merged.push(sortedArr2[j]);
            i++;
            j++;
        }else{
            merged.push(sortedArr2[j]);
            j++;
        }
    }
    if(i < sortedArr.length){
        for(; i < sortedArr.length; i++){
            merged.push(sortedArr[i]);
        }
    }
    if(j < sortedArr2.length){
        for(; j < sortedArr2.length; j++){
            merged.push(sortedArr2[j]);
        }
    }
    return merged;


}

export function compareAny(a:any, b:any){
    if(a > b){
        return 1;
    }else if(a === b){
        return 0;
    }else{
        return -1;
    }
}