import { use, useEffect } from "react";
import { useSelector } from "react-redux";

interface BannerProps {
}
export default function Banner() {
    const user = useSelector((state: any) => state.user);
    const {location} = user?.data ?? {location: undefined};
    const currentCondition = useSelector((state: any) => state.weatherDaily.currentCondition);
    return (
        <>
            <div className="banner drop-shadow  bg-indigo-800 mb-4 rounded grow order-first w-full p-4">
                <div className="banner__content">

                    <h1 className="banner__title">Good {user?.data?.username ?? ""} Welcome to <span className="banner__title--highlight">Weather</span> App</h1>
                    <p className="banner__description">{/*Message of the day*/}When the sun come, shine brighter</p>
                    <p>
                        It is a {currentCondition.icon}
                    </p>
                </div>
            </div>
        </>
    )
}