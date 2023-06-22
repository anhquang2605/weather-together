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
