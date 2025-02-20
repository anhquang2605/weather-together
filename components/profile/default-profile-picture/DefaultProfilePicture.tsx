import React from 'react';
import style from './default-profile-picture.module.css';
import {useEffect, useState} from 'react';
interface DefaultProfilePictureProps {
    username: string | null | undefined,
    size?: string,
    firstName?: string,
    lastName?: string
}

const DefaultProfilePicture: React.FC<DefaultProfilePictureProps> = ({username, size}) => {
    const [color, setColor] = useState<string>('');
    const randomizedColor = () => {
        const colors = [
            "#FFA5B4",  // Slightly saturated Pink (Pastel Red)
            "#FFB077",  // Slightly saturated Peach (Pastel Orange)
            "#FFD700",  // Slightly saturated Pale Yellow
            "#A6FFA6",  // Slightly saturated Mint (Pastel Green)
            "#8FCBFF",  // Slightly saturated Baby Blue (Pastel Blue)
            "#B3B3FF",  // Slightly saturated Periwinkle (Pastel Indigo)
            "#E3A8E3"   // Slightly saturated Lilac (Pastel Violet)
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    useEffect(() => {
        setColor(randomizedColor());
    },[])
    return (
        <div className={style['default-profile-picture'] + " " + style['text-'+size]} >
            {username?.substring(0, 2).toUpperCase()}
        </div>
    );
};

export default DefaultProfilePicture;