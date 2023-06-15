import { useEffect } from 'react';
import {IoCloseCircleSharp} from 'react-icons/io5';
interface ApiStatusPopProps {
    status: string;
}
export default function ApiStatusPop({ status }: ApiStatusPopProps) {
    useEffect(() => {

    },[status])
    return (
        <>
            <div className="fixed inset-0 bg-white mx-auto my-auto rounded border-2 p-24 sm:w-3/4 md:w-2/4 lg:w-1/4 sm:h-1/6 md:h-1/4 flex justify-center items-center">
                <button className="absolute top-0 right-0 text-tomato"><IoCloseCircleSharp style={
                    {
                        color: "tomato",
                        width: "2rem",
                        height: "2rem"
                    }
                }/></button>
                <p className="text-center">{status}</p>
                
            </div>
        </>
    )
}