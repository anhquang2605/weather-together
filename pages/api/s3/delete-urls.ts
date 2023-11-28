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
    console.log(req);
})