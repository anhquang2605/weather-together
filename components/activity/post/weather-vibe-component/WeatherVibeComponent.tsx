import { WeatherVibe } from '../../../../types/Post';
import style from './weather-vibe-component.module.css';

interface WeatherVibeComponentProps {
    weatherVibe: WeatherVibe;
}
export default function WeatherVibeComponent(props: WeatherVibeComponentProps) {
    const { weatherVibe } = props;
    return(
        <div className={style['weather-vibe']}>
            <div className={style['weather-vibe__caption']}>
                {(weatherVibe.caption ? weatherVibe.caption : `Feeling the ${weatherVibe.condition.replace('-',' ')} vibe`) + ` in ${weatherVibe.location}`}
            </div>
        </div>
    )
}