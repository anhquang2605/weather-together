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