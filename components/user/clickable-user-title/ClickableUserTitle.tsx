import React from 'react';
import style from './clickable-user-title.module.css';
import { useRouter } from 'next/router';

interface ClickableUserTitleProps {
    username: string;
    name: string;
}

const ClickableUserTitle: React.FC<ClickableUserTitleProps> = ({
    username,
    name,
}) => {
    const router = useRouter();
    const goToUserHub = () => {
        router.push(`/userprofile/${username}`);
    }
    return (
        <div title="View Hub" onClick={goToUserHub} className={style['clickable-user-title']}>
            {
                name ? 
                    name
                     : 
                    username
            }
        </div>
    );
};

export default ClickableUserTitle;