import style from './find-friends.module.css'
import {IoSearch} from 'react-icons/io5'
export default function FindFriends() {
    return (
        <div className={style['find-friends']}>
            <IoSearch className={"icon"}/>
            <div className={style['search-bar']}>
                <input type="text" className={style['search-input']} placeholder="Search for friends"/>
            </div>
        </div>
    )
}