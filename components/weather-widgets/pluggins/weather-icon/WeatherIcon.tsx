import style from './weather-icon.module.css';


interface WeatherIconProps {
    weatherName: string;
    size?: string; //lg, md, sm
    isSpecial?: boolean
}

const WeatherIcon: React.FC<WeatherIconProps> = ({weatherName, size, isSpecial}) => {
    const IconSVG = require(`./../../../../assets/svg/userProfile/weather_icon/${weatherName}.svg`).default;
    const dimension = () => {
        switch(size){
            case '2xl':
                return 56;
            case 'xl':
                return 48;
            case 'lg':
                return 32;
            case 'md':
                return 24;
            case 'sm':
                return 16;
            default:
                return 32;
        }
    }
    return (
        <div className={style['weather-icon'] + " " + (isSpecial ? style['special'] : '')}>
                <IconSVG width={dimension()} height={dimension()}/>
        </div>
    );
};

export default WeatherIcon;