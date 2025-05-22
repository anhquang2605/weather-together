import { useState } from 'react';
import style from './check-box.module.css'
import {IoCheckmark} from 'react-icons/io5'
interface CheckBoxProps {
    label: string;
    labelJSX?: React.ReactNode;
    handleChecked: (value: boolean, label: string) => void;
    returnLabel?: boolean;
}
//Need react icons
export default function CheckBox({label, handleChecked, returnLabel, labelJSX}: CheckBoxProps) {
    const [checked, setChecked] = useState<boolean>(false);
    const handleCheck = () => {
        setChecked(prevState => {
            const status = !prevState;
            handleChecked(status, label);
            return status;
        });
    }
    return(
        <div className={style['check-box']} onClick={handleCheck}>
            <div id={style['check-input']} className={checked ? style["checked-box"] : ""}>
                {checked && <IoCheckmark className={style['checkmark']}/>}
            </div>
            <span className={style["check-label"]}>
                {labelJSX && labelJSX}  {label}
            </span>
        </div>
    )
}