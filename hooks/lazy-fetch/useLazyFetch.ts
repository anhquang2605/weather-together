import {useState, useCallback}  from 'react';

type FetchState<T> = {
    data: T | null;
    status: string //'idle' | 'fetching' | 'error' | 'success';
}

type Options = {
    method: string //'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
}

export default function useLazyFetch<T>(): [
    FetchState<T>,
    (url: string, options?: Options) => Promise<void>
]{
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        status: 'idle',
    });
    const fetchData = useCallback(async (url: string, options?: Options) => {
        setState({
            data: null,
            status: 'fetching',
        });
        try {
            const response = await fetch(url, options);
            if(!response.ok){
                throw new Error(response.statusText);
            }
            if(response.status === 204){
                setState({
                    data: null,
                    status: 'success',
                });
                return;
            }
            const data = await response.json();

            setState({
                data: data,
                status: 'success',
            });
        } catch (error) {
            setState((prevState) => ({
                ...prevState,
                status: 'error',
            }));
        }
    }, []);
    return [state, fetchData];
}