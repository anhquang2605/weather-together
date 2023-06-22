import AWS from 'aws-sdk';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import multer from 'multer';
import nextConnect from 'next-connect';

// Extend the Next.js request object with `file` from Multer
interface NextApiRequestWithFile extends NextApiRequest {
    file: any;
  }

const upload = multer({ storage: multer.memoryStorage() });
AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const s3 = new AWS.S3();
//need to extend the type
const handler = nextConnect<NextApiRequestWithFile,NextApiResponse>(
    {onError(error, req, res) {
        res
          .status(501)
          .json({ error: `Sorry something Happened! ${error.message}` });
      },
      onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
      }}
);//npm install next-connect@0.10.2

handler.use(upload.single('file'));

handler.post(async (req, res) => {
    const file = req.file;
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
        console.log(err);
        res.status(500).json({error: 'Error uploading file'});
    }
})


export default handler;

export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};