export async function getUserIds(){
    const ids : number[] =  [1,2,3,4,5];
    //id must be string
    const paths = ids.map(id => {
        return {
            params: {
                id: id.toString()
            }
        }
    });
    return  paths;
}