import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WeatherVibe } from '../../../../types/Post';
import style from './weather-vibe-component.module.scss';
import { convertConditionToIconName } from '../../../../libs/weather';

interface WeatherVibeComponentProps {
    weatherVibe: WeatherVibe;
}
export default function WeatherVibeComponent(props: WeatherVibeComponentProps) {
    const { weatherVibe } = props;
    return(
        <div className={style['weather-vibe'] + " " + style[convertConditionToIconName(weatherVibe.icon)]}>
            <div className={style['weather-vibe__caption']}>
                {(weatherVibe.caption ? weatherVibe.caption : `Vibing ${weatherVibe.condition.replace('-',' ')}`) + ` in ${weatherVibe.location}`}
                <FontAwesomeIcon icon={convertConditionToIconName(weatherVibe.icon)} className={"icon ml-1 animate-bounce "+ style[convertConditionToIconName(weatherVibe.icon)]}/>
            </div>
        </div>
    )
}