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

/**
 * Compares two values and returns a number indicating their order.
 * 
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @return A negative number if a is less than b, 0 if they are equal, 
 *         or a positive number if a is greater than b.
 */
export function compareAny(a:any, b:any){
    // If a is greater than b, return 1.
    if(a > b){
        return 1;
    }
    // If a is equal to b, return 0.
    else if(a === b){
        return 0;
    }
    // If a is less than b, return -1.
    else{
        return -1;
    }
}
/**
 * return array with randomized number within a given length starting from 1, if want to start from 0 then will take in optional flag
 * @param len length of array
 * @param isIndex boolean, if index is considered so starting from 0 instead of 1
 */
export function generateRandomizedArray(len: number, isIndex:boolean = false){
    let arr = [];
    for(let i = 0; i < len; i+=1){
        let curVal = i;
        if(!isIndex){
            curVal += 1; 
        }
        arr[i] = curVal;
    }
    //shuffle array
    for(let i = 0; i < len; i += 1){
        let j = Math.floor(Math.random() * len);
        [arr[i],arr[j]] = [arr[j],arr[i]];//to swap element of array
    }
    return arr;
}