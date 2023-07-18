import { useState } from 'react';
import style from './check-box.module.css'
import {IoCheckmark} from 'react-icons/io5'
interface CheckBoxProps {
    label: string;
    handleChecked: (value: boolean) => void;
}
//Need react icons
export default function CheckBox({label, handleChecked}: CheckBoxProps) {
    const [checked, setChecked] = useState<boolean>(false);
    const handleCheck = () => {
        setChecked(prevState => {
            const status = !prevState
            handleChecked(status);
            return status;
        });
    }
    return(
        <div className={style['check-box']} onClick={handleCheck}>
            <div id={style['check-input']} className={checked ? style["checked-box"] : ""}>
                {checked && <IoCheckmark className={style['checkmark']}/>}
            </div>
            <span className={style["check-label"]}>
                {label}
            </span>
        </div>
    )
}