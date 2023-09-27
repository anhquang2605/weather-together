import React from 'react';
import style from './picture-interaction-panel.module.css';
import { UserInClient } from '../../../../types/User';

interface PictureInteractionPanelProps {
    pictureId: string;
    author: UserInClient;
}

const PictureInteractionPanel: React.FC<PictureInteractionPanelProps> = ({}) => {
    return (
        <div className={style['picture-interaction-panel.module.css']}>
            
        </div>
    );
};

export default PictureInteractionPanel;