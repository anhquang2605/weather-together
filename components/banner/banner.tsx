import { useSelector } from "react-redux";

interface BannerProps {
}
export default function Banner() {
    const user = useSelector((state: any) => state.user);
    const {location} = user?.data ?? {location: undefined};
    return (
        <>
            <div className="banner grow order-first w-1/1 p-4">
                <div className="banner__content">

                    <h1 className="banner__title">Good {user.data.username} Welcome to <span className="banner__title--highlight">Weather</span> App</h1>
                    <p className="banner__description">{/*Message of the day*/}When the sun come, shine brighter</p>
                </div>
            </div>
        </>
    )
}