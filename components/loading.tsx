import WeatherSpinner from "./weather-spinner/WeatherSpinner";


const Loading = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full glass fixed top-0 left-0 loading-screen">
            <WeatherSpinner />  
        </div>
    )
}

export default Loading;
