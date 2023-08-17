

let ws: WebSocket | null = null;
interface Subcriber{
    type: string;
    callback: (message: MessageEvent) => void;
    token: string;
}
interface SubcriberMap {
    [type: string] : Subcriber;
}

const subcribersMap: SubcriberMap = {};
const PORT = process.env.NEXT_PUBLIC_WS_SERVER_PORT;
const SERVER_HOST = process.env.NEXT_PUBLIC_WS_SERVER_HOST;
export function setUpWSConnection (type: string, token: string) {
    if(ws){
        ws.onopen = () => {
            ws?.send(JSON.stringify({
                type,
                username: token
            }));
        }
        ws.onmessage = (message: MessageEvent) => {
            const data = JSON.parse(message.data);
            let subscriber = subcribersMap[data.type];
            if(subscriber){
                subscriber.callback(message);
            }
        }
        ws.onerror = (error: Event) => {
            console.log(error);
        }
    }
}
export function unSubcribe (type: string) {
    if(subcribersMap[type])
    delete subcribersMap[type];
    if(Object.keys(subcribersMap).length === 0) {
        ws?.close();
        ws = null;
    }
}
export async function closeWSConnection (token: string) {
    return new Promise((resolve,reject) => {
        Object.keys(subcribersMap).forEach(type => {
            delete subcribersMap[type];
        });
        ws?.close();
        ws = null;
        resolve(true);
    })
}
export function send (type: string, data?: any) {
    if(!subcribersMap[type]) return;
    let payload: {type: string, data?: any, username: string} = {
        type,
        username : subcribersMap[type].token
    }
    if(data) {
        payload.data = data;
    }
    ws?.send(JSON.stringify(payload));
}
export function subscribe (type: string, token: string, callback: (data: any) => void) {
    if(!ws) {
        ws = new WebSocket(`${SERVER_HOST}:${PORT}`);
        setUpWSConnection(type, token);
    }
    subcribersMap[type] = {
        type,
        token,
        callback
    }
}
export function subscribed (type: string) {
    return !!subcribersMap[type];
}