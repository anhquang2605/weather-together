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
9. Modal should be added to the very end of the component, else weird behavior gonna happen, should be added outside of the parent container so use <> </>
10. Height scale propotional to width, have a container with pb set to a certain percentage this will specify the height /  width ratio, the winthin the container, have that element height to full and it will be the desired height, also the child element must be absolute positioned
11. FontAwesome work around for nextjs:
const {library, config} = require('@fortawesome/fontawesome-svg-core')// Do this for fontawesome to work with nextjs
12. When passing a field of a state, dont forget to also specify a key on the component receiving such field to cause re rendering whenever the property of such state object change
13. For changeStream of mongoDB pipeline to work with fullDocument match, make sure to pass second argument to watch() function as an object {fullDocument: "updatelookup"}
const pipeline = [{
          $match: {
            'fullDocument.username': username,
            operationType: {
              $in: ['insert', 'update', 'replace']
            }
          }
      }];
        const userCollection = await db.collection('users');
        userChangeStream = userCollection.watch(pipeline,{ fullDocument: 'updateLookup' });
14. element to be above another absolute positioned element, that element must have position relative or absolute
15. Next Auth: when user in session is returned empty, it happens because you need to provide the right user object, if you pass anything that is undefined, the user object will not be valid and become empty. here is how the data flow in next auth: authorize --> jwt --> session
16. jwt is created after the authorize function return a user object