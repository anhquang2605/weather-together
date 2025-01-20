import React, {useEffect, useState, useContext} from 'react'

interface LinearAnimationContextType{
    duration: number,
    delay: number,
    repeatCount: number
    isRepeating: boolean,
}

const LinearAnimationContext = React.createContext<LinearAnimationContextType>({
    duration: 0,
    delay: 0,
    repeatCount: 0,
    isRepeating: false
})

const LinearAnimationProvider = ({children}:any) => {
    const [duration, setDuration] = useState(0);
    const [delay, setDelay] = useState(0);
    const [repeatCount, setRepeatCount] = useState(0);
    const [isRepeating, setIsRepeating] = useState(false);
    
    const value = {
        duration,
        delay,
        repeatCount,
        isRepeating,
        setDuration,
        setDelay,
        setRepeatCount,
        setIsRepeating
    }
    return (
        <LinearAnimationContext.Provider value={value}>
            {children}
        </LinearAnimationContext.Provider>
    )
}

export const useLinearAnimation = () => {
    const context = useContext(LinearAnimationContext);
    if(!context) throw new Error('useLinearAnimation must be used within a LinearAnimationProvider');
    return context
} 
