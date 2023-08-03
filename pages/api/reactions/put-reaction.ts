import { NextApiRequest,NextApiResponse } from "next";
import { connectDB } from "../../../libs/mongodb";
export interface UpdatedFields{
    name: string,
    updatedDate: Date,
    expireAt?: Date,
}
interface UpdateDoc{
    $set: UpdatedFields,
    $unset?: any
}
    export default async function handler (req: NextApiRequest, res: NextApiResponse) {
        const db = await connectDB();
        const {username, targetId, updatedFields} = req.body;
        if(db){
            const filter = {
                username: username,
                targetId: targetId,
            }
            const updateDoc:UpdateDoc = {
                $set: updatedFields
            }
            if(updatedFields.name !== ''){
                updateDoc.$unset = {
                    expireAt: ""
                }
            }
            const reactionsCollection = db.collection("reactions");
            const result = await reactionsCollection.updateOne(filter, updateDoc);
            if(result.modifiedCount === 1){
                res.status(200).json({message: "Reaction updated"});
            }else{
                res.status(500).json({message: "Cannot update reaction"});
            }
        }else{
        
        }
    }