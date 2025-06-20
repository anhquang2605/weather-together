import React, { useRef } from 'react';
import style from './default-profile-picture.module.css';
import {useEffect, useState} from 'react';
import { fetchFromGetAPI } from '../../../libs/api-interactions';
import { get } from 'lodash';
interface DefaultProfilePictureProps {
    username: string | null | undefined,
    size?: string,
}

const DefaultProfilePicture: React.FC<DefaultProfilePictureProps> = ({username, size}) => {
    const [color, setColor] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [getingName, setGettingName] = useState<boolean>(false);
    const abreviationRef = useRef<string>('');
    const getNameOfUser = (username: string) => {
        setGettingName(true);
        const options = {
            username: username,
            getName: 'true'
        }
        const path = 'users';
        const result = fetchFromGetAPI(path, options);
        result.then(res => {
            setGettingName(false);
            if(res.success && res.data){
                setName(res.data);
            }
        })
    }
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
    const generateAbreviation = (name: string) => {
        const names = name.split(' ');
        for (let i = 0; i < names.length; i++) {
            names[i] = names[i][0].toUpperCase();
        }
        return names.join('');
    }
    useEffect(() => {
        setColor(randomizedColor());
    },[])
    useEffect(()=>{
        if(username && username.length > 0){
            getNameOfUser(username);
        }
    },[username])


    return (
        <div style={{
            backgroundColor: color
        }} className={style['default-profile-picture'] + " " + style['text-'+size] + (getingName ? ' ' + style['loading'] : '')} >
            { name && (name !== " ") ? generateAbreviation(name) :
               username?.substring(0, 2).toUpperCase()
            }
        </div>
    );
};

export default DefaultProfilePicture;