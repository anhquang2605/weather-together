## LESSION LEARNED


1. Use mousedown event instead of click so that the event can trigger before onBlur of another element
2. Typing of event object can be imported from React
3. For data gotten from API endpoints, need to alter selectId: method in adapter to generate id for the data
4. can do fall back with the ? : evaluation condition 1 ? result 1 : (condition 2? result 2 : result 3)
5. To up load file using midleware must export a config option from the api route handler that would disable body parser in the api page
export const config: PageConfig = {
    api: {
        bodyParser: false,
    },
};

6. Cancel DragOver event first before listening to Drop event in html

7. To allow others to see uploaded picture on s3 need to create a policy for the bucket on s3 website with
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::BUCKETNAME/*"]
    }
  ]
}
8. scale on img will not allow to scroll pass the container scroll top or scroll left, need to scale image by changing its width and height directly