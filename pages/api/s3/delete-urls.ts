import nextConnect from 'next-connect';
import  s3Client from './s3client';
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import {NextApiRequest, NextApiResponse} from 'next';
const handler = nextConnect<NextApiRequest,NextApiResponse>(
    {onError(error, req, res) {
        res
          .status(501)
          .json({ error: `Sorry something Happened! ${error.message}` });
      },
      onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      }}
);//npm install next-connect@0.10.2
handler.delete(async (req, res) => {
    const urls  = req;
    console.log(req.body);
    if(!urls || !Array.isArray(urls)){
        res.status(400).json({error: 'Invalid request'});
    } else if(urls.length === 0){
        res.status(200).json({message: 'ok'});
    } else {
        const keys = urls.map(url => 
                ({
                    Key: url.split('/').pop() as string,//to get the final string after the last slash which is the key or file name of object
                })
            );//to get the final string after the last slash which is the key or file name of object
       const command = new DeleteObjectsCommand({
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
              Delete: {
                Objects: keys,
                Quiet: false,
              },
         });
        try{
            const Deleted:Number[] = []
            //const {Deleted} = await s3Client.send(command);
            if(Deleted && Deleted.length > 0){
                res.status(200).json({success: true, deleted: Deleted});
            }else{
                res.status(500).json({error: 'Error deleting files'});
            }
        } catch (err){
            console.log(err);
            res.status(500).json({error: 'Error deleting files'});
        }

    }
    res.status(200).json({message: 'ok'});
})

export default handler;

