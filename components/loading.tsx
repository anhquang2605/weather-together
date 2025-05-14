import WeatherSpinner from "./weather-spinner/WeatherSpinner";

type LoadingProps = {
    startUpdate?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ startUpdate }: LoadingProps) => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full glass fixed top-0 left-0 loading-screen">
            <WeatherSpinner startUpdate={startUpdate} />  
        </div>
    )
}