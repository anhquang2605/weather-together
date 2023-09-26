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
            setPictures(data.data);
            setLoading(false);
        })

    }
    useEffect(()=>{
        handleFetchPictures();
    },[])
    return (
        <div className={style['attached-picutres']}>
            {
                pictures.map((picture, index) => {
                    return(
                        <PictureComponent 
                            key={index}
                            picture={picture}
                            alt=""
                            loading={loading}
                        />
                    )
                })
            }
        </div>
    );
};

export default AttachedPictures;