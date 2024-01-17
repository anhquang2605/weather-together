
import { use, useEffect, useState} from 'react';
import {useRouter} from 'next/router';//use with next js
import {IoClose} from 'react-icons/io5';
import style from './api-status-pop.module.css';
interface ApiStatusPopProps {
    status: {
        type: string,
        message: string
    },
    show: boolean,
    redirect?: string,
    redirectPageName: string,
    redirectButtonText?: string,
    setApiStatus: React.Dispatch<React.SetStateAction<{
        type: string;
        message: string;
    }>>
    redirectDuration?: number,
    closeButtonShown?: boolean,
    setReveal: React.Dispatch<React.SetStateAction<boolean>>,

}/*
This component depends on tailwindcss for styling
*/
export default function ApiStatusPop({ status, show, redirect = "", redirectPageName="", redirectDuration = 0, redirectButtonText = "", setApiStatus, setReveal, closeButtonShown=true}:    ApiStatusPopProps) {
    const [dastyle, setdaStyle] = useState("");
    const [revealPop, setRevealPop] = useState<boolean>(show);//this is for the pop up to reveal itself after the status is set
    const [redirectCountdown, setRedirectCountdown] = useState<number>(0);
    const [showCloseButton, setShowCloseButton] = useState<boolean>(closeButtonShown);
    const router = useRouter();
    const redirectTo = (path: string) => {
        router.push(path);
    }
    const handleClosePop = () => {
        setReveal(false);
        
    }
    const handleConfirm = () => {
        setRevealPop(false);
        if(redirect.length > 0){
            redirectTo(redirect);
        }else{
            router.reload();
        } 
    }
    useEffect(() => {
        let redirectTimer: NodeJS.Timeout;
        switch(status.type) {
            case "success":
                setdaStyle("text-green-400");
                   if(redirectDuration > 0){
                        redirectTimer = setInterval(() => 
                        {
                            setRedirectCountdown(prevState => prevState + 1);
                        }, 1000);
                    }

                break;
            case "error":
                setdaStyle("text-red-400");
                setShowCloseButton(true);
                break;
            case "loading":
                setdaStyle("text-blue-400");
                break;
        }
        return () => {
            clearTimeout(redirectTimer);
        }    
    },[status.type])
    useEffect(() => {
        if(redirectCountdown >= redirectDuration && redirectDuration > 0) {
            redirectTo(redirect);
        }
    },[redirectCountdown])
    useEffect(() => {
        setRevealPop(show);
    },[show])
    return (
        <div className={"fixed z-50 top-0 left-0 w-full h-full flex " + (revealPop? "" : "hidden ")}>
            <div onClick={
                handleClosePop
            } className="absolute top-0 left-0 backdrop-blur bg-slate-900 bg-opacity-70 w-full h-full"></div>
            <div className={"bg-indigo-900 mx-auto my-auto rounded p-24 w-3/4 md:w-2/4 lg:w-1/3 flex justify-center items-center flex-col relative"}>
                <div className={"flex flex-col items-center justify-center " + dastyle}>
                    {status.type!== "success" || showCloseButton && <button onClick={()=>{
                        setReveal(false);
                        setApiStatus({
                            type: "idle",
                            message: ""
                        })
                    }} className="absolute top-0 right-0 text-tomato"><IoClose style={
                        {
                            color: "tomato",
                            width: "2rem",
                            height: "2rem"
                        }
                    }/></button>}
                    <p className="text-center text-lg font-semibold flex flex-col">
                        {status.message}
                        {redirect && redirectDuration && status.type == "success" && <span className={style["countdown"]} >
                            {"Redirecting to " + (redirectPageName == "" ? "Home" : redirectPageName) +  " page in " + (redirectDuration - redirectCountdown) + " seconds"}
                        </span>}
                    </p>

                    {status.type == "success" && <button className="action-btn mt-4" onClick={handleConfirm}>
                    {redirectButtonText.length > 0 ? redirectButtonText : "Confirm"}</button>}
                </div>
            </div>
        </div>
    )
}