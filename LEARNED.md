## LESSION LEARNED


1. Use mousedown event instead of click so that the event can trigger before onBlur of another element
2. Typing of event object can be imported from React
3. For data gotten from API endpoints, need to alter selectId: method in adapter to generate id for the data (Redux and data normalization)
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
17. slice (0,-1) will return array from the begining but exclude the last element
18. use BSON.ObjectId() in trigger function since BSON is global module and ObjectId is not available initially
19. need to add async declaration to the trigger function as well
20. When viewing a list with load more or lazing loading, dont ever filter it into a different list 
21. Change stream need to be closed whenever a websocket is closed. Other wise, you may experience serveral messages spawn from a server socket even though you closed the web socket
socket.on('close', () => {

      userChangeStream && userChangeStream.close();
      notificationChangeStream && notificationChangeStream.close();
    
  })
22. in case of updating multiple state at once on a same object, do it in one set state instead of multiple to ensure state consistency
23. For simple load more function with notification where u sort the items by created date, use the last item in the list created date as a cursor to the next set
24. For child to scale to height or width of flex container, use {
    self-align: stretch on the child itself
  }
25. Element tend to be streched or shrink to fit in flex container despite the element itself has specified dimensions:
Solved: set the element its self to flex-shrink: 0 to prevent the shrinking
26. function parameter rest:
_ Allow providing infinite number of arguments wihtout using array
_ The arguments will then be put in an array inside the function
Example: function<T, K extends keyof T>(obj: T, ...keys: K[]) :Pick<T,K>{}
27. Type collection to specify desired type
let collection = db.collection<User>('users')
let users:User[] = collection.find().toArray();
28. To fill the remain space while specify the others siblings to remain the same dimension, use flex: 1
29. For child of such container to actually fill the dimension of the container, dont use 100% height or width since it will cause the child element to over grow, causing the container to scroll.
=> work around: set the child to have fixed height, any is fine, then set its flex: 1
30. For intersection observer, besure to create a call back outside of the object instantiation because it might capture the old value of parameter, causing the function inside to always receive the same param despite the state and prop provided to it changed
31. if Operation involve passing a function and have a callback function to call that function, the state within such passed function will remain the same in a closure. To access the latest version of the state, useRef, update stateref.current = thestate to get the latest update from within a closure
const lastCursorRef =  useRef<Date>(lastCursorDate);
useEffect(()=>{
    lastCursorRef.current = lastCursorDate;
}, [lastCursorDate]);
const functionBeingCallWithinACallBack = async () => {
    ....
    const response = await handleFetchBuddies(lastCursorRef.current);
    .....
}
32. importing svg using svgr/webpack with require 

interface CloudProps {
}
/* 
    Cloud svgs for sky-scroller
*/
const Cloud: React.FC<CloudProps> = ({cloudClassName, variation, style,  boxSize,index, scale}) => {
    const SvgCloudComponent = require(`./../../../../assets/svg/userProfile/sky/cloud${variation}.svg`).default;

    return (
                <SvgCloudComponent/>

    );
};

export default Cloud;

33. svgr will use svgo, svgo will try to remove viewBox attribute which will cause element to be cropped. To fix, in the config file of next.config.js, disable viewBox removal:
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'weather-together-image-bucket.s3.us-east-2.amazonaws.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cloudflare-ipfs.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
      webpack: (config, options) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{
              loader: '@svgr/webpack',
              options: {
                 svgo: {
                    plugins: [{
                       removeViewBox: false
                    }]
                 }
              }
           }]
        });

        return config;
    },
}

module.exports = nextConfig

34. Batch State update
_Putting two state setter in same function scope will make the state update simutaneously

35. For any state setting that require state to be updated even though the value is repeated (say resetting the same string on same state), use timestamp, incase of adding or removing, use separate timestamp for each action

36. filtering may trigger state change if applied filter on the same state object
=> copy the state object then apply filter on this new object instead

37. using grid, ensure that container (sub container of a grid container) to have overflow: hidden, width and height 100%, image: object-fit: cover, so that everything is contained within the desired dimension

38. Syncing states of two instances of same component via a context

    useEffect(()=>{        
        if(forPost){ 
           if(postId === curPostId){

                if(show === preview){
                    //moving away from this form
                    handleSetCommentFormState();
                } 
           }
        }
    },[show])
    useEffect(()=>{
        if(commentFormState && postId === curPostId){
           //update state on both instances when there is a change in context state
            handleFormStateTransfer({...commentFormState});
          
        }
    },[commentFormState])
    39. When getSession() inside getServerSideProps, need to provide the context to the getSession() function
    const session = await getSession(context);//need to provide context for the session
   let username = "";
   if(!session){
         return {
              props: {
                feeds: [],
                hasMore: false
              }
         }     
   }
    username = session?.user?.username || "";   
    const results = await getFeedsByUsername(username);
    return {
        props: {
            feeds: results.feeds,
            hasMore: results.hasMore,
            username: username
        }
    }
    40. on MongoDB, when creating new document, must use new Date() on serverside, or else we have date stored as string
    41. select with peusdo class :empty for item that does not have any content or height or width is equal 0
    42. To define two constants with same name in switch, besure to add {} for each case to create a block scope so Typescript does not complaint
    43. Image from urls must be created by using fetch function instead of new Blob() since new Blob will always result in image size less than 63 and no information with that image
    44. Flex: none (if there is another flex: 1 item, this item will be shrunk to its normal height) is different from flex: 0 (will not leave any space for the other flex item with this property aside from its padding)
    45. in Mongo, $in and in are two different things
    46. Execute an async function returned by a function:
    When define a func like so const func = (var) => async () => {
      ....
    }
    to call this function, first need to resolve the promise from the async function by wrapping () around the func call with await used, the call the resolved promise as a function (await func("sth"))()
    47. For state changes without trigger component rerendering, use callback, closures. make change to internal variable of component