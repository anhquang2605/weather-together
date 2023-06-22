import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import nextConnect from 'next-connect';

// Extend the Next.js request object with `file` from Multer
interface NextApiRequestWithFile extends NextApiRequest {
    file: any;
  }



export default async (req: NextApiRequestWithFile, res: NextApiResponse) => {
    console.log("here");
    const storage = multer.memoryStorage();
    const upload = multer({ storage});

    AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
    });

    const s3 = new AWS.S3();
    const file = req.file;
    console.log(req)
    if(!file){
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    try{
        const uploaded = await s3.upload(params).promise();

        res.status(200).json({ url: uploaded.Location });
    }catch(err){
        res.status(500).json({ error: 'Error uploading file' });
        console.log(err);
    }
}

