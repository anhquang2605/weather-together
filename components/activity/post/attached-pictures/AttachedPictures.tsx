import React, { useEffect, useState } from 'react';
import style from './attached-pictures.module.css';
import { Picture } from '../../../../types/Picture';
import { set } from 'lodash';
import PictureComponent from '../../../embedded-view-components/picture-component/PictureComponent';

interface AttachedPicturesProps {
    targetId: string;
}

const AttachedPictures: React.FC<AttachedPicturesProps> = (props:AttachedPicturesProps) => {
    const { targetId } = props;
    const [pictures, setPictures] = useState<Picture[]>([]); //TODO: fetch pictures from server
    const [loading, setLoading] = useState(false); //TODO: fetch pictures from server
    const [isFirstImageVertical, setIsFirstImageVertical] = useState(true); //TODO: fetch pictures from server
    const [isSecondImageVertical, setIsSecondImageVertical] = useState(true); //TODO: fetch pictures from server
    const [bothNotSameOrientation, setBothNotSameOrientation] = useState(false); //TODO: fetch pictures from server
    const [isOverloaded, setIsOverloaded] = useState(false);
    const MAX_PICTURES = 4;
    const handleFetchPictures = () => {
        setLoading(true);
        const path = '/api/pictures';
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        const params = {
            targetId,
            many: 'true'
        }
        const url = path + '?' + new URLSearchParams(params).toString();
        fetch(url, options).then(res => 
            {if (res.ok) return res.json()}).then(data => {
            //setIsFirstImageVertical(data.data[0].width < data.data[0].height);
            if(data.data.length === 2){
                //setIsSecondImageVertical(data.data[1].width < data.data[1].height);
            }
            setPictures([...data.data,data.data[0]]);
            setLoading(false);
        })

    }
    const firstPicture = () => {
        return (
            <PictureComponent
                variant='freeStyle'
                picture={pictures[0]}
                alt=""
                loading={loading}
                pictures={pictures}
            />
        )
    }
    const handleDisplayPictures = () => {
        const pictureJSX: JSX.Element[] = [];
        for(let i = 1; i < pictures.length; i++){
            if(i === MAX_PICTURES - 1 && pictures.length > MAX_PICTURES){
                setIsOverloaded(true);
                pictureJSX.push(
                    <div className={style['overloaded']} key={i}>
                        <p>+{pictures.length - MAX_PICTURES}</p>
                        <PictureComponent
                            variant='freeStyle'
                            key={i}
                            picture={pictures[i]}
                            alt=""
                            loading={loading}
                            pictures={pictures}
                        />
                    </div>
                )
                break;
            }else{
                pictureJSX.push(
                    <PictureComponent
                        variant='freeStyle'
                        key={i}
                        picture={pictures[i]}
                        alt=""
                        loading={loading}
                        pictures={pictures}
                    />
                )
            }
        }
        return pictureJSX;
    }
    useEffect(()=>{
        handleFetchPictures();
    },[])
    useEffect(()=>{
        if(isFirstImageVertical !== isSecondImageVertical){
            setBothNotSameOrientation(true);
        }
    },[isFirstImageVertical, isSecondImageVertical])
    return (
        <div className={`${style['attached-pictures']} ${bothNotSameOrientation && style['different-orientation']}`}>
            <div className={`${style['pictures-frame']} ${isFirstImageVertical && style['vertical']}`}>
            {
                pictures && <>
                    {firstPicture()}
                    <div className={`${style['second-group']}`}>
                        {handleDisplayPictures()}
                    </div>
                </>
            }
            </div>
           
        </div>
    );
};

export default AttachedPictures;