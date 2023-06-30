
import { useEffect, useState} from 'react';
import {useRouter} from 'next/router';//use with next js
import {IoCloseCircleSharp} from 'react-icons/io5';
interface ApiStatusPopProps {
    status: {
        type: string,
        message: string
    },
    show: boolean,
    redirect?: string,
    redirectButtonText?: string
}/*
This component depends on tailwindcss for styling
*/
export default function ApiStatusPop({ status, show, redirect = "", redirectButtonText = ""}:    ApiStatusPopProps) {
    const [style, setStyle] = useState("");
    const [reveal, setReveal] = useState<boolean>();
    const router = useRouter();
    const redirectTo = (path: string) => {
        router.push(path);
    }
    useEffect(() => {
        setReveal(show);
    },[show])
    useEffect(() => {
        switch(status.type) {
            case "success":
                setStyle("border-green-300 text-green-400");
                break;
            case "error":
                setStyle("border-red-300 text-red-400");
                break;
            case "loading":
                setStyle("border-blue-300 text-blue-400");
                break;
        }    
    },[status.type])
    
    return (
        <div className={"fixed z-2000 top-0 left-0 w-full h-full " + (reveal? "" : "hidden ")}>
            <div className=" backdrop-blur bg-slate-900 bg-opacity-70 absolute top-0 left-0 w-full h-full"></div>
            <div className={"fixed inset-0 bg-indigo-900 mx-auto my-auto rounded border-4 p-24 sm:w-3/4 md:w-2/4 lg:w-1/4 h-1/4 flex justify-center items-center flex-wrap " + style}>
                <button onClick={()=>{
                    setReveal(false);
                }} className="absolute top-0 right-0 text-tomato"><IoCloseCircleSharp style={
                    {
                        color: "tomato",
                        width: "2rem",
                        height: "2rem"
                    }
                }/></button>
                <p className="text-center text-xl font-semibold">{status.message}</p>

                {status.type == "success" && <button className="bg-indigo-500 rounded rounded text-white py-2 px-8 mt-4" onClick={()=>{
                    redirect.length > 0 ?
                    redirectTo(redirect) :
                    router.back();
                }}>
                {redirectButtonText.length > 0 ? redirectButtonText : "Confirm"}</button>}
            </div>
        </div>
    )
}