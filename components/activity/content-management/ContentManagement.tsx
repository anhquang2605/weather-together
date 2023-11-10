import React, { useState } from 'react';
import style from './content-management.module.css';
import {IoEllipsisHorizontal} from 'react-icons/io5';
import ControlOption from './control-option/ControlOption';
export interface ManagementItem{
    type: string; //edit, delete, save.... for title and icons
    handler: () => void; //handler function in a form of higher order function
    description?: string; //description for the item
}

interface ContentManagementProps {
    items: ManagementItem[];
}

const ContentManagement: React.FC<ContentManagementProps> = ({
    items
}) => {
    const [reveal, setReveal] = useState<boolean>(false);
    return (
        <div className={style['content-management']}>
            <button className={style["control-reveal-btn"]}>
                <IoEllipsisHorizontal/>
            </button>
            <div className={`${style["control-list"]} ${reveal ? style['reveal'] : ""}`}>
                {
                    items.map((item, index) => {
                        const {type, handler, description} = item;
                        return(
                            <ControlOption
                                key={index}
                                title={type}
                                description={description}
                                onClick={handler}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ContentManagement;