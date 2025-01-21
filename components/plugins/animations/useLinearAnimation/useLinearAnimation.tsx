import React, {useEffect, useState, useContext} from 'react'
import anime from 'animejs';
interface LinearAnimationContextType{
    duration: number,
    delay: number,
    repeatCount: number
    isRepeating: boolean,
    setDuration: React.Dispatch<React.SetStateAction<number>>,
    setDelay: React.Dispatch<React.SetStateAction<number>>,
    setRepeatCount: React.Dispatch<React.SetStateAction<number>>,
    setIsRepeating: React.Dispatch<React.SetStateAction<boolean>>
}

type LinearAnimationStage ={
    duration: number;
    delay: number;
    playAnimation: () => void;
    callback: () => void;
    
}
const LinearAnimationContext = React.createContext<LinearAnimationContextType | null>( null)

const LinearAnimationProvider = ({children}:any) => {
    const [duration, setDuration] = useState(0);
    const [delay, setDelay] = useState(0);
    const [repeatCount, setRepeatCount] = useState(0);
    const [isRepeating, setIsRepeating] = useState(false);
    const [stages, setStages] = useState<LinearAnimationStage[]>([]);
    const addStage = (stage: LinearAnimationStage) => {
        setStages([...stages, stage]);
    }
    const playStages = () => {
        stages.forEach((stage) => {
            stage.playAnimation();
            stage.callback();
        })
    }
    
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

export default LinearAnimationProvider