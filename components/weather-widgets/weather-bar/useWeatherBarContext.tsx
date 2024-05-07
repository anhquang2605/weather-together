import {createContext, useContext, useEffect, useState} from 'react'

interface UseWeatherBarContextProp {
    children: React.ReactNode;
}
export interface UseWeatherBarContextType {
    isHovered: boolean;
    setIsHovered: (isHovered: boolean) => void;
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
    isAnimated: boolean;
}
export const WeatherBarContext = createContext<UseWeatherBarContextType|null>(null);
export const WeatherBarContextProvider = ({children}:UseWeatherBarContextProp) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimated, setIsAnimated] = useState(false);
    useEffect(()=>{
        setIsAnimated(isHovered && isExpanded)
    },[isExpanded, isHovered])
    return (
        <WeatherBarContext.Provider value={
            {isHovered, setIsHovered, isExpanded, setIsExpanded, isAnimated}
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