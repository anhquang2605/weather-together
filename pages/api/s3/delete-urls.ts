import  s3Client from './s3client';
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

export default async function deleteObjects(keys: string[]) {
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
        Delete: {
            Objects: keys.map((Key) => ({ Key })),
            Quiet: false,
        },
    };
    
    try {
        
        const data = await s3Client.send(new DeleteObjectsCommand(params));
        return data;
    } catch (err) {
        
        console.log("Error", err);
    }

}
