import { useState } from "react"
import Slider from "../components/slider/Slider"
/* this page is for testing purposes only */
export default function Tester() {
    const [sliderValue, setSliderValue] = useState(1) // [value, setter
    const handleSliderChange = (value: number) => {
        setSliderValue(value)
    }
    return (
        <>
            <h1>Tester</h1>
            <Slider 
                min={0.5} 
                step={0.1} 
                max={4} 
                value={sliderValue} 
                defaultValue={1} 
                onSliderChange={handleSliderChange}
                thumbActiveClassName="btn-active"
            />
        </>
    )
}