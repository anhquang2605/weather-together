import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WeatherVibe } from '../../../../types/Post';
import style from './weather-vibe-component.module.scss';
import { convertConditionToIconName } from '../../../../libs/weather';

interface WeatherVibeComponentProps {
    weatherVibe: WeatherVibe;
}
export default function WeatherVibeComponent(props: WeatherVibeComponentProps) {
    const { weatherVibe } = props;
    let { caption, icon, temperature, location } = weatherVibe;
    return(
        <div className={style['weather-vibe'] + " " + style[convertConditionToIconName(icon)]}>
            <div className={style['weather-vibe__caption']}>
                {(caption ? caption : `Vibing ${icon.replace('-',' ')}`) + (location && location !== ""  && ` in ${location}`)}
                <FontAwesomeIcon icon={convertConditionToIconName(icon)} className={"icon ml-1 animate-bounce "+ style[convertConditionToIconName(icon)]}/>
            </div>
        </div>
    )
}