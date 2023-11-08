export function fetchFromGetAPI (path: string, options: any){
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/${path}`;
    const params = new URLSearchParams(options).toString();
    return fetch(`${url}?${params}`, {}).then(res => {
        if(res.ok){
            return res.json();
        }else{
            return Promise.reject(res);
        }
    });
}

export function updateToPutAPI(path: string, body: any){
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/${path}`;
    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        if(res.ok){
            return res.json();
        }else{
            return Promise.reject(res);
        }
    });
}

export function insertToPostAPI(path: string, body: any){
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/${path}`;
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(res => {
        if(res.ok){
            return res.json();
        }else{
            return Promise.reject(res);
        }
    });
}
export function uploadFileToPostAPI(path: string, file: any){
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/${path}`;
    const formData = new FormData();
    formData.append('file', file);
    return fetch(url, {
        method: "POST",
        body: formData
    }).then(res => {
        if(res.ok){
            return res.json();
        }else{
            return Promise.reject(res);
        }
    });
}
export function deleteFromDeleteAPI(path: string, params: any){
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const url = `${baseURL}/api/${path}`;
    const paramsString = new URLSearchParams(params).toString();
    return fetch(`${url}?${paramsString}`, {
        method: "DELETE"
    }).then(res => {
        if(res.ok){
            return res.json();
        }else{
            return Promise.reject(res);
        }
    });
}