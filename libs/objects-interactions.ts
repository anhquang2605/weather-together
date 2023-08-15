export function pick<T,K extends keyof T>(obj: T, ...keys: K[]): Pick<T,K>{
    const ret = {} as Pick<T,K>;
    keys.forEach(key => ret[key] = obj[key]);
    return ret;
}