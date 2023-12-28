import React, { useEffect, useState } from 'react';
import style from './attached-pictures.module.css';
import { Picture } from '../../../../types/Picture';
import { set } from 'lodash';
import PictureComponent from '../../../embedded-view-components/picture-component/PictureComponent';

interface AttachedPicturesProps {
    targetId: string;
    uniqueString?: string;
}
interface DataFromPictureServer {
    data: Picture[]
}
const AttachedPictures: React.FC<AttachedPicturesProps> = (props:AttachedPicturesProps) => {
    const { targetId, uniqueString } = props;
    const [pictures, setPictures] = useState<Picture[]>([]); //TODO: fetch pictures from server
    const [loading, setLoading] = useState(false); //TODO: fetch pictures from server
    const [isFirstImageVertical, setIsFirstImageVertical] = useState(false); //TODO: fetch pictures from server
    const [isSecondImageVertical, setIsSecondImageVertical] = useState(false); //TODO: fetch pictures from server
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
                handleDertemineOrientation(data.data);
            
        })

    }
    const handleDertemineOrientation = (data:Picture[]) => {
        if(data && data.length > 0){
            if(data[0] && data[0].width && data[0].height){
                setIsFirstImageVertical(data[0].width < data[0].height);
            }

            if(data.length === 2){
                if(data[1] && data[1].width && data[1].height)
                {setIsSecondImageVertical(data[1].width < data[1].height)};
            }
            const picture = [...data];
            setPictures(picture);
            setLoading(false);
        }
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
        const len = pictures.length;
        for(let i = 1; i < len; i++){
            if(i === MAX_PICTURES - 1 && len > MAX_PICTURES){
                pictureJSX.push(
                   
                       
                        <PictureComponent
                            variant='freeStyle'
                            key={i}
                            picture={pictures[i]}
                            alt=""
                            loading={loading}
                            pictures={pictures}
                        >
                             <p className={style['extra-indicator']}>+{len - MAX_PICTURES}</p>
                        </PictureComponent>

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
    useEffect(()=> {
        if(uniqueString!=="" && targetId){
            handleFetchPictures();
        }
    },[uniqueString, targetId])
    useEffect(()=>{
        if(isFirstImageVertical !== isSecondImageVertical){
            setBothNotSameOrientation(true);
        }
    },[isFirstImageVertical, isSecondImageVertical])
    return (
        <div className={`${style['attached-pictures']} ${bothNotSameOrientation && pictures.length === 2 ? style['different-orientation'] : ""} ${pictures.length === 1 ? style['single'] : ""} ${pictures.length >= MAX_PICTURES ? style['crowded'] : ""}`}>
            <div className={`${style['pictures-frame']} ${isFirstImageVertical && style['vertical']}`}>
            {
                pictures.length >= 1 && <>
                    {firstPicture()}
                    {pictures.length > 1 && <div className={`${style['second-group']}`}>
                        {handleDisplayPictures()}
                    </div>}
                </>
            }
            </div>
           
        </div>
    );
};

export default AttachedPictures;