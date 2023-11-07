import React, { useState } from 'react';
import style from './content-management.module.css';
import {IoEllipsisHorizontal} from 'react-icons/io5';
interface ContentManagementProps {

}

const ContentManagement: React.FC<ContentManagementProps> = ({}) => {
    const [reveal, setReveal] = useState<boolean>(false);
    return (
        <div className={style['content-management']}>
            <button className={style["control-reveal-btn"]}>
                <IoEllipsisHorizontal/>
            </button>
            <div className={`${style["control-list"]} ${reveal ? style['reveal'] : ""}`}>
                
            </div>
        </div>
    );
};

export default ContentManagement;