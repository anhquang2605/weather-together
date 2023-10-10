import { connectDB } from "../../libs/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'
interface FindArgs{
    username: string,
    createdDate?: {$lt: Date}
}
export default async (req: NextApiRequest, res:NextApiResponse) => {
    const db = await connectDB();
    if(db){
        if (req.method === 'GET') {
            // Assuming you pass an array of usernames as a query parameter
            let usernames:String[] = req.query.usernames as String[] || [];

            // Fetch the latest feeds where the username is either the issuer or the target
            const feeds = await db
                .collection("feeds")
                .find({
                $or: [
                    { username: { $in: usernames } },
                    { relatedUser: { $in: usernames } },
                ],
                })
                .sort({ date: -1 }) // Assuming you have a date field to sort by latest
                .limit(10) // or however many you want to fetch at once
                .toArray();

            if (feeds.length === 0) {
                res.status(404).json({ error: "No feeds found" });
                return;
            }

            // Get the list of usernames for which feeds were found
            const activeUsernames = [
                ...new Set([...feeds.map((feed) => feed.username), ...feeds.map((feed) => feed.relatedUser)]),
            ];

            // Filter out usernames that didn't have any feeds
            const remainingUsernames = usernames.filter((username) =>
                activeUsernames.includes(username)
            );

            res.status(200).json({ feeds, remainingUsernames });
        } else if (req.method === 'POST') {
            const usernames = req.body;
            const feeds = db.collection('feeds');
            const agg = [
                {
                    $match: {
                        $or: [
                            {relatedUser: {$in: usernames}},
                           { username: {$in: usernames}}
                        ]
                    }
                }
            ]
            const results = await feeds.aggregate(agg).toArray();
            if(results.length > 0){
                res.status(200).json({success: true, feeds:results});
            }else{
                res.status(200).json({success: false, message: "No more feeds"});
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' }); // Handle any other HTTP method
        }
    }else{
        res.status(500).json({ error: 'DB connection error' });
    }
}