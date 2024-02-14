import {createContext, useContext, useState} from 'react'

interface UseWeatherBarContextProp {
    children: React.ReactNode;
}
export interface UseWeatherBarContextType {
    isHovered: boolean;
    setIsHovered: (isHovered: boolean) => void;
}
export const WeatherBarContext = createContext<UseWeatherBarContextType|null>(null);
export const WeatherBarContextProvider = ({children}:UseWeatherBarContextProp) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <WeatherBarContext.Provider value={
            {isHovered, setIsHovered}
        }>
            {
                children
            }
        </WeatherBarContext.Provider>
    )
}
export const useWeatherBarContext = () => {
    const context = useContext(WeatherBarContext);
    if (!context) throw new Error('Need to use weather bar context within WeatherBarContextProvider')
    return context
}