import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import multer from 'multer';
import nextConnect from 'next-connect';

// Extend the Next.js request object with `file` from Multer
interface NextApiRequestWithFile extends NextApiRequest {
    file: any;
  }
/* AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2',
}); */

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-2',
});
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
    const errors = [];
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    }
    try{
        const uploaded = await new Upload({
            client: s3,
            params
        }).done();
        if('Location' in uploaded){
            res.status(200).json({ url: uploaded.Location });
        }
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