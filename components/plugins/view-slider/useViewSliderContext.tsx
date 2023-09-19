import React, { createContext } from "react";
import ViewSlider from "./ViewSlider";

export interface ViewSliderContextType {
    activeSlide: number;
    setActiveSlide: React.Dispatch<React.SetStateAction<number>>;
}
interface ViewSliderProviderProps {
    childSlidesContent: React.ReactNode[];
    mainSlide?: number;
}
export const ViewSliderContext: React.Context<ViewSliderContextType | undefined> = createContext<ViewSliderContextType | undefined>(undefined);

export function ViewSliderProvider({ childSlidesContent,mainSlide }: ViewSliderProviderProps){
    const [activeSlide, setActiveSlide] = React.useState<number>(0);
    return (
        <ViewSliderContext.Provider value={{activeSlide, setActiveSlide}}>
            <ViewSlider 
                childSlidesContent={childSlidesContent}
            />
        </ViewSliderContext.Provider>
    )
}
export const useViewSliderContext = (): ViewSliderContextType => {
    const context = React.useContext(ViewSliderContext);
    if (context === undefined) {
        throw new Error(
            'useViewSliderContext must be used within a ViewSliderProvider'
        );
    }
    return context;
}